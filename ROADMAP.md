# ATS — Roadmap

Plan de travail consolidé pour les versions à venir (v0.4+). Les items sont indépendants sauf indication contraire — chaque "vague" peut être livrée seule.

**Légende effort** : XS (≤ 30 min) · S (≤ 2 h) · M (½ à 1 journée) · L (1–2 jours).

---

## Vague 1 — Quick wins (cumul ~2 h)

### 1.1 Pré-rendre le Markdown au commit · **S**
- **Quoi** : script Node `scripts/render-md.mjs` qui lit `docs/spec/*.md` et émet `*.html` partiels prêts à inliner.
- **Comment** : pre-commit hook (ou GitHub Action) qui régénère les HTML des pages manifesto/philosophy/comparison/FAQ. La balise `<script src=".../marked@13.0.3...">` et l'include DOMPurify disparaissent du runtime.
- **Gain** : −35 KB sur 4 pages, TTI ÷ 2, supprime tout risque XSS résiduel sur le `.md`.
- **Acceptance** : Lighthouse "Eliminate render-blocking resources" passe ; les pages markdown affichent leur contenu < 100 ms après chargement HTML.

### 1.2 Toggle dark/light/auto explicite · **XS**
- **Quoi** : bouton dans le header (à côté du lang-switch ou via `site.js`) avec 3 états mémorisés `localStorage["ats-theme"]`. Set `data-theme` sur `<html>`, CSS lit `[data-theme="dark"]` pour forcer la palette.
- **Acceptance** : changement instantané, persiste entre pages, "auto" suit `prefers-color-scheme`.

### 1.3 Permalien avec face (`?t=…&face=analog`) · **XS**
- **Quoi** : le paramètre `face` choisit Numérique ou Analogique au chargement. Ajout au permalien partagé.
- **Acceptance** : `?t=20.7.8.0.43210&face=analog` charge la face analogique figée à cet instant. Sans `face`, fallback sur la préférence localStorage.

### 1.4 Audit Lighthouse complet · **S**
- **Quoi** : lancer Lighthouse mobile + desktop sur l'horloge, le manifeste, embed, age. Capturer les scores.
- **Suivre** : corriger les "easy wins" (font-display, defer manquants, dimensions d'image, etc.).
- **Acceptance** : 4 catégories ≥ 90 sur ces 4 pages en mobile.

---

## Vague 2 — Méthode : extensions doctrinales (cumul ~1 journée)

### 2.1 Arithmétique des Δ et Δd formalisée · **S**
- **Quoi** : nouvelle §11.4 (Durées — Algèbre) qui définit :
  - Δ + Δd → Δ
  - Δ − Δ → Δd (signe absolu)
  - Δd + Δd → Δd, Δd × n → Δd, Δd ÷ n → Δd
  - Comparaisons strictes <, ≤, =, ≥, > sur Δ et sur Δd
  - Sémantique du débordement (Kilo non borné, frac sur N chiffres)
- **Code** : `code/ats.py` reçoit `__add__`, `__sub__`, `__lt__`, `__eq__` sur `ATSDateTime` et une dataclass `ATSDuration`.
- **Tests** : nouveaux vecteurs `arithmetic.json` (≥ 10 cas).
- **Acceptance** : conformance Py + JS round-trip sur les opérations.

### 2.2 Conventions sociales optionnelles · **S**
- **Quoi** : annexe `docs/spec/conventions.{en,fr}.md` qui formalise (sans rendre obligatoire) :
  - Kilo-versaire et Hecto-fête (déjà dans Philosophy mais épars)
  - Rythme 7+3 sur la Deka comme convention proposée (pas imposée)
  - Bandes solaires locales 08–22 par fuseau (les arcs villes de l'horloge analogique deviennent une convention citée)
- **Acceptance** : le manifeste pointe l'annexe en §14 ; la page Philosophie y renvoie.

### 2.3 Ponts calendaires (premier batch : Hébreu + Islamique) · **M**
- **Quoi** : `code/bridges/{hebrew,islamic}.py` qui convertit `(date_hébraïque|hijri) ↔ Δ` via les algorithmes classiques (Falk pour hébreu, tabulaire pour islamique).
- **UI** : convertisseur étendu sur la page horloge (un dropdown calendrier source).
- **Test vectors** : 10 dates de référence par calendrier dans `test-vectors-bridges.json`.
- **Acceptance** : conformance + UI fonctionnelle.

---

## Vague 3 — Multi-planétaire + PWA (cumul ~1 journée chacun)

### 3.1 Annexe Multi-planétaire (Mars + Lune) · **M**
- **Quoi** : `docs/spec/multi-planetary.{en,fr}.md` qui spécifie :
  - `Δ_Mars` : compteur de sols (88 775 244 ms) depuis un point zéro à choisir (atterrissage Curiosity 2012-08-06T05:17:57Z ? ou Mars Pathfinder 1997 ?).
  - `Δ_Moon` : pas de jour solaire mensuel, on garde le jour terrestre comme unité ; ancrage à 1969-07-20T20:17:40Z (alunissage).
  - Mapping `Δ ↔ Δ_Mars ↔ Δ_Moon` (ratio fixe).
  - Notation : `Δ⊕`, `Δ♂`, `Δ☾` (symboles astronomiques) en alternative.
- **Code** : `code/ats_mars.py` (~50 lignes) et tests vectors.
- **Site** : page "Multi-planetary" dans la nav avec horloges synchronisées Terre/Mars/Lune.
- **Acceptance** : la rhétorique manifeste tient (horloge Mars opérationnelle).

### 3.2 PWA installable · **M**
- **Quoi** :
  - `docs/manifest.webmanifest` (name, icons 192/512, theme-color, start_url, display: standalone)
  - `docs/sw.js` minimal : cache-first sur `assets/css|js`, network-first sur HTML, fallback offline sur `/{fr,en}/`
  - Favicon SVG (Δ stylisé) + variantes PNG 192/512
  - `<link rel="manifest">` injecté dans toutes les pages
- **Acceptance** : "Add to Home Screen" propose l'installation sur Chrome Android / Safari iOS. Horloge fonctionne offline (les arcs villes sont calculés localement, donc OK ; le clock-page.js + ats.js sont cachés).

---

## Vague 4 — Implémentations larges + UX custom (cumul ~2-3 jours)

### 4.1 Implémentation Rust de référence · **L**
- **Quoi** : crate `ats` sur crates.io, dépendances minimales (`chrono` pour parse Greg). API symétrique au Python.
- **Tests** : `cargo test` lit `docs/spec/test-vectors.json`, 10 vecteurs passent.
- **CI** : matrix Rust stable + nightly dans `.github/workflows/ci.yml`.
- **Doc** : `docs/{fr,en}/code.html` étendue avec onglet Rust.

### 4.2 Implémentation Go · **L**
- **Quoi** : module `github.com/s-geffroy/ats` avec `func Now() ATSDateTime`, conversion bidirectionnelle.
- **Tests** : `go test`, mêmes vecteurs.
- **CI** : matrix Go 1.21+.
- **Doc** : onglet Go sur la page Code.

### 4.3 Constructeur de villes (UI) · **M**
- **Quoi** : dans `<details>` de la face analogique, un champ "Ajouter une ville" :
  - Input ville (IANA timezone autocompleté) + couleur (color picker)
  - Persistance dans `localStorage["ats-custom-cities"]`
  - Bouton "Reset par défaut"
- **Code** : étend `clock-page.js` pour fusionner CITIES par défaut + custom à `buildCityArcs`. Les rayons s'adaptent automatiquement.
- **Acceptance** : ajouter "Sydney" (Australia/Sydney) → l'arc apparaît instantanément avec sa couleur.

### 4.4 Implémentations supplémentaires (optionnelles) · **L chacune**
- Kotlin (JVM + Android), Swift (iOS), Elixir.
- Liées à l'adoption observée — pas prioritaire sans demande explicite.

---

## Vague 5 — Optionnels / nice-to-have

| Item | Effort | Quand |
|---|---|---|
| Ponts calendaires restants (Chinois, Hindou, Maya Long Count) | M chacun | si Vague 2.3 est bien reçue |
| OG-image PNG (1200×630) générée au build via `rsvg-convert` ou Inkscape | XS | si LinkedIn/FB rendent mal l'OG SVG actuelle |
| Recherche statique (Pagefind ou lunr.js sur FAQ + manifeste) | S | si le contenu grossit |
| API endpoint `/api/now.json` (build-time régénéré par CI cron 1×/jour) | M | si demande externe |
| Page "Test vectors" interactive (table + boutons copy) | S | aide pour implémenteurs tiers |
| Service worker — Background Sync pour notifier les Kilo-versaires | L | utile seulement si PWA adoptée |
| Easter egg : `Konami code` → confetti à chaque tick Beat | XS | pour le fun |
| Themes alternatifs (terminal / aquarelle / néon) | M | bikeshedding, low ROI |

---

## Ordre de priorité suggéré (top 5)

1. **1.1 Pré-rendre Markdown** — pure gain technique, ~30 min, immédiatement visible.
2. **3.1 Multi-planétaire** — colle la spec à sa rhétorique, fort potentiel viral.
3. **3.2 PWA** — transforme le site en outil quotidien sur téléphone.
4. **2.1 Arithmétique Δ/Δd** — rebouche un gap réel de la spec.
5. **4.1 Rust** — crédibilité système, ouvre l'écosystème IoT/serveur.

---

## Route vers v1.0 — blocants identifiés

Items dérivés de l'audit « que manque-t-il pour une v1.0 vraiment solide ? » post-v0.6.0. L'item 1 (engagement de stabilité : `versioning.{en,fr}.md`, `SECURITY.md`, `GOVERNANCE.md`, `spec_version` dans les vecteurs) est **livré dans v0.6.0**. Les 9 suivants sont à traiter avant de tagger v1.0.

### V1.0-A · Spec multi-planétaire (§3.1) · **M**
Le manifeste §1 promet « multi-planétaire ». La spec ne définit rien au-delà de la Terre. À traiter **avant code** : amender la spec avec le drift sol↔jour (sol martien = 88 775,244 s ≠ 86 400 s, ratio non-entier). Plusieurs choix à trancher :
- **Ancrage Mars** : Curiosity touchdown (2012-08-06T05:17:57Z) · Mars Pathfinder (1997-07-04) · ou Mars Sol Date 0 = 1873-12-29 (astronomique, neutre).
- **Notation** : `Δ♂` / `Δ⊕` / `Δ☾` (symboles astronomiques) ou `Δ_Mars` / `Δ_Earth` (suffixes).
- **Lune** : ancrage 1969-07-20T20:17:40Z (touchdown) ou même époque que Terre.
- **Périmètre** : Mars + Lune uniquement, ou aussi Vénus / Jupiter / système solaire entier.
- **Modèle de drift** : sol fixe à 88 775,244 s ou avec variations long terme (négligeable < quelques siècles).

Livrables : `docs/spec/multi-planetary.{en,fr}.md` (annexe **normative**), `code/ats_mars.py`, `code/ats_moon.py`, page « Multi-planetary » avec horloges synchronisées, vecteurs `test-vectors-multi-planetary.json` (10+ par corps céleste).

### V1.0-B · 3ᵉ implémentation de référence (Rust ou Go) · **L**
Sans une implémentation hors Python + JS, l'argument « standard universel » ne passe pas un comité. À choisir :
- **Rust** (`ats` crate sur crates.io) — argumentaire systèmes / IoT / embedded, `no_std`-friendly.
- **Go** (module `github.com/s-geffroy/ats`) — argumentaire serveurs / CLI / infra cloud.
- **Les deux** (effort 2× L).

Périmètre minimal de chaque implémentation : core `gregorian_to_ats` / `ats_to_gregorian` + algèbre §11.4 + parser canonique/court. Bridges calendaires optionnels. **CI matrix étendue** (matrix Rust stable/nightly ou Go 1.21+). **74 vecteurs verts**.

### V1.0-C · UI converter calendaire en JS · **M**
Les 5 ponts (Hebrew, Islamic, Chinese, Hindu, Maya) sont Python-only. La promesse « universel » côté site n'est pas tenue. Porter Hebrew + Islamic + Maya (algorithmes courts, ~50–100 LoC chacun) en JS, ajouter dropdown calendar-source dans `clock-page.js`. Chinese (tables HKO 1900–2100) + Hindu (panchanga régional) restent Python-only documenté.

### V1.0-D · Lighthouse réel en CI Linux · **S**
Le harness `lighthouse/` existe mais Apple Silicon empêche l'exécution locale. **GitHub Actions Linux runner** qui exécute `lighthouse/run-lighthouse.sh` sur chaque PR + assert ≥ 90 sur 4 catégories (Performance / Accessibility / Best Practices / SEO) sur les 4 pages cibles. Échec bloque le merge.

### V1.0-E · i18n minimal au-delà FR/EN · **M**
Un « standard universel » en 2 langues européennes est une contradiction. Ajouter **navigation + UI horloge** dans ES, DE, ZH, JA (4 langues couvrant ≈ 50 % des locuteurs natifs). Manifeste reste FR/EN ; seul le chrome multilingue. Outils : `data-i18n` attribute + `i18n/<lang>.json` chargés par `site.js`.

### V1.0-F · Tests durcis · **S**
- **Property-based** (Hypothesis) sur round-trip Δ → grégorien → Δ aléatoire sur 1 000 instants.
- **Bornes** : Δ très négatif (kilo grand), Δ très futur (kilo ≥ 10 000), parsing d'inputs malformés (regex injection, séparateurs incorrects, frac > 5 chiffres).
- **Leap second policy §8** : test explicite sur les instants 2016-12-31T23:59:60Z (skip / fold avec POSIX day = 86 400 s).
- **Performance regression** : `bench/test_perf.py` qui mesure `gregorian_to_ats` à < 50 µs et publie en CI ; alarme si régression > 2×.

### V1.0-G · Background sync §5.6 — revoir · **S**
Ce qui est livré (Periodic Background Sync) ne fonctionne que sur Chrome desktop/Android avec PWA installée + permission. Sur > 95 % des configs, ça ne notifie jamais. Trois options :
- **Retirer** et documenter comme expérimental, garder seulement le fallback in-page sur `age.html`.
- **Backend Web Push** (compte hébergement requis, ~5 €/mois).
- **Conserver tel quel** avec bandeau d'avertissement explicite dans `age.html`.

### V1.0-H · Branding & artefacts release · **M**
- **`npm publish`** de `@s-geffroy/ats` (l'entrée existe dans `package.json`, mais jamais poussée).
- **`twine upload`** de `ats-time` sur PyPI (idem pour `pyproject.toml`).
- **GitHub Releases signées GPG** avec `git tag -s v0.6.0`.
- Jeu favicon complet : `favicon.ico` (16/32/48), `apple-touch-icon.png` 180×180, `mstile-*.png` Windows.
- Page « Press kit » : logo SVG/PNG en plusieurs résolutions, palette officielle (`#0b0f17 / #4a6cff / #e8eef7`), do/don't du symbole Δ.

### V1.0-I · Adoption tierce (signal externe) · **L** (effort éditorial)
v1.0 sans **≥ 3 utilisateurs externes documentés** reste un projet personnel auto-déclaré standard. Critères mesurables :
- ≥ 100 ★ GitHub + 10 forks indépendants, OU
- ≥ 1 projet OSS tiers qui dépend de `@s-geffroy/ats` ou `ats-time`, OU
- ≥ 1 mention dans un article de blog tiers / talk de conf / RFC / discussion ISO.

Précurseurs : `Show HN`, `Bluesky`, `Reddit r/ISO8601`, soumission lightning talk OSCON / FOSDEM, article de blog « Why ATS » (déjà cité plus bas).

---

## Hors-roadmap (mais à garder en tête)

- **Show HN / Bluesky / Reddit `r/ISO8601`** — campagne d'annonce après Vague 3 (PWA + multi-planétaire).
- **Demande à l'IANA** d'un sous-namespace pour ATS-aware applications (long terme).
- **Article de blog "Why ATS"** synthétisant Philosophy + Comparison + FAQ — un seul lien à partager.
- **Conférence d'idée** sur le calendrier décimal — peut-être Hack Days ou OSCON.
