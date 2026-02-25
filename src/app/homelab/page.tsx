"use client"

import { useState, useEffect, useMemo } from "react"
import { Plus, ExternalLink, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/components/toast"

type ServiceCategory = "Virtualisation" | "Containers" | "Réseau" | "Sécurité" | "Productivité" | "Monitoring" | "Autre"

type Service = {
    id: string
    name: string
    url: string
    description: string
    category: ServiceCategory
    emoji: string
}

const CATEGORIES: ServiceCategory[] = ["Virtualisation", "Containers", "Réseau", "Sécurité", "Productivité", "Monitoring", "Autre"]

const CATEGORY_COLORS: Record<ServiceCategory, string> = {
    Virtualisation: "text-blue-600 bg-blue-500/10 border-blue-500/20",
    Containers:     "text-cyan-500 bg-cyan-500/10 border-cyan-500/20",
    Réseau:         "text-green-500 bg-green-500/10 border-green-500/20",
    Sécurité:       "text-red-500 bg-red-500/10 border-red-500/20",
    Productivité:   "text-purple-500 bg-purple-500/10 border-purple-500/20",
    Monitoring:     "text-orange-500 bg-orange-500/10 border-orange-500/20",
    Autre:          "text-muted-foreground bg-muted/50 border-border",
}

const EMPTY_FORM: Omit<Service, "id"> = {
    name: "",
    url: "",
    description: "",
    category: "Autre",
    emoji: "⚙️",
}

export default function HomelabPage() {
    const { user } = useAuth()
    const { toast } = useToast()
    const supabase = useMemo(() => createClient(), [])

    const [services, setServices] = useState<Service[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [fetchError, setFetchError] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [form, setForm] = useState<Omit<Service, "id">>(EMPTY_FORM)
    const [formError, setFormError] = useState<string | null>(null)
    const [filter, setFilter] = useState<ServiceCategory | "Tous">("Tous")
    const [search, setSearch] = useState("")

    useEffect(() => {
        let isMounted = true
        supabase
            .from("homelab_services")
            .select("*")
            .order("created_at", { ascending: false })
            .then(({ data, error }) => {
                if (!isMounted) return
                if (error) setFetchError("Impossible de charger les services.")
                else setServices((data ?? []) as Service[])
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

    function openEdit(service: Service) {
        if (!user) return
        setEditingId(service.id)
        setForm({ name: service.name, url: service.url, description: service.description, category: service.category, emoji: service.emoji })
        setFormError(null)
        setShowModal(true)
    }

    async function handleDelete(id: string) {
        if (!window.confirm("Supprimer ce service ?")) return
        const { error } = await supabase.from("homelab_services").delete().eq("id", id)
        if (error) { toast("Erreur lors de la suppression.", "error"); return }
        setServices((prev) => prev.filter((s) => s.id !== id))
        toast("Service supprimé", "success")
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!form.name.trim()) return
        setIsSaving(true)
        setFormError(null)

        if (editingId) {
            const { data, error } = await supabase
                .from("homelab_services").update(form).eq("id", editingId).select().single()
            if (error) setFormError("Erreur lors de la modification.")
            else { setServices((prev) => prev.map((s) => s.id === editingId ? data as Service : s)); setShowModal(false); toast("Service modifié", "success") }
        } else {
            const { data, error } = await supabase
                .from("homelab_services").insert(form).select().single()
            if (error) setFormError("Erreur lors de l'ajout.")
            else { setServices((prev) => [data as Service, ...prev]); setShowModal(false); toast("Service ajouté", "success") }
        }
        setIsSaving(false)
    }

    const filtered = services.filter((s) => {
        if (filter !== "Tous" && s.category !== filter) return false
        if (search) {
            const q = search.toLowerCase()
            return s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
        }
        return true
    })

    return (
        <div className="space-y-5 max-w-4xl text-base leading-relaxed text-foreground">
            <div className="space-y-2">
                <h1 className="text-xl font-semibold tracking-tight">Homelab</h1>
                <p className="text-muted-foreground">
                    Toujours un homelab actif sous Proxmox – j'expérimente, je casse et je reconstruis
                </p>
            </div>

            <Separator />

            <div className="space-y-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Rechercher un service…"
                        className="w-full border rounded-lg pl-9 pr-3 py-1.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>
                <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex flex-wrap gap-2">
                        {(["Tous", ...CATEGORIES] as const).map((c) => (
                            <button
                                key={c}
                                onClick={() => setFilter(c as ServiceCategory | "Tous")}
                                className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                                    filter === c
                                        ? "bg-foreground text-background border-foreground"
                                        : "border-border text-muted-foreground hover:border-foreground/50"
                                }`}
                            >
                                {c}
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
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="rounded-xl border p-5 space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded bg-muted animate-pulse" />
                                <div className="h-4 w-24 rounded bg-muted animate-pulse" />
                            </div>
                            <div className="h-3 w-full rounded bg-muted animate-pulse" />
                            <div className="h-3 w-2/3 rounded bg-muted animate-pulse" />
                            <div className="h-5 w-20 rounded-full bg-muted animate-pulse" />
                        </div>
                    ))}
                </div>
            ) : fetchError ? (
                <div className="text-center py-16 text-destructive text-sm">{fetchError}</div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                    <p className="text-4xl mb-3" aria-hidden="true">🔧</p>
                    <p>Aucun service{filter !== "Tous" ? ` dans la catégorie « ${filter} »` : ""}{search ? ` pour « ${search} »` : ""}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((service) => (
                        <Card
                            key={service.id}
                            className={`group relative hover:shadow-md transition-shadow overflow-hidden ${user ? "cursor-pointer" : ""}`}
                            onClick={() => user && openEdit(service)}
                        >
                            {user && (
                                <button
                                    className="absolute top-2 right-2 h-6 w-6 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                    onClick={(e) => { e.stopPropagation(); handleDelete(service.id) }}
                                    aria-label="Supprimer"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                            <CardHeader className="pb-2">
                                <div className="flex items-center gap-2 pr-8">
                                    <span className="text-2xl" aria-hidden="true">{service.emoji}</span>
                                    <CardTitle className="text-base leading-tight">{service.name}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <p className="text-xs text-muted-foreground leading-relaxed">{service.description}</p>
                                <div className="flex items-center justify-between">
                                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${CATEGORY_COLORS[service.category]}`}>
                                        {service.category}
                                    </span>
                                    {service.url && service.url !== "#" && (
                                        <a href={service.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} aria-label={`Ouvrir ${service.name}`}>
                                            <Button variant="ghost" size="icon" className="h-7 w-7">
                                                <ExternalLink className="h-3.5 w-3.5" />
                                            </Button>
                                        </a>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {showModal && user && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="homelab-modal-title"
                    aria-describedby="homelab-modal-desc"
                    onClick={() => setShowModal(false)}
                >
                    <div className="bg-background border rounded-xl shadow-xl w-full max-w-md p-6 space-y-5" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between">
                            <h2 id="homelab-modal-title" className="font-semibold text-lg">
                                {editingId ? "Modifier le service" : "Ajouter un service"}
                            </h2>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowModal(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <p id="homelab-modal-desc" className="sr-only">
                            {editingId ? "Formulaire de modification d'un service existant" : "Formulaire d'ajout d'un nouveau service homelab"}
                        </p>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-[auto_1fr] gap-3 items-center">
                                <div className="space-y-1">
                                    <label className="text-xs text-muted-foreground">Emoji</label>
                                    <input
                                        type="text"
                                        value={form.emoji}
                                        onChange={(e) => setForm({ ...form, emoji: e.target.value })}
                                        className="w-16 text-center text-2xl border rounded-lg px-2 py-1.5 bg-background"
                                        maxLength={2}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-muted-foreground">Nom *</label>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        placeholder="ex: Proxmox VE"
                                        required
                                        maxLength={100}
                                        className="w-full border rounded-lg px-3 py-1.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-muted-foreground">URL</label>
                                <input
                                    type="url"
                                    value={form.url}
                                    onChange={(e) => setForm({ ...form, url: e.target.value })}
                                    placeholder="https://proxmox.local:8006"
                                    className="w-full border rounded-lg px-3 py-1.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-muted-foreground">Description</label>
                                <input
                                    type="text"
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    placeholder="Rôle du service"
                                    maxLength={200}
                                    className="w-full border rounded-lg px-3 py-1.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-muted-foreground">Catégorie</label>
                                <select
                                    value={form.category}
                                    onChange={(e) => setForm({ ...form, category: e.target.value as ServiceCategory })}
                                    className="w-full border rounded-lg px-3 py-1.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                                >
                                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                                </select>
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
