export const SITE = {
  nome: "Escala 5x2",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  adsenseCliente: process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "",
};
