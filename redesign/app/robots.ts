import type { MetadataRoute } from "next";
import { COMPANY } from "@/lib/content";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${COMPANY.websiteHref}/sitemap.xml`,
  };
}
