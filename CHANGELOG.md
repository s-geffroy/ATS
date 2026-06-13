# Changelog

Toutes les modifications notables du projet ATS sont consignées ici.

Le format suit [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) et la nomenclature [SemVer](https://semver.org/lang/fr/).

## [Unreleased] — v0.6.0 (en cours, Δ 20.7.8.2/45)

### Added — Quick wins UX (Vague 1)
- **§1.3 Permalien `?face=`** : le paramètre URL `face=numeric|analog` impose la face au chargement, **sans persister** dans `localStorage`. Un permalien partagé ne réécrit donc plus la préférence du destinataire. Le paramètre est nettoyé de l'URL au retour en mode live (`goLive()`). Fichier : `docs/assets/js/clock-page.js`.

## [0.5.0] — 2026-06-13 (Δ 20.7.8.2/50)

### Changed — **Breaking : bascule d'époque**
- **Époque ATS déplacée** de l'instant exact de l'alunissage (`1969-07-20T20:17:40Z`, retenu en RC v1.1) au **début du jour de l'alunissage** (`1969-07-20T00:00:00Z`). Conséquence pédagogique majeure : **Bloc 5 = 12:00 UTC** exactement (5 × 2 h 24 min). Toutes les valeurs Δ antérieures sont décalées de 73 060 s ≈ 0,84560 jour.
- L'instant exact de l'alunissage (20:17:40Z) devient un **point remarquable à l'intérieur de Δ 0**, situé à `T+ Δ 0.0.0.0.84560` (Bloc 8 / Centi 4 / Deka 5 / Kin 6).
- **Aucun convertisseur v1 → v2 fourni** (le projet est encore en pré-v1). Les consommateurs doivent régénérer leurs valeurs.
- Manifeste FR + EN : §2 (Époque) réécrit, §2.1 enrichi d'une ligne (« instant exact de l'alunissage » devient un ancrage rejeté), §4.1 et §5 (exemples) actualisés sur 2026-06-13T12:00Z = `T+ Δ 20.7.8.2.50000`, §9 (définition de la conversion) mis à jour, §15 (versionnement) refondu. Statut « Release Candidate v1.1 » → « Pre-release v0.5 ».
- FAQ FR + EN : nouvelles entrées « Pourquoi le début du jour, pas l'instant exact ? » et « Pourquoi pas le premier pas ? » remplaçant la justification antérieure.

### Changed — Frise chronologique
- `docs/{fr,en}/timeline.html` **refondue** : ~17 entrées (1900–2026) avec tags couleur par thème (Espace, Sciences, Tech, Politique), badge ★ sur l'alunissage à l'intérieur de Δ 0, et 2 conventions ATS distinctes (Hecto-fête Δ 100 = 1969-10-28, Kilo-versaire 1 Δ 1000 = 1972-04-15).
- Nouvelle légende thématique en tête de frise. Styles dédiés `.tl-event.origin`, `.tl-event.landmark`, `.tl-event.convention`.

### Changed — Vecteurs de test
- `docs/spec/test-vectors.json` régénéré : **12 instants** (au lieu de 10). Ajouts : « Bloc 5 = 12:00 UTC reference », « Lunar landing (Eagle touchdown) », « One full day after epoch ». Tous les Δ recalculés contre la nouvelle époque.
- `tests/test_vectors.{py,mjs}` : aucun changement de logique, contrat 12/12 vert.

### Changed — Code & site
- `code/ats.py` : `ATS_EPOCH = datetime(1969, 7, 20, 0, 0, 0, tzinfo=timezone.utc)`. Docstring v1.1 → v0.5.
- `docs/assets/js/ats.js` et `docs/assets/js/ats-clock.js` : constantes `ATS_EPOCH_MS` mises à jour. `EPOCH_ISO` publique = `'1969-07-20T00:00:00Z'`.
- Pages HTML (21) : footers `v1.1 RC` → `v0.5`, meta descriptions et exemples chiffrés actualisés, placeholders du convertisseur sur `T+ Δ 20.7.8.2.50000`. Carte OG (`docs/assets/og-card.svg`) actualisée.
- `README.md` : refondu avec nouvelle époque, badge `v0.5`, mention explicite du breaking change.

### Removed
- Toute référence à `1969-07-20T20:17:40Z` comme **époque** (le timestamp reste cité comme instant remarquable de l'alunissage).
- Phrasings « ancré à Apollo 11 (touchdown) » → « ancré au jour d'Apollo 11 ».

## [0.3.2] — 2026-06-12 (Δ 20.7.8.0/65)

### Added
- **8e ville** (Dubaï, UTC+4, sans DST) sur le cadran analogique — 8 villes au total, ordonnées Ouest → Est sur 2 lignes de 4 dans la légende.
- **Unités micro** : nouvelle section dans `<details>` à côté des Unités macro, dans une grille à 2 colonnes (Macro à gauche, Micro à droite). Affiche les 5 sous-unités Bloc/Centi/Milli/Beat/Blink avec leur durée approximative. Sur mobile (< 600 px), les colonnes se replient en pile.

### Changed
- **Codes villes lisibles** : font-size `8` → `10`, `font-weight: 700`, opacité 100 %, halo (cercle `var(--bg)` opacité 0.92) derrière chaque code, position un peu plus à l'extérieur (radius +7 → +10).

## [0.3.1] — 2026-06-12 (Δ 20.7.8.0/65)

### Added — Analog clock enrichments
- **Lecture ATS pédagogique** sous le cadran : `Bloc 6 · Centi 5 · Milli 4 · Beat 3 · Blink 7 (.65437)` — nomme chaque sous-unité du jour-fraction conformément au manifeste §4.3, plus la fraction canonique en parenthèses.
- **Arcs \"jouré active\"** de 7 grandes villes sur le pourtour extérieur du cadran (rayons 104-128, espacés de 4 u). Chaque arc s'étend de 8h à 18h local et est colorié en 3 tronçons : Matin 8-12h (jaune `#fbbf24`), Midi 12-14h (vert `#22c55e`), Soir 14-18h (orange `#f97316`).
- **Villes** : LA, NYC, LDN, PAR, JER, BJG, TKO. Initiales affichées au début de chaque arc (position 8h). Légende sous le cadran avec nom complet + offset UTC courant.
- **DST dynamique** via `Intl.DateTimeFormat` (`timeZoneName: 'longOffset'`) — les arcs des villes à DST (LA, NYC, London, Paris, Jerusalem) bougent de ±60 min selon la date ; Beijing et Tokyo restent fixes.
- **viewBox** élargi `-110 -110 220 220` → `-140 -140 280 280` pour loger les arcs.

## [0.3.0] — 2026-06-12 (Δ 20.7.8.0/65)

### Added — Analog clock face
- **Spec** : `docs/spec/analog-clock.{en,fr}.md` — 3 aiguilles (Bloc 1×, Centi 10×, Milli 100×), rotation horaire, longueurs Bloc > Centi > Milli (ATS-natif), couleurs Bloc=fg / Centi=accent / Milli=atténué, lecture centrale `Δ K.H.D.Kin`, mouvement hybride (Bloc + Centi sautent, Milli continu).
- **Page d'accueil** (`/fr/`, `/en/`) : ajout d'un toggle segmenté `[Numérique | Analogique]` (`role="tablist"` ARIA, ←/→ pour basculer, choix sauvegardé dans `localStorage["ats-face"]`, défaut `numeric`).
- **SVG analogique** dans `face-analog` : cercle, 10 graduations majeures + 90 mineures générées en JS, étiquettes 0–9 au radius 76, 3 aiguilles + pivot + date interne (`Δ K.H.D.Kin`).
- **Mode strict** : case à cocher dans `<details>` (« Mode strict — Milli saute aussi ») qui force Milli à tronquer comme les deux autres aiguilles ; choix sauvegardé dans `localStorage["ats-strict-analog"]`.
- CSS : `.face-toggle`, `.face-panel`, `.analog-dial`, `.options` ajoutés à `style.css`.

## [0.2.2] — 2026-06-12 (Δ 20.7.8.0/65)

### Added — Mobile navigation
- `docs/assets/js/site.js` : menu hamburger injecté automatiquement, état `aria-expanded`/`aria-controls`/`aria-label`, fermeture au clic sur un lien et à la touche `Esc`. Inclus sur les 21 pages.
- CSS : sous 600 px, la nav passe en colonne sous un bouton ☰ ↔ ✕ avec re-ordonnancement (brand · lang · hamburger sur le rang du haut, nav déroulée en dessous).

### Added — Security
- **SRI** sur tous les assets CDN : `marked@13.0.3`, `dompurify@3.2.4`, `prismjs@1.29.0` (core, python, prism-tomorrow). `integrity="sha384-…"` + `crossorigin="anonymous"`.
- **DOMPurify** : `marked.parse(md)` est désormais `DOMPurify.sanitize(marked.parse(md))` sur les 8 pages markdown (manifeste, philosophie, comparaison, FAQ × 2 langues).
- **CSP** (`<meta http-equiv="Content-Security-Policy">`) sur les 21 pages : `default-src 'self'; script-src + style-src 'self' + cdn.jsdelivr.net 'unsafe-inline'; img-src 'self' data:; connect-src 'self' raw.githubusercontent.com; object-src 'none'; base-uri 'self'; form-action 'self'`.

## [0.2.1] — 2026-06-12 (Δ 20.7.8.0/65)

### Fixed
- **Spec §12.3** (EN + FR) : la comparaison `memcmp` n'est PAS chronologique pour des comparaisons mixtes T+/T- (deux's complement). Reformulé avec la condition (T+ seul OU T- seul) + suggestion d'une variante biaisée (`days + 2^39`) pour usage futur.
- **`docs/assets/js/ats-clock.js`** : garde-fou `Number.isFinite(raw)` sur `parseInt(updates-per-second)` ; évite la busy-loop `setInterval(fn, NaN)` quand l'attribut est non numérique.
- **`docs/en/embed.html`** : 3ᵉ exemple `<ats-clock format="both" lang="fr">` corrigé en `lang="en"`.
- **`docs/fr/cadrans.html`** : phrasing "entre les deux aiguilles" (vestige design 2-aiguilles) reformulé en "entre 12 h et l'aiguille".

### Changed
- **`package.json`** : `version` bumpé à `0.2.0` (était `0.1.2`).
- **`pyproject.toml`** : ajout de la section `[project]` (name, version, description, license, urls) → publishable PyPI.
- **`tests/__init__.py`** : ajouté pour rendre `tests/` un package importable propre.
- **`.gitignore`** : ajout `node_modules/`, `dist/`, `build/`, `*.tgz`, `*.tar.gz`.
- **CI** : cache `pip` et `npm` activés via `actions/setup-{python,node}`.
- **`docs/{fr,en}/age.html`** : UID `.ics` utilise désormais `window.location.hostname` (multi-domaine, fork-friendly).
- **`README.md`** : refonte complète (v0.2.0 — test-vectors, Web Component, embed, conformance, badge en hero).

### Added — SEO & social
- **`docs/sitemap.xml`** : 21 URLs avec alternances `hreflang`.
- **`docs/robots.txt`** : autorise tout + pointe sitemap.
- **Sur les 21 pages HTML** : `<meta name="description">`, `<link rel="canonical">`, `<link rel="alternate" hreflang>` (en/fr/x-default), Open Graph (`og:type/locale/title/description/url/image`), Twitter Card (`summary_large_image`).
- **`docs/assets/og-card.svg`** : carte 1200×630 de partage social (Δ, titre, époque, URL).

### Added — Accessibilité
- Accent `#6c8cff` → `#4a6cff` (ratio WCAG AA ≥ 4.5:1 sur Canvas blanc).
- `role="timer" aria-live="off" aria-atomic="true"` sur les afficheurs d'horloge live (FR/EN index + cadrans/dials) — empêche un lecteur d'écran de lire l'heure 10 fois par seconde.

## [0.2.0] — 2026-06-12 (Δ 20.7.8.0/65)

### Fixed
- `docs/fr/age.html` : `Date.parse(v || (v.length === 10 ? v + 'T00:00:00Z' : v))` était une logique morte (`||` court-circuitait dès que `v` non-vide). Réécrit en ternaire propre.
- `docs/fr/age.html` : variable `ats` inutilisée avec commentaire d'aveu "nope" → supprimée.
- `docs/{fr,en}/age.html` : entrées au format `YYYY-MM-DD` désormais normalisées à `T00:00:00Z` (FR et EN cohérents).
- `code/ats.py` : docstring du module aligné sur la spec v1.1 (forme courte `K.H.D.Kin/cc`, perte de fraction expliquée).

### Added — Conformance & CI
- `docs/spec/test-vectors.json` : 10 instants de référence (époque, Hiroshima, Mur de Berlin, Y2K, Y1 CE, etc.) avec sortie canonique + courte attendue.
- `tests/test_vectors.py` (unittest) et `tests/test_vectors.mjs` (Node) — exécutent le contrat sur les deux implémentations.
- `.github/workflows/ci.yml` — matrice Python 3.9/3.11/3.13 + Node 20/22, lint `ruff`, vérification d'arborescence Pages.
- `pyproject.toml` — configuration `ruff`.

### Added — JavaScript & npm
- `docs/assets/js/ats-clock.js` — Web Component `<ats-clock>` (Shadow DOM, attributs `format`/`lang`/`updates-per-second`).
- `package.json` — descripteur npm (`@s-geffroy/ats`, ESM, exports `.` et `./web-component`) prêt pour publication.
- `docs/{fr,en}/embed.html` — page "Intégrer" avec one-liner d'embed, exemples, badge.

### Added — UI sur la page horloge
- Permalien : `?t=<canonique>` ou `?utc=<ISO>` fige l'horloge sur cet instant + URL nettoyée au retour au mode live.
- Clic sur la valeur Δ courte ou canonique → copie dans le presse-papier + toast.
- Raccourcis clavier : `C` court, `Maj+C` canonique, `D` détails, `N` now, `L` langue.
- Logique extraite dans `docs/assets/js/clock-page.js` (partagée FR/EN, i18n par `data-lang`).

### Added — Export & badge
- `docs/{fr,en}/age.html` : bouton "Exporter prochains Kilo-versaires (.ics)" générant les 5 prochains Kilo + 10 prochaines Hecto.
- `docs/assets/badge.svg` — badge "I run on Δ ATS" prêt à embed (README, shields.io style).

### Added — Spec
- Manifeste §11 (EN + FR) — **Durées (Δd)** : notation `Δd K.H.D.Kin.fffff` pour les deltas, distincte de l'instant.
- Manifeste §12 (EN + FR) — **Encodage binaire** : layout 64-bit (int40 signé jours + uint24 fraction), round-trip sans perte par rapport au canonique 5 chiffres, ordre lexicographique = chronologique.
- Annexes renumérotées (Annexes §14, Versionnement §15), test-vectors mentionnés.

### Added — Pédagogie
- `docs/spec/faq.{en,fr}.md` — FAQ ~15 Q/R (époque, base, fuseaux, leap, truncation, lecture orale…).
- `docs/{fr,en}/faq.html` — rendu Markdown.
- `docs/fr/timeline.html` / `docs/en/timeline.html` — frise historique avec 9 jalons en Δ (Wright, Hiroshima, Spoutnik, époque, Mur de Berlin, WWW, iPhone, COVID-19, ChatGPT).
- `docs/fr/cadrans.html` / `docs/en/dials.html` — comparatif visuel SVG : cadran 24h vs cadran 10 Blocs, animés en temps réel.

## [0.1.2] — 2026-06-12 (Δ 20.7.8.0/63)

### Changed
- **Forme courte** : le chiffre `Kin` est désormais **toujours affiché** (même à zéro) pour préserver la référence calendaire. Les espaces autour de `/` sont supprimés à l'émission (`Δ 20.7.8.0/63` au lieu de `Δ 20.7.8 / 63`).
- Les parseurs restent tolérants : les espaces autour de `/` sont acceptés à la lecture.
- Précision de décodage : ±~14 min 24 s (un Centi). L'incertitude de ±1 jour précédente disparaît (Kin était supposé `0`).
- Manifeste §5 et §10 (EN + FR) reformulés ; §13 mis à jour.
- `code/ats.py` : `to_short()` inclut Kin et supprime les espaces ; regex `_ATS_SHORT_RE` étendue pour matcher la nouvelle structure.
- `docs/assets/js/ats.js` : `toShort()` aligné.
- Pages `code.html` (FR + EN) : exemple mis à jour.

## [0.1.1] — 2026-06-12 (Δ 20.7.8.0/61)

### Changed
- **Politique d'arrondi** : retour à la **troncature stricte (floor)**. La variante banker's half-even envisagée en 0.1.0 a été rejetée comme incompatible avec le principe "compteur d'unités complétées" — un compteur monotone ne doit jamais anticiper. Le round-trip est désormais toujours **en retard** (jamais en avance) ; le drift à précision 5 chiffres reste borné par 864 ms.
- Manifeste §6 (EN + FR) reformulé, §13 (changelog interne) mis à jour.
- `code/ats.py` : `ROUND_HALF_EVEN` → `ROUND_FLOOR` ; fonction `_split_abs_days_half_even` renommée `_split_abs_days_floor`.
- `docs/assets/js/ats.js` : `roundHalfEven` supprimé, remplacé par `Math.floor`.
- Pages `code.html` (FR + EN) : description de l'arrondi corrigée.

## [0.1.0] — 2026-06-12 (Δ 20.7.8)

### Added
- **Manifeste v1.1 RC** (`docs/spec/manifesto.{en,fr}.md`) : époque déplacée à l'alunissage (1969‑07‑20T20:17:40Z), Myriade retirée du format positionnel, 0.1 j renommé `Bloc`, séparateur court `/`, politique fuseaux + leap seconds + décodage explicites.
- **Annexes Philosophie & Comparaison** (`docs/spec/{philosophy,comparison}.{en,fr}.md`).
- **Module Python `code/ats.py`** consolidé (round-trip à précision 5 chiffres = résolution 864 ms).
- **Site GitHub Pages** bilingue FR/EN (`docs/`) : horloge adaptative, manifeste rendu Markdown, philosophie, comparaison, outil "Mon âge ATS", page code.
- Snapshot historique du contenu original sous `archive/source/`.
- `README.md`, `LICENSE` (MIT), `.gitignore`.

### Changed
- Spec déplacée vers `docs/spec/` (source unique servie par Pages).
