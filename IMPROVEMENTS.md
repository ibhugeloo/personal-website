# Améliorations du site personnel

Fichier de suivi des améliorations. Mis à jour après chaque implémentation.

---

## Fait

- [x] **PostHog Analytics** — Tracking des visites et pageviews avec PostHog (provider App Router)
- [x] **Remplacer les `alert()` par des toasts** — Composant Toast custom avec `ToastProvider`, remplace tous les `alert()` dans les 4 pages CRUD
- [x] **Feedback de succès après sauvegarde** — Toast "success" après chaque ajout, modification et suppression sur les 4 pages CRUD
- [x] **Accessibilité — `aria-label` sur boutons icônes** — Ajout `aria-label` sur le bouton lien externe Homelab (Projects avait déjà le sien)
- [x] **Empty states contextuels** — Notes, Trail et Homelab affichent maintenant le filtre actif dans le message vide

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
