"use client"

import { useState, useEffect, useMemo } from "react"
import { Plus, Pencil, Trash2, X } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/components/toast"

// ─── Types ──────────────────────────────────────────────────────────────────

type GearCategory = "Chaussures" | "Vêtements" | "Accessoires" | "Électronique" | "Hydratation" | "Autre"
type GearStatus = "Actif" | "Backup" | "À remplacer"

type GearItem = {
    id: string
    name: string
    brand: string
    category: GearCategory
    status: GearStatus
    notes: string
}

// ─── Constants ───────────────────────────────────────────────────────────────

const GEAR_CATEGORIES: GearCategory[] = ["Chaussures", "Vêtements", "Accessoires", "Électronique", "Hydratation", "Autre"]

const STATUS_COLORS: Record<GearStatus, string> = {
    Actif:         "text-green-600 bg-green-500/10 border-green-500/20",
    Backup:        "text-blue-600 bg-blue-500/10 border-blue-500/20",
    "À remplacer": "text-red-500 bg-red-500/10 border-red-500/20",
}

const CATEGORY_EMOJIS: Record<GearCategory, string> = {
    Chaussures:   "👟",
    Vêtements:    "👕",
    Accessoires:  "🕶️",
    Électronique: "⌚",
    Hydratation:  "🧴",
    Autre:        "📦",
}

const EMPTY_FORM: Omit<GearItem, "id"> = {
    name: "",
    brand: "",
    category: "Autre",
    status: "Actif",
    notes: "",
}

// ─── Gear Inventory (CRUD) ───────────────────────────────────────────────────

function GearInventory() {
    const { user } = useAuth()
    const { toast } = useToast()
    const supabase = useMemo(() => createClient(), [])

    const [items, setItems] = useState<GearItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [fetchError, setFetchError] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [form, setForm] = useState<Omit<GearItem, "id">>(EMPTY_FORM)
    const [formError, setFormError] = useState<string | null>(null)
    const [filter, setFilter] = useState<GearCategory | "Tous">("Tous")

    useEffect(() => {
        let isMounted = true
        supabase
            .from("trail_gear")
            .select("*")
            .order("created_at", { ascending: false })
            .then(({ data, error }) => {
                if (!isMounted) return
                if (error) setFetchError("Impossible de charger l'inventaire.")
                else setItems((data ?? []) as GearItem[])
                setIsLoading(false)
            })
        return () => { isMounted = false }
    }, [supabase])

    function openAdd() {
        setEditingId(null)
        setForm(EMPTY_FORM)
        setFormError(null)
        setShowModal(true)
    }

    function openEdit(item: GearItem) {
        if (!user) return
        setEditingId(item.id)
        setForm({ name: item.name, brand: item.brand, category: item.category, status: item.status, notes: item.notes })
        setFormError(null)
        setShowModal(true)
    }

    async function handleDelete(id: string) {
        if (!window.confirm("Supprimer cet équipement ?")) return
        const { error } = await supabase.from("trail_gear").delete().eq("id", id)
        if (error) { toast("Erreur lors de la suppression.", "error"); return }
        setItems((prev) => prev.filter((i) => i.id !== id))
        toast("Équipement supprimé", "success")
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!form.name.trim()) return
        setIsSaving(true)
        setFormError(null)

        if (editingId) {
            const { data, error } = await supabase
                .from("trail_gear").update(form).eq("id", editingId).select().single()
            if (error) setFormError("Erreur lors de la modification.")
            else { setItems((prev) => prev.map((i) => i.id === editingId ? data as GearItem : i)); setShowModal(false); toast("Équipement modifié", "success") }
        } else {
            const { data, error } = await supabase
                .from("trail_gear").insert(form).select().single()
            if (error) setFormError("Erreur lors de l'ajout.")
            else { setItems((prev) => [data as GearItem, ...prev]); setShowModal(false); toast("Équipement ajouté", "success") }
        }
        setIsSaving(false)
    }

    const filtered = filter === "Tous" ? items : items.filter((i) => i.category === filter)

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex flex-wrap gap-2">
                    {(["Tous", ...GEAR_CATEGORIES] as const).map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat as GearCategory | "Tous")}
                            className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                                filter === cat
                                    ? "bg-foreground text-background border-foreground"
                                    : "border-border text-muted-foreground hover:border-foreground/50"
                            }`}
                        >
                            {cat !== "Tous" && (
                                <span aria-hidden="true">{CATEGORY_EMOJIS[cat as GearCategory]} </span>
                            )}
                            {cat}
                        </button>
                    ))}
                </div>
                {user && (
                    <Button onClick={openAdd} size="sm" className="gap-2 shrink-0">
                        <Plus className="h-4 w-4" />
                        Ajouter
                    </Button>
                )}
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg border">
                            <div className="h-8 w-8 rounded bg-muted animate-pulse shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-28 rounded bg-muted animate-pulse" />
                                <div className="h-3 w-16 rounded bg-muted animate-pulse" />
                                <div className="h-5 w-14 rounded-full bg-muted animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : fetchError ? (
                <p className="text-center py-10 text-destructive text-sm">{fetchError}</p>
            ) : filtered.length === 0 ? (
                <p className="text-center py-10 text-muted-foreground text-sm">Aucun équipement{filter !== "Tous" ? ` dans la catégorie « ${filter} »` : ""}</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filtered.map((item) => (
                        <div key={item.id} className="group flex items-start gap-3 p-3 rounded-lg border bg-card hover:shadow-sm transition-shadow">
                            <span className="text-2xl shrink-0 mt-0.5" aria-hidden="true">{CATEGORY_EMOJIS[item.category]}</span>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <p className="font-medium text-sm leading-tight">{item.name}</p>
                                        <p className="text-xs text-muted-foreground">{item.brand}</p>
                                    </div>
                                    {user && (
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openEdit(item)} aria-label="Modifier">
                                                <Pencil className="h-3 w-3" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive" onClick={() => handleDelete(item.id)} aria-label="Supprimer">
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_COLORS[item.status]}`}>
                                        {item.status}
                                    </span>
                                    {item.notes && (
                                        <span className="text-xs text-muted-foreground truncate">{item.notes}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && user && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="trail-modal-title"
                    aria-describedby="trail-modal-desc"
                    onClick={() => setShowModal(false)}
                >
                    <div className="bg-background border rounded-xl shadow-xl w-full max-w-md p-6 space-y-5" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between">
                            <h2 id="trail-modal-title" className="font-semibold text-lg">
                                {editingId ? "Modifier" : "Ajouter un équipement"}
                            </h2>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowModal(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <p id="trail-modal-desc" className="sr-only">
                            {editingId ? "Formulaire de modification d'un équipement existant" : "Formulaire d'ajout d'un nouvel équipement trail"}
                        </p>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-xs text-muted-foreground">Nom *</label>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        placeholder="ex: Cascadia 16"
                                        required
                                        maxLength={100}
                                        className="w-full border rounded-lg px-3 py-1.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-muted-foreground">Marque</label>
                                    <input
                                        type="text"
                                        value={form.brand}
                                        onChange={(e) => setForm({ ...form, brand: e.target.value })}
                                        placeholder="ex: Brooks"
                                        maxLength={100}
                                        className="w-full border rounded-lg px-3 py-1.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-xs text-muted-foreground">Catégorie</label>
                                    <select
                                        value={form.category}
                                        onChange={(e) => setForm({ ...form, category: e.target.value as GearCategory })}
                                        className="w-full border rounded-lg px-3 py-1.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                                    >
                                        {GEAR_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-muted-foreground">Statut</label>
                                    <select
                                        value={form.status}
                                        onChange={(e) => setForm({ ...form, status: e.target.value as GearStatus })}
                                        className="w-full border rounded-lg px-3 py-1.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                                    >
                                        <option value="Actif">Actif</option>
                                        <option value="Backup">Backup</option>
                                        <option value="À remplacer">À remplacer</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-muted-foreground">Notes</label>
                                <input
                                    type="text"
                                    value={form.notes}
                                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                    placeholder="Terrain d'utilisation, remarques..."
                                    maxLength={200}
                                    className="w-full border rounded-lg px-3 py-1.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>
                            {formError && <p className="text-xs text-destructive">{formError}</p>}
                            <div className="flex gap-2 pt-2">
                                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Annuler</Button>
                                <Button type="submit" className="flex-1" disabled={isSaving}>
                                    {isSaving ? "Enregistrement…" : editingId ? "Enregistrer" : "Ajouter"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function TrailPage() {
    return (
        <div className="space-y-5 max-w-5xl text-base leading-relaxed text-foreground">
            <div className="space-y-2 max-w-2xl">
                <h1 className="text-xl font-semibold tracking-tight">Trail & Outdoor</h1>
                <p className="text-muted-foreground">
                    Je vis entre la Réunion et l'Asie. Je garde un lien constant avec le terrain :
                    trail, badminton, exploration
                </p>
            </div>

            <Separator />

            <div className="space-y-4">
                <h2 className="text-base font-semibold tracking-tight">Guide</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <h3 className="font-semibold">Méthodologie</h3>
                        <div className="space-y-3">
                            <p className="text-muted-foreground">
                                La discipline est la clé. Mon approche combine renforcement, volume et récupération
                            </p>
                            <ul className="space-y-1">
                                <li><span aria-hidden="true">🏃</span> Renfo & Dénivelé</li>
                                <li><span aria-hidden="true">⛰️</span> Fractionné en montée</li>
                                <li><span aria-hidden="true">🥗</span> Manger propre</li>
                                <li><span aria-hidden="true">🛌</span> Jour OFF respecté</li>
                            </ul>
                            <div className="p-4 bg-muted/50 rounded-lg border italic text-muted-foreground text-sm">
                                &quot;Eat the frogs, être reconnaissant, accepter l&apos;évolution dans la douleur&quot;
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-semibold">Nutrition & Hydratation</h3>
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <p className="font-medium"><span aria-hidden="true">🧪</span> Potion Magique</p>
                                <p className="text-muted-foreground">Eau + Sel + Sucre + Citron</p>
                            </div>
                            <div className="space-y-1">
                                <p className="font-medium"><span aria-hidden="true">🥣</span> Potion Panoramix</p>
                                <p className="text-muted-foreground">
                                    2 Bananes + 100g Flocon d&apos;avoine + 2 C. Beurre de cacahuète + 1 C. Miel
                                </p>
                            </div>
                            <div className="p-3 border rounded-lg space-y-2">
                                <p className="font-medium text-orange-500 text-sm"><span aria-hidden="true">⚠️</span> Règles quotidiennes</p>
                                <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                                    <li>3 repas + 2 collations</li>
                                    <li>2 L d'eau minimum</li>
                                    <li>8h de sommeil</li>
                                    <li>15 min d'étirements</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Separator />

            <div className="space-y-4">
                <div>
                    <h2 className="text-base font-semibold tracking-tight">Inventaire</h2>
                    <p className="text-muted-foreground text-sm mt-0.5">Gestion de mon équipement trail</p>
                </div>
                <GearInventory />
            </div>
        </div>
    )
}
