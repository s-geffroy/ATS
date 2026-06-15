# ATS — Roadmap

Plan de travail consolidé pour les versions à venir. Les items sont indépendants sauf indication contraire — chaque "vague" peut être livrée seule.

**Légende effort** : XS (≤ 30 min) · S (≤ 2 h) · M (½ à 1 journée) · L (1–2 jours).
**Statut** : ✅ livré · 🟢 en cours · ⬜ à faire.

---

## Ce qui est livré (v0.6.0 → v0.7.0)

| Item | Vague | Effort | Statut |
|---|---|---|---|
| Pré-rendre le Markdown au build (`scripts/render-md.mjs`) | 1.1 | S | ✅ v0.6 |
| Permalien avec `?face=numeric\|analog` | 1.3 | XS | ✅ v0.6 |
| Audit Lighthouse qualitatif (`lighthouse/v0.6.0.json`) | 1.4 | S | ✅ v0.6 |
| Arithmétique des Δ et Δd formalisée + algèbre v0.6 §11.4 | 2.1 | S | ✅ v0.6 |
| Annexe `conventions.{en,fr}.md` (Kilo-versaire, Hecto-fête, etc.) | 2.2 | S | ✅ v0.6 |
| 5 ponts calendaires (`bridges/{hebrew,islamic,chinese,hindu,maya}.py`) | 2.3+ | M×5 | ✅ v0.6 |
| Annexe Multi-planétaire normative + `EARTH`/`MARS`/`MOON` | 3.1 / V1.0-A | M | ✅ v0.7 |
| PWA installable (`manifest.webmanifest` + `sw.js`) | 3.2 | M | ✅ v0.6 |
| Pagefind search (manifeste + FAQ) | 5 | S | ✅ v0.6 |
| Endpoint `/api/now.json` (cron GitHub Actions, `spec_version: "0.7"`) | 5 | M | ✅ v0.6 |
| Page Test vectors interactive | 5 | S | ✅ v0.6 |
| Easter egg Konami code → confetti | 5 | XS | ✅ v0.6 |
| **Forme courte v0.7 `ΔK.H.D.Kin-BC.M`** (rupture, parseur strict) | — | M | ✅ v0.7 |
| **Page Cités — carte du monde équirectangulaire** (~40 capitales) | — | M | ✅ v0.7 |
| **Mode focus + camembert** au cadran analogique | — | M | ✅ v0.7 |
| **Constructeur de villes personnalisées** (localStorage, 6 max) | 4.3 | M | ✅ v0.7 |
| **Tests durcis** (Hypothesis 1000+ instants, bornes, leap second, perf) | V1.0-F | S | ✅ v0.7 |
| **Lighthouse CI GitHub Actions** (4 pages × 4 catégories ≥ 90) | V1.0-D | S | ✅ v0.7 |
| **Audit complet** (versions harmonisées, CSP, a11y, theme-aware, tz-utils) | — | M | ✅ v0.7 |
| **Typographie hero `h1`** uniforme (`clamp 2–4rem`) sur 28 pages | — | XS | ✅ v0.7 |
| **Archive RFC `docs/spec/rfcs/` (template + RFC-0001 acceptée)** | V1.0-§7.2(5) | S | ✅ Unreleased |
| **Implémentation Rust de référence (`code/rust/ats/`, crate `ats`)** | V1.0-B | L | ✅ Unreleased |
| **Workflow release.yml + RELEASE.md (auto npm/PyPI/GPG/crates.io)** | V1.0-H | M | ✅ Unreleased (déclenchement gaté tag push) |

---

## Reste pour v1.0 — bloquants identifiés

### V1.0-B · 3ᵉ implémentation de référence (Rust **ou** Go) · **L** · ✅
Livré (Unreleased) : crate `ats` à `code/rust/ats/`, périmètre core uniquement (`gregorian_to_ats` / `ats_to_gregorian`, algèbre §11.4, parseurs canonique + court strict). **12 vecteurs core + 12 vecteurs arithmétiques bit-identiques** aux JSON `docs/spec/test-vectors{,-arithmetic}.json`. CI : 2 jobs ajoutés à `.github/workflows/ci.yml` (`rust` stable gating + `rust-nightly` advisory). Décisions techniques : `rust_decimal` 1.36+, `time` 0.3, MSRV 1.88 (édition 2024 requise par la chaîne transitive). Bridges (Hebrew/Islamic/Chinese/Hindu/Maya) et multi-planétaire (Mars/Moon) **post-v1.0** : vecteurs chargés en `#[ignore]` pour stabilité de schéma, portage différé conformément au périmètre v1.0-B. Publication crates.io gatée sur §7.2 (4). **Go reste optionnel** post-v1.0 (cf. Vague 4.1 / 4.2).

### V1.0-C · UI converter calendaire en JS · **M** · ⬜
Les 5 ponts (Hebrew, Islamic, Chinese, Hindu, Maya) sont Python-only. La promesse « universel » côté site n'est pas tenue. Porter Hebrew + Islamic + Maya (algorithmes courts, ~50–100 LoC chacun) en JS, ajouter dropdown calendar-source dans `clock-page.js`. Chinese (tables HKO 1900–2100) + Hindu (panchanga régional) restent Python-only — documenté.

### V1.0-E · i18n minimal au-delà FR/EN · **M** · ⬜
Un « standard universel » en 2 langues européennes est une contradiction. Ajouter **navigation + UI horloge** dans ES, DE, ZH, JA (4 langues couvrant ≈ 50 % des locuteurs natifs). Manifeste reste FR/EN ; seul le chrome multilingue. Outils : `data-i18n` attribute + `i18n/<lang>.json` chargés par `site.js`.

### V1.0-G · Background sync `§5.6` — décision à prendre · **S** · ⬜
Ce qui est livré (Periodic Background Sync) ne fonctionne que sur Chrome desktop/Android avec PWA installée + permission. Sur > 95 % des configs, ça ne notifie jamais. Trois options :
- **Retirer** et documenter comme expérimental, garder seulement le fallback in-page sur `age.html`.
- **Backend Web Push** (compte hébergement requis, ~5 €/mois).
- **Conserver tel quel** avec bandeau d'avertissement explicite dans `age.html`.

### V1.0-H · Branding & artefacts release · **M** · 🟢 — workflow livré, déclenchement gaté
**Automatisation livrée** (Unreleased) :
- `.github/workflows/release.yml` — déclenché par `push tags: v*`, exécute `verify` (cohérence versions 3 fichiers + `sw.js CACHE_NAME` + conformance JS + Rust) → `build-python` (sdist + wheel) + `build-npm` (`npm pack`) → `sign` (`SHA256SUMS` + `SHA256SUMS.asc` GPG armored détaché) → `github-release` (`gh release create --verify-tag`) → `publish-pypi` (`pypa/gh-action-pypi-publish` via OIDC trusted publishing) + `publish-npm` (`npm publish --provenance --access public`) + `publish-crates` (opt-in via `CARGO_REGISTRY_TOKEN`).
- `RELEASE.md` — process maintainer complet (§0 30-sec, §1 pré-flight 7 checks, §2 séquence cut/tag/push/watch/verify, §3 setup one-time secrets + PyPI trusted publisher + GH environment `pypi`, §4 recovery 4 modes, §5 key rotation GPG + NPM_TOKEN + steering committee post-v1.0, §6 conventions).
- `SECURITY.md §8.1` — section *Release artefact verification* (sha256sum + gpg --verify), placeholder de fingerprint à publier au premier tag signé.

**Reste à faire au moment du tag** (effort XS) : éditer les 4 fichiers versions, bumper `CACHE_NAME` `sw.js`, signer + pousser le tag (`git tag -s vX.Y.Z`). Le workflow ferme `§7.2 (4)` automatiquement au premier `vX.Y.Z` poussé.

**Branding** (séparé du workflow, peut traîner) :
- Jeu favicon complet : `favicon.ico` (16/32/48), `apple-touch-icon.png` 180×180, `mstile-*.png` Windows.
- Page « Press kit » : logo SVG/PNG plusieurs résolutions, palette officielle (`#0b0f17 / #4a6cff / #e8eef7`), do/don't du symbole Δ.

### V1.0-I · Adoption tierce (signal externe) · **L** (effort éditorial) · ⬜
v1.0 sans **≥ 3 utilisateurs externes documentés** reste un projet personnel auto-déclaré standard. Critères mesurables :
- ≥ 100 ★ GitHub + 10 forks indépendants, OU
- ≥ 1 projet OSS tiers qui dépend de `@s-geffroy/ats` ou `ats-time`, OU
- ≥ 1 mention dans un article de blog tiers / talk de conf / RFC / discussion ISO.

Précurseurs : `Show HN`, `Bluesky`, `Reddit r/ISO8601`, soumission lightning talk OSCON / FOSDEM, article de blog « Why ATS ».

### V1.0-F · Tests durcis — reste de la liste · **S** · 🟢 partiel
Livré en v0.7 : property-based Hypothesis (1000 instants), bornes Kilo/frac/parser, leap second policy explicite, perf `gregorian_to_ats < 100 µs` médian.
Reste à faire :
- **JS property-based** : porter le même test à `tests/test_property.mjs` (avec `fast-check`).
- **Perf JS** : équivalent du `test_perf.py` côté navigateur (bench `toShort` + `gregorian_to_ats` à 10 Hz tick budget).
- **Compteur tail-p99** explicite dans le rapport de régression (pas seulement médian + p95).

---

## Vague 1 — quick wins restants

### 1.2 Toggle dark/light/auto explicite · **XS** · ⬜
Le site utilise déjà `Canvas` / `CanvasText` + `color-mix(in oklab, …)` partout (l'audit v0.7 a éliminé les hex codés en dur), donc le rendu suit automatiquement `prefers-color-scheme`. Reste à ajouter un **bouton 3 états** (light/dark/auto) qui force `data-theme` sur `<html>`, persistance `localStorage["ats-theme"]`. ~30 min.

---

## Vague 4 — implémentations larges restantes

### 4.1 Rust — voir V1.0-B ✅ (livré Unreleased, `code/rust/ats/`)

### 4.2 Go · **L** · ⬜ (optionnel post-v1.0)
`§7.2 (3)` exige Rust **ou** Go, pas les deux. Rust ayant été retenu pour la « plus haute valeur signal time/std » (cf. priorité §3 ci-dessous), un portage Go reste opportun mais non-bloquant. Périmètre identique au Rust (core + algèbre + parseurs) ; module candidate `github.com/s-geffroy/ats`. À déclencher si demande d'adoption serveur/cloud explicite.

### 4.4 Implémentations supplémentaires (optionnelles) · **L chacune** · ⬜
- Kotlin (JVM + Android), Swift (iOS), Elixir.
- Liées à l'adoption observée — pas prioritaires sans demande explicite.

---

## Vague 5 — optionnels / nice-to-have

| Item | Effort | Statut | Quand |
|---|---|---|---|
| OG-image PNG (1200×630) générée au build via `rsvg-convert` | XS | ⬜ | si LinkedIn/FB rendent mal l'OG SVG actuelle |
| Service worker — Background Sync pour notifier les Kilo-versaires | L | ⬜ | utile seulement si PWA largement adoptée ; cf. V1.0-G |
| Themes alternatifs (terminal / aquarelle / néon) explicites | M | ⬜ | bikeshedding, low ROI — déjà compatible via `prefers-color-scheme` system |
| Mini-horloges Mars/Lune sur la page d'accueil | S | ⬜ | extension UI naturelle de V1.0-A |
| Carte des fuseaux ATS sur la page Cités (vs. carte d'activités) | M | ⬜ | si le visiteur veut « quel Bloc à Tokyo maintenant ? » |
| Page « Code » étendue avec onglet Rust (post-livraison Rust) | XS | ⬜ | maintenant débloqué : Rust livré (Unreleased) |

---

## Ordre de priorité suggéré (top 4)

1. **V1.0-D Lighthouse CI** ✅ livré v0.7 — la ceinture de sécurité protège tout ce qui suit.
2. **V1.0-F Tests durcis** ✅ livré v0.7 — Hypothesis a déjà attrapé un bug d'invariant dans son écriture.
3. **V1.0-B Rust de référence** ✅ livré Unreleased — crate `ats` à `code/rust/ats/`, 24 vecteurs bit-identiques, CI étendue.
4. **V1.0-C UI converter calendaire JS** — finit de fermer la promesse « universel » côté browser, ~½ journée.

Après V1.0-C, il reste pour v1.0 : V1.0-E (i18n minimal), V1.0-G (décision background sync), **V1.0-H (branding/release artifacts)** — la dernière exigence §7.2 ouverte —, V1.0-I (adoption externe).

---

## Route vers v1.0 — récapitulatif

Référentiel normatif : `docs/spec/versioning.en.md §7.2` — 7 exigences.

| # §7.2 | Exigence | Statut |
|---|---|---|
| (1) | `spec_version` sur tous les vecteurs | ✅ v0.6 |
| (2) | Annexe multi-planétaire normative | ✅ v0.7 |
| (3) | ≥ 1 impl tierce (Rust ou Go) à 100 % | ✅ Unreleased (Rust, cf. V1.0-B) |
| (4) | Artefacts publiés (`npm publish`, `twine upload`, GPG release) | 🟢 workflow `release.yml` livré, déclenchement gaté sur premier `git push origin vX.Y.Z` (cf. V1.0-H) |
| (5) | Archive RFC dans `docs/spec/rfcs/` avec ≥ 1 RFC décidée | ✅ Unreleased (RFC-0001) |
| (6) | `GOVERNANCE.md` nommant les éditeurs de référence | ✅ v0.7 (blindage final) |
| (7) | Lighthouse CI ≥ 90 sur 4 catégories × 4 pages | ✅ v0.7 |

**6 sur 7 fermés** côté code ; **7 sur 7 fermables** dès que le maintainer pousse `git tag -s vX.Y.Z && git push origin vX.Y.Z`. L'automatisation §7.2 (4) est complète, son déclenchement dépend d'un acte volontaire de l'éditeur (`RELEASE.md`).

### Bloquants annexes (non-§7.2, mais pré-requis pour le « standard universel »)

| Bloquant | Effort | Statut |
|---|---|---|
| V1.0-C · UI converter calendaire JS | M | ⬜ |
| V1.0-E · i18n minimal (ES, DE, ZH, JA) | M | ⬜ |
| V1.0-F · Tests durcis (reste JS) | S | 🟢 (partiel : Python ok, JS à faire) |
| V1.0-G · Background sync — décision | S | ⬜ |
| V1.0-I · Adoption tierce (signal externe) | L | ⬜ |

---

## Hors-roadmap (mais à garder en tête)

- **Show HN / Bluesky / Reddit `r/ISO8601`** — campagne d'annonce **après** V1.0-B (la 3ᵉ impl donne le levier).
- **Demande à l'IANA** d'un sous-namespace pour ATS-aware applications (long terme).
- **Article de blog « Why ATS »** synthétisant Philosophy + Comparison + FAQ — un seul lien à partager.
- **Conférence d'idée** sur le calendrier décimal — peut-être Hack Days ou FOSDEM.
