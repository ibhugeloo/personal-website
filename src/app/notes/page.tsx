"use client"

import { useState, useEffect } from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/context/auth-context"

// ─── Types ───────────────────────────────────────────────────────────────────

type NoteTag = "Réflexion" | "Tech" | "Trail" | "Business" | "Lecture" | "Divers"

type Note = {
    id: string
    title: string
    content: string
    tag: NoteTag
    created_at: string
}

// ─── Constants ───────────────────────────────────────────────────────────────

const TAGS: NoteTag[] = ["Réflexion", "Tech", "Trail", "Business", "Lecture", "Divers"]

const TAG_COLORS: Record<NoteTag, string> = {
    Réflexion: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    Tech:      "text-blue-500 bg-blue-500/10 border-blue-500/20",
    Trail:     "text-green-600 bg-green-500/10 border-green-500/20",
    Business:  "text-orange-500 bg-orange-500/10 border-orange-500/20",
    Lecture:   "text-yellow-600 bg-yellow-500/10 border-yellow-500/20",
    Divers:    "text-muted-foreground bg-muted/50 border-border",
}

const EMPTY_FORM: Omit<Note, "id" | "created_at"> = {
    title: "",
    content: "",
    tag: "Divers",
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    })
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function NotesPage() {
    const { user } = useAuth()
    const supabase = createClient()

    const [notes, setNotes] = useState<Note[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [fetchError, setFetchError] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [form, setForm] = useState<Omit<Note, "id" | "created_at">>(EMPTY_FORM)
    const [formError, setFormError] = useState<string | null>(null)
    const [filter, setFilter] = useState<NoteTag | "Tous">("Tous")

    useEffect(() => {
        supabase
            .from("notes")
            .select("*")
            .order("created_at", { ascending: false })
            .then(({ data, error }) => {
                if (error) {
                    setFetchError("Impossible de charger les notes.")
                } else {
                    setNotes((data ?? []) as Note[])
                }
                setIsLoading(false)
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function openAdd() {
        setEditingId(null)
        setForm(EMPTY_FORM)
        setFormError(null)
        setShowModal(true)
    }

    function openEdit(note: Note) {
        if (!user) return
        setEditingId(note.id)
        setForm({ title: note.title, content: note.content, tag: note.tag })
        setFormError(null)
        setShowModal(true)
    }

    async function handleDelete(id: string) {
        if (!window.confirm("Supprimer cette note ?")) return
        const { error } = await supabase.from("notes").delete().eq("id", id)
        if (error) {
            alert("Erreur lors de la suppression.")
            return
        }
        setNotes((prev) => prev.filter((n) => n.id !== id))
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!form.content.trim()) return
        setIsSaving(true)
        setFormError(null)

        if (editingId) {
            const { data, error } = await supabase
                .from("notes")
                .update(form)
                .eq("id", editingId)
                .select()
                .single()
            if (error) {
                setFormError("Erreur lors de la modification.")
            } else {
                setNotes((prev) => prev.map((n) => (n.id === editingId ? (data as Note) : n)))
                setShowModal(false)
            }
        } else {
            const { data, error } = await supabase
                .from("notes")
                .insert(form)
                .select()
                .single()
            if (error) {
                setFormError("Erreur lors de l'ajout.")
            } else {
                setNotes((prev) => [data as Note, ...prev])
                setShowModal(false)
            }
        }
        setIsSaving(false)
    }

    const filtered = filter === "Tous" ? notes : notes.filter((n) => n.tag === filter)

    return (
        <div className="space-y-5 max-w-2xl text-base leading-relaxed text-foreground">
            <div className="space-y-2">
                <h1 className="text-xl font-semibold tracking-tight">Notes</h1>
                <p className="text-muted-foreground">Réflexions courtes, pensées en vrac</p>
            </div>

            <Separator />

            {user && (
                <Button onClick={openAdd} size="sm" className="gap-2 self-start">
                    <Plus className="h-4 w-4" />
                    Écrire
                </Button>
            )}

            <div className="flex flex-wrap gap-2">
                {(["Tous", ...TAGS] as const).map((t) => (
                    <button
                        key={t}
                        onClick={() => setFilter(t as NoteTag | "Tous")}
                        className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                            filter === t
                                ? "bg-foreground text-background border-foreground"
                                : "border-border text-muted-foreground hover:border-foreground/50"
                        }`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <p className="text-center py-16 text-muted-foreground text-sm">Chargement…</p>
            ) : fetchError ? (
                <p className="text-center py-16 text-destructive text-sm">{fetchError}</p>
            ) : filtered.length === 0 ? (
                <p className="text-center py-16 text-muted-foreground text-sm">Aucune note dans cette catégorie</p>
            ) : (
                <div className="space-y-px">
                    {filtered.map((note, i) => (
                        <div key={note.id}>
                            <div
                                className={`group relative py-5 -mx-3 px-3 rounded-lg transition-colors ${user ? "cursor-pointer hover:bg-muted/30" : ""}`}
                                onClick={() => user && openEdit(note)}
                            >
                                {user && (
                                    <button
                                        className="absolute top-4 right-3 h-6 w-6 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                        onClick={(e) => { e.stopPropagation(); handleDelete(note.id) }}
                                        aria-label="Supprimer"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                )}
                                <div className={`space-y-2 ${user ? "pr-8" : ""}`}>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${TAG_COLORS[note.tag]}`}>
                                            {note.tag}
                                        </span>
                                        <span className="text-xs text-muted-foreground">{formatDate(note.created_at)}</span>
                                    </div>
                                    {note.title && (
                                        <p className="font-semibold leading-snug">{note.title}</p>
                                    )}
                                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                        {note.content}
                                    </p>
                                </div>
                            </div>
                            {i < filtered.length - 1 && <Separator />}
                        </div>
                    ))}
                </div>
            )}

            {showModal && user && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="notes-modal-title"
                >
                    <div className="bg-background border rounded-xl shadow-xl w-full max-w-lg p-6 space-y-5">
                        <div className="flex items-center justify-between">
                            <h2 id="notes-modal-title" className="font-semibold text-lg">
                                {editingId ? "Modifier la note" : "Nouvelle note"}
                            </h2>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowModal(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs text-muted-foreground">Titre <span className="opacity-50">(optionnel)</span></label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    placeholder="Titre de la note"
                                    maxLength={150}
                                    className="w-full border rounded-lg px-3 py-1.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-muted-foreground">Contenu *</label>
                                <textarea
                                    value={form.content}
                                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                                    placeholder="Qu'est-ce qui te passe par la tête ?"
                                    required
                                    rows={5}
                                    maxLength={5000}
                                    className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none leading-relaxed"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-muted-foreground">Catégorie</label>
                                <div className="flex flex-wrap gap-2">
                                    {TAGS.map((t) => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => setForm({ ...form, tag: t })}
                                            className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                                                form.tag === t
                                                    ? "bg-foreground text-background border-foreground"
                                                    : "border-border text-muted-foreground hover:border-foreground/50"
                                            }`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {formError && <p className="text-xs text-destructive">{formError}</p>}
                            <div className="flex gap-2 pt-2">
                                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowModal(false)}>
                                    Annuler
                                </Button>
                                <Button type="submit" className="flex-1" disabled={isSaving}>
                                    {isSaving ? "Enregistrement…" : editingId ? "Enregistrer" : "Publier"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
