# Δ ATS — Spécification de l'horloge analogique

**Statut :** Brouillon v0.2
**Portée :** La page d'accueil (`/fr/`, `/en/`) gagne un toggle Numérique ↔ Analogique. Ce document ne spécifie que le cadran analogique.

> **Évolutions v0.2 :** cadran à 5 aiguilles (Beat et Blink désormais représentés), longueurs inversées pour suivre la convention horlogère classique (l'aiguille la plus lente est la plus courte), Blink décorée d'un petit disque à 80 % de sa longueur, lecture de date déplacée au-dessus du pivot.

---

## 1. Objectif

Offrir un cadran circulaire familier qui se lit comme une montre grégorienne (heures/minutes/secondes), mais ancré à la décomposition ATS du jour (Bloc / Centi / Milli) et respectant le principe de troncature (§6 du manifeste).

## 2. Informations affichées

| Quoi | Où | Résolution |
|---|---|---|
| Bloc (`0,1` jour = 2 h 24) | Aiguille la plus courte (la plus lente) | 10 positions par jour |
| Centi (`0,01` jour = 14 min 24 s) | Aiguille courte | 100 positions par jour |
| Milli (`0,001` jour = 1 min 26,4 s) | Aiguille moyenne | 1 000 positions par jour |
| Beat (`0,0001` jour ≈ 8,64 s) | Aiguille longue | 10 000 positions par jour |
| Blink (`0,00001` jour ≈ 0,864 s) | Aiguille la plus longue, décorée d'un petit disque à 80 % de sa longueur | 100 000 positions par jour |
| Date (`K.H.D.Kin`) | Lecture numérique à l'intérieur du cadran, au-dessus du pivot | Au jour près |
| ISO UTC grégorien | Sous la carte du cadran | À la seconde près |

## 3. Géométrie

SVG `viewBox="-110 -110 220 220"`. Tous les rayons sont en unités viewBox.

| Élément | Rayon | Style |
|---|---|---|
| Cercle extérieur | 100 | `stroke: var(--border); stroke-width: 2` |
| Graduation majeure (chaque `Bloc`) | 84 → 96 | 10 traits espacés de 36°, `stroke: var(--fg); stroke-width: 2` |
| Graduation mineure (chaque `Centi` entre Blocs) | 91 → 96 | 100 traits espacés de 3,6°, `stroke: var(--fg); opacity: 0.35; stroke-width: 1` |
| Étiquette majeure (chiffres 0..9) | 76 | `font-family: ui-monospace; font-size: 12px; fill: var(--fg); opacity: 0.7` (placée entre l'extrémité de Centi et celle de Bloc) |
| Pivot central | 5 | `fill: var(--fg)` |
| Lecture de date (interne) | centrée en `(0, -50)` | mono, 14 px, `var(--fg)` (à mi-chemin entre le `0` du sommet et le pivot) |

**Convention angulaire.** La position `p` (`0 ≤ p < 10` pour le cadran Bloc) correspond à l'angle SVG :

```
angle_deg = (p / 10) × 360 − 90     // 0 en haut, sens horaire
```

## 4. Aiguilles

Toutes les aiguilles partent de `(0, 0)` et pointent vers l'extérieur. Rotation **horaire** (convention grégorienne).

| Aiguille | Longueur | Épaisseur | Couleur | Mouvement |
|---|---|---|---|---|
| **Bloc** | 40 | 4 | `var(--fg)` (foreground) | Saut à la fin de chaque Bloc (toutes les 2 h 24) |
| **Centi** | 55 | 3 | `var(--accent)` = `#4a6cff` | Saut à la fin de chaque Centi (toutes les 14 min 24 s) |
| **Milli** | 70 | 2 | `color-mix(in oklab, var(--fg) 50%, transparent)` (atténuée) | Interpolation continue à 10 Hz (le mode strict la fait sauter) |
| **Beat** | 82 | 1,4 | `#2bb673` (vert) | Interpolation continue à 10 Hz (le mode strict la fait sauter) |
| **Blink** | 95 | 1,2 | `#ff5a5a` (rouge, comme une trotteuse) + disque plein `r=3` en `y=-76` (80 % de la longueur) | Interpolation continue à 10 Hz (le mode strict la fait sauter) ; voir §7 pour la limite de rafraîchissement à 864 ms |

**Convention de longueur (horlogerie classique).** Les aiguilles sont ordonnées par vitesse : **l'unité la plus lente porte l'aiguille la plus courte**, l'unité la plus rapide porte la plus longue — comme sur une montre grégorienne (heure < minute < seconde). L'aiguille la plus longue (Blink) porte un petit disque décoratif qui évoque la bague de pointe d'une trotteuse, la rendant identifiable au premier regard.

**Hiérarchie de couleur.** Bloc est monochrome (foreground), Centi porte la couleur d'accent (`#4a6cff`), Milli est désaturée, Beat est verte, Blink est rouge. La progression froid → chaud renforce l'indice visuel : plus la teinte est chaude, plus l'aiguille est rapide.

## 5. Position des aiguilles (mathématiques)

Soit `f` ∈ `[0, 1)` la fraction de jour courante (`frac / 100_000` côté implémentation).

```
bloc_pos   = floor(f × 10)               // 0..9       (troncature)
centi_pos  = floor(f × 100)    mod 10    // 0..9       (troncature)
milli_pos  = (f × 1000)        mod 10    // 0..9       (continu, sauf mode strict)
beat_pos   = (f × 10 000)      mod 10    // 0..9       (continu, sauf mode strict)
blink_pos  = (f × 100 000)     mod 10    // 0..9       (continu, sauf mode strict)
```

Transforms SVG des aiguilles :

```
bloc_angle_deg  = (bloc_pos  / 10) × 360 − 90
centi_angle_deg = (centi_pos / 10) × 360 − 90
milli_angle_deg = (milli_pos / 10) × 360 − 90
beat_angle_deg  = (beat_pos  / 10) × 360 − 90
blink_angle_deg = (blink_pos / 10) × 360 − 90
```

La ligne Blink et son disque décoratif sont des éléments SVG **frères** (pas enveloppés dans un `<g>` — certaines versions Chromium ne re-peignent pas un `<g>` dont le `transform` est mis à jour via `setAttribute`). Les deux éléments partagent la même rotation Blink, appliquée séparément en JavaScript à chaque tick. Chaque ligne est initialement verticale ; le `transform="rotate(angle, 0, 0)"` est posé sur chaque tick.

**Règle de troncature (spec §6).** Les positions Bloc et Centi sont tronquées au plancher, donc les aiguilles ne devancent jamais la suivante. Les aiguilles Milli, Beat et Blink sont *interpolées en continu* par défaut — exception délibérée et documentée (cf §7). Le mode strict (opt-in) les fait toutes trois sauter.

## 6. Lecture centrale

Un petit texte à l'intérieur du cadran à `(0, -50)` affiche la date `K.H.D.Kin` en monospace, séparés par des `.`. La position se trouve à mi-chemin entre le repère `0` au sommet du cadran et le pivot central, laissant la moitié inférieure libre pour les aiguilles les plus longues.

```
20.7.8.2
```

Un petit `Δ` précède pour la cohérence visuelle :

```
Δ 20.7.8.2
```

Si `Kilo > 99`, l'affichage s'étire latéralement ; le `text-anchor` reste centré.

## 7. Politique de mouvement

| Aiguille | Politique | Justification |
|---|---|---|
| Bloc | **Saut** (floor) | Un saut toutes les 2 h 24 — cohérent avec « compteur d'unités complétées » (manifeste §6). |
| Centi | **Saut** (floor) | Un saut toutes les 14 min — toujours cohérent ; semblerait inerte si lissé. |
| Milli | **Continu** (10 Hz) | Le floor pur ferait tick toutes les 1 min 26 s — visible mais trop discret. On accepte une petite entorse philosophique pour la sensation d'« horloge vivante ». |
| Beat | **Continu** (10 Hz) | Même justification que Milli, à une échelle plus rapide. |
| Blink | **Continu** (10 Hz) — voir limite ci-dessous | Même justification ; fournit un indice visuel rapide de type trotteuse. |

**Limite de rafraîchissement Blink.** Comme `frac` n'a que 5 décimales (résolution 0,864 s), la position de Blink ne change que lorsque `frac` s'incrémente effectivement — environ toutes les 864 ms. À 10 Hz (100 ms), l'aiguille Blink saute donc visuellement une fois par tick de `frac` même en mode « continu ». Une interpolation sous-tick nécessiterait de recalculer `frac` au niveau de la milliseconde ; optimisation autorisée mais non requise.

**Mode strict (opt-in).** Une case à cocher **dans le panneau `<details>`** de la clock-card permet d'activer le mode strict — les aiguilles Milli, Beat **et** Blink sautent alors comme Bloc/Centi, sans interpolation. Le choix est persisté dans `localStorage["ats-strict-analog"]`. Défaut : désactivé (hybride). Le Web Component PEUT aussi exposer cela via l'attribut `<ats-clock face="analog" strict>`.

## 8. Animation

Un seul `setInterval` à 100 ms (10 Hz) recalcule les cinq angles. La rédaction du `transform` est sautée si l'angle n'a pas changé (cas du saut Bloc/Centi) — évite la pollution DOM inutile.

Les implémentations PEUVENT utiliser `requestAnimationFrame` pour les aiguilles Milli / Beat / Blink (sous-frame). C'est une optimisation de rendu pure, sans effet sur les valeurs ATS.

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
