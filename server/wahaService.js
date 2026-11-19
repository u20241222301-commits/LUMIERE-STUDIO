import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import makeWASocket, {
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";
import pino from "pino";
import QRCode from "qrcode";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const AUTH_DIR = path.join(__dirname, "waha_auth_session", "default");
const loggerSilencioso = pino({ level: "silent" });

if (!globalThis.__lumiereWahaSingleton) {
  globalThis.__lumiereWahaSingleton = {
    socket: null,
    iniciando: false,
    timerReconexion: null,
    mensajesCache: new Map(),
    estado: {
      status: "STOPPED",
      session: "default",
      qrRaw: "",
      qrDataUrl: "",
      me: null,
      ultimoError: "",
      actualizadoEn: "",
    },
  };
}

const motorGlobal = globalThis.__lumiereWahaSingleton;

function limpiarSocketPrevio() {
  if (motorGlobal.timerReconexion) {
    clearTimeout(motorGlobal.timerReconexion);
    motorGlobal.timerReconexion = null;
  }
  if (motorGlobal.socket) {
    const sockViejo = motorGlobal.socket;
    motorGlobal.socket = null;
    try {
      sockViejo.ev.removeAllListeners("connection.update");
      sockViejo.ev.removeAllListeners("creds.update");
      sockViejo.end(undefined);
    } catch {
      motorGlobal.socket = null;
    }
  }
}

export function formatearChatIdColombia(telefonoRaw) {
  let digitos = String(telefonoRaw || "").replace(/\D/g, "");
  if (!digitos) return "";

  if (digitos.startsWith("00")) {
    digitos = digitos.slice(2);
  }

  if (digitos.length === 10 && digitos.startsWith("3")) {
    digitos = `57${digitos}`;
  }

  if (digitos.length < 10 || digitos.length > 15) {
    return "";
  }

  return `${digitos}@c.us`;
}

function convertirChatIdAJidBaileys(chatId) {
  const limpio = String(chatId || "")
    .replace(/@c\.us$/i, "")
    .replace(/@s\.whatsapp\.net$/i, "")
    .replace(/\D/g, "");
  if (!limpio) return "";
  return `${limpio}@s.whatsapp.net`;
}

export async function iniciarMotorWahaLocal() {
  const estadoWahaLocal = motorGlobal.estado;

  if (motorGlobal.iniciando) {
    return obtenerEstadoWahaLocal();
  }
  if (
    motorGlobal.socket &&
    (estadoWahaLocal.status === "WORKING" ||
      estadoWahaLocal.status === "SCAN_QR_CODE")
  ) {
    return obtenerEstadoWahaLocal();
  }

  motorGlobal.iniciando = true;
  limpiarSocketPrevio();

  estadoWahaLocal.status = "STARTING";
  estadoWahaLocal.ultimoError = "";
  estadoWahaLocal.actualizadoEn = new Date().toISOString();

  try {
    fs.mkdirSync(AUTH_DIR, { recursive: true });
    const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);

    let version = [2, 3000, 1015901307];
    try {
      const infoVersion = await fetchLatestBaileysVersion();
      if (infoVersion?.version) {
        version = infoVersion.version;
      }
    } catch {
      version = [2, 3000, 1015901307];
    }

    const sock = makeWASocket({
      version,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, loggerSilencioso),
      },
      logger: loggerSilencioso,
      printQRInTerminal: false,
      browser: ["Lumiere Studio WAHA", "Chrome", "1.0.0"],
      syncFullHistory: false,
      markOnlineOnConnect: false,
      getMessage: async (key) => {
        if (key?.id && motorGlobal.mensajesCache.has(key.id)) {
          return motorGlobal.mensajesCache.get(key.id);
        }
        return { conversation: "Lumière Studio" };
      },
    });

    motorGlobal.socket = sock;

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", async (update) => {
      if (motorGlobal.socket !== sock) {
        return;
      }

      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        estadoWahaLocal.status = "SCAN_QR_CODE";
        estadoWahaLocal.qrRaw = qr;
        try {
          estadoWahaLocal.qrDataUrl = await QRCode.toDataURL(qr, {
            width: 300,
            margin: 2,
          });
        } catch {
          estadoWahaLocal.qrDataUrl = "";
        }
        estadoWahaLocal.actualizadoEn = new Date().toISOString();
      }

      if (connection === "open") {
        estadoWahaLocal.status = "WORKING";
        estadoWahaLocal.qrRaw = "";
        estadoWahaLocal.qrDataUrl = "";
        estadoWahaLocal.ultimoError = "";
        estadoWahaLocal.me = {
          id: sock.user?.id || "",
          pushName: sock.user?.name || "Lumière Studio WhatsApp",
        };
        estadoWahaLocal.actualizadoEn = new Date().toISOString();
      }

      if (connection === "close") {
        const codigoSalida =
          lastDisconnect?.error?.output?.statusCode ||
          lastDisconnect?.error?.statusCode ||
          0;
        const fueLogout = codigoSalida === DisconnectReason.loggedOut;

        if (motorGlobal.socket === sock) {
          motorGlobal.socket = null;
        }

        if (fueLogout) {
          estadoWahaLocal.status = "STOPPED";
          estadoWahaLocal.qrRaw = "";
          estadoWahaLocal.qrDataUrl = "";
          estadoWahaLocal.me = null;
          try {
            fs.rmSync(AUTH_DIR, { recursive: true, force: true });
          } catch {
            estadoWahaLocal.ultimoError = "";
          }
          motorGlobal.timerReconexion = setTimeout(() => {
            iniciarMotorWahaLocal();
          }, 1500);
        } else {
          estadoWahaLocal.status = "STARTING";
          motorGlobal.timerReconexion = setTimeout(() => {
            iniciarMotorWahaLocal();
          }, 3000);
        }
      }
    });
  } catch (err) {
    estadoWahaLocal.status = "STOPPED";
    estadoWahaLocal.ultimoError =
      err.message || "Error al iniciar motor WAHA NOWEB local.";
    motorGlobal.socket = null;
  } finally {
    motorGlobal.iniciando = false;
  }

  return obtenerEstadoWahaLocal();
}

export async function reiniciarSesionWahaLocal() {
  limpiarSocketPrevio();
  try {
    if (fs.existsSync(AUTH_DIR)) {
      fs.rmSync(AUTH_DIR, { recursive: true, force: true });
    }
  } catch {
    motorGlobal.socket = null;
  }

  const estadoWahaLocal = motorGlobal.estado;
  estadoWahaLocal.status = "STOPPED";
  estadoWahaLocal.qrRaw = "";
  estadoWahaLocal.qrDataUrl = "";
  estadoWahaLocal.me = null;
  estadoWahaLocal.ultimoError = "";

  return iniciarMotorWahaLocal();
}

export function obtenerEstadoWahaLocal() {
  const estadoWahaLocal = motorGlobal.estado;
  return {
    conectado: estadoWahaLocal.status === "WORKING",
    estado: estadoWahaLocal.status,
    session: estadoWahaLocal.session,
    qrDataUrl: estadoWahaLocal.qrDataUrl,
    me: estadoWahaLocal.me,
    ultimoError: estadoWahaLocal.ultimoError,
    actualizadoEn: estadoWahaLocal.actualizadoEn,
    motor: "waha_noweb_integrado",
  };
}

async function esperarSocketListo(timeoutMs = 10000) {
  if (motorGlobal.socket && motorGlobal.estado.status === "WORKING") {
    return motorGlobal.socket;
  }
  if (!motorGlobal.socket && !motorGlobal.iniciando) {
    iniciarMotorWahaLocal();
  }
  const inicio = Date.now();
  while (Date.now() - inicio < timeoutMs) {
    if (motorGlobal.socket && motorGlobal.estado.status === "WORKING") {
      return motorGlobal.socket;
    }
    if (motorGlobal.estado.status === "SCAN_QR_CODE") {
      break;
    }
    await new Promise((r) => setTimeout(r, 350));
  }
  return motorGlobal.socket && motorGlobal.estado.status === "WORKING"
    ? motorGlobal.socket
    : null;
}

export function construirMensajeConfirmacionWhatsApp(reserva) {
  const nombre = reserva.nombreClienta || "Clienta";
  const ticket = reserva.ticket || "";
  const servicio = reserva.servicioNombre || "Servicio de Spa";
  const especialista = reserva.especialistaNombre || "Especialista Lumière";
  const fecha = reserva.fecha || "";
  const hora = reserva.horaFormateada || reserva.hora || "";
  const precio = reserva.precio || "A calcular en cita";

  const lineas = [
    "✨ *LUMIÈRE STUDIO · CONFIRMACIÓN DE CITA* ✨",
    "",
    `¡Hola *${nombre}*! 💖 Tu cita en *Lumière Studio* ha sido agendada y confirmada exitosamente.`,
    "",
    `🎫 *Código único de reserva (Ticket):* *${ticket}*`,
    `💅 *Servicio:* ${servicio}`,
    `💎 *Valor:* ${precio}`,
    `👩‍🎨 *Especialista:* ${especialista}`,
    `📅 *Fecha:* ${fecha}`,
    `⏰ *Hora:* ${hora}`,
    "📍 *Dirección:* Cll 57 #17C-29, Barrio Villa Carolina, Neiva, Huila",
  ];

  if (reserva.notas) {
    lineas.push(`📝 *Notas:* ${reserva.notas}`);
  }

  lineas.push(
    "",
    "📌 *Políticas importantes:*",
    "• Te recomendamos llegar a tiempo (contamos con 10 minutos de tolerancia).",
    "• Si necesitas cancelar tu cita, puedes hacerlo con al menos 12 horas de anticipación en la sección *Consultar mi Cita* usando tu código *" +
      ticket +
      "*.",
    "",
    "¡Te esperamos para consentirte! 🌸✨"
  );

  return lineas.join("\n");
}

export function construirMensajeCancelacionWhatsApp(reserva, origen = "cliente") {
  const nombre = reserva.nombreClienta || "Clienta";
  const ticket = reserva.ticket || "";
  const servicio = reserva.servicioNombre || "Servicio de Spa";
  const fecha = reserva.fecha || "";
  const hora = reserva.horaFormateada || reserva.hora || "";
  const notaOrigen =
    origen === "admin"
      ? "por administración del estudio"
      : "según tu solicitud en nuestra plataforma";

  const lineas = [
    "🌸 *LUMIÈRE STUDIO · CANCELACIÓN DE CITA* 🌸",
    "",
    `Hola *${nombre}*, te confirmamos que tu cita ha sido cancelada ${notaOrigen} y el horario fue liberado.`,
    "",
    `🎫 *Código de reserva:* *${ticket}*`,
    `💅 *Servicio:* ${servicio}`,
    `📅 *Fecha y hora cancelada:* ${fecha} · ${hora}`,
    "⭕ *Estado actual:* Cancelada",
    "",
    "Cuando desees agendar un nuevo momento de bienestar, estaremos encantadas de atenderte en *Lumière Studio* (Cll 57 #17C-29, Barrio Villa Carolina, Neiva). 💖✨",
  ];

  return lineas.join("\n");
}

function limpiarSesionesSignalCorruptas() {
  try {
    if (!fs.existsSync(AUTH_DIR)) return;
    const archivos = fs.readdirSync(AUTH_DIR);
    for (const archivo of archivos) {
      if (archivo.startsWith("session-")) {
        try {
          fs.unlinkSync(path.join(AUTH_DIR, archivo));
        } catch {
          continue;
        }
      }
    }
  } catch {
    return;
  }
}

export async function enviarMensajeTextoWaha({
  wahaUrl = "",
  wahaApiKey = "",
  wahaSession = "default",
  chatId = "",
  text = "",
}) {
  if (!chatId) {
    return {
      enviado: false,
      estado: "telefono_invalido",
      error: "El número de teléfono de la clienta no es válido para WhatsApp.",
    };
  }

  const sock = await esperarSocketListo(10000);
  if (sock) {
    let jidDestino = convertirChatIdAJidBaileys(chatId);
    const soloDigitos = jidDestino.replace(/@s\.whatsapp\.net$/i, "");

    try {
      const verificados = await sock.onWhatsApp(soloDigitos);
      if (Array.isArray(verificados) && verificados[0]?.jid) {
        jidDestino = verificados[0].jid;
      }
    } catch {
      jidDestino = `${soloDigitos}@s.whatsapp.net`;
    }

    try {
      const enviado = await sock.sendMessage(jidDestino, { text });
      if (enviado?.key?.id && enviado?.message) {
        motorGlobal.mensajesCache.set(enviado.key.id, enviado.message);
        if (motorGlobal.mensajesCache.size > 300) {
          const primeraClave = motorGlobal.mensajesCache.keys().next().value;
          motorGlobal.mensajesCache.delete(primeraClave);
        }
      }
      return {
        enviado: true,
        estado: "enviado_waha",
        chatId,
        jidDestino,
        messageId: enviado?.key?.id || "",
        motor: "waha_noweb_integrado",
        error: "",
      };
    } catch (errEnvio1) {
      limpiarSesionesSignalCorruptas();
      try {
        const reintento = await sock.sendMessage(jidDestino, { text });
        if (reintento?.key?.id && reintento?.message) {
          motorGlobal.mensajesCache.set(reintento.key.id, reintento.message);
        }
        return {
          enviado: true,
          estado: "enviado_waha",
          chatId,
          jidDestino,
          messageId: reintento?.key?.id || "",
          motor: "waha_noweb_integrado",
          error: "",
        };
      } catch (errEnvio2) {
        return {
          enviado: false,
          estado: "error_envio_local",
          chatId,
          error:
            errEnvio2.message ||
            errEnvio1.message ||
            "Error al enviar mensaje desde motor WAHA local.",
        };
      }
    }
  }

  return {
    enviado: false,
    estado: motorGlobal.estado.status || "pendiente_qr",
    chatId,
    error:
      "La sesión de WhatsApp no está activa en este momento. Verifica el estado en http://localhost:5173/api/whatsapp/panel",
  };
}

export async function enviarNotificacionReservaWaha({
  wahaUrl = "",
  wahaApiKey = "",
  wahaSession = "default",
  reserva = {},
}) {
  const chatId = formatearChatIdColombia(reserva.telefonoClienta);
  const text = construirMensajeConfirmacionWhatsApp(reserva);
  return enviarMensajeTextoWaha({
    wahaUrl,
    wahaApiKey,
    wahaSession,
    chatId,
    text,
  });
}

export async function enviarNotificacionCancelacionWaha({
  wahaUrl = "",
  wahaApiKey = "",
  wahaSession = "default",
  reserva = {},
  origen = "cliente",
}) {
  const chatId = formatearChatIdColombia(reserva.telefonoClienta);
  const text = construirMensajeCancelacionWhatsApp(reserva, origen);
  return enviarMensajeTextoWaha({
    wahaUrl,
    wahaApiKey,
    wahaSession,
    chatId,
    text,
  });
}

export async function verificarEstadoSesionWaha() {
  const st = motorGlobal.estado.status;
  if (
    motorGlobal.socket &&
    (st === "WORKING" || st === "SCAN_QR_CODE" || st === "STARTING")
  ) {
    return obtenerEstadoWahaLocal();
  }

  await iniciarMotorWahaLocal();
  return obtenerEstadoWahaLocal();
}

export function generarHtmlPanelWaha() {
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Lumière Studio · Panel WAHA (WhatsApp API)</title>
  <link rel="icon" type="image/png" href="/favicon-lumiere.png" />
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: linear-gradient(135deg, #F0F9FF 0%, #FDF2F8 50%, #F5F3FF 100%);
      color: #0F172A;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .card {
      width: 100%;
      max-width: 580px;
      background: rgba(255, 255, 255, 0.94);
      border: 2px solid #93C5FD;
      border-radius: 28px;
      padding: 32px;
      box-shadow: 0 22px 50px rgba(15, 23, 42, 0.12);
      text-align: center;
    }
    .kicker {
      display: inline-block;
      background: #0F172A;
      color: #FFFFFF;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 2px;
      padding: 6px 16px;
      border-radius: 999px;
      margin-bottom: 12px;
    }
    h1 {
      font-family: 'Cinzel', serif;
      font-size: 26px;
      margin: 0 0 8px;
      color: #0F172A;
    }
    p.sub {
      margin: 0 0 20px;
      font-size: 14px;
      color: #475569;
      line-height: 1.5;
    }
    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 18px;
      border-radius: 999px;
      font-weight: 700;
      font-size: 13px;
      margin-bottom: 20px;
    }
    .status-working {
      background: #DCFCE7;
      color: #166534;
      border: 1px solid #86EFAC;
    }
    .status-qr {
      background: #FEF3C7;
      color: #92400E;
      border: 1px solid #FDE68A;
    }
    .status-starting {
      background: #E0F2FE;
      color: #075985;
      border: 1px solid #BAE6FD;
    }
    .qr-box {
      background: #FFFFFF;
      border: 2px dashed #60A5FA;
      border-radius: 22px;
      padding: 20px;
      margin: 0 auto 20px;
      max-width: 340px;
      min-height: 260px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .qr-box img {
      width: 260px;
      height: 260px;
      border-radius: 12px;
    }
    .steps {
      text-align: left;
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 16px;
      padding: 16px 20px;
      font-size: 13.5px;
      color: #334155;
      margin-bottom: 20px;
      line-height: 1.6;
    }
    .btn-row {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      justify-content: center;
      margin-top: 14px;
    }
    button, a.btn {
      cursor: pointer;
      border: none;
      border-radius: 999px;
      padding: 11px 20px;
      font-family: inherit;
      font-size: 13.5px;
      font-weight: 700;
      text-decoration: none;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    .btn-primary {
      background: #0F172A;
      color: #FFFFFF;
    }
    .btn-outline {
      background: #FFFFFF;
      color: #0F172A;
      border: 1.5px solid #CBD5E1;
    }
    .test-box {
      margin-top: 20px;
      padding-top: 18px;
      border-top: 1px solid #E2E8F0;
      text-align: left;
    }
    .test-box label {
      display: block;
      font-size: 12.5px;
      font-weight: 700;
      margin-bottom: 6px;
      color: #334155;
    }
    .test-row {
      display: flex;
      gap: 8px;
    }
    .test-row input {
      flex: 1;
      padding: 10px 14px;
      border: 1.5px solid #CBD5E1;
      border-radius: 999px;
      font-family: inherit;
      font-size: 13.5px;
    }
    .msg-feedback {
      margin-top: 10px;
      font-size: 13px;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="card">
    <span class="kicker">MOTOR WAHA NOWEB INTEGRADO</span>
    <h1>Lumière Studio · WhatsApp API</h1>
    <p class="sub">Vincula el WhatsApp del estudio sin necesidad de Docker para enviar notificaciones automáticas de reserva y cancelación.</p>

    <div id="statusBadge" class="status-pill status-starting">⏳ Iniciando motor WAHA...</div>

    <div id="qrContainer" class="qr-box">
      <span id="qrLoadingText">Verificando sesión de WhatsApp...</span>
      <img id="qrImg" style="display:none;" alt="Código QR de WhatsApp" />
    </div>

    <div class="steps">
      <strong>¿Cómo vincular el WhatsApp del spa?</strong><br/>
      1. Abre <strong>WhatsApp</strong> en el celular del spa.<br/>
      2. Toca el menú <strong>⋮</strong> (o Configuración) &rarr; <strong>Dispositivos vinculados</strong>.<br/>
      3. Toca <strong>Vincular un dispositivo</strong> y escanea el código QR de arriba.<br/>
      4. Una vez diga <strong>CONECTADO (WORKING)</strong>, todas las reservas y cancelaciones enviarán el mensaje automáticamente.
    </div>

    <div id="testSection" class="test-box" style="display:none;">
      <label for="testPhone">Enviar mensaje de prueba a un número celular (Colombia):</label>
      <div class="test-row">
        <input id="testPhone" type="tel" placeholder="Ej: 3169482881" />
        <button type="button" class="btn-primary" onclick="enviarPrueba()">Enviar prueba</button>
      </div>
      <div id="testFeedback" class="msg-feedback"></div>
    </div>

    <div class="btn-row">
      <button type="button" class="btn-outline" onclick="reiniciarSesion()">🔄 Generar nuevo QR / Cambiar cuenta</button>
      <a href="/reservas" class="btn btn-primary">Ir a Reservas &rarr;</a>
    </div>
  </div>

  <script>
    async function actualizarEstado() {
      try {
        const res = await fetch('/api/whatsapp/estado');
        const data = await res.json();
        const badge = document.getElementById('statusBadge');
        const qrText = document.getElementById('qrLoadingText');
        const qrContainer = document.getElementById('qrContainer');
        const testSection = document.getElementById('testSection');

        if (data.estado === 'WORKING') {
          const cuenta = data.me && data.me.id ? data.me.id.split(':')[0].split('@')[0] : 'WhatsApp Activo';
          badge.className = 'status-pill status-working';
          badge.textContent = '✅ CONECTADO (WORKING) · +' + cuenta;
          qrContainer.innerHTML = '<div style="padding:18px;color:#166534;font-weight:700;font-size:15px;">🎉 ¡Sesión de WhatsApp vinculada y lista!<br/><span style="font-size:13px;font-weight:500;color:#475569;display:block;margin-top:8px;">Las notificaciones de confirmación y cancelación de citas están activas.</span></div>';
          testSection.style.display = 'block';
          return;
        }

        testSection.style.display = 'none';

        if (data.estado === 'SCAN_QR_CODE' && data.qrDataUrl) {
          badge.className = 'status-pill status-qr';
          badge.textContent = '📱 ESCANEA EL CÓDIGO QR CON WHATSAPP';
          if (!document.getElementById('qrImg')) {
            qrContainer.innerHTML = '<img id="qrImg" alt="Código QR de WhatsApp" />';
          }
          const imgEl = document.getElementById('qrImg');
          imgEl.src = data.qrDataUrl;
          imgEl.style.display = 'block';
          if (qrText) qrText.style.display = 'none';
        } else {
          badge.className = 'status-pill status-starting';
          badge.textContent = '⏳ Conectando sesión WAHA (' + (data.estado || 'STARTING') + ')...';
        }
      } catch (e) {}
    }

    async function reiniciarSesion() {
      const badge = document.getElementById('statusBadge');
      badge.className = 'status-pill status-starting';
      badge.textContent = '🔄 Reiniciando sesión y generando nuevo QR...';
      document.getElementById('qrContainer').innerHTML = '<span id="qrLoadingText">Generando nuevo código QR...</span><img id="qrImg" style="display:none;" alt="Código QR de WhatsApp" />';
      await fetch('/api/whatsapp/reiniciar', { method: 'POST' });
      setTimeout(actualizarEstado, 1500);
    }

    async function enviarPrueba() {
      const tel = document.getElementById('testPhone').value.trim();
      const fb = document.getElementById('testFeedback');
      if (!tel) {
        fb.style.color = '#991B1B';
        fb.textContent = 'Ingresa un número celular de 10 dígitos.';
        return;
      }
      fb.style.color = '#075985';
      fb.textContent = 'Enviando mensaje de prueba...';
      try {
        const res = await fetch('/api/whatsapp/notificar-reserva', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ticket: 'LUM777',
            nombreClienta: 'Clienta de Prueba',
            telefonoClienta: tel,
            servicioNombre: 'Manicura Rusa Silver Chrome',
            precio: '$95.000',
            especialistaNombre: 'Valeria · Master Nail Artist',
            fecha: '2026-11-20',
            horaFormateada: '10:30 AM',
            notas: 'Mensaje de prueba desde el panel WAHA de Lumière Studio'
          })
        });
        const data = await res.json();
        if (data.enviado) {
          fb.style.color = '#166534';
          fb.textContent = '✅ ¡Mensaje de WhatsApp enviado exitosamente a ' + data.chatId + '!';
        } else {
          fb.style.color = '#991B1B';
          fb.textContent = '⚠️ No se pudo enviar: ' + (data.error || 'Verifica la sesión.');
        }
      } catch (err) {
        fb.style.color = '#991B1B';
        fb.textContent = '⚠️ Error al enviar la prueba.';
      }
    }

    actualizarEstado();
    setInterval(actualizarEstado, 2500);
  </script>
</body>
</html>`;
}
