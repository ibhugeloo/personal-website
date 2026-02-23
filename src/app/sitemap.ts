import type { MetadataRoute } from "next"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ibhugeloo.com"

const PAGES = [
    { path: "/",          priority: 1.0 },
    { path: "/notes",     priority: 0.8 },
    { path: "/projects",  priority: 0.8 },
    { path: "/services",  priority: 0.8 },
    { path: "/investing", priority: 0.7 },
    { path: "/business",  priority: 0.7 },
    { path: "/goal",      priority: 0.7 },
    { path: "/trail",     priority: 0.6 },
    { path: "/homelab",   priority: 0.6 },
]

export default function sitemap(): MetadataRoute.Sitemap {
    return PAGES.map(({ path, priority }) => ({
        url: `${BASE_URL}${path}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority,
    }))
}
