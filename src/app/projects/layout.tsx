import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Projets",
    description: "Side projects, expérimentations et outils que je construis — en cours, terminés ou en pause.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
