import { useRef } from "react";
import { Destello, ESCENAS, ItemDecorativo } from "./PageBackdropElements";
import usePageBackdropAnimations from "./usePageBackdropAnimations";

export default function FondoPaginaInterna({ vista }) {
  const rootRef = useRef(null);
  usePageBackdropAnimations(rootRef);

  const escena = ESCENAS[vista];
  if (!escena) return null;

  return (
    <div ref={rootRef} className={`pbg-scene pbg-scene-${vista}`} aria-hidden="true">
      {escena.items.map((it) => (
        <ItemDecorativo key={it.id} it={it} />
      ))}
      {escena.destellos.map((d, i) => (
        <Destello key={`${vista}-g${i}`} pos={d.pos} color={d.color} mobile={d.mobile} />
      ))}
    </div>
  );
}
