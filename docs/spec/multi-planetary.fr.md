# ATS — Extension multi-planétaire

**Statut :** annexe **normative** v0.7-rc1 (cible v1.0)
**Symbole générique :** `Δ_<Body>` ou `Δ_<symbole astronomique>`
**Référence normative :** `manifesto.fr.md` (la spec Terre)

---

## 0. Position

L'ATS v0.6 (cf. `manifesto.fr.md`) décrit un compteur **ancré à la Terre** : époque 1969-07-20T00:00:00Z, jour POSIX de 86 400 s. Cette annexe le **généralise** à d'autres corps célestes pour soutenir la rhétorique du §1 du manifeste (« conçue pour une civilisation multi-planétaire »).

> **Important.** Cette extension n'introduit **aucune modification** du format canonique, du format court, du format binaire §12, ni de l'algèbre §11.4. La même grammaire `K.H.D.Kin.fffff` s'applique à chaque corps — seuls l'**époque** et la **durée du jour** changent.

## 1. Définition générique

Un compteur ATS pour un corps céleste `X` est entièrement déterminé par :

| Paramètre | Type | Signification |
|---|---|---|
| `epoch_X` | instant UTC | Origine du compteur (zéro absolu). |
| `day_seconds_X` | Decimal positif | Durée d'un « jour » local du corps, en secondes SI. |
| `suffix_X` | ASCII | Suffixe canonique pour la notation (`_Earth`, `_Mars`…). |
| `symbol_X` | Unicode (facultatif) | Symbole astronomique pour la forme d'affichage. |

Le compteur est alors :
```
Δ_X(t_UTC) = (t_UTC − epoch_X) / day_seconds_X
```
avec `t_UTC` en secondes depuis une référence UTC arbitraire (typiquement l'époque POSIX ou l'époque Terre).

La structure positionnelle `K.H.D.Kin.fffff` est identique à l'ATS Terre (Kilo non borné, Hecto / Deka / Kin chiffres 0..9, fraction sur 5 chiffres par défaut). Le `Bloc` reste `1/10` de jour local — sa durée absolue varie selon le corps.

## 2. Notation

### 2.1 Forme canonique ASCII

```
T± Δ_Earth K.H.D.Kin.fffff
T± Δ_Mars  K.H.D.Kin.fffff
T± Δ_Moon  K.H.D.Kin.fffff
```

Le suffixe est obligatoire **sauf** pour la Terre : `Δ 20.7.8.2.50000` reste équivalent à `Δ_Earth 20.7.8.2.50000` (rétro-compatibilité v0.6).

### 2.2 Forme symbolique (UI / affichage)

| Corps | Symbole | Lecture |
|---|---|---|
| Terre | `Δ⊕` | « delta-terre » |
| Mars | `Δ♂` | « delta-mars » |
| Lune | `Δ☾` | « delta-lune » |

Le symbole générique `Δ` reste l'ATS Terre dans tout contexte ambigu (compteurs, badges, embed).

### 2.3 Forme courte

Identique à la forme courte v0.6 + suffixe :
```
Δ_Mars 1.2.3.4/56
Δ☾ 0.7.0.3/45
```

## 3. Paramètres pour les corps v1.0

### 3.1 Terre (`Δ_Earth`, `Δ⊕`, ou `Δ` seul)

- `epoch_Earth` = **1969-07-20T00:00:00Z** (début du jour d'Apollo 11, cf. manifeste §2)
- `day_seconds_Earth` = **86 400** (jour POSIX, cf. manifeste §8)

### 3.2 Mars (`Δ_Mars`, `Δ♂`)

- `epoch_Mars` = **1997-07-04T16:56:55Z** — atterrissage de **Mars Pathfinder** dans Ares Vallis. Premier atterrissage moderne réussi sur Mars depuis Viking ; date symbolique du **4 juillet 1997**. (Source : Wikipedia ; valeur identique à JPL Mission History.)
- `day_seconds_Mars` = **88 775,244 147** s — **sol martien** (Allison & McEwen, *Planetary and Space Science* 2000, *« A post-Pathfinder evaluation of areocentric solar coordinates »*).

Conséquence numérique : Δ_Mars 0.0.0.0.00000 = **1997-07-04T16:56:55Z** UTC. Pour l'instant `2026-06-13T12:00:00Z`, le calcul donne **`T+ Δ_Mars 10.2.8.7.96477`** (à 5 chiffres).

### 3.3 Lune (`Δ_Moon`, `Δ☾`)

- `epoch_Moon` = **1969-07-20T00:00:00Z** — **partagée avec la Terre**. Choix doctrinal : la Lune est un satellite de la Terre, son compteur est naturellement aligné sur l'événement humain qui lie les deux corps.
- `day_seconds_Moon` = **2 551 442,8128** s — **jour synodique lunaire** (29,530 588 jours terrestres ; IAU). Choix du synodique (sunrise-to-sunrise apparent depuis la surface) plutôt que sidéral (27,32 j) car il correspond au cycle d'éclairage local.

Conséquence : 1 Δ_Moon = ≈ 29,53 Δ_Earth. À la date `2026-06-13T12:00:00Z`, **`T+ Δ_Moon 0.7.0.3.76180`**.

## 4. Conversion `Δ_X ↔ UTC`

Formule canonique pour un corps `X` paramétré par `(epoch_X, day_seconds_X)` :

```
total_days = (utc − epoch_X).total_seconds() / day_seconds_X
sign       = T+ si total_days ≥ 0 sinon T-
abs_days   = |total_days|
integer    = floor(abs_days)
frac_5dig  = floor((abs_days − integer) × 100 000)
K.H.D.Kin  = divmod-pipeline standard (cf. manifeste §9)
```

La règle de troncature §6 (`ROUND_FLOOR`) s'applique sans modification.

## 5. Comparaisons et algèbre inter-corps

**Δ_X et Δ_Y de corps différents ne sont pas directement comparables.** Pour comparer deux instants exprimés sur deux corps différents, convertir **les deux** en UTC d'abord.

Concrètement :
- `Δ_Mars + Δd_Mars → Δ_Mars` ✓ (algèbre §11.4 préservée par corps)
- `Δ_Mars + Δd_Earth → indéfini` ✗
- `Δ_Mars < Δ_Earth → indéfini` ✗
- `Δ_Mars.to_utc() < Δ_Earth.to_utc() → bool` ✓ (comparaison via le pont UTC)

L'unité `Δd` (durée) est **typée par corps** : `Δd_Mars` = quantité de sols martiens ; `Δd_Earth` = quantité de jours terrestres ; conversion possible via le ratio `day_seconds`.

## 6. Cadre générique pour corps tiers

Une implémentation **MAY** définir `Δ_X` pour n'importe quel corps en enregistrant :

| Champ | Exemple Vénus |
|---|---|
| `epoch_X` (UTC ISO 8601) | `1989-08-10T03:01:00Z` (Magellan orbital insertion) |
| `day_seconds_X` (Decimal positif) | `10 087 200` (jour vénusien synodique ≈ 116,75 j Terre) |
| `suffix_X` (ASCII court) | `_Venus` |
| `symbol_X` (Unicode optionnel) | `♀` |

L'implémentation **SHOULD** fournir un jeu de vecteurs `test-vectors-multi-planetary-<body>.json` avec ≥ 5 instants, suivant le même format que Mars et Lune. Voir §10.

**Aucune autorité centrale n'enregistre les corps non-canoniques.** Les conflits de suffixe sont résolus par la convention nominale (`_Venus`, `_Jupiter`, etc. en anglais). Les symboles Unicode astronomiques (U+263F à U+2647) sont la référence pour la forme symbolique.

## 7. Stabilité (v1.0 freeze)

Une fois v1.0 publiée, **les paramètres Mars et Lune sont gelés** (au même titre que les §3 freezes de `versioning.fr.md`). Les corps tiers restent libres ; un nouveau corps `_Venus` peut être ajouté en version mineure sans déclencher de RFC (additif, comme un nouveau pont calendaire).

Hors période de freeze : tout changement de `epoch_Mars`, `epoch_Moon`, `day_seconds_Mars`, `day_seconds_Moon` exige un nouveau projet (ATS 2).

## 8. Annexe non-normative — corrections relativistes

Une horloge en surface lunaire bat **environ 58,7 µs plus vite par jour** qu'une horloge UTC en surface terrestre (cf. NIST 2024, NASA *Coordinated Lunar Time* proposal). Le différentiel cumulé sur 50 ans = ≈ 1,07 s.

Une horloge en surface martienne (1 g_Mars + altitude équatoriale) est encore plus complexe (modèle Mars 2024 GCM).

**Ces corrections sont en-dessous de la précision par défaut `ATS_DECIMALS = 5`** (1 / 100 000 jour ≈ 864 ms, soit 864 000 µs ≈ 14 700× supérieur au décalage lunaire quotidien). Pour un instant à 5 chiffres, **elles sont négligeables sur des siècles**.

Les implémentations qui exigent une précision sub-milliseconde sur des corps non-Terre **doivent** maintenir leur propre table de corrections TAI ↔ surface-locale.

## 9. Vecteurs de conformance

Deux jeux additionnels :
- `docs/spec/test-vectors-multi-planetary-mars.json` — 10 instants UTC ↔ Δ_Mars couvrant l'époque, des sols ronds, des fractions complexes, des dates ≥ 2050.
- `docs/spec/test-vectors-multi-planetary-moon.json` — 10 instants UTC ↔ Δ_Moon avec les mêmes profils.

Chaque vecteur :
```json
{
  "label": "Description",
  "utc": "1997-07-04T16:56:55Z",
  "ats_canonical": "T+ Δ_Mars 0.0.0.0.00000"
}
```

## 10. Implémentations de référence

- `code/ats_multi_planetary.py` (Python) — classe générique `Body` paramétrée par `(epoch, day_seconds)`, plus singletons `EARTH`, `MARS`, `MOON`. Algèbre Δ/Δd préservée par corps.
- JS : portage prévu en v1.0 (cf. ROADMAP).

Les conversions s'appuient sur le helper `_split_abs_days_floor` existant — aucun changement à `code/ats.py` n'est nécessaire pour la Terre (rétro-compatibilité totale).
