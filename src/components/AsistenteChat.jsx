import { useState, useRef, useEffect } from "react";
import {
  Avatar,
  Badge,
  Button,
  Divider,
  Input,
  Spinner,
  Text,
  Title3,
  Tooltip,
} from "@fluentui/react-components";
import {
  Dismiss24Regular,
  Send24Filled,
  Sparkle24Filled,
} from "@fluentui/react-icons";
import { servicesCatalog, studioInfo } from "../data/homeData";

const listaServicios = servicesCatalog
  .map(
    (s, i) =>
      `  ${i + 1}. ${s.name} (${s.price} COP, ${s.duration}): ${s.description}`
  )
  .join("\n");

const listaHorarios = studioInfo.hours
  .map((h) => `${h.days} ${h.time}`)
  .join(", ");

const INSTRUCCIONES_SISTEMA = `Eres "Lumière Concierge", la asistente virtual de lujo de ${studioInfo.name}, un spa de uñas en ${studioInfo.city}.
Responde siempre en español con un tono elegante, cálido, breve y muy profesional (máximo 3-4 oraciones por respuesta).
Información oficial del spa:
- Servicios y precios:
${listaServicios}
- Ubicación: ${studioInfo.address}, ${studioInfo.city}.
- Horarios: ${listaHorarios}.
- Contacto: Teléfono/WhatsApp ${studioInfo.phoneDisplay}.
Si te preguntan algo que no sabes, invita amablemente a escribir por WhatsApp.`;

const PREGUNTAS_RAPIDAS = [
  "¿Cuáles son los servicios y precios?",
  "¿Dónde están ubicados y qué horario tienen?",
  "Recomiéndame un servicio",
  "¿Cómo agendo una cita?",
];

function respuestaDeRespaldo(texto) {
  const q = texto.toLowerCase();
  if (q.includes("precio") || q.includes("servicio") || q.includes("cuanto") || q.includes("cuesta") || q.includes("menu")) {
    const resumen = servicesCatalog
      .map((s) => `${s.name} (${s.price} · ${s.duration})`)
      .join(", ");
    return `Nuestros servicios son: ${resumen}.`;
  }
  if (q.includes("ubic") || q.includes("direcc") || q.includes("donde") || q.includes("horario") || q.includes("abren")) {
    return `Nos encontramos en ${studioInfo.address}, ${studioInfo.city}. Atendemos: ${listaHorarios}.`;
  }
  if (q.includes("recom") || q.includes("tornasol") || q.includes("platead") || q.includes("color")) {
    return `Si buscas un brillo espejo impactante, te recomiendo la ${servicesCatalog[0].name} (${servicesCatalog[0].price}) o el ${servicesCatalog[1].name} (${servicesCatalog[1].price}).`;
  }
  if (q.includes("agend") || q.includes("reserv") || q.includes("cita") || q.includes("whatsapp") || q.includes("contacto")) {
    return `Puedes reservar con el botón "Reservas" o escribiéndonos por WhatsApp al ${studioInfo.phoneDisplay}. ¡Será un honor atenderte!`;
  }
  return `Soy la Concierge Virtual de ${studioInfo.name}. Puedo ayudarte con servicios, precios, ubicación y reservas. También puedes escribirnos por WhatsApp al ${studioInfo.phoneDisplay}.`;
}

export default function AsistenteChat() {
  const [abierto, setAbierto] = useState(false);
  const [entrada, setEntrada] = useState("");
  const [cargando, setCargando] = useState(false);
  const [mensajes, setMensajes] = useState([
    {
      id: 1,
      emisor: "bot",
      texto: `¡Bienvenida a ${studioInfo.name}! Soy tu Concierge con IA. ¿En qué puedo asesorarte hoy sobre nuestros servicios o tu próxima cita?`,
    },
  ]);
  const finMensajesRef = useRef(null);
  const contadorIdRef = useRef(1);
  const nuevoId = () => ++contadorIdRef.current;

  useEffect(() => {
    if (abierto) {
      finMensajesRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [mensajes, abierto]);

  const enviarMensaje = async (textoAEnviar) => {
    const limpio = (textoAEnviar ?? entrada).trim();
    if (!limpio || cargando) return;

    const mensajeUsuario = { id: nuevoId(), emisor: "user", texto: limpio };
    const historial = [...mensajes, mensajeUsuario];
    setMensajes(historial);
    setEntrada("");
    setCargando(true);

    try {
      const mensajesApi = [
        { role: "system", content: INSTRUCCIONES_SISTEMA },
        ...historial.slice(-6).map((m) => ({
          role: m.emisor === "user" ? "user" : "assistant",
          content: m.texto,
        })),
      ];

      const controlador = new AbortController();
      const temporizador = setTimeout(() => controlador.abort(), 8500);

      const respuesta = await fetch("https://text.pollinations.ai/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "openai",
          messages: mensajesApi,
          temperature: 0.6,
        }),
        signal: controlador.signal,
      });

      clearTimeout(temporizador);

      if (!respuesta.ok) {
        throw new Error(`HTTP ${respuesta.status}`);
      }

      const datos = await respuesta.json();
      const textoIA =
        datos?.choices?.[0]?.message?.content?.trim() ||
        respuestaDeRespaldo(limpio);

      setMensajes((prev) => [
        ...prev,
        { id: nuevoId(), emisor: "bot", texto: textoIA },
      ]);
    } catch {
      setMensajes((prev) => [
        ...prev,
        { id: nuevoId(), emisor: "bot", texto: respuestaDeRespaldo(limpio) },
      ]);
    } finally {
      setCargando(false);
    }
  };

  const alEnviarFormulario = (e) => {
    e.preventDefault();
    enviarMensaje();
  };

  return (
    <div className="chatbot-floating-container">
      {abierto && (
        <aside className="chatbot-window" aria-label="Asistente virtual Lumière Studio">
          <div className="chatbot-header">
            <div className="chatbot-header-left">
              <div className="avatar-tornasol-ring">
                <Avatar name="Lumière IA" size={36} color="steel" />
              </div>
              <div className="chatbot-title-group">
                <div className="chatbot-title-row">
                  <Title3 className="chatbot-name">Lumière Concierge</Title3>
                  <Badge appearance="filled" size="extra-small" className="chatbot-ai-badge">
                    IA
                  </Badge>
                </div>
                <Text className="chatbot-status">● En línea · Respuesta inmediata</Text>
              </div>
            </div>

            <Button
              appearance="subtle"
              shape="circular"
              size="small"
              className="chatbot-close-btn"
              icon={<Dismiss24Regular />}
              onClick={() => setAbierto(false)}
              aria-label="Cerrar chat"
            />
          </div>

          <Divider className="chatbot-divider" />

          <div className="chatbot-messages-area">
            {mensajes.map((msg) => (
              <div
                key={msg.id}
                className={`chatbot-bubble-row ${msg.emisor === "user" ? "row-user" : "row-bot"}`}
              >
                <div
                  className={`chatbot-bubble ${
                    msg.emisor === "user" ? "bubble-user" : "bubble-bot"
                  }`}
                >
                  <Text className="chatbot-bubble-text">{msg.texto}</Text>
                </div>
              </div>
            ))}

            {cargando && (
              <div className="chatbot-bubble-row row-bot">
                <div className="chatbot-bubble bubble-bot">
                  <Spinner size="extra-tiny" label="Consultando a la Concierge..." />
                </div>
              </div>
            )}
            <div ref={finMensajesRef} />
          </div>

          <div className="chatbot-quick-chips">
            {PREGUNTAS_RAPIDAS.map((pregunta) => (
              <button
                key={pregunta}
                type="button"
                className="chatbot-chip"
                onClick={() => enviarMensaje(pregunta)}
                disabled={cargando}
              >
                {pregunta}
              </button>
            ))}
          </div>

          <form className="chatbot-input-row" onSubmit={alEnviarFormulario}>
            <Input
              className="chatbot-fluent-input"
              placeholder="Escribe tu consulta..."
              value={entrada}
              onChange={(_, datos) => setEntrada(datos.value)}
              disabled={cargando}
            />
            <Button
              type="submit"
              appearance="primary"
              shape="circular"
              className="luxury-btn primary-glow-btn chatbot-send-btn"
              icon={<Send24Filled />}
              aria-label="Enviar mensaje"
              disabled={cargando || !entrada.trim()}
            />
          </form>
        </aside>
      )}

      <Tooltip
        content={abierto ? "Ocultar asistente" : "Hablar con la Concierge IA"}
        relationship="label"
      >
        <Button
          appearance="primary"
          shape="circular"
          size="large"
          className="luxury-btn primary-glow-btn chatbot-fab-trigger"
          icon={abierto ? <Dismiss24Regular /> : <Sparkle24Filled />}
          onClick={() => setAbierto((prev) => !prev)}
        >
          {abierto ? "Cerrar Chat" : "Concierge IA"}
        </Button>
      </Tooltip>
    </div>
  );
}
