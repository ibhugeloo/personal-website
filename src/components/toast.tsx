"use client"

import { useEffect, useState, useCallback, createContext, useContext } from "react"
import { X } from "lucide-react"

type ToastVariant = "default" | "success" | "error"

type Toast = {
    id: number
    message: string
    variant: ToastVariant
}

type ToastContextValue = {
    toast: (message: string, variant?: ToastVariant) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
    const ctx = useContext(ToastContext)
    if (!ctx) throw new Error("useToast must be used within ToastProvider")
    return ctx
}

let nextId = 0

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const toast = useCallback((message: string, variant: ToastVariant = "default") => {
        const id = nextId++
        setToasts((prev) => [...prev, { id, message, variant }])
    }, [])

    const dismiss = useCallback((id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
    }, [])

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm" aria-live="polite">
                {toasts.map((t) => (
                    <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
                ))}
            </div>
        </ToastContext.Provider>
    )
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: number) => void }) {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        requestAnimationFrame(() => setVisible(true))
        const timer = setTimeout(() => {
            setVisible(false)
            setTimeout(() => onDismiss(toast.id), 200)
        }, 3000)
        return () => clearTimeout(timer)
    }, [toast.id, onDismiss])

    const variantClasses: Record<ToastVariant, string> = {
        default: "bg-foreground text-background",
        success: "bg-green-600 text-white",
        error: "bg-destructive text-white",
    }

    return (
        <div
            role="alert"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-lg text-sm font-medium transition-all duration-200 ${variantClasses[toast.variant]} ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
        >
            <span className="flex-1">{toast.message}</span>
            <button onClick={() => { setVisible(false); setTimeout(() => onDismiss(toast.id), 200) }} className="shrink-0 opacity-70 hover:opacity-100" aria-label="Fermer">
                <X className="h-3.5 w-3.5" />
            </button>
        </div>
    )
}
