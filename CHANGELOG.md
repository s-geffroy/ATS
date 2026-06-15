# Changelog

Toutes les modifications notables du projet ATS sont consignées ici.

Le format suit [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) et la nomenclature [SemVer](https://semver.org/lang/fr/).

## [Unreleased] — vers v1.0

### Blindage final v0.7 — docs racine et pages autonomes

Campagne de blindage documentaire complétant celle de la spec (manifesto, versioning, multi-planetary, philosophy, comparison, conventions, analog-clock, faq + test-vectors.html déjà blindés). Aucune modification de la spec normative ni des conformance vectors.

- **`GOVERNANCE.md` refonte (~310 lignes)** : passage de BDFL simple à doc complet — RFC 2119, §1 Editors of record (nommés), §2 pre-v1.0 (BDFL) vs post-v1.0 (steering committee min 3, cap d'affiliation), §3 décision IETF rough consensus + veto backward-compat, §4 archive RFC `docs/spec/rfcs/`, §5 rotation des éditeurs sur critères implémenteur, §6 conflict-of-interest disclosure, §7 procédure de retrait, §8 trademark/licensing (MIT code / CC-BY-4.0 docs), §9 objections anticipées, §10 préséance normative. **Ferme `versioning.en.md §7.2 (6)`** — v1.0 progress 3/7 → **4/7**.
- **`SECURITY.md` durcissement (~150 lignes)** : RFC 2119, §0.2 grille de sévérité (Critical/High/Moderate/Low), §1 table des branches supportées, §2 canaux de report (GHSA + email PGP, out-of-band explicitement non supporté), §3 cadence ack/triage/fix par sévérité avec target + hard cap, §4 politique de divulgation coordonnée (extension embargo si RFC requis), §5/§6 scope in/out explicite (spec/impl/site/PWA/CI/vectors/`now.json`), §7 hall of fame ouvert, §8 posture sécurité projet (zero-deps, CSP, GPG signing planifié). Cross-refs `GOVERNANCE.md §1/§2.2`, `versioning.en.md §6/§7.2 (4)`, `manifesto.en.md §16`.
- **`README.md` refonte vitrine (~190 lignes)** : badges (CI, Lighthouse, license, spec_version), section « En 60 secondes » avec lien direct manifeste, **tableau de l'état du blindage v0.7 par document** (13 docs), **table de progression v1.0 §7.2 avec 4/7**, exemples usage Python/JS/Web Component/conformance en **Docker one-liner** (CLAUDE.md global rule), section gouvernance/sécurité/contributions, licence MIT code / CC-BY-4.0 docs explicite.
- **`embed.html` (EN + FR) blindage (~220 lignes chacune)** : guide d'intégration structuré 9 sections — §1 one-liner, §2 **tableau des attributs avec notes et cross-refs** (`format`, `lang`, `updates-per-second`), §3 **CSP stricte recommandée** (`script-src 'self' https://s-geffroy.github.io` sans `'unsafe-inline'`) avec note SRI, §4 a11y (`aria-live="polite"`, non focusable, recommandations region/heading), §5 self-hosting (`curl` depuis GitHub) + **alternative serveur `/api/now.json`** avec exemple JSON, §6 **3 exemples concrets** (blog light, dashboard dark, badge Markdown), §7 variantes live, §8 **table de troubleshooting** (5 symptômes : CSP block, throttle background, CORS, fonts Shadow DOM, contraste), §9 npm planifié (lien `versioning §7.2 (4)`). Cross-refs vers `analog-clock`, `manifesto §16.5`, `SECURITY.md §5`.
- **`code.html` (EN + FR) blindage (~180 lignes chacune)** : §1 install (vendor `curl` aujourd'hui, `pip`/`npm` planifiés v1.0 cf. `versioning §7.2 (4)`), §2 quick usage Python ET JavaScript, §3 **conformance one-liner Docker** (3 commandes : unittest discover, `node tests/test_vectors.mjs`, combinée + Hypothesis), §4 **table de structure des modules** (Python core + multi-planetary + 5 bridges + JS core + Web Component avec cross-refs spec), §5 **statut Rust/Go** (planifiés v1.0 cf. ROADMAP V1.0-B), §6 source Python complet inliné (inchangé). Cross-refs vers `manifesto §16.5`, `versioning §2/§7.2 (3)(4)`, `GOVERNANCE.md §8.1`.
- **`timeline.html` (EN + FR) blindage (~280 lignes chacune)** : **17 événements reçoivent chacun une source URL** (Wikipedia EN/FR + manifeste §2 + conventions §1.1/§1.2 pour les 3 conventions ATS). Section « selection criteria » (4 critères : sourcé, instant vérifiable, lisibilité civilisationnelle, ancrage relatif Δ 0) ajoutée en intro. **Section « disclosure des sous-représentations »** (Asie, Afrique, post-1990, événements anti-civilisationnels) ajoutée en sortie, avec cross-refs `philosophy §1` + `comparison.md` + lien `CONTRIBUTING.md` pour PR. Nouveau CSS `.src`, `.src.computed`, `.criteria`, `.disclosure`. FR = traduction symétrique avec sources Wikipédia francophones quand disponibles.
- **`age.html` (EN + FR) blindage (~280 lignes chacune)** : **section « Privacy notice »** (5 garanties : no data leaves browser, no analytics/tracking/cookies, persistence opt-in (pas de `localStorage`), .ics local, CSP `connect-src` interdit l'exfiltration) ajoutée juste sous le h1. **Section « How the ATS age is computed »** explicitant la formule `Δd_age = Δ_now − Δ_self` avec cross-ref `conventions §4.1` (instant vs durée) et `manifesto §11`. **Section « .ics export format »** documentant les 9 champs RFC 5545 (PRODID, VERSION, CALSCALE, METHOD, UID déterministe, DTSTAMP, DTSTART/DTEND VALUE=DATE, SUMMARY, DESCRIPTION) + compatibilité (Apple Calendar, Google Calendar, Outlook, Thunderbird). Logique JS du calcul et de l'export inchangée (déjà correcte).
- **`dials.html` / `cadrans.html` blindage (~230 lignes chacune)** : encadré « Why look at both side by side / Pourquoi les regarder côte à côte » ajouté sous le h1 (2 questions : combien de jour reste-t-il, quelle proportion une tâche a-t-elle consommée — cross-ref `philosophy §2.3`). **Section « Reading guide »** : tableau 5 lignes contrastant 24h et 10 Blocs pour les questions du quotidien (heure courante, reste-t-il, mi-journée, %, normes culturelles). **Section « Short history of decimal time »** citant le **temps décimal républicain français 1793** (cross-ref `philosophy §4.1`) et **Swatch Internet Time 1998** (cross-ref `comparison §4.1`), avec les 3 axes par lesquels ATS diffère (calendrier en plus, époque fixe non liée à un fuseau, freeze post-v1.0 cf. `versioning.md`). Footer pointant vers `analog-clock` (annexe) et la home avec les 5 aiguilles.
- **`lighthouse/README.md` polish (~100 lignes)** : intro « internal documentation » explicite avec lien direct vers `versioning §7.2 (7)` (requirement v1.0 fermé en v0.7). Nouveau tableau **« Role in the project »** (3 surfaces : CI gate, qualitative capture, full local pass) avec lien direct vers `.github/workflows/lighthouse.yml`. Note Apple Silicon étoffée : positionne explicitement la CI Linux comme « canonical path » (les scripts locaux ne sont pas la gate de régression). Section « See also » finale liant le workflow CI + `versioning §7.2 (7)` + `ROADMAP V1.0-D`.
- **`CONTRIBUTING.md` création (~160 lignes)** : fichier neuf — §1 scope (spec/code/bridges/site/tooling/tierces impls), §2 où démarrer (issues, Discussions, RFCs vs Ideas), §3 setup local **Docker only** (CLAUDE.md global rule — pas de pip/npm install local), §4 lancer les tests (4 commandes Docker one-liner : core, JS, Hypothesis, perf bench), §5 **procédure RFC** (pointe vers `versioning §6`, ne redocumente pas), §6 code style (ruff Python, ESLint planifié JS), §7 traduction (EN authoritative + FR symétrique en même PR), §8 commit messages (conventional commits + CHANGELOG obligatoire), §9 cross-refs (GOVERNANCE/SECURITY/versioning/manifesto/ROADMAP), §10 licence (MIT code / CC-BY-4.0 docs, pas de CLA).

---

## [0.7.0] — 2026-06-14

### Audit & harmonisation
- **Versions alignées** : `manifesto.{en,fr}.md`, `multi-planetary.{en,fr}.md`, `pyproject.toml`, `code/ats_multi_planetary.py`, README et tous les footers HTML (28 pages) passent à **v0.7.0**. Le manifeste annonçait encore v0.5 alors que le format court v0.7 était en prod ; le multi-planétaire passe de `v0.7-rc1` à `v0.7` normatif.
- **CSP durcie** : retrait de `'wasm-unsafe-eval'` sur les 4 pages (`{fr,en}/{faq,manifesto|manifeste}.html`) où aucun WASM n'est chargé.
- **A11y carte** : `:focus-visible` restauré sur `.cities-pin` (l'outline était écrasé), hits des trigrammes horloge agrandis de r=14 à r=18 (touch target), hauteur min du slider Cités passée à 44 px.
- **Thèmes** : couleurs `.cities-pin[data-state="…"]`, Beat/Blink, erreurs passées de hex codés en dur à `color-mix(in oklab, … CanvasText/Canvas)` pour respecter dark mode + thèmes terminal/aquarelle/néon.
- **Refactor** : `getTzOffsetMin()` extrait en util partagé `tz-utils.js` (était dupliqué entre `clock-page.js` et `cities-page.js`). `_US_PER_DAY` réutilisée dans `ats_multi_planetary.py`. Regex `_ATS_SHORT_RE` durcie (refuse l'espace en bordure).
- **HTML polish** : `data-lang` ajouté sur ~10 pages où il manquait, `rel="noopener"` sur tous les liens externes, `lang-switch` de `fr/index.html` désormais explicite (`../en/index.html`).
- **Process** : section `## [0.7.0]` créée (le CHANGELOG n'avait pas de release officielle v0.6.0 → v0.7.0 documentée). `pages-build` workflow GitHub Actions ajouté pour garantir `render-md.mjs` avant deploy. `spec_version` ajouté à `now.json`. Validateur `cities.json` ajouté au CI (codes uniques, tz IANA valides, lat/lon bornés, ordre chronologique).

### Changed — Forme courte v0.7 : `Δ20.7.8.2-50.0` (suppression de l'espace, séparateur `-`, ajout du Milli)
**Rupture de format (sans rétrocompat).** L'ancienne forme `Δ K.H.D.Kin/cc` est remplacée par `ΔK.H.D.Kin-BC.M` :
- Plus d'espace entre `Δ` et le premier chiffre.
- Séparateur `-` entre la partie calendaire (`Kin`) et la fraction journalière (`BC`).
- Chiffre `Milli` ajouté après un `.` final, **toujours émis** même à zéro. La perte d'information résiduelle passe de ±14 min 24 s (Centi seul) à ±1 min 26 s (Milli).
- Le parseur court est désormais **strict** : la forme legacy `/cc` est refusée ; la conversion sans perte continue à passer par la forme canonique 5 chiffres.
- Champ `short` renommé en `display` dans `docs/spec/test-vectors.json` ; champ `ats_short` renommé en `ats_display` dans `docs/api/now.json` (et dans le workflow GitHub `cron-now.yml`).
- Spec mise à jour : `manifesto.{en,fr}.md` §5 + §10, `faq.{en,fr}.md`, `versioning.{en,fr}.md`, fragments `_rendered/*`, pages publiques `manifesto.html`/`manifeste.html`, `faq.html`, `code.html`. Toutes les en-têtes historiques du CHANGELOG ont été renormalisées au nouveau format (Milli inconnu rétroactivement → `.0`).

### Added — Mode focus + camembert au cadran analogique
Cliquer sur le trigramme d'une ville (PAR, NYC, …) sur le cadran analogique active un mode focus : les arcs des autres villes s'atténuent (opacity 0.25), un camembert apparaît au centre du cadran avec les 4 quartiers de la ville (matin/midi/après-midi/soir) ancrés sur ses 24 h locales (creux 22-08 transparent). Les quartiers s'étendent jusqu'au cercle principal (r=100) en très basse opacité (0.20), séparés par des lignes radiales fines à chaque frontière de période (08, 12, 14, 18, 22 h locales), de sorte que les 5 aiguilles (Bloc/Centi/Milli/Beat/Blink) conservent leur longueur d'origine et passent par-dessus. Le trigramme de la ville sélectionnée est mis en évidence sur la couronne (halo + code agrandis) — il n'y a plus de texte au centre du cadran. Sortie via re-clic, ESC, clic sur le fond, ou clic sur un autre trigramme (switch direct).

### Added — Page « Cités » : carte du monde en direct des activités quotidiennes
Nouvelle page `/{fr,en}/cities.html` qui projette ~40 capitales sur une carte du monde équirectangulaire (fond Natural Earth 110m simplifié, ~73 KB). L'emoji de chaque pastille évolue avec ce qu'il s'y passe localement à l'instant ATS courant : 🌙 sommeil, 🌅 réveil, 🥐 petit-déj, 🚇 trajet, 💼 travail, 🍽️ déjeuner, 🌆 soirée, 🍷 dîner, 📺 film TV. Au survol/toucher, un tooltip donne le nom, l'heure locale HH:MM, la tranche ATS `BC.M`, et le label de l'activité courante. Un slider permet d'explorer les 24 h UTC ; bouton « Maintenant » pour reprendre le direct. Les états sont dérivés d'une machine à 10 cas à partir des horaires culturels par ville (`docs/assets/data/cities.json`, lat/lon + horaires médians régionaux). Lien dans la barre de navigation du site.

### Changed — Palette des villes redistribuée pour éviter les voisins de même teinte
Anciennement, l'ordre des couleurs suivait l'arc-en-ciel sur l'ordre géographique (LA rouge → … → TKO rose), ce qui plaçait trois cités vertes/bleues côte à côte (PAR vert, JER sarcelle, DXB cyan). Nouvelle attribution par saut de 3 sur la roue chromatique : LA rouge, NYC vert, LDN violet, PAR orange, JER sarcelle, DXB rose, BJG or, TKO cyan. Écart minimal entre voisins : 75° (DXB rose → BJG or), aucun cluster de teinte. La légende sous le cadran et les halos suivent automatiquement la nouvelle attribution.

### Changed — Halos des trigrammes de villes : couleur de l'arc au lieu de blanc
Les pastilles circulaires portant le code 3 lettres de chaque ville (LA, NYC, LDN, PAR, JER, DXB, BJG, TKO) sur le cadran analogique reprennent désormais la couleur de leur arc de jour (rouge, orange, or, vert, sarcelle, cyan, violet, rose). La couleur du texte est calculée automatiquement (noir ou blanc) en fonction de la luminance YIQ du fond, pour préserver la lisibilité dans tous les thèmes. Helper `pickContrastText(hex)` ajouté dans `clock-page.js` ; la règle CSS `.city-halo` ne porte plus que l'opacité (la couleur de fond est posée inline par élément).

### Fixed — Horloge analogique : Blink ne tournait pas dans Chromium + lecture pédagogique colorée
- **Bug Chromium** : l'aiguille Blink était initialement implémentée comme un `<g>` enveloppant la ligne et le disque décoratif. Chrome ne re-peignait pas le groupe quand son `transform` était mis à jour via `setAttribute` à 10 Hz (Safari fonctionnait correctement). Restructuration en **éléments frères** : `<line id="hand-blink">` + `<circle id="hand-blink-dot">`, tous deux pivotés indépendamment par le contrôleur. Plus de groupe, plus de bug.
- **Lecture pédagogique colorée** : `Bloc · Centi · Milli · Beat · Blink` sous le cadran utilise désormais le même code couleur que les aiguilles (`var(--fg)`, `var(--accent)`, atténué, vert, rouge). Nouvelles classes CSS `.ats-readout .u-bloc/.u-centi/.u-milli/.u-beat/.u-blink` dans `style.css` ; spans correspondants ajoutés dans `clock-page.js`.
- Mise à jour de la spec `analog-clock.{en,fr}.md` §5 : note explicative sur la structure ligne+disque (vs `<g>`) et le bug Chromium.

### Changed — Horloge analogique : 5 aiguilles et convention horlogère classique (spec v0.2)
Refonte visuelle du cadran analogique de la page d'accueil (`/fr/`, `/en/`) :

- **Ajout des aiguilles Beat (≈ 8,64 s) et Blink (≈ 0,864 s)** sur le cadran — auparavant absentes, présentes uniquement dans la lecture pédagogique. Le cadran représente désormais les 5 décompositions du jour (`Bloc · Centi · Milli · Beat · Blink`).
- **Inversion des longueurs** pour suivre la convention horlogère grégorienne : l'aiguille la plus lente (Bloc) devient la plus courte (40), la plus rapide (Blink) devient la plus longue (95). Progression : Bloc 40 → Centi 55 → Milli 70 → Beat 82 → Blink 95.
- **Décoration Blink** : petit disque plein (`r=3`) à 80 % de la longueur de l'aiguille (en `y=-76`), inclus dans le même groupe SVG `<g id="hand-blink">` pour pivoter avec elle. Évoque la bague de pointe d'une trotteuse.
- **Couleurs étendues** : Beat en `#2bb673` (vert), Blink en `#ff5a5a` (rouge trotteuse). Progression froid → chaud renforce la lecture de vitesse.
- **Lecture de date `Δ K.H.D.Kin` déplacée** de `(0, 64)` (sous le pivot) à `(0, -50)` (à mi-chemin entre le `0` du sommet et le pivot), libérant la moitié inférieure pour les nouvelles aiguilles longues.
- **Mode strict étendu** : la case `strictAnalog` du panneau `<details>` fait désormais sauter Milli, **Beat et Blink** ensemble (au lieu de Milli seule).
- **Limite documentée** : Blink se rafraîchit naturellement toutes les 864 ms (résolution native de `frac`) ; en mode non strict, le mouvement reste donc semi-saccadé à 10 Hz. Une interpolation sous-tick est autorisée par la spec mais non implémentée.
- **Mise à jour de la spec** `docs/spec/analog-clock.{en,fr}.md` v0.1 → **v0.2** : §2 (Beat/Blink désormais affichés), §3 (position de la lecture date), §4 (nouveau tableau d'aiguilles + nouvelle convention de longueur), §5 (formules Beat/Blink), §6 (lecture centrale), §7 (politique de mouvement et limite Blink), §8 (5 angles à recalculer).
- **a11y** : `aria-label` du `<svg>` mis à jour en EN et FR pour mentionner « 5 aiguilles (Bloc, Centi, Milli, Beat, Blink) ».

Aucune modification du cœur `ats.js` ni des vecteurs de conformance — l'évolution est purement cosmétique côté affichage.

### Fixed — Tests bridges plus jamais skip silencieux
Application de la méthode systematic-debugging (cause racine d'abord). Le baseline `python -m unittest discover tests` montrait **6 tests skipped** ; trois causes distinctes identifiées et corrigées en cascade :

1. **`tests/test_bridges.py`** : la classe mixin `_BridgeRoundTrip` héritait de `unittest.TestCase`, donc unittest la découvrait comme une vraie classe de test et déclenchait un skip cosmétique « base class ». Refactor en mixin pur (sans héritage `TestCase`), les concrete classes utilisent l'héritage multiple `class TestXBridge(_BridgeRoundTrip, unittest.TestCase)`. Le test loader ne voit plus que les 5 vraies classes.
2. **`pyproject.toml`** : setuptools 80+ refusait `pip install .[bridges]` avec « Multiple top-level packages discovered in a flat-layout: ['code', 'archive', 'lighthouse'] ». Ajout d'un bloc explicite `[tool.setuptools]` (`package-dir = {"" = "code"}`, `py-modules = ["ats", "ats_multi_planetary"]`, `packages = ["bridges"]`) + `[build-system]` (setuptools ≥ 70). L'install fonctionne maintenant proprement.
3. **`.github/workflows/ci.yml`** : la matrice Python n'installait jamais l'extra `[bridges]`, donc les 5 tests calendaires skippaient en CI sans jamais valider les ponts en conditions réelles. Nouvelle étape « Install project with [bridges] extra » qui installe `convertdate` + `lunardate` avant la conformance. Le risque caché de bugs jamais détectés par CI disparaît.

**Avant** : `Ran 14 tests in 0.005s — OK (skipped=6)`
**Après** : `Ran 19 tests in 0.010s — OK` (0 skipped, 50 vecteurs de ponts effectivement validés).

### Added — Extension multi-planétaire (V1.0-A)
- **`docs/spec/multi-planetary.{en,fr}.md`** — annexe **normative** v0.7-rc1 qui généralise l'ATS à d'autres corps célestes :
  - **Mars** : ancré sur **Mars Pathfinder (1997-07-04T16:56:55Z)** ; sol = **88 775,244147 s** (Allison & McEwen 2000). Δ_Mars `0.0.0.0.00000` = touchdown ; 2026-06-13T12:00Z = `T+ Δ_Mars 10.2.8.7.96477`.
  - **Lune** : époque **partagée avec la Terre** (1969-07-20T00:00:00Z) ; jour synodique = **2 551 442,8128 s** (IAU). 1 Δ_Moon ≈ 29,53 Δ_Earth.
  - **Cadre générique** `Δ_X(epoch, day_seconds)` permettant aux implémentations tierces d'ajouter Vénus, Jupiter, etc.
  - **Notation** : ASCII `Δ_Earth/_Mars/_Moon` (canonique) + symbolique `Δ⊕/♂/☾` (UI). Bare `Δ` = `Δ_Earth` (rétro-compatible v0.6).
  - **Comparaisons inter-corps** : indéfinies ; algèbre §11.4 préservée **par corps**, conversion via le pont UTC pour comparer.
  - **Annexe non-normative** §8 : décalage relativiste lunaire (~58,7 µs/jour) sous la précision 5 chiffres ; documenté.
  - **Gel post-v1.0** : Mars et Lune intégrées aux §3 gels de `versioning.md`. Corps tiers restent libres.
- **`code/ats_multi_planetary.py`** : dataclass `Body(suffix, symbol, epoch, day_seconds)` + singletons `EARTH`, `MARS`, `MOON`. Classe `BodyATSDateTime` avec algèbre Δ/Δd préservée et **garde-fou TypeError** sur arithmétique/comparaison inter-corps. Parser canonique `body_canonical_to_utc()` qui résout le suffixe via registre. Réutilise `_split_abs_days_floor` et `_integer_days_to_places` existants — zéro impact sur `code/ats.py`.
- **Vecteurs de conformance** :
  - `docs/spec/test-vectors-multi-planetary-mars.json` — 10 instants (époque Pathfinder, Curiosity, fin 13ᵉ baktun maya, InSight, Perseverance, 2050).
  - `docs/spec/test-vectors-multi-planetary-moon.json` — 10 instants (époque Apollo 11 day-start, touchdown Eagle, premier pas Armstrong, Unix epoch, Chang'e 3, Artemis I splashdown).
  - Les deux portent `spec_version: "0.7"` (compatible v1.0 par construction).
- **Tests** : `tests/test_multi_planetary.py` — 8 cas (round-trip Mars 10/10, Lune 10/10, algèbre per-body, garde-fou cross-body, Body tierce ad-hoc).
- **Pages HTML** : `docs/{fr/multi-planetaire,en/multi-planetary}.html` — wrappers complets (CSP, OG, Twitter Card). `scripts/render-md.mjs` étendu, Pagefind index reconstruit. Page `test-vectors.html` ajoute les 2 nouveaux jeux.
- **Manifeste §14** (FR + EN) cite la nouvelle annexe normative.

### Added — Engagement de stabilité (pré-v1.0)
- **`docs/spec/versioning.{en,fr}.md`** : nouvelle **annexe normative** qui codifie le contrat SemVer + les **7 gels post-v1.0** (époque, format canonique, format court, troncature, algèbre §11.4, format binaire §12, 12 vecteurs core). Briser l'un d'eux exigera un projet distinct (ATS 2) avec une nouvelle époque. Politique de vecteurs additifs seulement. Processus RFC léger via GitHub Discussions (2 semaines min de commentaires publics, BDFL tranche).
- **`SECURITY.md`** : politique de divulgation responsable. Canal préféré GitHub Security Advisories + email backup. SLA : ack 72 h, triage 7 j, fix high ≤ 30 j / moderate ≤ 90 j. Scope explicite (spec sémantique, code Python + JS, site, SW, CI).
- **`GOVERNANCE.md`** : modèle BDFL (Sylvain) jusqu'à v1.0 + adoption mesurable, puis transition vers steering committee de 3–5 membres. Distinction process éditorial (PR review) vs spec change (RFC requis). Post-v1.0 les RFCs qui violent les gels sont auto-rejetées.
- **`spec_version: "0.6"`** ajouté à la racine des **7 fichiers** `docs/spec/test-vectors*.json`. Les consommateurs détectent désormais explicitement la spec contre laquelle un jeu de vecteurs a été produit.
- **Manifeste §14** (FR + EN) cite `versioning.md` comme annexe normative.

## [0.6.0] — 2026-06-13 (Δ20.7.8.2-48.0)

### Added — Recherche statique Pagefind (§5.3)
- **Index Pagefind** dans `docs/_pagefind/` (~900 KB, généré au build via `docker run --rm -v "$PWD:/app" -w /app/docs node:20-slim sh -c "npx --yes pagefind --site . --output-path _pagefind"`) — 25 pages indexées sur 2 langues (FR + EN), 3 199 mots distincts.
- **`docs/.nojekyll`** : créé pour désactiver Jekyll sur GitHub Pages (Jekyll ignore par défaut les dossiers `_*`, ce qui aurait masqué `_pagefind/`).
- **`docs/assets/js/search.js`** : wrapper minimal autour de Pagefind, lazy-loading (le module ne se charge qu'au premier focus pour ne pas peser sur les autres pages). Auto-injection du champ de recherche en haut de `<main>` si la page charge le script sans déclarer `<div id="ats-search">`. Style auto-injecté qui suit les variables de thème.
- **Activation** : FAQ et Manifeste (FR + EN) chargent `search.js`. La CSP de ces 4 pages est étendue avec `'wasm-unsafe-eval'` dans `script-src` (Pagefind utilise WebAssembly).
- **README** : nouvelle section « Recherche statique (Pagefind) » avec la commande Docker complète.

### Added — Thèmes alternatifs + Konami code (§5.7, §5.8)
- **3 nouveaux thèmes alternatifs** via `:root[data-theme="…"]` dans `style.css` :
  - **Terminal** : noir `#0c0c0c` / vert phosphor `#33ff33`, police mono globale, glow texte sur les éléments actifs.
  - **Aquarelle** : pastel délavé `#fdfaf3` / bleu-gris `#3d4a5a`, accent lavande `#7a8bc4`.
  - **Néon** : noir profond `#0a0a14` / blanc cassé `#e0e0e8`, accent magenta `#ff2bd6` avec glow sur les liens actifs.
- **Toggle thème** (§1.2) étendu : cycle `auto → light → dark → terminal → aquarelle → neon → auto`. Glyphes `⊙ ☼ ☾ ⌨ ❀ ⚡`. Labels FR/EN ajoutés.
- **§5.7 Easter egg Konami** : `site.js` écoute la séquence `↑↑↓↓←→←→BA` (insensible à la casse pour B et A). Au déclenchement, `window.__atsKonami = true` + classe `body.konami` pour 30 s. Dans `clock-page.js`, `liveTick()` détecte les bords de Beat (`frac/10`, soit ~8,6 s par Beat) et spawn 12 emoji confetti (`Δ ✦ ◉ ✺ ✧ ⌬`) en CSS animation 1.6 s. Non-documenté (easter egg).

### Added — OG image PNG (§5.2)
- **`docs/assets/og-card.png`** : version PNG 1200×630 (~142 KB) rendue depuis `og-card.svg` via `docker run --rm -v "$PWD:/app" dpokidov/imagemagick -density 200 og-card.svg -resize 1200x630 og-card.png`. Le SVG reste conservé.
- **25 pages HTML** mises à jour : `og:image` et `twitter:image` pointent désormais sur le PNG (LinkedIn et FB rendaient mal le SVG). Fix appliqué via `sed -i` sur tout `docs/**/*.html`.

### Added — Page « Vecteurs de conformance » (§5.5)
- **`docs/{fr,en}/test-vectors.html`** : nouvelle page interactive qui charge les 7 fichiers `docs/spec/test-vectors*.json` (12 core + 12 arithmétique + 5 × 10 ponts) et les rend en tables filtrables avec boutons `Copy JSON` + `Copy canonical`. Recherche locale par dataset. Fonctionne offline (déjà cachée par le Service Worker).
- **`docs/assets/js/test-vectors-page.js`** : controller bilingue FR/EN, lazy-fetch (un dataset manquant n'empêche pas les autres de s'afficher), copie clipboard avec toast.
- **CSS** : nouveaux styles `.vec-card`, `.vec-filter`, `.vec-table`, `.vec-canonical`, `.vec-actions` qui respectent les variables `--bg/--fg/--accent` (compatibles avec les thèmes light/dark + futurs thèmes alternatifs).

### Added — Snapshot `/api/now.json` (§5.4)
- **Workflow GitHub Actions `.github/workflows/cron-now.yml`** : cron `0 * * * *` (horaire) régénère `docs/api/now.json` via `python` inline (sans dépendance) et commit+push si changement. Concurrency group dédié, `permissions: contents: write`.
- **`docs/api/now.json`** : structure publique stable — `{ utc, ats_canonical, ats_short, integer_days, fraction_5digit, generated_at, cadence_minutes, note }`. URL publique GH Pages : `https://s-geffroy.github.io/ATS/api/now.json`.
- **README** : nouvelle section « Endpoint snapshot `/api/now.json` » avec un schéma d'exemple et la limite explicite « pas un endpoint live ».
- Fichier seed commité avec l'instant actuel pour qu'il existe avant le premier cron.

### Added — PWA installable (§3.2, §5.6)
- **`docs/manifest.webmanifest`** : nom court « ATS », nom long « Δ ATS — Apollonian Time System », `start_url=/ATS/fr/`, `scope=/ATS/`, `display=standalone`, `theme_color=#4a6cff`, `background_color=#0b0f17`. 5 icônes déclarées : SVG vectoriel + PNG 192/512 (any) + PNG 192/512 (maskable, fond `#0b0f17`).
- **`docs/assets/icon.svg`** : Δ blanc sur fond `#0b0f17`, anneau d'accent `#4a6cff`. ViewBox 512×512.
- **`docs/assets/icon-{192,512}.png`** + **`icon-{192,512}-maskable.png`** : générés via `docker run --rm -v "$PWD:/app" dpokidov/imagemagick -density 600 icon.svg -resize …`.
- **`docs/sw.js`** : `CACHE_NAME='ats-v0.6.0'`. Install pré-cache la coquille (FR + EN index, style.css, 4 JS, icon.svg). Fetch handler : cache-first sur `/assets/`, network-first sur HTML avec fallback offline sur `/fr/`. Activate sweep des anciens caches.
- **`site.js`** étendu :
  - `injectPwaTags()` (idempotent) ajoute `<link rel="manifest">`, `<link rel="icon">` SVG, `<link rel="apple-touch-icon">` PNG 192 sur les 21 pages — détection du préfixe `/ATS/` vs `/`.
  - `registerServiceWorker()` enregistre `/sw.js` (scope `/ATS/` sur GH Pages) et écoute les messages `ATS_BIRTHDATE_QUERY` pour répondre depuis `localStorage['ats-birthdate']`.
- **§5.6 Background Sync Kilo-versaires (best-effort)** : `sw.js` écoute l'event `periodicsync` (tag `ats-kilo-versaire-check`). Si Chrome desktop/Android avec PWA installée + permission `periodic-background-sync` accordée, le SW interroge un client ouvert pour récupérer `ats-birthdate`, calcule le Δd vers le prochain Kilo-versaire, et déclenche `showNotification` si ≤ 2 jours. **Limites documentées** : pas de backend, Chrome-only, nécessite une fenêtre ouverte récemment pour l'aller-retour de message. Fallback in-page reste prévu dans `age.html`.

### Added — Ponts calendaires (§2.3, §5.1)
- **Architecture commune** : `code/bridges/__init__.py` introduit le pont RD (Rata Die = `datetime.date.toordinal()`) ↔ ATS. Chaque calendrier expose `to_ats(*date_tuple) → ATSDateTime` et `from_ats(ats) → tuple`. Les conversions sont ancrées sur le **début du jour UTC** (les calendriers travaillent en dates, pas en instants).
- **Dépendances optionnelles** : nouveau groupe `bridges` dans `pyproject.toml` — `convertdate>=2.4` (Hebrew, Islamic, Maya, Indian civil) + `lunardate>=0.2` (Chinois). Le cœur ATS reste sans dépendance.
- **§2.3a Hebrew** : `code/bridges/hebrew.py` (wrapper Reingold/Dershowitz via `convertdate.hebrew`). Format date : `(year, month, day)` 1..13 en année embolismique. `docs/spec/test-vectors-bridges-hebrew.json` — 10 vecteurs (Rosh Hashanah, Pesach, Hanukkah, Yom Kippur, Tisha B'Av, année embolismique 5782 avec Adar II, jalons 5500 et 6000).
- **§2.3b Islamic (tabulaire Kuwaiti)** : `code/bridges/islamic.py` via `convertdate.islamic` (type II, variante par défaut). 10 vecteurs (Hijra, Ramadan 1444, Eid al-Fitr 1444, Eid al-Adha 1445, jalons 800/1300/1430/1500 AH).
- **§5.1a Chinese (lunisolaire HKO)** : `code/bridges/chinese.py` via `lunardate` (tables HKO 1900–2100). Format date : `(year, month, day, leap_month)`. 10 vecteurs (Nouvel An lunaire 2024/2025, Fête de la mi-automne, Dragon Boat, jalons 1950/1990/2000/2050/2099).
- **§5.1b Hindu / Indian National (Saka)** : `code/bridges/hindu.py` via `convertdate.indian_civil`. Calendrier civil moderne adopté en 1957 (solaire, 12 mois Chaitra…Phalguna). 10 vecteurs (Saka 1879 = Republic Day, jalons 1880–2000). Note documentée : différence avec le Sūrya Siddhānta lunisolaire classique (qui nécessite des tables panchanga régionales).
- **§5.1c Maya Long Count (GMT 584283)** : `code/bridges/maya.py` via `convertdate.mayan`. Constante de corrélation **584 283** retenue (ISO 19108 / Goodman-Martínez-Thompson). Format `(baktun, katun, tun, uinal, kin)`. 10 vecteurs (fin du 13ᵉ baktun = 2012-12-21, today, jalons LC 9.0.0.0.0 à 14.0.0.0.0). Les dates pré-an 1 CE proleptique sont rejetées (limite de `datetime.date` en Python).
- **Tests** : `tests/test_bridges.py` charge les 5 jeux de vecteurs (50 cas) ; skip propre si la dépendance manque. CI étend `unittest discover tests`.

### Différé — UI dropdown calendrier source (Hors-roadmap)
- Le dropdown calendrier source dans `clock-page.js` est **reporté** : porter `convertdate.{hebrew,islamic,mayan,indian_civil}` + `lunardate` en JS représente un travail substantiel (tables HKO 1900–2100 + algorithmes Reingold/Dershowitz). Les ponts Python sont opérationnels et testés ; l'UI sera ajoutée dans une session ultérieure.
- **Tests** : `tests/test_bridges.py` (skip propre quand la dépendance manque) — round-trip Hebrew 10/10.

### Added — Annexe conventions non-normative (§2.2)
- **`docs/spec/conventions.{en,fr}.md`** : annexe explicitement étiquetée **non-normative** (citée header dans une blockquote « Annexe non-normative — décrit, non exigé »). Couvre : Kilo-versaire (`Δ K.0.0.0`), Hecto-fête (`Δ K.H.0.0`), Deka-jour, rythme 7+3 sur la Deka, bandes solaires 08–22 (matin/midi/après-midi/soir avec styles d'arc dédiés), compteurs égocentrés, jalons rituels (Δ 100, Δ 1000, Δ 10000, Δ 20000, Δ 50000).
- **Pages HTML** : nouveaux wrappers `docs/{fr,en}/conventions.html` (mêmes meta, OG, Twitter cards que les autres pages spec). **Non ajoutés à la nav** (déjà 10 entrées) — accessibles via §14 du manifeste et lien sous l'article.
- **Manifeste §14** mis à jour (FR + EN) : nouvelle entrée « Conventions (annexe non-normative) — décrit, non exigé ».
- **`scripts/render-md.mjs`** : `TARGETS` étendu aux 2 nouvelles pages. Le pipeline reste idempotent.

### Added — Algèbre Δ/Δd (Vague 2 — §2.1, spec §11.4)
- **Spec §11.4 « Algèbre des durées »** ajoutée à `manifesto.{en,fr}.md` : signatures formelles `Δ+Δd→Δ`, `Δ−Δ→Δd` (signée), `Δd+Δd→Δd`, `Δd × n`, `Δd ÷ n`, `−Δd`, `|Δd|`. Comparaisons `<,≤,=,≥,>` définies sur `Δ` (compteur signé, T- < T+) et sur `Δd`. La comparaison `Δ ↔ Δd` reste explicitement indéfinie.
- **§11.1–11.3 amendées** : les durées sont désormais **signées** (forme canonique `T± Δd K.H.D.Kin.fffff`). L'ancien `|Δd|` reste accessible via `abs()`. Pas de breaking sur les 12 vecteurs `test-vectors.json` originaux.
- **`code/ats.py`** : nouvelle dataclass `ATSDuration(signed_days: Decimal)` (frozen) avec `__add__/__sub__/__mul__/__truediv__/__neg__/__abs__` et comparateurs. Sur `ATSDateTime` : `__add__(Δd)→Δ`, `__sub__(Δ)→Δd`, `__sub__(Δd)→Δ`, et `<,<=,==,>=,>`. Helper interne `_signed_decimal_days()` + `_ats_from_signed_days()`. `T+ 0 == T- 0` est respecté.
- **`docs/assets/js/ats.js`** : portage Number (float64) — `ATS.dur(n)`, `ATS.durToCanonical`, `ATS.durFromCanonical`, `ATS.add/sub` polymorphiques, `ATS.mul/div/neg/abs`, `ATS.cmp/lt/le/eq/gt/ge`. Précision documentée : ~15 chiffres significatifs (vs Decimal exact côté Python).
- **Vecteurs** : `docs/spec/test-vectors-arithmetic.json` — 12 cas couvrant les 7 opérations + carry Kin→Deka, carry jusqu'au Kilo, franchissement d'époque (T+→T-), comparaisons inter-signes.
- **Tests** : `tests/test_arithmetic.py` (Python, 4 sub-tests) et `tests/test_arithmetic.mjs` (JS, 15 assertions). Les deux suites se chargent depuis le même JSON.
- **CI** : matrice étendue à `unittest discover tests` (Python) et `node tests/test_arithmetic.mjs` (JS). Check « pages structure » exige désormais `test-vectors-arithmetic.json`.

### Changed — Pré-rendu Markdown (§1.1)
- **8 pages MD pré-rendues au build** (`manifeste`/`philosophie`/`comparaison`/`faq` × FR + EN). Le HTML rendu est inliné directement dans les pages — plus aucun `<script src=".../marked@13.0.3">` ni `<script src=".../dompurify@3.2.4">` en CDN, plus aucun `fetch('../spec/*.md')` au runtime.
  - Script de build : `scripts/render-md.mjs` (Node 20 ESM + `marked@13` + `isomorphic-dompurify`), exécuté via Docker — `docker run --rm -v "$PWD:/app" -w /app/scripts node:20-slim sh -c 'npm install --silent && node render-md.mjs'`. Idempotent (marqueur `<!-- ATS:INLINE <source.md> -->` détecté pour ré-exécution).
  - Fragments dans `docs/spec/_rendered/*.html` pour usages tiers.
  - **CSP resserrée** sur ces 8 pages : `cdn.jsdelivr.net` retiré de `script-src` et `style-src` (plus utile). Les autres pages (code.html, dials.html) conservent leur CSP existante (Prism reste en CDN).
  - Diff transfert (gzip estimé, première visite) : `~36 KB → ~8 KB` par page MD (élimination de marked/dompurify CDN + round-trip fetch MD). Mesure complète via `lighthouse/capture-baseline.sh` (`baseline-v0.5.json` → `v0.6.0.json`).
- **§1.4‑post Baseline v0.6.0** : `lighthouse/v0.6.0.json` capture l'état post‑§1.1 — `has_runtime_md_fetch=false`, `has_inlined_md=true` pour les 8 pages.
- **README** : nouvelle section « Régénérer les pages Markdown ».

### Added — Mesure & qualité (Vague 1)
- **§1.4 Harness Lighthouse + baseline qualitative v0.5** : nouveau répertoire `lighthouse/` avec deux outils :
  - `capture-baseline.sh` (toujours opérationnel, sans Chrome) : capture les métriques d'architecture reproductibles (poids HTML par page, scripts CDN chargés, présence du marqueur `<!-- ATS:INLINE -->`, poids des sources Markdown, payloads CDN raw + gzip).
  - `run-lighthouse.sh` (Docker, x86_64) : harness Lighthouse complet (Performance/SEO/Best Practices/PWA) sur 4 pages × mobile + desktop via `femtopixel/google-lighthouse`.
  - `baseline-v0.5.json` : capture initiale. État : 8 pages chargent `marked@13.0.3` (38 701 B raw / 11 618 B gzip) + `dompurify@3.2.4` (22 216 B raw / 8 500 B gzip) depuis CDN + fetch runtime du `.md` source.
  - Note d'environnement : `femtopixel/google-lighthouse` est `linux/amd64` only ; sur Apple Silicon le tab Chrome crashe en émulation. Le harness Docker tourne sur Linux/x86 CI ; la baseline qualitative reste portable.

### Added — Quick wins UX (Vague 1)
- **§1.3 Permalien `?face=`** : le paramètre URL `face=numeric|analog` impose la face au chargement, **sans persister** dans `localStorage`. Un permalien partagé ne réécrit donc plus la préférence du destinataire. Le paramètre est nettoyé de l'URL au retour en mode live (`goLive()`). Fichier : `docs/assets/js/clock-page.js`.
- **§1.2 Toggle de thème** : nouveau bouton dans le header (à côté du `lang-switch`) qui cycle `auto → light → dark → auto`. Choix persisté dans `localStorage['ats-theme']`. Mode `auto` (défaut) suit `prefers-color-scheme` via `color-scheme: light dark`. Modes `light`/`dark` forcent une palette explicite via `:root[data-theme="…"]`. Glyphes `⊙/☼/☾`. Fichiers : `docs/assets/js/site.js`, `docs/assets/css/style.css`. *Note : `site.js` étant chargé en `defer`, un léger flash peut apparaître au premier rendu — trade-off accepté pour v0.6.0.*

## [0.5.0] — 2026-06-13 (Δ20.7.8.2-50.0)

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

## [0.3.2] — 2026-06-12 (Δ20.7.8.0-65.0)

### Added
- **8e ville** (Dubaï, UTC+4, sans DST) sur le cadran analogique — 8 villes au total, ordonnées Ouest → Est sur 2 lignes de 4 dans la légende.
- **Unités micro** : nouvelle section dans `<details>` à côté des Unités macro, dans une grille à 2 colonnes (Macro à gauche, Micro à droite). Affiche les 5 sous-unités Bloc/Centi/Milli/Beat/Blink avec leur durée approximative. Sur mobile (< 600 px), les colonnes se replient en pile.

### Changed
- **Codes villes lisibles** : font-size `8` → `10`, `font-weight: 700`, opacité 100 %, halo (cercle `var(--bg)` opacité 0.92) derrière chaque code, position un peu plus à l'extérieur (radius +7 → +10).

## [0.3.1] — 2026-06-12 (Δ20.7.8.0-65.0)

### Added — Analog clock enrichments
- **Lecture ATS pédagogique** sous le cadran : `Bloc 6 · Centi 5 · Milli 4 · Beat 3 · Blink 7 (.65437)` — nomme chaque sous-unité du jour-fraction conformément au manifeste §4.3, plus la fraction canonique en parenthèses.
- **Arcs \"jouré active\"** de 7 grandes villes sur le pourtour extérieur du cadran (rayons 104-128, espacés de 4 u). Chaque arc s'étend de 8h à 18h local et est colorié en 3 tronçons : Matin 8-12h (jaune `#fbbf24`), Midi 12-14h (vert `#22c55e`), Soir 14-18h (orange `#f97316`).
- **Villes** : LA, NYC, LDN, PAR, JER, BJG, TKO. Initiales affichées au début de chaque arc (position 8h). Légende sous le cadran avec nom complet + offset UTC courant.
- **DST dynamique** via `Intl.DateTimeFormat` (`timeZoneName: 'longOffset'`) — les arcs des villes à DST (LA, NYC, London, Paris, Jerusalem) bougent de ±60 min selon la date ; Beijing et Tokyo restent fixes.
- **viewBox** élargi `-110 -110 220 220` → `-140 -140 280 280` pour loger les arcs.

## [0.3.0] — 2026-06-12 (Δ20.7.8.0-65.0)

### Added — Analog clock face
- **Spec** : `docs/spec/analog-clock.{en,fr}.md` — 3 aiguilles (Bloc 1×, Centi 10×, Milli 100×), rotation horaire, longueurs Bloc > Centi > Milli (ATS-natif), couleurs Bloc=fg / Centi=accent / Milli=atténué, lecture centrale `Δ K.H.D.Kin`, mouvement hybride (Bloc + Centi sautent, Milli continu).
- **Page d'accueil** (`/fr/`, `/en/`) : ajout d'un toggle segmenté `[Numérique | Analogique]` (`role="tablist"` ARIA, ←/→ pour basculer, choix sauvegardé dans `localStorage["ats-face"]`, défaut `numeric`).
- **SVG analogique** dans `face-analog` : cercle, 10 graduations majeures + 90 mineures générées en JS, étiquettes 0–9 au radius 76, 3 aiguilles + pivot + date interne (`Δ K.H.D.Kin`).
- **Mode strict** : case à cocher dans `<details>` (« Mode strict — Milli saute aussi ») qui force Milli à tronquer comme les deux autres aiguilles ; choix sauvegardé dans `localStorage["ats-strict-analog"]`.
- CSS : `.face-toggle`, `.face-panel`, `.analog-dial`, `.options` ajoutés à `style.css`.

## [0.2.2] — 2026-06-12 (Δ20.7.8.0-65.0)

### Added — Mobile navigation
- `docs/assets/js/site.js` : menu hamburger injecté automatiquement, état `aria-expanded`/`aria-controls`/`aria-label`, fermeture au clic sur un lien et à la touche `Esc`. Inclus sur les 21 pages.
- CSS : sous 600 px, la nav passe en colonne sous un bouton ☰ ↔ ✕ avec re-ordonnancement (brand · lang · hamburger sur le rang du haut, nav déroulée en dessous).

### Added — Security
- **SRI** sur tous les assets CDN : `marked@13.0.3`, `dompurify@3.2.4`, `prismjs@1.29.0` (core, python, prism-tomorrow). `integrity="sha384-…"` + `crossorigin="anonymous"`.
- **DOMPurify** : `marked.parse(md)` est désormais `DOMPurify.sanitize(marked.parse(md))` sur les 8 pages markdown (manifeste, philosophie, comparaison, FAQ × 2 langues).
- **CSP** (`<meta http-equiv="Content-Security-Policy">`) sur les 21 pages : `default-src 'self'; script-src + style-src 'self' + cdn.jsdelivr.net 'unsafe-inline'; img-src 'self' data:; connect-src 'self' raw.githubusercontent.com; object-src 'none'; base-uri 'self'; form-action 'self'`.

## [0.2.1] — 2026-06-12 (Δ20.7.8.0-65.0)

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

## [0.2.0] — 2026-06-12 (Δ20.7.8.0-65.0)

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

## [0.1.2] — 2026-06-12 (Δ20.7.8.0-63.0)

### Changed
- **Forme courte** : le chiffre `Kin` est désormais **toujours affiché** (même à zéro) pour préserver la référence calendaire. Les espaces autour de `/` sont supprimés à l'émission (`Δ20.7.8.0-63.0` au lieu de `Δ 20.7.8 / 63` — entrée renormalisée a posteriori au format v0.7).
- Les parseurs restent tolérants : les espaces autour de `/` sont acceptés à la lecture.
- Précision de décodage : ±~14 min 24 s (un Centi). L'incertitude de ±1 jour précédente disparaît (Kin était supposé `0`).
- Manifeste §5 et §10 (EN + FR) reformulés ; §13 mis à jour.
- `code/ats.py` : `to_short()` inclut Kin et supprime les espaces ; regex `_ATS_SHORT_RE` étendue pour matcher la nouvelle structure.
- `docs/assets/js/ats.js` : `toShort()` aligné.
- Pages `code.html` (FR + EN) : exemple mis à jour.

## [0.1.1] — 2026-06-12 (Δ20.7.8.0-61.0)

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
