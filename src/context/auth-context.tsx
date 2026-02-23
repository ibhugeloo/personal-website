"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"

type AuthContextType = {
    user: User | null
    signIn: (email: string, password: string) => Promise<{ error: string | null }>
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    signIn: async () => ({ error: null }),
    signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const supabase = useMemo(() => createClient(), [])

    useEffect(() => {
        let isMounted = true

        supabase.auth.getUser().then(({ data }) => {
            if (isMounted) setUser(data.user)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
            if (isMounted) setUser(session?.user ?? null)
        })

        return () => {
            isMounted = false
            subscription.unsubscribe()
        }
    }, [supabase])

    async function signIn(email: string, password: string) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        return { error: error?.message ?? null }
    }

    async function signOut() {
        await supabase.auth.signOut()
    }

    return (
        <AuthContext.Provider value={{ user, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
