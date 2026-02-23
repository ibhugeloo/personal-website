export const NAV_ITEMS = [
    { name: "Home",      href: "/" },
    { name: "Notes",     href: "/notes" },
    { name: "Projets",   href: "/projects" },
    { name: "Investing", href: "/investing" },
    { name: "Services",  href: "/services" },
    { name: "Systm.re",  href: "/business" },
    { name: "Goal.re",   href: "/goal" },
    { name: "Trail",     href: "/trail" },
    { name: "Homelab",   href: "/homelab" },
]

export type NavItem = typeof NAV_ITEMS[number]
