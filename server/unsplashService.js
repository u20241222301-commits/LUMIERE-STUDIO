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

export const CATALOGO_RESPALDO_UNSPLASH = [
  {
    id: "uns-nail-01",
    unsplashId: "y8OPPvoL3_A",
    titulo: "Manicura Francesa Clásica & Acabado Perlado",
    descripcion: "Diseño elegante de puntas blancas sobre base rosa traslúcida con brillo espejo.",
    categoria: "francesas",
    etiquetas: ["francesas", "elegantes", "minimalistas", "almendradas", "rosadas"],
    alturaTipo: "alta",
    width: 1080,
    height: 1440,
    colorDominante: "#FBCFE8",
    imagenSmallUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80",
    imagenRegularUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1080&q=85",
    imagenGrandeUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1600&q=90",
    imagenRespaldoLocal: "/imagenes/servicio-manicura-rosa-perlada.png",
    autorNombre: "Chelson Tamares",
    autorUsuario: "chelsontamares",
    autorPerfilUrl: `https://unsplash.com/@chelsontamares?${UTM_PARAMS}`,
    fotoOriginalUrl: `https://unsplash.com/photos/y8OPPvoL3_A?${UTM_PARAMS}`,
    unsplashHomeUrl: `https://unsplash.com/?${UTM_PARAMS}`,
  },
  {
    id: "uns-nail-02",
    unsplashId: "k60JspcBwKE",
    titulo: "Uñas Rosadas Pastel en Gel Brillante",
    descripcion: "Esmaltado en gel hipoalergénico tono rosa cuarzo con cutícula perfecta.",
    categoria: "gel",
    etiquetas: ["gel", "rosadas", "minimalistas", "elegantes", "pastel"],
    alturaTipo: "media",
    width: 1080,
    height: 1200,
    colorDominante: "#F9A8D4",
    imagenSmallUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
    imagenRegularUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1080&q=85",
    imagenGrandeUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1600&q=90",
    imagenRespaldoLocal: "/imagenes/servicio-manicura-iridiscente.png",
    autorNombre: "Element5 Digital",
    autorUsuario: "element5digital",
    autorPerfilUrl: `https://unsplash.com/@element5digital?${UTM_PARAMS}`,
    fotoOriginalUrl: `https://unsplash.com/photos/k60JspcBwKE?${UTM_PARAMS}`,
    unsplashHomeUrl: `https://unsplash.com/?${UTM_PARAMS}`,
  },
  {
    id: "uns-nail-03",
    titulo: "Uñas Acrílicas Almendradas & Trazos Artísticos",
    descripcion: "Extensión estructural almendrada con líneas orgánicas en tonos pastel y blanco.",
    categoria: "acrilicas",
    etiquetas: ["acrilicas", "almendradas", "decoradas", "elegantes"],
    alturaTipo: "alta",
    width: 1080,
    height: 1450,
    colorDominante: "#E2E8F0",
    imagenSmallUrl: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=600&q=80",
    imagenRegularUrl: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1080&q=85",
    imagenGrandeUrl: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1600&q=90",
    imagenRespaldoLocal: "/imagenes/servicio-esculpido-cristal.png",
    autorNombre: "pesce huang",
    autorUsuario: "pesce_huang",
    autorPerfilUrl: `https://unsplash.com/@pesce_huang?${UTM_PARAMS}`,
    fotoOriginalUrl: `https://unsplash.com/@pesce_huang?${UTM_PARAMS}`,
    unsplashHomeUrl: `https://unsplash.com/?${UTM_PARAMS}`,
  },
  {
    id: "uns-nail-04",
    titulo: "Diseño Minimalista Nude & Brillo Cristal",
    descripcion: "Manicura clean look en tonos nude lechosos ideal para eventos y uso diario.",
    categoria: "minimalistas",
    etiquetas: ["minimalistas", "nude", "natural", "elegantes", "eventos"],
    alturaTipo: "compacta",
    width: 1080,
    height: 980,
    colorDominante: "#F1F5F9",
    imagenSmallUrl: "https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=600&q=80",
    imagenRegularUrl: "https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=1080&q=85",
    imagenGrandeUrl: "https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=1600&q=90",
    imagenRespaldoLocal: "/imagenes/servicio-manicura-nude-dorada.png",
    autorNombre: "Giorgio Trovato",
    autorUsuario: "giorgiotrovato",
    autorPerfilUrl: `https://unsplash.com/@giorgiotrovato?${UTM_PARAMS}`,
    fotoOriginalUrl: `https://unsplash.com/@giorgiotrovato?${UTM_PARAMS}`,
    unsplashHomeUrl: `https://unsplash.com/?${UTM_PARAMS}`,
  },
  {
    id: "uns-nail-05",
    titulo: "Nail Art Floral Botánico & Tonos Primavera",
    descripcion: "Delicadas flores pintadas a mano con micro-pincel sobre base rosa suave.",
    categoria: "florales",
    etiquetas: ["florales", "flores", "decoradas", "rosadas", "primavera"],
    alturaTipo: "alta",
    width: 1080,
    height: 1420,
    colorDominante: "#FCE7F3",
    imagenSmallUrl: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=600&q=80",
    imagenRegularUrl: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=1080&q=85",
    imagenGrandeUrl: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=1600&q=90",
    imagenRespaldoLocal: "/imagenes/servicio-pedicura-rusa-jelly.png",
    autorNombre: "Designecologist",
    autorUsuario: "designecologist",
    autorPerfilUrl: `https://unsplash.com/@designecologist?${UTM_PARAMS}`,
    fotoOriginalUrl: `https://unsplash.com/@designecologist?${UTM_PARAMS}`,
    unsplashHomeUrl: `https://unsplash.com/?${UTM_PARAMS}`,
  },
  {
    id: "uns-nail-06",
    titulo: "Efecto Cromado Glazed Donut & Destellos",
    descripcion: "Acabado espejo perlado con pigmento cromado iridiscente de larga duración.",
    categoria: "cromadas",
    etiquetas: ["cromadas", "chrome", "espejo", "glitter", "elegantes"],
    alturaTipo: "media",
    width: 1080,
    height: 1220,
    colorDominante: "#E0F2FE",
    imagenSmallUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=620&q=80",
    imagenRegularUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1080&q=85",
    imagenGrandeUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1600&q=90",
    imagenRespaldoLocal: "/imagenes/servicio-manicura-cromada.png",
    autorNombre: "Chelson Tamares",
    autorUsuario: "chelsontamares",
    autorPerfilUrl: `https://unsplash.com/@chelsontamares?${UTM_PARAMS}`,
    fotoOriginalUrl: `https://unsplash.com/photos/y8OPPvoL3_A?${UTM_PARAMS}`,
    unsplashHomeUrl: `https://unsplash.com/?${UTM_PARAMS}`,
  },
  {
    id: "uns-nail-07",
    titulo: "Uñas Elegantes para Eventos & Gala",
    descripcion: "Manicura de alta costura con destellos sutiles y silueta estilizada para ocasiones especiales.",
    categoria: "elegantes",
    etiquetas: ["elegantes", "eventos", "temporada", "boda", "glitter"],
    alturaTipo: "alta",
    width: 1080,
    height: 1440,
    colorDominante: "#F3E8FF",
    imagenSmallUrl: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=600&q=80",
    imagenRegularUrl: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=1080&q=85",
    imagenGrandeUrl: "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=1600&q=90",
    imagenRespaldoLocal: "/imagenes/servicio-ritual-aurora-tornasol.png",
    autorNombre: "icons8 Team",
    autorUsuario: "icons8",
    autorPerfilUrl: `https://unsplash.com/@icons8?${UTM_PARAMS}`,
    fotoOriginalUrl: `https://unsplash.com/@icons8?${UTM_PARAMS}`,
    unsplashHomeUrl: `https://unsplash.com/?${UTM_PARAMS}`,
  },
  {
    id: "uns-nail-08",
    titulo: "Uñas Decoradas con Glitter & Cristales",
    descripcion: "Encapsulado luminoso con micro-glitter holográfico y detalles en relieve.",
    categoria: "decoradas",
    etiquetas: ["decoradas", "glitter", "brillo", "cromadas", "temporada"],
    alturaTipo: "compacta",
    width: 1080,
    height: 960,
    colorDominante: "#DDD6FE",
    imagenSmallUrl: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=640&q=80",
    imagenRegularUrl: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1080&q=85",
    imagenGrandeUrl: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1600&q=90",
    imagenRespaldoLocal: "/imagenes/servicio-coquette-chrome-art.png",
    autorNombre: "pesce huang",
    autorUsuario: "pesce_huang",
    autorPerfilUrl: `https://unsplash.com/@pesce_huang?${UTM_PARAMS}`,
    fotoOriginalUrl: `https://unsplash.com/@pesce_huang?${UTM_PARAMS}`,
    unsplashHomeUrl: `https://unsplash.com/?${UTM_PARAMS}`,
  },
  {
    id: "uns-nail-09",
    titulo: "Diseño Festivo de Temporada & Navidad",
    descripcion: "Tonos intensos de temporada con acentos dorados y destellos de celebración.",
    categoria: "temporada",
    etiquetas: ["temporada", "navidad", "fiesta", "glitter", "elegantes"],
    alturaTipo: "media",
    width: 1080,
    height: 1240,
    colorDominante: "#FECDD3",
    imagenSmallUrl: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=640&q=80",
    imagenRegularUrl: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=1080&q=85",
    imagenGrandeUrl: "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=1600&q=90",
    imagenRespaldoLocal: "/imagenes/servicio-pedicura-imperial.png",
    autorNombre: "Designecologist",
    autorUsuario: "designecologist",
    autorPerfilUrl: `https://unsplash.com/@designecologist?${UTM_PARAMS}`,
    fotoOriginalUrl: `https://unsplash.com/@designecologist?${UTM_PARAMS}`,
    unsplashHomeUrl: `https://unsplash.com/?${UTM_PARAMS}`,
  },
  {
    id: "uns-nail-10",
    titulo: "Manicura Francesa Micro-Line & Tonos Pastel",
    descripcion: "Variación contemporánea de la manicura francesa con sonrisa fina en azul cielo y rosa.",
    categoria: "francesas",
    etiquetas: ["francesas", "minimalistas", "gel", "azul", "rosadas"],
    alturaTipo: "alta",
    width: 1080,
    height: 1400,
    colorDominante: "#BAE6FD",
    imagenSmallUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=650&q=80",
    imagenRegularUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1100&q=85",
    imagenGrandeUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1600&q=90",
    imagenRespaldoLocal: "/imagenes/servicio-manicura-rosa-perlada.png",
    autorNombre: "Chelson Tamares",
    autorUsuario: "chelsontamares",
    autorPerfilUrl: `https://unsplash.com/@chelsontamares?${UTM_PARAMS}`,
    fotoOriginalUrl: `https://unsplash.com/photos/y8OPPvoL3_A?${UTM_PARAMS}`,
    unsplashHomeUrl: `https://unsplash.com/?${UTM_PARAMS}`,
  },
  {
    id: "uns-nail-11",
    titulo: "Soft Gel Almendrado & Efecto Aura Lila",
    descripcion: "Difuminado central en tonos lavanda y rosa perlado sobre uña almendrada.",
    categoria: "gel",
    etiquetas: ["gel", "almendradas", "lila", "rosadas", "decoradas"],
    alturaTipo: "media",
    width: 1080,
    height: 1180,
    colorDominante: "#E9D5FF",
    imagenSmallUrl: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=650&q=80",
    imagenRegularUrl: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1100&q=85",
    imagenGrandeUrl: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1600&q=90",
    imagenRespaldoLocal: "/imagenes/servicio-manicura-iridiscente.png",
    autorNombre: "pesce huang",
    autorUsuario: "pesce_huang",
    autorPerfilUrl: `https://unsplash.com/@pesce_huang?${UTM_PARAMS}`,
    fotoOriginalUrl: `https://unsplash.com/@pesce_huang?${UTM_PARAMS}`,
    unsplashHomeUrl: `https://unsplash.com/?${UTM_PARAMS}`,
  },
  {
    id: "uns-nail-12",
    titulo: "Acrílicas Esculpidas & Joyería Coreana",
    descripcion: "Estructura esculpida de salón con destellos cristalinos y acabado espejo.",
    categoria: "acrilicas",
    etiquetas: ["acrilicas", "cromadas", "decoradas", "elegantes", "glitter"],
    alturaTipo: "compacta",
    width: 1080,
    height: 990,
    colorDominante: "#E0F2FE",
    imagenSmallUrl: "https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=650&q=80",
    imagenRegularUrl: "https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=1100&q=85",
    imagenGrandeUrl: "https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=1600&q=90",
    imagenRespaldoLocal: "/imagenes/servicio-esculpido-cristal.png",
    autorNombre: "Giorgio Trovato",
    autorUsuario: "giorgiotrovato",
    autorPerfilUrl: `https://unsplash.com/@giorgiotrovato?${UTM_PARAMS}`,
    fotoOriginalUrl: `https://unsplash.com/@giorgiotrovato?${UTM_PARAMS}`,
    unsplashHomeUrl: `https://unsplash.com/?${UTM_PARAMS}`,
  },
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

function filtrarCatalogoRespaldo({ query = "", categoria = "todas", page = 1, perPage = 12 }) {
  const termino = String(query || "").trim().toLowerCase();
  let lista = [...CATALOGO_RESPALDO_UNSPLASH];

  if (categoria && categoria !== "todas") {
    const porCat = lista.filter(
      (item) =>
        item.categoria === categoria ||
        item.etiquetas.includes(categoria)
    );
    if (porCat.length > 0) {
      lista = porCat;
    }
  }

  if (termino) {
    const palabras = termino
      .replace(/uñas|unas|diseños|disenos|de|para|con|en/gi, " ")
      .split(/\s+/)
      .map((p) => p.trim())
      .filter((p) => p.length >= 2);

    if (palabras.length > 0) {
      lista = lista.filter((item) => {
        const textoItem = `${item.titulo} ${item.descripcion} ${item.categoria} ${item.etiquetas.join(" ")}`.toLowerCase();
        return palabras.some((pal) => textoItem.includes(pal));
      });
    }
  }

  if (lista.length === 0) {
    return {
      resultados: [],
      total: 0,
      totalPaginas: 0,
    };
  }

  if (page > 1) {
    const desplazada = lista.map((item, idx) => ({
      ...item,
      id: `${item.id}-p${page}-${idx}`,
      alturaTipo: idx % 2 === 0 ? "media" : "alta",
    }));
    return {
      resultados: desplazada.slice(0, perPage),
      total: lista.length * 3,
      totalPaginas: 3,
    };
  }

  return {
    resultados: lista.slice(0, perPage),
    total: lista.length * 3,
    totalPaginas: 3,
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
    const respaldo = filtrarCatalogoRespaldo({
      query,
      categoria,
      page: paginaSegura,
      perPage: cantidadSegura,
    });
    return {
      ok: true,
      fuente: "unsplash_curado",
      queryAplicada: queryFinal,
      pagina: paginaSegura,
      porPagina: cantidadSegura,
      total: respaldo.total,
      totalPaginas: respaldo.totalPaginas,
      hayMas: paginaSegura < respaldo.totalPaginas,
      resultados: respaldo.resultados,
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

    if (respuesta.status === 401 || respuesta.status === 403) {
      const respaldo = filtrarCatalogoRespaldo({
        query,
        categoria,
        page: paginaSegura,
        perPage: cantidadSegura,
      });
      return {
        ok: true,
        fuente: "unsplash_curado",
        aviso:
          "Límite de solicitudes o clave de Unsplash en verificación; mostrando galería de respaldo.",
        pagina: paginaSegura,
        porPagina: cantidadSegura,
        total: respaldo.total,
        totalPaginas: respaldo.totalPaginas,
        hayMas: paginaSegura < respaldo.totalPaginas,
        resultados: respaldo.resultados,
      };
    }

    if (!respuesta.ok) {
      throw new Error(`Unsplash API respondió con estado ${respuesta.status}`);
    }

    const data = await respuesta.json();
    const resultadosNormalizados = Array.isArray(data.results)
      ? data.results.map((foto, i) =>
          normalizarFotoUnsplash(foto, i, categoria)
        )
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
  } catch {
    const respaldo = filtrarCatalogoRespaldo({
      query,
      categoria,
      page: paginaSegura,
      perPage: cantidadSegura,
    });
    return {
      ok: true,
      fuente: "unsplash_curado",
      pagina: paginaSegura,
      porPagina: cantidadSegura,
      total: respaldo.total,
      totalPaginas: respaldo.totalPaginas,
      hayMas: paginaSegura < respaldo.totalPaginas,
      resultados: respaldo.resultados,
    };
  } finally {
    clearTimeout(temporizador);
  }
}
