import { useEffect, useMemo, useRef, useState } from "react";
import {
  Badge,
  Body1,
  Button,
  Divider,
  Input,
  Spinner,
  Text,
  Title1,
  Title3,
} from "@fluentui/react-components";
import {
  CalendarAdd24Regular,
  CheckmarkCircle24Filled,
  ChevronLeft24Regular,
  ChevronRight24Regular,
  Clock20Regular,
  DismissCircle24Regular,
  Info24Regular,
  Person20Regular,
  Print24Regular,
  Sparkle20Filled,
} from "@fluentui/react-icons";
import { useLocation } from "react-router-dom";
import { initialSpecialists, servicesCatalog } from "../data/homeData";
import {
  consultarDisponibilidadHoraria,
  descargarComprobanteReserva,
  extraerMinutosDuracion,
  formatearHora12,
  imprimirComprobanteReserva,
  obtenerAhoraColombia,
  obtenerEspecialistasSistema,
  registrarNuevaReserva,
} from "../services/sistemaReservas";
import IndicadorPincelCarga, {
  EscenaPincelConfirmacion,
} from "./IndicadorPincelCarga";
import {
  animarAvisoRestriccion,
  animarEntradaPagina,
  animarPulsoSeleccion,
} from "../utils/gsapAnimations";

const NOMBRES_MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const DIAS_SEMANA_CORTOS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

const ETIQUETAS_ESTADO = {
  pendiente: "Pendiente",
  confirmada: "Confirmada",
  realizada: "Realizada",
  cancelada: "Cancelada",
};

function construirMatrizCalendario(anio, mesIndex) {
  const primerDiaMes = new Date(anio, mesIndex, 1);
  const totalDiasMes = new Date(anio, mesIndex + 1, 0).getDate();
  const diaSemanaJS = primerDiaMes.getDay();
  const offsetLunes = diaSemanaJS === 0 ? 6 : diaSemanaJS - 1;

  const celdas = [];
  for (let i = 0; i < offsetLunes; i++) {
    celdas.push(null);
  }

  const pad = (n) => String(n).padStart(2, "0");
  for (let dia = 1; dia <= totalDiasMes; dia++) {
    const fechaISO = `${anio}-${pad(mesIndex + 1)}-${pad(dia)}`;
    celdas.push({
      dia,
      fechaISO,
    });
  }

  return celdas;
}

export default function PaginaReservas({ servicioInicial }) {
  const location = useLocation();

  const [ahoraCol, setAhoraCol] = useState(() => obtenerAhoraColombia());
  const hoyColombia = ahoraCol.fechaHoy;

  const [anioHoy, mesHoy] = useMemo(() => {
    const [a, m] = hoyColombia.split("-").map(Number);
    return [a, m - 1];
  }, [hoyColombia]);

  const [disenoInspiracion, setDisenoInspiracion] = useState(
    () => location.state?.disenoInspiracion || null
  );

  const opcionServicioInspiracion = useMemo(
    () => ({
      id: "imagen-inspiracion",
      name: "Imagen de Inspiración",
      duration: "90 min",
      price: "$ A calcular en cita",
    }),
    []
  );

  const catalogoServiciosReserva = useMemo(
    () =>
      disenoInspiracion
        ? [opcionServicioInspiracion, ...servicesCatalog]
        : servicesCatalog,
    [disenoInspiracion, opcionServicioInspiracion]
  );

  const servicioPreseleccionado =
    location.state?.selectedService || servicioInicial || servicesCatalog[0].name;
  const especialistaPreseleccionada = location.state?.selectedSpecialistId || "";

  const encontrado = disenoInspiracion
    ? opcionServicioInspiracion
    : servicesCatalog.find((s) => s.name === servicioPreseleccionado) ||
      servicesCatalog[0];

  const [especialistas, setEspecialistas] = useState(initialSpecialists);
  const [servicioId, setServicioId] = useState(encontrado.id);
  const [especialistaId, setEspecialistaId] = useState(
    especialistaPreseleccionada || initialSpecialists[0].id
  );
  const [fecha, setFecha] = useState(hoyColombia);
  const [mesCalendario, setMesCalendario] = useState(() => ({
    anio: anioHoy,
    mes: mesHoy,
  }));
  const [hora, setHora] = useState("");
  const [nombreClienta, setNombreClienta] = useState("");
  const [telefonoClienta, setTelefonoClienta] = useState("");
  const [correoClienta, setCorreoClienta] = useState("");
  const [notas, setNotas] = useState(
    () => location.state?.inspirationNote || ""
  );

  const [festivosColombia, setFestivosColombia] = useState([]);
  const [horariosDia, setHorariosDia] = useState([]);
  const [cargandoHorarios, setCargandoHorarios] = useState(false);
  const [guardandoReserva, setGuardandoReserva] = useState(false);
  const [errorReserva, setErrorReserva] = useState("");
  const [comprobanteGenerado, setComprobanteGenerado] = useState(null);
  const paginaRef = useRef(null);
  const horariosGridRef = useRef(null);
  const alertaErrorRef = useRef(null);
  const comprobanteRef = useRef(null);

  useEffect(() => {
    const ctx = animarEntradaPagina(paginaRef.current, {
      selectorHeader: ".services-hero-header",
      selectorItems:
        ".booking-col-left .booking-step-block, .booking-col-right .booking-step-block, .booking-policies-card",
      stagger: 0.09,
    });
    return () => {
      if (ctx) ctx.revert();
    };
  }, []);

  useEffect(() => {
    if (!horariosGridRef.current || horariosDia.length === 0) return;
    const ctx = animarEntradaPagina(horariosGridRef.current, {
      selectorHeader: "",
      selectorItems: ".booking-time-card",
      stagger: 0.035,
      duracion: 0.38,
      desplazamientoY: 10,
    });
    return () => {
      if (ctx) ctx.revert();
    };
  }, [horariosDia]);

  useEffect(() => {
    if (errorReserva && alertaErrorRef.current) {
      animarAvisoRestriccion(alertaErrorRef.current);
    }
  }, [errorReserva]);

  useEffect(() => {
    if (comprobanteGenerado && comprobanteRef.current) {
      comprobanteRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [comprobanteGenerado]);

  useEffect(() => {
    obtenerEspecialistasSistema().then((lista) => {
      if (Array.isArray(lista) && lista.length > 0) {
        setEspecialistas(lista);
      }
    });
  }, []);

  useEffect(() => {
    const anioActual = new Date().getFullYear();
    fetch(`https://date.nager.at/api/v3/PublicHolidays/${anioActual}/CO`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) {
          setFestivosColombia(data);
        }
      })
      .catch(() => {
        setFestivosColombia([]);
      });
  }, []);

  const servicioSeleccionado =
    catalogoServiciosReserva.find((s) => s.id === servicioId) ||
    catalogoServiciosReserva[0];
  const especialistaSeleccionada =
    especialistas.find((e) => e.id === especialistaId) || especialistas[0];

  const duracionMinutos = extraerMinutosDuracion(servicioSeleccionado.duration);
  const infoFestivo = festivosColombia.find((f) => f.date === fecha);
  const diaSemana = fecha ? new Date(`${fecha}T12:00:00-05:00`).getUTCDay() : 1;
  const esDomingoOFestivo = diaSemana === 0 || Boolean(infoFestivo);

  const celdasMesActual = useMemo(
    () => construirMatrizCalendario(mesCalendario.anio, mesCalendario.mes),
    [mesCalendario.anio, mesCalendario.mes]
  );

  const puedeRetrocederMes =
    mesCalendario.anio > anioHoy ||
    (mesCalendario.anio === anioHoy && mesCalendario.mes > mesHoy);

  const cambiarMes = (delta) => {
    setMesCalendario((prev) => {
      const nuevaFecha = new Date(prev.anio, prev.mes + delta, 1);
      const nuevoAnio = nuevaFecha.getFullYear();
      const nuevoMes = nuevaFecha.getMonth();
      if (
        nuevoAnio < anioHoy ||
        (nuevoAnio === anioHoy && nuevoMes < mesHoy)
      ) {
        return { anio: anioHoy, mes: mesHoy };
      }
      return { anio: nuevoAnio, mes: nuevoMes };
    });
  };

  const cargarDisponibilidad = async (fechaConsulta, espId, durMin, festivoFlag) => {
    setCargandoHorarios(true);
    try {
      const respuesta = await consultarDisponibilidadHoraria({
        fecha: fechaConsulta,
        especialistaId: espId,
        duracionMinutos: durMin,
        esFestivo: festivoFlag,
      });
      if (respuesta?.ahoraColombia) {
        setAhoraCol(respuesta.ahoraColombia);
      }
      const lista = Array.isArray(respuesta?.horarios) ? respuesta.horarios : [];
      setHorariosDia(lista);

      const primerDisponible = lista.find((item) => item.disponible);
      setHora((horaPrevia) => {
        const sigueDisponible = lista.some(
          (item) => item.hora === horaPrevia && item.disponible
        );
        if (sigueDisponible) return horaPrevia;
        return primerDisponible ? primerDisponible.hora : "";
      });
    } finally {
      setCargandoHorarios(false);
    }
  };

  useEffect(() => {
    cargarDisponibilidad(
      fecha,
      especialistaId,
      duracionMinutos,
      Boolean(infoFestivo)
    );
  }, [fecha, especialistaId, duracionMinutos, Boolean(infoFestivo)]);

  const seleccionarDiaCalendario = (fechaISO) => {
    const { fechaHoy } = obtenerAhoraColombia();
    setErrorReserva("");
    if (fechaISO < fechaHoy) {
      return;
    }
    setFecha(fechaISO);
  };

  const manejarEnvioReserva = async (e) => {
    e.preventDefault();
    setErrorReserva("");

    const { fechaHoy } = obtenerAhoraColombia();
    if (!fecha || fecha < fechaHoy) {
      setErrorReserva("No es posible agendar en una fecha anterior a hoy.");
      return;
    }

    if (!hora) {
      setErrorReserva(
        "Por favor selecciona un horario disponible para tu cita."
      );
      return;
    }

    if (!nombreClienta.trim() || !telefonoClienta.trim()) {
      setErrorReserva("Por favor ingresa tu nombre completo y tu número de contacto.");
      return;
    }

    setGuardandoReserva(true);
    try {
      const reservaCreada = await registrarNuevaReserva({
        servicioId: servicioSeleccionado.id,
        servicioNombre: servicioSeleccionado.name,
        precio: servicioSeleccionado.price,
        duracionTexto: servicioSeleccionado.duration,
        duracionMinutos,
        especialistaId: especialistaSeleccionada.id,
        fecha,
        hora,
        nombreClienta: nombreClienta.trim(),
        telefonoClienta: telefonoClienta.trim(),
        correoClienta: correoClienta.trim(),
        notas: notas.trim(),
      });

      setComprobanteGenerado(reservaCreada);
      await cargarDisponibilidad(
        fecha,
        especialistaId,
        duracionMinutos,
        Boolean(infoFestivo)
      );
    } catch (err) {
      setErrorReserva(
        err.message || "Ocurrió un error al registrar tu reserva. Verifica el horario seleccionado."
      );
      await cargarDisponibilidad(
        fecha,
        especialistaId,
        duracionMinutos,
        Boolean(infoFestivo)
      );
    } finally {
      setGuardandoReserva(false);
    }
  };

  return (
    <div ref={paginaRef} className="services-page-wrap section-wrap">
      <IndicadorPincelCarga
        visible={guardandoReserva}
        mensaje="Preparando tu experiencia en Lumière Studio..."
        submensaje="Estamos registrando tu cita y sincronizando tu agenda"
      />
      <section className="services-hero-header">
        <Badge
          appearance="outline"
          size="extra-large"
          shape="circular"
          className="luxury-kicker-pill"
          icon={<Sparkle20Filled className="sparkle-dot" />}
        >
          AGENDA DE CITAS · LUMIÈRE STUDIO
        </Badge>

        <Title1 className="hero-title">
          Reserva tu Cita en
          <span className="shimmer-headline">Lumière Studio</span>
        </Title1>

        <Body1 className="hero-description">
          Selecciona tu servicio de manicura, pedicura o ritual de spa, elige tu especialista y agenda el día y la hora de tu preferencia.
        </Body1>
      </section>

      <form className="booking-form-card booking-two-col-form" onSubmit={manejarEnvioReserva}>
        <div className="booking-columns-container">
          <div className="booking-col-left">
            <div className="booking-step-block">
              <Title3 className="booking-step-title">1. Elige tu Servicio</Title3>

              {disenoInspiracion && (
                <div className="booking-inspiration-ref-box">
                  <img
                    src={disenoInspiracion.imagenRegularUrl}
                    alt={disenoInspiracion.titulo}
                    className="booking-inspiration-ref-img"
                  />
                  <div className="booking-inspiration-ref-info">
                    <span className="booking-inspiration-ref-kicker">
                      ✦ IMAGEN DE INSPIRACIÓN SELECCIONADA
                    </span>
                    <strong className="booking-inspiration-ref-title">
                      {disenoInspiracion.titulo}
                    </strong>
                    <span className="booking-inspiration-ref-sub">
                      <strong>$ Precio:</strong> El valor será calculado al estar en la cita según el servicio de inspiración elegido.
                    </span>
                  </div>
                  <button
                    type="button"
                    className="inspiracion-clear-btn"
                    onClick={() => {
                      setDisenoInspiracion(null);
                      if (servicioId === "imagen-inspiracion") {
                        setServicioId(servicesCatalog[0].id);
                      }
                    }}
                  >
                    Quitar imagen
                  </button>
                </div>
              )}

              <div className="luxury-services-widget">
                <div className="luxury-services-columns-header" aria-hidden="true">
                  <span className="services-col-label col-start">Servicio</span>
                  <span className="services-col-label col-center">Duración</span>
                  <span className="services-col-label col-end">Precio</span>
                </div>

                <ul className="booking-services-simple-list">
                  {catalogoServiciosReserva.map((serv) => {
                    const activo = serv.id === servicioId;
                    return (
                      <li
                        key={serv.id}
                        className={`booking-service-simple-item ${
                          activo ? "booking-service-simple-active" : ""
                        }`}
                        onClick={(e) => {
                          setServicioId(serv.id);
                          setErrorReserva("");
                          animarPulsoSeleccion(e.currentTarget);
                        }}
                      >
                        <div className="booking-simple-name-wrap">
                          <span
                            className={`calendar-day-dot ${
                              activo ? "calendar-dot-selected" : ""
                            }`}
                          />
                          <span className="booking-simple-name">{serv.name}</span>
                        </div>

                        <div className="booking-simple-duration-wrap">
                          <span className="booking-simple-duration-pill">
                            <Clock20Regular className="booking-duration-icon" />
                            {serv.duration}
                          </span>
                        </div>

                        <div className="booking-simple-price-wrap">
                          <span className="booking-simple-price">{serv.price}</span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            <Divider className="review-divider" />

            <div className="booking-step-block">
              <Title3 className="booking-step-title">2. Selecciona tu Especialista</Title3>
              <div className="booking-specialists-grid">
                {especialistas.map((esp) => {
                  const activa = esp.id === especialistaId;
                  const tituloEsp = esp.nombreCompleto || `${esp.nombre} · ${esp.cargo}`;
                  return (
                    <button
                      key={esp.id}
                      type="button"
                      className={`booking-specialist-pill ${
                        activa ? "booking-option-active" : ""
                      }`}
                      onClick={(e) => {
                        setEspecialistaId(esp.id);
                        setErrorReserva("");
                        animarPulsoSeleccion(e.currentTarget);
                      }}
                    >
                      {esp.fotoUrl ? (
                        <img
                          src={esp.fotoUrl}
                          alt={esp.nombre}
                          className="booking-specialist-avatar"
                        />
                      ) : (
                        <Person20Regular />
                      )}
                      <div className="booking-specialist-copy">
                        <strong>{tituloEsp}</strong>
                        <span>{esp.especialidad}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="booking-col-right">
            <div className="booking-step-block">
              <Title3 className="booking-step-title">3. Selecciona la Fecha y el Horario</Title3>

              <div className="luxury-calendar-widget">
                <div className="luxury-calendar-header">
                  <button
                    type="button"
                    className="calendar-month-nav-btn"
                    disabled={!puedeRetrocederMes}
                    onClick={() => cambiarMes(-1)}
                    aria-label="Mes anterior"
                  >
                    <ChevronLeft24Regular />
                  </button>

                  <div className="calendar-month-title-box">
                    <span className="calendar-month-kicker">CALENDARIO DE RESERVAS</span>
                    <strong className="calendar-month-title">
                      {NOMBRES_MESES[mesCalendario.mes]} {mesCalendario.anio}
                    </strong>
                  </div>

                  <button
                    type="button"
                    className="calendar-month-nav-btn"
                    onClick={() => cambiarMes(1)}
                    aria-label="Mes siguiente"
                  >
                    <ChevronRight24Regular />
                  </button>
                </div>

                <div className="luxury-calendar-weekdays">
                  {DIAS_SEMANA_CORTOS.map((diaNombre) => (
                    <span key={diaNombre} className="calendar-weekday-label">
                      {diaNombre}
                    </span>
                  ))}
                </div>

                <div
                  key={`${mesCalendario.anio}-${mesCalendario.mes}`}
                  className="luxury-calendar-days-grid"
                  role="grid"
                  aria-label="Días del mes para reservar"
                >
                  {celdasMesActual.map((celda, idx) => {
                    if (!celda) {
                      return (
                        <span
                          key={`vacio-${idx}`}
                          className="calendar-day-empty"
                          aria-hidden="true"
                        />
                      );
                    }

                    const esPasado = celda.fechaISO < hoyColombia;
                    const esHoy = celda.fechaISO === hoyColombia;
                    const esSeleccionado = celda.fechaISO === fecha;
                    const esFestivoCelda = festivosColombia.some(
                      (f) => f.date === celda.fechaISO
                    );

                    return (
                      <button
                        key={celda.fechaISO}
                        type="button"
                        disabled={esPasado}
                        onClick={(e) => {
                          seleccionarDiaCalendario(celda.fechaISO);
                          animarPulsoSeleccion(e.currentTarget);
                        }}
                        className={[
                          "calendar-day-cell",
                          esPasado ? "calendar-day-disabled" : "calendar-day-available",
                          esHoy ? "calendar-day-today" : "",
                          esSeleccionado ? "calendar-day-selected" : "",
                          esFestivoCelda && !esPasado ? "calendar-day-holiday" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        aria-pressed={esSeleccionado}
                        aria-label={`Día ${celda.dia} de ${NOMBRES_MESES[mesCalendario.mes]}`}
                      >
                        {esHoy && <span className="calendar-today-tag">Hoy</span>}
                        <span className="calendar-day-number">{celda.dia}</span>
                        {!esPasado && (
                          <span
                            className={`calendar-day-dot ${
                              esSeleccionado ? "calendar-dot-selected" : ""
                            }`}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="luxury-calendar-footer">
                  <div className="calendar-legend-row">
                    <span className="calendar-legend-item">
                      <i className="legend-swatch swatch-selected" /> Seleccionado
                    </span>
                    <span className="calendar-legend-item">
                      <i className="legend-swatch swatch-today" /> Hoy
                    </span>
                    <span className="calendar-legend-item">
                      <i className="legend-swatch swatch-available" /> Disponible
                    </span>
                    <span className="calendar-legend-item">
                      <i className="legend-swatch swatch-disabled" /> No disponible
                    </span>
                  </div>

                  <div className="booking-schedule-notice">
                    <Clock20Regular />
                    <span>
                      {infoFestivo
                        ? `Festivo (${infoFestivo.localName}): 10:00 AM – 05:00 PM`
                        : esDomingoOFestivo
                        ? "Horario Domingo: 10:00 AM – 05:00 PM"
                        : "Horario Lunes a Sábado: 09:00 AM – 08:00 PM"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="booking-time-section-header">
                <span className="booking-label">
                  Horarios disponibles para el {fecha} (Formato 12 horas AM/PM)
                </span>
              </div>

              {cargandoHorarios ? (
                <div className="booking-loading-hours">
                  <Spinner size="tiny" />
                  <span>Consultando disponibilidad de horarios...</span>
                </div>
              ) : horariosDia.length === 0 ? (
                <div className="ticket-info-notice">
                  Los horarios de atención para hoy ({fecha}) ya han finalizado. Selecciona cualquier día disponible a partir de mañana en el calendario.
                </div>
              ) : (
                <div
                  ref={horariosGridRef}
                  className="booking-time-cards-grid"
                  role="radiogroup"
                  aria-label="Horarios disponibles en formato 12 horas"
                >
                  {horariosDia.map((slot) => {
                    const seleccionada = hora === slot.hora && slot.disponible;
                    const hora12 = formatearHora12(slot.hora);
                    return (
                      <button
                        key={slot.hora}
                        type="button"
                        disabled={!slot.disponible}
                        className={[
                          "booking-time-card",
                          seleccionada ? "booking-time-card-selected" : "",
                          !slot.disponible ? "booking-time-card-disabled" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        onClick={(e) => {
                          setHora(slot.hora);
                          setErrorReserva("");
                          animarPulsoSeleccion(e.currentTarget);
                        }}
                      >
                        <div className="time-card-top">
                          <Clock20Regular className="time-card-icon" />
                          <span className="time-card-hour">{hora12}</span>
                        </div>
                        <span className="time-card-status">
                          {!slot.disponible
                            ? "Ocupado"
                            : seleccionada
                            ? "✦ Seleccionado"
                            : "Disponible"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <Divider className="review-divider" />

            <div className="booking-step-block">
              <Title3 className="booking-step-title">4. Tus Datos de Contacto</Title3>
              <div className="booking-inputs-grid">
                <div className="booking-field-group">
                  <label className="booking-label">Nombre completo *</label>
                  <Input
                    size="large"
                    placeholder="Ej: Valentina Montoya"
                    value={nombreClienta}
                    onChange={(_, d) => setNombreClienta(d.value)}
                    required
                  />
                </div>

                <div className="booking-field-group">
                  <label className="booking-label">Teléfono / WhatsApp *</label>
                  <Input
                    size="large"
                    placeholder="Ej: 316 948 2881"
                    value={telefonoClienta}
                    onChange={(_, d) => setTelefonoClienta(d.value)}
                    required
                  />
                </div>

                <div className="booking-field-group">
                  <label className="booking-label">Correo electrónico</label>
                  <Input
                    type="email"
                    size="large"
                    placeholder="tucorreo@correo.com"
                    value={correoClienta}
                    onChange={(_, d) => setCorreoClienta(d.value)}
                  />
                </div>

                <div className="booking-field-group">
                  <label className="booking-label">Notas o diseño de uñas deseado</label>
                  <Input
                    size="large"
                    placeholder="Ej: Acabado cromado azul cielo..."
                    value={notas}
                    onChange={(_, d) => setNotas(d.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <Divider className="review-divider" />

        <div className="booking-policies-card" role="region" aria-label="Políticas de reserva, puntualidad y cancelación">
          <div className="booking-policies-header">
            <Info24Regular className="booking-policies-icon" />
            <Title3 className="booking-policies-title">
              Políticas de reserva, puntualidad y cancelación
            </Title3>
          </div>

          <ol className="booking-policies-list">
            <li>
              <strong>Cancelaciones:</strong> las citas solamente podrán cancelarse con un mínimo de 12 horas de anticipación. Después de este periodo, el sistema no permitirá realizar la cancelación.
            </li>
            <li>
              <strong>Puntualidad:</strong> la cliente dispone de un máximo de 10 minutos de tolerancia después de la hora programada para llegar a su cita.
            </li>
            <li>
              <strong>Llegadas tarde:</strong> si la cliente supera los 10 minutos de tolerancia, la cita será cancelada y no se garantizará la prestación del servicio.
            </li>
          </ol>
        </div>

        {errorReserva && (
          <div
            ref={alertaErrorRef}
            className="luxury-alert-box luxury-alert-error"
            role="alert"
          >
            <DismissCircle24Regular />
            <span>{errorReserva}</span>
          </div>
        )}

        <Button
          type="submit"
          appearance="primary"
          shape="circular"
          size="large"
          className="luxury-btn primary-glow-btn booking-submit-btn"
          icon={
            guardandoReserva ? <Spinner size="extra-tiny" /> : <CalendarAdd24Regular />
          }
          disabled={
            guardandoReserva ||
            !nombreClienta.trim() ||
            !telefonoClienta.trim() ||
            !hora
          }
          onClick={(e) => animarPulsoSeleccion(e.currentTarget)}
        >
          {guardandoReserva ? "Registrando tu Cita..." : "Confirmar Reserva"}
        </Button>
      </form>

      {comprobanteGenerado && (
        <div
          ref={comprobanteRef}
          className="booking-summary-card receipt-visual-card booking-receipt-standalone"
        >
          <EscenaPincelConfirmacion reserva={comprobanteGenerado} />

          <div className="booking-confirmed-header">
            <CheckmarkCircle24Filled className="booking-check-icon" />
            <Title3 className="booking-confirmed-title">
              Comprobante Oficial de Reserva
            </Title3>
          </div>

          <div className="receipt-ticket-banner">
            <span className="receipt-ticket-label">CÓDIGO DE RESERVA (TICKET)</span>
            <strong className="receipt-ticket-code">
              {comprobanteGenerado.ticket}
            </strong>
            <span className="receipt-ticket-hint">
              Conserva este código de 3 letras y 3 números para consultar o gestionar tu cita
            </span>
          </div>

          <div className="receipt-info-rows">
            <div className="receipt-row">
              <span>Clienta:</span>
              <strong>{comprobanteGenerado.nombreClienta}</strong>
            </div>
            <div className="receipt-row">
              <span>Servicio:</span>
              <strong>{comprobanteGenerado.servicioNombre}</strong>
            </div>
            <div className="receipt-row">
              <span>Especialista:</span>
              <strong>{comprobanteGenerado.especialistaNombre}</strong>
            </div>
            <div className="receipt-row">
              <span>Fecha y hora:</span>
              <strong>
                {comprobanteGenerado.fecha} ·{" "}
                {formatearHora12(comprobanteGenerado.hora)}
              </strong>
            </div>
            <div className="receipt-row">
              <span>Precio del servicio:</span>
              <strong className="ticket-price-highlight">
                {comprobanteGenerado.precio}
              </strong>
            </div>
            <div className="receipt-row">
              <span>Estado:</span>
              <span
                className={`reservation-status-pill status-${comprobanteGenerado.estado}`}
              >
                Confirmada
              </span>
            </div>
          </div>

          <div className="booking-confirmed-actions">
            <Button
              appearance="primary"
              shape="circular"
              size="medium"
              className="luxury-btn primary-glow-btn"
              onClick={() => descargarComprobanteReserva(comprobanteGenerado)}
            >
              Descargar Comprobante
            </Button>

            <Button
              appearance="primary"
              shape="circular"
              size="medium"
              className="luxury-btn primary-glow-btn"
              icon={<Print24Regular />}
              onClick={() => imprimirComprobanteReserva(comprobanteGenerado)}
            >
              Imprimir Comprobante
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
