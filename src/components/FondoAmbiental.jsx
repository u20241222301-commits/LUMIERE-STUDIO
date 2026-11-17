import { useEffect, useRef } from "react";
import { sparkles } from "../data/homeData";
import { animarFondoPorRuta } from "../utils/gsapAnimations";
import NailPolishScene from "./homeBackground/NailPolishScene";
import NailDesignScene from "./homeBackground/NailDesignScene";
import PaintTransition from "./homeBackground/PaintTransition";
import useHomeAnimations from "./homeBackground/useHomeAnimations";
import FondoPaginaInterna from "./pageBackgrounds/FondoPaginaInterna";

const GOTAS_ADMIN = [
  { id: 1, top: "16%", left: "12%", color: "rgba(91, 192, 248, 0.36)" },
  { id: 2, top: "28%", left: "86%", color: "rgba(244, 114, 182, 0.32)" },
];

export default function FondoAmbiental({ vistaActual = "inicio" }) {
  const fondoRef = useRef(null);

  useHomeAnimations(fondoRef, vistaActual === "inicio");

  useEffect(() => {
    if (!fondoRef.current || vistaActual === "inicio") return;
    const ctx = animarFondoPorRuta(fondoRef.current, vistaActual);
    return () => {
      if (ctx) ctx.revert();
    };
  }, [vistaActual]);

  if (vistaActual === "inicio") {
    return (
      <div
        ref={fondoRef}
        className="luxury-ambient-bg home-gsap-master-bg"
        aria-hidden="true"
      >
        <NailPolishScene />
        <NailDesignScene />
        <PaintTransition />
      </div>
    );
  }

  const esAdmin = vistaActual === "admin";
  const destellosActivos = esAdmin ? sparkles.slice(0, 10) : sparkles.slice(0, 8);

  return (
    <div
      ref={fondoRef}
      className={`luxury-ambient-bg services-dynamic-bg ambient-view-${vistaActual}`}
      aria-hidden="true"
    >
      <div className="aurora-mesh-layer" />
      <span className="aurora-orb orb-sky-blue" />
      <span className="aurora-orb orb-rose-pink" />
      <span className="aurora-orb orb-lilac" />
      <span className="aurora-orb orb-pearl-white" />
      <div className="services-shimmer-grid" />

      {!esAdmin && <FondoPaginaInterna key={vistaActual} vista={vistaActual} />}

      {esAdmin &&
        GOTAS_ADMIN.map((gota) => (
          <span
            key={gota.id}
            className="gsap-bg-polish-drop"
            style={{
              top: gota.top,
              left: gota.left,
              background: gota.color,
            }}
          />
        ))}

      {destellosActivos.map((destello) => (
        <span
          key={destello.id}
          className="floating-sparkle"
          style={{
            top: destello.top,
            left: destello.left,
            width: destello.size,
            height: destello.size,
          }}
        />
      ))}
    </div>
  );
}
