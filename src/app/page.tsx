import Link from "next/link"
import { ArrowRight } from "lucide-react"

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      name: "Idriss Bhugeloo",
      url: "https://idriss-bhugeloo.labkreol.re",
      jobTitle: "Ingénieur télécom et systèmes",
      knowsAbout: ["Next.js", "React", "TypeScript", "Proxmox", "Docker", "Supabase", "Linux"],
      sameAs: [
        "https://github.com/ibhugeloo",
      ],
    },
    {
      "@type": "WebSite",
      name: "Idriss Bhugeloo",
      url: "https://idriss-bhugeloo.labkreol.re",
    },
  ],
}

export default function Home() {
  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
    <div className="space-y-6 max-w-2xl text-base leading-relaxed text-foreground">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold tracking-tight">Idriss Bhugeloo</h1>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full border border-green-500/30 bg-green-500/10 text-green-600">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            Disponible
          </span>
        </div>
        <p className="text-muted-foreground">Ingénieur télécom et systèmes — La Réunion / Asie</p>
      </div>

      <p>
        Formé par les réseaux et le cloud avant tout. J’ai construit mon parcours en assemblant des briques techniques réelles :
        intégration VoIP chez <span className="text-blue-600">XiVO</span>, architecture distribuée, automatisation, serveurs
        que je monte, démonte, réinstalle jusqu’à obtenir exactement ce que je veux
      </p>

      <p>
        Je garde toujours un homelab actif sous <span className="text-blue-600">Proxmox</span>, espace où je teste des services,
        j’expérimente, je casse et je reconstruis. Même logique dans mon usage de <span className="text-blue-600">Notion</span> :
        un environnement structuré pour le travail, les projets et la finance
      </p>

      <p>
        Côté investissement, je fonctionne avec une grille claire : entreprises solides,
        moat lisible, discipline financière, croissance organique. Portefeuille long terme
        centré tech, pensé comme un système à optimiser plutôt qu’un jeu
      </p>

      <p>
        Je vis entre la Réunion et l’Asie. Je garde un lien constant avec le terrain :
        trail, badminton, exploration. <span className="text-blue-600">Goal.re</span> avance en parallèle,
        projet textile que je façonne comme mes infrastructures : pièce par pièce, sans surpromesse
      </p>

      <div className="flex flex-wrap gap-2 pt-2">
        {[
          { label: "Projets", href: "/projects" },
          { label: "Homelab", href: "/homelab" },
          { label: "Services", href: "/services" },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="inline-flex items-center gap-1.5 text-sm px-3.5 py-1.5 rounded-lg border border-border hover:border-foreground/30 hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
          >
            {link.label}
            <ArrowRight className="h-3 w-3" />
          </Link>
        ))}
      </div>

      <p>
        ~I
      </p>
    </div>
    </>
  );
}
