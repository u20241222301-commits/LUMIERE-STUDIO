import { useEffect, useRef, useState } from "react";
import {
  Badge,
  Body1,
  Button,
  Divider,
  Input,
  Spinner,
  Text,
  Title1,
  Title2,
  Title3,
} from "@fluentui/react-components";
import {
  CalendarCancel24Regular,
  CheckmarkCircle24Filled,
  DismissCircle24Regular,
  Print24Regular,
  Search24Regular,
  Sparkle20Filled,
} from "@fluentui/react-icons";
import { useLocation } from "react-router-dom";
import {
  cancelarReservaPorTicket,
  consultarReservaPorTicket,
  descargarComprobanteReserva,
  imprimirComprobanteReserva,
  normalizarEntradaTicket,
  obtenerTicketsRecientesCookie,
  obtenerUltimoTicketCookie,
  publicarResenaServicio,
  validarFormatoTicket,
} from "../services/sistemaReservas";
import IndicadorPincelCarga, {
  EscenaPincelCancelacion,
} from "./IndicadorPincelCarga";
import {
  animarAvisoRestriccion,
  animarEntradaPagina,
  animarPulsoSeleccion,
} from "../utils/gsapAnimations";

const ETIQUETAS_ESTADO = {
  pendiente: "Pendiente",
  confirmada: "Confirmada",
  realizada: "Realizada",
  cancelada: "Cancelada",
};

export default function PaginaConsultarCita({ embebido = false, ticketInicial = "" }) {
  const location = useLocation();

  const ticketDesdeRuta =
    ticketInicial ||
    location.state?.ticket ||
    obtenerUltimoTicketCookie() ||
    "";

  const [codigoInput, setCodigoInput] = useState(
    normalizarEntradaTicket(ticketDesdeRuta)
  );
  const [ticketsRecientes, setTicketsRecientes] = useState(() =>
    obtenerTicketsRecientesCookie()
  );
  const [cargando, setCargando] = useState(false);
  const [errorConsulta, setErrorConsulta] = useState("");
  const [notificacionExito, setNotificacionExito] = useState("");
  const [reservaActual, setReservaActual] = useState(null);
  const [confirmandoCancelacion, setConfirmandoCancelacion] = useState(false);
  const [procesandoCancelacion, setProcesandoCancelacion] = useState(false);

  const [calificacion, setCalificacion] = useState(5);
  const [comentarioResena, setComentarioResena] = useState("");
  const [enviandoResena, setEnviandoResena] = useState(false);
  const [errorResena, setErrorResena] = useState("");
  const [cancelacionRecienRealizada, setCancelacionRecienRealizada] = useState(false);

  const paginaRef = useRef(null);
  const resultadoPanelRef = useRef(null);
  const estadoBadgeRef = useRef(null);
  const avisoRestriccionRef = useRef(null);
  const alertaErrorRef = useRef(null);

  useEffect(() => {
    const ctx = animarEntradaPagina(paginaRef.current, {
      selectorHeader: ".services-hero-header",
      selectorItems: ".ticket-search-card",
    });
    return () => {
      if (ctx) ctx.revert();
    };
  }, []);

  useEffect(() => {
    if (!reservaActual || !resultadoPanelRef.current) return;
    const ctx = animarEntradaPagina(resultadoPanelRef.current, {
      selectorHeader: ".ticket-result-header",
      selectorItems: ".ticket-detail-item, .ticket-cancellation-section, .ticket-review-section",
      stagger: 0.05,
      duracion: 0.5,
      desplazamientoY: 14,
    });
    if (estadoBadgeRef.current) {
      animarPulsoSeleccion(estadoBadgeRef.current);
    }
    if (reservaActual.bloqueadaPor12Horas && avisoRestriccionRef.current) {
      animarAvisoRestriccion(avisoRestriccionRef.current);
    }
    return () => {
      if (ctx) ctx.revert();
    };
  }, [reservaActual]);

  useEffect(() => {
    if (errorConsulta && alertaErrorRef.current) {
      animarAvisoRestriccion(alertaErrorRef.current);
    }
  }, [errorConsulta]);

  const ejecutarBusqueda = async (codigoAProbar) => {
    const limpio = normalizarEntradaTicket(codigoAProbar);
    setCodigoInput(limpio);
    setErrorConsulta("");
    setNotificacionExito("");
    setConfirmandoCancelacion(false);
    setCancelacionRecienRealizada(false);
    setErrorResena("");

    const validacion = validarFormatoTicket(limpio);
    if (!validacion.valido) {
      setReservaActual(null);
      setErrorConsulta(validacion.mensaje);
      return;
    }

    setCargando(true);
    try {
      const encontrada = await consultarReservaPorTicket(validacion.codigo);
      setReservaActual(encontrada);
      setTicketsRecientes(obtenerTicketsRecientesCookie());
    } catch (err) {
      setReservaActual(null);
      setErrorConsulta(
        err.message || "No se encontró ninguna reserva asociada al código ingresado."
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    const inicial = ticketInicial || location.state?.ticket;
    if (inicial && validarFormatoTicket(inicial).valido) {
      ejecutarBusqueda(inicial);
    }
  }, [ticketInicial, location.state?.ticket]);

  const manejarSubmitConsulta = (e) => {
    e.preventDefault();
    ejecutarBusqueda(codigoInput);
  };

  const manejarConfirmarCancelacion = async () => {
    if (!reservaActual) return;
    setProcesandoCancelacion(true);
    setErrorConsulta("");
    try {
      const respuesta = await cancelarReservaPorTicket(reservaActual.ticket);
      setReservaActual(respuesta.reserva);
      setConfirmandoCancelacion(false);
      setCancelacionRecienRealizada(true);
      setNotificacionExito(
        respuesta.mensaje ||
          "Tu reserva fue cancelada correctamente y el horario ha quedado disponible."
      );
    } catch (err) {
      setCancelacionRecienRealizada(false);
      setErrorConsulta(err.message || "No fue posible cancelar la reserva.");
      setConfirmandoCancelacion(false);
    } finally {
      setProcesandoCancelacion(false);
    }
  };

  const manejarPublicarResena = async (e) => {
    e.preventDefault();
    if (!reservaActual) return;
    setErrorResena("");
    setNotificacionExito("");

    if (!comentarioResena.trim() || comentarioResena.trim().length < 5) {
      setErrorResena(
        "Por favor escribe un comentario de al menos 5 caracteres sobre el servicio recibido."
      );
      return;
    }

    setEnviandoResena(true);
    try {
      const resultado = await publicarResenaServicio({
        ticket: reservaActual.ticket,
        rating: calificacion,
        comment: comentarioResena.trim(),
      });
      setReservaActual(resultado.reserva);
      setComentarioResena("");
      setNotificacionExito(
        resultado.mensaje ||
          "¡Tu reseña ha sido publicada exitosamente y ya es visible en nuestra sección de reseñas!"
      );
    } catch (err) {
      setErrorResena(err.message || "No fue posible publicar tu reseña.");
    } finally {
      setEnviandoResena(false);
    }
  };

  return (
    <div
      ref={paginaRef}
      className={embebido ? "consulta-embebida-wrap" : "services-page-wrap section-wrap"}
    >
      <IndicadorPincelCarga
        visible={cargando || procesandoCancelacion || enviandoResena}
        mensaje={
          procesandoCancelacion
            ? "Procesando la cancelación de tu cita..."
            : enviandoResena
            ? "Publicando tu reseña verificada..."
            : "Buscando los detalles de tu cita..."
        }
        submensaje="Un momento, estamos preparando todo para ti"
      />
      <section className="services-hero-header">
        <Badge
          appearance="outline"
          size="extra-large"
          shape="circular"
          className="luxury-kicker-pill"
          icon={<Sparkle20Filled className="sparkle-dot" />}
        >
          ATENCIÓN A CLIENTAS · LUMIÈRE STUDIO
        </Badge>

        <Title1 className="hero-title">
          Consultar mi Cita en
          <span className="shimmer-headline">Lumière Studio</span>
        </Title1>

        <Body1 className="hero-description">
          Ingresa el código de tu cita (3 letras y 3 números, por ejemplo: LUX193) para revisar el estado de tu reserva, conservar tu comprobante, cancelar tu cita o calificar tu experiencia en el salón.
        </Body1>
      </section>

      <div className="ticket-lookup-container">
        <form className="booking-form-card ticket-search-card" onSubmit={manejarSubmitConsulta}>
          <Title3 className="booking-step-title">Ingresa tu Código de Reserva</Title3>
          <Text className="ticket-helper-text">
            Escribe las 3 letras y 3 números de tu ticket de cita (ejemplo: NAI482, LUX193).
          </Text>

          <div className="ticket-input-row">
            <input
              type="text"
              value={codigoInput}
              onChange={(e) => {
                setCodigoInput(normalizarEntradaTicket(e.target.value));
                if (errorConsulta) setErrorConsulta("");
              }}
              placeholder="Ej: LUX193"
              maxLength={6}
              className="ticket-code-input"
              aria-label="Código de reserva de 3 letras y 3 números"
            />

            <Button
              type="submit"
              appearance="primary"
              shape="circular"
              size="large"
              className="luxury-btn primary-glow-btn ticket-search-btn"
              icon={cargando ? <Spinner size="extra-tiny" /> : <Search24Regular />}
              disabled={cargando}
            >
              {cargando ? "Consultando..." : "Consultar Cita"}
            </Button>
          </div>

          {ticketsRecientes.length > 0 && (
            <div className="recent-tickets-bar">
              <span className="recent-tickets-label">Mis tickets recientes:</span>
              <div className="recent-tickets-chips">
                {ticketsRecientes.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`recent-ticket-chip ${
                      codigoInput === t ? "recent-ticket-chip-active" : ""
                    }`}
                    onClick={() => ejecutarBusqueda(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {errorConsulta && (
            <div
              ref={alertaErrorRef}
              className="luxury-alert-box luxury-alert-error"
              role="alert"
            >
              <DismissCircle24Regular />
              <span>{errorConsulta}</span>
            </div>
          )}

          {notificacionExito && (
            <div className="luxury-alert-box luxury-alert-success" role="status">
              <CheckmarkCircle24Filled />
              <span>{notificacionExito}</span>
            </div>
          )}
        </form>

        {reservaActual && (
          <div
            ref={resultadoPanelRef}
            className="booking-summary-card ticket-result-panel"
          >
            <EscenaPincelCancelacion
              visible={cancelacionRecienRealizada && reservaActual.estado === "cancelada"}
              ticket={reservaActual.ticket}
            />

            <div className="ticket-result-header">
              <div>
                <span className="ticket-badge-kicker">TICKET DE RESERVA</span>
                <Title2 className="ticket-code-display">{reservaActual.ticket}</Title2>
              </div>

              <span
                ref={estadoBadgeRef}
                className={`reservation-status-pill status-${reservaActual.estado}`}
              >
                {ETIQUETAS_ESTADO[reservaActual.estado] || reservaActual.estado}
              </span>
            </div>

            <Divider className="review-divider" />

            <div className="ticket-details-grid">
              <div className="ticket-detail-item">
                <span className="ticket-detail-label">Nombre de la clienta</span>
                <strong className="ticket-detail-value">{reservaActual.nombreClienta}</strong>
              </div>

              <div className="ticket-detail-item">
                <span className="ticket-detail-label">Servicio reservado</span>
                <strong className="ticket-detail-value">{reservaActual.servicioNombre}</strong>
              </div>

              <div className="ticket-detail-item">
                <span className="ticket-detail-label">Especialista asignada</span>
                <strong className="ticket-detail-value">{reservaActual.especialistaNombre}</strong>
              </div>

              <div className="ticket-detail-item">
                <span className="ticket-detail-label">Fecha y hora</span>
                <strong className="ticket-detail-value">
                  {reservaActual.fecha} · {reservaActual.horaFormateada}
                </strong>
              </div>

              <div className="ticket-detail-item">
                <span className="ticket-detail-label">Precio del servicio</span>
                <strong className="ticket-detail-value ticket-price-highlight">
                  {reservaActual.precio}
                </strong>
              </div>

              <div className="ticket-detail-item">
                <span className="ticket-detail-label">Estado de la reserva</span>
                <strong className="ticket-detail-value">
                  {ETIQUETAS_ESTADO[reservaActual.estado] || reservaActual.estado}
                </strong>
              </div>
            </div>

            <div className="receipt-actions-row">
              <Button
                appearance="primary"
                shape="circular"
                size="medium"
                className="luxury-btn primary-glow-btn"
                onClick={() => descargarComprobanteReserva(reservaActual)}
              >
                Descargar Comprobante
              </Button>

              <Button
                appearance="primary"
                shape="circular"
                size="medium"
                className="luxury-btn primary-glow-btn"
                icon={<Print24Regular />}
                onClick={() => imprimirComprobanteReserva(reservaActual)}
              >
                Imprimir Comprobante
              </Button>
            </div>

            <Divider className="review-divider" />

            <div className="ticket-cancellation-section">
              <Title3 className="booking-step-title">Gestión y Cancelación de Cita</Title3>

              {reservaActual.puedeCancelar ? (
                <>
                  <Text className="ticket-helper-text">
                    Puedes cancelar tu reserva sin costo con al menos 12 horas de anticipación a la fecha y hora programadas. Al cancelar, el horario se liberará inmediatamente.
                  </Text>

                  {!confirmandoCancelacion ? (
                    <Button
                      appearance="primary"
                      shape="circular"
                      size="medium"
                      className="luxury-btn primary-glow-btn cancel-trigger-btn"
                      icon={<CalendarCancel24Regular />}
                      onClick={() => setConfirmandoCancelacion(true)}
                    >
                      Cancelar mi Cita
                    </Button>
                  ) : (
                    <div className="cancel-confirm-modal">
                      <Title3 className="cancel-confirm-title">
                        ¿Estás segura de que deseas cancelar la cita {reservaActual.ticket}?
                      </Title3>
                      <Text className="cancel-confirm-text">
                        Esta acción actualizará el estado de tu cita a "Cancelada" y liberará el horario de las {reservaActual.horaFormateada} con {reservaActual.especialistaNombre}.
                      </Text>
                      <div className="cancel-confirm-buttons">
                        <Button
                          appearance="primary"
                          shape="circular"
                          size="medium"
                          className="luxury-btn primary-glow-btn"
                          disabled={procesandoCancelacion}
                          onClick={manejarConfirmarCancelacion}
                        >
                          {procesandoCancelacion ? "Cancelando..." : "Sí, confirmar cancelación"}
                        </Button>
                        <Button
                          appearance="outline"
                          shape="circular"
                          size="medium"
                          className="luxury-btn outline-glow-btn"
                          disabled={procesandoCancelacion}
                          onClick={() => setConfirmandoCancelacion(false)}
                        >
                          Conservar mi cita
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div
                  ref={avisoRestriccionRef}
                  className={`ticket-info-notice ${
                    reservaActual.bloqueadaPor12Horas ? "ticket-notice-restricted" : ""
                  }`}
                >
                  {reservaActual.estado === "cancelada"
                    ? "Esta reserva ya se encuentra cancelada y su horario fue liberado."
                    : reservaActual.estado === "realizada"
                    ? "Esta cita ya fue completada por nuestro equipo, por lo que no puede cancelarse."
                    : reservaActual.bloqueadaPor12Horas
                    ? "No es posible cancelar esta cita porque faltan menos de 12 horas para la fecha y hora programadas. Recuerda que las cancelaciones deben realizarse con un mínimo de 12 horas de anticipación."
                    : "El horario programado para esta cita ya ha pasado, por lo que no es posible cancelarla."}
                </div>
              )}
            </div>

            <Divider className="review-divider" />

            <div className="ticket-review-section">
              <Title3 className="booking-step-title">Reseña y Calificación del Servicio</Title3>

              {reservaActual.resena ? (
                <div className="registered-review-box">
                  <div className="registered-review-top">
                    <span className="review-stars">
                      {"★".repeat(reservaActual.resena.rating)}
                    </span>
                    <Badge appearance="tint" shape="circular" className="review-service-badge">
                      <span className="review-service-text">Reseña Registrada</span>
                    </Badge>
                  </div>
                  <Body1 className="review-comment">
                    “{reservaActual.resena.comment}”
                  </Body1>
                  <Text className="ticket-helper-text">
                    Ya registraste una reseña para esta reserva ({reservaActual.servicioNombre}). Solo se permite una reseña por cita.
                  </Text>
                </div>
              ) : reservaActual.puedeResenar ? (
                <form className="review-publish-form" onSubmit={manejarPublicarResena}>
                  <Text className="ticket-helper-text">
                    ¡Tu servicio ha sido completado! Cuéntanos cómo fue tu experiencia con {reservaActual.servicioNombre}.
                  </Text>

                  <div className="star-rating-selector" role="radiogroup" aria-label="Calificación en estrellas">
                    {[1, 2, 3, 4, 5].map((estrella) => (
                      <button
                        key={estrella}
                        type="button"
                        className={`star-select-btn ${
                          estrella <= calificacion ? "star-select-active" : ""
                        }`}
                        onClick={() => setCalificacion(estrella)}
                        aria-label={`${estrella} estrellas`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="star-rating-label">{calificacion} de 5 estrellas</span>
                  </div>

                  <div className="booking-field-group">
                    <label className="booking-label" htmlFor="comentario-resena">
                      Tu opinión sobre el servicio *
                    </label>
                    <textarea
                      id="comentario-resena"
                      rows={3}
                      className="luxury-textarea"
                      placeholder="Escribe aquí qué te pareció el acabado, la atención y tu experiencia en Lumière Studio..."
                      value={comentarioResena}
                      onChange={(e) => setComentarioResena(e.target.value)}
                      required
                    />
                  </div>

                  {errorResena && (
                    <div className="luxury-alert-box luxury-alert-error" role="alert">
                      <DismissCircle24Regular />
                      <span>{errorResena}</span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    appearance="primary"
                    shape="circular"
                    size="large"
                    className="luxury-btn primary-glow-btn"
                    disabled={enviandoResena}
                  >
                    {enviandoResena ? "Publicando reseña..." : "Publicar Reseña Verificada"}
                  </Button>
                </form>
              ) : (
                <div className="ticket-info-notice">
                  {reservaActual.estado === "cancelada"
                    ? "Las citas canceladas no pueden recibir reseñas."
                    : `Tu cita figura actualmente como "${ETIQUETAS_ESTADO[reservaActual.estado] || reservaActual.estado}". Podrás publicar tu reseña tan pronto como el salón apruebe la cita como "Realizada".`}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
