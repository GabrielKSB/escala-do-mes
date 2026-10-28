import type { MetadataRoute } from "next";
import { SETORES } from "@/lib/setores";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE.url}/`, changeFrequency: "monthly", priority: 1 },
    ...SETORES.map((s) => ({
      url: `${SITE.url}/escala-5x2/${s.slug}/`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
