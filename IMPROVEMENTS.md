# Améliorations du site personnel

Fichier de suivi des améliorations. Mis à jour après chaque implémentation.

---

## Fait

- [x] **PostHog Analytics** — Tracking des visites et pageviews avec PostHog (provider App Router)

## Gains rapides

- [ ] **Remplacer les `alert()` par des toasts** — Les 4 pages CRUD utilisent `alert()` pour les erreurs de suppression. Utiliser un composant toast shadcn/ui.
- [ ] **Feedback de succès après sauvegarde** — Toast "Enregistré" de 2s après chaque save (actuellement le modal se ferme silencieusement).
- [ ] **Accessibilité — `aria-label` sur boutons icônes** — Boutons de lien externe (Homelab, Projects) sans label pour les lecteurs d'écran.
- [ ] **Empty states contextuels** — Trail, Notes et Homelab n'affichent pas le filtre actif dans le message "Aucun résultat" (contrairement à Projects).

## Améliorations moyennes

- [ ] **Recherche textuelle sur Notes et Homelab** — Notes n'a qu'un filtre par tag, Homelab n'a aucun filtre. Ajouter un champ de recherche client-side.
- [ ] **Hook `useCRUDTable` pour éliminer la duplication** — Les 4 pages CRUD répètent ~300 lignes de code identique (useState, useEffect, handlers). Extraire un hook custom.
- [ ] **Skeleton loaders** — Remplacer "Chargement…" par des skeletons animés pour une meilleure perception de vitesse.
- [ ] **Services — CTA email plus visible** — Le lien email sur `/services` est un simple lien bleu. Utiliser un `<Button>` avec icône.

## Nice to have

- [ ] **Home page plus engageante** — Ajouter des stats, un CTA "Voir mes projets", un badge de disponibilité.
- [ ] **Investing — données en base** — Portfolio hardcodé dans le source. Le déplacer dans Supabase avec formulaire admin.
- [ ] **Pagination sur les listes CRUD** — Tout est chargé d'un coup. Ajouter "Charger plus" ou infinite scroll.
- [ ] **Schema.org (JSON-LD)** — Ajouter `Person` + `WebSite` sur la home pour le SEO.
- [ ] **Modal accessible** — Ajouter `aria-labelledby` et `aria-describedby` sur les modals CRUD.
- [ ] **Validation formulaires** — Validation URL sur Homelab, compteur de caractères, validation emoji.
