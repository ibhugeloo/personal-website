import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Homelab",
    description: "Mon homelab sous Proxmox : services auto-hébergés, virtualisation et expérimentations réseau.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
