# Δ ATS — Spécification de l'horloge analogique

**Statut :** Brouillon v0.1
**Portée :** La page d'accueil (`/fr/`, `/en/`) gagne un toggle Numérique ↔ Analogique. Ce document ne spécifie que le cadran analogique.

---

## 1. Objectif

Offrir un cadran circulaire familier qui se lit comme une montre grégorienne (heures/minutes/secondes), mais ancré à la décomposition ATS du jour (Bloc / Centi / Milli) et respectant le principe de troncature (§6 du manifeste).

## 2. Informations affichées

| Quoi | Où | Résolution |
|---|---|---|
| Bloc (`0,1` jour = 2 h 24) | Aiguille longue | 10 positions par jour |
| Centi (`0,01` jour = 14 min 24 s) | Aiguille moyenne | 100 positions par jour |
| Milli (`0,001` jour = 1 min 26,4 s) | Aiguille courte | 1 000 positions par jour |
| Date (`K.H.D.Kin`) | Lecture numérique au bas du cadran | Au jour près |
| ISO UTC grégorien | Sous la carte du cadran | À la seconde près |

Beat (≈ 8,64 s) et Blink (≈ 0,86 s) ne sont **pas affichés** — le cadran analogique est volontairement plus léger que le canonique digital.

## 3. Géométrie

SVG `viewBox="-110 -110 220 220"`. Tous les rayons sont en unités viewBox.

| Élément | Rayon | Style |
|---|---|---|
| Cercle extérieur | 100 | `stroke: var(--border); stroke-width: 2` |
| Graduation majeure (chaque `Bloc`) | 84 → 96 | 10 traits espacés de 36°, `stroke: var(--fg); stroke-width: 2` |
| Graduation mineure (chaque `Centi` entre Blocs) | 91 → 96 | 100 traits espacés de 3,6°, `stroke: var(--fg); opacity: 0.35; stroke-width: 1` |
| Étiquette majeure (chiffres 0..9) | 76 | `font-family: ui-monospace; font-size: 12px; fill: var(--fg); opacity: 0.7` (placée entre l'extrémité de Centi et celle de Bloc) |
| Pivot central | 5 | `fill: var(--fg)` |
| Lecture de date (interne) | centrée en `(0, 60)` | mono, 14 px, `var(--fg)` |

**Convention angulaire.** La position `p` (`0 ≤ p < 10` pour le cadran Bloc) correspond à l'angle SVG :

```
angle_deg = (p / 10) × 360 − 90     // 0 en haut, sens horaire
```

## 4. Aiguilles

Toutes les aiguilles partent de `(0, 0)` et pointent vers l'extérieur. Rotation **horaire** (convention grégorienne).

| Aiguille | Longueur | Épaisseur | Couleur | Mouvement |
|---|---|---|---|---|
| **Bloc** | 88 | 4 | `var(--fg)` (foreground) | Saut à la fin de chaque Bloc (toutes les 2 h 24) |
| **Centi** | 70 | 3 | `var(--accent)` = `#4a6cff` | Saut à la fin de chaque Centi (toutes les 14 min 24 s) |
| **Milli** | 55 | 1,6 | `color-mix(in oklab, var(--fg) 50%, transparent)` (atténuée) | Interpolation continue à 10 Hz |

**Convention de longueur (ATS-native).** Contrairement à la grégorienne (heure < minute < seconde), l'unité la plus signifiante porte l'aiguille la plus longue : `Bloc > Centi > Milli`. Cela met l'accent visuel sur la fenêtre de 2 h 24 — le bloc d'attention humain.

**Hiérarchie de couleur.** Bloc est monochrome (foreground), Centi porte la couleur d'accent, Milli est désaturée. L'accent souligne le cycle social (14 min ≈ quart d'heure académique), unité qui distingue le plus l'ATS du grégorien.

## 5. Position des aiguilles (mathématiques)

Soit `f` ∈ `[0, 1)` la fraction de jour courante (`frac / 100_000` côté implémentation).

```
bloc_pos   = floor(f × 10)              // 0..9       (troncature)
centi_pos  = floor(f × 100) mod 10      // 0..9       (troncature)
milli_pos  = (f × 1000) mod 10          // 0..9       (continu, pas tronqué)
```

Transforms SVG des aiguilles :

```
bloc_angle_deg  = (bloc_pos  / 10) × 360 − 90
centi_angle_deg = (centi_pos / 10) × 360 − 90
milli_angle_deg = (milli_pos / 10) × 360 − 90
```

Chaque aiguille est un `<line>` (ou `<path>`) initialement vertical ; le `transform="rotate(angle, 0, 0)"` est posé sur chaque tick.

**Règle de troncature (spec §6).** Les positions Bloc et Centi sont tronquées au plancher, donc les aiguilles ne devancent jamais la suivante. L'aiguille Milli est *interpolée en continu* — exception délibérée et documentée (cf §7).

## 6. Lecture centrale

Un petit texte à l'intérieur du cadran à `(0, 60)` affiche le triplet de date `K.H.D.Kin` en monospace, séparés par des `.`. Exemple :

```
20.7.8.2
```

Si `Kilo > 99`, l'affichage s'étire ; en cas de chevauchement avec les graduations inférieures, on décale légèrement le `viewBox`. Un petit `Δ` précède pour la cohérence visuelle :

```
Δ 20.7.8.2
```

## 7. Politique de mouvement

| Aiguille | Politique | Justification |
|---|---|---|
| Bloc | **Saut** (floor) | Un saut toutes les 2 h 24 — cohérent avec « compteur d'unités complétées » (manifeste §6). |
| Centi | **Saut** (floor) | Un saut toutes les 14 min — toujours cohérent ; semblerait inerte si lissé. |
| Milli | **Continu** (10 Hz) | Le floor pur ferait tick toutes les 1 min 26 s — visible mais le cadran semblerait *trop* discret. On accepte une petite entorse philosophique en échange de la sensation d'« horloge vivante ». |

**Mode strict (opt-in).** Une case à cocher **dans le panneau `<details>`** de la clock-card permet d'activer le mode strict — l'aiguille Milli saute alors comme les deux autres, sans interpolation. Le choix est persisté dans `localStorage["ats-strict-analog"]`. Défaut : désactivé (hybride). Le Web Component PEUT aussi exposer cela via l'attribut `<ats-clock face="analog" strict>`.

## 8. Animation

Un seul `setInterval` à 100 ms (10 Hz) recalcule les trois angles. La rédaction du `transform` est sautée si l'angle n'a pas changé (cas du saut Bloc/Centi) — évite la pollution DOM inutile.

Les implémentations PEUVENT utiliser `requestAnimationFrame` pour l'aiguille Milli (sous-frame). C'est une optimisation de rendu pure, sans effet sur les valeurs ATS.

## 9. UX du toggle (page d'accueil)

La page d'accueil affiche un sélecteur segmenté en haut de la clock-card :

```
[ Numérique ] [ Analogique ]
```

- Le choix est persisté dans `localStorage` sous la clé `ats-face`.
- Défaut : **Numérique** (préserve la première impression actuelle).
- Bascule instantanée ; une seule face est rendue à la fois.
- L'étiquette `Δ ATS (court)` est remplacée par `Δ ATS (analogique)` quand l'analogique est actif.
- Tout le reste de la clock-card (`<details>` avec convertisseur et valeurs par unité) est **partagé** entre les deux faces, inchangé.

## 10. Accessibilité

- Le SVG porte `aria-label="Horloge analogique ATS"` (traduit) et `role="img"`.
- Le texte numérique central porte `role="timer" aria-live="off" aria-atomic="true"` (même politique que la face numérique).
- Le toggle est un `<div role="tablist">` contenant deux `<button role="tab" aria-selected="…">`, avec `aria-controls` pointant vers le conteneur de face visible.
- Clavier : `←` / `→` font basculer Numérique ↔ Analogique quand le focus est sur le tablist ; les raccourcis globaux `D` / `N` / `L` continuent de fonctionner.

## 11. Non-objectifs

- Pas d'alarme, pas de chronomètre, pas de compte à rebours — hors-scope home page.
- Pas d'affichage de fuseau — l'ATS est UTC par spec (§7).
- Pas d'animation DST (le DST n'existe pas en ATS).
- Pas de seconde face (numérique + analogique empilés) — l'utilisateur a explicitement choisi un toggle.

## 12. Questions ouvertes

- L'aiguille Milli devrait-elle pulser (oscillation de longueur) plutôt que tourner en continu ? (Reporté à v0.2.)
- Le cadran doit-il refléter le thème dark/light via `currentColor` uniquement, ou utiliser des palettes distinctes ? (Actuellement `var(--fg)` couvre les deux.)
- Le mode strict : attribut opt-in ou affordance « Settings » séparée ? (Pas pour v1.)
