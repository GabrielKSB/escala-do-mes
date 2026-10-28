export const SITE = {
  nome: "Escala do Mês",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  adsenseCliente: process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "",
  emailContato: process.env.NEXT_PUBLIC_EMAIL_CONTATO ?? "",
};
