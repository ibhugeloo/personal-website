import type { Metadata } from "next"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
    title: "Systm.re",
    description: "Systm.re — activité freelance en développement web et infrastructure à La Réunion.",
}

const catalog = [
    {
        emoji: "🔌",
        category: "Alimentation & Charge",
        items: [
            "Chargeurs GaN multi-ports (65W, 100W, 200W)",
            "Câbles USB-C / Thunderbolt certifiés",
            "Stations de charge de bureau et bureau nomade",
            "Power banks haute capacité",
        ],
    },
    {
        emoji: "💾",
        category: "Stockage",
        items: [
            "SSD portables USB-C (jusqu'à 2 To)",
            "Disques durs externes",
            "Clés USB haute vitesse (USB 3.2 Gen2)",
        ],
    },
    {
        emoji: "🖥️",
        category: "Connectivité & Bureau",
        items: [
            "Docks USB-C / Thunderbolt (multi-écrans, LAN, USB)",
            "Adaptateurs HDMI, DisplayPort, VGA",
            "Switches KVM et hubs USB",
            "Câbles réseau Cat6 / Cat7",
        ],
    },
    {
        emoji: "📱",
        category: "Accessoires Mobiles",
        items: [
            "Supports téléphone et tablette (bureau, voiture, vélo)",
            "Chargeurs sans fil Qi2",
            "Étuis de protection premium",
        ],
    },
]

export default function BusinessPage() {
    return (
        <div className="space-y-5 max-w-3xl text-base leading-relaxed text-foreground">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-xl font-semibold tracking-tight">Systm.re</h1>
                <p className="text-muted-foreground">
                    Revente de matériel informatique et d'accessoires tech à La Réunion —
                    des produits fiables, sélectionnés pour les professionnels et les particuliers exigeants
                </p>
            </div>

            <Separator />

            {/* Catalog */}
            <div className="space-y-3">
                <h2 className="text-base font-semibold">Catalogue</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {catalog.map((cat) => (
                        <div key={cat.category} className="p-4 rounded-xl border space-y-2 hover:shadow-sm transition-shadow">
                            <div className="flex items-center gap-2">
                                <span className="text-xl">{cat.emoji}</span>
                                <p className="font-semibold">{cat.category}</p>
                            </div>
                            <ul className="space-y-1">
                                {cat.items.map((item) => (
                                    <li key={item} className="flex items-start gap-2 text-muted-foreground">
                                        <span className="mt-2 h-1 w-1 rounded-full bg-muted-foreground/50 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            <Separator />

            {/* CTA */}
            <div className="p-5 rounded-xl border bg-muted/30 space-y-2">
                <p className="font-semibold">Commander ou demander un devis</p>
                <p className="text-muted-foreground">
                    Contactez-moi directement pour une commande, un devis entreprise ou pour
                    vérifier la disponibilité d'un produit spécifique
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
