import { useEffect } from "react";
import gsap from "gsap";

export default function usePageBackdropAnimations(rootRef) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia(root);

    mm.add(
      {
        always: "(min-width: 0px)",
        reduce: "(prefers-reduced-motion: reduce)",
        mobile: "(max-width: 760px)",
      },
      (context) => {
        const { reduce, mobile } = context.conditions;
        const factor = mobile ? 0.6 : 1;

        const visibles = (selector) =>
          gsap.utils
            .toArray(selector, root)
            .filter((el) => getComputedStyle(el).display !== "none");

        const items = visibles(".pbg-item");
        const destellos = visibles(".pbg-glint");

        if (reduce) {
          gsap.set(items, {
            autoAlpha: (i, el) => parseFloat(el.dataset.op) || 0.5,
          });
          gsap.set(destellos, { autoAlpha: 0.55 });
          return;
        }

        gsap.fromTo(
          items,
          { autoAlpha: 0, scale: 0.92 },
          {
            autoAlpha: (i, el) => parseFloat(el.dataset.op) || 0.5,
            scale: 1,
            duration: 1.4,
            stagger: 0.12,
            ease: "power2.out",
          }
        );

        items.forEach((item, i) => {
          const flotante = item.querySelector(".pbg-float");
          if (!flotante) return;
          const amp = (parseFloat(item.dataset.amp) || 8) * factor;
          const dur = parseFloat(item.dataset.dur) || 10;
          const wob = (parseFloat(item.dataset.wob) || 2) * factor;
          const signo = i % 2 === 0 ? 1 : -1;

          gsap.to(flotante, {
            y: amp * signo,
            x: amp * 0.4 * -signo,
            rotation: wob * signo,
            duration: dur,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 1.2 + i * 0.35,
          });
        });

        destellos.forEach((d, i) => {
          gsap.fromTo(
            d,
            { autoAlpha: 0.08, scale: 0.6 },
            {
              autoAlpha: 0.85,
              scale: 1.1,
              duration: 2.6 + i * 0.5,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              delay: i * 0.9,
            }
          );
        });
      }
    );

    return () => {
      mm.revert();
    };
  }, [rootRef]);
}
