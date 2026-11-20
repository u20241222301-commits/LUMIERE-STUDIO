import { webLightTheme } from "@fluentui/react-components";

export const customLuxuryTheme = {
  ...webLightTheme,
  colorBrandBackground: "#000000",
  colorBrandBackgroundHover: "#1E293B",
  colorBrandBackgroundPressed: "#0F172A",
  colorBrandStroke1: "#94A3B8",
  colorCompoundBrandStroke: "#CBD5E1",
  fontFamilyBase: "'Plus Jakarta Sans', sans-serif",
};

export const studioInfo = {
  name: "Lumière Studio",
  address: "Cll 57 #17C-29, Barrio Villa Carolina",
  city: "Neiva, Huila",
  phoneDisplay: "316 948 2881",
  phoneRaw: "3169482881",
  whatsappUrl: "https://wa.me/573169482881",
  hours: [
    { days: "Lunes a Viernes", time: "9:00 AM – 8:00 PM" },
    { days: "Sábados", time: "9:00 AM – 7:00 PM" },
    { days: "Domingos & Festivos", time: "10:00 AM – 5:00 PM (con cita)" },
  ],
  socials: [
    { name: "Instagram", url: "https://www.instagram.com" },
    { name: "Facebook", url: "https://www.facebook.com" },
  ],
};

export const serviceCategories = [
  { id: "todos", label: "Todos los Servicios" },
  { id: "manicura", label: "Manicura & Gel" },
  { id: "esculpidas", label: "Esculpidas & Nail Art 3D" },
  { id: "pedicura", label: "Pedicura & Jelly Spa" },
  { id: "rituales", label: "Rituales VIP & Cuidado" },
];

export const servicesCatalog = [
  {
    id: "manicura-silver-chrome",
    category: "manicura",
    categoryLabel: "Manicura & Gel",
    badge: "Más Solicitado",
    name: "Manicura Rusa Silver Chrome",
    duration: "75 min",
    price: "$95.000",
    image: "/imagenes/servicio-manicura-cromada.png",
    description:
      "Limpieza profunda de cutícula con puntas de diamante, nivelación en bio-gel hipoalergénico y acabado espejo de plata líquida o Glazed Donut.",
    features: ["Puntas de diamante", "Efecto espejo cromado", "Duración 21+ días"],
  },
  {
    id: "nivelacion-biab-cateye",
    category: "manicura",
    categoryLabel: "Manicura & Gel",
    badge: "Tendencia Viral",
    name: "Builder Gel (BIAB) & Cat Eye Magnético",
    duration: "80 min",
    price: "$110.000",
    image: "/imagenes/servicio-manicura-iridiscente.png",
    description:
      "Refuerzo estructural en uña natural con gel constructor y pigmento magnético aterciopelado (Velvet Cat Eye) en tonos rosa, lila o azul cielo.",
    features: ["Efecto imán 3D", "Fortalece uña natural", "Brillo cristal"],
  },
  {
    id: "aura-nails-babyboomer",
    category: "manicura",
    categoryLabel: "Manicura & Gel",
    badge: "En Moda",
    name: "Aura Nails & Baby Boomer Aéreo",
    duration: "80 min",
    price: "$105.000",
    image: "/imagenes/servicio-manicura-rosa-perlada.png",
    description:
      "Difuminado perfecto con aerógrafo profesional en degradados halo (rosa cuarzo, lila lavanda y azul cielo) sellado con top coat espejo.",
    features: ["Aerografía de precisión", "Degradado suave", "Acabado perlado"],
  },
  {
    id: "soft-gel-press-on",
    category: "esculpidas",
    categoryLabel: "Esculpidas & Nail Art 3D",
    badge: "Extensión Ligera",
    name: "Extensiones Soft Gel Couture",
    duration: "90 min",
    price: "$120.000",
    image: "/imagenes/servicio-manicura-nude-dorada.png",
    description:
      "Sistema de extensión en tips 100% gel orgánico ultraligero, sin olor ni daño a la uña natural, con diseño almendra, coffin o stiletto.",
    features: ["Cero daño ungueal", "Ultraligeras", "Diseño incluido"],
  },
  {
    id: "esculpido-cristal",
    category: "esculpidas",
    categoryLabel: "Esculpidas & Nail Art 3D",
    badge: "Alta Joyería",
    name: "Esculpido Cristal & Joyería Coreana",
    duration: "115 min",
    price: "$145.000",
    image: "/imagenes/servicio-esculpido-cristal.png",
    description:
      "Uñas esculpidas a medida en gel cristal con relieves 3D coreanos, reflejos aurora boreal, charms metálicos e incrustación de cristales.",
    features: ["Relieve 3D coreano", "Cristales auténticos", "Encapsulado aurora"],
  },
  {
    id: "coquette-chrome-art",
    category: "esculpidas",
    categoryLabel: "Esculpidas & Nail Art 3D",
    badge: "Nuevo",
    name: "Nail Art Chrome & Coquette 3D",
    duration: "100 min",
    price: "$130.000",
    image: "/imagenes/servicio-coquette-chrome-art.png",
    description:
      "Diseño artístico con trazos metalizados en plata líquida, micro-perlas, lazos coquette en relieve y destellos holográficos personalizados.",
    features: ["Trazos en cromo", "Micro-perlas & lazos", "Diseño de autor"],
  },
  {
    id: "pedicura-rusa-jelly",
    category: "pedicura",
    categoryLabel: "Pedicura & Jelly Spa",
    badge: "Experiencia Sensorial",
    name: "Pedicura Rusa & Jelly Spa Floral",
    duration: "80 min",
    price: "$98.000",
    image: "/imagenes/servicio-pedicura-rusa-jelly.png",
    description:
      "Baño térmico en gelatina sensorial aromática que hidrata profundamente, limpieza rusa en seco de alta precisión y esmaltado semipermanente.",
    features: ["Textura Jelly térmica", "Limpieza profunda", "Piel de porcelana"],
  },
  {
    id: "pedicura-imperial",
    category: "pedicura",
    categoryLabel: "Pedicura & Jelly Spa",
    badge: "Relax Total",
    name: "Pedicura Imperial & Parafina Tibia",
    duration: "90 min",
    price: "$115.000",
    image: "/imagenes/servicio-pedicura-imperial.png",
    description:
      "Exfoliación con sales minerales, terapia de parafina tibia botánica para máxima suavidad, reflexología podal y acabado espejo plateado.",
    features: ["Parafina botánica", "Masaje reflexológico", "Esmaltado en gel"],
  },
  {
    id: "ritual-aurora-tornasol",
    category: "rituales",
    categoryLabel: "Rituales VIP & Cuidado",
    badge: "Paquete Completo",
    name: "Ritual Spa Aurora Tornasol (Manos & Pies)",
    duration: "120 min",
    price: "$175.000",
    image: "/imagenes/servicio-ritual-aurora-tornasol.png",
    description:
      "Combinación de lujo para manos y pies con exfoliación de cuarzo, mascarilla de colágeno, masaje relajante y esmaltado tornasol o cromado.",
    features: ["Manos y pies VIP", "Mascarilla de colágeno", "Acabado tornasol"],
  },
  {
    id: "retiro-hidratacion-keratina",
    category: "rituales",
    categoryLabel: "Rituales VIP & Cuidado",
    badge: "Salud Ungueal",
    name: "Retiro Seguro & Spa de Queratina",
    duration: "45 min",
    price: "$45.000",
    image: "/imagenes/servicio-retiro-hidratacion-keratina.png",
    description:
      "Retiro profesional de sistemas anteriores sin desgastar tu uña natural, seguido de baño fortalecedor de queratina, calcio y vitamina E.",
    features: ["Sin desgaste", "Baño de queratina", "Hidratación de cutícula"],
  },
];

export const clientReviews = [
  {
    id: 1,
    name: "Valentina Montoya",
    service: "Manicura Rusa Silver Chrome",
    rating: 5,
    date: "Hace 2 días",
    avatarColor: "steel",
    comment:
      "Me encantó el resultado. Mis uñas quedaron elegantes, brillantes y con un acabado cromado espectacular. El trabajo fue muy delicado y el diseño se mantuvo hermoso durante semanas.",
  },
  {
    id: 2,
    name: "Camila Restrepo",
    service: "Esculpido Cristal & Joyería",
    rating: 5,
    date: "Hace 1 semana",
    avatarColor: "teal",
    comment:
      "Elegí Lumière Studio para un día muy especial y superaron mis expectativas. Me encantó la atención, el diseño personalizado y cada detalle de mis uñas. ¡El resultado fue simplemente hermoso!",
  },
  {
    id: 3,
    name: "Isabella Londoño",
    service: "Ritual Spa Aurora Tornasol",
    rating: 5,
    date: "Hace 2 semanas",
    avatarColor: "blue",
    comment:
      "Fue una experiencia maravillosa. El aroma del spa, el cuidado de mis manos y la suavidad de la piel me hicieron sentir renovada. El acabado tornasol es precioso y cambia con cada reflejo de luz.",
  },
];

export const sparkles = Array.from({ length: 22 }, (_, i) => ({
  id: i + 1,
  top: `${(i * 17 + 7) % 95}%`,
  left: `${(i * 23 + 11) % 96}%`,
  size: `${10 + (i % 4) * 6}px`,
  delay: `${(i * 0.6).toFixed(1)}s`,
  duration: `${3.2 + (i % 4) * 1.1}s`,
}));

export const initialSpecialists = [
  {
    id: "valeria",
    nombre: "Valeria",
    cargo: "Master Nail Artist",
    nombreCompleto: "Valeria · Master Nail Artist",
    especialidad: "Chrome & Alta Precisión",
    descripcion:
      "Especialista en manicura rusa con puntas de diamante, nivelación en bio-gel y acabados espejo Silver Chrome de larga duración.",
    fotoUrl: "/imagenes/especialista-valeria.png",
  },
  {
    id: "camila",
    nombre: "Camila",
    cargo: "Especialista BIAB & Gel",
    nombreCompleto: "Camila · Especialista BIAB & Gel",
    especialidad: "Manicura Rusa & Cat Eye",
    descripcion:
      "Experta en fortalecimiento estructural sobre uña natural con Builder Gel (BIAB), efectos magnéticos Velvet Cat Eye y degradados Aura.",
    fotoUrl: "/imagenes/especialista-camila.png",
  },
  {
    id: "sofia",
    nombre: "Sofía",
    cargo: "Esculpido & 3D Art",
    nombreCompleto: "Sofía · Esculpido & 3D Art",
    especialidad: "Joyería Coreana & Soft Gel",
    descripcion:
      "Artista de uñas esculpidas en gel cristal, extensiones ultraligeras Soft Gel Couture, relieves 3D coreanos y encapsulados aurora.",
    fotoUrl: "/imagenes/especialista-sofia.png",
  },
  {
    id: "laura",
    nombre: "Laura",
    cargo: "Spa & Pedicura Imperial",
    nombreCompleto: "Laura · Spa & Pedicura Imperial",
    especialidad: "Jelly Spa & Parafina",
    descripcion:
      "Terapeuta especializada en rituales sensoriales de bienestar, pedicura rusa en seco, baños térmicos de Jelly Spa y parafina botánica.",
    fotoUrl: "/imagenes/especialista-laura.png",
  },
];

export const aboutStudioInfo = {
  mision:
    "En Lumière Studio nuestro propósito es elevar el arte de la manicura y el cuidado de las manos y los pies a un ritual de bienestar, elegancia y precisión. Nos comprometemos a utilizar insumos hipoalergénicos de alta gama, protocolos rigurosos de bioseguridad y una atención cálida y personalizada que resalte el estilo único y la confianza de cada clienta.",
  vision:
    "Consolidarnos como el santuario referente de alta manicura, arte ungueal 3D y spa sensorial en la región, distinguiéndonos por la innovación continua en técnicas internacionales, la excelencia artística de nuestro equipo de especialistas y una experiencia de lujo inolvidable en cada visita.",
  valores: [
    "Bioseguridad y salud ungueal en cada procedimiento",
    "Vanguardia en técnicas internacionales y pigmentos espejo",
    "Atención personalizada y puntualidad bajo cita",
  ],
};
