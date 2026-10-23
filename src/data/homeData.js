import { webLightTheme } from "@fluentui/react-components";

export const customLuxuryTheme = {
  ...webLightTheme,
  colorBrandBackground: "#475569",
  colorBrandBackgroundHover: "#334155",
  colorBrandBackgroundPressed: "#1E293B",
  colorBrandStroke1: "#94A3B8",
  colorCompoundBrandStroke: "#64748B",
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
  // Agrega aquí la URL real de cada red social para que aparezca en el pie de página.
  socials: [
    { name: "Instagram", url: "" },
    { name: "TikTok", url: "" },
    { name: "Facebook", url: "" },
  ],
};

export const servicesCatalog = [
  {
    id: "manicura-silver-chrome",
    name: "Manicura Rusa Silver Chrome",
    duration: "75 min",
    price: "$145.000",
    description:
      "Limpieza profunda de cutícula con puntas de diamante, nivelación en bio-gel hipoalergénico y acabado espejo de plata líquida con destellos tornasol.",
  },
  {
    id: "ritual-aurora-tornasol",
    name: "Ritual Spa Aurora Tornasol",
    duration: "90 min",
    price: "$180.000",
    description:
      "Exfoliación mineral, mascarilla térmica de seda botánica, masaje relajante de manos y esmaltado gel tornasol de larga duración.",
  },
  {
    id: "esculpido-cristal",
    name: "Esculpido Cristal & Joyería",
    duration: "120 min",
    price: "$220.000",
    description:
      "Uñas esculpidas a medida en gel cristal con diseño plateado, reflejos aurora boreal e incrustación de cristales.",
  },
  {
    id: "pedicura-imperial",
    name: "Pedicura Imperial & Parafina",
    duration: "85 min",
    price: "$165.000",
    description:
      "Baño sensorial con sales, terapia de parafina tibia botánica, reflexología podal y esmaltado espejo plateado.",
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

