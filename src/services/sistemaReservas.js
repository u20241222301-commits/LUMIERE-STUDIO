import {
  clientReviews,
  initialSpecialists,
  studioInfo,
} from "../data/homeData";
import {
  enviarCorreoCancelacionReserva,
  enviarCorreoConfirmacionReserva,
} from "./emailService";

export const REGEX_TICKET = /^[A-Z]{3}[0-9]{3}$/;

export const HORARIOS_SEMANA = [
  "09:00",
  "10:30",
  "12:00",
  "14:00",
  "15:30",
  "17:00",
  "18:30",
];

export const HORARIOS_DOMINGO_FESTIVO = [
  "10:00",
  "11:30",
  "13:30",
  "15:00",
];

const PREFIJO_COOKIE_RESERVAS = "lumiere_reservas";
const PREFIJO_COOKIE_RESENAS = "lumiere_resenas";
const COOKIE_ULTIMO_TICKET = "lumiere_ultimo_ticket";
const COOKIE_TICKETS_RECIENTES = "lumiere_tickets_recientes";
const MAX_AGE_COOKIES = 60 * 60 * 24 * 30;
const TAMANO_CHUNK_COOKIE = 2600;

let ventanaConsultaLocal = { conteo: 0, inicio: 0, bloqueadoHasta: 0 };

function leerCookieSimple(nombreBuscado) {
  if (typeof document === "undefined") return "";
  const pares = document.cookie ? document.cookie.split("; ") : [];
  for (const par of pares) {
    const idx = par.indexOf("=");
    if (idx > 0) {
      const nombre = par.slice(0, idx);
      const valor = par.slice(idx + 1);
      if (nombre === nombreBuscado) {
        return decodeURIComponent(valor);
      }
    }
  }
  return "";
}

function escribirCookieSimple(nombre, valor, maxAge = MAX_AGE_COOKIES) {
  if (typeof document === "undefined") return;
  document.cookie = `${nombre}=${encodeURIComponent(valor)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function guardarDatosEnCookies(prefijo, datos) {
  if (typeof document === "undefined") return;
  try {
    const json = JSON.stringify(datos);
    const totalChunksPrevios = parseInt(leerCookieSimple(`${prefijo}_count`) || "0", 10);
    const chunks = [];
    for (let i = 0; i < json.length; i += TAMANO_CHUNK_COOKIE) {
      chunks.push(json.slice(i, i + TAMANO_CHUNK_COOKIE));
    }

    escribirCookieSimple(`${prefijo}_count`, String(chunks.length));
    for (let idx = 0; idx < chunks.length; idx++) {
      escribirCookieSimple(`${prefijo}_${idx}`, chunks[idx]);
    }
    for (let idx = chunks.length; idx < totalChunksPrevios; idx++) {
      escribirCookieSimple(`${prefijo}_${idx}`, "", 0);
    }
  } catch {
    return;
  }
}

function leerDatosDeCookies(prefijo) {
  if (typeof document === "undefined") return null;
  try {
    const totalChunks = parseInt(leerCookieSimple(`${prefijo}_count`) || "0", 10);
    if (!totalChunks || totalChunks <= 0) return null;

    let reconstruido = "";
    for (let idx = 0; idx < totalChunks; idx++) {
      reconstruido += leerCookieSimple(`${prefijo}_${idx}`);
    }
    if (!reconstruido) return null;
    return JSON.parse(reconstruido);
  } catch {
    return null;
  }
}

export function obtenerAhoraColombia() {
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

  return {
    fechaHoy,
    minutosActuales: horaNum * 60 + minNum,
    horaActualTexto: `${String(horaNum).padStart(2, "0")}:${String(minNum).padStart(2, "0")}`,
  };
}

export function aMinutos(hora24) {
  const [h, m] = String(hora24 || "00:00").split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

export function formatearHora12(hora24) {
  const [hStr, mStr] = String(hora24 || "00:00").split(":");
  const h = parseInt(hStr, 10);
  const sufijo = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${String(h12).padStart(2, "0")}:${mStr} ${sufijo}`;
}

export function extraerMinutosDuracion(textoDuracion) {
  const coincidencia = String(textoDuracion || "").match(/\d+/);
  return coincidencia ? parseInt(coincidencia[0], 10) : 75;
}

export const HORAS_MINIMAS_CANCELACION = 12;

export function citaYaPasoColombia(fechaCita, horaCita) {
  const { fechaHoy, minutosActuales } = obtenerAhoraColombia();
  if (fechaCita < fechaHoy) return true;
  if (fechaCita > fechaHoy) return false;
  return aMinutos(horaCita) <= minutosActuales;
}

export function faltanAlMenos12HorasColombia(fechaCita, horaCita) {
  if (!fechaCita || !horaCita) return false;
  const { fechaHoy, horaActualTexto } = obtenerAhoraColombia();
  const inicioCitaMs = new Date(`${fechaCita}T${horaCita}:00-05:00`).getTime();
  const ahoraColMs = new Date(`${fechaHoy}T${horaActualTexto}:00-05:00`).getTime();
  if (Number.isNaN(inicioCitaMs) || Number.isNaN(ahoraColMs)) return false;
  const diferenciaMinutos = (inicioCitaMs - ahoraColMs) / (1000 * 60);
  return diferenciaMinutos >= HORAS_MINIMAS_CANCELACION * 60;
}

export function hayCruceDeHorario(
  reservasExistentes,
  fecha,
  especialistaId,
  horaInicio,
  duracionMinutos
) {
  const inicioNueva = aMinutos(horaInicio);
  const finNueva = inicioNueva + (Number(duracionMinutos) || 75);

  return reservasExistentes.some((r) => {
    if (r.estado === "cancelada") return false;
    if (r.fecha !== fecha || r.especialistaId !== especialistaId) return false;
    const inicioExistente = aMinutos(r.hora);
    const finExistente = inicioExistente + (Number(r.duracionMinutos) || 75);
    return inicioNueva < finExistente && finNueva > inicioExistente;
  });
}

export function normalizarEntradaTicket(valor) {
  return String(valor || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 6);
}

export function validarFormatoTicket(codigo) {
  const limpio = String(codigo || "").toUpperCase().trim();
  if (!limpio) {
    return {
      valido: false,
      mensaje: "Por favor ingresa tu código de reserva (3 letras y 3 números, ej: LUX193).",
    };
  }
  if (limpio.length < 6) {
    return {
      valido: false,
      mensaje: "El código está incompleto. Debe tener exactamente 6 caracteres: 3 letras mayúsculas y 3 números.",
    };
  }
  if (!REGEX_TICKET.test(limpio)) {
    return {
      valido: false,
      mensaje: "Formato incorrecto. El código debe contener exactamente 3 letras mayúsculas seguidas de 3 números (ejemplo: NAI482).",
    };
  }
  return { valido: true, codigo: limpio };
}

export function guardarCookieTicket(ticket) {
  const limpio = normalizarEntradaTicket(ticket);
  if (!REGEX_TICKET.test(limpio) || typeof document === "undefined") return;

  escribirCookieSimple(COOKIE_ULTIMO_TICKET, limpio);

  const actuales = obtenerTicketsRecientesCookie();
  const actualizados = [limpio, ...actuales.filter((t) => t !== limpio)].slice(0, 5);
  escribirCookieSimple(COOKIE_TICKETS_RECIENTES, actualizados.join(","));
}

export function obtenerUltimoTicketCookie() {
  const valor = leerCookieSimple(COOKIE_ULTIMO_TICKET).toUpperCase();
  if (valor === "LUX193") {
    escribirCookieSimple(COOKIE_ULTIMO_TICKET, "", 0);
    return "";
  }
  return REGEX_TICKET.test(valor) ? valor : "";
}

export function obtenerTicketsRecientesCookie() {
  const valor = leerCookieSimple(COOKIE_TICKETS_RECIENTES);
  if (!valor) return [];
  const lista = valor
    .split(",")
    .map((t) => t.trim().toUpperCase())
    .filter((t) => REGEX_TICKET.test(t) && t !== "LUX193");
  return lista;
}

function leerReservasCookies() {
  const guardadas = leerDatosDeCookies(PREFIJO_COOKIE_RESERVAS);
  if (Array.isArray(guardadas)) {
    const sinLux = guardadas.filter(
      (r) => String(r.ticket || "").toUpperCase() !== "LUX193"
    );
    if (sinLux.length !== guardadas.length) {
      guardarReservasCookies(sinLux);
    }
    return sinLux;
  }
  return [];
}

function guardarReservasCookies(lista) {
  guardarDatosEnCookies(PREFIJO_COOKIE_RESERVAS, lista);
}

function leerResenasCookies() {
  const guardadas = leerDatosDeCookies(PREFIJO_COOKIE_RESENAS);
  if (Array.isArray(guardadas) && guardadas.length > 0) {
    return guardadas;
  }
  guardarResenasCookies(clientReviews);
  return clientReviews;
}

function guardarResenasCookies(lista) {
  guardarDatosEnCookies(PREFIJO_COOKIE_RESENAS, lista);
}

export function obtenerDetalleTicketsRecientes() {
  const codigosCookie = obtenerTicketsRecientesCookie();
  const reservasCookie = leerReservasCookies();
  const codigosCombinados = [
    ...codigosCookie,
    ...reservasCookie.map((r) => String(r.ticket || "").toUpperCase()),
  ].filter((t, idx, arr) => REGEX_TICKET.test(t) && arr.indexOf(t) === idx);

  return codigosCombinados.slice(0, 5).map((codigo) => {
    const encontrada = reservasCookie.find(
      (r) => String(r.ticket || "").toUpperCase() === codigo
    );
    if (encontrada) {
      return {
        ticket: codigo,
        servicioNombre: encontrada.servicioNombre,
        especialistaNombre: encontrada.especialistaNombre,
        fecha: encontrada.fecha,
        horaFormateada:
          encontrada.horaFormateada || formatearHora12(encontrada.hora),
        precio: encontrada.precio,
        estado: encontrada.estado || "confirmada",
      };
    }
    return {
      ticket: codigo,
      servicioNombre: "Cita registrada en Lumière Studio",
      especialistaNombre: "Especialista asignada",
      fecha: "",
      horaFormateada: "",
      precio: "",
      estado: "confirmada",
    };
  });
}

function generarTicketUnicoCookie(reservasExistentes) {
  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const prefijosSalon = ["LUM", "NAI", "SPA", "ROS", "LUX", "GLW", "CHR", "VIP"];
  const usados = new Set(
    reservasExistentes.map((r) => String(r.ticket || "").toUpperCase())
  );

  for (let i = 0; i < 500; i++) {
    const prefijo =
      i < 20 && Math.random() < 0.65
        ? prefijosSalon[Math.floor(Math.random() * prefijosSalon.length)]
        : letras[Math.floor(Math.random() * letras.length)] +
          letras[Math.floor(Math.random() * letras.length)] +
          letras[Math.floor(Math.random() * letras.length)];
    const num = Math.floor(100 + Math.random() * 900);
    const candidato = `${prefijo}${num}`;
    if (REGEX_TICKET.test(candidato) && !usados.has(candidato)) {
      return candidato;
    }
  }
  return `LUM${Math.floor(100 + Math.random() * 900)}`;
}

function enriquecerReservaPublica(reserva, resenas) {
  const resenaAsociada = resenas.find(
    (rev) =>
      rev.reservaId === reserva.id ||
      String(rev.ticket).toUpperCase() === String(reserva.ticket).toUpperCase()
  );
  const yaPaso = citaYaPasoColombia(reserva.fecha, reserva.hora);
  const cumpleTiempoCancelacion =
    !yaPaso && faltanAlMenos12HorasColombia(reserva.fecha, reserva.hora);
  const puedeCancelar =
    reserva.estado !== "cancelada" &&
    reserva.estado !== "realizada" &&
    !yaPaso &&
    cumpleTiempoCancelacion;
  const bloqueadaPor12Horas =
    reserva.estado !== "cancelada" &&
    reserva.estado !== "realizada" &&
    !yaPaso &&
    !cumpleTiempoCancelacion;
  const puedeResenar =
    reserva.estado === "realizada" &&
    !resenaAsociada;

  return {
    ...reserva,
    horaFormateada: reserva.horaFormateada || formatearHora12(reserva.hora),
    yaPaso,
    cumpleTiempoCancelacion,
    bloqueadaPor12Horas,
    puedeCancelar,
    puedeResenar,
    resena: resenaAsociada || null,
  };
}

export async function obtenerEspecialistasSistema() {
  return initialSpecialists;
}

export async function obtenerResenasSistema() {
  return leerResenasCookies();
}

export async function consultarDisponibilidadHoraria({
  fecha,
  especialistaId,
  duracionMinutos,
  esFestivo,
}) {
  const { fechaHoy, minutosActuales } = obtenerAhoraColombia();
  if (!fecha || fecha < fechaHoy) {
    return {
      ok: true,
      fechaPasada: true,
      horarios: [],
      ahoraColombia: { fechaHoy, minutosActuales },
    };
  }

  const diaSemana = new Date(`${fecha}T12:00:00-05:00`).getUTCDay();
  const esDomingoOFestivo = diaSemana === 0 || Boolean(esFestivo);
  const baseHorarios = esDomingoOFestivo ? HORARIOS_DOMINGO_FESTIVO : HORARIOS_SEMANA;
  const reservasCookie = leerReservasCookies();

  const horarios = baseHorarios
    .filter((h24) => {
      if (fecha === fechaHoy) {
        return aMinutos(h24) > minutosActuales;
      }
      return true;
    })
    .map((h24) => {
      const ocupado = hayCruceDeHorario(
        reservasCookie,
        fecha,
        especialistaId,
        h24,
        duracionMinutos
      );
      return {
        hora: h24,
        horaFormateada: formatearHora12(h24),
        disponible: !ocupado,
        ocupado,
      };
    });

  return {
    ok: true,
    fechaPasada: false,
    esDomingoOFestivo,
    horarios,
    ahoraColombia: { fechaHoy, minutosActuales },
  };
}

export async function registrarNuevaReserva(datosFormulario) {
  const { fechaHoy, minutosActuales } = obtenerAhoraColombia();
  if (!datosFormulario.fecha || datosFormulario.fecha < fechaHoy) {
    throw new Error("No se permiten reservas en fechas anteriores al día actual.");
  }
  if (
    datosFormulario.fecha === fechaHoy &&
    aMinutos(datosFormulario.hora) <= minutosActuales
  ) {
    throw new Error(
      "El horario seleccionado ya pasó. Por favor selecciona una hora posterior a la actual."
    );
  }

  const reservasActuales = leerReservasCookies();
  const especialista =
    initialSpecialists.find((e) => e.id === datosFormulario.especialistaId) ||
    initialSpecialists[0];

  const duracionMinutos = parseInt(datosFormulario.duracionMinutos, 10) || 75;
  if (
    hayCruceDeHorario(
      reservasActuales,
      datosFormulario.fecha,
      datosFormulario.especialistaId,
      datosFormulario.hora,
      duracionMinutos
    )
  ) {
    throw new Error(
      "Este horario ya está ocupado o se cruza con otra cita de la misma especialista."
    );
  }

  const ticket = generarTicketUnicoCookie(reservasActuales);
  const ahoraISO = new Date().toISOString();

  const nuevaReserva = {
    id: `res-${Date.now()}`,
    ticket,
    servicioId: datosFormulario.servicioId,
    servicioNombre: datosFormulario.servicioNombre,
    precio: datosFormulario.precio,
    duracionTexto: datosFormulario.duracionTexto,
    duracionMinutos,
    especialistaId: especialista.id,
    especialistaNombre:
      especialista.nombreCompleto || `${especialista.nombre} · ${especialista.cargo}`,
    fecha: datosFormulario.fecha,
    hora: datosFormulario.hora,
    horaFormateada: formatearHora12(datosFormulario.hora),
    nombreClienta: String(datosFormulario.nombreClienta).trim(),
    telefonoClienta: String(datosFormulario.telefonoClienta).trim(),
    correoClienta: String(datosFormulario.correoClienta || "").trim(),
    notas: String(datosFormulario.notas || "").trim(),
    googleEventId: "",
    googleCalendarStatus: "pendiente_config",
    emailConfirmacionEnviado: false,
    emailCancelacionEnviado: false,
    estado: "confirmada",
    creadoEn: ahoraISO,
    actualizadoEn: ahoraISO,
  };

  if (import.meta.env.DEV) {
    try {
      const resCalendar = await fetch("/api/google/crear-evento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaReserva),
      });
      if (resCalendar.ok) {
        const dataCal = await resCalendar.json();
        nuevaReserva.googleEventId = dataCal.eventId || "";
        nuevaReserva.googleCalendarStatus = dataCal.estado || "sincronizado";
      }
    } catch {
      nuevaReserva.googleCalendarStatus = "guardada_en_cookies";
    }
  }

  const actualizadas = [nuevaReserva, ...reservasActuales];
  guardarReservasCookies(actualizadas);
  guardarCookieTicket(ticket);

  const reservaEnriquecida = enriquecerReservaPublica(
    nuevaReserva,
    leerResenasCookies()
  );

  const resEmail = await enviarCorreoConfirmacionReserva(reservaEnriquecida);
  if (resEmail?.enviado) {
    nuevaReserva.emailConfirmacionEnviado = true;
    guardarReservasCookies(actualizadas);
  }

  return reservaEnriquecida;
}

export async function consultarReservaPorTicket(codigoEntrada) {
  const validacion = validarFormatoTicket(codigoEntrada);
  if (!validacion.valido) {
    throw new Error(validacion.mensaje);
  }

  const ahora = Date.now();
  if (ventanaConsultaLocal.bloqueadoHasta > ahora) {
    const seg = Math.ceil((ventanaConsultaLocal.bloqueadoHasta - ahora) / 1000);
    throw new Error(
      `Has realizado demasiados intentos seguidos. Por seguridad, espera ${seg} segundos.`
    );
  }

  if (ahora - ventanaConsultaLocal.inicio > 60000) {
    ventanaConsultaLocal = { conteo: 1, inicio: ahora, bloqueadoHasta: 0 };
  } else {
    ventanaConsultaLocal.conteo += 1;
    if (ventanaConsultaLocal.conteo > 12) {
      ventanaConsultaLocal.bloqueadoHasta = ahora + 30000;
      throw new Error(
        "Demasiados intentos de consulta. Por seguridad, espera 30 segundos antes de volver a intentar."
      );
    }
  }

  const codigo = validacion.codigo;
  const reservasCookie = leerReservasCookies();
  const encontrada = reservasCookie.find(
    (r) => String(r.ticket).toUpperCase() === codigo
  );

  if (!encontrada) {
    throw new Error("No se encontró ninguna reserva asociada al código ingresado.");
  }

  guardarCookieTicket(codigo);
  return enriquecerReservaPublica(encontrada, leerResenasCookies());
}

export async function cancelarReservaPorTicket(codigoEntrada) {
  const validacion = validarFormatoTicket(codigoEntrada);
  if (!validacion.valido) {
    throw new Error(validacion.mensaje);
  }
  const codigo = validacion.codigo;

  const reservasCookie = leerReservasCookies();
  const idx = reservasCookie.findIndex(
    (r) => String(r.ticket).toUpperCase() === codigo
  );
  if (idx === -1) {
    throw new Error("No se encontró la reserva solicitada.");
  }

  const r = reservasCookie[idx];
  if (r.estado === "cancelada") {
    throw new Error("Esta reserva ya fue cancelada anteriormente.");
  }
  if (r.estado === "realizada") {
    throw new Error("No se permite cancelar una cita que ya ha sido realizada.");
  }
  if (citaYaPasoColombia(r.fecha, r.hora)) {
    throw new Error("No se permite cancelar una cita cuya fecha u horario ya ha pasado.");
  }
  if (!faltanAlMenos12HorasColombia(r.fecha, r.hora)) {
    throw new Error(
      "No es posible cancelar esta cita porque faltan menos de 12 horas para la fecha y hora programadas. Las cancelaciones requieren un mínimo de 12 horas de anticipación."
    );
  }

  if (import.meta.env.DEV) {
    try {
      const resVal = await fetch("/api/reservas/validar-cancelacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticket: codigo,
          fecha: r.fecha,
          hora: r.hora,
          estadoActual: r.estado,
        }),
      });
      if (resVal.status === 400) {
        const dataErr = await resVal.json();
        throw new Error(
          dataErr.error ||
            "No es posible cancelar la cita porque no se cumple el tiempo mínimo de 12 horas de anticipación."
        );
      }
    } catch (err) {
      if (err.message && err.message.includes("12 horas")) {
        throw err;
      }
    }
  }

  reservasCookie[idx].estado = "cancelada";
  reservasCookie[idx].actualizadoEn = new Date().toISOString();

  if (import.meta.env.DEV && reservasCookie[idx].googleEventId) {
    try {
      const resCal = await fetch("/api/google/cancelar-evento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          googleEventId: reservasCookie[idx].googleEventId,
          ticket: codigo,
          fecha: r.fecha,
          hora: r.hora,
          origen: "cliente",
        }),
      });
      if (resCal.ok) {
        reservasCookie[idx].googleCalendarStatus = "cancelado_en_google";
      }
    } catch {
      reservasCookie[idx].googleCalendarStatus = "cancelada_en_cookies";
    }
  }

  const reservaActualizada = enriquecerReservaPublica(
    reservasCookie[idx],
    leerResenasCookies()
  );

  const resEmail = await enviarCorreoCancelacionReserva(reservaActualizada);
  if (resEmail?.enviado) {
    reservasCookie[idx].emailCancelacionEnviado = true;
  }

  guardarReservasCookies(reservasCookie);

  return {
    ok: true,
    mensaje: "Tu reserva ha sido cancelada correctamente y el horario fue liberado.",
    reserva: reservaActualizada,
  };
}

export async function publicarResenaServicio({ ticket, rating, comment }) {
  const validacion = validarFormatoTicket(ticket);
  if (!validacion.valido) {
    throw new Error(validacion.mensaje);
  }

  const reservasCookie = leerReservasCookies();
  const resenasCookie = leerResenasCookies();
  const reserva = reservasCookie.find(
    (r) => String(r.ticket).toUpperCase() === validacion.codigo
  );

  if (!reserva) {
    throw new Error("No existe una reserva asociada a este ticket.");
  }
  if (
    resenasCookie.some(
      (rev) =>
        rev.reservaId === reserva.id ||
        String(rev.ticket).toUpperCase() === validacion.codigo
    )
  ) {
    throw new Error("Esta reserva ya tiene una reseña registrada.");
  }
  if (reserva.estado !== "realizada") {
    throw new Error(
      `Tu cita está en estado "${reserva.estado}". Solo puedes dejar una reseña cuando el salón la marque como "realizada".`
    );
  }

  const nuevaResena = {
    id: `rev-${Date.now()}`,
    reservaId: reserva.id,
    ticket: reserva.ticket,
    name: reserva.nombreClienta,
    service: reserva.servicioNombre,
    servicioId: reserva.servicioId,
    especialistaNombre: reserva.especialistaNombre,
    rating: Number(rating),
    date: `Cita ${reserva.fecha}`,
    avatarColor: "steel",
    comment: String(comment).trim(),
  };

  const actualizadas = [nuevaResena, ...resenasCookie];
  guardarResenasCookies(actualizadas);

  return {
    ok: true,
    mensaje: "¡Gracias! Tu reseña ha sido publicada exitosamente.",
    resena: nuevaResena,
    reserva: enriquecerReservaPublica(reserva, actualizadas),
  };
}

export async function obtenerDatosPanelAdmin(pin) {
  if (pin !== "LUMIERE2026") {
    throw new Error("Clave de autorización administrativa inválida.");
  }

  return {
    ok: true,
    reservas: leerReservasCookies(),
    resenas: leerResenasCookies(),
  };
}

export async function actualizarEstadoReservaAdmin({ pin, ticket, estado }) {
  if (pin !== "LUMIERE2026") {
    throw new Error("Clave de autorización administrativa inválida.");
  }

  const reservasCookie = leerReservasCookies();
  const idx = reservasCookie.findIndex(
    (r) => String(r.ticket).toUpperCase() === String(ticket).toUpperCase()
  );

  if (idx === -1) {
    throw new Error("Reserva no encontrada en las cookies del navegador.");
  }

  if (reservasCookie[idx].estado === "cancelada" && estado === "realizada") {
    throw new Error(
      "Una cita cuyo estado es 'Cancelada' no puede marcarse como 'Realizada'."
    );
  }

  if (import.meta.env.DEV) {
    try {
      const resValAdmin = await fetch("/api/admin/validar-estado", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pin,
          ticket: reservasCookie[idx].ticket,
          estadoActual: reservasCookie[idx].estado,
          nuevoEstado: estado,
        }),
      });
      if (resValAdmin.status === 400 || resValAdmin.status === 401) {
        const dataErr = await resValAdmin.json();
        throw new Error(
          dataErr.error ||
            "Operación no permitida: una cita cancelada no puede marcarse como realizada."
        );
      }
    } catch (err) {
      if (
        err.message &&
        (err.message.includes("Cancelada") || err.message.includes("cancelada"))
      ) {
        throw err;
      }
    }
  }

  reservasCookie[idx].estado = estado;
  reservasCookie[idx].actualizadoEn = new Date().toISOString();

  if (import.meta.env.DEV && estado === "cancelada" && reservasCookie[idx].googleEventId) {
    try {
      const resCal = await fetch("/api/google/cancelar-evento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          googleEventId: reservasCookie[idx].googleEventId,
          ticket: reservasCookie[idx].ticket,
          origen: "admin",
        }),
      });
      if (resCal.ok) {
        reservasCookie[idx].googleCalendarStatus = "cancelado_en_google";
      }
    } catch {
      reservasCookie[idx].googleCalendarStatus = "cancelada_en_cookies";
    }
  }

  if (estado === "cancelada") {
    const resEmailCancel = await enviarCorreoCancelacionReserva(
      enriquecerReservaPublica(reservasCookie[idx], leerResenasCookies())
    );
    if (resEmailCancel?.enviado) {
      reservasCookie[idx].emailCancelacionEnviado = true;
    }
  }

  guardarReservasCookies(reservasCookie);

  return {
    ok: true,
    mensaje: `Estado del ticket ${ticket} actualizado a "${estado}".`,
    reserva: reservasCookie[idx],
  };
}

export async function eliminarResenaAdmin({ pin, id }) {
  if (pin !== "LUMIERE2026") {
    throw new Error("Clave de autorización administrativa inválida.");
  }

  const filtradas = leerResenasCookies().filter(
    (r) => String(r.id) !== String(id)
  );
  guardarResenasCookies(filtradas);
  return { ok: true, resenas: filtradas };
}

function construirHtmlComprobante(reserva) {
  const estadoTexto = String(reserva.estado || "confirmada").toUpperCase();

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Comprobante de Reserva ${reserva.ticket} - Lumière Studio</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
    body {
      margin: 0;
      padding: 40px 20px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: linear-gradient(135deg, #F0F9FF 0%, #FDF2F8 50%, #F5F3FF 100%);
      color: #0F172A;
      display: flex;
      justify-content: center;
    }
    .comprobante-card {
      width: 100%;
      max-width: 560px;
      background: #FFFFFF;
      border: 2px solid #5BC0F8;
      border-radius: 26px;
      padding: 36px 32px;
      box-shadow: 0 20px 48px rgba(15, 23, 42, 0.12), 0 0 28px rgba(91, 192, 248, 0.35);
    }
    .header {
      text-align: center;
      border-bottom: 1.5px solid #E2E8F0;
      padding-bottom: 20px;
      margin-bottom: 24px;
    }
    .kicker {
      display: inline-block;
      background: #000000;
      color: #FFFFFF;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 2px;
      padding: 6px 16px;
      border-radius: 999px;
      margin-bottom: 12px;
    }
    .studio-title {
      font-family: 'Cinzel', serif;
      font-size: 28px;
      font-weight: 800;
      color: #5BC0F8;
      margin: 0;
      letter-spacing: 1px;
    }
    .ticket-box {
      background: #000000;
      color: #FFFFFF;
      border: 2px solid #5BC0F8;
      border-radius: 18px;
      padding: 18px;
      text-align: center;
      margin-bottom: 24px;
    }
    .ticket-label {
      font-size: 11px;
      letter-spacing: 2px;
      color: #CBD5E1;
      text-transform: uppercase;
      display: block;
      margin-bottom: 6px;
    }
    .ticket-code {
      font-family: 'Cinzel', serif;
      font-size: 32px;
      font-weight: 800;
      letter-spacing: 6px;
      color: #5BC0F8;
    }
    .row {
      display: flex;
      justify-content: space-between;
      padding: 11px 0;
      border-bottom: 1px solid #F1F5F9;
      font-size: 14px;
    }
    .row strong {
      color: #000000;
    }
    .status-pill {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 999px;
      background: #E0F2FE;
      color: #0369A1;
      font-weight: 700;
      font-size: 12px;
    }
    .footer {
      margin-top: 24px;
      text-align: center;
      font-size: 12.5px;
      color: #475569;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <div class="comprobante-card">
    <div class="header">
      <span class="kicker">COMPROBANTE OFICIAL DE CITA</span>
      <h1 class="studio-title">${studioInfo.name}</h1>
    </div>
    <div class="ticket-box">
      <span class="ticket-label">Código Único de Reserva (Ticket)</span>
      <div class="ticket-code">${reserva.ticket}</div>
    </div>
    <div class="row"><span>Clienta</span><strong>${reserva.nombreClienta}</strong></div>
    <div class="row"><span>Servicio Reservado</span><strong>${reserva.servicioNombre}</strong></div>
    <div class="row"><span>Especialista Asignada</span><strong>${reserva.especialistaNombre}</strong></div>
    <div class="row"><span>Fecha y Hora</span><strong>${reserva.fecha} · ${reserva.horaFormateada || reserva.hora}</strong></div>
    <div class="row"><span>Duración Estimada</span><strong>${reserva.duracionTexto || "75 min"}</strong></div>
    <div class="row"><span>Precio del Servicio</span><strong>${reserva.precio}</strong></div>
    <div class="row"><span>Estado de la Reserva</span><span class="status-pill">${estadoTexto}</span></div>
    <div class="footer">
      <p>Conserva tu código <strong>${reserva.ticket}</strong> para consultar el estado de tu cita, cancelarla o publicar tu reseña en la sección "Consultar mi cita".</p>
      <p>${studioInfo.address}, ${studioInfo.city} · Tel: ${studioInfo.phoneDisplay}</p>
    </div>
  </div>
</body>
</html>`;
}

export function descargarComprobanteReserva(reserva) {
  if (!reserva) return;
  const html = construirHtmlComprobante(reserva);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.setAttribute("download", `Comprobante-Lumiere-${reserva.ticket}.html`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function imprimirComprobanteReserva(reserva) {
  if (!reserva) return;
  const html = construirHtmlComprobante(reserva);
  const ventana = window.open("", "_blank", "width=720,height=840");
  if (!ventana) return;
  ventana.document.open();
  ventana.document.write(html);
  ventana.document.close();
  ventana.focus();
  setTimeout(() => {
    ventana.print();
  }, 350);
}
