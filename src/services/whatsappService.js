const ticketsConfirmacionWhatsAppEnviados = new Set();
const ticketsCancelacionWhatsAppEnviados = new Set();

export async function enviarWhatsAppConfirmacionReserva(reserva) {
  if (!reserva || !reserva.ticket) {
    return { enviado: false, motivo: "Reserva inválida" };
  }

  const codigo = String(reserva.ticket).toUpperCase();
  if (
    reserva.whatsappConfirmacionEnviado ||
    ticketsConfirmacionWhatsAppEnviados.has(codigo)
  ) {
    return {
      enviado: false,
      motivo: "Notificación de WhatsApp ya enviada previamente",
    };
  }

  const telefono = String(reserva.telefonoClienta || "").replace(/\D/g, "");
  if (!telefono || telefono.length < 10) {
    return {
      enviado: false,
      motivo: "Número de teléfono inválido para WhatsApp",
    };
  }

  if (!import.meta.env.DEV) {
    return {
      enviado: false,
      estado: "modo_estatico",
      motivo: "El envío de WhatsApp requiere el servidor backend con WAHA.",
    };
  }

  try {
    const respuesta = await fetch("/api/whatsapp/notificar-reserva", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reserva),
    });

    if (!respuesta.ok) {
      return {
        enviado: false,
        estado: "error_http",
        motivo: `Estado HTTP ${respuesta.status}`,
      };
    }

    const data = await respuesta.json();
    if (data?.enviado) {
      ticketsConfirmacionWhatsAppEnviados.add(codigo);
    }

    return {
      enviado: Boolean(data?.enviado),
      estado: data?.estado || "pendiente_config",
      chatId: data?.chatId || "",
      messageId: data?.messageId || "",
      motivo: data?.error || "",
    };
  } catch (err) {
    return {
      enviado: false,
      estado: "error_red",
      motivo: err.message || "Error al conectar con el servicio de WhatsApp.",
    };
  }
}

export async function enviarWhatsAppCancelacionReserva(
  reserva,
  origen = "cliente"
) {
  if (!reserva || !reserva.ticket) {
    return { enviado: false, motivo: "Reserva inválida" };
  }

  const codigo = String(reserva.ticket).toUpperCase();
  if (
    reserva.whatsappCancelacionEnviado ||
    ticketsCancelacionWhatsAppEnviados.has(codigo)
  ) {
    return {
      enviado: false,
      motivo: "Notificación de cancelación por WhatsApp ya enviada previamente",
    };
  }

  const telefono = String(reserva.telefonoClienta || "").replace(/\D/g, "");
  if (!telefono || telefono.length < 10) {
    return {
      enviado: false,
      motivo: "Número de teléfono inválido para WhatsApp",
    };
  }

  if (!import.meta.env.DEV) {
    return {
      enviado: false,
      estado: "modo_estatico",
      motivo: "El envío de WhatsApp requiere el servidor backend con WAHA.",
    };
  }

  try {
    const respuesta = await fetch("/api/whatsapp/notificar-cancelacion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reserva, origen }),
    });

    if (!respuesta.ok) {
      return {
        enviado: false,
        estado: "error_http",
        motivo: `Estado HTTP ${respuesta.status}`,
      };
    }

    const data = await respuesta.json();
    if (data?.enviado) {
      ticketsCancelacionWhatsAppEnviados.add(codigo);
    }

    return {
      enviado: Boolean(data?.enviado),
      estado: data?.estado || "pendiente_config",
      chatId: data?.chatId || "",
      messageId: data?.messageId || "",
      motivo: data?.error || "",
    };
  } catch (err) {
    return {
      enviado: false,
      estado: "error_red",
      motivo: err.message || "Error al conectar con el servicio de WhatsApp.",
    };
  }
}

export async function consultarEstadoWaha() {
  if (!import.meta.env.DEV) {
    return { conectado: false, estado: "modo_estatico" };
  }
  try {
    const res = await fetch("/api/whatsapp/estado", {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return { conectado: false, estado: "error_http" };
    return await res.json();
  } catch {
    return { conectado: false, estado: "sin_conexion" };
  }
}
