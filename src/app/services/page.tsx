import type { Metadata } from "next"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
    title: "Services",
    description: "Développement d'applications web de A à Z et installation NAS Ugreen pour la souveraineté de vos données.",
}

const skills = [
    "Next.js / React",
    "Supabase / PostgreSQL",
    "Node.js / TypeScript",
    "Docker / CI-CD",
    "Linux / Réseaux",
    "Proxmox / Virtualisation",
    "NAS Ugreen",
    "Sécurité & VPN",
]

export default function ServicesPage() {
    return (
        <div className="space-y-8 max-w-2xl text-base leading-relaxed text-foreground">
            <div className="space-y-2">
                <h1 className="text-xl font-semibold tracking-tight">Services</h1>
                <p className="text-muted-foreground">
                    Deux axes principaux : construire des produits web solides de bout en bout,
                    et aider à reprendre le contrôle de ses données
                </p>
            </div>

            <Separator />

            {/* Service 1 */}
            <div className="space-y-4">
                <div className="flex items-start gap-4">
                    <span className="text-3xl mt-0.5" aria-hidden="true">🛠️</span>
                    <div className="space-y-2">
                        <h2 className="font-semibold text-lg leading-tight">Application de A à Z</h2>
                        <p className="text-muted-foreground">
                            Tu as une idée, un problème à résoudre ou un outil métier à construire.
                            Je prends en charge l'ensemble du cycle : conception, développement,
                            base de données, authentification, déploiement et mise en production.
                        </p>
                        <ul className="space-y-1.5 pt-1">
                            {[
                                "Cadrage du besoin et architecture technique",
                                "Développement frontend + backend + API",
                                "Base de données, auth et gestion des rôles",
                                "Déploiement, nom de domaine, HTTPS",
                                "Livraison propre avec documentation",
                            ].map((item) => (
                                <li key={item} className="flex items-start gap-2 text-muted-foreground">
                                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-foreground/40 shrink-0" aria-hidden="true" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <Separator />

            {/* Service 2 */}
            <div className="space-y-4">
                <div className="flex items-start gap-4">
                    <span className="text-3xl mt-0.5" aria-hidden="true">🗄️</span>
                    <div className="space-y-2">
                        <h2 className="font-semibold text-lg leading-tight">Installation NAS — Souveraineté des données</h2>
                        <p className="text-muted-foreground">
                            Tes fichiers, photos et données sensibles n'ont pas à vivre sur des serveurs
                            que tu ne contrôles pas. J'installe et configure un NAS chez toi ou en entreprise
                            pour que tu sois enfin propriétaire de tes données.
                        </p>
                        <ul className="space-y-1.5 pt-1">
                            {[
                                "Choix du matériel adapté à ton usage et ton budget",
                                "Installation et configuration Ugreen NAS",
                                "Accès à distance sécurisé (VPN, domaine custom)",
                                "Sauvegardes automatiques et plan de reprise",
                                "Formation pour une utilisation autonome",
                            ].map((item) => (
                                <li key={item} className="flex items-start gap-2 text-muted-foreground">
                                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-foreground/40 shrink-0" aria-hidden="true" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <Separator />

            {/* Skills */}
            <div className="space-y-3">
                <h2 className="font-semibold">Compétences techniques</h2>
                <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                        <span
                            key={skill}
                            className="text-sm px-3 py-1 rounded-full border bg-muted/40 text-muted-foreground font-mono"
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            </div>

            <Separator />

            {/* CTA */}
            <div className="p-5 rounded-xl border bg-muted/30 space-y-2">
                <p className="font-semibold">Un projet en tête ?</p>
                <p className="text-muted-foreground">
                    Disponible pour des missions à La Réunion ou à distance.
                    Dis-moi ce que tu construis.
                </p>
                <a
                    href="mailto:bhugeloo.idriss@gmail.com"
                    className="inline-block mt-1 font-medium text-blue-500 hover:text-blue-600 transition-colors"
                >
                    bhugeloo.idriss@gmail.com →
                </a>
            </div>
        </div>
    )
}
