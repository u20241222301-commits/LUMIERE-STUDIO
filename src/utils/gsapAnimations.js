import gsap from "gsap";

export function prefiereMovimientoReducido() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function crearContextoGsap(scopeRef, callback) {
  if (!scopeRef?.current) return () => {};
  const reducido = prefiereMovimientoReducido();
  const ctx = gsap.context(() => {
    callback(gsap, reducido);
  }, scopeRef);
  return () => ctx.revert();
}

export function animarEntradaPagina(contenedorEl, opciones = {}) {
  if (!contenedorEl) return null;
  const reducido = prefiereMovimientoReducido();
  const {
    selectorHeader = ".services-hero-header, .hero-open-center, .reviews-header",
    selectorItems = ".service-luxury-card, .booking-form-card, .booking-summary-card, .review-glass-panel, .admin-reservation-row",
    stagger = 0.08,
    duracion = 0.72,
    desplazamientoY = 26,
  } = opciones;

  return gsap.context(() => {
    const headers =
      selectorHeader && selectorHeader.trim()
        ? contenedorEl.querySelectorAll(selectorHeader)
        : [];
    const items =
      selectorItems && selectorItems.trim()
        ? contenedorEl.querySelectorAll(selectorItems)
        : [];

    if (reducido) {
      if (headers.length) gsap.fromTo(headers, { opacity: 0 }, { opacity: 1, duration: 0.35 });
      if (items.length) gsap.fromTo(items, { opacity: 0 }, { opacity: 1, duration: 0.35 });
      return;
    }

    if (headers.length) {
      gsap.fromTo(
        headers,
        { opacity: 0, y: -18, scale: 0.985 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.68,
          ease: "power3.out",
          clearProps: "transform",
        }
      );
    }

    if (items.length) {
      gsap.fromTo(
        items,
        { opacity: 0, y: desplazamientoY, scale: 0.975 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: duracion,
          stagger,
          ease: "power3.out",
          clearProps: "transform",
        }
      );
    }
  }, contenedorEl);
}

export function animarPulsoSeleccion(elemento) {
  if (!elemento || prefiereMovimientoReducido()) return;
  gsap.killTweensOf(elemento);
  gsap.fromTo(
    elemento,
    { scale: 0.96 },
    {
      scale: 1,
      duration: 0.42,
      ease: "back.out(2.2)",
      clearProps: "transform",
    }
  );
}

export function animarAvisoRestriccion(elemento) {
  if (!elemento) return;
  gsap.killTweensOf(elemento);
  if (prefiereMovimientoReducido()) {
    gsap.fromTo(elemento, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    return;
  }
  const tl = gsap.timeline();
  tl.fromTo(
    elemento,
    { opacity: 0, y: -10, scale: 0.98 },
    { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "power2.out" }
  ).to(elemento, {
    x: [-5, 5, -4, 4, 0],
    duration: 0.38,
    ease: "power1.inOut",
    clearProps: "transform",
  });
}

export function animarHoverTarjetaServicio(tarjetaEl, entrando) {
  if (!tarjetaEl || prefiereMovimientoReducido()) return;
  const imagen = tarjetaEl.querySelector(".service-card-photo-img");
  const destellos = tarjetaEl.querySelectorAll(".gsap-card-sparkle");
  const boton = tarjetaEl.querySelector(".service-book-btn");

  gsap.killTweensOf([tarjetaEl, imagen, destellos, boton]);

  if (entrando) {
    gsap.to(tarjetaEl, {
      y: -8,
      duration: 0.38,
      ease: "power2.out",
    });
    if (imagen) {
      gsap.to(imagen, {
        scale: 1.06,
        duration: 0.55,
        ease: "power2.out",
      });
    }
    if (destellos.length) {
      gsap.fromTo(
        destellos,
        { opacity: 0, scale: 0.3, rotation: 0 },
        {
          opacity: 1,
          scale: 1.15,
          rotation: 45,
          duration: 0.45,
          stagger: 0.06,
          ease: "back.out(2)",
        }
      );
    }
    if (boton) {
      gsap.to(boton, {
        scale: 1.02,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  } else {
    gsap.to(tarjetaEl, {
      y: 0,
      duration: 0.38,
      ease: "power2.out",
      clearProps: "transform",
    });
    if (imagen) {
      gsap.to(imagen, {
        scale: 1,
        duration: 0.45,
        ease: "power2.out",
      });
    }
    if (destellos.length) {
      gsap.to(destellos, {
        opacity: 0,
        scale: 0.4,
        duration: 0.28,
        ease: "power2.in",
      });
    }
    if (boton) {
      gsap.to(boton, {
        scale: 1,
        duration: 0.28,
        ease: "power2.out",
        clearProps: "transform",
      });
    }
  }
}

export function animarFondoPorRuta(contenedorEl, rutaActual) {
  if (!contenedorEl) return null;
  const reducido = prefiereMovimientoReducido();

  return gsap.context(() => {
    const destellos = contenedorEl.querySelectorAll(".floating-sparkle");
    const gotasEsmalte = contenedorEl.querySelectorAll(".gsap-bg-polish-drop");
    const siluetasSpa = contenedorEl.querySelectorAll(".gsap-bg-spa-motif");
    const orbes = contenedorEl.querySelectorAll(".aurora-orb");
    const ondasCalma = contenedorEl.querySelectorAll(".gsap-bg-calm-ring");

    if (reducido) {
      gsap.set([destellos, gotasEsmalte, siluetasSpa, ondasCalma], { opacity: 0.35 });
      return;
    }

    if (destellos.length) {
      destellos.forEach((el, i) => {
        gsap.fromTo(
          el,
          {
            opacity: 0.12,
            scale: 0.45,
            rotation: 0,
          },
          {
            opacity: rutaActual === "admin" ? 0.38 : 0.92,
            scale: rutaActual === "admin" ? 0.85 : 1.3,
            rotation: i % 2 === 0 ? 90 : -90,
            y: i % 2 === 0 ? -18 : 16,
            x: i % 3 === 0 ? 10 : -10,
            duration: 2.6 + (i % 5) * 0.65,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: (i % 7) * 0.25,
          }
        );
      });
    }

    if (orbes.length) {
      orbes.forEach((orbe, idx) => {
        gsap.to(orbe, {
          x: idx % 2 === 0 ? 55 : -55,
          y: idx % 2 === 0 ? 40 : -35,
          scale: 1.12,
          duration: rutaActual === "admin" ? 16 : 9 + idx * 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    }

    if (gotasEsmalte.length) {
      gotasEsmalte.forEach((gota, idx) => {
        gsap.fromTo(
          gota,
          { y: 12, opacity: 0.18, scale: 0.88, rotation: -6 },
          {
            y: -26,
            x: idx % 2 === 0 ? 14 : -14,
            opacity: rutaActual === "admin" ? 0.22 : 0.62,
            scale: 1.08,
            rotation: 8,
            duration: 5.2 + (idx % 4) * 1.1,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: idx * 0.4,
          }
        );
      });
    }

    if (siluetasSpa.length) {
      siluetasSpa.forEach((item, idx) => {
        gsap.fromTo(
          item,
          { y: 0, rotation: -5, opacity: 0.16 },
          {
            y: -20,
            x: idx % 2 === 0 ? 12 : -12,
            rotation: 7,
            opacity: rutaActual === "admin" ? 0.18 : 0.48,
            duration: 6.4 + idx * 0.9,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: idx * 0.5,
          }
        );
      });
    }

    if (ondasCalma.length) {
      ondasCalma.forEach((onda, idx) => {
        gsap.fromTo(
          onda,
          { scale: 0.82, opacity: 0.08 },
          {
            scale: 1.24,
            opacity: rutaActual === "admin" ? 0.14 : 0.34,
            duration: 5.5 + idx * 1.4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: idx * 0.8,
          }
        );
      });
    }
  }, contenedorEl);
}
