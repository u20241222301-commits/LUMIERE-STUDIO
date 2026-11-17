import { studioInfo } from "../data/homeData";

const EMAILJS_API_URL = "https://api.emailjs.com/api/v1.0/email/send";
const ticketsConfirmacionEnviados = new Set();
const ticketsCancelacionEnviados = new Set();

function obtenerConfiguracionEmailJS() {
  return {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_2zx75xf",
    templateConfirmacion:
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID_CONFIRMACION ||
      "template_0z2m5eb",
    templateCancelacion:
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID_CANCELACION ||
      "template_a1vl76a",
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "UkLk4xACCFlfamFYT",
  };
}

function construirHtmlCorreoConfirmacion(reserva, urlConsulta) {
  return `<div style="font-family:'Plus Jakarta Sans',Arial,sans-serif;max-width:560px;margin:0 auto;background:#FFFFFF;border:2px solid #5BC0F8;border-radius:24px;padding:32px;color:#0F172A;">
    <div style="text-align:center;border-bottom:1px solid #E2E8F0;padding-bottom:18px;margin-bottom:20px;">
      <span style="display:inline-block;background:#000000;color:#FFFFFF;font-size:11px;font-weight:700;letter-spacing:2px;padding:5px 14px;border-radius:999px;">CONFIRMACIÓN DE CITA</span>
      <h2 style="font-family:'Cinzel',serif;color:#5BC0F8;font-size:26px;margin:10px 0 4px;">${studioInfo.name}</h2>
      <p style="margin:0;color:#475569;font-size:14px;">¡Hola ${reserva.nombreClienta}! Tu cita ha sido confirmada exitosamente.</p>
    </div>
    <div style="background:#000000;color:#FFFFFF;border:2px solid #5BC0F8;border-radius:16px;padding:16px;text-align:center;margin-bottom:20px;">
      <span style="font-size:11px;color:#CBD5E1;letter-spacing:2px;display:block;">CÓDIGO ÚNICO DE RESERVA</span>
      <strong style="font-size:28px;color:#5BC0F8;letter-spacing:5px;">${reserva.ticket}</strong>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <tr><td style="padding:8px 0;color:#475569;">Clienta:</td><td style="padding:8px 0;text-align:right;font-weight:700;">${reserva.nombreClienta}</td></tr>
      <tr><td style="padding:8px 0;color:#475569;">Servicio reservado:</td><td style="padding:8px 0;text-align:right;font-weight:700;">${reserva.servicioNombre}</td></tr>
      <tr><td style="padding:8px 0;color:#475569;">Especialista asignada:</td><td style="padding:8px 0;text-align:right;font-weight:700;">${reserva.especialistaNombre}</td></tr>
      <tr><td style="padding:8px 0;color:#475569;">Fecha:</td><td style="padding:8px 0;text-align:right;font-weight:700;">${reserva.fecha}</td></tr>
      <tr><td style="padding:8px 0;color:#475569;">Hora:</td><td style="padding:8px 0;text-align:right;font-weight:700;">${reserva.horaFormateada}</td></tr>
      <tr><td style="padding:8px 0;color:#475569;">Precio del servicio:</td><td style="padding:8px 0;text-align:right;font-weight:800;color:#7E22CE;">${reserva.precio}</td></tr>
    </table>
    <div style="margin-top:20px;padding:14px;background:#F0F9FF;border-left:4px solid #5BC0F8;border-radius:10px;font-size:13px;color:#334155;">
      <strong>¿Cómo consultar o cancelar tu cita?</strong><br/>
      Ingresa a la sección <em>"Consultar mi Cita"</em> en nuestra página web (${urlConsulta}) y digita tu código <strong>${reserva.ticket}</strong>.
    </div>
    <p style="text-align:center;font-size:12px;color:#64748B;margin-top:20px;">
      ${studioInfo.name} · ${studioInfo.address}, ${studioInfo.city} · Tel: ${studioInfo.phoneDisplay}
    </p>
  </div>`;
}

function construirHtmlCorreoCancelacion(reserva) {
  return `<div style="font-family:'Plus Jakarta Sans',Arial,sans-serif;max-width:560px;margin:0 auto;background:#FFFFFF;border:2px solid #F87171;border-radius:24px;padding:32px;color:#0F172A;">
    <div style="text-align:center;border-bottom:1px solid #E2E8F0;padding-bottom:18px;margin-bottom:20px;">
      <span style="display:inline-block;background:#000000;color:#FFFFFF;font-size:11px;font-weight:700;letter-spacing:2px;padding:5px 14px;border-radius:999px;">CANCELACIÓN DE CITA</span>
      <h2 style="font-family:'Cinzel',serif;color:#5BC0F8;font-size:26px;margin:10px 0 4px;">${studioInfo.name}</h2>
      <p style="margin:0;color:#475569;font-size:14px;">Hola ${reserva.nombreClienta}, te confirmamos que la cancelación de tu cita se realizó correctamente.</p>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <tr><td style="padding:8px 0;color:#475569;">Código de reserva:</td><td style="padding:8px 0;text-align:right;font-weight:800;">${reserva.ticket}</td></tr>
      <tr><td style="padding:8px 0;color:#475569;">Clienta:</td><td style="padding:8px 0;text-align:right;font-weight:700;">${reserva.nombreClienta}</td></tr>
      <tr><td style="padding:8px 0;color:#475569;">Servicio reservado:</td><td style="padding:8px 0;text-align:right;font-weight:700;">${reserva.servicioNombre}</td></tr>
      <tr><td style="padding:8px 0;color:#475569;">Fecha y hora cancelada:</td><td style="padding:8px 0;text-align:right;font-weight:700;">${reserva.fecha} · ${reserva.horaFormateada}</td></tr>
      <tr><td style="padding:8px 0;color:#475569;">Estado actual:</td><td style="padding:8px 0;text-align:right;font-weight:800;color:#991B1B;">Cancelada</td></tr>
    </table>
    <p style="text-align:center;font-size:12px;color:#64748B;margin-top:20px;">
      ${studioInfo.name} · ${studioInfo.address}, ${studioInfo.city} · Tel: ${studioInfo.phoneDisplay}
    </p>
  </div>`;
}

export async function enviarCorreoConfirmacionReserva(reserva) {
  if (!reserva || !reserva.ticket) {
    return { enviado: false, motivo: "Reserva inválida" };
  }

  const codigo = String(reserva.ticket).toUpperCase();
  if (reserva.emailConfirmacionEnviado || ticketsConfirmacionEnviados.has(codigo)) {
    return { enviado: false, motivo: "Correo de confirmación ya enviado previamente" };
  }

  const correoDestino = String(reserva.correoClienta || "").trim();
  if (!correoDestino) {
    return { enviado: false, motivo: "Sin correo electrónico de destino" };
  }

  const config = obtenerConfiguracionEmailJS();
  if (!config.serviceId || !config.templateConfirmacion || !config.publicKey) {
    return {
      enviado: false,
      pendienteConfig: true,
      motivo: "Credenciales de EmailJS pendientes de configurar.",
    };
  }

  const origenWeb =
    typeof window !== "undefined" ? window.location.origin : "http://localhost:5173";
  const urlConsulta = `${origenWeb}/consultar-cita`;

  const templateParams = {
    to_email: correoDestino,
    to_name: reserva.nombreClienta,
    client_name: reserva.nombreClienta,
    confirmation_message: `¡Hola ${reserva.nombreClienta}! Tu cita en ${studioInfo.name} ha sido confirmada exitosamente.`,
    service_name: reserva.servicioNombre,
    specialist_name: reserva.especialistaNombre,
    appointment_date: reserva.fecha,
    appointment_time_12h: reserva.horaFormateada,
    service_price: reserva.precio,
    ticket_code: reserva.ticket,
    studio_name: studioInfo.name,
    studio_address: `${studioInfo.address}, ${studioInfo.city}`,
    studio_phone: studioInfo.phoneDisplay,
    lookup_url: urlConsulta,
    lookup_instructions: `Ingresa a "${urlConsulta}" en la sección "Consultar mi Cita" con tu código ${reserva.ticket} para revisar o cancelar tu reserva.`,
    email_html_card: construirHtmlCorreoConfirmacion(reserva, urlConsulta),
  };

  try {
    const respuesta = await fetch(EMAILJS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: config.serviceId,
        template_id: config.templateConfirmacion,
        user_id: config.publicKey,
        template_params: templateParams,
      }),
    });

    if (!respuesta.ok) {
      const errorTexto = await respuesta.text();
      return { enviado: false, motivo: errorTexto };
    }

    ticketsConfirmacionEnviados.add(codigo);
    return { enviado: true };
  } catch (err) {
    return { enviado: false, motivo: err.message };
  }
}

export async function enviarCorreoCancelacionReserva(reserva) {
  if (!reserva || !reserva.ticket) {
    return { enviado: false, motivo: "Reserva inválida" };
  }

  const codigo = String(reserva.ticket).toUpperCase();
  if (reserva.emailCancelacionEnviado || ticketsCancelacionEnviados.has(codigo)) {
    return { enviado: false, motivo: "Correo de cancelación ya enviado previamente" };
  }

  const correoDestino = String(reserva.correoClienta || "").trim();
  if (!correoDestino) {
    return { enviado: false, motivo: "Sin correo electrónico de destino" };
  }

  const config = obtenerConfiguracionEmailJS();
  if (!config.serviceId || !config.templateCancelacion || !config.publicKey) {
    return {
      enviado: false,
      pendienteConfig: true,
      motivo: "Credenciales de EmailJS pendientes de configurar.",
    };
  }

  const templateParams = {
    to_email: correoDestino,
    to_name: reserva.nombreClienta,
    client_name: reserva.nombreClienta,
    service_name: reserva.servicioNombre,
    appointment_date: reserva.fecha,
    appointment_time_12h: reserva.horaFormateada,
    ticket_code: reserva.ticket,
    cancellation_message: `Hola ${reserva.nombreClienta}, te confirmamos que la cancelación de tu cita ${reserva.ticket} se realizó correctamente y tu horario ha sido liberado.`,
    studio_name: studioInfo.name,
    studio_address: `${studioInfo.address}, ${studioInfo.city}`,
    studio_phone: studioInfo.phoneDisplay,
    email_html_card: construirHtmlCorreoCancelacion(reserva),
  };

  try {
    const respuesta = await fetch(EMAILJS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: config.serviceId,
        template_id: config.templateCancelacion,
        user_id: config.publicKey,
        template_params: templateParams,
      }),
    });

    if (!respuesta.ok) {
      const errorTexto = await respuesta.text();
      return { enviado: false, motivo: errorTexto };
    }

    ticketsCancelacionEnviados.add(codigo);
    return { enviado: true };
  } catch (err) {
    return { enviado: false, motivo: err.message };
  }
}
