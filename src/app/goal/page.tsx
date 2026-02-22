import { Separator } from "@/components/ui/separator"

export default function GoalPage() {
    return (
        <div className="space-y-5 max-w-2xl text-base leading-relaxed text-foreground">
            <h1 className="text-xl font-semibold tracking-tight">Goal.re</h1>

            {/* Work in Progress Banner */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10">
                <span className="text-xl">🚧</span>
                <div>
                    <p className="font-semibold text-yellow-600 dark:text-yellow-400 text-sm">Work in Progress</p>
                    <p className="text-sm text-muted-foreground">La marque est en cours de développement — restez connectés</p>
                </div>
            </div>

            <Separator />

            <section className="space-y-4">
                <p className="text-muted-foreground">
                    Projet textile que je façonne comme mes infrastructures : pièce par pièce, sans surpromesse
                </p>

                <div className="space-y-4">
                    <div className="space-y-1">
                        <h2 className="text-base font-semibold">L'idée</h2>
                        <p>
                            Goal.re est une marque de vêtements ancrée à La Réunion. Des pièces pensées pour durer,
                            conçues avec intention — pour ceux qui avancent avec leurs convictions
                        </p>
                    </div>

                    <div className="space-y-1">
                        <h2 className="text-base font-semibold">Statut actuel</h2>
                        <ul className="space-y-1 list-disc list-inside">
                            <li>Identité visuelle en cours de définition</li>
                            <li>Recherche fournisseurs et matières</li>
                            <li>Première collection en phase de conception</li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    )
}
