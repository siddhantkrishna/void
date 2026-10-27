import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/login"],
    },
    sitemap: "https://blogs.siddhantkrishna.com/sitemap.xml",
    host: "https://blogs.siddhantkrishna.com",
  };
}
