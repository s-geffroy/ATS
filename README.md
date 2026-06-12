# ATS — Apollonian Time System

> Standard temporel décimal, linéaire, universel — ancré sur le premier pas humain sur la Lune (1969‑07‑21T02:56:15Z).

**Symbole :** Δ
**Statut :** Release Candidate v1.1
**Site :** _à venir_ — `https://s-geffroy.github.io/ATS/`

## Qu'est-ce que l'ATS ?

L'ATS remplace le couple grégorien (année/mois/semaine) + heure locale par un compteur unique en base 10, exprimé en jours et fractions de jour écoulés depuis l'époque. Pas de fuseaux horaires, pas de mois irréguliers, pas de "moitié de bissextile".

```
T+ Δ 2.0.6.4.5.36806
```

Lecture : 2 Myriades, 0 Kilo, 6 Hecto, 4 Deka, 5 Kin, fraction de jour `.36806`.

## Structure du dépôt

| Dossier | Contenu |
|---|---|
| `code/` | Module Python `ats.py` — conversion Grégorien ↔ ATS |
| `docs/` | Site GitHub Pages (FR + EN, horloge, manifeste, philosophie, comparaison, outil "Mon âge") |
| `docs/spec/` | Manifeste v1.1 + annexes (philosophie, comparaison) — **source de vérité** |
| `archive/source/` | Snapshot original du projet (historique, lecture seule) |

## Usage local du code

```bash
python code/ats.py
```

## Publication

Le site est publié via **GitHub Pages** depuis la branche `main`, dossier `/docs`.

## Licence

MIT — voir [`LICENSE`](./LICENSE).
