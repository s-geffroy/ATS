# ATS — Apollonian Time System

> Standard temporel décimal, linéaire, universel — ancré sur le **début du jour** de l'alunissage d'Apollo 11 (1969‑07‑20T00:00:00Z). **Bloc 5 = 12:00 UTC.**

**Symbole :** Δ
**Statut :** Pré-release **v0.5** (manifeste et code synchronisés)
**Site :** https://s-geffroy.github.io/ATS/ (bilingue FR / EN)
**Badge :** [![I run on Δ ATS](https://s-geffroy.github.io/ATS/assets/badge.svg)](https://s-geffroy.github.io/ATS/)

## Qu'est-ce que l'ATS ?

L'ATS remplace le couple grégorien (année/mois/semaine) + heure locale par un compteur unique en base 10, exprimé en jours et fractions de jour écoulés depuis l'époque. Pas de fuseaux horaires, pas de mois irréguliers, pas de "moitié de bissextile".

```
T+ Δ 20.7.8.2.50000     (canonique — midi UTC du 13 juin 2026)
Δ 20.7.8.2/50           (court, UI)
```

Lecture : 20 Kilos, 7 Hecto, 8 Deka, 2 Kin, fraction de jour `.50000` (= Bloc 5 = 12:00 UTC).

## Structure du dépôt

| Dossier / fichier | Rôle |
|---|---|
| `docs/spec/manifesto.{en,fr}.md` | **Manifeste v0.5** — source de vérité |
| `docs/spec/{philosophy,comparison,faq}.{en,fr}.md` | Annexes : philosophie, comparatif, FAQ |
| `docs/spec/_rendered/*.html` | Fragments HTML pré-rendus (générés par `scripts/render-md.mjs`) |
| `docs/spec/test-vectors.json` | **12 instants de référence** — contrat de conformance |
| `scripts/render-md.mjs` | Pré-rendu Markdown au build (élimine `marked` + `dompurify` du runtime) |
| `lighthouse/` | Harness de mesure Lighthouse + baselines qualitatives |
| `code/ats.py` | Module Python — conversion Grégorien ↔ ATS (Python ≥ 3.9) |
| `docs/assets/js/ats.js` | Routines JS de référence |
| `docs/assets/js/ats-clock.js` | Web Component `<ats-clock>` |
| `tests/test_vectors.{py,mjs}` | Conformance Python + JavaScript |
| `.github/workflows/ci.yml` | Matrice CI : Python 3.9/3.11/3.13 × Node 20/22 |
| `archive/source/` | Snapshot historique du contenu d'origine |

## Site (GitHub Pages)

Publié depuis `main`, dossier `/docs`. Pages bilingues :

- **Horloge** interactive (`/fr/`, `/en/`) — adaptative, conversion bidirectionnelle, permalien `?t=`, copy-on-click, raccourcis `C`/`D`/`N`/`L`.
- **Manifeste, Philosophie, Comparaison, FAQ** — Markdown **pré-rendu** au build (depuis v0.6) ; pas de `marked` ni `dompurify` au runtime, pas de `fetch('*.md')` côté client.
- **Cadrans / Dials** — comparatif visuel 24 h vs 10 Blocs (SVG temps réel).
- **Frise / Timeline** — ~17 jalons historiques en Δ avec tags couleur (Espace, Sciences, Tech, Politique), badge ★ sur l'alunissage à l'intérieur de Δ 0, et conventions ATS (Hecto-fête Δ 100, Kilo-versaire 1 Δ 1000).
- **Mon âge** — calculateur ATS personnel + export `.ics` (Kilo-versaires + Hecto-fêtes).
- **Intégrer / Embed** — guide one-liner avec Web Component, badge.
- **Code** — module Python téléchargeable, lien GitHub raw.

## Endpoint snapshot `/api/now.json`

Depuis v0.6, GitHub Actions régénère `docs/api/now.json` **toutes les heures** (workflow `cron-now.yml`). Le fichier expose l'instant ATS courant en JSON :

```json
{
  "utc": "2026-06-13T11:00:00Z",
  "ats_canonical": "T+ Δ 20.7.8.2.45833",
  "ats_short": "Δ 20.7.8.2/45",
  "integer_days": 20782,
  "fraction_5digit": 45833,
  "generated_at": "2026-06-13T11:00:00Z",
  "cadence_minutes": 60,
  "note": "Hourly snapshot, not a live endpoint."
}
```

URL publique : `https://s-geffroy.github.io/ATS/api/now.json`.

**Limite explicite** : ce n'est **pas un endpoint live**. Pour un Δ temps-réel, charger `/ATS/assets/js/ats.js` côté client et calculer localement depuis `now()`. Le fichier statique sert surtout aux intégrations tierces qui veulent un Δ « approximativement courant » sans charger JS.

## Régénérer les pages Markdown

Le rendu Markdown est exécuté au build (et non plus au runtime côté navigateur). Pour régénérer les 8 fragments HTML après une édition de `docs/spec/*.md` :

```bash
docker run --rm -v "$PWD:/app" -w /app/scripts node:20-slim \
  sh -c 'npm install --silent --no-fund --no-audit && node render-md.mjs'
```

Sortie : `docs/spec/_rendered/<source>.html` (fragments standalone) et inlining direct dans `docs/{fr,en}/{manifeste,philosophie,comparaison,faq}.html`. Le script est idempotent (marqueur `<!-- ATS:INLINE source.md -->` détecté pour les ré-exécutions).

## Usage rapide

### Python

```bash
python code/ats.py
```

```python
from datetime import datetime, timezone
from ats import gregorian_to_ats, ats_to_gregorian

now = datetime.now(timezone.utc)
ats = gregorian_to_ats(now)
print(ats.to_canonical())   # T+ Δ 20.7.8.2.50000
print(ats.to_short())       # Δ 20.7.8.2/50
```

### Web Component

```html
<script src="https://s-geffroy.github.io/ATS/assets/js/ats-clock.js" defer></script>
<ats-clock format="short" lang="en"></ats-clock>
```

### Conformance

```bash
python -m unittest tests.test_vectors    # 2 tests, 12 vecteurs
node tests/test_vectors.mjs              # 12 vecteurs
```

Toute implémentation tierce doit produire des sorties **bit-identiques** sur `docs/spec/test-vectors.json`.

## Versionnement

Manifeste et code/site sont alignés sur **v0.5** (pré-release ; le projet est toujours pré-v1). Voir [`CHANGELOG.md`](./CHANGELOG.md). La bascule depuis l'ancien epoch (1969-07-20T20:17:40Z) est un **breaking change** : aucune conversion automatique n'est fournie.

## Licence

MIT — voir [`LICENSE`](./LICENSE).
