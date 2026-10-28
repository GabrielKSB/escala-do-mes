import type { MetadataRoute } from "next";
import { SETORES } from "@/lib/setores";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE.url}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE.url}/gerador/`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE.url}/como-funciona/`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE.url}/privacidade/`, changeFrequency: "yearly", priority: 0.2 },
    ...SETORES.map((s) => ({
      url: `${SITE.url}/escala-5x2/${s.slug}/`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
