"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"
import { NAV_ITEMS, type NavItem } from "@/lib/nav"
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core"
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useAuth } from "@/context/auth-context"

function SortableNavItem({ item, isActive }: { item: NavItem; isActive: boolean }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.href })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn("flex items-center gap-1 group", isDragging && "opacity-40")}
        >
            <button
                {...listeners}
                {...attributes}
                className="opacity-0 group-hover:opacity-25 hover:!opacity-60 cursor-grab active:cursor-grabbing transition-opacity p-0.5 rounded"
                tabIndex={-1}
            >
                <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
            <Link
                href={item.href}
                className={cn(
                    "flex items-center text-base transition-colors hover:text-foreground",
                    isActive ? "text-foreground font-medium" : "text-muted-foreground"
                )}
            >
                <span className={cn("mr-2 h-1.5 w-1.5 bg-foreground rounded-sm transition-opacity", isActive ? "opacity-100" : "opacity-0")} />
                {item.name}
            </Link>
        </div>
    )
}

export function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const { user, signOut } = useAuth()
    const [items, setItems] = useState<NavItem[]>(NAV_ITEMS)

    useEffect(() => {
        try {
            const stored = localStorage.getItem("nav-order")
            if (!stored) return
            const parsed = JSON.parse(stored)
            if (!Array.isArray(parsed) || !parsed.every((item) => typeof item === "string")) {
                localStorage.removeItem("nav-order")
                return
            }
            const order: string[] = parsed
            const sorted = order
                .map((href) => NAV_ITEMS.find((i) => i.href === href))
                .filter((item): item is NavItem => Boolean(item))
            const missing = NAV_ITEMS.filter((i) => !order.includes(i.href))
            setItems([...sorted, ...missing])
        } catch {
            localStorage.removeItem("nav-order")
        }
    }, [])

    const sensors = useSensors(useSensor(PointerSensor))

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex((i) => i.href === active.id)
            const newIndex = items.findIndex((i) => i.href === over.id)
            const next = arrayMove(items, oldIndex, newIndex)
            localStorage.setItem("nav-order", JSON.stringify(next.map((i) => i.href)))
            setItems(next)
        }
    }

    return (
        <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 p-8 bg-background">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={items.map((i) => i.href)} strategy={verticalListSortingStrategy}>
                    <nav className="flex-1 space-y-6 mt-20">
                        {items.map((item) => (
                            <SortableNavItem key={item.href} item={item} isActive={pathname === item.href} />
                        ))}
                    </nav>
                </SortableContext>
            </DndContext>
            <div className="mt-auto pt-8">
                {user ? (
                    <button
                        onClick={async () => { await signOut(); router.push("/") }}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Déconnexion
                    </button>
                ) : (
                    <Link
                        href="/login"
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Connexion
                    </Link>
                )}
            </div>
        </aside>
    )
}
