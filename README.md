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
| `docs/spec/test-vectors.json` | **12 instants de référence** — contrat de conformance |
| `code/ats.py` | Module Python — conversion Grégorien ↔ ATS (Python ≥ 3.9) |
| `docs/assets/js/ats.js` | Routines JS de référence |
| `docs/assets/js/ats-clock.js` | Web Component `<ats-clock>` |
| `tests/test_vectors.{py,mjs}` | Conformance Python + JavaScript |
| `.github/workflows/ci.yml` | Matrice CI : Python 3.9/3.11/3.13 × Node 20/22 |
| `archive/source/` | Snapshot historique du contenu d'origine |

## Site (GitHub Pages)

Publié depuis `main`, dossier `/docs`. Pages bilingues :

- **Horloge** interactive (`/fr/`, `/en/`) — adaptative, conversion bidirectionnelle, permalien `?t=`, copy-on-click, raccourcis `C`/`D`/`N`/`L`.
- **Manifeste, Philosophie, Comparaison, FAQ** — rendu Markdown depuis `docs/spec/`.
- **Cadrans / Dials** — comparatif visuel 24 h vs 10 Blocs (SVG temps réel).
- **Frise / Timeline** — ~17 jalons historiques en Δ avec tags couleur (Espace, Sciences, Tech, Politique), badge ★ sur l'alunissage à l'intérieur de Δ 0, et conventions ATS (Hecto-fête Δ 100, Kilo-versaire 1 Δ 1000).
- **Mon âge** — calculateur ATS personnel + export `.ics` (Kilo-versaires + Hecto-fêtes).
- **Intégrer / Embed** — guide one-liner avec Web Component, badge.
- **Code** — module Python téléchargeable, lien GitHub raw.

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
