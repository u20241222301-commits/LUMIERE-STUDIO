import { useEffect, useRef, useState } from "react";
import {
  Badge,
  Body1,
  Button,
  Divider,
  Title1,
  Title3,
} from "@fluentui/react-components";
import {
  CalendarLtr24Regular,
  Clock20Regular,
  Sparkle20Filled,
} from "@fluentui/react-icons";
import { useNavigate } from "react-router-dom";
import { serviceCategories, servicesCatalog } from "../data/homeData";
import IndicadorPincelCarga from "./IndicadorPincelCarga";
import {
  animarEntradaPagina,
  animarHoverTarjetaServicio,
  animarPulsoSeleccion,
} from "../utils/gsapAnimations";

export default function PaginaServicios({ onBookClick }) {
  const navigate = useNavigate();
  const [categoriaActiva, setCategoriaActiva] = useState("todos");
  const [cargandoFiltro, setCargandoFiltro] = useState(false);
  const paginaRef = useRef(null);
  const gridRef = useRef(null);

  const serviciosFiltrados =
    categoriaActiva === "todos"
      ? servicesCatalog
      : servicesCatalog.filter((s) => s.category === categoriaActiva);

  useEffect(() => {
    const ctx = animarEntradaPagina(paginaRef.current, {
      selectorHeader: ".services-hero-header",
      selectorItems: ".service-luxury-card",
      stagger: 0.08,
      duracion: 0.65,
      desplazamientoY: 28,
    });
    return () => {
      if (ctx) ctx.revert();
    };
  }, []);

  useEffect(() => {
    const ctx = animarEntradaPagina(gridRef.current, {
      selectorHeader: "",
      selectorItems: ".service-luxury-card",
      stagger: 0.07,
      duracion: 0.55,
      desplazamientoY: 22,
    });
    return () => {
      if (ctx) ctx.revert();
    };
  }, [categoriaActiva]);

  const cambiarCategoria = (idCat, botonEl) => {
    if (idCat === categoriaActiva) return;
    animarPulsoSeleccion(botonEl);
    setCargandoFiltro(true);
    setCategoriaActiva(idCat);
    setTimeout(() => {
      setCargandoFiltro(false);
    }, 320);
  };

  return (
    <div ref={paginaRef} className="services-page-wrap section-wrap">
      <IndicadorPincelCarga
        visible={cargandoFiltro}
        mensaje="Preparando catálogo de servicios..."
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
          MENÚ EXCLUSIVO DE TENDENCIAS · LUMIÈRE STUDIO
        </Badge>

        <Title1 className="hero-title">
          Nuestros Servicios &
          <span className="shimmer-headline">Precios de Temporada</span>
        </Title1>

        <Body1 className="hero-description">
          Explora las técnicas en tendencia a nivel mundial: desde manicura rusa con efecto espejo y uñas coreanas 3D, hasta nuestro Jelly Spa sensorial.
        </Body1>

        <div className="services-category-tabs" role="tablist" aria-label="Categorías de servicios">
          {serviceCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={categoriaActiva === cat.id}
              className={`service-tab-pill ${
                categoriaActiva === cat.id ? "service-tab-active" : ""
              }`}
              onClick={(e) => cambiarCategoria(cat.id, e.currentTarget)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      <section
        ref={gridRef}
        className="services-catalog-grid"
        aria-label="Listado de servicios y costos"
      >
        {serviciosFiltrados.map((servicio) => (
          <article
            key={servicio.id}
            className="service-luxury-card"
            onMouseEnter={(e) => animarHoverTarjetaServicio(e.currentTarget, true)}
            onMouseLeave={(e) => animarHoverTarjetaServicio(e.currentTarget, false)}
          >
            <span className="gsap-card-sparkle card-sp-1" aria-hidden="true">✦</span>
            <span className="gsap-card-sparkle card-sp-2" aria-hidden="true">✧</span>

            {servicio.image && (
              <div className="service-card-photo-frame">
                <img
                  src={servicio.image}
                  alt={servicio.name}
                  className="service-card-photo-img"
                  loading="lazy"
                />
              </div>
            )}

            <div className="service-card-top">
              <Badge appearance="tint" shape="circular" className="review-service-badge">
                <span className="review-service-text">{servicio.categoryLabel}</span>
              </Badge>
              <span className="service-trend-tag">{servicio.badge}</span>
            </div>

            <Title3 className="service-card-title">{servicio.name}</Title3>

            <div className="service-price-row">
              <span className="service-price-amount">{servicio.price}</span>
              <span className="service-duration-pill">
                <Clock20Regular />
                {servicio.duration}
              </span>
            </div>

            <Body1 className="service-card-desc">{servicio.description}</Body1>

            <div className="service-features-list">
              {servicio.features.map((item) => (
                <span key={item} className="service-feature-chip">
                  ✦ {item}
                </span>
              ))}
            </div>

            <Divider className="review-divider" />

            <Button
              appearance="primary"
              shape="circular"
              size="large"
              className="luxury-btn primary-glow-btn service-book-btn"
              icon={<CalendarLtr24Regular />}
              onClick={() =>
                navigate("/reservas", { state: { selectedService: servicio.name } })
              }
            >
              Agendar {servicio.price}
            </Button>
          </article>
        ))}
      </section>
    </div>
  );
}
