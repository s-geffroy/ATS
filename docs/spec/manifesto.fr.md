# Le Système Temporel Apollonien (ATS)

**Statut :** Release Candidate v1.1
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

L'ATS prend pour référence un jalon technologique à l'échelle de l'espèce.

- **Événement :** alunissage du module *Eagle* d'Apollo 11.
- **Date UTC :** **1969‑07‑20T20:17:40Z**.
- **Valeur ATS :** **`T+ Δ 0.0.0.0.00000`**.

> **Justification.** L'alunissage — et non le premier pas (1969‑07‑21T02:56:15Z) — est retenu comme marqueur d'espèce : c'est l'instant où l'enveloppe humaine s'est *posée* pour la première fois sur un autre corps céleste, et c'est la date que le monde retient ("20 juillet 1969").

### 2.1 Ancrages alternatifs (rejetés)

Pour mémoire, d'autres jalons techno-civilisationnels ont été envisagés puis écartés :

| Candidat | UTC | Raison du rejet |
|---|---|---|
| Lancement de Spoutnik 1 | 1957‑10‑04T19:28:34Z | Robotique, pas de présence humaine au-delà de la Terre |
| Hiroshima | 1945‑08‑06T08:15:00Z | Marqueur civilisationnel mais négatif |
| Premier vol motorisé (Wright) | 1903‑12‑17T15:35:00Z | Atmosphérique uniquement |
| Lancement Apollo 11 | 1969‑07‑16T13:32:00Z | Début du voyage, pas l'arrivée |
| Premier pas (EVA) | 1969‑07‑21T02:56:15Z | Symbolique, mais l'alunissage le précède |

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

Exemple (ère actuelle, ~57 ans post-époque) :

```
T+ Δ 20.7.5.6.43210
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
Δ K.H.D / cc
```

- `K`, `H`, `D` sont les chiffres **Kilo**, **Hecto**, **Deka** (le Kilo est affiché en entier, potentiellement multi-chiffres).
- `cc` est composé de deux chiffres de fraction de jour (Bloc + Centi).
- `/` sépare la partie date de la partie fraction.

Exemple :

```
Δ 20.7.5 / 43
```

**Quand utiliser quoi :**

- **Canonique :** logs, stockage, signature cryptographique, interop. Toujours `.` comme séparateur date/fraction (URL-safe, filename-safe).
- **Court :** UI, montres, conversation. Utilise `/` pour la lisibilité.

> **Note — `Kin` est omis dans la forme courte.** Le Bloc/Centi suffisent à la planification humaine quotidienne. Si Kin est nécessaire (référence calendaire non ambiguë), utiliser le canonique.

---

## 6. Politique d'arrondi

L'ATS utilise l'**arrondi du banquier (half-even, défaut IEEE 754)** lors de la réduction de précision pour affichage.

- Un chiffre se terminant en `.5` est arrondi au pair le plus proche.
- Raison : évite le biais statistique sur les agrégations massives.

> **Compromis.** L'arrondi du banquier peut *occasionnellement* arrondir vers le haut (par ex. `…99500` → `…00000` avec retenue), ce qui contredit le principe v1.0 "ne jamais inventer de futur". Ce compromis est accepté pour la neutralité statistique. Les implémentations exigeant la monotonie stricte peuvent utiliser la **troncature (floor)** comme variante documentée.

Le compteur interne (le `Decimal` de jours écoulés) reste toujours exact ; l'arrondi ne concerne que les chiffres *affichés*.

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

Soit `EPOCH = 1969‑07‑20T20:17:40Z`.

1. Calculer le delta : `delta = now_utc - EPOCH`.
2. Convertir en **jours décimaux** : `days = delta_secondes / 86400`.
3. Si `days >= 0` → `T+`, sinon `T-` avec `abs(days)`.
4. Partie entière → décomposition Kilo/Hecto/Deka/Kin.
5. Partie fractionnaire → `fffff` (multiplier par 100000 ; arrondir selon §6).

Une implémentation Python de référence est fournie dans `code/ats.py`.

---

## 10. Décodage de la forme courte

La forme courte `Δ K.H.D / cc` est intentionnellement *lossy* :

- Pas de signe (`T+` supposé).
- Pas de chiffre Kin (`0` supposé au décodage).
- Fraction sur deux chiffres seulement (le reste est `0`).
- Le Kilo est affiché en entier — il n'y a **pas de contexte Myriade** à reconstruire.

Les implémentations qui décodent une forme courte en instant grégorien précis DOIVENT marquer le résultat comme approximatif (précision ±1 jour, ±~14 minutes).

---

## 11. Non-objectifs

- L'ATS ne préserve ni les mois, ni les jours de la semaine, ni les cycles religieux.
- L'ATS n'encode pas directement le midi solaire local.
- L'ATS ne légifère pas le rythme travail/repos. La Deka (10 jours) est une unité de mesure, pas un mandat social.
- L'ATS n'est pas "plus spirituel" : c'est un standard computationnel universel.

---

## 12. Annexes

- **Philosophie** (`philosophy.md`) — pourquoi l'ATS : alignement avec les cycles biologiques (circadien, social, projet, générationnel) ; rituels proposés (Kilo-versaire, Hecto-fête).
- **Comparaison** (`comparison.md`) — l'ATS face à Holocene, International Fixed, Hanke-Henry, Calendrier Républicain, Swatch Internet Time, Darian (Mars).

---

## 13. Versionnement

Cette spec est en **v1.1**. Différences avec v1.0 :

- Époque déplacée du premier pas (21/07 02:56:15Z) à l'alunissage (20/07 20:17:40Z).
- Myriade retirée du format positionnel ; le Kilo devient non borné. "Génération" est rétrogradée au vocabulaire informel.
- L'unité 0,1 jour est renommée `D-Day` → `Bloc`.
- Séparateur de la forme courte changé de `|` à `/`.
- Politique d'arrondi changée de troncature stricte à banker's half-even (compromis documenté).
- Couche Local Solar Time (LST) explicitement introduite.
- Politique leap seconds explicitement alignée POSIX.
- Règles de décodage de la forme courte documentées (perte d'information intentionnelle).
- Philosophie et comparaison déplacées en annexes.
