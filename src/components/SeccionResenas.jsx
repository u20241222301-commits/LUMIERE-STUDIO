import { useEffect, useMemo, useRef, useState } from "react";
import {
  Avatar,
  Badge,
  Title2,
  Title3,
  Body1,
  Text,
  Divider,
} from "@fluentui/react-components";
import {
  ChevronLeft24Regular,
  ChevronRight24Regular,
  Sparkle20Filled,
} from "@fluentui/react-icons";
import { clientReviews } from "../data/homeData";
import { obtenerResenasSistema } from "../services/sistemaReservas";
import { animarEntradaPagina } from "../utils/gsapAnimations";

export default function SeccionResenas() {
  const [listaResenas, setListaResenas] = useState(clientReviews);
  const [indiceInicio, setIndiceInicio] = useState(0);
  const seccionRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    obtenerResenasSistema().then((resenasDb) => {
      if (Array.isArray(resenasDb) && resenasDb.length > 0) {
        const idsManuales = new Set(clientReviews.map((r) => String(r.id)));
        const nuevasClientes = resenasDb.filter(
          (r) => !idsManuales.has(String(r.id))
        );
        setListaResenas([...clientReviews, ...nuevasClientes]);
      }
    });
  }, []);

  useEffect(() => {
    const ctx = animarEntradaPagina(gridRef.current, {
      selectorHeader: "",
      selectorItems: ".review-glass-panel",
      stagger: 0.08,
      duracion: 0.52,
      desplazamientoY: 16,
    });
    return () => {
      if (ctx) ctx.revert();
    };
  }, [indiceInicio]);

  const totalResenas = listaResenas.length;

  const resenasVisibles = useMemo(() => {
    if (totalResenas <= 3) return listaResenas;
    return [0, 1, 2].map(
      (offset) => listaResenas[(indiceInicio + offset) % totalResenas]
    );
  }, [listaResenas, indiceInicio, totalResenas]);

  const rotarAnterior = () => {
    setIndiceInicio((prev) => (prev - 1 + totalResenas) % totalResenas);
  };

  const rotarSiguiente = () => {
    setIndiceInicio((prev) => (prev + 1) % totalResenas);
  };

  const promedioCalificacion =
    totalResenas > 0
      ? (
          listaResenas.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) /
          totalResenas
        ).toFixed(1)
      : "5.0";

  return (
    <section ref={seccionRef} className="reviews-section section-wrap" id="resenas">
      <div className="reviews-header">
        <Badge
          appearance="outline"
          size="extra-large"
          shape="circular"
          className="luxury-kicker-pill"
          icon={<Sparkle20Filled className="sparkle-dot" />}
        >
          EXPERIENCIAS REALES
        </Badge>

        <Title2 className="section-main-title">
          Voces de Nuestro <span className="shimmer-inline">Studio</span>
        </Title2>

        <Body1 className="reviews-subtitle">
          Cada visita a Lumière Studio es un momento dedicado a tu belleza y bienestar. Descubre las experiencias de nuestras clientas y déjate inspirar por sus diseños, acabados y momentos de relajación.
        </Body1>

        <div className="reviews-summary-pill">
          <span className="summary-stars" aria-label="5 de 5 estrellas">★★★★★</span>
          <Text className="summary-score">{promedioCalificacion} / 5.0</Text>
          <Divider vertical className="summary-divider" />
          <Text className="summary-count">
            Reseñas verificadas de nuestras clientas ({totalResenas})
          </Text>
        </div>
      </div>

      <div className="reviews-carousel-shell">
        <button
          type="button"
          className="reviews-arrow-btn"
          onClick={rotarAnterior}
          aria-label="Ver reseña anterior"
        >
          <ChevronLeft24Regular />
        </button>

        <div ref={gridRef} className="reviews-grid">
          {resenasVisibles.map((resena, idx) => (
            <article key={`${resena.id}-${idx}`} className="review-glass-panel">
              <div className="review-top-row">
                <div className="review-stars" aria-label={`${resena.rating} estrellas`}>
                  {"★".repeat(Number(resena.rating) || 5)}
                </div>
                <Badge appearance="tint" shape="circular" className="review-service-badge">
                  <span className="review-service-text">{resena.service}</span>
                </Badge>
              </div>

              <Body1 className="review-comment">“{resena.comment}”</Body1>

              <Divider className="review-divider" />

              <div className="review-author-row">
                <div className="avatar-tornasol-ring">
                  <Avatar name={resena.name} size={40} color={resena.avatarColor || "steel"} />
                </div>
                <div className="review-author-info">
                  <Title3 className="review-author-name">{resena.name}</Title3>
                  <Text className="review-author-role">
                    <span>{resena.date}</span>
                  </Text>
                </div>
              </div>
            </article>
          ))}
        </div>

        <button
          type="button"
          className="reviews-arrow-btn"
          onClick={rotarSiguiente}
          aria-label="Ver siguiente reseña"
        >
          <ChevronRight24Regular />
        </button>
      </div>
    </section>
  );
}
