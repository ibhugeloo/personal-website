import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Notes",
    description: "Réflexions courtes sur la tech, le business, la lecture et le trail.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
