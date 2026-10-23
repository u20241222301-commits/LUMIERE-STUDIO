import { useEffect, useState } from "react";
import { sparkles } from "../data/homeData";

export default function FondoAmbiental() {
  const [mezcla, setMezcla] = useState(0);

  useEffect(() => {
    const alDesplazar = () => {
      const seccionResenas = document.getElementById("resenas");
      if (!seccionResenas) return;

      const rect = seccionResenas.getBoundingClientRect();
      const alto = window.innerHeight || 800;

      const inicio = alto * 0.9;
      const fin = alto * 0.25;
      const progreso = (inicio - rect.top) / (inicio - fin);
      setMezcla(Math.max(0, Math.min(1, progreso)));
    };

    const frameInicial = requestAnimationFrame(alDesplazar);
    window.addEventListener("scroll", alDesplazar, { passive: true });
    window.addEventListener("resize", alDesplazar);
    return () => {
      cancelAnimationFrame(frameInicial);
      window.removeEventListener("scroll", alDesplazar);
      window.removeEventListener("resize", alDesplazar);
    };
  }, []);

  return (
    <div className="luxury-ambient-bg" aria-hidden="true">
      <video
        className="ambient-video-bg"
        src="/fondo-pinceles.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{
          opacity: 1 - mezcla,
          transform: `scale(${1.02 + mezcla * 0.08}) translateY(${-mezcla * 24}px)`,
          filter: `blur(${mezcla * 6}px) contrast(1.05) brightness(1.02)`,
        }}
      />

      <video
        className="ambient-video-bg"
        src="/fondo-lumiere.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{
          opacity: mezcla,
          transform: `scale(${1.24 - mezcla * 0.06})`,
          filter: `blur(${(1 - mezcla) * 6}px) contrast(1.04) brightness(1.02) saturate(1.08)`,
        }}
      />

      <div className="video-iridescent-veil" />

      {sparkles.map((destello) => (
        <span
          key={destello.id}
          className="floating-sparkle"
          style={{
            top: destello.top,
            left: destello.left,
            width: destello.size,
            height: destello.size,
            animationDelay: destello.delay,
            animationDuration: destello.duration,
          }}
        />
      ))}
    </div>
  );
}

