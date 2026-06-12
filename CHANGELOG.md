# Changelog

Toutes les modifications notables du projet ATS sont consignées ici.

Le format suit [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) et la nomenclature [SemVer](https://semver.org/lang/fr/).

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
