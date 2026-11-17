import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { consultarFotosUnsplash } from "./unsplashService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TOKENS_PATH = path.join(__dirname, "google_tokens.json");
const ENV_PATH = path.resolve(__dirname, "..", ".env");

function cargarVariablesEntorno() {
  const vars = {
    GOOGLE_CLIENT_ID: "",
    GOOGLE_CLIENT_SECRET: "",
    GOOGLE_REFRESH_TOKEN: "",
    GOOGLE_REDIRECT_URI: "http://localhost:5173/api/google/oauth2callback",
    GOOGLE_CALENDAR_ID: "primary",
    GEMINI_API_KEY: "",
    GEMINI_MODEL: "gemini-3.8-flash",
    UNSPLASH_ACCESS_KEY: "",
    UNSPLASH_SECRET_KEY: "",
    ...process.env,
  };
  try {
    if (fs.existsSync(ENV_PATH)) {
      const lineas = fs.readFileSync(ENV_PATH, "utf-8").split(/\r?\n/);
      for (const linea of lineas) {
        const limpia = linea.trim();
        if (!limpia || limpia.startsWith("#")) continue;
        const idx = limpia.indexOf("=");
        if (idx > 0) {
          const clave = limpia.slice(0, idx).trim();
          const valor = limpia.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
          if (clave && valor !== "") {
            vars[clave] = valor;
          }
        }
      }
    }
  } catch {
    return vars;
  }
  return vars;
}

function leerTokensGoogle() {
  try {
    if (fs.existsSync(TOKENS_PATH)) {
      return JSON.parse(fs.readFileSync(TOKENS_PATH, "utf-8"));
    }
  } catch {
    return {};
  }
  return {};
}

function guardarTokensGoogle(tokens) {
  try {
    const previos = leerTokensGoogle();
    fs.writeFileSync(
      TOKENS_PATH,
      JSON.stringify(
        { ...previos, ...tokens, actualizadoEn: new Date().toISOString() },
        null,
        2
      ),
      "utf-8"
    );
  } catch {
    return;
  }
}

function aMinutos(hora24) {
  const [h, m] = String(hora24 || "00:00").split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

function construirRangoISOColombia(fechaStr, hora24, duracionMinutos) {
  const inicioMin = aMinutos(hora24);
  const finMinTotal = inicioMin + (parseInt(duracionMinutos, 10) || 75);
  const pad = (n) => String(n).padStart(2, "0");

  const hIni = Math.floor(inicioMin / 60);
  const mIni = inicioMin % 60;
  const hFin = Math.floor(finMinTotal / 60) % 24;
  const mFin = finMinTotal % 60;

  return {
    startDateTime: `${fechaStr}T${pad(hIni)}:${pad(mIni)}:00-05:00`,
    endDateTime: `${fechaStr}T${pad(hFin)}:${pad(mFin)}:00-05:00`,
  };
}

async function obtenerAccessTokenGoogle() {
  const env = cargarVariablesEntorno();
  const tokensGuardados = leerTokensGoogle();

  if (env.GOOGLE_ACCESS_TOKEN) {
    return {
      token: env.GOOGLE_ACCESS_TOKEN,
      calendarId: env.GOOGLE_CALENDAR_ID || "primary",
    };
  }

  const clientId = env.GOOGLE_CLIENT_ID || "";
  const clientSecret = env.GOOGLE_CLIENT_SECRET || "";
  const refreshToken =
    tokensGuardados.refresh_token || env.GOOGLE_REFRESH_TOKEN || "";
  const calendarId = env.GOOGLE_CALENDAR_ID || "primary";

  if (!clientId || !clientSecret || !refreshToken) {
    return null;
  }

  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });

  const respuesta = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!respuesta.ok) {
    const detalleError = await respuesta.text();
    throw new Error(
      `Error al renovar token OAuth de Google Calendar: ${detalleError}`
    );
  }

  const data = await respuesta.json();
  if (data.access_token) {
    guardarTokensGoogle({ access_token: data.access_token });
  }

  return {
    token: data.access_token,
    calendarId,
  };
}

async function crearEventoEnGoogleCalendar(reserva) {
  try {
    const auth = await obtenerAccessTokenGoogle();
    if (!auth || !auth.token) {
      return {
        sincronizado: false,
        estado: "pendiente_config",
        eventId: "",
        error: "Credenciales de Google Calendar pendientes de configurar en .env",
      };
    }

    const { startDateTime, endDateTime } = construirRangoISOColombia(
      reserva.fecha,
      reserva.hora,
      reserva.duracionMinutos
    );

    const lineasDescripcion = [
      `Código único de reserva (Ticket): ${reserva.ticket}`,
      `Clienta: ${reserva.nombreClienta}`,
      `Teléfono / WhatsApp: ${reserva.telefonoClienta}`,
      `Correo: ${reserva.correoClienta || "No especificado"}`,
      `Servicio: ${reserva.servicioNombre} (${reserva.precio})`,
      `Duración estimada: ${reserva.duracionTexto}`,
      `Especialista asignada: ${reserva.especialistaNombre}`,
      reserva.notas ? `Notas adicionales: ${reserva.notas}` : "",
    ].filter(Boolean);

    const payloadEvento = {
      summary: `Cita Lumière Studio · ${reserva.servicioNombre} - ${reserva.nombreClienta} [${reserva.ticket}]`,
      location:
        "Lumière Studio, Cll 57 #17C-29, Barrio Villa Carolina, Neiva, Huila",
      description: lineasDescripcion.join("\n"),
      start: {
        dateTime: startDateTime,
        timeZone: "America/Bogota",
      },
      end: {
        dateTime: endDateTime,
        timeZone: "America/Bogota",
      },
      extendedProperties: {
        private: {
          ticket: reserva.ticket,
          reservaId: reserva.id || "",
        },
      },
    };

    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      auth.calendarId
    )}/events`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${auth.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payloadEvento),
    });

    if (!res.ok) {
      const errTxt = await res.text();
      return {
        sincronizado: false,
        estado: "error_sincronizacion",
        eventId: "",
        error: `Google Calendar API (${res.status}): ${errTxt.slice(0, 180)}`,
      };
    }

    const eventoCreado = await res.json();
    return {
      sincronizado: true,
      estado: "sincronizado",
      eventId: eventoCreado.id || "",
      error: "",
    };
  } catch (err) {
    return {
      sincronizado: false,
      estado: "error_sincronizacion",
      eventId: "",
      error: err.message || "Error al conectar con Google Calendar API",
    };
  }
}

async function cancelarEventoEnGoogleCalendar(googleEventId) {
  try {
    if (!googleEventId) {
      return {
        actualizado: false,
        estado: "sin_evento_previo",
        detalle: "La reserva no tenía un ID de evento activo en Google Calendar.",
      };
    }

    const auth = await obtenerAccessTokenGoogle();
    if (!auth || !auth.token) {
      return {
        actualizado: false,
        estado: "pendiente_config",
        detalle: "Credenciales de Google Calendar no configuradas.",
      };
    }

    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      auth.calendarId
    )}/events/${encodeURIComponent(googleEventId)}`;

    const resDelete = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });

    if (resDelete.ok || resDelete.status === 204 || resDelete.status === 410) {
      return {
        actualizado: true,
        estado: "cancelado_en_google",
        detalle: "Evento eliminado correctamente en Google Calendar.",
      };
    }

    const errTxt = await resDelete.text();
    return {
      actualizado: false,
      estado: "error_sincronizacion",
      detalle: `No se pudo cancelar el evento en Google Calendar: ${errTxt.slice(0, 160)}`,
    };
  } catch (err) {
    return {
      actualizado: false,
      estado: "error_sincronizacion",
      detalle: err.message || "Error al cancelar evento en Google Calendar.",
    };
  }
}

function leerBodyJson(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1e6) {
        reject(new Error("Payload demasiado grande"));
      }
    });
    req.on("end", () => {
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error("JSON inválido"));
      }
    });
    req.on("error", reject);
  });
}

function enviarJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

function faltanAlMenos12HorasColombiaBackend(fechaCita, horaCita) {
  if (!fechaCita || !horaCita) return false;
  const ahora = new Date();
  const partes = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Bogota",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(ahora);

  const mapa = {};
  for (const p of partes) {
    mapa[p.type] = p.value;
  }
  const fechaHoy = `${mapa.year}-${mapa.month}-${mapa.day}`;
  const horaNum = parseInt(mapa.hour === "24" ? "00" : mapa.hour, 10);
  const minNum = parseInt(mapa.minute, 10);
  const horaActualTexto = `${String(horaNum).padStart(2, "0")}:${String(minNum).padStart(2, "0")}`;

  const inicioCitaMs = new Date(`${fechaCita}T${horaCita}:00-05:00`).getTime();
  const ahoraColMs = new Date(`${fechaHoy}T${horaActualTexto}:00-05:00`).getTime();
  if (Number.isNaN(inicioCitaMs) || Number.isNaN(ahoraColMs)) return false;
  const diferenciaMinutos = (inicioCitaMs - ahoraColMs) / (1000 * 60);
  return diferenciaMinutos >= 12 * 60;
}

async function responderConGemini(sistema, mensajes) {
  const env = cargarVariablesEntorno();
  const apiKey = env.GEMINI_API_KEY || "";
  const historial = (Array.isArray(mensajes) ? mensajes : []).slice(-8);

  if (apiKey) {
    const modelo = env.GEMINI_MODEL || "gemini-3.8-flash";
    const contenido = historial.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: String(m.content || "").slice(0, 1500) }],
    }));

    const controladorGem = new AbortController();
    const timerGem = setTimeout(() => controladorGem.abort(), 12000);
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelo)}:generateContent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: String(sistema || "").slice(0, 6000) }],
            },
            contents: contenido,
            generationConfig: { temperature: 0.6, maxOutputTokens: 420 },
          }),
          signal: controladorGem.signal,
        }
      );
      if (res.ok) {
        const data = await res.json();
        const texto = data?.candidates?.[0]?.content?.parts
          ?.map((p) => p.text || "")
          .join("")
          .trim();
        if (texto) {
          return { ok: true, status: 200, texto };
        }
      }
    } catch {
      clearTimeout(timerGem);
    } finally {
      clearTimeout(timerGem);
    }
  }

  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), 14000);
  try {
    const mensajesOpenAI = [
      { role: "system", content: String(sistema || "").slice(0, 6000) },
      ...historial.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: String(m.content || "").slice(0, 1500),
      })),
    ];

    const resOpenAI = await fetch("https://text.pollinations.ai/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai",
        messages: mensajesOpenAI,
        temperature: 0.6,
      }),
      signal: controlador.signal,
    });

    if (!resOpenAI.ok) {
      const detalle = await resOpenAI.text();
      return { ok: false, status: 502, error: detalle.slice(0, 200) };
    }

    const dataOpenAI = await resOpenAI.json();
    const texto = String(
      dataOpenAI?.choices?.[0]?.message?.content || ""
    ).trim();

    if (!texto) {
      return { ok: false, status: 502, error: "Respuesta vacía de la IA." };
    }

    return { ok: true, status: 200, texto };
  } catch (err) {
    return {
      ok: false,
      status: 504,
      error: err.message || "Fallo al contactar el asistente de IA.",
    };
  } finally {
    clearTimeout(temporizador);
  }
}

function crearMiddlewareApi() {
  return async (req, res, next) => {
    if (!req.url || !req.url.startsWith("/api/")) {
      return next();
    }

    const urlObj = new URL(req.url, "http://localhost");
    const pathname = urlObj.pathname;
    const metodo = req.method || "GET";

    try {
      if (
        metodo === "GET" &&
        (pathname === "/api/inspiracion/fotos" ||
          pathname === "/api/inspiracion/buscar" ||
          pathname === "/api/inspiracion/unsplash")
      ) {
        const env = cargarVariablesEntorno();
        const query = urlObj.searchParams.get("query") || "";
        const categoria = urlObj.searchParams.get("categoria") || "todas";
        const page = parseInt(urlObj.searchParams.get("page") || "1", 10) || 1;
        const perPage =
          parseInt(urlObj.searchParams.get("per_page") || "12", 10) || 12;

        if (pathname === "/api/inspiracion/buscar" && !query.trim() && categoria === "todas") {
          return enviarJson(res, 400, {
            ok: false,
            error: "Por favor escribe un término de búsqueda o selecciona una categoría.",
          });
        }

        const respuestaUnsplash = await consultarFotosUnsplash({
          accessKey: env.UNSPLASH_ACCESS_KEY || "",
          query,
          categoria,
          page,
          perPage,
        });

        return enviarJson(res, 200, respuestaUnsplash);
      }

      if (metodo === "POST" && pathname === "/api/chat") {
        const body = await leerBodyJson(req);
        const r = await responderConGemini(body.sistema, body.mensajes);
        if (!r.ok) {
          return enviarJson(res, r.status, { ok: false, error: r.error });
        }
        return enviarJson(res, 200, { ok: true, texto: r.texto });
      }

      if (metodo === "POST" && pathname === "/api/reservas/validar-cancelacion") {
        const body = await leerBodyJson(req);
        if (body.estadoActual === "cancelada") {
          return enviarJson(res, 400, {
            ok: false,
            error: "Esta reserva ya fue cancelada anteriormente.",
          });
        }
        if (body.estadoActual === "realizada") {
          return enviarJson(res, 400, {
            ok: false,
            error: "No se permite cancelar una cita que ya ha sido realizada.",
          });
        }
        if (!faltanAlMenos12HorasColombiaBackend(body.fecha, body.hora)) {
          return enviarJson(res, 400, {
            ok: false,
            error:
              "No es posible cancelar esta cita porque faltan menos de 12 horas para la fecha y hora programadas. Las cancelaciones requieren un mínimo de 12 horas de anticipación.",
          });
        }
        return enviarJson(res, 200, { ok: true });
      }

      if (metodo === "POST" && pathname === "/api/admin/validar-estado") {
        const body = await leerBodyJson(req);
        if (body.pin !== "LUMIERE2026") {
          return enviarJson(res, 401, {
            ok: false,
            error: "Clave de autorización administrativa inválida.",
          });
        }
        if (body.estadoActual === "cancelada" && body.nuevoEstado === "realizada") {
          return enviarJson(res, 400, {
            ok: false,
            error:
              "Una cita cuyo estado es 'Cancelada' no puede marcarse como 'Realizada'.",
          });
        }
        return enviarJson(res, 200, { ok: true });
      }

      if (metodo === "POST" && pathname === "/api/google/crear-evento") {
        const reserva = await leerBodyJson(req);
        const resultado = await crearEventoEnGoogleCalendar(reserva);
        return enviarJson(res, 200, {
          ok: true,
          ...resultado,
        });
      }

      if (metodo === "POST" && pathname === "/api/google/cancelar-evento") {
        const body = await leerBodyJson(req);
        if (
          body.origen === "cliente" &&
          body.fecha &&
          body.hora &&
          !faltanAlMenos12HorasColombiaBackend(body.fecha, body.hora)
        ) {
          return enviarJson(res, 400, {
            ok: false,
            error:
              "No es posible cancelar esta cita porque faltan menos de 12 horas para la fecha y hora programadas.",
          });
        }
        const resultado = await cancelarEventoEnGoogleCalendar(
          body.googleEventId
        );
        return enviarJson(res, 200, {
          ok: true,
          ...resultado,
        });
      }

      return enviarJson(res, 404, {
        ok: false,
        error: "Ruta de API no encontrada.",
      });
    } catch (err) {
      return enviarJson(res, 500, {
        ok: false,
        error: err.message || "Error interno del servidor.",
      });
    }
  };
}

export function lumiereApiPlugin() {
  const middleware = crearMiddlewareApi();
  return {
    name: "lumiere-studio-backend-api",
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
  };
}
