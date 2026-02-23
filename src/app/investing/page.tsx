import type { Metadata } from "next"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
    title: "Portefeuille",
    description: "Répartition de mon portefeuille d'investissement long terme : ETF S&P500 (PEA), actions individuelles (CTO) et Bitcoin (Revolut).",
}

// ─── Data ────────────────────────────────────────────────────────────────────

type Position = { label: string; percentage: number }

type Envelope = {
    name: string
    description: string
    total: number
    barColor: string
    badgeClass: string
    positions: Position[]
}

const ENVELOPES: Envelope[] = [
    {
        name: "PEA",
        description: "Plan d'Épargne en Actions — fiscalité avantageuse après 5 ans",
        total: 30,
        barColor: "bg-blue-500",
        badgeClass: "text-blue-600 bg-blue-500/10 border-blue-500/25",
        positions: [
            { label: "ETF S&P500", percentage: 30 },
        ],
    },
    {
        name: "CTO",
        description: "Compte-Titres Ordinaire — actions individuelles, accès mondial",
        total: 60,
        barColor: "bg-violet-500",
        badgeClass: "text-violet-600 bg-violet-500/10 border-violet-500/25",
        positions: [
            { label: "NVDA", percentage: 10 },
            { label: "AMZN", percentage: 8 },
            { label: "GOOGL", percentage: 8 },
            { label: "META", percentage: 8 },
            { label: "MA",   percentage: 8 },
            { label: "ASML", percentage: 8 },
            { label: "RMS",  percentage: 5 },
            { label: "SPGI", percentage: 5 },
        ],
    },
    {
        name: "Revolut",
        description: "Crypto via Round-Up — exposition Bitcoin sans friction",
        total: 10,
        barColor: "bg-orange-400",
        badgeClass: "text-orange-600 bg-orange-400/10 border-orange-400/25",
        positions: [
            { label: "Bitcoin", percentage: 10 },
        ],
    },
]

// ─── Components ───────────────────────────────────────────────────────────────

function StackedBar() {
    return (
        <div className="space-y-2">
            <div className="flex h-2.5 rounded-full overflow-hidden gap-px">
                {ENVELOPES.map((env) => (
                    <div
                        key={env.name}
                        className={env.barColor}
                        style={{ width: `${env.total}%` }}
                    />
                ))}
            </div>
            <div className="flex gap-4 flex-wrap">
                {ENVELOPES.map((env) => (
                    <div key={env.name} className="flex items-center gap-1.5">
                        <span className={`inline-block h-2 w-2 rounded-full ${env.barColor}`} />
                        <span className="text-xs text-muted-foreground">
                            {env.name} <span className="font-medium text-foreground">{env.total}%</span>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

function EnvelopeSection({ env }: { env: Envelope }) {
    return (
        <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${env.badgeClass}`}>
                        {env.name}
                    </span>
                    <span className="text-xs text-muted-foreground">{env.description}</span>
                </div>
                <span className="text-sm font-semibold tabular-nums">{env.total}%</span>
            </div>

            {/* Positions */}
            <div className="space-y-2 pl-1">
                {env.positions.map((pos) => (
                    <div key={pos.label} className="flex items-center gap-3">
                        <div className="w-16 text-sm font-medium shrink-0">{pos.label}</div>
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                                className={`h-full ${env.barColor} opacity-80`}
                                style={{ width: `${pos.percentage}%` }}
                            />
                        </div>
                        <div className="w-8 text-right text-xs text-muted-foreground tabular-nums">
                            {pos.percentage}%
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InvestingPage() {
    return (
        <div className="space-y-5 max-w-2xl text-base leading-relaxed text-foreground">
            <section className="space-y-2">
                <h1 className="text-xl font-semibold tracking-tight">Investing</h1>
                <p className="text-muted-foreground">
                    Côté investissement, je fonctionne avec une grille claire : entreprises solides,
                    moat lisible, discipline financière, croissance organique. Portefeuille long terme
                    centré tech, pensé comme un système à optimiser plutôt qu'un jeu
                </p>
            </section>

            <Separator />

            <section className="space-y-4">
                <h2 className="text-base font-semibold tracking-tight">Outils & Services</h2>
                <div className="grid gap-4">
                    <div className="space-y-1">
                        <h3 className="font-medium">IBKR (Interactive Brokers)</h3>
                        <p className="text-muted-foreground">
                            Frais ultra-compétitifs, accès mondial, idéal pour PEA & CTO (Actions US/ETF)
                        </p>
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-medium">Deblock</h3>
                        <p className="text-muted-foreground">
                            Compte courant crypto-friendly, parfait pour faire le pont entre FIAT et Crypto
                        </p>
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-medium">Revolut (Metal)</h3>
                        <p className="text-muted-foreground">
                            Change de devises sans frais, cashback, et achat facile de Bitcoin (Round-Up)
                        </p>
                    </div>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg border">
                    <p className="font-medium">
                        <span className="text-orange-500 mr-2">⚡</span>
                        Conseil Flash : Achetez Bitcoin via le Round-Up de Revolut !
                    </p>
                </div>
            </section>

            <Separator />

            <section className="space-y-5">
                <h2 className="text-base font-semibold tracking-tight">Répartition du Portefeuille</h2>

                {/* Macro view */}
                <StackedBar />

                <Separator />

                {/* Per-envelope breakdown */}
                <div className="space-y-6">
                    {ENVELOPES.map((env) => (
                        <EnvelopeSection key={env.name} env={env} />
                    ))}
                </div>
            </section>
        </div>
    )
}
