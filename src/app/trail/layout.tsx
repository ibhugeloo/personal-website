import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Trail",
    description: "Mon équipement trail et mes sorties en montagne — matériel testé sur le terrain à La Réunion.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
