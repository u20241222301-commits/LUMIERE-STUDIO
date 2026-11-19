const UNSPLASH_API_BASE = "https://api.unsplash.com";
const UTM_PARAMS = "utm_source=lumiere_studio_spa&utm_medium=referral";

export const MAPA_CATEGORIAS_UNSPLASH = {
  todas: "nail art manicure luxury nails",
  francesas: "french manicure nails elegant",
  minimalistas: "minimalist nails clean manicure nude nails",
  elegantes: "elegant manicure luxury nails salon",
  acrilicas: "acrylic nails long nails manicure",
  gel: "gel manicure glossy nails pastel nails",
  decoradas: "nail art design decorated nails crystals",
  florales: "floral nails flower nail art spring manicure",
  cromadas: "chrome nails metallic manicure mirror nails",
  temporada: "holiday nails festive manicure party nails glitter",
};

const DICCIONARIO_TRADUCCION_BUSQUEDA = [
  { patron: /uñas?\s+rosad[ao]s?|rosa|pink/i, traduccion: "pink nails rose manicure" },
  { patron: /francesa|french/i, traduccion: "french manicure nails" },
  { patron: /acr[ií]lic[ao]s?/i, traduccion: "acrylic nails extension manicure" },
  { patron: /almendrad[ao]s?|almendra|almond/i, traduccion: "almond nails manicure" },
  { patron: /minimalista|natural|nude|sencill/i, traduccion: "minimalist nude nails clean manicure" },
  { patron: /flor(es|al|ales)?/i, traduccion: "floral nail art flower manicure" },
  { patron: /cromad[ao]s?|chrome|espejo|platead/i, traduccion: "chrome mirror metallic nails manicure" },
  { patron: /elegant(es)?|evento|boda|novia/i, traduccion: "elegant luxury wedding manicure nails" },
  { patron: /glitter|brillo|destello|escarcha/i, traduccion: "glitter sparkle nails manicure" },
  { patron: /navidad|temporada|fiesta|rojas/i, traduccion: "holiday festive red gold nails manicure" },
  { patron: /gel|semipermanente|biab/i, traduccion: "gel polish manicure glossy nails" },
  { patron: /decorad[ao]s?|3d|piedras|cristal/i, traduccion: "decorated 3d nail art manicure" },
  { patron: /azul(es)?|cielo|celeste/i, traduccion: "pastel blue nails manicure" },
  { patron: /lila|morad[ao]|lavanda/i, traduccion: "lilac lavender pastel nails manicure" },
];

function construirQueryUnsplash(queryUsuario = "", categoria = "todas") {
  const limpio = String(queryUsuario || "").trim();
  const baseCategoria =
    MAPA_CATEGORIAS_UNSPLASH[categoria] || MAPA_CATEGORIAS_UNSPLASH.todas;

  if (!limpio) {
    return baseCategoria;
  }

  for (const regla of DICCIONARIO_TRADUCCION_BUSQUEDA) {
    if (regla.patron.test(limpio)) {
      return `${regla.traduccion} nails manicure`;
    }
  }

  return `${limpio} nails manicure nail art`;
}

function normalizarFotoUnsplash(foto, idx = 0, categoriaActiva = "todas") {
  const w = Number(foto.width) || 1080;
  const h = Number(foto.height) || 1350;
  const ratio = h / w;
  const alturaTipo =
    ratio > 1.22 ? "alta" : ratio < 0.98 ? "compacta" : idx % 3 === 0 ? "alta" : "media";

  const autorUsuario = foto.user?.username || "unsplash";
  const autorNombre = foto.user?.name || "Fotógrafo de Unsplash";
  const perfilBase =
    foto.user?.links?.html || `https://unsplash.com/@${autorUsuario}`;
  const fotoBase =
    foto.links?.html || `https://unsplash.com/photos/${foto.id}`;

  const separadorPerfil = perfilBase.includes("?") ? "&" : "?";
  const separadorFoto = fotoBase.includes("?") ? "&" : "?";

  const descripcionRaw =
    foto.description ||
    foto.alt_description ||
    "Diseño de manicura e inspiración de uñas";
  const tituloFormateado =
    descripcionRaw.charAt(0).toUpperCase() + descripcionRaw.slice(1, 95);

  return {
    id: `uns-${foto.id}`,
    unsplashId: foto.id,
    titulo: tituloFormateado,
    descripcion:
      foto.description ||
      foto.alt_description ||
      "Fotografía de inspiración para diseño de uñas y manicura profesional.",
    categoria: categoriaActiva === "todas" ? "elegantes" : categoriaActiva,
    alturaTipo,
    width: w,
    height: h,
    colorDominante: foto.color || "#E0F2FE",
    imagenSmallUrl: foto.urls?.small || foto.urls?.regular,
    imagenRegularUrl: foto.urls?.regular || foto.urls?.small,
    imagenGrandeUrl: foto.urls?.full || foto.urls?.regular,
    autorNombre,
    autorUsuario,
    autorPerfilUrl: `${perfilBase}${separadorPerfil}${UTM_PARAMS}`,
    fotoOriginalUrl: `${fotoBase}${separadorFoto}${UTM_PARAMS}`,
    unsplashHomeUrl: `https://unsplash.com/?${UTM_PARAMS}`,
  };
}

export async function consultarFotosUnsplash({
  accessKey = "",
  query = "",
  categoria = "todas",
  page = 1,
  perPage = 12,
}) {
  const paginaSegura = Math.max(1, parseInt(page, 10) || 1);
  const cantidadSegura = Math.min(24, Math.max(1, parseInt(perPage, 10) || 12));
  const queryFinal = construirQueryUnsplash(query, categoria);
  const claveLimpia = String(accessKey || "").trim();

  if (!claveLimpia) {
    return {
      ok: false,
      error: "La clave UNSPLASH_ACCESS_KEY no está configurada en el archivo .env del backend.",
      resultados: [],
    };
  }

  const params = new URLSearchParams({
    query: queryFinal,
    page: String(paginaSegura),
    per_page: String(cantidadSegura),
    content_filter: "high",
  });

  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), 10000);

  try {
    const respuesta = await fetch(
      `${UNSPLASH_API_BASE}/search/photos?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Client-ID ${claveLimpia}`,
          "Accept-Version": "v1",
        },
        signal: controlador.signal,
      }
    );

    if (respuesta.status === 401) {
      return {
        ok: false,
        error: "Error de autenticación con Unsplash API. Verifica UNSPLASH_ACCESS_KEY.",
        resultados: [],
      };
    }

    if (respuesta.status === 403) {
      return {
        ok: false,
        error: "Se alcanzó temporalmente el límite de solicitudes de Unsplash API. Intenta nuevamente en unos minutos.",
        resultados: [],
      };
    }

    if (!respuesta.ok) {
      return {
        ok: false,
        error: `No fue posible obtener diseños desde Unsplash (estado ${respuesta.status}).`,
        resultados: [],
      };
    }

    const data = await respuesta.json();
    const resultadosNormalizados = Array.isArray(data.results)
      ? data.results
          .filter((foto) => foto && foto.urls && (foto.urls.regular || foto.urls.small))
          .map((foto, i) => normalizarFotoUnsplash(foto, i, categoria))
      : [];

    const totalPaginas = Number(data.total_pages) || 1;

    return {
      ok: true,
      fuente: "unsplash_api_oficial",
      queryAplicada: queryFinal,
      pagina: paginaSegura,
      porPagina: cantidadSegura,
      total: Number(data.total) || resultadosNormalizados.length,
      totalPaginas,
      hayMas: paginaSegura < totalPaginas,
      resultados: resultadosNormalizados,
    };
  } catch (err) {
    return {
      ok: false,
      error: err.message || "Error de conexión al consultar Unsplash API.",
      resultados: [],
    };
  } finally {
    clearTimeout(temporizador);
  }
}
