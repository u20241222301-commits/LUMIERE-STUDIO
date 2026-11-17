import { useEffect, useRef, useState } from "react";
import {
  Badge,
  Body1,
  Button,
  Input,
  Spinner,
  Text,
  Title1,
  Title3,
} from "@fluentui/react-components";
import {
  CheckmarkCircle24Filled,
  Delete20Regular,
  DismissCircle24Regular,
  LockClosed24Regular,
  Sparkle20Filled,
} from "@fluentui/react-icons";
import { useLocation } from "react-router-dom";
import {
  actualizarEstadoReservaAdmin,
  eliminarResenaAdmin,
  obtenerDatosPanelAdmin,
} from "../services/sistemaReservas";
import IndicadorPincelCarga from "./IndicadorPincelCarga";
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

const CLAVE_SESION_ADMIN = "lumiere_admin_pin_sesion";

export default function PaginaAdmin() {
  const location = useLocation();
  const [pinAcceso, setPinAcceso] = useState("");
  const [autenticado, setAutenticado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [errorAdmin, setErrorAdmin] = useState("");
  const [mensajeAdmin, setMensajeAdmin] = useState("");

  const [pestanaAdmin, setPestanaAdmin] = useState("reservas");
  const [filtroEstado, setFiltroEstado] = useState("todas");
  const [busquedaTicket, setBusquedaTicket] = useState("");

  const [reservas, setReservas] = useState([]);
  const [resenas, setResenas] = useState([]);
  const [googleCalendarConectado, setGoogleCalendarConectado] = useState(false);
  const [procesandoAccion, setProcesandoAccion] = useState(false);

  const paginaRef = useRef(null);
  const dashboardRef = useRef(null);
  const alertaErrorRef = useRef(null);

  useEffect(() => {
    const ctx = animarEntradaPagina(paginaRef.current, {
      selectorHeader: ".services-hero-header",
      selectorItems: ".admin-login-card, .admin-dashboard-wrap",
    });
    return () => {
      if (ctx) ctx.revert();
    };
  }, []);

  useEffect(() => {
    if (!autenticado || !dashboardRef.current) return;
    const ctx = animarEntradaPagina(dashboardRef.current, {
      selectorHeader: "",
      selectorItems: ".booking-form-card, .admin-reservation-row",
      stagger: 0.05,
      duracion: 0.45,
      desplazamientoY: 14,
    });
    return () => {
      if (ctx) ctx.revert();
    };
  }, [autenticado, pestanaAdmin, filtroEstado]);

  useEffect(() => {
    if (errorAdmin && alertaErrorRef.current) {
      animarAvisoRestriccion(alertaErrorRef.current);
    }
  }, [errorAdmin]);

  const cargarPanel = async (clave) => {
    const claveLimpia = String(clave || "").trim();
    if (!claveLimpia) {
      setErrorAdmin("Por favor ingresa la contraseña de autorización del panel.");
      return;
    }

    setCargando(true);
    setErrorAdmin("");
    try {
      const data = await obtenerDatosPanelAdmin(claveLimpia);
      setReservas(Array.isArray(data.reservas) ? data.reservas : []);
      setResenas(Array.isArray(data.resenas) ? data.resenas : []);
      setGoogleCalendarConectado(
        Boolean(
          data.estadoIntegraciones?.googleCalendarConectado ||
            data.googleCalendarConectado
        )
      );
      setPinAcceso(claveLimpia);
      setAutenticado(true);
      try {
        sessionStorage.setItem(CLAVE_SESION_ADMIN, claveLimpia);
      } catch {
        return;
      }
    } catch (err) {
      setAutenticado(false);
      setErrorAdmin(
        err.message || "Contraseña incorrecta. No fue posible autorizar el acceso al panel."
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("google") === "conectado") {
      setMensajeAdmin(
        "Cuenta de Google Calendar conectada y autorizada exitosamente."
      );
      try {
        const pinGuardado = sessionStorage.getItem(CLAVE_SESION_ADMIN);
        if (pinGuardado) {
          cargarPanel(pinGuardado);
        }
      } catch {
        return;
      }
    }
  }, [location.search]);

  const manejarLoginAdmin = (e) => {
    e.preventDefault();
    cargarPanel(pinAcceso);
  };

  const manejarCerrarSesionAdmin = () => {
    setAutenticado(false);
    setPinAcceso("");
    setErrorAdmin("");
    setMensajeAdmin("");
    try {
      sessionStorage.removeItem(CLAVE_SESION_ADMIN);
    } catch {
      return;
    }
  };

  const manejarCambioEstado = async (ticket, nuevoEstado, botonEl) => {
    setErrorAdmin("");
    setMensajeAdmin("");
    if (botonEl) animarPulsoSeleccion(botonEl);
    setProcesandoAccion(true);
    try {
      const respuesta = await actualizarEstadoReservaAdmin({
        pin: pinAcceso,
        ticket,
        estado: nuevoEstado,
      });
      setMensajeAdmin(
        respuesta.mensaje ||
          `El estado de la reserva ${ticket} fue actualizado a "${nuevoEstado}".`
      );
      await cargarPanel(pinAcceso);
    } catch (err) {
      setErrorAdmin(err.message || "Error al actualizar el estado de la cita.");
    } finally {
      setProcesandoAccion(false);
    }
  };

  const manejarEliminarResena = async (idResena) => {
    setErrorAdmin("");
    setMensajeAdmin("");
    try {
      await eliminarResenaAdmin({ pin: pinAcceso, id: idResena });
      setMensajeAdmin("Reseña eliminada correctamente.");
      await cargarPanel(pinAcceso);
    } catch (err) {
      setErrorAdmin(err.message || "No se pudo eliminar la reseña.");
    }
  };

  const reservasFiltradas = reservas.filter((r) => {
    const coincideEstado =
      filtroEstado === "todas" ? true : r.estado === filtroEstado;
    const termino = busquedaTicket.trim().toUpperCase();
    const coincideBusqueda = !termino
      ? true
      : String(r.ticket || "")
          .toUpperCase()
          .includes(termino) ||
        String(r.nombreClienta || "")
          .toUpperCase()
          .includes(termino) ||
        String(r.servicioNombre || "")
          .toUpperCase()
          .includes(termino);
    return coincideEstado && coincideBusqueda;
  });

  return (
    <div ref={paginaRef} className="services-page-wrap section-wrap">
      <IndicadorPincelCarga
        visible={cargando || procesandoAccion}
        mensaje="Actualizando gestión administrativa..."
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
          GESTIÓN INTERNA · PERSONAL AUTORIZADO LUMIÈRE STUDIO
        </Badge>

        <Title1 className="hero-title">
          Panel Administrativo
          <span className="shimmer-headline">Control de Reservas</span>
        </Title1>

        <Body1 className="hero-description">
          Administra las citas y tickets registrados, sincroniza tus eventos con Google Calendar y gestiona las reseñas verificadas de las clientas.
        </Body1>
      </section>

      {!autenticado ? (
        <form className="booking-form-card admin-login-card" onSubmit={manejarLoginAdmin}>
          <Title3 className="booking-step-title">
            <LockClosed24Regular /> Autorización de Acceso al Panel
          </Title3>
          <Text className="ticket-helper-text">
            Ingresa la contraseña administrativa del estudio para visualizar y gestionar las citas y reseñas.
          </Text>
          <div className="ticket-input-row">
            <Input
              type="password"
              size="large"
              value={pinAcceso}
              onChange={(_, d) => {
                setPinAcceso(d.value);
                setErrorAdmin("");
              }}
              placeholder="Contraseña del panel administrativo"
              required
            />
            <Button
              type="submit"
              appearance="primary"
              shape="circular"
              size="large"
              className="luxury-btn primary-glow-btn"
              disabled={cargando}
            >
              {cargando ? <Spinner size="extra-tiny" /> : "Autorizar e Ingresar"}
            </Button>
          </div>
          {mensajeAdmin && (
            <div className="luxury-alert-box luxury-alert-success" role="status">
              <CheckmarkCircle24Filled />
              <span>{mensajeAdmin}</span>
            </div>
          )}
          {errorAdmin && (
            <div
              ref={alertaErrorRef}
              className="luxury-alert-box luxury-alert-error"
              role="alert"
            >
              <DismissCircle24Regular />
              <span>{errorAdmin}</span>
            </div>
          )}
        </form>
      ) : (
        <div ref={dashboardRef} className="admin-dashboard-wrap">
          <div className="services-category-tabs" role="tablist">
            <button
              type="button"
              className={`service-tab-pill ${
                pestanaAdmin === "reservas" ? "service-tab-active" : ""
              }`}
              onClick={(e) => {
                animarPulsoSeleccion(e.currentTarget);
                setPestanaAdmin("reservas");
              }}
            >
              Citas y Tickets ({reservas.length})
            </button>
            <button
              type="button"
              className={`service-tab-pill ${
                pestanaAdmin === "resenas" ? "service-tab-active" : ""
              }`}
              onClick={(e) => {
                animarPulsoSeleccion(e.currentTarget);
                setPestanaAdmin("resenas");
              }}
            >
              Reseñas Recibidas ({resenas.length})
            </button>
            <button
              type="button"
              className="service-tab-pill"
              onClick={manejarCerrarSesionAdmin}
            >
              Bloquear Panel
            </button>
          </div>

          {mensajeAdmin && (
            <div className="luxury-alert-box luxury-alert-success" role="status">
              <CheckmarkCircle24Filled />
              <span>{mensajeAdmin}</span>
            </div>
          )}

          {errorAdmin && (
            <div
              ref={alertaErrorRef}
              className="luxury-alert-box luxury-alert-error"
              role="alert"
            >
              <DismissCircle24Regular />
              <span>{errorAdmin}</span>
            </div>
          )}

          {pestanaAdmin === "reservas" && (
            <div className="booking-form-card">
              <div className="admin-filters-bar">
                <div className="admin-status-filters">
                  {["todas", "pendiente", "confirmada", "realizada", "cancelada"].map(
                    (est) => (
                      <button
                        key={est}
                        type="button"
                        className={`recent-ticket-chip ${
                          filtroEstado === est ? "recent-ticket-chip-active" : ""
                        }`}
                        onClick={() => setFiltroEstado(est)}
                      >
                        {est === "todas"
                          ? "Todas"
                          : ETIQUETAS_ESTADO[est] || est}
                      </button>
                    )
                  )}
                </div>

                <Input
                  size="medium"
                  placeholder="Buscar por ticket (ej: LUX193) o clienta..."
                  value={busquedaTicket}
                  onChange={(_, d) => setBusquedaTicket(d.value)}
                />
              </div>

              {reservasFiltradas.length === 0 ? (
                <div className="ticket-info-notice">
                  No se encontraron reservas con los filtros seleccionados.
                </div>
              ) : (
                <div className="admin-reservations-list">
                  {reservasFiltradas.map((resItem) => (
                    <div key={resItem.id} className="admin-reservation-row">
                      <div className="admin-res-main">
                        <div className="admin-res-top">
                          <span className="admin-ticket-pill">{resItem.ticket}</span>
                          <span
                            className={`reservation-status-pill status-${resItem.estado}`}
                          >
                            {ETIQUETAS_ESTADO[resItem.estado] || resItem.estado}
                          </span>
                          <strong className="admin-res-service">
                            {resItem.servicioNombre} ({resItem.precio})
                          </strong>
                        </div>

                        <div className="admin-res-meta">
                          <span>
                            <strong>Clienta:</strong> {resItem.nombreClienta} · Tel:{" "}
                            {resItem.telefonoClienta}
                          </span>
                          <span>
                            <strong>Especialista:</strong> {resItem.especialistaNombre}
                          </span>
                          <span>
                            <strong>Fecha y Hora:</strong> {resItem.fecha} ·{" "}
                            {resItem.horaFormateada || resItem.hora} ({resItem.duracionTexto})
                          </span>
                          <span>
                            <strong>Calendar:</strong>{" "}
                            {resItem.googleCalendarStatus === "sincronizado"
                              ? "✓ Guardado automáticamente en Google Calendar"
                              : resItem.googleCalendarStatus === "cancelado_en_google"
                              ? "Cancelado en Google Calendar"
                              : resItem.googleCalendarStatus || "pendiente_config"}
                          </span>
                        </div>
                      </div>

                      <div className="admin-res-actions">
                        <Button
                          size="small"
                          shape="circular"
                          appearance="primary"
                          className="luxury-btn primary-glow-btn"
                          disabled={resItem.estado === "confirmada"}
                          onClick={(e) =>
                            manejarCambioEstado(
                              resItem.ticket,
                              "confirmada",
                              e.currentTarget
                            )
                          }
                        >
                          Marcar Confirmada
                        </Button>

                        <Button
                          size="small"
                          shape="circular"
                          appearance="primary"
                          className="luxury-btn primary-glow-btn"
                          disabled={
                            resItem.estado === "realizada" ||
                            resItem.estado === "cancelada"
                          }
                          title={
                            resItem.estado === "cancelada"
                              ? "Una cita cancelada no puede marcarse como realizada"
                              : undefined
                          }
                          onClick={(e) =>
                            manejarCambioEstado(
                              resItem.ticket,
                              "realizada",
                              e.currentTarget
                            )
                          }
                        >
                          Marcar Realizada
                        </Button>

                        <Button
                          size="small"
                          shape="circular"
                          appearance="outline"
                          className="luxury-btn outline-glow-btn"
                          disabled={resItem.estado === "cancelada"}
                          onClick={(e) =>
                            manejarCambioEstado(
                              resItem.ticket,
                              "cancelada",
                              e.currentTarget
                            )
                          }
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {pestanaAdmin === "resenas" && (
            <div className="booking-form-card">
              <Title3 className="booking-step-title">
                Reseñas Publicadas por las Clientas
              </Title3>
              <div className="admin-reservations-list">
                {resenas.map((rev) => (
                  <div key={rev.id} className="admin-reservation-row">
                    <div className="admin-res-main">
                      <div className="admin-res-top">
                        <span className="admin-ticket-pill">
                          {rev.ticket || "VERIFICADA"}
                        </span>
                        <span className="review-stars">
                          {"★".repeat(rev.rating || 5)}
                        </span>
                        <strong>{rev.name}</strong>
                      </div>
                      <Text className="booking-summary-line">
                        <strong>Servicio:</strong> {rev.service}
                      </Text>
                      <Body1 className="review-comment">“{rev.comment}”</Body1>
                    </div>

                    <div className="admin-res-actions">
                      <button
                        type="button"
                        className="booking-delete-btn"
                        onClick={() => manejarEliminarResena(rev.id)}
                        aria-label="Eliminar reseña"
                      >
                        <Delete20Regular />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
