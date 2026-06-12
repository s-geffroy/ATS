# Changelog

Toutes les modifications notables du projet ATS sont consignées ici.

Le format suit [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) et la nomenclature [SemVer](https://semver.org/lang/fr/).

## [0.1.0] — 2026-06-12 (Δ 20.7.8)

### Added
- **Manifeste v1.1 RC** (`docs/spec/manifesto.{en,fr}.md`) : époque déplacée à l'alunissage (1969‑07‑20T20:17:40Z), Myriade retirée du format positionnel, 0.1 j renommé `Bloc`, séparateur court `/`, arrondi banker's, politique fuseaux + leap seconds + décodage explicites.
- **Annexes Philosophie & Comparaison** (`docs/spec/{philosophy,comparison}.{en,fr}.md`).
- **Module Python `code/ats.py`** consolidé (round-trip ±432 ms à précision 5 chiffres).
- **Site GitHub Pages** bilingue FR/EN (`docs/`) : horloge adaptative, manifeste rendu Markdown, philosophie, comparaison, outil "Mon âge ATS", page code.
- Snapshot historique du contenu original sous `archive/source/`.
- `README.md`, `LICENSE` (MIT), `.gitignore`.

### Changed
- Spec déplacée vers `docs/spec/` (source unique servie par Pages).
