# ATS — Extension multi-planétaire

**Statut :** Pré-release v0.7
**Type de document :** **ANNEXE NORMATIVE** à la spécification ATS.
**Référence normative :** `manifesto.fr.md` (la spec Terre).
**Langue source :** Anglais (`multi-planetary.en.md`). Cette traduction française est fournie pour l'accessibilité ; en cas de divergence, l'anglais fait foi.
**Symbole générique :** `Δ_<Body>` (ASCII) ou `Δ<symbole astronomique>` (Unicode).
**Thèse centrale :** ATS se généralise de la Terre à n'importe quel corps céleste en paramétrant l'époque et la longueur du jour. La grammaire, l'algèbre, l'encodage binaire et le contrat de conformance de la spec Terre s'appliquent **inchangés**. Terre, Mars et Lune reçoivent des paramètres normatifs en v0.7 ; les corps tiers (Vénus, Europe, exoplanètes, …) utilisent le framework générique défini au §6.

---

## 0. Conventions

### 0.1 Niveaux d'exigence

Les mots clés **DOIT**, **NE DOIT PAS**, **REQUIS**, **DEVRA**, **NE DEVRA PAS**, **DEVRAIT**, **NE DEVRAIT PAS**, **RECOMMANDÉ**, **NON RECOMMANDÉ**, **PEUT** et **OPTIONNEL** dans ce document doivent être interprétés comme décrits dans BCP 14 [RFC 2119, RFC 8174] quand, et seulement quand, ils apparaissent en majuscules.

### 0.2 Glossaire (spécifique à l'extension)

- **Corps** — Un corps céleste pour lequel un compteur ATS est défini : Terre, Mars, Lune, ou tout corps tiers enregistré selon §6.
- **Sol** — Un jour solaire martien. Sol martien moyen = 88 775,244 147 secondes SI [Allison & McEwen 2000].
- **Jour lunaire synodique** — Le temps entre deux levers de soleil successifs au même endroit sur la Lune, ≈ 29,530 588 jours terrestres = 2 551 442,8128 secondes SI [IAU ; Espenak 2014].
- **`Δ_X`** — Le compteur d'instants ATS pour le corps X.
- **`Δd_X`** — Le compteur de durées ATS pour le corps X (quantité signée de jours-X).
- **Suffixe de corps** — Identifiant ASCII (`_Earth`, `_Mars`, `_Moon`, …) ajouté à `Δ` pour désambigüer le corps. Le suffixe Terre PEUT être omis (selon §2.1.3).

### 0.3 Périmètre

Cette annexe spécifie :

- La paramétrisation générique d'un compteur ATS pour n'importe quel corps (§1).
- La notation pour les instants spécifiques à un corps (§2).
- Les paramètres normatifs pour Terre, Mars et Lune (§3).
- La conversion entre ATS local au corps et UTC (§4).
- Les règles d'algèbre inter-corps (§5).
- Le framework générique pour les corps tiers (§6).
- Les engagements de stabilité pour v1.0 (§7).
- La justification des ancrages choisis (§8).
- Les corrections relativistes (§9, non normative).
- Le contrat de vecteurs de conformance (§10).
- Les objections anticipées (§11).
- Les implémentations de référence (§12).

Cette annexe **NE** modifie **PAS** de contenu normatif de `manifesto.fr.md`. La spécification ATS Terre (§§1–17 du manifeste) est inchangée.

---

## 1. Définition générique

### 1.1 Paramètres de corps

Un compteur ATS pour un corps céleste `X` est **complètement défini** par quatre paramètres :

| Paramètre | Type | Contrainte | Sens |
|---|---|---|---|
| `epoch_X` | Instant UTC | exact à la seconde SI | Origine du compteur (l'instant où `Δ_X` vaut `T+ Δ_X 0.0.0.0.00000`). |
| `day_seconds_X` | Decimal positif | > 0, exact à ≥ 6 décimales | Durée du « jour » local, en secondes SI. |
| `suffix_X` | Chaîne ASCII | matche `[A-Za-z][A-Za-z0-9]*` | Suffixe canonique pour la notation ASCII (`_Earth`, `_Mars`…). |
| `symbol_X` | Codepoint Unicode (optionnel) | U+263F–U+2647 pour les corps du système solaire | Symbole astronomique pour la forme d'affichage. |

Une implémentation conformante v0.7 **DOIT** supporter Terre, Mars et Lune avec les paramètres du §3.

### 1.2 Le compteur

Le compteur du corps-X est la fonction :

```
Δ_X(t_UTC) = (t_UTC − epoch_X) / day_seconds_X
```

où :

- `t_UTC` est un instant UTC.
- `t_UTC − epoch_X` est le temps écoulé comme durée en secondes SI (sémantique POSIX selon `manifesto.fr.md §8`).
- La division produit un compte de jours décimal signé.

Le compte de jours signé est ensuite encodé en utilisant la même grammaire positionnelle `K.H.D.Kin.fffff` qu'ATS Terre (`manifesto.fr.md §4.1`) :

- Kilo non borné, signé via `T+` / `T-` (`manifesto.fr.md §3`).
- Chiffres Hecto, Deka, Kin 0..9.
- Fraction par défaut 5 chiffres, tronquée plancher (`manifesto.fr.md §6`).

### 1.3 Les longueurs d'unités varient par corps

Les unités positionnelles (Bloc, Centi, Milli, Beat, Blink) sont des **fractions du jour du corps**, pas des fractions d'un jour terrestre. Concrètement :

- 1 Bloc_Earth = 0,1 × 86 400 s = 8 640 s = 2 h 24 min.
- 1 Bloc_Mars = 0,1 × 88 775,244 147 s ≈ 8 877,52 s ≈ 2 h 27 min 57 s.
- 1 Bloc_Moon = 0,1 × 2 551 442,8128 s ≈ 255 144,28 s ≈ 2 j 22 h 52 min.

C'est intentionnel. La grammaire positionnelle est **invariante** à travers les corps ; les *durées absolues* des micro-unités sont mises à l'échelle de la longueur du jour du corps. Un utilisateur sur Mars travaillant « 3 Blocs » met approximativement la même fraction d'un jour martien qu'un utilisateur Terre travaillant « 3 Blocs » d'un jour terrestre.

---

## 2. Notation

### 2.1 Forme canonique (ASCII)

```abnf
canonical_multibody = direction SP symbol body_suffix SP days "." frac
direction           = "T" ("+" / "-")
symbol              = %xCE.94            ; Δ
body_suffix         = "_" body_id
body_id             = ALPHA *(ALPHA / DIGIT)
days                = kilo "." digit "." digit "." digit
kilo                = 1*DIGIT
frac                = 5*DIGIT
digit               = %x30-39
SP                  = %x20
```

#### 2.1.1 Exemples

```
T+ Δ_Earth 20.7.8.2.50000
T+ Δ_Mars  10.2.8.7.96477
T+ Δ_Moon  0.7.0.3.76180
```

#### 2.1.2 Espaces

Les implémentations **DOIVENT** émettre exactement un espace ASCII entre `direction` et `Δ_<body>`, et exactement un espace ASCII entre `Δ_<body>` et `days`. Le nombre d'espaces dans le suffixe de corps est zéro (pas d'espace entre `_` et l'identifiant du corps).

#### 2.1.3 Rétro-compatibilité Terre

Le `Δ` nu (sans suffixe de corps) **DOIT** être interprété comme `Δ_Earth` dans tout contexte où le corps est implicite. Les implémentations produisant une sortie ASCII **DEVRAIENT** émettre `Δ_Earth` explicitement quand le contexte est multi-corps ; elles **PEUVENT** omettre le suffixe pour les contextes Terre-uniquement (badges Terre-uniquement, embeds, sites mono-planète).

### 2.2 Forme symbolique (affichage Unicode)

Les implémentations ciblant l'affichage humain **PEUVENT** utiliser des symboles astronomiques Unicode au lieu des suffixes de corps ASCII :

| Corps | Symbole | Codepoint | Prononciation |
|---|---|---|---|
| Terre | `Δ⊕` | U+2295 (`Δ` + CIRCLED PLUS) | « delta-terre » |
| Mars | `Δ♂` | U+2642 (`Δ` + MALE SIGN, symbole astronomique Mars) | « delta-mars » |
| Lune | `Δ☾` | U+263E (`Δ` + LAST QUARTER MOON) | « delta-lune » |

Le symbole nu `Δ` (sans marqueur de corps) **DOIT** être interprété comme Terre dans les contextes d'affichage symbolique, conforme au §2.1.3.

### 2.3 Forme courte

La forme courte `ΔK.H.D.Kin-BC.M` (`manifesto.fr.md §5.1`) s'étend aux corps en insérant le suffixe de corps entre `Δ` et le premier chiffre :

```abnf
short_multibody = symbol body_suffix days "-" bc "." milli
                / symbol days "-" bc "." milli              ; rétro-compat Terre
```

Exemples :

```
Δ_Mars 10.2.8.7-96.4
Δ_Moon 0.7.0.3-76.1
Δ20.7.8.2-50.0          ; Terre, suffixe omis (§2.1.3)
```

Les règles du parseur strict de `manifesto.fr.md §5.1` s'appliquent inchangées.

---

## 3. Paramètres pour les corps v1.0

Les trois corps suivants reçoivent des paramètres ATS **normatifs** en v0.7. Ces paramètres deviennent **GELÉS** en v1.0 selon `versioning.fr.md §3.1` (époque) et `multi-planetary.fr.md §7` (engagements de stabilité de cette annexe).

### 3.1 Terre (`Δ_Earth`, `Δ⊕`, ou `Δ` nu)

| Paramètre | Valeur | Source |
|---|---|---|
| `epoch_Earth` | `1969-07-20T00:00:00Z` | `manifesto.fr.md §2` — début du jour de l'alunissage d'Apollo 11. |
| `day_seconds_Earth` | `86_400` | Sémantique POSIX selon `manifesto.fr.md §8.1`. |
| `suffix_Earth` | `_Earth` | Standard. |
| `symbol_Earth` | `⊕` (U+2295) | Symbole astronomique de la Terre. |

### 3.2 Mars (`Δ_Mars`, `Δ♂`)

| Paramètre | Valeur | Source |
|---|---|---|
| `epoch_Mars` | `1997-07-04T16:56:55Z` | Touchdown de la Sagan Memorial Station de Mars Pathfinder dans Ares Vallis [NASA JPL Mission History ; date vérifiée contre les records de mission Pathfinder]. |
| `day_seconds_Mars` | `88_775,244_147` s | Sol martien moyen [Allison & McEwen 2000, *Planetary and Space Science* 48 (2-3), 215–235]. |
| `suffix_Mars` | `_Mars` | Standard. |
| `symbol_Mars` | `♂` (U+2642) | Symbole astronomique de Mars. |

#### 3.2.1 Conséquence numérique

À `2026-06-13T12:00:00Z`, `Δ_Mars` vaut `T+ Δ_Mars 10.2.8.7.96477` (précision 5 chiffres).

#### 3.2.2 Précision de la longueur du jour martien

La valeur `88_775,244_147` s est le **sol martien moyen** moyenné sur une année martienne. La longueur instantanée du sol varie de ±20 s avec l'excentricité orbitale de Mars. v0.7 utilise la valeur moyenne ; les implémentations haute précision **PEUVENT** utiliser la valeur variant dans le temps au prix d'une complexité du contrat de précision. Le paramètre normatif v1.0 est la moyenne.

### 3.3 Lune (`Δ_Moon`, `Δ☾`)

| Paramètre | Valeur | Source |
|---|---|---|
| `epoch_Moon` | `1969-07-20T00:00:00Z` | **Partagée avec la Terre.** Choix doctrinal : la Lune est le satellite de la Terre ; son compteur s'aligne naturellement sur l'événement humain qui lie les deux corps (l'alunissage d'Apollo 11). |
| `day_seconds_Moon` | `2_551_442,8128` s | Jour lunaire synodique moyen = 29,530 588 jours terrestres [IAU ; Espenak 2014]. |
| `suffix_Moon` | `_Moon` | Standard. |
| `symbol_Moon` | `☾` (U+263E) | Symbole astronomique de la Lune. |

#### 3.3.1 Conséquence numérique

À `2026-06-13T12:00:00Z`, `Δ_Moon` vaut `T+ Δ_Moon 0.7.0.3.76180` (précision 5 chiffres). Un `Δ_Moon` complet ≈ 29,53 `Δ_Earth`.

#### 3.3.2 Synodique vs sidéral : justification

La Lune a deux longueurs de jour naturelles :

- **Jour sidéral** : 27,32 jours terrestres. Temps pour une rotation par rapport aux étoiles fixes.
- **Jour synodique** : 29,53 jours terrestres. Temps entre deux levers de soleil successifs à un endroit donné lunaire.

ATS utilise le jour lunaire **synodique** parce que :

1. Les colons lunaires expérimentent le cycle synodique (le cycle lever-coucher de soleil à la surface), pas le sidéral.
2. Le cycle synodique correspond au cycle des phases lunaires observé depuis la Terre — la référence culturelle et observationnelle.
3. Le framework Lunar Crewed Time (NASA Coordinated Lunar Time, 2024) utilise le cycle synodique pour les mêmes raisons.

Le jour sidéral **PEUT** être exposé par les implémentations comme unité additionnelle ; ce n'est pas le jour canonique du corps pour ATS.

---

## 4. Conversion (`Δ_X ↔ UTC`)

Les implémentations conformantes **DOIVENT** implémenter la conversion ci-dessous pour tout corps paramétré selon §1.1. La conversion reflète `manifesto.fr.md §9` avec la longueur du jour locale au corps substituée.

### 4.1 UTC → `Δ_X` (pseudo-code)

```
function utc_to_body_ats(utc: UTCInstant, body: Body) -> BodyATS:
    EPOCH = body.epoch
    DAY_SECONDS = body.day_seconds
    ATS_DECIMALS = 5
    ATS_SCALE = 10 ** ATS_DECIMALS

    delta_seconds = (utc - EPOCH).total_seconds()  # Decimal signé
    total_days = delta_seconds / DAY_SECONDS       # Decimal signé

    if total_days >= 0:
        sign = "T+"
        abs_days = total_days
    else:
        sign = "T-"
        abs_days = -total_days

    integer_days = floor(abs_days)
    frac_int = floor((abs_days - integer_days) * ATS_SCALE)  # plancher 5 chiffres

    kilo, rem  = divmod(integer_days, 1000)
    hecto, rem = divmod(rem, 100)
    deka, kin  = divmod(rem, 10)

    return BodyATS(body=body, sign=sign, kilo=kilo, hecto=hecto, deka=deka, kin=kin, frac=frac_int)
```

### 4.2 `Δ_X` → UTC (pseudo-code)

```
function body_ats_to_utc(ats: BodyATS) -> UTCInstant:
    integer_days = ats.kilo * 1000 + ats.hecto * 100 + ats.deka * 10 + ats.kin
    abs_days = integer_days + ats.frac / 100_000
    signed_days = abs_days if ats.sign == "T+" else -abs_days
    delta_seconds = signed_days * ats.body.day_seconds
    return ats.body.epoch + delta_seconds
```

### 4.3 Invariant de troncature plancher

La même règle de troncature plancher (`manifesto.fr.md §6`) s'applique. La dérive maximale entre `body_ats_to_utc(utc_to_body_ats(t))` et `t` est bornée par `0,864 ms × (day_seconds_X / day_seconds_Earth)` :

- Terre : ≤ 0,864 ms (la dérive Terre standard).
- Mars : ≤ 0,888 ms (≈ 2,7 % plus large parce que le sol Mars est 2,7 % plus long).
- Lune : ≤ 25,5 ms (≈ 29,5× plus large parce qu'un jour Lune synodique est ≈ 29,5 jours Terre).

Les implémentations revendiquant une précision sous-milliseconde sur la Lune **DOIVENT** utiliser une précision étendue (≥ 6 chiffres) selon `manifesto.fr.md §4.4`.

---

## 5. Algèbre inter-corps

### 5.1 L'algèbre intra-corps est préservée

Pour tout corps X, l'algèbre de `manifesto.fr.md §11.4` s'applique **sans modification** :

- `Δ_X + Δd_X → Δ_X` ✓
- `Δd_X + Δ_X → Δ_X` ✓
- `Δ_X − Δ_X → Δd_X` ✓
- `Δ_X − Δd_X → Δ_X` ✓
- `Δd_X + Δd_X → Δd_X` ✓
- `Δd_X − Δd_X → Δd_X` ✓
- `Δd_X × n → Δd_X` pour rationnel `n` ✓
- `Δd_X ÷ n → Δd_X` pour rationnel non-zéro `n` ✓
- Comparaisons `<, ≤, =, ≥, >` sur deux `Δ_X` ou deux `Δd_X` ✓

### 5.2 Les opérations inter-corps sont interdites

Les opérations mélangeant différents corps sont un **COMPORTEMENT INDÉFINI** et les implémentations **DOIVENT** lever une erreur de type :

- `Δ_Mars + Δd_Earth → ERREUR DE TYPE` ✗
- `Δd_Mars + Δd_Earth → ERREUR DE TYPE` ✗
- `Δ_Mars < Δ_Earth → ERREUR DE TYPE` ✗
- `Δ_Mars − Δ_Earth → ERREUR DE TYPE` ✗

### 5.3 Comparaison inter-corps via pont UTC

Pour comparer des instants sur différents corps, les **deux** instants **DOIVENT** être convertis en UTC d'abord :

```
result = body_ats_to_utc(ats_a) < body_ats_to_utc(ats_b)
```

Les implémentations de référence exposent cela comme une méthode `to_utc()` sur le type spécifique au corps. Le résultat est une comparaison UTC standard.

### 5.4 Conversion de durée entre corps

Les durées exprimées en différents jours-de-corps sont convertibles par le ratio des longueurs de jour :

```
Δd_Mars_en_jours_terrestres = Δd_Mars × (day_seconds_Mars / day_seconds_Earth)
                            = Δd_Mars × (88_775,244_147 / 86_400)
                            ≈ Δd_Mars × 1,027 491
```

Les implémentations **PEUVENT** exposer une méthode `to_body(target_body)` qui effectue cette conversion. Le résultat est une durée dans l'unité du corps cible, qui **DOIT** ensuite être ajoutée ou soustraite à un instant dans le référentiel de ce corps.

---

## 6. Framework générique pour corps tiers

### 6.1 Enregistrement

Une implémentation **PEUT** définir `Δ_X` pour n'importe quel corps en enregistrant les quatre paramètres du §1.1 :

```
register_body(
    suffix="_Venus",
    epoch=parse_utc("1989-08-10T03:01:00Z"),  # Insertion orbitale Magellan
    day_seconds=Decimal("10_087_200"),         # Jour vénusien synodique ≈ 116,75 jours terrestres
    symbol="♀"                            # ♀ (U+2640, symbole astronomique de Vénus)
)
```

L'implémentation Python de référence fournit une classe `Body` avec cette interface (`code/ats_multi_planetary.py`).

### 6.2 Règles de collision de suffixe

Les corps tiers partagent l'espace de nommage global des suffixes. Pour prévenir les collisions :

- Les suffixes **DOIVENT** être la forme nominale anglaise préfixée par `_` (par exemple, `_Venus`, `_Jupiter`, `_Europa`).
- Les suffixes sont sensibles à la casse ; `_Venus` et `_venus` sont des chaînes distinctes mais **NE DEVRAIENT PAS** être utilisés simultanément (la convention standard est majuscule initiale).
- Une implémentation publiant un enregistrement de corps **DEVRAIT** vérifier la liste de référence canonique à `docs/spec/multi-planetary-bodies.md` (un registre planifié) avant de revendiquer un suffixe.
- En l'absence d'un registre central, les conflits de suffixe sont résolus par **priorité d'annonce** : le corps enregistré publiquement le premier gagne le suffixe.

### 6.3 Exigences de vecteurs pour corps tiers

Un corps tiers revendiquant la conformance **DEVRAIT** publier un fichier de vecteurs de conformance `test-vectors-multi-planetary-<body>.json` avec le même format que les fichiers Mars et Lune :

- Minimum 5 vecteurs couvrant :
  - L'époque du corps (`T+ Δ_X 0.0.0.0.00000`).
  - Un nombre rond mi-vie (par exemple, `T+ Δ_X 1.0.0.0.00000`).
  - Une fraction complexe (par exemple, `T+ Δ_X 0.0.0.0.50000`).
  - Un instant direction-négative (`T- Δ_X k.h.d.kin.fffff`).
  - Une date ≥ 2100 pour vérifier l'arithmétique long terme.
- `spec_version` mis au MAJEUR.MINEUR de la spec introduisant le corps.

### 6.4 Statut du registre central

Aucune autorité centrale n'enregistre les corps non canoniques en v0.7. Les éditeurs d'enregistrement PEUVENT adopter un enregistrement de corps tiers comme **canonique** (c.-à-d., le déplacer au §3) dans une future release MINEURE via la procédure RFC (`versioning.fr.md §6`).

---

## 7. Stabilité (gel v1.0)

Quand ATS v1.0 ship (selon `versioning.fr.md §7.2`), les éléments suivants de cette annexe deviennent **GELÉS** :

1. Les paramètres Terre §3.1 (aussi gelés par `versioning.fr.md §3.1`).
2. Les paramètres Mars §3.2 (`epoch_Mars`, `day_seconds_Mars`).
3. Les paramètres Lune §3.3 (`epoch_Moon`, `day_seconds_Moon`).
4. La notation §2 : syntaxe de suffixe ASCII, assignations de symbole Unicode, règles de forme courte.
5. L'algorithme de conversion §4 (sémantique du pseudo-code, borne de dérive).
6. Les règles d'algèbre inter-corps §5 (sémantique d'erreur de type).

Modifier l'un d'eux post-v1.0 requiert un nouveau projet (ATS 2, selon `versioning.fr.md §3.8`).

Les corps tiers enregistrés selon §6 **NE SONT PAS** gelés par cette annexe ; ils restent librement ajoutables, modifiables ou rétractables par leurs enregistreurs en releases MINEURES.

---

## 8. Pourquoi ces ancrages spécifiquement

Les choix de Mars Pathfinder et de l'époque Lune partagée avec la Terre sont des décisions contestées ; cette section documente la justification pour que les disputes soient adressables au niveau de la spec.

### 8.1 Pourquoi Mars Pathfinder, pas d'autres atterrissages ?

Les candidats d'ancrage martien et la justification de rejet :

| Candidat | UTC | Raison de rejet / sélection |
|---|---|---|
| **Mars Pathfinder Sagan Memorial Station** | 1997-07-04T16:56:55Z | **SÉLECTIONNÉ.** Premier atterrissage moderne réussi sur Mars (post-Viking) ; date symbolique du 4 juillet correspond au cadrage culturel d'Apollo 11 ; timing précis dans les records publics. |
| Atterrisseur Viking 1 | 1976-07-20T11:53:06Z | Même date UTC qu'Apollo 11 (20 juillet). Ambigüité dans le cadrage culturel (quel événement 1969-7-20 ?). Ère pré-internet moderne ; moins vérifiable depuis des records indépendants. |
| Mars 3 (Soviétique) | 1971-12-02T13:50:35Z | Premier atterrissage doux Mars, mais l'atterrisseur a échoué 14,5 s après le touchdown ; le record de données est incomplet. |
| Rover Curiosity | 2012-08-06T05:17:57Z | Moderne, bien documenté, mais « ancrer sur l'atterrissage le plus récent » est instable (Perseverance 2021, futurs atterrissages). |
| Rover Perseverance | 2021-02-18T20:55:00Z | Même critique que Curiosity. |
| Mars Schiaparelli | 2016-10-19T14:48:18Z | Atterrissage échoué — pas un événement de présence réussie. |
| Premier atterrissage humain sur Mars | (futur) | Réservé comme révision future ; **PEUT** devenir l'ancrage quand une mission Mars habitée atterrit. |

Pathfinder satisfait quatre propriétés parallèles à Apollo 11 (selon `manifesto.fr.md §2.3`) :

- (i) Vérifiable à la seconde depuis des records indépendants.
- (ii) Témoigné à l'échelle de l'espèce (diffusion en direct ; mission largement couverte).
- (iii) Sans victime identifiable.
- (iv) Marque une discontinuité dans la présence Mars de l'espèce : le premier atterrissage doux réussi de l'ère moderne d'exploration de Mars.

### 8.2 Pourquoi une époque partagée pour Terre et Lune ?

La Lune pourrait utiliser l'un de trois ancrages :

- **Alunissage Apollo 11 (1969-07-20T20:17:40Z)** : l'instant du touchdown à la surface.
- **Époque Terre (1969-07-20T00:00:00Z)** : le début du jour d'alunissage, partagée avec la Terre.
- **Un événement lunaire pré-Apollo** : un jalon Luna soviétique, ou un ancrage de cycle synodique.

Le choix d'**époque partagée avec la Terre** est doctrinal :

- La Lune est le satellite de la Terre ; son histoire est liée à celle de la Terre. Une époque Lune séparée impliquerait une chronologie parallèle.
- Le système Terre-Lune est gravitationnellement et astronomiquement un système ; utiliser une époque reflète cela.
- Le touchdown à la surface (20:17:40Z) a été rejeté pour la même raison qu'il a été rejeté comme époque Terre (`manifesto.fr.md §2.1`) : il décale le compteur de jour d'une référence naturelle.

La revendication doctrinale — « le compteur de la Lune s'aligne naturellement sur l'événement humain qui lie les deux corps » — est ouverte à RFC. Une révision future **PEUT** introduire `epoch_Moon = 1969-07-20T20:17:40Z` (touchdown) ou une époque Lune complètement indépendante ; jusqu'à v1.0, le choix d'époque partagée tient.

### 8.3 Qu'en est-il de Vénus, Jupiter, Europe, exoplanètes ?

Ces corps sont hors périmètre des paramètres normatifs v0.7. Ils sont adressables via le framework générique §6. Les éditeurs ont l'INTENTION de canoniser des corps additionnels via RFC à mesure que les signaux d'adoption émergent (par exemple, si une présence habitée soutenue à Europe ou un orbiteur Vénus permanent est établi).

---

## 9. Corrections relativistes (non normative)

Les effets suivants affectent la précision sous-milliseconde ; ils sont **en dessous** de la précision par défaut 5 chiffres (1 Blink = 864 ms) et sont donc non normatifs pour les implémentations à précision par défaut. Les implémentations requérant une précision sous-milliseconde sur des corps non-Terre **DOIVENT** maintenir leurs propres tables de correction.

### 9.1 Dérive d'horloge à la surface lunaire

Une horloge à la surface lunaire tic environ **58,7 µs plus vite par jour** qu'une horloge UTC à la surface de la Terre, dû à la différence de potentiel gravitationnel [proposition NIST 2024 *Coordinated Lunar Time* ; Mazarico et al. 2018]. Différentiel cumulé sur 50 ans = ≈ 1,07 s.

La dérive 58,7 µs/jour est approximativement :

```
58,7 µs / 864_000_000 µs/jour  ≈  6,8 × 10⁻⁸ dérive relative
```

ce qui est bien en dessous de la résolution Blink à 5 chiffres (864 ms = 8,64 × 10⁵ µs, ≈ 14_700× plus large que l'offset lunaire quotidien). Pour les valeurs ATS à 5 chiffres, la dérive d'horloge lunaire est **négligeable sur des siècles**.

### 9.2 Dérive d'horloge à la surface martienne

Une horloge à la surface martienne diffère d'UTC par des effets gravitationnels et orbitaux. L'offset instantané varie avec la position orbitale de Mars ; la dérive cumulée sur 50 ans est de l'ordre des secondes [Mars 2024 estimations basées sur Mars GCM ; pas encore formellement standardisé].

Pour les valeurs ATS à 5 chiffres, la dérive d'horloge martienne est aussi **négligeable sur des décennies**.

### 9.3 Implémentations requérant une précision sous-milliseconde

Les implémentations ciblant :

- Les protocoles de navigation et communication lunaires.
- Les opérations à la surface de Mars (par exemple, planification autonome de rover).
- Le contrôle de vaisseaux spatiaux interplanétaires.

**DOIVENT** maintenir leurs propres tables de correction TAI ↔ surface-locale. L'implémentation de référence fournit la précision 5 chiffres selon `manifesto.fr.md §4.4` ; les cas d'usage à précision étendue sont hors périmètre pour v0.7.

### 9.4 Future variante ATS-TAI

`manifesto.fr.md §8.3` réserve une variante ATS-TAI pour révision future. ATS-TAI sur Mars et Lune serait le framework naturel pour les corrections relativistes, mais n'est pas spécifié en v0.7.

---

## 10. Vecteurs de conformance

### 10.1 Fichiers de vecteurs requis

Une implémentation conformante v0.7 **DOIT** passer les fichiers de vecteurs suivants :

- `docs/spec/test-vectors.json` — 12 vecteurs ATS Terre (cf. `manifesto.fr.md §9.3`).
- `docs/spec/test-vectors-arithmetic.json` — 12 vecteurs d'algèbre.
- `docs/spec/test-vectors-multi-planetary-mars.json` — 10 vecteurs Mars.
- `docs/spec/test-vectors-multi-planetary-moon.json` — 10 vecteurs Lune.

Les implémentations qui ne supportent pas l'annexe multi-planétaire **DOIVENT** déclarer la conformance partielle explicitement (selon `manifesto.fr.md §16.5`).

### 10.2 Format de vecteur

Chaque vecteur multi-planétaire suit :

```json
{
  "label": "Mars Pathfinder touchdown",
  "utc": "1997-07-04T16:56:55Z",
  "ats_canonical": "T+ Δ_Mars 0.0.0.0.00000"
}
```

Le champ `label` est un contexte humainement lisible. Les champs `utc` et `ats_canonical` sont le contrat de conformance.

### 10.3 Exigences de couverture de vecteurs

Les fichiers de vecteurs Mars et Lune couvrent chacun :

- L'époque du corps (`T+ Δ_X 0.0.0.0.00000`).
- Des instants Kilo ronds (par exemple, `T+ Δ_X 1.0.0.0.00000`, `T+ Δ_X 10.0.0.0.00000`).
- Des fractions complexes (vérifiant le comportement de troncature plancher).
- Un instant direction-négative (`T- Δ_X k.h.d.kin.fffff`).
- Une date dans le siècle suivant (vérifiant l'arithmétique long terme).
- L'ère courante (un instant contemporain vérifiable).

---

## 11. Objections anticipées

### 11.1 « Mars Pathfinder n'est pas niveau-espèce comme Apollo 11 l'était. »

Mars Pathfinder n'est pas niveau-espèce **de la même façon** ; le cadrage est parallèle, pas identique. Apollo 11 a marqué le premier atterrissage humain sur un autre corps ; Pathfinder a marqué le premier atterrissage Mars moderne réussi de l'ère contemporaine. Les quatre propriétés de `manifesto.fr.md §2.3 Attaque C` s'appliquent (vérifiabilité, échelle de témoignage, sans victime, discontinuité). Quand un atterrissage Mars habité se produira, une future RFC **PEUT** proposer de ré-ancrer `epoch_Mars` sur cet événement (le gel v1.0 au §7 serait relâché via la porte de sortie §3.8 dans `versioning.fr.md`).

### 11.2 « Synodique vs sidéral pour la Lune était arbitraire. »

§3.3.2 source le choix : synodique correspond au cycle lever-coucher de soleil qu'un colon lunaire expérimente, correspond au cycle des phases observé depuis la Terre, et correspond au framework NASA Coordinated Lunar Time. Sidéral **PEUT** être exposé comme unité additionnelle non normative. Le choix n'est pas arbitraire ; il est doctrinal et expliqué.

### 11.3 « Les effets relativistes comptent plus que vous ne le prétendez. »

Pour la précision à 5 chiffres (résolution 864 ms), §9.1 démontre que la dérive d'horloge lunaire est ≈ 14_700× plus petite qu'un Blink. Pour l'usage à précision étendue (sous-milliseconde, par exemple, planification autonome de rover Mars), §9.3 dirige explicitement les implémentations à maintenir leurs propres tables de correction, et §9.4 réserve une variante ATS-TAI pour standardisation future. L'annexe ne sous-estime pas l'effet ; elle le périmètre correctement.

### 11.4 « Le framework tiers est trop permissif — les collisions de suffixe sont inévitables. »

§6.2 reconnaît cela et offre un fallback : priorité d'annonce. Un registre central est planifié (`docs/spec/multi-planetary-bodies.md`) et les éditeurs d'enregistrement **PEUVENT** canoniser les corps tiers via RFC. Jusqu'à ce que le registre existe, les collisions de suffixe sont la responsabilité de l'implémenteur à résoudre ; en pratique, l'espace de nommage des corps célestes est fini et les formes nominales anglaises sont bien établies.

### 11.5 « Pourquoi ne pas utiliser directement Mars24 ou Mars Mean Sol ? »

Mars24 [Allison & McEwen 2000] est la référence de chronométrage Mars établie. ATS-Mars **utilise** la même longueur de sol moyen (88 775,244 147 s) sourcée de Mars24. La différence est la *grammaire* : Mars24 exprime le temps martien en heures/minutes/secondes style jour-terrestre ; ATS-Mars utilise la grammaire positionnelle décimale `K.H.D.Kin.fffff`. ATS-Mars est **superposé à** Mars24 (utilisant la longueur de jour Mars24) ; il ne le remplace pas.

### 11.6 « La comparaison inter-corps via pont UTC est maladroite. »

Le pont est explicite par conception. Mélanger les corps silencieusement obscurcirait le fait que la comparaison se passe dans un troisième référentiel (UTC). Le contrat §5.3 — `body_ats_to_utc(ats_a) < body_ats_to_utc(ats_b)` — rend le pont visible à l'implémenteur. Le coût est un appel de méthode additionnel ; le bénéfice est la sécurité de type.

### 11.7 « La dérive lunaire cumulée de 1,07 s sur 50 ans semble significative. »

Elle l'est, pour la précision sous-seconde. Pour la précision ATS à 5 chiffres (864 ms), 1,07 s ≈ 1,2 Blinks — significatif pour les applications haute précision, négligeable pour les applications à précision par défaut. La précision 5 chiffres est un choix de conception (`manifesto.fr.md §4.4`) ; les applications requérant plus **DOIVENT** utiliser la précision étendue et **DOIVENT** tenir compte de la dérive (§9.3). L'annexe est honnête sur ce compromis.

### 11.8 « Pourquoi la Lune n'a-t-elle pas sa propre époque ? »

§8.2 explique : le système Terre-Lune est un système ; une chronologie Lune parallèle créerait un surcoût de coordination sans bénéfice compensateur. Les calendriers des colons lunaires doivent s'aligner à la fois sur le jour lunaire (le cycle synodique) et sur le contrôle de mission basé sur Terre ; partager l'époque Terre supporte les deux. Une future RFC **PEUT** revisiter cela ; l'époque partagée tient jusqu'alors.

---

## 12. Implémentations de référence

### 12.1 Python (existant, v0.7)

`code/ats_multi_planetary.py` implémente :

- Une classe générique `Body` paramétrée par `(epoch, day_seconds, suffix, symbol)`.
- Trois singletons : `EARTH`, `MARS`, `MOON`.
- Un type `BodyATSDateTime` portant la référence au corps plus les chiffres `K.H.D.Kin.fffff` et le signe.
- Un type `BodyATSDuration` pour les durées signées typées par corps.
- L'algèbre §11.4 préservée par corps avec les opérations inter-corps levant `TypeError`.

L'implémentation passe `test-vectors-multi-planetary-mars.json` et `-moon.json` bit-à-bit. Le singleton Terre est cohérent avec `code/ats.py` (pas de divergence).

### 12.2 JavaScript (planifié, v1.0)

Le port JS (`docs/assets/js/ats_multi_planetary.js`) est planifié pour le ship v1.0. Il reflètera la surface d'API Python :

```javascript
import { EARTH, MARS, MOON, Body, BodyATSDateTime } from './ats_multi_planetary.js';

const ats = MARS.fromUtc(new Date('2026-06-13T12:00:00Z'));
console.log(ats.toCanonical()); // "T+ Δ_Mars 10.2.8.7.96477"
```

L'implémentation JS est une exigence v1.0 selon `versioning.fr.md §7.2 (3)`.

### 12.3 Implémentations tierces

Une implémentation tierce Rust ou Go revendiquant la conformance v1.0 **DOIT** inclure l'annexe multi-planétaire (Terre + Mars + Lune au minimum). Selon `versioning.fr.md §7.2 (3)`, au moins une implémentation tierce passant 100 % des vecteurs de conformance est une exigence de ship v1.0.

---

## Références

- **Allison, M., & McEwen, M. (2000).** *A post-Pathfinder evaluation of areocentric solar coordinates with improved timing recipes for Mars seasonal/diurnal climate studies*. Planetary and Space Science, 48 (2–3), 215–235. (Source pour le sol martien moyen.)
- **Espenak, F. (2014).** *Lunar synodic period and the synodic month*. NASA Goddard Eclipse Web Site. (Source pour le jour lunaire synodique.)
- **IAU.** *IAU Recommendations on Celestial Time Scales*. Documents de groupe de travail de l'Union Astronomique Internationale. (Référence pour les définitions de temps astronomique.)
- **Mazarico, E., et al. (2018).** *The lunar relativistic time scale*. Journal of Geodesy, 92, 1483–1494. (Source pour la dérive d'horloge à la surface lunaire.)
- **NASA JPL Mission History.** *Record d'atterrissage de la Sagan Memorial Station de Mars Pathfinder*. (Source pour le timestamp UTC de Mars Pathfinder.)
- **NIST (2024).** *Proposition Coordinated Lunar Time (LTC)*. Document blanc de l'Institut National des Standards et de la Technologie. (Source pour §9.1.)
- **`manifesto.fr.md`** — Référence normative (spec ATS Terre).
- **`versioning.fr.md`** — Annexe de stabilité (§7 références de gel).
- **RFC 2119** — Bradner, S. *Key words for use in RFCs to Indicate Requirement Levels*. IETF (1997).
- **RFC 5234** — Crocker, D., & Overell, P. *Augmented BNF for Syntax Specifications: ABNF*. IETF (2008).
- **RFC 8174** — Leiba, B. *Ambiguity of Uppercase vs Lowercase in RFC 2119 Key Words*. IETF (2017).

Cette annexe ne fait aucune affirmation astronomique originale. Toutes les valeurs scientifiques sont sourcées depuis la littérature évaluée par les pairs ou des organismes de standards établis. Les choix doctrinaux (ancrages d'époque, synodique vs sidéral, époque Terre-Lune partagée) sont étiquetés comme décisions des éditeurs d'enregistrement et sont ouverts à RFC selon `versioning.fr.md §6`.
