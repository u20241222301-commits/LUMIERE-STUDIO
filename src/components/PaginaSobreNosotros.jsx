import { useEffect, useRef, useState } from "react";
import {
  Badge,
  Body1,
  Button,
  Divider,
  Text,
  Title1,
  Title2,
  Title3,
} from "@fluentui/react-components";
import {
  CalendarLtr24Regular,
  Person24Regular,
  Sparkle20Filled,
} from "@fluentui/react-icons";
import { useNavigate } from "react-router-dom";
import { aboutStudioInfo, initialSpecialists } from "../data/homeData";
import { obtenerEspecialistasSistema } from "../services/sistemaReservas";
import { animarEntradaPagina } from "../utils/gsapAnimations";

export default function PaginaSobreNosotros() {
  const navigate = useNavigate();
  const [especialistas, setEspecialistas] = useState(initialSpecialists);
  const [imagenesConError, setImagenesConError] = useState({});
  const paginaRef = useRef(null);

  useEffect(() => {
    obtenerEspecialistasSistema().then((lista) => {
      if (Array.isArray(lista) && lista.length > 0) {
        setEspecialistas(lista);
      }
    });
  }, []);

  useEffect(() => {
    const ctx = animarEntradaPagina(paginaRef.current, {
      selectorHeader: ".services-hero-header, .reviews-header",
      selectorItems: ".about-pillar-card, .team-specialist-card",
      stagger: 0.1,
    });
    return () => {
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <div ref={paginaRef} className="services-page-wrap section-wrap">
      <section className="services-hero-header">
        <Badge
          appearance="outline"
          size="extra-large"
          shape="circular"
          className="luxury-kicker-pill"
          icon={<Sparkle20Filled className="sparkle-dot" />}
        >
          NUESTRA ESENCIA · LUMIÈRE STUDIO
        </Badge>

        <Title1 className="hero-title">
          Sobre Nosotros &
          <span className="shimmer-headline">Nuestro Equipo</span>
        </Title1>

        <Body1 className="hero-description">
          Conoce el propósito, la visión y el talento artístico detrás de cada experiencia de alta manicura y bienestar en Lumière Studio.
        </Body1>
      </section>

      <section className="about-pillars-grid" aria-label="Misión y Visión de Lumière Studio">
        <article className="service-luxury-card about-pillar-card">
          <div className="service-card-top">
            <Badge appearance="tint" shape="circular" className="review-service-badge">
              <span className="review-service-text">Propósito & Compromiso</span>
            </Badge>
            <span className="service-trend-tag">Excelencia</span>
          </div>

          <Title2 className="about-pillar-title">
            Nuestra <span className="shimmer-inline">Misión</span>
          </Title2>

          <Body1 className="service-card-desc about-pillar-text">
            {aboutStudioInfo.mision}
          </Body1>

          <div className="service-features-list">
            {aboutStudioInfo.valores.map((valor) => (
              <span key={valor} className="service-feature-chip">
                ✦ {valor}
              </span>
            ))}
          </div>
        </article>

        <article className="service-luxury-card about-pillar-card">
          <div className="service-card-top">
            <Badge appearance="tint" shape="circular" className="review-service-badge">
              <span className="review-service-text">Proyección & Futuro</span>
            </Badge>
            <span className="service-trend-tag">Vanguardia</span>
          </div>

          <Title2 className="about-pillar-title">
            Nuestra <span className="shimmer-inline">Visión</span>
          </Title2>

          <Body1 className="service-card-desc about-pillar-text">
            {aboutStudioInfo.vision}
          </Body1>

          <div className="service-features-list">
            <span className="service-feature-chip">✦ Innovación continua en Nail Art</span>
            <span className="service-feature-chip">✦ Referente regional en alta manicura</span>
            <span className="service-feature-chip">✦ Experiencia sensorial de lujo</span>
          </div>
        </article>
      </section>

      <section className="about-team-section" aria-label="Nuestro equipo de especialistas">
        <div className="reviews-header">
          <Badge
            appearance="outline"
            size="extra-large"
            shape="circular"
            className="luxury-kicker-pill"
            icon={<Sparkle20Filled className="sparkle-dot" />}
          >
            ESPECIALISTAS EN ALTA MANICURA & SPA
          </Badge>

          <Title2 className="section-main-title">
            Nuestro <span className="shimmer-inline">Equipo</span>
          </Title2>

          <Body1 className="reviews-subtitle">
            Cada una de nuestras especialistas registradas cuenta con formación avanzada en técnicas internacionales de manicura rusa, diseño estructural y rituales de spa.
          </Body1>
        </div>

        <div className="team-specialists-grid">
          {especialistas.map((esp) => {
            const tieneFotoValida =
              Boolean(esp.fotoUrl && esp.fotoUrl.trim()) && !imagenesConError[esp.id];

            return (
              <article key={esp.id} className="service-luxury-card team-specialist-card">
                <div className="specialist-photo-frame">
                  {tieneFotoValida ? (
                    <img
                      src={esp.fotoUrl}
                      alt={`${esp.nombre} - ${esp.cargo}`}
                      className="specialist-photo-img"
                      onError={() =>
                        setImagenesConError((prev) => ({ ...prev, [esp.id]: true }))
                      }
                    />
                  ) : (
                    <div className="specialist-photo-placeholder" aria-label={`Espacio fotográfico de ${esp.nombre}`}>
                      <div className="specialist-placeholder-halo">
                        <Person24Regular className="specialist-placeholder-icon" />
                        <span className="specialist-placeholder-initial">
                          {String(esp.nombre || "L").charAt(0)}
                        </span>
                      </div>
                      <span className="specialist-placeholder-caption">
                        Fotografía Oficial · Lumière Studio
                      </span>
                    </div>
                  )}

                  <span className="specialist-specialty-badge">
                    ✦ {esp.especialidad}
                  </span>
                </div>

                <div className="specialist-card-body">
                  <Title3 className="service-card-title">{esp.nombre}</Title3>
                  <Text className="specialist-role-subtitle">{esp.cargo}</Text>

                  <Body1 className="service-card-desc">
                    {esp.descripcion ||
                      `Especialista certificada en ${esp.especialidad} en Lumière Studio.`}
                  </Body1>

                  <Divider className="review-divider" />

                  <Button
                    appearance="primary"
                    shape="circular"
                    size="medium"
                    className="luxury-btn primary-glow-btn service-book-btn"
                    icon={<CalendarLtr24Regular />}
                    onClick={() =>
                      navigate("/reservas", {
                        state: { selectedSpecialistId: esp.id },
                      })
                    }
                  >
                    Reservar con {esp.nombre}
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
