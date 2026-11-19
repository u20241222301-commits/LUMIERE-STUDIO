import { useCallback, useEffect, useRef, useState } from "react";
import {
  Badge,
  Body1,
  Button,
  Spinner,
  Text,
  Title1,
  Title2,
  Title3,
} from "@fluentui/react-components";
import {
  CalendarLtr24Regular,
  Dismiss24Regular,
  Search24Regular,
  Sparkle20Filled,
} from "@fluentui/react-icons";
import { useNavigate } from "react-router-dom";
import {
  CATEGORIAS_INSPIRACION,
  SUGERENCIAS_BUSQUEDA_INSPIRACION,
  cancelarSolicitudInspiracionActiva,
  obtenerFotografiasInspiracion,
} from "../services/inspiracionService";
import IndicadorPincelCarga from "./IndicadorPincelCarga";
import {
  animarEntradaPagina,
  animarPulsoSeleccion,
} from "../utils/gsapAnimations";

export default function PaginaInspiracion() {
  const navigate = useNavigate();
  const paginaRef = useRef(null);
  const galeriaRef = useRef(null);

  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [busquedaActiva, setBusquedaActiva] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("todas");
  const [fotografias, setFotografias] = useState([]);
  const [disenosSolicitados, setDisenosSolicitados] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const [hayMasPaginas, setHayMasPaginas] = useState(false);
  const [cargandoInicial, setCargandoInicial] = useState(false);
  const [cargandoMas, setCargandoMas] = useState(false);
  const [errorGaleria, setErrorGaleria] = useState("");
  const [fotoModal, setFotoModal] = useState(null);

  const cargarGaleria = useCallback(
    async ({
      query = "",
      categoria = "todas",
      page = 1,
      acumular = false,
    } = {}) => {
      setDisenosSolicitados(true);
      setErrorGaleria("");
      if (acumular) {
        setCargandoMas(true);
      } else {
        setCargandoInicial(true);
      }

      try {
        const respuesta = await obtenerFotografiasInspiracion({
          query,
          categoria,
          page,
          perPage: 12,
          cancelarAnterior: !acumular,
        });

        const nuevas = Array.isArray(respuesta.resultados)
          ? respuesta.resultados
          : [];

        setFotografias((prev) => {
          if (!acumular) return nuevas;
          const vistos = new Set(prev.map((item) => item.id));
          const sinDuplicados = nuevas.filter((item) => !vistos.has(item.id));
          return [...prev, ...sinDuplicados];
        });

        setPaginaActual(page);
        setHayMasPaginas(Boolean(respuesta.hayMas));
      } catch (err) {
        if (err && err.name === "AbortError") return;
        setErrorGaleria(
          err.message ||
            "No fue posible cargar las fotografías desde Unsplash en este momento. Intenta nuevamente."
        );
      } finally {
        setCargandoInicial(false);
        setCargandoMas(false);
      }
    },
    []
  );

  useEffect(() => {
    return () => {
      cancelarSolicitudInspiracionActiva();
    };
  }, []);

  useEffect(() => {
    const ctx = animarEntradaPagina(paginaRef.current, {
      selectorHeader: ".services-hero-header, .inspiracion-search-panel",
      selectorItems: "",
    });
    return () => {
      if (ctx) ctx.revert();
    };
  }, []);

  useEffect(() => {
    if (!galeriaRef.current || fotografias.length === 0) return;
    const ctx = animarEntradaPagina(galeriaRef.current, {
      selectorHeader: "",
      selectorItems: ".inspiracion-masonry-card",
      stagger: 0.045,
      duracion: 0.52,
      desplazamientoY: 18,
    });
    return () => {
      if (ctx) ctx.revert();
    };
  }, [fotografias]);

  const manejarCargarDisenos = (e) => {
    if (e?.currentTarget) {
      animarPulsoSeleccion(e.currentTarget);
    }
    const limpio = textoBusqueda.trim();
    setBusquedaActiva(limpio);
    cargarGaleria({
      query: limpio,
      categoria: categoriaActiva,
      page: 1,
      acumular: false,
    });
  };

  const manejarSubmitBusqueda = (e) => {
    e.preventDefault();
    const limpio = textoBusqueda.trim();
    setBusquedaActiva(limpio);
    cargarGaleria({
      query: limpio,
      categoria: categoriaActiva,
      page: 1,
      acumular: false,
    });
  };

  const manejarLimpiarBusqueda = () => {
    cancelarSolicitudInspiracionActiva();
    setTextoBusqueda("");
    setBusquedaActiva("");
    setCategoriaActiva("todas");
    setFotografias([]);
    setDisenosSolicitados(false);
    setPaginaActual(1);
    setHayMasPaginas(false);
    setErrorGaleria("");
  };

  const manejarSeleccionCategoria = (idCat, botonEl) => {
    if (botonEl) animarPulsoSeleccion(botonEl);
    setCategoriaActiva(idCat);
    if (disenosSolicitados) {
      cargarGaleria({
        query: busquedaActiva,
        categoria: idCat,
        page: 1,
        acumular: false,
      });
    }
  };

  const manejarSugerenciaRapida = (sugerencia, botonEl) => {
    if (botonEl) animarPulsoSeleccion(botonEl);
    setTextoBusqueda(sugerencia);
    setBusquedaActiva(sugerencia);
    if (disenosSolicitados) {
      cargarGaleria({
        query: sugerencia,
        categoria: "todas",
        page: 1,
        acumular: false,
      });
    }
  };

  const manejarCargarMas = (e) => {
    animarPulsoSeleccion(e.currentTarget);
    cargarGaleria({
      query: busquedaActiva,
      categoria: categoriaActiva,
      page: paginaActual + 1,
      acumular: true,
    });
  };

  const descartarFotoInvalida = (idFoto) => {
    setFotografias((prev) => prev.filter((item) => item.id !== idFoto));
  };

  const irAReservarConInspiracion = (foto) => {
    if (!foto) return;
    setFotoModal(null);
    navigate("/reservas", {
      state: {
        disenoInspiracion: {
          id: foto.id,
          titulo: foto.titulo,
          imagenRegularUrl: foto.imagenRegularUrl,
          imagenSmallUrl: foto.imagenSmallUrl || foto.imagenRegularUrl,
          autorNombre: foto.autorNombre,
          categoria: foto.categoria || categoriaActiva,
        },
        selectedService: "Imagen de Inspiración",
        inspirationNote: `Diseño de referencia: ${foto.titulo}`,
      },
    });
  };

  return (
    <div ref={paginaRef} className="services-page-wrap section-wrap">
      <IndicadorPincelCarga
        visible={cargandoInicial}
        mensaje="Consultando diseños en Unsplash..."
        submensaje="Un momento, estamos trayendo las fotografías para ti"
      />

      <section className="services-hero-header">
        <Badge
          appearance="outline"
          size="extra-large"
          shape="circular"
          className="luxury-kicker-pill"
          icon={<Sparkle20Filled className="sparkle-dot" />}
        >
          GALERÍA DE TENDENCIAS · LUMIÈRE STUDIO
        </Badge>

        <Title1 className="hero-title">
          Encuentra tu próxima
          <span className="shimmer-headline">inspiración</span>
        </Title1>

        <Body1 className="hero-description">
          Descubre diseños, colores y estilos para tu próxima manicura
        </Body1>
      </section>

      <section className="inspiracion-search-panel" aria-label="Buscador y filtros de inspiración">
        <form className="inspiracion-search-form" onSubmit={manejarSubmitBusqueda}>
          <div className="inspiracion-search-input-wrap">
            <Search24Regular className="inspiracion-search-icon" />
            <input
              type="search"
              value={textoBusqueda}
              onChange={(e) => setTextoBusqueda(e.target.value)}
              placeholder="Busca ej: Uñas rosadas, manicura francesa, uñas cromadas, diseños con flores..."
              className="inspiracion-search-input"
              aria-label="Buscar diseños de uñas"
            />
            {(textoBusqueda || busquedaActiva || categoriaActiva !== "todas" || disenosSolicitados) && (
              <button
                type="button"
                className="inspiracion-clear-btn"
                onClick={manejarLimpiarBusqueda}
                aria-label="Limpiar filtros y galería"
              >
                <Dismiss24Regular />
                <span>Limpiar</span>
              </button>
            )}
          </div>

          <Button
            type="button"
            appearance="primary"
            shape="circular"
            size="large"
            className="luxury-btn primary-glow-btn inspiracion-submit-btn"
            icon={<Sparkle20Filled />}
            disabled={cargandoInicial}
            onClick={manejarCargarDisenos}
          >
            Cargar diseños
          </Button>
        </form>

        <div className="inspiracion-suggestions-row" aria-label="Búsquedas sugeridas">
          <span className="inspiracion-suggestions-label">Tendencias:</span>
          {SUGERENCIAS_BUSQUEDA_INSPIRACION.map((sug) => (
            <button
              key={sug}
              type="button"
              className={`inspiracion-suggestion-chip ${
                textoBusqueda.toLowerCase() === sug.toLowerCase() ||
                busquedaActiva.toLowerCase() === sug.toLowerCase()
                  ? "inspiracion-suggestion-active"
                  : ""
              }`}
              onClick={(e) => manejarSugerenciaRapida(sug, e.currentTarget)}
            >
              ✦ {sug}
            </button>
          ))}
        </div>

        <div
          className="services-category-tabs inspiracion-categories-bar"
          role="tablist"
          aria-label="Categorías de inspiración"
        >
          {CATEGORIAS_INSPIRACION.map((cat) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={categoriaActiva === cat.id}
              className={`service-tab-pill ${
                categoriaActiva === cat.id ? "service-tab-active" : ""
              }`}
              onClick={(e) => manejarSeleccionCategoria(cat.id, e.currentTarget)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {errorGaleria && (
        <div className="luxury-alert-box luxury-alert-error inspiracion-alert" role="alert">
          <span>{errorGaleria}</span>
          <Button
            size="small"
            shape="circular"
            appearance="primary"
            className="luxury-btn primary-glow-btn"
            onClick={manejarCargarDisenos}
          >
            Reintentar
          </Button>
        </div>
      )}

      {!disenosSolicitados && !cargandoInicial ? (
        <div className="booking-form-card inspiracion-empty-card">
          <Title3 className="booking-step-title">
            Explora diseños de uñas en tiempo real desde Unsplash
          </Title3>
          <Text className="ticket-helper-text">
            Selecciona una categoría, elige una tendencia o escribe tu estilo favorito y presiona el botón para cargar los diseños disponibles en Unsplash.
          </Text>
          <div>
            <Button
              appearance="primary"
              shape="circular"
              size="large"
              className="luxury-btn primary-glow-btn"
              icon={<Sparkle20Filled />}
              onClick={manejarCargarDisenos}
            >
              Cargar diseños
            </Button>
          </div>
        </div>
      ) : !cargandoInicial && fotografias.length === 0 ? (
        <div className="booking-form-card inspiracion-empty-card">
          <Title3 className="booking-step-title">
            No encontramos fotografías para "{busquedaActiva || categoriaActiva}"
          </Title3>
          <Text className="ticket-helper-text">
            Prueba con otros términos como "uñas rosadas", "manicura francesa", "uñas almendradas" o selecciona otra categoría.
          </Text>
          <div>
            <Button
              appearance="primary"
              shape="circular"
              size="medium"
              className="luxury-btn primary-glow-btn"
              icon={<Sparkle20Filled />}
              onClick={manejarCargarDisenos}
            >
              Cargar diseños
            </Button>
          </div>
        </div>
      ) : (
        <>
          <section
            ref={galeriaRef}
            className="inspiracion-masonry-grid"
            aria-label="Galería de fotografías de diseños de uñas"
          >
            {fotografias.map((foto) => (
              <article
                key={foto.id}
                className={`inspiracion-masonry-card altura-${foto.alturaTipo || "media"}`}
                onClick={() => setFotoModal(foto)}
              >
                <div
                  className="inspiracion-img-container"
                  style={{ backgroundColor: foto.colorDominante || "#E0F2FE" }}
                >
                  <img
                    src={foto.imagenRegularUrl}
                    srcSet={`${foto.imagenSmallUrl} 600w, ${foto.imagenRegularUrl} 1080w`}
                    sizes="(max-width: 760px) 100vw, (max-width: 1080px) 50vw, 33vw"
                    alt={foto.titulo}
                    loading="lazy"
                    decoding="async"
                    className="inspiracion-photo-img"
                    onError={() => descartarFotoInvalida(foto.id)}
                  />

                  <div className="inspiracion-hover-overlay">
                    <button
                      type="button"
                      className="inspiracion-zoom-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFotoModal(foto);
                      }}
                    >
                      <span>✦ Ampliar diseño</span>
                    </button>

                    <div className="inspiracion-hover-info">
                      <strong className="inspiracion-hover-title">
                        {foto.titulo}
                      </strong>
                      <span className="inspiracion-hover-author">
                        Foto por {foto.autorNombre}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="inspiracion-card-footer">
                  <strong className="inspiracion-card-title">{foto.titulo}</strong>
                  <div
                    className="inspiracion-card-credit"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>Foto por </span>
                    <a
                      href={foto.autorPerfilUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {foto.autorNombre}
                    </a>
                    <span> en </span>
                    <a
                      href={foto.unsplashHomeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Unsplash
                    </a>
                  </div>
                  <Button
                    appearance="primary"
                    shape="circular"
                    size="small"
                    className="luxury-btn primary-glow-btn inspiracion-card-book-btn"
                    icon={<CalendarLtr24Regular />}
                    onClick={(e) => {
                      e.stopPropagation();
                      irAReservarConInspiracion(foto);
                    }}
                  >
                    Reservar con esta imagen
                  </Button>
                </div>
              </article>
            ))}
          </section>

          {hayMasPaginas && fotografias.length > 0 && (
            <div className="inspiracion-load-more-row">
              <Button
                appearance="primary"
                shape="circular"
                size="large"
                className="luxury-btn primary-glow-btn"
                disabled={cargandoMas}
                icon={cargandoMas ? <Spinner size="extra-tiny" /> : <Sparkle20Filled />}
                onClick={manejarCargarMas}
              >
                {cargandoMas ? "Cargando más fotografías..." : "Cargar más diseños"}
              </Button>
            </div>
          )}
        </>
      )}

      {fotoModal && (
        <div
          className="inspiracion-lightbox-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={`Vista ampliada de ${fotoModal.titulo}`}
          onClick={() => setFotoModal(null)}
        >
          <div
            className="inspiracion-lightbox-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="inspiracion-lightbox-close"
              onClick={() => setFotoModal(null)}
              aria-label="Cerrar vista ampliada"
            >
              <Dismiss24Regular />
            </button>

            <div className="inspiracion-lightbox-img-col">
              <img
                src={fotoModal.imagenGrandeUrl || fotoModal.imagenRegularUrl}
                alt={fotoModal.titulo}
                className="inspiracion-lightbox-img"
              />
            </div>

            <div className="inspiracion-lightbox-info-col">
              <Badge appearance="tint" shape="circular" className="review-service-badge">
                <span className="review-service-text">Inspiración · Lumière Studio</span>
              </Badge>

              <Title2 className="inspiracion-lightbox-title">
                {fotoModal.titulo}
              </Title2>

              <Body1 className="inspiracion-lightbox-desc">
                {fotoModal.descripcion}
              </Body1>

              <div className="inspiracion-lightbox-attribution">
                <span className="attribution-label">CRÉDITOS DE FOTOGRAFÍA (UNSPLASH)</span>
                <p className="attribution-line">
                  Fotografía por{" "}
                  <a
                    href={fotoModal.autorPerfilUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {fotoModal.autorNombre}
                  </a>{" "}
                  en{" "}
                  <a
                    href={fotoModal.unsplashHomeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Unsplash
                  </a>
                </p>

                <div className="attribution-links-row">
                  <a
                    href={fotoModal.autorPerfilUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="attribution-pill-link"
                  >
                    <span>Perfil del fotógrafo ↗</span>
                  </a>

                  <a
                    href={fotoModal.fotoOriginalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="attribution-pill-link"
                  >
                    <span>Ver fotografía original ↗</span>
                  </a>
                </div>
              </div>

              <Button
                appearance="primary"
                shape="circular"
                size="large"
                className="luxury-btn primary-glow-btn"
                icon={<CalendarLtr24Regular />}
                onClick={() => irAReservarConInspiracion(fotoModal)}
              >
                Agendar Cita con esta Imagen
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
