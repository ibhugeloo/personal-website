"use client"

import { useState, useEffect, useMemo } from "react"
import { Plus, ExternalLink, X, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/components/toast"

// ─── Types ────────────────────────────────────────────────────────────────────

type ProjectStatus = "En cours" | "Terminé" | "En pause" | "Idée"

type Project = {
    id: string
    name: string
    description: string
    status: ProjectStatus
    tech: string
    url: string
    emoji: string
    created_at: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUSES: ProjectStatus[] = ["En cours", "Terminé", "En pause", "Idée"]

const STATUS_STYLES: Record<ProjectStatus, string> = {
    "En cours": "text-green-600 bg-green-500/10 border-green-500/25",
    "Terminé":  "text-blue-600 bg-blue-500/10 border-blue-500/25",
    "En pause": "text-yellow-600 bg-yellow-500/10 border-yellow-500/25",
    "Idée":     "text-muted-foreground bg-muted/60 border-border",
}

const STATUS_DOT: Record<ProjectStatus, string> = {
    "En cours": "bg-green-500",
    "Terminé":  "bg-blue-500",
    "En pause": "bg-yellow-500",
    "Idée":     "bg-muted-foreground",
}

const EMPTY_FORM: Omit<Project, "id" | "created_at"> = {
    name: "",
    description: "",
    status: "En cours",
    tech: "",
    url: "",
    emoji: "🚀",
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseTech(raw: string): string[] {
    return raw.split(",").map((t) => t.trim()).filter(Boolean)
}

// ─── Project Card ─────────────────────────────────────────────────────────────

function ProjectCard({
    project,
    onEdit,
    onDelete,
    isAdmin,
}: {
    project: Project
    onEdit: (p: Project) => void
    onDelete: (id: string) => void
    isAdmin: boolean
}) {
    const tags = parseTech(project.tech)

    return (
        <div className="group relative flex flex-col rounded-xl border bg-card p-5 gap-4 hover:shadow-md transition-shadow">
            {isAdmin && (
                <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onEdit(project)}
                        className="h-6 w-6 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        aria-label="Modifier"
                    >
                        <Pencil className="h-3 w-3" />
                    </button>
                    <button
                        onClick={() => onDelete(project.id)}
                        className="h-6 w-6 flex items-center justify-center rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        aria-label="Supprimer"
                    >
                        <X className="h-3 w-3" />
                    </button>
                </div>
            )}

            <div className="flex items-start gap-3 pr-14">
                <span className="text-3xl leading-none shrink-0 mt-0.5" aria-hidden="true">{project.emoji}</span>
                <div className="space-y-1 min-w-0">
                    <h3 className="font-semibold leading-tight truncate">{project.name}</h3>
                    <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_STYLES[project.status]}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[project.status]}`} aria-hidden="true" />
                        {project.status}
                    </span>
                </div>
            </div>

            {project.description && (
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {project.description}
                </p>
            )}

            <div className="flex items-end justify-between gap-2 mt-auto">
                {tags.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                        {tags.map((tag) => (
                            <span key={tag} className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-mono">
                                {tag}
                            </span>
                        ))}
                    </div>
                ) : (
                    <div />
                )}
                {project.url && (
                    <a href={project.url} target="_blank" rel="noopener noreferrer" aria-label={`Voir ${project.name}`}>
                        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                            <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                    </a>
                )}
            </div>
        </div>
    )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProjectsPage() {
    const { user } = useAuth()
    const { toast } = useToast()
    const supabase = useMemo(() => createClient(), [])

    const [projects, setProjects] = useState<Project[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [fetchError, setFetchError] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [filterStatus, setFilterStatus] = useState<ProjectStatus | "Tous">("Tous")
    const [showModal, setShowModal] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [form, setForm] = useState<Omit<Project, "id" | "created_at">>(EMPTY_FORM)
    const [formError, setFormError] = useState<string | null>(null)

    useEffect(() => {
        let isMounted = true
        supabase
            .from("projects")
            .select("*")
            .order("created_at", { ascending: false })
            .then(({ data, error }) => {
                if (!isMounted) return
                if (error) setFetchError("Impossible de charger les projets.")
                else setProjects((data ?? []) as Project[])
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

    function openEdit(project: Project) {
        setEditingId(project.id)
        setForm({ name: project.name, description: project.description, status: project.status, tech: project.tech, url: project.url, emoji: project.emoji })
        setFormError(null)
        setShowModal(true)
    }

    async function handleDelete(id: string) {
        if (!window.confirm("Supprimer ce projet ?")) return
        const { error } = await supabase.from("projects").delete().eq("id", id)
        if (error) { toast("Erreur lors de la suppression.", "error"); return }
        setProjects((prev) => prev.filter((p) => p.id !== id))
        toast("Projet supprimé", "success")
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!form.name.trim()) return
        setIsSaving(true)
        setFormError(null)

        if (editingId) {
            const { data, error } = await supabase
                .from("projects").update(form).eq("id", editingId).select().single()
            if (error) setFormError("Erreur lors de la modification.")
            else { setProjects((prev) => prev.map((p) => p.id === editingId ? data as Project : p)); setShowModal(false); toast("Projet modifié", "success") }
        } else {
            const { data, error } = await supabase
                .from("projects").insert(form).select().single()
            if (error) setFormError("Erreur lors de l'ajout.")
            else { setProjects((prev) => [data as Project, ...prev]); setShowModal(false); toast("Projet ajouté", "success") }
        }
        setIsSaving(false)
    }

    const filtered = filterStatus === "Tous" ? projects : projects.filter((p) => p.status === filterStatus)

    const counts = projects.reduce((acc, p) => {
        acc[p.status] = (acc[p.status] ?? 0) + 1
        return acc
    }, {} as Partial<Record<ProjectStatus, number>>)

    return (
        <div className="space-y-5 max-w-4xl text-base leading-relaxed text-foreground">
            <div className="space-y-2">
                <h1 className="text-xl font-semibold tracking-tight">Projets</h1>
                <p className="text-muted-foreground">
                    Side projects, expérimentations et outils que je construis
                </p>
            </div>

            <Separator />

            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex flex-wrap gap-2">
                    {(["Tous", ...STATUSES] as const).map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilterStatus(s as ProjectStatus | "Tous")}
                            className={`text-xs px-3 py-1 rounded-full border transition-colors flex items-center gap-1.5 ${
                                filterStatus === s
                                    ? "bg-foreground text-background border-foreground"
                                    : "border-border text-muted-foreground hover:border-foreground/50"
                            }`}
                        >
                            {s !== "Tous" && filterStatus !== s && (
                                <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[s as ProjectStatus]}`} aria-hidden="true" />
                            )}
                            {s}
                            {s !== "Tous" && counts[s as ProjectStatus] ? (
                                <span className="opacity-60">{counts[s as ProjectStatus]}</span>
                            ) : null}
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
                <div className="text-center py-16 text-muted-foreground">
                    <p className="text-sm">Chargement…</p>
                </div>
            ) : fetchError ? (
                <div className="text-center py-16 text-destructive text-sm">{fetchError}</div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                    <p className="text-4xl mb-3" aria-hidden="true">🛠️</p>
                    <p>Aucun projet{filterStatus !== "Tous" ? ` avec le statut « ${filterStatus} »` : ""}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filtered.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            onEdit={openEdit}
                            onDelete={handleDelete}
                            isAdmin={!!user}
                        />
                    ))}
                </div>
            )}

            {showModal && user && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="projects-modal-title"
                    onClick={() => setShowModal(false)}
                >
                    <div className="bg-background border rounded-xl shadow-xl w-full max-w-lg p-6 space-y-5" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between">
                            <h2 id="projects-modal-title" className="font-semibold text-lg">
                                {editingId ? "Modifier le projet" : "Nouveau projet"}
                            </h2>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowModal(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-[auto_1fr] gap-3 items-end">
                                <div className="space-y-1">
                                    <label className="text-xs text-muted-foreground">Icône</label>
                                    <input
                                        type="text"
                                        value={form.emoji}
                                        onChange={(e) => setForm({ ...form, emoji: e.target.value })}
                                        className="w-16 text-center text-2xl border rounded-lg px-2 py-1.5 bg-background"
                                        maxLength={2}
                                        aria-label="Icône du projet"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-muted-foreground">Nom *</label>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        placeholder="ex: Personal Website"
                                        required
                                        maxLength={100}
                                        className="w-full border rounded-lg px-3 py-1.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-muted-foreground">Description</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    placeholder="À quoi ça sert ?"
                                    rows={3}
                                    maxLength={500}
                                    className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none leading-relaxed"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-muted-foreground">Statut</label>
                                <div className="flex flex-wrap gap-2">
                                    {STATUSES.map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setForm({ ...form, status: s })}
                                            className={`text-xs px-3 py-1 rounded-full border transition-colors flex items-center gap-1.5 ${
                                                form.status === s ? STATUS_STYLES[s] : "border-border text-muted-foreground hover:border-foreground/50"
                                            }`}
                                        >
                                            <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[s]}`} aria-hidden="true" />
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-muted-foreground">Stack <span className="opacity-50">(séparées par des virgules)</span></label>
                                <input
                                    type="text"
                                    value={form.tech}
                                    onChange={(e) => setForm({ ...form, tech: e.target.value })}
                                    placeholder="Next.js, Supabase, Tailwind"
                                    maxLength={200}
                                    className="w-full border rounded-lg px-3 py-1.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                                {form.tech && (
                                    <div className="flex flex-wrap gap-1 pt-1">
                                        {parseTech(form.tech).map((t) => (
                                            <span key={t} className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-mono">{t}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-muted-foreground">Lien <span className="opacity-50">(optionnel)</span></label>
                                <input
                                    type="url"
                                    value={form.url}
                                    onChange={(e) => setForm({ ...form, url: e.target.value })}
                                    placeholder="https://..."
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
