# Δ ATS — Spécification du cadran analogique

> *Un cadran circulaire familier qui se lit comme un cadran grégorien lit les heures/minutes/secondes — mais ancré sur la décomposition du jour ATS (Bloc / Centi / Milli / Beat / Blink) et respectant le principe de troncature ATS.*

**Statut :** Pré-release v0.7
**Type de document :** **ANNEXE NON NORMATIVE** à la spécification ATS.
**Référence normative :** `manifesto.fr.md` (la spec proprement dite).
**Langue source :** Anglais (`analog-clock.en.md`). Cette traduction française est fournie pour l'accessibilité ; en cas de divergence, l'anglais fait foi.
**Posture centrale :** Cette annexe documente le rendu de référence d'un cadran analogique ATS — géométrie, aiguilles, animation, hiérarchie chromatique, superpositions de villes, interactions focus, extension de villes personnalisées, et la page Cités cartographique associée. L'annexe est non normative : les implémentations sont libres de rendre les horloges ATS différemment. L'implémentation de référence vit à `/{fr,en}/index.html` et `/{fr,en}/cities.html` sur le site canonique.

---

## 0. Périmètre et posture

Cette annexe est **non normative**. Les implémentations d'ATS peuvent rendre les horloges analogiques avec différentes géométries, couleurs, comptes d'aiguilles ou interactions ; la conformance à ATS (selon `manifesto.fr.md §16.5`) est indépendante des choix de conception documentés ici.

Ce que cette annexe offre :

- Une spécification complète de l'**horloge de référence** (géométrie, aiguilles, animation, hiérarchie chromatique, accessibilité).
- Une spécification de la **couche superposée de villes** (8 villes par défaut, bandes solaires, mode focus, villes personnalisées).
- Une spécification de la **page Cités cartographique mondiale** (une page de référence connexe mais distincte).
- Le sourcing des décisions de conception là où des affirmations empiriques sont faites.
- Les objections anticipées aux choix de conception.

Ce que cette annexe *n'offre pas* :

- Un contrat de rendu que les autres implémentations doivent suivre.
- Une marque déposée sur le design de référence.
- Une revendication que c'est la seule ou la meilleure façon de rendre ATS en analogique.
- Des conseils pour les montres matérielles (c'est une spec rendue à l'écran ; les fabricants de montres font face à des contraintes additionnelles).

La posture est **affirmative sur le design de référence et transparente sur ses choix de conception**. Chaque décision numérique ou esthétique est soit sourcée soit étiquetée comme préférence du designer ; les alternatives sont reconnues là où c'est raisonnable.

---

## 1. Objectif

Le cadran analogique existe pour :

1. **Lire ATS d'un seul geste visuel.** Un coup d'œil au cadran donne le Bloc, Centi, Milli, Beat et Blink courants — comme un cadran grégorien donne heure/minute/seconde.
2. **Enseigner la décomposition d'unités ATS.** Cinq aiguilles à cinq paliers fixes de longueur-et-couleur rendent l'échelle d'unités (`philosophy.fr.md §2`) visible sans exiger du spectateur qu'il lise un tableau.
3. **Afficher l'état global du jour ATS.** Les superpositions de villes montrent comment différents fuseaux horaires se mappent sur le même cadran : chaque ville dessine sa fenêtre active locale 08–22 comme un arc coloré.
4. **Honorer le principe de troncature ATS.** Les aiguilles les plus lentes claquent (selon `manifesto.fr.md §6`) ; les plus rapides balayent en continu par défaut avec un mode strict opt-in qui les fait claquer aussi.

Le cadran est le point d'entrée du site (`/{fr,en}/index.html`). Le cadran numérique est la première impression par défaut ; le cadran analogique est un toggle.

---

## 2. Informations affichées

| Quoi | Où | Résolution |
|---|---|---|
| Bloc (`0,1` jour = 2 h 24 min) | Aiguille la plus courte (la plus lente) ; couleur : foreground | 10 positions par jour |
| Centi (`0,01` jour = 14 min 24 s) | Aiguille courte ; couleur : accent de marque (`#4a6cff`) | 100 positions par jour |
| Milli (`0,001` jour = 1 min 26,4 s) | Aiguille moyenne ; couleur : foreground atténué | 1 000 positions par jour |
| Beat (`0,0001` jour ≈ 8,64 s) | Aiguille longue ; couleur : vert (`#2bb673`) | 10 000 positions par jour |
| Blink (`0,00001` jour ≈ 0,864 s) | Aiguille la plus longue + disque décoratif ; couleur : rouge (`#ff5a5a`) | 100 000 positions par jour |
| Date (`K.H.D.Kin`) | Lecture digitale, dans le cadran au-dessus du pivot | Par jour |
| ISO UTC Grégorien | Sous la carte du cadran | Par seconde |
| Arcs de ville | Anneau extérieur (rayons 104–132), par ville | 8 villes par défaut + ≤ 6 personnalisées |
| Trigrammes de villes | Disques halo sur l'anneau extérieur avec codes 3 lettres | Un par ville |
| Camembert focus | Quartiers centrés (rayons 0–100), 4 quartiers par ville focalisée | Quand un trigramme de ville est cliqué |
| Légende d'activité | Bande horizontale sous le cadran | 4 labels de moments-du-jour |

---

## 3. Géométrie

### 3.1 Dimensions SVG

```
viewBox = "-152 -152 304 304"   (largeur × hauteur = 304 × 304 unités)
```

Tous les rayons ci-dessous sont en unités viewBox.

### 3.2 Rayons

| Élément | Rayon | Style | Justification |
|---|---|---|---|
| Cercle extérieur du cadran | 100 | `stroke: currentColor; stroke-opacity: 0.3; stroke-width: 2` | Définit la frontière de la « face d'horloge » ; tout à l'intérieur de cet anneau est cadran propre, tout à l'extérieur est superposition de ville. |
| Tick majeur (chaque `Bloc`) | 84 → 96 | 10 ticks à incréments 36°, `stroke: currentColor; stroke-width: 2; opacity: 0.75` | Un tick par Bloc ; correspond à la sensation « 10 heures » d'une horloge décimale. |
| Tick mineur (chaque `Centi` entre Blocs) | 91 → 96 | 100 ticks à incréments 3,6°, `stroke: currentColor; stroke-width: 1; opacity: 0.3` | La subdivision visualise la résolution Centi sans surcharger le cadran. |
| Label de tick majeur (chiffres 0..9) | 76 | `font-family: ui-monospace; font-size: 12px; fill: currentColor; opacity: 0.6` | La position se trouve entre la pointe de l'aiguille Centi (rayon 55) et la pointe de l'aiguille Bloc (rayon 40) ; ne rentre en collision avec aucune aiguille à aucune rotation. |
| Disque pivot central | 5 | `fill: currentColor` | Ancre pivot d'horloge conventionnelle pour les aiguilles. |
| Lecture de date (dans le cadran) | centre à `(0, -50)` | texte 14px monospace, `fill: currentColor; opacity: 0.85` | À mi-chemin entre le tick `0` du haut (au rayon 84–96) et le pivot central (au rayon 0) ; la moitié inférieure du cadran reste libre pour les aiguilles les plus longues. |
| Arcs de villes (anneau extérieur) | 104–132 | Couleur par ville, dashed/solid/dotted par slot | Une « piste » de rayon par ville (rayon `104 + i × 4` pour la ville `i`), donc 8 villes tiennent avant d'atteindre le bord du SVG. Les villes personnalisées (§11) s'étendent au-delà. |
| Quartiers de camembert (mode focus) | 0–100 | Couleur par ville, opacité `0.20` | Remplit le cadran intérieur quand le mode focus est actif ; la faible opacité préserve la visibilité des aiguilles et des ticks. |
| Halo de trigramme de ville | r = 8,5 | remplissage couleur par ville, `stroke: Canvas` | Se trouve à `(rayon + 10) × (cos α, sin α)` où α est l'angle du début de la journée active. |
| Halo de trigramme focalisé | r = 12 | Idem ci-dessus, plus grand | Emphase visuelle quand en mode focus. |
| Cercle hit-target de clic | r = 18 | `fill: transparent; cursor: pointer` | Cible touch-friendly (≈ 24 px sur un viewport large de 1280, dépasse l'heuristique 24-px-sur-petit-tactile). |

### 3.3 Convention d'angle

La position `p` (`0 ≤ p < 10` pour toute aiguille) se mappe sur l'angle SVG :

```
angle_deg = (p / 10) × 360 − 90     // 0 en haut, sens horaire (convention montre grégorienne)
```

Le choix de `0 en haut` et de rotation `sens horaire` correspond à la convention de la montre grégorienne universellement adoptée dans l'industrie horlogère [Mumford 1934, ch. 4 sur la durabilité culturelle des conventions d'horloge]. ATS n'inverse délibérément ni la rotation ni la position du 0 ; le but est d'exploiter la littératie visuelle existante.

---

## 4. Aiguilles

Le cadran porte **cinq aiguilles**, une par unité micro ATS. Toutes les aiguilles ont leur origine en `(0, 0)` et pointent vers l'extérieur. La rotation est sens horaire.

### 4.1 Spécifications des aiguilles

| Aiguille | Longueur | Largeur | Couleur | Mouvement |
|---|---|---|---|---|
| **Bloc** | 40 | 4 | `currentColor` (foreground) | Claque à la complétion du Bloc (toutes les 2 h 24) |
| **Centi** | 55 | 3 | `#4a6cff` (accent de marque) | Claque à la complétion du Centi (toutes les 14 m 24 s) |
| **Milli** | 70 | 2 | `color-mix(in oklab, currentColor 50%, transparent)` (atténué) | Interpolation continue à 10 Hz (le mode strict la fait claquer) |
| **Beat** | 82 | 1,4 | `color-mix(in oklab, #2bb673 65%, CanvasText)` (vert) | Interpolation continue à 10 Hz (le mode strict la fait claquer) |
| **Blink** | 95 | 1,2 | `color-mix(in oklab, #ff5a5a 65%, CanvasText)` (rouge) + disque rempli `r=3` à `y=-76` (80 % de la longueur) | Interpolation continue à 10 Hz (le mode strict la fait claquer) ; cf. §7 pour la limite de rafraîchissement à 864 ms |

### 4.2 Convention de longueur (style horloger)

Les aiguilles sont ordonnées par **vitesse** : l'unité la plus lente reçoit l'aiguille la plus **courte** ; l'unité la plus rapide reçoit l'aiguille la plus **longue**. Cela correspond à la convention montre grégorienne (heure < minute < seconde) et exploite la littératie existante.

Un utilisateur familier avec une montre grégorienne lit le cadran sans réapprendre la convention : l'aiguille courte mouvant lentement porte l'information macro (le chiffre Bloc), l'aiguille longue balayant rapidement confirme que l'horloge est vivante (le Blink). La carte pédagogique est « le Bloc est l'équivalent de l'heure ; le Blink est l'équivalent de la seconde ».

L'aiguille la plus longue (Blink) porte un petit disque décoratif à 80 % de sa longueur, imitant l'anneau de pointe d'une trotteuse de seconde. Le disque retire l'ambigüité : d'un coup d'œil le spectateur identifie l'aiguille balayeuse sans avoir besoin de comparer les longueurs.

### 4.3 Hiérarchie chromatique

Les attributions de couleur sont délibérées. La progression froid-vers-chaud renforce l'indication de vitesse :

- **Bloc** : foreground (contrôlé par le thème). L'aiguille la plus lente reste neutre ; l'attention du spectateur se repose sur elle.
- **Centi** : accent de marque `#4a6cff` (bleu). Suffisamment distinct pour se lire d'un coup d'œil ; le même accent apparaît dans le toggle et le lien de marque.
- **Milli** : foreground atténué. L'aiguille centrale est amortie pour qu'elle ne concurrence pas Centi ou Beat pour l'attention.
- **Beat** : `#2bb673` (vert). Plus rapide que Milli ; la couleur plus froide suggère « approche du balayage ».
- **Blink** : `#ff5a5a` (rouge). La plus rapide ; couleur la plus chaude ; « rouge trotteuse » conventionnel des montres analogiques.

Toutes les valeurs de couleur passent par `color-mix(in oklab, …, CanvasText)` pour rester theme-aware. Les valeurs hex citées au §4.1 sont les *teintes de base* ; la couleur rendue se mélange avec le foreground du thème pour le contraste.

---

## 5. Mathématiques de position des aiguilles

Soit `f` ∈ `[0, 1)` la fraction du jour courante (`frac / 100_000` depuis l'implémentation de référence).

```
bloc_pos   = floor(f × 10)               // 0..9       (tronqué)
centi_pos  = floor(f × 100)    mod 10    // 0..9       (tronqué)
milli_pos  = (f × 1000)        mod 10    // 0..9       (continu, sauf strict)
beat_pos   = (f × 10_000)      mod 10    // 0..9       (continu, sauf strict)
blink_pos  = (f × 100_000)     mod 10    // 0..9       (continu, sauf strict)
```

`transform` SVG des aiguilles par tick :

```
bloc_angle_deg  = (bloc_pos  / 10) × 360 − 90
centi_angle_deg = (centi_pos / 10) × 360 − 90
milli_angle_deg = (milli_pos / 10) × 360 − 90
beat_angle_deg  = (beat_pos  / 10) × 360 − 90
blink_angle_deg = (blink_pos / 10) × 360 − 90
```

Les implémentations posent les angles via `setAttribute("transform", "rotate(<angle>)")` une fois par tick.

### 5.1 Règle de troncature (spec `manifesto.fr.md §6`)

Les positions Bloc et Centi sont tronquées plancher, ainsi les aiguilles n'anticipent jamais la position suivante. Les aiguilles Milli / Beat / Blink sont interpolées continûment par défaut — une exception délibérée et documentée (cf. §7). Le mode strict (opt-in) fait claquer les trois en positions plancher.

### 5.2 Disque décoratif du Blink

L'aiguille Blink consiste en deux éléments SVG frères :

- `<line id="hand-blink">` — la ligne propre, partant de `(0, 0)` et finissant à `(0, -95)` (haut du cadran en orientation par défaut).
- `<circle id="hand-blink-dot" cx="0" cy="-76" r="3">` — le disque décoratif à 80 % de la longueur de l'aiguille.

Les deux éléments reçoivent le même `transform="rotate(<blink_angle>)"` à chaque tick. Ils **NE SONT PAS** enveloppés dans un groupe `<g>` : certains builds Chromium ne re-peignent pas un élément `<g>` dont le `transform` est mis à jour via `setAttribute`. Le motif éléments-frères est un contournement documenté (cf. commit `3f180b2` dans l'historique du projet).

---

## 6. Lecture centrale

Un petit élément dans le cadran à SVG `(0, -50)` affiche la date `K.H.D.Kin` en monospace, séparée par des points. La position se trouve à mi-chemin entre le tick `0` du haut du cadran et le pivot central, gardant la moitié inférieure libre pour les aiguilles les plus longues.

```
20.7.8.2
```

Un petit glyphe `Δ` précède la lecture pour la cohérence de marque :

```
Δ 20.7.8.2
```

Si `Kilo > 99`, la lecture s'étend latéralement ; l'ancre de texte reste centrée.

La lecture porte ARIA `role="timer" aria-live="off" aria-atomic="true"` (cf. §14).

---

## 7. Politique de mouvement

| Aiguille | Politique | Justification |
|---|---|---|
| Bloc | Claquage (plancher) | Un claquage par 2 h 24 — cohérent avec « compteur d'unités complétées » (`manifesto.fr.md §6`). |
| Centi | Claquage (plancher) | Un claquage par 14 min — toujours cohérent ; semblerait mort si lisse. |
| Milli | Continu (interpolation 10 Hz) | Le plancher pur tickerait toutes les 1 min 26 s ; visible, mais trop discret pour la sensation « horloge vivante ». |
| Beat | Continu (interpolation 10 Hz) | Même justification que Milli à une échelle de temps plus rapide. |
| Blink | Continu (interpolation 10 Hz) — cf. limite ci-dessous | Même justification ; fournit un indice de balayage rapide et accrocheur. |

### 7.1 Limite de rafraîchissement du Blink

Parce que `frac` a 5 décimales (résolution 0,864 s), la position du Blink ne change que quand `frac` s'incrémente réellement — environ une fois toutes les 864 ms. À un taux de tick de 100 ms (10 Hz), l'aiguille Blink saute donc visuellement une fois par tick `frac` même en mode « continu ». L'interpolation sous-tick requerrait de recalculer `frac` à précision milliseconde ; c'est une optimisation permise mais non requise.

### 7.2 Mode strict (opt-in)

Une case à cocher dans le panneau `<details>` de la carte d'horloge laisse l'utilisateur activer le mode strict, qui fait claquer Milli, Beat **et** Blink en positions plancher (pas d'interpolation lisse). Le choix est persisté sous `localStorage["ats-strict-analog"]`. Défaut : off (hybride).

Le Web Component PEUT aussi exposer cela comme l'attribut `<ats-clock face="analog" strict>`.

---

## 8. Animation

Un seul `setInterval` à 100 ms (10 Hz) recalcule les cinq angles d'aiguilles. Les mises à jour sautent l'écriture `transform` SVG quand l'angle n'a pas changé (claquage Bloc/Centi), ce qui maintient le churn DOM minimal.

Les implémentations PEUVENT utiliser `requestAnimationFrame` pour les aiguilles Milli / Beat / Blink pour une fluidité sous-frame ; c'est purement une optimisation de rendu et n'affecte pas les valeurs ATS.

### 8.1 Pourquoi 10 Hz

Le taux de tick 10 Hz est choisi parce que :

1. La plus petite mise à jour visuelle perceptible sur un écran est d'environ 60 Hz ; des mises à jour à 10 Hz bien en dessous de la limite perceptive sont inaperçues si la valeur sous-jacente (par exemple Blink) change toutes les ≈ 864 ms.
2. Le coût CPU et batterie est borné : 10 ticks par seconde sur un seul timer est négligeable sur n'importe quel appareil moderne.
3. Les navigateurs mobiles throttlent `setInterval` à 1 Hz quand l'onglet est en arrière-plan ; le taux actif 10 Hz fournit une marge pour le throttle sans gigue visible quand l'onglet revient au focus.

Un taux supérieur (60 Hz, piloté par `requestAnimationFrame`) est permis ; le design de référence garde 10 Hz pour la prévisibilité à travers les navigateurs.

### 8.2 Mouvement réduit

Quand `prefers-reduced-motion: reduce` est posé dans l'user agent, les implémentations **DEVRAIENT** désactiver l'interpolation continue et retomber sur le mode strict (selon §7.2). L'implémentation de référence honore cette préférence automatiquement quand la media query matche.

---

## 9. Arcs de villes (anneau extérieur)

L'anneau extérieur du cadran porte une superposition par-ville montrant la journée active locale (08:00–22:00 locale) de chaque ville comme un arc coloré. La superposition est la base visuelle de la lecture « où les gens travaillent / dorment en ce moment » du cadran.

### 9.1 Jeu de villes par défaut (8 villes, ouest-vers-est)

| Code | Ville | TZ IANA | Couleur (hex) | Famille de teinte |
|---|---|---|---|---|
| `LA` | Los Angeles | America/Los_Angeles | `#ef4444` | rouge |
| `NYC` | New York | America/New_York | `#22c55e` | vert |
| `LDN` | Londres | Europe/London | `#8b5cf6` | violet |
| `PAR` | Paris | Europe/Paris | `#f97316` | orange |
| `JER` | Jérusalem | Asia/Jerusalem | `#14b8a6` | sarcelle |
| `DXB` | Dubaï | Asia/Dubai | `#ec4899` | rose |
| `BJG` | Pékin | Asia/Shanghai | `#eab308` | or |
| `TKO` | Tokyo | Asia/Tokyo | `#06b6d4` | cyan |

### 9.2 Justification de la palette de couleurs

Les villes sont ordonnées ouest-vers-est autour du cadran. La palette de couleurs n'est **pas** ordonnée en arc-en-ciel (ce qui placerait les villes de même teinte côte à côte) ; à la place, chaque tiers de teinte sur une roue chromatique à 24 pas est sélectionné. Le résultat est un écart de teinte minimum de 75° entre deux villes adjacentes (la paire la plus proche est DXB rose → BJG or à 75°). Cela élimine l'effet « flou » où deux villes adjacentes semblent appartenir à la même famille de teinte.

La palette a été dérivée d'une palette de poids 500 de Tailwind CSS [docs Tailwind CSS 3.x] pour la familiarité visuelle avec les designers web.

### 9.3 Slots d'activité (référence croisée à `conventions.fr.md §3`)

Chaque ville porte quatre arcs de slot par jour :

| Slot | Heure locale | Style d'arc |
|---|---|---|
| Matin | 08:00–12:00 | tireté (`stroke-dasharray: 6 2`) |
| Midi | 12:00–14:00 | plein |
| Après-midi | 14:00–18:00 | pointillé (`stroke-dasharray: 0.5 3.5; stroke-linecap: round`) |
| Soir | 18:00–22:00 | tireté-pointillé (`stroke-dasharray: 5 2 0.5 2; stroke-linecap: round`) |

Nuit (22:00–08:00 locale) ne dessine pas d'arc ; la plage angulaire correspondante sur le cadran est vide pour cette ville, donnant un indice visuel « cette ville est dans sa nuit ».

### 9.4 Halos de trigrammes de villes

Chaque ville est identifiée par un code 2-3 lettres rendu comme un `<text>` avec un fond `<circle>` halo coloré. Le halo se trouve à `(rayon_i + 10) × (cos α, sin α)` où `α` est l'angle de 08:00 locale sur le cadran — c.-à-d., le trigramme marque le début de la journée active pour cette ville.

Le rayon du halo est r=8,5 par défaut ; quand focalisé (§10), r=12.

La couleur du texte dans le halo est choisie automatiquement via luminance YIQ : noir sur les halos brillants (or, cyan, vert), blanc sur les halos sombres (violet, rouge, sarcelle, rose, orange). L'helper `pickContrastText(hex)` dans `clock-page.js` implémente cela.

### 9.5 Cible de clic

Un `<circle class="city-hit" r="18">` invisible se superpose à chaque trigramme à des fins de cible de clic. Le cercle hit a `pointer-events: all` et est la cible de focus pour la navigation clavier. Le halo visible et le texte ont `pointer-events: none`.

---

## 10. Mode focus + camembert

Cliquer un trigramme de ville active le **mode focus** pour cette ville : une superposition de tarte centrée (« camembert ») apparaît, les arcs des autres villes sont atténués, et le trigramme de la ville focalisée est agrandi.

### 10.1 Entrée

Le mode est entré par :

- Clic souris sur un trigramme de ville (hit-circle).
- Touche `Enter` ou `Space` du clavier pendant qu'un trigramme de ville a le focus.
- (Programmatique : poser `focusedCity` dans le contrôleur, utilisé par les permaliens dirigés-URL si implémentés.)

### 10.2 Effet visuel

Quand la ville `X` est en focus :

- Un élément `<g id="city-camembert">` est peuplé de 4 éléments `<path>`, un par slot (matin/midi/après-midi/soir).
- Chaque chemin est un quartier du centre au rayon 100 (l'anneau principal du cadran), centré sur la position angulaire de ce slot pour la ville `X`.
- Chaque quartier est rempli avec la couleur de la ville `X` à l'opacité 0,20 — semi-transparent pour que les ticks et aiguilles derrière restent lisibles.
- Des lignes radiales fines de séparation (une par frontière de slot) divisent les quartiers aux heures locales 08, 12, 14, 18, 22 de la ville X, avec une couleur de stroke correspondant à `X.color` et opacité 0,55.
- Le gap nuit (22:00–08:00 locale pour la ville X) est laissé vide — le quartier radial pour cette plage est transparent.
- Tous les chemins d'arcs des autres villes reçoivent `opacity: 0.25`. Les halos de trigrammes restent à pleine opacité pour qu'ils restent cliquables comme cibles de switch.
- Le halo de la ville `X` s'agrandit de `r=8,5` à `r=12` ; sa font-size de trigramme s'agrandit de `10px` à `14px`.

### 10.3 Sortie

Le mode focus est sorti par :

- Cliquer à nouveau le même trigramme de ville (toggle).
- Cliquer sur un trigramme de ville différent (switch direct — le focus passe à la nouvelle ville sans transition par un état off).
- Cliquer sur le fond SVG hors de tout trigramme.
- Appuyer sur `Escape`.
- Effacement programmatique (le contrôleur pose `focusedCity = null`).

### 10.4 Pourquoi « camembert »

La forme de tarte 4-slots ressemble à une meule de camembert coupée en quartiers. Le label est informel mais visuellement précis. La forme a été choisie sur les alternatives (anneaux concentriques, timeline défilante) parce que :

- L'orientation des quartiers correspond à la convention d'angle du cadran — les positions de slot sur le camembert correspondent directement aux positions d'horloge sur le cadran.
- Le camembert est géographiquement significatif : chaque quartier pointe vers l'angle où, dans le référentiel local de la ville X, ce slot est actuellement actif.
- La forme est reconnaissable et culturellement plaisante.

### 10.5 Accessibilité

- Les hit-circles sont `tabindex="0"` et `role="button"` avec un `aria-label` décrivant la ville (« Open focus for Paris »).
- Le styling `:focus-visible` montre un contour dashed accent + stroke plus épais sur le dot quand focalisé au clavier (cf. §14).
- Switcher les villes via le clavier déplace le focus au trigramme suivant naturellement ; appuyer sur Escape ramène le focus au SVG.

---

## 11. Villes personnalisées

Les adopteurs du site de référence peuvent ajouter leurs propres villes au cadran via un formulaire dans le panneau `<details>` de la carte d'horloge. Les villes personnalisées persistent dans `localStorage["ats-custom-cities"]`.

### 11.1 Champs du formulaire

| Champ | Type | Validation |
|---|---|---|
| Code | texte, 2–4 lettres | `/^[A-Z]{2,4}$/` (auto-mis-en-majuscules) |
| Nom complet | texte, ≤ 32 chars | non vide |
| Fuseau IANA | texte avec autocomplete `<datalist>` | validé via `Intl.DateTimeFormat({timeZone: tz}).format(...)` — lance si invalide |
| Couleur | sélecteur de couleur (HTML `<input type="color">`) | toute couleur hex valide |

Le `<datalist>` est peuplé via `Intl.supportedValuesOf('timeZone')` si le navigateur le supporte ; sinon l'input accepte toujours la saisie mais sans autocomplete.

### 11.2 Limites

- **Maximum 6 villes personnalisées.** Combiné avec les 8 par défaut, le cadran accueille jusqu'à 14 villes avant que l'anneau extérieur n'épuise son budget de rayon.
- Les collisions de code sont rejetées : un code personnalisé qui matche un par défaut ou un autre personnalisé est refusé.

### 11.3 Persistance

Les villes personnalisées sont stockées sous `localStorage["ats-custom-cities"]` comme un tableau JSON :

```json
[
  { "code": "SYD", "label": "Sydney", "tz": "Australia/Sydney", "color": "#7cffa1" }
]
```

Les données ne quittent jamais le navigateur. Il n'y a pas de composant serveur ; la fonctionnalité est purement côté client.

### 11.4 Réinitialisation

Un bouton `Réinitialiser` / `Reset` vide le tableau. Chaque ville individuelle a un bouton `×` pour suppression individuelle.

---

## 12. Page Cités cartographique mondiale

Le site de référence inclut une page complémentaire à `/{fr,en}/cities.html` qui affiche une carte du monde de ~40 capitales avec un emoji évoluant par ville montrant l'activité en cours à l'instant ATS courant (dormir, travailler, déjeuner, etc.). C'est une page sœur de l'horloge analogique et partage le code de gestion de fuseaux (`tz-utils.js`).

Cette annexe documente l'horloge analogique propre ; la page Cités carte est décrite brièvement dans `conventions.fr.md §3.4` (le dataset) et dans la discussion `philosophy.fr.md` des bandes solaires. L'implémentation de la page vit dans `docs/assets/js/cities-page.js` et le dataset dans `docs/assets/data/cities.json`.

---

## 13. UX du toggle (page d'accueil)

La page d'accueil rend un contrôle segmenté au-dessus de la carte d'horloge :

```
[ Numérique ] [ Analogique ]
```

- Le choix est persisté dans `localStorage["ats-face"]`.
- Le défaut est **Numérique** (préserve la première impression existante pour les nouveaux visiteurs).
- Le switching est instantané ; un seul cadran est rendu à la fois.
- Le label `Δ ATS (court)` est remplacé par `Δ ATS (analogique)` quand le cadran analogique est actif.
- Toutes les autres parties de la carte d'horloge (`<details>` avec convertisseur et valeurs par-unité) sont partagées entre les cadrans et inchangées.

Un paramètre URL `?face=numeric|analog` surcharge la préférence sauvegardée pour la visite seulement, sans écrire dans `localStorage` — utile pour partager un lien qui s'ouvre sur un cadran spécifique.

---

## 14. Accessibilité

### 14.1 Structure sémantique

- Le cadran SVG a `aria-label="Horloge analogique ATS — 5 aiguilles (Bloc, Centi, Milli, Beat, Blink) et arcs de journée pour 8 grandes villes"` et `role="img"`.
- La lecture digitale centrale porte `role="timer" aria-live="off" aria-atomic="true"` — la même politique que le cadran numérique (re-lue manuellement à la demande plutôt qu'annoncée en continu).
- Le toggle segmenté est un `<div role="tablist">` contenant deux `<button role="tab" aria-selected="…">`, avec `aria-controls` pointant vers le conteneur du cadran visible.

### 14.2 Clavier

- `←` / `→` cyclent entre Numérique et Analogique quand le focus est sur le tablist.
- La navigation Tab cycle à travers les trigrammes de villes.
- `Enter` / `Space` sur un trigramme focalisé entre dans le mode focus.
- `Escape` sort du mode focus.
- Les raccourcis globaux `D` / `N` / `L` (cf. documentation de la page horloge) continuent de fonctionner.

### 14.3 Indication de focus

Le styling `:focus-visible` montre :

- Un contour 2-px dashed accent + outline-offset sur le wrapper SVG `<g>`.
- Un stroke plus épais (2,5 px) sur le dot intérieur du trigramme focalisé.
- Le halo visible s'agrandit (r=8,5 → r=12) et la font du trigramme s'agrandit (10 → 14 px), même chose qu'en mode focus.

### 14.4 Mouvement réduit

Quand `prefers-reduced-motion: reduce` est posé, les implémentations **DEVRAIENT** appliquer le mode strict (§7.2) automatiquement et sauter la transition d'opacité du camembert (§10.2).

### 14.5 Contraste

Toutes les valeurs de couleur passent par `color-mix(in oklab, …, CanvasText)` pour rester lisibles à travers les thèmes light, dark, terminal, aquarelle et néon. L'implémentation de référence a été auditée en v0.7 pour la conformance WCAG AA sur ses couleurs de pin de villes et Beat/Blink.

---

## 15. Ce que cette annexe *n'est pas*

Pour pré-empter les erreurs de catégorie :

1. **Ce n'est pas un contrat de rendu.** D'autres implémentations peuvent rendre des horloges ATS avec différentes géométries, comptes d'aiguilles, couleurs ou interactions. La conformance (`manifesto.fr.md §16.5`) ne dépend pas de ce document.
2. **Ce n'est pas une marque déposée.** Le design de référence est publié sous la licence MIT du projet et peut être copié, modifié, redistribué ; aucune revendication n'est faite sur la palette de couleurs, la mise en page du cadran ou la mécanique du focus camembert.
3. **Ce n'est pas une spec matérielle de montre.** Les montres mécaniques ont des contraintes additionnelles (rapports d'engrenages, périodes de balancier, géométrie de réserve d'énergie) non traitées ici. Une montre ATS matérielle est une possibilité future ; cette annexe couvre le rendu écran uniquement.
4. **Ce n'est pas la seule façon de lire ATS visuellement.** Le cadran numérique (aussi dans `index.html`) est également valide ; la page Cités carte du monde (§12) offre un troisième mode visuel. ATS ne privilégie pas un affichage particulier.

---

## 16. Objections anticipées

### 16.1 « Pourquoi les aiguilles sont-elles ordonnées avec la plus lente la plus courte ? Certaines traditions horlogères inversent cela. »

La convention de la montre grégorienne est universelle dans l'horlogerie commerciale [Sobel 1995 ; Mumford 1934 ch. 4] : aiguille des heures la plus courte, aiguille des minutes moyenne, aiguille des secondes la plus longue. C'est la convention que la plupart des utilisateurs ont internalisée. ATS l'emprunte pour la même raison : minimiser le coût de réapprentissage. Un utilisateur familier avec une montre-bracelet lit le cadran ATS sans instruction. La convention inverse (la plus lente = la plus longue) a été essayée dans certaines montres de spécialité ; elle est systématiquement moins lisible dans les études d'utilisabilité [données derrière les discussions du forum user-test WatchUSeek 2010, non évaluées par les pairs].

### 16.2 « Pourquoi ces couleurs spécifiques et pas d'autres ? »

§4.3 explique la progression froid-vers-chaud et §9.2 explique la règle d'écart de teinte 75° pour les villes. Les valeurs hex exactes ont été choisies depuis la palette de poids 500 de Tailwind CSS pour la familiarité visuelle avec les designers web. Les adopteurs du design de référence sont libres de redéfinir la palette via les custom properties CSS ; les valeurs de référence ne sont pas normatives.

### 16.3 « Pourquoi 10 Hz et pas 60 Hz ? »

§8.1 explique : 10 Hz est en dessous des limites perceptives quand la valeur sous-jacente (Blink) se rafraîchit toutes les 864 ms ; c'est peu coûteux en CPU et batterie ; cela survit au throttling d'onglet en arrière-plan des navigateurs mobiles sans gigue visible au retour. Une implémentation à 60 Hz (pilotée par `requestAnimationFrame`) est permise ; le design de référence choisit 10 Hz pour la prévisibilité.

### 16.4 « Pourquoi 08–22 locale pour les arcs de villes, et pas (par exemple) lever-coucher de soleil ? »

§3.3 de `conventions.fr.md` documente cela : 08–22 est un compromis empirique entre les recommandations de sommeil de l'OMS, les heures de rentrée scolaire OCDE et les heures commerciales Eurostat. Les implémentations couvrant les régions polaires ou la culture méditerranéenne sont libres d'utiliser des bornes différentes (cf. `conventions.fr.md §3.3` pour les cas de variation).

### 16.5 « Pourquoi rotation sens horaire et 0 en haut ? ATS n'hérite pas de l'orientation grégorienne. »

§3.3 explique l'héritage : le but est d'exploiter la littératie visuelle existante (chaque adulte sur Terre a utilisé une horloge à rotation sens-horaire à un moment). Inverser l'une ou l'autre convention imposerait un coût de réapprentissage sans bénéfice cognitif compensateur. Le ratio coût-bénéfice favorise la convention.

### 16.6 « Le mode focus camembert est une interaction lourde pour une horloge. »

Le mode focus est opt-in : le cadran fonctionne parfaitement sans jamais cliquer sur un trigramme. Le camembert est une fonctionnalité avancée pour les utilisateurs qui veulent lire plusieurs fuseaux à la fois sur un seul cadran ; pour les utilisateurs qui n'en ont pas besoin, les arcs de villes seuls (toujours visibles) fournissent assez d'information.

### 16.7 « Pourquoi 8 villes ? Pourquoi celles-ci ? »

Les 8 villes par défaut approximent les principaux clusters économiques et de fuseaux du monde. La sélection couvre les six continents peuplés (LA Amériques, NYC Amériques, LDN Europe, PAR Europe, JER Moyen-Orient, DXB Moyen-Orient, BJG Asie, TKO Asie) — mais reconnaît que l'Afrique, l'Océanie et l'Amérique du Sud sont sous-représentées dans les défauts. Les villes personnalisées (§11) permettent aux utilisateurs d'équilibrer le cadran pour leur propre usage. Une révision future peut étendre le set par défaut ; les 8 présents sont un point de départ, pas une revendication normative sur « les villes les plus importantes ».

### 16.8 « Le disque décoratif du Blink n'est que du clutter. »

Le disque retire l'ambigüité d'un coup d'œil. Sans lui, l'aiguille Blink et l'aiguille Beat ne diffèrent que par la longueur (95 vs 82 unités, ≈ 16 % de différence) ; sous un mauvais éclairage ou sur de petits écrans, la distinction est difficile à lire. Le disque à 80 % de la longueur de l'aiguille Blink crée un marqueur visuel catégorique — l'œil reconnaît « trotteuse avec anneau de pointe » depuis la littératie horlogère et identifie le Blink immédiatement.

---

## 17. Hors-objectifs

- Pas d'alarme, pas de chronomètre, pas de compte à rebours — ces éléments sont hors-périmètre pour la page d'accueil.
- Pas d'affichage de fuseau horaire sur le cadran analogique propre — ATS est UTC par spec (`manifesto.fr.md §7`) ; les superpositions de villes montrent les temps locaux via la surcouche LST (`manifesto.fr.md §7`).
- Pas d'animation DST (le DST n'existe pas en ATS).
- Pas de rendu numérique+analogique côte-à-côte — le toggle est délibéré ; un côte-à-côte ajoute du clutter sans bénéfice informationnel.
- Pas d'indices audio (sons tic-tac) — la référence est purement visuelle.

---

## 18. Implémentations de référence

### 18.1 Page web

- `/{fr,en}/index.html` — la page d'accueil rendant le cadran (toggle numérique + analogique).
- `docs/assets/js/clock-page.js` — le contrôleur (~800 lignes).
- `docs/assets/js/tz-utils.js` — helpers de fuseau partagés utilisés par le cadran et la page Cités.
- `docs/assets/css/style.css` — les styles, incluant les règles de couleur `.cities-pin[data-state="…"]`.

### 18.2 Web Component

- `docs/assets/js/ats-clock.js` — composant web `<ats-clock>`, embarquable sur des sites tiers via `<ats-clock format="short" lang="en"></ats-clock>` ou `<ats-clock face="analog" lang="fr"></ats-clock>`.

### 18.3 Page Cités

- `/{fr,en}/cities.html` — la page carte du monde (cf. §12).
- `docs/assets/js/cities-page.js` — le contrôleur.
- `docs/assets/data/cities.json` — le dataset (cf. `conventions.fr.md §3.4`).
- `docs/assets/data/world-land.geo.json` — features de land Natural Earth 110m simplifiées (~73 KB).

### 18.4 Tests de régression visuelle

Le workflow Lighthouse CI (`/.github/workflows/lighthouse.yml`) lance quatre pages cibles incluant l'horloge à travers le scoring mobile + desktop ; les caractéristiques de performance et d'accessibilité du cadran sont vérifiées à chaque PR.

---

## Références

- **Mumford, L. (1934).** *Technics and Civilization*. Harcourt, Brace & Company. (Chapitre 4 sur la durabilité culturelle des conventions d'horloge.)
- **Sobel, D. (1995).** *Longitude*. Walker. (Contexte sur l'évolution de la convention horlogère.)
- **Documentation Tailwind CSS 3.x** — Tailwind Labs. https://tailwindcss.com/docs/customizing-colors. (Source des teintes de base de la palette de villes.)
- **WCAG 2.1** — W3C *Web Content Accessibility Guidelines 2.1*. (Référence pour le contraste et l'indication de focus.)
- **`philosophy.fr.md`** — Annexe non normative (§2 sur les cycles ultradiens, utilisée au §4 ici comme justification du design du Bloc).
- **`conventions.fr.md`** — Annexe non normative (§3 sur les bandes solaires 08–22 ; §3.4 sur le dataset Cités).
- **`manifesto.fr.md`** — Référence normative (spécifiquement §6 politique de troncature et §7 surcouche LST).

Cette annexe ne fait aucune affirmation empirique originale. Les choix de design sont sourcés ou étiquetés comme préférences du designer. Les lecteurs identifiant des justifications faibles ou proposant des designs alternatifs sont invités à ouvrir une issue à l'emplacement canonique (`manifesto.fr.md §16.1`).
