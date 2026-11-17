import { useEffect, useRef } from "react";
import gsap from "gsap";
import { prefiereMovimientoReducido } from "../utils/gsapAnimations";

export default function IndicadorPincelCarga({
  visible = false,
  mensaje = "Preparando tu experiencia...",
  submensaje = "Un momento, estamos preparando todo para ti",
}) {
  const overlayRef = useRef(null);
  const pincelRef = useRef(null);
  const trazoRef = useRef(null);
  const capaEsmalteRef = useRef(null);
  const brilloUnaRef = useRef(null);

  useEffect(() => {
    if (!visible || !overlayRef.current) return;

    const reducido = prefiereMovimientoReducido();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.28, ease: "power2.out" }
      );

      if (reducido) {
        gsap.set(capaEsmalteRef.current, { scaleY: 1, opacity: 0.85 });
        return;
      }

      const destellos = overlayRef.current.querySelectorAll(".loader-nail-sparkle");

      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.18 });

      tl.set(capaEsmalteRef.current, {
        scaleY: 0,
        transformOrigin: "50% 100%",
        opacity: 0.92,
      })
        .set(trazoRef.current, {
          strokeDasharray: 140,
          strokeDashoffset: 140,
          opacity: 0.95,
        })
        .set(pincelRef.current, {
          x: -18,
          y: 22,
          rotation: -18,
        })
        .to(
          pincelRef.current,
          {
            x: 16,
            y: -24,
            rotation: 10,
            duration: 1.15,
            ease: "sine.inOut",
          },
          0
        )
        .to(
          capaEsmalteRef.current,
          {
            scaleY: 1,
            duration: 1.15,
            ease: "sine.inOut",
          },
          0
        )
        .to(
          trazoRef.current,
          {
            strokeDashoffset: 0,
            duration: 1.1,
            ease: "power2.inOut",
          },
          0.05
        )
        .fromTo(
          brilloUnaRef.current,
          { opacity: 0, x: -16 },
          { opacity: 0.95, x: 16, duration: 0.55, ease: "power2.out" },
          0.65
        )
        .to(
          [capaEsmalteRef.current, trazoRef.current, brilloUnaRef.current],
          {
            opacity: 0.15,
            duration: 0.38,
            ease: "power1.inOut",
          },
          1.35
        );

      if (destellos.length) {
        gsap.fromTo(
          destellos,
          { opacity: 0.15, scale: 0.4, rotation: 0 },
          {
            opacity: 1,
            scale: 1.25,
            rotation: 90,
            duration: 0.75,
            stagger: 0.18,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          }
        );
      }
    }, overlayRef);

    return () => ctx.revert();
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      className="nail-brush-loader-overlay"
      role="status"
      aria-live="polite"
      aria-label={mensaje}
    >
      <div className="nail-brush-loader-card">
        <div className="nail-brush-stage" aria-hidden="true">
          <span className="loader-nail-sparkle sp-1">✦</span>
          <span className="loader-nail-sparkle sp-2">✧</span>
          <span className="loader-nail-sparkle sp-3">✦</span>
          <span className="loader-nail-sparkle sp-4">✧</span>

          <svg
            viewBox="0 0 180 180"
            className="nail-brush-svg"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="nailBaseGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#F8FAFC" />
                <stop offset="50%" stopColor="#FCE7F3" />
                <stop offset="100%" stopColor="#E0F2FE" />
              </linearGradient>
              <linearGradient id="nailPolishGrad" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="#5BC0F8" />
                <stop offset="52%" stopColor="#C084FC" />
                <stop offset="100%" stopColor="#F472B6" />
              </linearGradient>
              <clipPath id="almondNailClip">
                <path d="M90 34 C116 34, 128 74, 126 116 C124 134, 110 144, 90 144 C70 144, 56 134, 54 116 C52 74, 64 34, 90 34 Z" />
              </clipPath>
            </defs>

            <ellipse
              cx="90"
              cy="148"
              rx="44"
              ry="10"
              fill="rgba(91, 192, 248, 0.22)"
            />

            <path
              d="M90 34 C116 34, 128 74, 126 116 C124 134, 110 144, 90 144 C70 144, 56 134, 54 116 C52 74, 64 34, 90 34 Z"
              fill="url(#nailBaseGrad)"
              stroke="#5BC0F8"
              strokeWidth="2.5"
            />

            <g clipPath="url(#almondNailClip)">
              <rect
                ref={capaEsmalteRef}
                x="48"
                y="30"
                width="84"
                height="120"
                fill="url(#nailPolishGrad)"
                opacity="0.88"
              />
              <path
                ref={trazoRef}
                d="M74 132 C76 102, 86 68, 96 42"
                stroke="#FFFFFF"
                strokeWidth="5"
                strokeLinecap="round"
                opacity="0.9"
              />
              <path
                ref={brilloUnaRef}
                d="M68 56 C74 46, 86 40, 100 42"
                stroke="#FFFFFF"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
            </g>

            <path
              d="M72 132 C78 124, 102 124, 108 132"
              stroke="rgba(255,255,255,0.85)"
              strokeWidth="2"
              strokeLinecap="round"
            />

            <g ref={pincelRef}>
              <rect
                x="104"
                y="8"
                width="10"
                height="42"
                rx="4"
                transform="rotate(28 104 8)"
                fill="#0F172A"
                stroke="#5BC0F8"
                strokeWidth="1.5"
              />
              <rect
                x="84"
                y="44"
                width="8"
                height="10"
                rx="2"
                transform="rotate(28 84 44)"
                fill="#E2E8F0"
              />
              <path
                d="M80 52 L87 56 L77 74 C74 75, 71 72, 72 68 Z"
                fill="#5BC0F8"
              />
              <circle cx="75" cy="73" r="3.5" fill="#F472B6" />
            </g>
          </svg>
        </div>

        <strong className="nail-brush-loader-title">{mensaje}</strong>
        {submensaje && (
          <span className="nail-brush-loader-subtitle">{submensaje}</span>
        )}
      </div>
    </div>
  );
}

export function EscenaPincelConfirmacion({ reserva }) {
  const contenedorRef = useRef(null);
  const pincelRef = useRef(null);
  const trazoDecorativoRef = useRef(null);
  const mensajeRef = useRef(null);

  useEffect(() => {
    if (!reserva || !contenedorRef.current) return;
    const reducido = prefiereMovimientoReducido();

    const ctx = gsap.context(() => {
      const destellos = contenedorRef.current.querySelectorAll(".celebration-sparkle");

      if (reducido) {
        gsap.fromTo(
          contenedorRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.4 }
        );
        return;
      }

      const tl = gsap.timeline();

      tl.fromTo(
        contenedorRef.current,
        { opacity: 0, y: 20, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "power3.out" }
      )
        .fromTo(
          trazoDecorativoRef.current,
          { strokeDasharray: 320, strokeDashoffset: 320 },
          { strokeDashoffset: 0, duration: 0.95, ease: "power2.inOut" },
          0.1
        )
        .fromTo(
          pincelRef.current,
          { x: -110, y: 12, rotation: -22, opacity: 0 },
          {
            x: 110,
            y: -6,
            rotation: 12,
            opacity: 1,
            duration: 0.95,
            ease: "power2.inOut",
          },
          0.1
        )
        .fromTo(
          mensajeRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.48, ease: "back.out(1.7)" },
          0.45
        );

      if (destellos.length) {
        gsap.fromTo(
          destellos,
          { opacity: 0, scale: 0, y: 10 },
          {
            opacity: 1,
            scale: 1.2,
            y: -6,
            duration: 0.55,
            stagger: 0.08,
            ease: "back.out(2.2)",
            delay: 0.35,
          }
        );
      }
    }, contenedorRef);

    return () => ctx.revert();
  }, [reserva]);

  if (!reserva) return null;

  return (
    <div ref={contenedorRef} className="brush-celebration-banner" role="status">
      <div className="brush-celebration-sparkles" aria-hidden="true">
        <span className="celebration-sparkle cs-1">✦</span>
        <span className="celebration-sparkle cs-2">✧</span>
        <span className="celebration-sparkle cs-3">✦</span>
        <span className="celebration-sparkle cs-4">✧</span>
        <span className="celebration-sparkle cs-5">✦</span>
      </div>

      <svg
        viewBox="0 0 320 68"
        className="brush-stroke-banner-svg"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="celebrationStrokeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#5BC0F8" />
            <stop offset="50%" stopColor="#C084FC" />
            <stop offset="100%" stopColor="#F472B6" />
          </linearGradient>
        </defs>
        <path
          ref={trazoDecorativoRef}
          d="M24 44 C92 16, 168 62, 296 28"
          stroke="url(#celebrationStrokeGrad)"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <g ref={pincelRef} transform="translate(150, 18)">
          <rect
            x="0"
            y="-14"
            width="7"
            height="24"
            rx="3"
            transform="rotate(35)"
            fill="#0F172A"
            stroke="#5BC0F8"
            strokeWidth="1.2"
          />
          <path d="M-12 6 L-5 10 L-16 20 Z" fill="#5BC0F8" />
          <circle cx="-16" cy="20" r="3" fill="#F472B6" />
        </g>
      </svg>

      <div ref={mensajeRef} className="brush-celebration-copy">
        <strong className="brush-celebration-title">
          ¡Tu cita ha sido reservada con éxito!
        </strong>
        <span className="brush-celebration-sub">
          Ticket oficial <strong>{reserva.ticket}</strong> · {reserva.servicioNombre}
        </span>
      </div>
    </div>
  );
}

export function EscenaPincelCancelacion({ visible, ticket }) {
  const contenedorRef = useRef(null);
  const trazoFadeRef = useRef(null);
  const pincelFadeRef = useRef(null);

  useEffect(() => {
    if (!visible || !contenedorRef.current) return;
    const reducido = prefiereMovimientoReducido();

    const ctx = gsap.context(() => {
      if (reducido) {
        gsap.fromTo(
          contenedorRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.35 }
        );
        return;
      }

      const tl = gsap.timeline();
      tl.fromTo(
        contenedorRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
      )
        .fromTo(
          trazoFadeRef.current,
          { strokeDasharray: 280, strokeDashoffset: 0, opacity: 0.9 },
          {
            strokeDashoffset: 280,
            opacity: 0.18,
            duration: 1.15,
            ease: "power2.inOut",
          },
          0.15
        )
        .fromTo(
          pincelFadeRef.current,
          { x: 90, opacity: 1, rotation: 8 },
          {
            x: -90,
            opacity: 0.35,
            rotation: -16,
            duration: 1.15,
            ease: "power2.inOut",
          },
          0.15
        );
    }, contenedorRef);

    return () => ctx.revert();
  }, [visible, ticket]);

  if (!visible) return null;

  return (
    <div ref={contenedorRef} className="brush-cancellation-banner" role="status">
      <svg
        viewBox="0 0 300 60"
        className="brush-stroke-banner-svg"
        fill="none"
        aria-hidden="true"
      >
        <path
          ref={trazoFadeRef}
          d="M28 34 C105 18, 195 48, 272 26"
          stroke="#94A3B8"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <g ref={pincelFadeRef} transform="translate(145, 16)">
          <rect
            x="0"
            y="-12"
            width="7"
            height="22"
            rx="3"
            transform="rotate(30)"
            fill="#334155"
            stroke="#CBD5E1"
            strokeWidth="1.2"
          />
          <path d="M-10 6 L-4 9 L-14 18 Z" fill="#94A3B8" />
        </g>
      </svg>

      <div className="brush-celebration-copy">
        <strong className="brush-cancellation-title">
          Tu cita ha sido cancelada
        </strong>
        <span className="brush-cancellation-sub">
          {ticket
            ? `La reserva ${ticket} fue cerrada delicadamente y su horario ha quedado liberado.`
            : "Tu reserva fue cerrada y el horario ha quedado liberado."}
        </span>
      </div>
    </div>
  );
}
