export const CATEGORIAS_INSPIRACION = [
  { id: "todas", label: "Todas" },
  { id: "francesas", label: "Francesas" },
  { id: "minimalistas", label: "Minimalistas" },
  { id: "elegantes", label: "Elegantes" },
  { id: "acrilicas", label: "Acrílicas" },
  { id: "gel", label: "Gel" },
  { id: "decoradas", label: "Decoradas" },
  { id: "florales", label: "Florales" },
  { id: "cromadas", label: "Cromadas" },
  { id: "temporada", label: "Temporada y ocasiones especiales" },
];

export const SUGERENCIAS_BUSQUEDA_INSPIRACION = [
  "Uñas rosadas",
  "Manicura francesa",
  "Uñas acrílicas",
  "Uñas almendradas",
  "Diseños minimalistas",
  "Uñas con flores",
  "Uñas cromadas",
  "Uñas elegantes para eventos",
  "Uñas con glitter",
  "Diseños de uñas para Navidad",
];

let controladorEnCurso = null;

export function cancelarSolicitudInspiracionActiva() {
  if (controladorEnCurso) {
    controladorEnCurso.abort();
    controladorEnCurso = null;
  }
}

export async function obtenerFotografiasInspiracion({
  query = "",
  categoria = "todas",
  page = 1,
  perPage = 12,
  cancelarAnterior = true,
} = {}) {
  if (cancelarAnterior) {
    cancelarSolicitudInspiracionActiva();
  }

  const controlador = new AbortController();
  if (cancelarAnterior) {
    controladorEnCurso = controlador;
  }

  const limpio = String(query || "").trim();
  const endpoint = limpio ? "/api/inspiracion/buscar" : "/api/inspiracion/fotos";

  const params = new URLSearchParams({
    categoria: categoria || "todas",
    page: String(page),
    per_page: String(perPage),
  });

  if (limpio) {
    params.set("query", limpio);
  }

  const respuesta = await fetch(`${endpoint}?${params.toString()}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    signal: controlador.signal,
  });

  const data = await respuesta.json();

  if (!respuesta.ok || data.ok === false) {
    throw new Error(
      data.error || "No fue posible obtener las fotografías de inspiración en este momento."
    );
  }

  return data;
}
