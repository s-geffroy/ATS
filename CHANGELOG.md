# Changelog

Toutes les modifications notables du projet ATS sont consignées ici.

Le format suit [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) et la nomenclature [SemVer](https://semver.org/lang/fr/).

## [0.1.1] — 2026-06-12 (Δ 20.7.8)

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
