# ATS — Apollonian Time System

> Standard temporel décimal, linéaire, universel — ancré sur le **début du jour** de l'alunissage d'Apollo 11 (1969‑07‑20T00:00:00Z). **Bloc 5 = 12:00 UTC.**

**Symbole :** Δ
**Statut :** Pré-release **v0.7.0** (forme courte `ΔK.H.D.Kin-BC.M` · annexe multi-planétaire normative · gouvernance multi-éditeur post-v1.0)
**Site :** <https://s-geffroy.github.io/ATS/> (bilingue FR / EN)
**Licence :** MIT (code) · CC-BY-4.0 (docs) · voir [`GOVERNANCE.md §8`](./GOVERNANCE.md#8-trademark-and-licensing-posture)

[![CI](https://github.com/s-geffroy/ATS/actions/workflows/ci.yml/badge.svg)](https://github.com/s-geffroy/ATS/actions/workflows/ci.yml)
[![Lighthouse](https://github.com/s-geffroy/ATS/actions/workflows/lighthouse.yml/badge.svg)](https://github.com/s-geffroy/ATS/actions/workflows/lighthouse.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![spec_version](https://img.shields.io/badge/spec__version-0.7-4a6cff)](./docs/spec/versioning.en.md)
[![I run on Δ ATS](https://s-geffroy.github.io/ATS/assets/badge.svg)](https://s-geffroy.github.io/ATS/)

---

## En 60 secondes

L'ATS remplace le couple grégorien (année/mois/semaine) + heure locale par un compteur unique en base 10, exprimé en jours et fractions de jour écoulés depuis l'époque. **Pas de fuseaux horaires, pas de mois irréguliers, pas de "moitié de bissextile".**

```
T+ Δ 20.7.8.2.50000     (canonique — midi UTC du 13 juin 2026)
Δ20.7.8.2-50.0          (court v0.7, UI)
```

Lecture : 20 Kilos, 7 Hecto, 8 Deka, 2 Kin, fraction `.50000` (= Bloc 5 = 12:00 UTC).
→ Spec complète : [`docs/spec/manifesto.en.md`](./docs/spec/manifesto.en.md) (FR : [`manifesto.fr.md`](./docs/spec/manifesto.fr.md)).

---

## Documents — état du blindage v0.7

| Document | Type | Statut |
|---|---|---|
| [`manifesto.{en,fr}.md`](./docs/spec/manifesto.en.md) | Spec — **normatif** | ✅ blindé v0.7 |
| [`versioning.{en,fr}.md`](./docs/spec/versioning.en.md) | Annexe — **normatif** | ✅ blindé v0.7 |
| [`multi-planetary.{en,fr}.md`](./docs/spec/multi-planetary.en.md) | Annexe — **normatif** | ✅ blindé v0.7 |
| [`philosophy.{en,fr}.md`](./docs/spec/philosophy.en.md) | Annexe — non-normatif | ✅ blindé v0.7 |
| [`comparison.{en,fr}.md`](./docs/spec/comparison.en.md) | Annexe — non-normatif | ✅ blindé v0.7 |
| [`conventions.{en,fr}.md`](./docs/spec/conventions.en.md) | Annexe — non-normatif | ✅ blindé v0.7 |
| [`analog-clock.{en,fr}.md`](./docs/spec/analog-clock.en.md) | Annexe — non-normatif | ✅ blindé v0.7 |
| [`faq.{en,fr}.md`](./docs/spec/faq.en.md) | Annexe — non-normatif | ✅ blindé v0.7 |
| [`GOVERNANCE.md`](./GOVERNANCE.md) | Process — normatif | ✅ blindé v0.7 |
| [`SECURITY.md`](./SECURITY.md) | Process — normatif | ✅ blindé v0.7 |
| [`CONTRIBUTING.md`](./CONTRIBUTING.md) | Process — quick-start | ✅ blindé v0.7 |
| [`CHANGELOG.md`](./CHANGELOG.md) | Historique | ✅ |
| [`ROADMAP.md`](./ROADMAP.md) | Plan v1.0 | ✅ |

**EN authoritative** + FR = traduction symétrique (en cas de divergence, EN contrôle — voir `versioning.en.md §0.3`).

---

## Progression v1.0

Référentiel : `versioning.en.md §7.2` — **6 exigences sur 7 fermées**.

| # | Exigence | Statut |
|---|---|---|
| 1 | `spec_version` sur tous les vecteurs | ✅ v0.6 |
| 2 | Annexe multi-planétaire normative | ✅ v0.7 |
| 3 | ≥ 1 impl tierce (Rust ou Go) à 100 % | ✅ Unreleased (Rust, `code/rust/ats/`) |
| 4 | Artefacts publiés (`npm publish`, `twine upload`, GPG release) | 🟢 workflow `release.yml` livré, déclenché par `git push origin vX.Y.Z` |
| 5 | Archive RFC `docs/spec/rfcs/` avec ≥ 1 RFC décidée | ✅ Unreleased (RFC-0001) |
| 6 | `GOVERNANCE.md` nommant les éditeurs de référence | ✅ v0.7 |
| 7 | Lighthouse CI ≥ 90 sur 4 catégories × 4 pages | ✅ v0.7 |

Détails et bloquants annexes : [`ROADMAP.md`](./ROADMAP.md).

---

## Structure du dépôt

| Dossier / fichier | Rôle |
|---|---|
| `docs/spec/manifesto.{en,fr}.md` | **Manifeste v0.7** — source de vérité |
| `docs/spec/{versioning,multi-planetary,philosophy,comparison,conventions,analog-clock,faq}.{en,fr}.md` | 7 annexes (2 normatives + 5 non-normatives) |
| `docs/spec/_rendered/*.html` | Fragments HTML pré-rendus (générés par `scripts/render-md.mjs`) |
| `docs/spec/test-vectors-*.json` | Contrats de conformance (core 12 + arithmétique + 5 ponts + 2 multi-planétaires) |
| `scripts/render-md.mjs` | Pré-rendu Markdown au build (élimine `marked` + `dompurify` du runtime) |
| `lighthouse/` | Harness de mesure Lighthouse + baselines qualitatives + CI workflow |
| `code/ats.py`, `code/ats_multi_planetary.py`, `code/bridges/*.py` | Module Python — conversion Grégorien ↔ ATS + multi-planétaire + 5 ponts |
| `code/rust/ats/` | Crate Rust de référence — core uniquement (12 + 12 vecteurs bit-identiques) |
| `docs/spec/rfcs/` | Archive RFC (template + RFC-0001 acceptée, ferme §7.2 (5)) |
| `docs/assets/js/ats.js`, `docs/assets/js/ats-clock.js` | Implémentation JS de référence + Web Component `<ats-clock>` |
| `tests/test_vectors.{py,mjs}`, `tests/test_property.py`, `tests/test_perf.py` | Conformance Python + JS, property-based (Hypothesis 1000+), perf |
| `.github/workflows/{ci,lighthouse,cron-now,pages-build,release}.yml` | Matrice CI Python × Node × Rust, Lighthouse CI, snapshot horaire `/api/now.json`, build Pages, pipeline release (npm + PyPI + GPG + crates.io) |
| [`RELEASE.md`](./RELEASE.md) + [`RELEASE-SETUP.md`](./RELEASE-SETUP.md) | Process maintainer (versions, tag GPG, secrets, recovery) + walkthrough one-time setup — ferme §7.2 (4) |
| `archive/source/` | Snapshot historique du contenu d'origine |

---

## Usage rapide

### Python

```bash
docker run --rm -v "$(pwd):/app" -w /app python:3.11-slim \
  python code/ats.py
```

```python
from datetime import datetime, timezone
from ats import gregorian_to_ats, ats_to_gregorian

now = datetime.now(timezone.utc)
ats = gregorian_to_ats(now)
print(ats.to_canonical())   # T+ Δ 20.7.8.2.50000
print(ats.to_short())       # Δ20.7.8.2-50.0
```

### JavaScript (navigateur ou Node)

```html
<script src="https://s-geffroy.github.io/ATS/assets/js/ats.js" defer></script>
<script>
  const { atsFromMs, toCanonical, toShort } = window.ATS;
  const v = atsFromMs(Date.now());
  console.log(toCanonical(v));  // T+ Δ 20.7.8.2.50000
  console.log(toShort(v));      // Δ20.7.8.2-50.0
</script>
```

### Web Component `<ats-clock>`

```html
<script src="https://s-geffroy.github.io/ATS/assets/js/ats-clock.js" defer></script>
<ats-clock format="short" lang="en"></ats-clock>
```

Attributs : `format` (`short` | `canonical` | `both`), `lang` (`en` | `fr`), `updates-per-second` (1–20). Guide complet : [`/en/embed.html`](https://s-geffroy.github.io/ATS/en/embed.html).

### Rust (crate `ats`)

```bash
docker run --rm -v "$(pwd):/app" -w /app/code/rust rust:1.88-slim \
  cargo test --release
```

API idiomatique : `ATSDateTime::from_str(...)`, `Display` pour la forme canonique, `to_short()` pour la forme courte, opérateurs `+` / `-` pour l'algèbre §11.4. Détails : [`code/rust/README.md`](./code/rust/README.md).

### Conformance (Docker one-liner)

```bash
# Python
docker run --rm -v "$(pwd):/app" -w /app python:3.11-slim \
  python -m unittest tests.test_vectors

# JavaScript
docker run --rm -v "$(pwd):/app" -w /app node:20-slim \
  node tests/test_vectors.mjs

# Rust
docker run --rm -v "$(pwd):/app" -w /app/code/rust rust:1.88-slim \
  cargo test --release
```

Toute implémentation tierce doit produire des sorties **bit-identiques** sur les 7 fichiers `docs/spec/test-vectors-*.json` au `spec_version` qu'elle déclare cibler. Voir `versioning.en.md §2.3` (consumer obligations) et `manifesto.en.md §16.5` (conformance contract).

---

## Site (GitHub Pages)

Publié depuis `main`, dossier `/docs`. Pages bilingues :

- **Horloge** interactive ([`/fr/`](https://s-geffroy.github.io/ATS/fr/), [`/en/`](https://s-geffroy.github.io/ATS/en/)) — adaptative, conversion bidirectionnelle, permalien `?t=`, raccourcis `C`/`D`/`N`/`L`, mode focus + camembert sur trigrammes de villes.
- **Manifeste, Versioning, Multi-planétaire, Philosophie, Comparaison, Conventions, Analog-clock, FAQ** — Markdown **pré-rendu** au build (depuis v0.6) ; pas de `marked` ni `dompurify` au runtime.
- **Cadrans / Dials** — comparatif visuel 24 h vs 10 Blocs (SVG temps réel).
- **Frise / Timeline** — 17 jalons historiques en Δ avec sources URL et tags couleur.
- **Mon âge** — calculateur ATS personnel + export `.ics` (Kilo-versaires + Hecto-fêtes), 100 % client.
- **Cités** — carte du monde équirectangulaire, ~40 capitales, activités quotidiennes en temps ATS.
- **Test vectors** — page interactive pour valider une implémentation tierce.
- **Intégrer / Embed** — guide one-liner avec Web Component + CSP stricte recommandée.
- **Code** — module Python téléchargeable, conformance one-liner, statut Rust/Go.

### Recherche statique (Pagefind)

Depuis v0.6, les pages FAQ et Manifeste (FR + EN) embarquent un champ de recherche alimenté par Pagefind. Index construit au build via Docker (`npx pagefind`), sortie `docs/_pagefind/` (~900 KB).

### Endpoint snapshot `/api/now.json`

GitHub Actions régénère `docs/api/now.json` **toutes les heures** (workflow `cron-now.yml`). Le fichier expose l'instant ATS courant en JSON :

```json
{
  "utc": "2026-06-15T11:00:00Z",
  "ats_canonical": "T+ Δ 20.7.8.4.45833",
  "ats_display": "Δ20.7.8.4-45.8",
  "integer_days": 20784,
  "fraction_5digit": 45833,
  "spec_version": "0.7",
  "generated_at": "2026-06-15T11:00:00Z",
  "cadence_minutes": 60,
  "note": "Hourly snapshot, not a live endpoint."
}
```

URL publique : <https://s-geffroy.github.io/ATS/api/now.json>. **Limite explicite** : ce n'est **pas un endpoint live**. Pour un Δ temps-réel, charger `/ATS/assets/js/ats.js` côté client.

### Régénérer les pages Markdown

Le rendu Markdown est exécuté au build :

```bash
docker run --rm -v "$PWD:/app" -w /app/scripts node:20-slim \
  sh -c 'npm install --silent --no-fund --no-audit && node render-md.mjs'
```

Sortie : `docs/spec/_rendered/<source>.html` (fragments standalone) et inlining direct dans les pages HTML correspondantes. Script idempotent (marqueur `<!-- ATS:INLINE source.md -->`).

---

## Gouvernance, sécurité, contributions

- **Comment décider** : `GOVERNANCE.md` — pre-v1.0 BDFL, post-v1.0 steering committee min 3 éditeurs.
- **Comment reporter une vulnérabilité** : `SECURITY.md` — GHSA prioritaire, email PGP, hard caps publiés.
- **Comment contribuer** : `CONTRIBUTING.md` — quick-start Docker, pointeur vers la procédure RFC.
- **Versionnement et stabilité** : `versioning.en.md` — SemVer + freeze post-v1.0, `spec_version` obligatoire.

---

## Licence

- **Code** (`code/`, `docs/assets/js/`, `scripts/`) : MIT — voir [`LICENSE`](./LICENSE).
- **Documentation** (`docs/spec/*.md`, annexes, branding) : CC-BY-4.0 — voir [`GOVERNANCE.md §8`](./GOVERNANCE.md#8-trademark-and-licensing-posture).
- Le symbole **Δ** (U+0394) et le nom "ATS / Apollonian Time System" **ne sont pas** des marques déposées.
