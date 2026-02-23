"use client"

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { SocialLinks } from "@/components/social-links"
import { NAV_ITEMS } from "@/lib/nav"

export function MobileNav() {
    const [open, setOpen] = useState(false)

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-6">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col h-full">
                    <div className="mb-8">
                        <Link href="/" onClick={() => setOpen(false)} className="font-semibold text-lg tracking-tight">
                            Idriss Bhugeloo
                        </Link>
                    </div>
                    <nav className="flex-1 space-y-4">
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className="block text-sm font-medium transition-colors hover:text-foreground text-muted-foreground"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                    <div className="mt-auto">
                        <SocialLinks />
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
