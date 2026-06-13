# Le Système Temporel Apollonien (ATS)

**Statut :** Pré-release v0.5
**Symbole :** Δ
**Langue source :** Anglais (le français est une traduction)
**Idée principale :** Remplacer le modèle grégorien *année/mois/semaine + heure locale* par un standard temporel unique, universel, décimal et linéaire, ancré sur un jalon technologique à l'échelle de l'espèce.

---

## 1. Ce qu'est l'ATS

L'ATS est un **compteur continu** ancré sur une époque unique et exprimé en **unités positionnelles en base 10**.

- **Linéaire :** le temps est mesuré comme un nombre de jours (et fractions de jour) écoulés depuis l'époque.
- **Décimal :** toutes les subdivisions sont des puissances de 10.
- **Universel :** un seul temps pour tous, pas de fuseaux horaires internes.

Le résultat est une représentation plus simple à calculer, plus comparable statistiquement, et conçue pour une civilisation en réseau, multi-site, et à terme multi-planétaire.

---

## 2. Époque (Point Zéro)

L'ATS prend pour référence un jalon technologique à l'échelle de l'espèce : **le jour où l'humanité s'est posée pour la première fois sur un autre monde.**

- **Événement :** début du jour de l'alunissage d'Apollo 11 (frontière minuit UTC).
- **Date UTC :** **1969‑07‑20T00:00:00Z**.
- **Valeur ATS :** **`T+ Δ 0.0.0.0.00000`**.
- **Instant exact de l'alunissage** (Eagle s'est posé à 20:17:40Z) : un instant remarquable *à l'intérieur* de Δ 0, situé à **`T+ Δ 0.0.0.0.84560`** — soit Bloc 8, Centi 4, Deka 5, Kin 6 dans la nomenclature intra-jour (voir §4.3).

> **Justification.** Ancrer sur le *début* du 20 juillet 1969 (UTC) — plutôt que sur l'instant de l'alunissage (20:17:40Z) retenu dans les versions antérieures — aligne le compteur de jour avec UTC : **Bloc 5 vaut exactement 12:00 UTC** (5 × 2 h 24 min). Le monde retient la date « 20 juillet 1969 » ; l'ATS conserve cette date et la cale sur la frontière minuit UTC, tout en préservant l'instant exact de l'alunissage comme un point remarquable à l'intérieur de Δ 0.

### 2.1 Ancrages alternatifs (rejetés)

Pour mémoire, d'autres ancrages ont été envisagés puis écartés :

| Candidat | UTC | Raison du rejet |
|---|---|---|
| Instant exact de l'alunissage | 1969‑07‑20T20:17:40Z | Décale le compteur de jour de UTC : Bloc 5 tombe à 08:17:40 UTC au lieu de midi. Pédagogiquement déroutant. |
| Lancement de Spoutnik 1 | 1957‑10‑04T19:28:34Z | Robotique, pas de présence humaine au-delà de la Terre |
| Hiroshima | 1945‑08‑06T08:15:00Z | Marqueur civilisationnel mais négatif |
| Premier vol motorisé (Wright) | 1903‑12‑17T15:35:00Z | Atmosphérique uniquement |
| Lancement Apollo 11 | 1969‑07‑16T13:32:00Z | Début du voyage, pas l'arrivée |
| Premier pas (EVA) | 1969‑07‑21T02:56:15Z | Symbolique, mais l'alunissage le précède et tombe le lendemain UTC (Δ 1) |

---

## 3. Directionnalité : T+ et T-

L'ATS est symétrique autour de l'époque.

- **T+** : temps écoulé **après** l'époque.
- **T-** : temps écoulé **avant** l'époque (compte à rebours historique).

Au quotidien, le symbole Δ implique `T+` par défaut (la majorité de la vie courante se passe post-époque), mais **`T-` doit toujours être explicite**.

---

## 4. Représentation canonique (stockage / interopérabilité)

### 4.1 Syntaxe canonique

```
[DIR] Δ [KIL].[HEC].[DEK].[KIN].[fffff]
```

- `DIR` vaut `T+` ou `T-`.
- `KIL` est **Kilo** — un entier non négatif **non borné**.
- `HEC`, `DEK`, `KIN` sont des chiffres `0..9` (Hecto, Deka, Kin).
- `fffff` est la **fraction de jour** encodée sur 5 chiffres décimaux (0..99999) par défaut — voir §4.4 pour la précision variable.

Exemple (ère actuelle, ~57 ans post-époque — midi UTC, le 13 juin 2026) :

```
T+ Δ 20.7.8.2.50000
```

### 4.2 Unités macro (calendrier)

L'ATS compte des **jours** sur des positions en base 10 :

| Position | Nom | Valeur | Fonction |
|---|---|---|---|
| `....X` | **Kin** | 1 jour | Le jour solaire |
| `...X.` | **Deka** | 10 jours | Cycle de travail-repos |
| `..X..` | **Hecto** | 100 jours | Saison / trimestre de planification |
| `X....` | **Kilo** | 1 000 jours | Mandat / projet pluriannuel |

`Kilo` n'a pas de borne supérieure. Au fil des décennies, le chiffre de tête croît librement (`20.x.x.x`, `100.x.x.x`, ...).

> **Note — "Génération" (informel).** ~10 000 jours (≈27,4 ans) sont familièrement appelés une **Génération**. Ce n'est **pas** un chiffre positionnel du format canonique — il n'existe que dans le discours social/philosophique (voir annexe Philosophie).

### 4.3 Unités micro (horloge)

La fraction de jour est décomposée en places nommées :

| Position | Nom | Fraction | Durée approx. |
|---|---|---|---|
| `.X....` | **Bloc** | 0,1 jour | 2 h 24 min |
| `..X...` | **Centi** | 0,01 jour | 14 min 24 s |
| `...X..` | **Milli** | 0,001 jour | 1 min 26,4 s |
| `....X.` | **Beat** | 0,0001 jour | 8,64 s |
| `.....X` | **Blink** | 0,00001 jour | 0,864 s |

### 4.4 Précision (variable)

La précision canonique par défaut est de **5 chiffres** après la virgule (jusqu'au Blink). Les implémentations peuvent étendre la précision (par ex. 9 chiffres ≈ 0,0086 ms pour la synchronisation scientifique ou réseau) ou la réduire pour l'affichage.

En cas de réduction de précision, voir §6 (politique d'arrondi).

---

## 5. Format conversationnel (UI humaine)

Pour l'usage courant (montres, applis, oral), l'ATS définit une forme **courte** :

```
Δ K.H.D.Kin/cc
```

- `K`, `H`, `D`, `Kin` sont les chiffres **Kilo**, **Hecto**, **Deka**, **Kin** (le Kilo est affiché en entier, potentiellement multi-chiffres ; `Kin` est **toujours affiché**, même à zéro, pour ne jamais perdre la référence calendaire).
- `cc` est composé de deux chiffres de fraction de jour (Bloc + Centi).
- `/` sépare la partie date de la partie fraction, **sans espace** autour, pour rester compact à l'affichage.

Exemple :

```
Δ 20.7.8.2/50
```

**Quand utiliser quoi :**

- **Canonique :** logs, stockage, signature cryptographique, interop. Toujours `.` comme séparateur date/fraction (URL-safe, filename-safe).
- **Court :** UI, montres, conversation. Utilise `/` collé aux chiffres pour la lisibilité.

> **Tolérance d'entrée.** Les parseurs DOIVENT accepter les variantes avec espaces autour du `/` (`Δ 20.7.5.0 / 43`) à la lecture, par tolérance. Mais le format *émis* est strict : aucun espace.

---

## 6. Politique d'arrondi

L'ATS utilise la **troncature stricte (floor)** lors de la réduction de précision pour affichage.

- Un chiffre n'est affiché qu'**une fois l'unité correspondante entièrement écoulée**.
- `0.99999` reste `0.99999` jusqu'à la fin du jour — jamais de retenue prématurée vers `1.00000`.
- Raison : l'ATS est un compteur d'unités *complétées*. Arrondir vers le haut inventerait du temps non écoulé et briserait la monotonie.

Le compteur interne (le `Decimal` de jours écoulés) reste toujours exact ; la troncature ne concerne que les chiffres *affichés*.

> **Pourquoi pas l'arrondi du banquier (half-even) ?** Le half-even convient à la moyenne de mesures (il évite le biais statistique à long terme). Il convient mal à un compteur monotone : un pas half-even peut faire dépasser brièvement la valeur affichée par rapport à l'instant réel. L'ATS privilégie la véracité monotone plutôt que la symétrie statistique.

---

## 7. Politique fuseaux horaires

L'ATS n'a **aucun fuseau horaire interne**.

- Les timestamps ATS sont des *instants globaux* exprimés en UTC.
- L'« Heure Solaire Locale » (LST) peut être présentée comme **surcouche informative** pour le confort humain (« à New York, le soleil se lève vers `.55` »), mais n'est **jamais stockée** dans une valeur ATS.

Les implémentations et interfaces logicielles NE DOIVENT PAS porter de champ fuseau horaire sur un timestamp ATS.

---

## 8. Secondes intercalaires

L'ATS s'aligne sur la sémantique UTC POSIX : **un jour vaut exactement 86 400 secondes**.

- Les secondes intercalaires UTC sont absorbées silencieusement dans le jour standard (comportement identique au temps Unix).
- Une variante future alignée TAI (sans leap seconds) pourrait être définie pour l'aérospatiale ; hors-spec actuelle.

---

## 9. Définition de la conversion

Soit `EPOCH = 1969‑07‑20T00:00:00Z`.

1. Calculer le delta : `delta = now_utc - EPOCH`.
2. Convertir en **jours décimaux** : `days = delta_secondes / 86400`.
3. Si `days >= 0` → `T+`, sinon `T-` avec `abs(days)`.
4. Partie entière → décomposition Kilo/Hecto/Deka/Kin.
5. Partie fractionnaire → `fffff` (multiplier par 100000 ; arrondir selon §6).

Une implémentation Python de référence est fournie dans `code/ats.py`.

---

## 10. Décodage de la forme courte

La forme courte `Δ K.H.D.Kin/cc` est intentionnellement *lossy* :

- Pas de signe (`T+` supposé).
- Fraction sur deux chiffres seulement (Bloc + Centi ; les positions plus fines, Milli/Beat/Blink, sont supposées `0`).
- Le Kilo est affiché en entier — il n'y a **pas de contexte Myriade** à reconstruire.

Les implémentations qui décodent une forme courte en instant grégorien précis DOIVENT marquer le résultat comme approximatif (précision ±~14 min 24 s — la résolution d'un Centi).

---

## 11. Durées (Δd)

Jusqu'au §10, l'ATS décrit des **instants**. Une notation séparée est définie pour les **durées** (deltas entre instants).

### 11.1 Syntaxe

```
T± Δd K.H.D.Kin.fffff
```

- **Signée** depuis v0.6 — voir §11.4. La forme canonique porte explicitement `T+` ou `T-` ; la valeur absolue est notée `|Δd|`.
- Même structure positionnelle qu'un instant (Kilo non borné ; Hecto / Deka / Kin chiffres 0..9 ; fffff chiffres fractionnaires).
- Le préfixe `Δd` ("delta-durée") distingue une durée d'un instant. `Δ` seul désigne toujours un instant.
- Soustraire deux instants ATS produit une durée signée : `Δd = Δ(a) − Δ(b)` (cf. §11.4).

### 11.2 Exemples

- Un Hecto : `T+ Δd 0.1.0.0.00000` (100 jours).
- Une année grégorienne d'usage (~365 j) : `T+ Δd 0.3.6.5.00000`.
- "J'ai vécu 7 Kilos et 893 jours" → `T+ Δd 7.8.9.3.00000`.
- Reculer d'un demi-jour : `T- Δd 0.0.0.0.50000`.

### 11.3 Contraintes

Les durées s'écrivent toujours en forme canonique ; **aucune forme courte** n'est définie. Leur précision suit celle des instants dont elles dérivent — la règle du tronquage au sol (§6) s'applique aux deux côtés.

### 11.4 Algèbre des durées (v0.6+)

L'algèbre suivante définit les seules opérations licites sur les types `Δ` (instant) et `Δd` (durée signée). Toute autre combinaison est indéfinie.

**Signatures.**

| Opération | Type | Résultat |
|---|---|---|
| `Δ + Δd` | (instant, durée) | `Δ` |
| `Δd + Δ` | (durée, instant) | `Δ` |
| `Δ − Δ` | (instant, instant) | `Δd` (signée) |
| `Δ − Δd` | (instant, durée) | `Δ` |
| `Δd + Δd` | (durée, durée) | `Δd` |
| `Δd − Δd` | (durée, durée) | `Δd` |
| `Δd × n` | (durée, scalaire) | `Δd` |
| `Δd ÷ n` | (durée, scalaire) | `Δd` |
| `−Δd` | (durée) | `Δd` (opposée) |
| `|Δd|` | (durée) | `Δd ≥ 0` |

`n` est un entier ou un rationnel arbitraire ; les implémentations qui exposent les durées en virgule flottante documentent leur précision (le port JS de référence utilise `Number`/float64, ~15 digits significatifs).

**Comparaisons.** `< ≤ = ≥ >` sont définies sur deux `Δ` (via le compteur signé de jours, T- < T+) et sur deux `Δd`. La comparaison `Δ ↔ Δd` n'est **pas** définie — ce sont des types disjoints.

**Sémantique du débordement.** Toute opération qui produit un instant ou une durée ré-écrit la forme canonique avec :
- Kilo non borné (peut grandir arbitrairement),
- Hecto, Deka, Kin chiffres 0..9,
- `fffff` arrondi par tronquage au sol (`ROUND_FLOOR`, §6) à `ATS_DECIMALS = 5` chiffres par défaut.

**Identités.** `T+ Δd 0.0.0.0.00000 == T- Δd 0.0.0.0.00000` (la durée zéro est unique) ; idem pour `Δ` à l'époque : `T+ Δ 0.0.0.0.00000 == T- Δ 0.0.0.0.00000`.

**Vecteurs de conformance.** `docs/spec/test-vectors-arithmetic.json` (12 cas) couvre les sept opérations, le débordement Kin→Deka et Deka→Hecto→Kilo, le franchissement d'époque (T+ → T-) et les comparaisons inter-signes.

---

## 12. Encodage binaire

Pour le stockage, l'IoT et l'interop binaire, l'ATS définit un format **64 bits fixes** (big-endian, complément à deux sur le compteur de jours).

```
┌──────┬────────────────────────────────────────────────┬──────────────────────────────┐
│ bit  │            40 bits hauts (jours, signés)       │   24 bits bas (fraction)     │
│      │  T+ pour ≥ 0, T- pour < 0 (compl. à deux)     │  0 .. 16_777_215             │
└──────┴────────────────────────────────────────────────┴──────────────────────────────┘
```

### 12.1 Champs

- **`days`** (int40 signé, complément à deux, big-endian) — nombre de jours ATS pleins écoulés depuis l'époque. Plage : `−2³⁹ .. 2³⁹ − 1` (~ ±1,5 × 10¹¹ jours, bien au-delà de tout horizon astronomique).
- **`frac24`** (uint24 non signé, big-endian) — fraction du jour courant à l'échelle 24 bits : `frac24 = floor(fraction_jour × 2²⁴)`. Donne ≈ 5,15 ms de résolution.

### 12.2 Encodage

Pour un instant de signe `s ∈ {T+, T-}`, compteur entier `D ≥ 0`, fraction de jour `f ∈ [0, 1)` :

```
days = D si s == T+ sinon -D
frac24 = floor(f × 16_777_216)
out = (days << 24) | frac24      # décalage arithmétique ; 64 bits au total
```

### 12.3 Propriétés

- Une valeur ATS canonique (5 chiffres frac, résolution ≈ 864 ms) fait un round-trip **sans perte** par cet encodage binaire, car 24 bits (≈ 5,15 ms) sont plus fins.
- **La comparaison byte-à-byte donne l'ordre chronologique uniquement à l'intérieur d'une même classe de signe.** Entre deux instants T+ (jours ≥ 0), `memcmp` équivaut à l'ordre chronologique. Entre deux T-, c'est également vrai (plus proche de l'époque ⇒ plus grand `memcmp`, ce qui correspond à « moins loin dans le passé »). Pour une comparaison **mixte T+/T-**, `memcmp` brut ne donne **pas** l'ordre chronologique (les valeurs T- en complément à deux commencent par `FF…` et triées après les T+ qui commencent par `00…`) ; utiliser une comparaison d'entier signé sur le champ jours. Une variante future pourrait adopter une représentation biaisée (`jours + 2³⁹`) pour rendre `memcmp` globalement chronologique.
- La valeur tout-zéro est l'époque (`T+ Δ 0.0.0.0.00000`).

### 12.4 Octets de référence (test vector)

| Instant | Binaire (hex, big-endian) |
|---|---|
| Époque (`T+ Δ 0.0.0.0.00000`) | `00 00 00 00 00 00 00 00` |
| Époque + 1 jour | `00 00 00 00 01 00 00 00` |
| Époque − 1 jour | `FF FF FF FF FF 00 00 00` |

---

## 13. Non-objectifs

- L'ATS ne préserve ni les mois, ni les jours de la semaine, ni les cycles religieux.
- L'ATS n'encode pas directement le midi solaire local.
- L'ATS ne légifère pas le rythme travail/repos. La Deka (10 jours) est une unité de mesure, pas un mandat social.
- L'ATS n'est pas "plus spirituel" : c'est un standard computationnel universel.

---

## 14. Annexes

- **Philosophie** (`philosophy.md`) — pourquoi l'ATS : alignement avec les cycles biologiques (circadien, social, projet, générationnel) ; rituels proposés (Kilo-versaire, Hecto-fête).
- **Comparaison** (`comparison.md`) — l'ATS face à Holocene, International Fixed, Hanke-Henry, Calendrier Républicain, Swatch Internet Time, Darian (Mars).
- **Test vectors** (`test-vectors.json`) — jeu de conformance machine-readable.

---

## 15. Versionnement

Cette spec est en **v0.5 (pré-release)**.

### Différences avec v0.3.x (« RC v1.1 », précédente pré-release)

- **Époque déplacée** de l'instant d'alunissage (1969‑07‑20T20:17:40Z) au **début du jour de l'alunissage** (1969‑07‑20T00:00:00Z). C'est un **breaking change** : toute valeur ATS produite par les versions antérieures est décalée de 73 060 s ≈ 0,84560 jour. Le projet étant encore en pré-v1, **aucun convertisseur n'est fourni** : les consommateurs doivent régénérer leurs valeurs.
- **Conséquence directe :** Bloc 5 = 12:00 UTC exactement. L'instant exact de l'alunissage devient un point remarquable à l'intérieur de Δ 0, à `T+ Δ 0.0.0.0.84560`.
- §2.1 enrichi d'une ligne : l'« instant exact de l'alunissage » devient lui-même un ancrage rejeté (décale Bloc 5 de UTC).
- Exemples chiffrés §4.1 et §5 mis à jour.
- §9 (définition de la conversion) mis à jour.

### Antérieur (conservé pour mémoire) — changements qui définissaient la RC v1.1 (désormais dépassée)

- Myriade retirée du format positionnel ; le Kilo devient non borné. « Génération » rétrogradée au vocabulaire informel.
- L'unité 0,1 jour renommée `D-Day` → `Bloc`.
- Forme courte : séparateur changé de `|` à `/`, sans espace autour ; le chiffre `Kin` est désormais **toujours affiché** (même à zéro) pour préserver la référence calendaire.
- Politique d'arrondi : troncature stricte (floor). Une variante banker's half-even envisagée brièvement plus tôt a été rejetée comme incompatible avec le principe « compteur d'unités complétées ».
- Couche Local Solar Time (LST) explicitement introduite.
- Politique leap seconds explicitement alignée POSIX.
- Règles de décodage de la forme courte documentées (perte d'information intentionnelle).
- Philosophie et comparaison déplacées en annexes.
- Ajout du §11 (Durées / `Δd`) et du §12 (Encodage binaire 64 bits).
- Annexes renumérotées §14, Versionnement §15.
