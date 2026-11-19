import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefiereMovimientoReducido } from "../../utils/gsapAnimations";

gsap.registerPlugin(ScrollTrigger);

export default function useHomeAnimations(rootRef, activo = true) {
  useEffect(() => {
    if (!activo || !rootRef?.current) return;

    const contenedor = rootRef.current;
    const reducido = prefiereMovimientoReducido();

    const ctx = gsap.context(() => {
      const escenaPolish = contenedor.querySelector(".home-scene-polish");
      const escenaHands = contenedor.querySelector(".home-scene-hands");
      const capaTransicion = contenedor.querySelector(".home-paint-transition-layer");

      const luzProfundidad1 = contenedor.querySelector(".gsap-bg-depth-glow-1");
      const luzProfundidad2 = contenedor.querySelector(".gsap-bg-depth-glow-2");

      const bandasTransicion = contenedor.querySelectorAll(
        ".gsap-transition-band, .gsap-transition-gloss-line"
      );
      const pincelProtagonista = contenedor.querySelector(".gsap-protagonist-brush");

      gsap.set(escenaPolish, { autoAlpha: 1 });
      gsap.set(escenaHands, { autoAlpha: 0 });
      gsap.set(capaTransicion, { autoAlpha: 0 });

      const longitudBanda = 2300;
      gsap.set(bandasTransicion, {
        strokeDasharray: longitudBanda,
        strokeDashoffset: longitudBanda,
      });

      if (reducido) {
        ScrollTrigger.create({
          trigger: "#resenas",
          start: "top 65%",
          onEnter: () => {
            gsap.to(escenaPolish, { autoAlpha: 0, duration: 0.4 });
            gsap.to(escenaHands, { autoAlpha: 1, duration: 0.4 });
          },
          onLeaveBack: () => {
            gsap.to(escenaHands, { autoAlpha: 0, duration: 0.4 });
            gsap.to(escenaPolish, { autoAlpha: 1, duration: 0.4 });
          },
        });
        return;
      }

      if (luzProfundidad1) {
        gsap.fromTo(
          luzProfundidad1,
          { opacity: 0.35, x: 16, y: -12, scale: 0.96 },
          {
            opacity: 0.68,
            x: -16,
            y: 12,
            scale: 1.06,
            duration: 7.2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          }
        );
      }

      if (luzProfundidad2) {
        gsap.fromTo(
          luzProfundidad2,
          { opacity: 0.32, x: -14, y: 10, scale: 0.96 },
          {
            opacity: 0.64,
            x: 14,
            y: -10,
            scale: 1.06,
            duration: 7.8,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          }
        );
      }

      const seccionInicio = document.getElementById("inicio");
      const seccionResenas = document.getElementById("resenas");

      if (seccionInicio && seccionResenas) {
        const tlScroll = gsap.timeline({
          scrollTrigger: {
            trigger: seccionInicio,
            start: "top top",
            endTrigger: seccionResenas,
            end: "top 18%",
            scrub: 0.65,
            invalidateOnRefresh: true,
          },
        });

        tlScroll
          .to(
            capaTransicion,
            {
              autoAlpha: 1,
              duration: 0.08,
              ease: "none",
            },
            0.08
          )
          .fromTo(
            pincelProtagonista,
            { x: -260, y: 460, rotation: -26, scale: 0.92 },
            {
              x: 1620,
              y: 360,
              rotation: 16,
              scale: 1.12,
              duration: 0.78,
              ease: "power2.inOut",
            },
            0.1
          )
          .to(
            bandasTransicion,
            {
              strokeDashoffset: 0,
              duration: 0.38,
              stagger: 0.04,
              ease: "power2.inOut",
            },
            0.12
          )
          .to(
            escenaPolish,
            {
              autoAlpha: 0,
              duration: 0.06,
              ease: "none",
            },
            0.47
          )
          .to(
            escenaHands,
            {
              autoAlpha: 1,
              duration: 0.08,
              ease: "none",
            },
            0.48
          )
          .to(
            bandasTransicion,
            {
              strokeDashoffset: -longitudBanda,
              duration: 0.38,
              stagger: 0.04,
              ease: "power2.inOut",
            },
            0.54
          )
          .to(
            capaTransicion,
            {
              autoAlpha: 0,
              duration: 0.08,
              ease: "none",
            },
            0.9
          );
      }
    }, contenedor);

    return () => {
      ctx.revert();
    };
  }, [rootRef, activo]);
}
