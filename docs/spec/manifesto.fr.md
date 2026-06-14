# Le Système Temporel Apollonien (ATS)

**Statut :** Pré-release v0.7
**Symbole :** Δ (U+0394 GREEK CAPITAL LETTER DELTA)
**Langue source :** Anglais. La traduction française (`manifesto.fr.md`) est fournie pour l'accessibilité ; en cas de divergence, le document anglais (`manifesto.en.md`) fait foi.
**Type de document :** Spécification normative avec annexes non normatives.
**Emplacement canonique :** `https://github.com/s-geffroy/ATS` — fichier `docs/spec/manifesto.fr.md`.
**Assertion centrale :** ATS est le standard temporel computationnel universel d'une civilisation en réseau, multi-site et multi-planétaire. Il remplace le modèle grégorien *année/mois/semaine + heure locale* par un compteur unique, décimal, linéaire, ancré sur un jalon technologique à l'échelle de l'espèce.

---

## 0. Conventions

### 0.1 Niveaux d'exigence

Les mots clés **DOIT**, **NE DOIT PAS**, **REQUIS**, **DEVRA**, **NE DEVRA PAS**, **DEVRAIT**, **NE DEVRAIT PAS**, **RECOMMANDÉ**, **NON RECOMMANDÉ**, **PEUT** et **OPTIONNEL** dans ce document doivent être interprétés comme décrits dans BCP 14 [RFC 2119, RFC 8174] quand, et seulement quand, ils apparaissent en majuscules.

### 0.2 Notation

- Les grammaires sont exprimées en ABNF [RFC 5234].
- Le pseudo-code utilise une forme impérative de style Python pour la lisibilité ; toute implémentation conformante **PEUT** utiliser le langage de son choix.
- Les littéraux hexadécimaux sont préfixés `0x`. Les littéraux entiers utilisent la convention de séparation `123_456`.
- Les instants UTC sont écrits en forme ISO 8601 / RFC 3339 (`AAAA-MM-JJTHH:MM:SS.ssssssZ`).
- Les durées exprimées en « secondes » se réfèrent à des **secondes SI sur l'échelle de temps UTC**, et non à des secondes TAI, sauf mention contraire.

### 0.3 Glossaire (condensé)

Le glossaire complet est au §17. Référence rapide :

- **ATS** — Apollonian Time System ; ce standard.
- **Époque** — L'instant de référence `1969-07-20T00:00:00Z` (§2).
- **Δ** — Le symbole ATS, U+0394, octets UTF-8 `0xCE 0x94`. Préfixe pour un instant.
- **Δd** — Préfixe de durée (§11).
- **T+, T-** — Marqueurs de direction : post-époque, pré-époque (§3).
- **Kin, Deka, Hecto, Kilo** — Unités positionnelles macro (1, 10, 100, 1 000 jours).
- **Bloc, Centi, Milli, Beat, Blink** — Unités positionnelles micro (0,1 ; 0,01 ; 0,001 ; 0,0001 ; 0,00001 jour).
- **Forme canonique** — Représentation positionnelle pleinement qualifiée (§4).
- **Forme courte** — Représentation tronquée conversationnelle (§5).
- **UTC** — Temps universel coordonné tel que défini par ITU-R TF.460 et aligné via la sémantique POSIX au §8.

---

## 1. Périmètre

ATS est un **système de coordonnées continu sur l'axe temporel UTC** : une application déterministe et bijective qui associe à un instant UTC `t` une chaîne positionnelle en base 10 `ats(t)`. L'application est :

- **Linéaire** — `ats(t)` est le compte des jours (et fractions de jour) écoulés depuis l'époque. Aucune composante cyclique.
- **Décimale** — toutes les unités positionnelles sont des puissances de 10 ; pas de base mixte.
- **Universelle** — il existe exactement une valeur ATS par instant UTC. Le système n'a pas de paramètre de fuseau horaire, de locale ou de calendrier.

Les implémentations **DOIVENT** traiter les valeurs ATS comme des identifiants d'instants UTC. Les implémentations **NE DOIVENT PAS** attacher de métadonnées de fuseau horaire, de calendrier ou de locale à une valeur ATS stockée. Les interfaces logicielles transportant des valeurs ATS **NE DOIVENT PAS** porter de champ fuseau horaire.

Les bénéfices qu'ATS apporte, par ordre de priorité :

1. **Échange non ambigu** — deux systèmes échangeant des valeurs ATS ne peuvent pas être en désaccord sur l'instant référencé.
2. **Simplicité de calcul** — l'arithmétique des durées, la planification, la comparaison statistique se réduisent à de l'arithmétique base-10 ordinaire.
3. **Passage à l'échelle long terme** — Kilo est non borné ; le format reste stable à travers les siècles et les corps célestes (cf. annexe multi-planétaire).
4. **Neutralité culturelle** — un seul ancrage, un seul ensemble d'unités, identiques pour tout utilisateur.

### 1.1 Ce qu'ATS n'est pas

Pour prévenir les erreurs de catégorie et désamorcer les disputes évitables, quatre frontières sont rendues explicites :

1. **ATS n'est pas une théorie sur la nature du temps.** Les effets relativistes (dilation gravitationnelle, frame dragging, désaccords de simultanéité) s'appliquent à UTC et donc à ATS inchangés. ATS hérite des sémantiques de coordonnée d'UTC ; il n'affirme rien d'additionnel sur la physique. Le mot « linéaire » dans ce document **DOIT** être lu comme « coordonnées linéaires sur l'axe UTC », et non comme une affirmation métaphysique.

2. **ATS n'est pas un remplacement des calendriers culturels, religieux ou civiques.** Les calendriers lunaire (hébraïque, islamique), luni-solaires (chinois, hindou), ecclésiastiques (liturgique), fiscaux, académiques et civiques **PEUVENT** coexister avec ATS comme présentations indépendantes du même instant UTC. ATS fournit l'interopérabilité entre ces systèmes ; il ne les déplace pas. Cf. §13.

3. **ATS n'est pas un protocole de synchronisation d'horloges.** NTP [RFC 5905], PTP [IEEE 1588], GNSS et la dissémination TAI alimentent les implémentations ATS. Ils ne sont pas en concurrence avec ATS. ATS est une *représentation*, pas une *horloge*.

4. **ATS n'affirme pas que la base 10 est métaphysiquement privilégiée.** La base 10 est choisie parce que sa friction d'adoption est la plus faible de toutes les bases positionnelles : unités SI, monnaies, reporting financier, notation scientifique, informatique numérique. Le choix est d'ingénierie, pas de numérologie.

### 1.2 Alignement biologique

ATS n'est pas seulement pratique pour le calcul ; son échelle d'unités **suit les cycles biologiques empiriques**. Cet alignement n'est pas un hasard de la base 10 — il reflète le fait que l'unité naturelle de la vie humaine est le jour solaire, et que la physiologie humaine subdivise ce jour en ratios approximativement base-10. Chaque unité ATS correspond à une granularité mesurée de la cognition ou du comportement humain.

**Unités micro (intra-jour) et chronobiologie :**

| Unité ATS | Durée | Corrélat biologique |
|---|---|---|
| **Kin** (1 jour) | 24 h | Cycle circadien — sommeil/veille, cortisol, température corporelle centrale |
| **Bloc** (0,1 jour) | 2 h 24 min | Cycle ultradien repos–activité — durée naturelle de focalisation profonde avant fatigue mesurable, validé en vigilance, EEG, hormonal basal (BRAC, Kleitman) |
| **Centi** (0,01 jour) | 14 min 24 s | Focus micro-tâche — durée d'attention soutenue sur une tâche unique, congruent avec le micro-bloc Pomodoro et les intervalles de méditation « assise » |
| **Milli** (0,001 jour) | 1 min 26 s | Régulation respiratoire lente — 12 respirations à la cadence calme de 6 respirations/min, cadence standard du breathwork et de la méditation |
| **Beat** (0,0001 jour) | 8,64 s | Battement attentionnel — durée d'un tour de parole conversationnel, d'un cycle inhale-exhale au repos actif, ou d'un cycle de couplage cardiaque (HRV bande LF) |
| **Blink** (0,00001 jour) | 0,864 s | Fenêtre de réaction — proche de la borne supérieure du temps de réaction de choix et d'un clignement volontaire lent |

**Unités macro (multi-jours) et chronosociologie :**

| Unité ATS | Durée | Corrélat biologique / social |
|---|---|---|
| **Kin** (1 jour) | 24 h | Le jour solaire — l'unité de référence de toute mesure chronobiologique |
| **Deka** (10 jours) | ≈ 1,4 semaine | Oscillation travail–repos — durée pratique d'accumulation de fatigue et de récupération significative (périodisation d'entraînement, études sur le travail posté) |
| **Hecto** (100 jours) | ≈ 3,3 mois | Saison / trimestre de planification — limite pratique de la planification humaine à moyen terme avant dérive des priorités (cadence OKR, semestres académiques) |
| **Kilo** (1 000 jours) | ≈ 2,7 ans | Projet pluriannuel — durée typique des projets de recherche focalisés, des mandats électoraux courts, ou de l'acquisition de compétence soutenue (10 000 heures ≈ 1,25 Kilo à 8 h/jour) |
| Génération (informel, ≈ 10 000 jours) | ≈ 27,4 ans | Rotation démographique des générations — utile uniquement dans le discours multi-générationnel (cf. note §4.2) |

ATS n'est donc pas *imposé* à la biologie ; l'échelle est *lisible* sur la biologie. La technique Pomodoro (≈ 25 min, entre Centi et 2×Centi), le rythme ultradien (90–120 min, proche d'un Bloc), le trimestre OKR (≈ Hecto) et l'heuristique des « 10 000 heures de maîtrise » (≈ 1 Kilo de temps professionnel) ont été découverts indépendamment d'ATS. Chacun trouve une place normalisée dans le système de coordonnées ATS.

> Cet alignement est **non normatif** — les implémentations ne peuvent pas le tester, et le standard n'exige d'aucun utilisateur qu'il suive ces correspondances. Mais l'alignement est **intégral à la justification** : §1.1 affirme qu'ATS ne pose pas la base 10 comme métaphysique ; §1.2 explique pourquoi la base 10 s'aligne néanmoins sur les cycles humains mesurés une fois le jour solaire pris pour ancrage.

---

## 2. Époque (Point Zéro)

ATS utilise un jalon technologique vérifiable, à l'échelle de l'espèce, comme instant de référence unique : **le jour où un membre de l'espèce humaine a occupé pour la première fois, en personne, la surface d'un corps autre que la Terre**.

- **Événement-époque** — Le jour de l'alunissage d'Apollo 11. L'instant de l'alunissage du module Eagle est l'instant témoigné ; l'époque est calée sur le minuit UTC qui ouvre ce jour.
- **Époque en UTC** — `1969-07-20T00:00:00Z`.
- **Époque en ATS** — `T+ Δ 0.0.0.0.00000`.
- **Instant de l'alunissage** — `1969-07-20T20:17:40Z` est préservé comme point remarquable à l'intérieur de Δ 0 à `T+ Δ 0.0.0.0.84560` (Bloc 8, Centi 4, Deka 5, Kin 6 dans la décomposition intra-jour).

### 2.1 Pourquoi le début du jour, pas l'instant de l'alunissage

L'époque **DOIT** être ancrée sur le minuit UTC de la date d'alunissage. L'alternative (instant exact de l'alunissage) décalerait le compteur de jour d'UTC et placerait Bloc 5 à 08:17:40 UTC au lieu de 12:00 UTC. L'ancrage choisi préserve la propriété :

```
Bloc 5  ≡  12:00 UTC exactement
Bloc 0  ≡  00:00 UTC exactement
```

Cette propriété est structurante pour le cadran analogique (`analog-clock.md`), pour la pédagogie, et pour le snapshot cron `/api/now.json`. L'instant de l'alunissage est préservé comme point remarquable à l'intérieur de Δ 0 pour que le sens culturel ne soit pas perdu.

### 2.2 Ancrages alternatifs rejetés

| Candidat | UTC | Motif de rejet |
|---|---|---|
| Instant d'alunissage Apollo 11 | 1969-07-20T20:17:40Z | Décale le compteur de jour d'UTC : Bloc 5 tombe à 08:17:40 UTC. Pédagogiquement et computationnellement déroutant. |
| Lancement Spoutnik 1 | 1957-10-04T19:28:34Z | Robotique ; aucun membre de l'espèce n'a quitté la planète. Marque la capacité humaine, pas la présence humaine ailleurs. |
| Hiroshima | 1945-08-06T08:15:00Z | Marque civilisationnellement, mais l'espèce a légitimement intérêt à ne pas se dater à partir d'un préjudice. Rejeté sur bases humanistes. |
| Premier vol motorisé (Wright) | 1903-12-17T15:35:00Z | Atmosphérique uniquement ; l'espèce n'a pas quitté son enveloppe. |
| Lancement Apollo 11 | 1969-07-16T13:32:00Z | Départ, pas arrivée. L'événement célébré est l'arrivée sur un autre corps. |
| Premier pas (Armstrong EVA) | 1969-07-21T02:56:15Z | Symbolique, mais l'alunissage précède, et l'EVA tombe le jour UTC suivant (Δ 1). |
| Année 0 d'un calendrier existant | divers | Religieux ou arbitraire ; aucun ne fournit de consensus à l'échelle de l'espèce. |
| Début de l'Holocène (≈ −10 000 BCE) | inconnu à la seconde | Échoue à la vérifiabilité à la seconde depuis des sources indépendantes. |

### 2.3 L'époque résiste à quatre attaques courantes

Le choix de l'époque est la décision la plus contestée de cette spécification. Quatre attaques reviennent ; elles sont traitées normativement ici pour que le débat sur l'ancrage soit résolu au niveau du standard plutôt que porté dans chaque implémentation.

**Attaque A — « Apollo 11 est américain ; le choix est nationaliste. »**
L'*événement* est daté ; le *standard* ne l'est pas. ATS utilise Apollo 11 comme ancrage de datation uniquement — pas comme une revendication de priorité nationale sur le temps. Comparer avec UTC : le temps est défini au méridien d'origine, mais nul ne prétend qu'UTC est « britannique ». Un standard s'identifie par le compteur entier qu'il émet, pas par l'origine culturelle de son ancrage. Les implémentations conformantes et les utilisateurs conformants d'ATS ne font aucune affirmation de priorité nationale.

**Attaque B — « Un ancrage en 1969 rend les dates pré-époque incommodes (grands nombres T-). »**
Tous les calendriers partagent ce problème : le grégorien utilise des années négatives (BC/BCE) ; les calendriers hébraïque, islamique et holocène reculent leur époque pour que les nombres positifs couvrent l'usage moderne au prix de dates pré-époque encore plus reculées. ATS privilégie délibérément les dates *post-époque* parce que l'ère post-Apollo est celle où débute le calcul en réseau multi-site — c'est-à-dire le moment où un standard temporel universel devient opérationnellement nécessaire. Les dates pré-époque utilisent T- et sont mécaniquement symétriques (§3) ; la conversion est identique dans les deux sens.

**Attaque C — « Pourquoi pas un événement abstrait (Big Bang, début de l'Holocène, année zéro d'un calendrier) ? »**
Un événement-époque ATS valide **DOIT** satisfaire quatre propriétés :

  i. Vérifiable à la seconde depuis des sources indépendantes ;
  ii. Témoigné à l'échelle de l'espèce (en direct, à des centaines de millions de personnes) ;
  iii. Sans victime humaine identifiable, pour que le standard ne commémore pas un préjudice ;
  iv. Marque une discontinuité dans la *situation* de l'espèce, pas seulement dans sa perception.

Aucune alternative du XXᵉ ou XXIᵉ siècle ne satisfait les quatre. Les événements astronomiques abstraits échouent au (i). Les événements religieux échouent à être consensuels-neutres. Les actes de guerre échouent au (iii). L'alunissage d'Apollo 11 est le candidat consensuel unique.

**Attaque D — « Les alunissages Lune et Mars sont aussi arbitraires. Pourquoi ceux-là et pas Curiosity, Voyager, Cassini ? »**
L'annexe multi-planétaire (`multi-planetary.md`) traite ce point. Chaque corps céleste qui requiert son propre compteur ATS reçoit son propre ancrage, justifié par les quatre mêmes propriétés appliquées à l'histoire de ce corps. L'ancrage Terre et l'ancrage Mars sont des décisions indépendantes ; les confondre est une erreur de catégorie.

---

## 3. Directionnalité : T+ et T-

ATS est symétrique autour de l'époque.

- **T+** dénote le temps écoulé **après** l'époque.
- **T-** dénote le temps écoulé **avant** l'époque.

Dans la **forme canonique** (§4), le marqueur de direction est REQUIS. Les implémentations **DOIVENT** émettre soit `T+` soit `T-` et **NE DOIVENT PAS** l'omettre. La forme abrégée « `Δ` seul » est interdite en forme canonique.

Dans la **forme courte** (§5), le marqueur de direction est omis ; `T+` est implicite. Les implémentations décodant la forme courte **DOIVENT** supposer `T+` et **PEUVENT** signaler tout usage en direction négative comme non supporté.

`T+ Δ 0.0.0.0.00000` et `T- Δ 0.0.0.0.00000` dénotent le même instant (l'époque). Les implémentations **DOIVENT** les traiter comme égaux.

---

## 4. Représentation canonique

### 4.1 Syntaxe canonique (normative)

Syntaxe canonique en ABNF [RFC 5234] :

```
canonical    = direction SP delta SP days "." frac
direction    = "T" sign
sign         = "+" / "-"
delta        = %xCE.94            ; Δ (U+0394, UTF-8 0xCE 0x94)
days         = kilo "." digit "." digit "." digit
kilo         = 1*DIGIT            ; entier non négatif non borné, pas de zéros initiaux sauf "0"
frac         = 5*DIGIT            ; précision par défaut ; plus de chiffres permis (§4.4)
digit        = %x30-39
SP           = %x20               ; un espace ASCII
```

Exemple (ère courante, ≈ 57 ans post-époque, 12:00 UTC, 13 juin 2026) :

```
T+ Δ 20.7.8.2.50000
```

Les implémentations **DOIVENT** émettre exactement un espace ASCII entre `direction` et `delta`, et exactement un espace ASCII entre `delta` et `days`. Les implémentations **DOIVENT** accepter de l'espace supplémentaire en entrée uniquement si elles documentent explicitement cette tolérance ; le parseur strict **DOIT** rejeter tout espace excédentaire.

### 4.2 Unités macro (calendrier)

ATS compte les **jours** avec des positions base-10 fixes :

| Position | Nom | Valeur | Fonction |
|---|---|---|---|
| `....X` | **Kin** | 1 jour | Le jour solaire |
| `...X.` | **Deka** | 10 jours | Cycle travail-repos |
| `..X..` | **Hecto** | 100 jours | Saison / trimestre de planification |
| `X....` | **Kilo** | 1 000 jours | Mandat / projet pluriannuel |

`Kilo` n'a pas de borne supérieure. Au fil des décennies, le nombre de tête croît librement (`20.x.x.x`, `100.x.x.x`, `1000.x.x.x`).

> **Vocabulaire informel — « Génération ».** ~10 000 jours (≈ 27,4 ans) s'appelle familièrement une **Génération**. Ce **N'EST PAS** un chiffre positionnel ; il vit seulement dans le discours social et philosophique (cf. annexe Philosophy).

### 4.3 Unités micro (horloge)

La fraction du jour se décompose en positions nommées :

| Position | Nom | Fraction | Durée approx. |
|---|---|---|---|
| `.X....` | **Bloc** | 0,1 jour | 2 h 24 min |
| `..X...` | **Centi** | 0,01 jour | 14 min 24 s |
| `...X..` | **Milli** | 0,001 jour | 1 min 26,4 s |
| `....X.` | **Beat** | 0,0001 jour | 8,64 s |
| `.....X` | **Blink** | 0,00001 jour | 0,864 s |

### 4.4 Précision (variable)

La précision canonique par défaut est de **5 chiffres fractionnaires** (jusqu'au Blink). Les implémentations **PEUVENT** étendre la précision (par exemple 9 chiffres ≈ 0,0086 ms pour des usages scientifiques ou de synchronisation réseau) en émettant des chiffres supplémentaires après le Blink. Les implémentations **DOIVENT** déclarer la précision émise, soit hors bande (schéma, en-tête), soit par le nombre de chiffres effectivement présents. Les implémentations **PEUVENT** raccourcir la précision pour l'affichage ; dans ce cas la politique d'arrondi du §6 s'applique.

---

## 5. Forme conversationnelle (UI humaine)

### 5.1 Syntaxe courte (normative)

Syntaxe courte en ABNF :

```
short        = delta days "-" bc "." milli
delta        = %xCE.94
days         = kilo "." digit "." digit "." digit
kilo         = 1*DIGIT
bc           = 2DIGIT             ; la paire Bloc+Centi sur 2 chiffres, zero-paddée
milli        = DIGIT              ; un chiffre Milli unique
digit        = %x30-39
```

Exemple :

```
Δ20.7.8.2-50.0
```

**Propriétés obligatoires de la forme courte** (les implémentations **DOIVENT** les imposer) :

- Il n'y a **aucun espace** nulle part dans la forme courte. Un parseur recevant de l'espace interne **DOIT** rejeter l'entrée.
- Il n'y a **aucun marqueur de direction**. `T+` est implicite (§3).
- `Kin` est toujours émis, même quand il vaut zéro, pour que la référence calendaire ne soit jamais perdue.
- `bc` est toujours sur 2 chiffres, zero-paddé ; la valeur `5` s'écrit `05`.
- `.milli` est toujours émis, même quand le chiffre Milli vaut `0` ; le suffixe fait partie du format et fixe le plancher de précision à ±86,4 s.
- Le séparateur entre `Kin` et `bc` est `-` ; le séparateur entre `bc` et `milli` est `.`. Aucun autre séparateur n'est permis.

L'ancienne forme courte `ΔK.H.D.Kin/cc` (avant v0.7) est **refusée**. Les implémentations **NE DOIVENT PAS** l'accepter ; elles **PEUVENT** émettre un diagnostic suggérant la forme canonique équivalente pour conversion.

### 5.2 Quand utiliser chaque forme

- **Canonique** — logs, stockage, signature cryptographique, interopération inter-systèmes. URL-safe et filename-safe (uniquement chiffres, points, espaces).
- **Courte** — UI, montres, conversation. Utilise `-` entre calendrier et fraction journalière, `.` avant le chiffre Milli, aucun espace.

Encoder les deux formes est REQUIS de toute implémentation user-facing.

---

## 6. Politique d'arrondi

ATS utilise une **troncature plancher stricte** lors de la réduction de précision pour affichage.

### 6.1 Définition

Soit `t` la valeur réelle de jours écoulés (un nombre réel) et `p` une précision entière (nombre de chiffres fractionnaires). La valeur affichée à la précision `p`, notée `display(t, p)`, est définie par :

```
display(t, p) = floor(t × 10^p) / 10^p
```

### 6.2 Invariants

Pour tout `t ≥ 0` et toute précision `p ≥ 0` :

- `display(t, p) ≤ t`         (monotonicité : jamais anticiper)
- `t − display(t, p) < 10^(−p)` (borne de dérive : au plus une unité de précision)
- `display(t, p) ≤ display(t, p+1)` (raffinement : plus de chiffres n'est jamais pire)

Pour `t < 0` (côté T-), la même définition s'applique à `|t|` et le signe est préservé séparément. De façon équivalente, du côté T-, `display` rapproche la valeur *de* l'époque (puisque la magnitude se rétrécit sous la troncature plancher).

### 6.3 Exigences

- Les implémentations **DOIVENT** utiliser la troncature plancher lors de la réduction de précision.
- Les implémentations **NE DOIVENT PAS** utiliser round-half-up, round-half-even, round-half-down, ni tout mode d'arrondi pouvant produire `display(t, p) > t` (du côté T+).
- Le compteur interne (la valeur en jours écoulés) **DOIT** être maintenu en précision exacte (rationnelle ou Decimal de précision arbitraire). La troncature ne s'applique qu'aux chiffres *affichés*.

### 6.4 Justification (contre half-even)

L'arrondi half-even (« banker's ») est correct pour moyenner des mesures : il élimine le biais statistique long terme. Il est incorrect pour un compteur monotone : un pas half-even peut produire une valeur affichée strictement supérieure au temps réel écoulé, même brièvement. ATS privilégie la monotonicité véridique sur la symétrie de moyennage. Le coût est un biais fixe et déterministe d'au plus une unité de précision affichée *vers le passé* ; ce biais est exposé comme contrat (§6.2) et acceptable pour tout usage privilégiant le déterminisme sur la symétrie.

---

## 7. Fuseaux horaires

ATS n'a **aucun fuseau horaire interne**.

- Les horodatages ATS sont des *instants globaux* exprimés en UTC. La même valeur ATS identifie le même instant UTC partout dans l'univers.
- Les implémentations **NE DOIVENT PAS** porter de champ fuseau horaire sur une valeur ATS. Un format réseau, une colonne de base de données, un type en mémoire pour une valeur ATS **NE DOIT PAS** inclure d'identifiant de fuseau ni d'offset.
- Les implémentations **PEUVENT** présenter une surcouche Local Solar Time (LST) pour le confort humain (par exemple, « à New York, le cadran indique actuellement `.55` du jour local »), mais LST **NE DOIT PAS** être stocké comme partie de la valeur ATS. LST est une commodité de couche présentation définie par :

```
LST(tz, t) = t + tz_offset_at(tz, t)
```

Où `tz_offset_at` consulte l'IANA Time Zone Database pour l'offset (heure d'été comprise) à l'instant `t` dans le fuseau `tz`. La valeur ATS sous-jacente est inchangée. LST est non normatif ; le seul contenu normatif d'une valeur ATS est son instant UTC.

---

## 8. Secondes intercalaires

### 8.1 Longueur du jour

ATS s'aligne sur la sémantique POSIX d'UTC : chaque jour ATS **DOIT** contenir exactement **86 400 secondes SI**.

Les secondes intercalaires UTC — positives (insertions) comme négatives (suppressions, théoriques) — **DOIVENT** être absorbées dans le jour standard. ATS **NE DOIT PAS** émettre de `23:59:60` ni d'indicateur analogue de « leap ».

### 8.2 Politique de lissage

Lorsqu'une seconde intercalaire survient en UTC, les implémentations **DOIVENT** choisir, documenter et appliquer de façon déterministe l'une des politiques de lissage suivantes pour le jour ATS affecté :

- **Lissage POSIX-naïf** : la seconde insérée est mappée sur le même timestamp POSIX que la seconde précédente ; les valeurs ATS « gèlent » donc pendant la seconde intercalaire. RECOMMANDÉ pour l'usage général parce qu'il correspond à la sémantique `time_t`.
- **Lissage linéaire (Google-style)** : la seconde intercalaire est distribuée uniformément sur une fenêtre de 20 heures centrée sur le leap ; chaque Blink ATS pendant la fenêtre est légèrement étiré en termes wall-clock. RECOMMANDÉ pour les systèmes distribués où la tolérance aux sauts d'horloge est faible.
- **Saut discret (TAI-aligned)** : l'implémentation suit le TAI en interne et émet des valeurs ATS décalées de l'offset TAI-UTC courant ; l'événement leap cause un saut discret +1 / −1 seconde dans le mapping UTC mais pas dans TAI. PERMIS pour les usages aérospatiaux et scientifiques.

Les implémentations **DOIVENT** documenter leur choix dans leur documentation publique. Les implémentations échangeant des valeurs ATS **NE DOIVENT PAS** supposer que le récepteur partage la même politique de lissage ; un échange précis à la sous-seconde autour d'un événement leap REQUIERT une coordination hors bande sur l'offset TAI-UTC.

### 8.3 Réservé : variante ATS-TAI

Une révision future **PEUT** définir une variante ATS-TAI dont l'époque est ancrée sur TAI plutôt que sur UTC. ATS-TAI ne requerrait pas de lissage et divergerait d'ATS-UTC de l'offset TAI-UTC courant. Cette variante est réservée ; elle ne fait pas partie de la v0.7.

---

## 9. Définition de la conversion

La conversion d'un instant UTC vers ATS, et inversement, **DOIT** être implémentée selon le pseudo-code ci-dessous. Les implémentations conformantes produisent des résultats bit-à-bit identiques sur les vecteurs de conformance (`docs/spec/test-vectors.json`).

### 9.1 UTC → ATS (gregorian_to_ats)

```
function gregorian_to_ats(utc: UTCInstant) -> ATS:
    # Précision requise : la représentation UTC de l'hôte DOIT résoudre au
    # moins à la microseconde. La résolution sous-microseconde est OPTIONNELLE
    # et n'a de sens qu'en précision étendue (§4.4).
    EPOCH_UTC = "1969-07-20T00:00:00Z"
    US_PER_DAY = 86_400_000_000
    ATS_DECIMALS = 5
    ATS_SCALE = 10 ** ATS_DECIMALS              # = 100_000

    delta_us = microseconds_since(utc, EPOCH_UTC)   # entier signé

    if delta_us >= 0:
        sign = "T+"
        abs_us = delta_us
    else:
        sign = "T-"
        abs_us = -delta_us

    integer_days, remainder_us = divmod(abs_us, US_PER_DAY)
    # frac_int a exactement ATS_DECIMALS = 5 chiffres, dans [0, 100_000).
    frac_int = floor((remainder_us * ATS_SCALE) / US_PER_DAY)

    kilo, rem  = divmod(integer_days, 1000)
    hecto, rem = divmod(rem, 100)
    deka, kin  = divmod(rem, 10)

    return ATS(sign, kilo, hecto, deka, kin, frac_int)
```

### 9.2 ATS → UTC (ats_to_gregorian)

```
function ats_to_gregorian(ats: ATS) -> UTCInstant:
    EPOCH_UTC = "1969-07-20T00:00:00Z"
    US_PER_DAY = 86_400_000_000
    ATS_SCALE = 100_000

    integer_days = ats.kilo * 1000 + ats.hecto * 100 + ats.deka * 10 + ats.kin
    abs_us = integer_days * US_PER_DAY + ats.frac * (US_PER_DAY / ATS_SCALE)
    # Note : US_PER_DAY / ATS_SCALE = 864_000 exactement ; pas d'arrondi.

    if ats.sign == "T+":
        return EPOCH_UTC + abs_us microsecondes
    else:
        return EPOCH_UTC - abs_us microsecondes
```

### 9.3 Contrat de conformance

Une implémentation conformante **DOIT** satisfaire :

```
pour chaque paire (utc, ats) dans test-vectors.json :
    assert gregorian_to_ats(utc) == ats
    assert ats_to_gregorian(ats) == truncate_to_blink(utc)
```

Où `truncate_to_blink(utc)` tronque `utc` au multiple de 864 microsecondes (un Blink) le plus proche dans le passé. Les 12 vecteurs de base de `test-vectors.json` couvrent ATS Terre ; les 10 vecteurs chacun de `test-vectors-multi-planetary-mars.json` et `-moon.json` couvrent l'annexe multi-planétaire.

Une implémentation de référence en Python vit dans `code/ats.py`. Une implémentation de référence en JavaScript vit dans `docs/assets/js/ats.js`. Les deux **DOIVENT** produire une sortie bit-à-bit identique sur tous les vecteurs de conformance.

---

## 10. Décodage de la forme courte

La forme courte `ΔK.H.D.Kin-BC.M` est intentionnellement à perte. Les implémentations la décodant **DOIVENT** appliquer le contrat suivant :

### 10.1 Contrat de décodage

```
function decode_short(short_str: str) -> ATS:
    # Parser selon l'ABNF §5.1. Rejeter toute entrée malformée avec une erreur explicite.
    match = strict_short_regex.match(short_str)
    if match is None:
        raise InvalidShortForm(short_str)
    kilo, hecto, deka, kin, bc, milli = parse(match)
    # La forme courte encode Bloc+Centi comme paire 2 chiffres et Milli comme
    # un seul chiffre ; Beat et Blink sont inconnus et DOIVENT défaut à 0.
    frac = bc * 1000 + milli * 100
    return ATS("T+", kilo, hecto, deka, kin, frac)
```

### 10.2 Contrat de précision

La valeur ATS décodée correspond à un intervalle UTC semi-ouvert. Soit `decoded` le résultat du décodage de la chaîne courte `s`. L'instant UTC vrai qui a produit `s` se trouve dans :

```
[ats_to_gregorian(decoded), ats_to_gregorian(decoded) + 86,4 secondes)
```

C'est-à-dire **exactement un Milli d'incertitude**. Les implémentations exposant le résultat décodé à d'autres systèmes **DOIVENT** le labéliser comme approximatif (précision : ±86,4 s).

### 10.3 Parsing strict

Les implémentations **DOIVENT** rejeter :
- L'ancienne forme `/cc` (séparateur avant v0.7).
- Tout espace n'importe où dans l'entrée.
- Tout marqueur de direction (`T+` ou `T-`).
- L'absence du symbole `Δ` initial.
- Un champ `bc` avec un nombre de chiffres autre que 2.
- L'absence du suffixe `.M` (une forme courte sans le chiffre Milli est malformée).
- Tout caractère non-chiffre dans les champs positionnels.

---

## 11. Durées (Δd)

Jusqu'au §10, ATS décrit des **instants**. Une notation distincte est définie pour les **durées** (différences signées entre instants).

### 11.1 Syntaxe

```
duration     = direction SP "Δd" SP days "." frac
direction    = "T" sign
sign         = "+" / "-"
days         = kilo "." digit "." digit "." digit
kilo         = 1*DIGIT
frac         = 5*DIGIT
```

- Le préfixe `Δd` (« delta-duration ») distingue une durée d'un instant. `Δ` seul dénote toujours un instant.
- Le marqueur de direction est REQUIS, même sur les durées. Une durée est **signée**.
- La valeur absolue d'une durée se note `|Δd|` en texte informel ; la forme canonique porte toujours le signe explicite.

### 11.2 Exemples

- Un Hecto : `T+ Δd 0.1.0.0.00000` (100 jours).
- Une année d'usage grégorien (≈ 365 jours) : `T+ Δd 0.3.6.5.00000`.
- « J'ai vécu 7 Kilos et 893 jours » → `T+ Δd 7.8.9.3.00000`.
- Reculer d'un demi-jour : `T- Δd 0.0.0.0.50000`.

### 11.3 Contraintes

Les durées s'écrivent uniquement en forme canonique ; aucune forme courte n'est définie. Leur précision correspond à celle des instants dont elles dérivent — la règle de troncature plancher (§6) s'applique des deux côtés.

### 11.4 Algèbre (normative)

Les opérations suivantes sont les seules opérations légales sur les types `Δ` (instant) et `Δd` (durée signée). Toute autre combinaison est un comportement indéfini ; les implémentations **DOIVENT** lever une erreur de type.

**Signatures.**

| Opération | Types | Résultat | Description |
|---|---|---|---|
| `Δ + Δd` | (instant, durée) | `Δ` | Avancer un instant d'une durée. |
| `Δd + Δ` | (durée, instant) | `Δ` | Forme commutative de la précédente. |
| `Δ − Δd` | (instant, durée) | `Δ` | Reculer d'une durée. |
| `Δ − Δ` | (instant, instant) | `Δd` | Différence signée entre deux instants. |
| `Δd + Δd` | (durée, durée) | `Δd` | Somme de durées. |
| `Δd − Δd` | (durée, durée) | `Δd` | Différence de durées. |
| `Δd × n` | (durée, scalaire) | `Δd` | Mise à l'échelle d'une durée par un rationnel `n`. |
| `Δd ÷ n` | (durée, scalaire) | `Δd` | Mise à l'échelle inverse. |
| `−Δd` | (durée) | `Δd` | Négation. |
| `|Δd|` | (durée) | `Δd ≥ 0` | Valeur absolue. |

`n` est un entier ou un rationnel quelconque. Les implémentations exposant des durées en virgule flottante **DOIVENT** documenter la précision flottante utilisée et la borne résultante sur l'erreur d'arrondi cumulée.

**Comparaisons.** `< ≤ = ≥ >` sont définies :
- Sur deux valeurs `Δ` : ordre par le compteur signé de jours écoulés (`T-` < `T+`).
- Sur deux valeurs `Δd` : ordre par la valeur signée de durée.
- **Non définies** sur une paire mixte `Δ` × `Δd` : ce sont des types disjoints. Les implémentations **DOIVENT** lever une erreur de type.

**Sémantique de débordement.** Toute opération produisant un instant ou une durée **DOIT** ré-émettre la forme canonique avec :
- Kilo non borné (peut croître arbitrairement) ;
- chiffres Hecto, Deka, Kin dans 0..9 ;
- `frac` tronqué plancher à `ATS_DECIMALS = 5` chiffres par défaut.

**Identités.**
- `T+ Δd 0.0.0.0.00000 == T- Δd 0.0.0.0.00000` (la durée zéro est unique).
- `T+ Δ 0.0.0.0.00000 == T- Δ 0.0.0.0.00000` (l'époque est invariante par signe).

**Vecteurs de conformance.** `docs/spec/test-vectors-arithmetic.json` (12 cas) couvre les sept opérations, les retenues Kin → Deka et Deka → Hecto → Kilo, le franchissement d'époque (T+ → T-) et les comparaisons inter-signes.

---

## 12. Encodage binaire

Pour le stockage, l'IoT et l'échange binaire, ATS définit une disposition **64 bits fixe**.

```
┌──────┬────────────────────────────────────────────────┬──────────────────────────────┐
│ bit  │            high 40 bits (jours, signés)        │   low 24 bits (fraction)     │
│      │  complément à deux, big-endian                 │  big-endian non signé         │
│      │  plage : −2^39 .. 2^39 − 1                     │  0 .. 16_777_215             │
└──────┴────────────────────────────────────────────────┴──────────────────────────────┘
```

### 12.1 Champs

- **`days`** (int40 signé, complément à deux, big-endian) — nombre de jours ATS complets écoulés depuis l'époque. Plage : ±(2^39 − 1) ≈ ±1,5 × 10¹¹ jours, ≈ ±400 millions d'années. Très au-delà de tout horizon pratique.
- **`frac24`** (uint24 non signé, big-endian) — fraction du jour courant, mise à l'échelle sur 24 bits : `frac24 = floor(day_fraction × 2^24)`. Résolution : 1/16 777 216 jour ≈ 5,15 ms.

### 12.2 Encodage (pseudo-code normatif)

```
function encode_binary(ats: ATS) -> bytes:
    integer_days = ats.kilo * 1000 + ats.hecto * 100 + ats.deka * 10 + ats.kin
    days_signed = integer_days if ats.sign == "T+" else -integer_days
    day_fraction = ats.frac / 100_000        # exact quand ats.frac < 100_000
    frac24 = floor(day_fraction * 16_777_216) # 0 .. 16_777_215
    # Pack big-endian 64 bits : top 40 bits = days (complément à deux),
    # bottom 24 bits = frac24.
    return pack_big_endian_int40(days_signed) || pack_big_endian_uint24(frac24)
```

### 12.3 Propriétés

- Une valeur ATS canonique à la précision par défaut 5 chiffres fractionnaires (≈ 864 ms de résolution) round-trippe à travers la forme binaire **sans perte**, parce que 5,15 ms (fraction 24 bits) est plus fin que 864 ms.
- **Au sein d'une même classe de signe**, la comparaison octet-à-octet (`memcmp`) donne l'ordre chronologique. Pour deux instants `T+` (jours non négatifs), `memcmp` équivaut à l'ordre chronologique. Pour deux instants `T-`, `memcmp` est aussi chronologique (plus proche de l'époque trie après, correspondant à « moins loin dans le passé »).
- **À travers les classes de signe**, `memcmp` brut N'EST PAS chronologique, parce que les valeurs négatives en complément à deux commencent par `0xFF…` et trient après les valeurs non négatives commençant par `0x00…`. Les comparaisons mixtes `T+`/`T-` **DOIVENT** utiliser la comparaison entier signé sur le champ jours. Une révision future **PEUT** introduire un encodage à offset biaisé (`days + 2^39`) pour rendre `memcmp` chronologique globalement ; ce n'est pas encore défini.
- La valeur 8 octets entièrement à zéro (`0x00 00 00 00 00 00 00 00`) est l'époque.

### 12.4 Octets de référence (vecteurs de test)

| Instant | Binaire (hex, big-endian) |
|---|---|
| Époque (`T+ Δ 0.0.0.0.00000`) | `00 00 00 00 00 00 00 00` |
| Époque + 1 jour | `00 00 00 00 01 00 00 00` |
| Époque − 1 jour | `FF FF FF FF FF 00 00 00` |
| Époque + 0,5 jour | `00 00 00 00 00 80 00 00` |
| Époque − 0,5 jour | `FF FF FF FF FF 80 00 00` |
| `T+ Δ 20.7.8.2.50000` | `00 00 00 51 1F 80 00 00` |
| `T- Δ 0.0.0.1.00000` | `FF FF FF FF FF 00 00 00` (= époque − 1 jour) |

### 12.5 Interopérabilité

- Les formats réseau **DOIVENT** utiliser l'ordre des octets big-endian. Le stockage little-endian en mémoire n'est permis qu'avec conversion explicite aux bornes d'I/O.
- Les implémentations **DEVRAIENT** préférer la forme 64 bits pour l'embarqué et l'IoT ; la forme canonique textuelle (§4) **DEVRAIT** être utilisée pour les logs et l'échange humainement lisible.

---

## 13. Hors-périmètre

ATS est un système de coordonnées, pas une culture. Les éléments suivants sont explicitement hors périmètre :

1. **ATS ne préserve pas les mois, les jours de la semaine, ni les cycles religieux.** Les calendriers culturels (hébraïque, islamique, chinois, hindou, maya, liturgique, baha'i, etc.) **PEUVENT** exprimer le même instant UTC dans leurs propres systèmes positionnels. ATS fournit l'interopérabilité entre tels systèmes ; il ne les déplace pas. Les bridges de conformance (`code/bridges/*.py`) démontrent qu'une implémentation peut exprimer un instant ATS dans n'importe quel calendrier culturel.

2. **ATS n'encode pas directement le midi solaire local.** Lever, coucher et midi local sont des fonctions de la position géographique. Ce sont des préoccupations de couche présentation. Cf. §7 sur LST.

3. **ATS ne légifère pas sur un rythme travail-repos.** Le Deka (10 jours) est une unité de mesure, pas un mandat social. Toute convention sociale superposée au Deka (par exemple, 7+3 travail-repos, 6+4, 5+5) est une *convention* (cf. `conventions.md`), jamais normative.

4. **ATS ne prend pas position sur l'observance religieuse.** Le Sabbat, la prière du vendredi, Pâques, l'Aïd al-Fitr, Diwali et autres observances sont des événements sur l'horloge murale ; une implémentation ATS peut les stocker et les rapporter, mais ATS ne les interprète ni ne les hiérarchise.

5. **ATS ne remplace pas UTC.** ATS est une *représentation* d'instants UTC. Migrer d'une représentation basée sur UTC (ISO 8601, epoch Unix) vers ATS laisse la chronologie sous-jacente inchangée. UTC reste la source de vérité ; ATS est la projection canonique d'UTC dans un système de coordonnées décimal.

6. **ATS ne s'impose pas sur les corps qu'il n'adresse pas.** L'annexe multi-planétaire définit des ancrages pour Mars et la Lune. Les corps pour lesquels aucune annexe n'existe (Vénus, Europe, exoplanètes) n'ont pas de compteur ATS normatif ; les tiers **PEUVENT** définir le leur à l'aide du framework générique (`multi-planetary.md §6`).

7. **ATS ne prétend pas être plus « spirituel » ou plus « naturel » que les alternatives.** ATS revendique d'être plus *computationnel* : précis, non ambigu, base-10, sans fuseau, sans mois. Les vertus computationnelles suffisent comme justification ; aucune revendication esthétique ou métaphysique n'est faite par ce document.

---

## 14. Annexes

- **Philosophy** (`philosophy.md`) — non normative. Pourquoi ATS : alignement avec les cycles biologiques (circadien, social, projet, générationnel) ; rituels proposés (Kilo-versaire, Hecto-fête).
- **Comparison** (`comparison.md`) — non normative. ATS face à Holocène, International Fixed Calendar, Hanke-Henry, Républicain français, Swatch Internet Time, Darian (Mars).
- **Conventions** (`conventions.md`) — non normative. Kilo-versaire, Hecto-fête, rythme 7+3, bandes solaires 08-22. Décrites, non requises.
- **Versioning & stability** (`versioning.md`) — normative. Contrat SemVer, gels post-v1.0, politique additive des vecteurs, processus RFC. Cf. §15.
- **Multi-planétaire** (`multi-planetary.md`) — normative. Étend le compteur ATS à d'autres corps célestes (Mars, Lune) et fournit un framework générique `Δ_X(epoch, day_seconds)` pour les corps tiers. Préserve les formats canonique, courte, binaire et l'algèbre §11.4.
- **Cadran analogique** (`analog-clock.md`) — non normative. Disposition de référence du cadran et formules angulaires pour le rendu analogique.
- **Vecteurs de test** (`test-vectors.json`, `test-vectors-arithmetic.json`, `test-vectors-multi-planetary-mars.json`, `test-vectors-multi-planetary-moon.json`, `test-vectors-bridges-*.json`) — suites de conformance machine-readable ; toutes portent un `spec_version` racine.

---

## 15. Versionnement et stabilité

### 15.1 Version courante

Ce document spécifie ATS **v0.7 (pré-release)**.

### 15.2 Contrat SemVer

- **Pré-v1.0** (actuel) : les changements rupture sont PERMIS aux versions mineures. Chaque changement **DOIT** être consigné dans `CHANGELOG.md` avec une note de migration. Les vecteurs de conformance portent `spec_version` pour que les consommateurs détectent quelle spec les a produits.
- **Post-v1.0** (engagé ci-dessous) : les changements rupture **NE DOIVENT PAS** être introduits aux versions mineures. Les bumps de version majeure sont réservés aux changements rupture ; les versions mineures sont additives uniquement ; les versions patch sont des clarifications uniquement.

### 15.3 Engagements de stabilité post-v1.0

Les éléments suivants sont **gelés** post-v1.0. Les modifier requiert un bump de version majeure :

- L'époque (`1969-07-20T00:00:00Z`).
- L'échelle d'unités (Kin / Deka / Hecto / Kilo / Bloc / Centi / Milli / Beat / Blink).
- La précision canonique par défaut (5 chiffres fractionnaires, Blink).
- La syntaxe de la forme courte (`ΔK.H.D.Kin-BC.M`).
- La disposition de l'encodage binaire (40+24 bits, big-endian, complément à deux).
- Le préfixe de durée (`Δd`).
- La longueur du jour Terre (86 400 secondes SI ; cf. §8 pour la politique leap).

Les éléments suivants **PEUVENT** évoluer aux versions mineures post-v1.0 de façon additive uniquement :

- Nouveaux vecteurs de conformance (additif uniquement ; les vecteurs précédemment valides restent valides).
- Nouvelles annexes (non normatives).
- Nouveaux corps célestes dans l'annexe multi-planétaire (additif uniquement).
- Nouvelles opérations algébriques sur `Δd`, à condition qu'elles soient des extensions, pas des modifications de celles existantes.

### 15.4 Changements de v0.3.x (« RC v1.1 ») à v0.7

- **Époque déplacée** de l'instant d'alunissage (1969-07-20T20:17:40Z) au début du jour d'alunissage (1969-07-20T00:00:00Z). Conséquence directe : Bloc 5 = 12:00 UTC exactement.
- **Myriade** retirée du format positionnel ; Kilo est non borné. « Génération » rétrogradée au vocabulaire informel (note §4.2).
- L'unité 0,1 jour renommée `D-Day` → `Bloc`.
- **Forme courte** évoluée : `Δ K.H.D.Kin/cc` → `ΔK.H.D.Kin-BC.M` en v0.7 (pas d'espace après Δ, séparateur `-` au lieu de `/`, chiffre Milli ajouté). Le chiffre Kin est toujours montré pour préserver la référence calendaire.
- **Politique d'arrondi** formalisée comme troncature plancher stricte. Une variante half-even « banker's » a été rejetée comme incompatible avec le principe du « compteur d'unités complétées » (§6.4).
- Surcouche Local Solar Time (LST) introduite formellement comme overlay de présentation non normatif (§7).
- Politique des secondes intercalaires formalisée avec trois options de lissage permises (§8.2).
- §11 (Durées / `Δd`) et §12 (Encodage binaire, 64 bits) ajoutés.
- §11.4 (Algèbre des durées) ajoutée.
- §1.1 (Ce qu'ATS n'est pas), §1.2 (Alignement biologique de l'échelle d'unités), §2.3 (L'époque résiste à quatre attaques) et §16 (Processus et gouvernance) ajoutés en v0.7 comme contenu normatif défensif.
- Annexe multi-planétaire promue au statut normatif (v0.7).

---

## 16. Processus standards et gouvernance

### 16.1 Modèle de processus

ATS est développé comme une **spécification publique vivante**. Les décisions normatives sont prises par les éditeurs du document ; le public participe en soumettant issues et pull requests contre le texte canonique. Les implémentations conformantes sont listées dans le `README.md` du projet.

### 16.2 Procédure RFC

Tout changement normatif à ce document **DOIT** suivre la procédure RFC définie dans `versioning.md §6` :

1. Le proposeur ouvre un document RFC public (issue GitHub ou pull request) décrivant le changement, la justification et le chemin de migration.
2. La RFC reste ouverte au commentaire public pendant un minimum de 14 jours calendaires.
3. Les éditeurs du document enregistrent une décision (accepter, modifier, rejeter) avec raisonnement.
4. Les changements acceptés sont consignés dans `CHANGELOG.md` et deviennent normatifs au merge.

### 16.3 Intention IANA / IETF

Les éditeurs ont l'INTENTION de soumettre ATS comme RFC informationnelle à l'IETF après le gel v1.0. Un registre IANA est prévu pour les labels de forme canonique et de forme courte, les identifiants de corps multi-planétaires et les emplacements des vecteurs de conformance. Jusqu'à l'adoption par un organisme de normalisation reconnu, ATS est une **spécification développée publiquement**, pas un standard international reconnu.

Ce positionnement est intentionnel et n'est pas une faiblesse. Beaucoup de standards largement déployés (TOML, JSON, EditorConfig) ont commencé comme spécifications développées publiquement hors des organismes formels. Le critère qui compte est la **reproductibilité de conformance** : deux implémentations passant les vecteurs de conformance produisent une sortie identique. ATS satisfait ce critère en v0.7.

### 16.4 Gouvernance

Jusqu'à v1.0, les décisions normatives appartiennent aux éditeurs d'enregistrement du document. Post-v1.0, la gouvernance est engagée vers un modèle multi-éditeurs avec les propriétés suivantes :

- Un minimum de trois éditeurs d'enregistrement, listés dans `GOVERNANCE.md`.
- Règle de décision : consensus approximatif (style IETF) avec veto éditeur sur les préoccupations de compatibilité descendante.
- Archive RFC publique : chaque RFC acceptée et rejetée est préservée dans `docs/spec/rfcs/`.
- Rotation d'implémenteur : une implémentation conformante reconnue **PEUT** nommer un éditeur au panel.

### 16.5 Conformance

Une implémentation REVENDIQUE LA CONFORMANCE à cette spécification en :

1. Passant `docs/spec/test-vectors.json` (Terre) bit-à-bit.
2. Passant `docs/spec/test-vectors-arithmetic.json` (algèbre) bit-à-bit.
3. Implémentant les parseurs stricts pour les formes canonique et courte.
4. Documentant sa politique de lissage des secondes intercalaires (§8.2).
5. Documentant sa classe de précision (5 chiffres par défaut, ou étendue).

La conformance est **binaire, non graduée** : une implémentation est conformante ou ne l'est pas. La conformance partielle aux sections optionnelles (multi-planétaire, encodage binaire) **DOIT** être documentée explicitement.

---

## 17. Glossaire (complet)

- **ATS** — Apollonian Time System ; ce standard.
- **Beat** — Unité positionnelle micro, 0,0001 jour ≈ 8,64 s (§4.3).
- **Bloc** — Unité positionnelle micro, 0,1 jour = 2 h 24 min (§4.3).
- **Blink** — Unité positionnelle micro, 0,00001 jour ≈ 0,864 s (§4.3).
- **Forme canonique** — Représentation textuelle pleinement qualifiée (§4).
- **Centi** — Unité positionnelle micro, 0,01 jour = 14 min 24 s (§4.3).
- **Vecteur de conformance** — Cas de test normatif dans un fichier JSON utilisé par toutes les implémentations pour vérifier la sortie bit-à-bit identique.
- **Δ** — Symbole d'instant ATS (U+0394).
- **Δd** — Symbole de durée ATS.
- **Deka** — Unité positionnelle macro, 10 jours (§4.2).
- **Dérive** — Différence bornée entre un instant vrai et sa forme affichée tronquée (§6.2).
- **Époque** — Instant UTC de référence `1969-07-20T00:00:00Z` (§2).
- **Troncature plancher** — Mode d'arrondi mandaté par le §6.
- **Génération** — Label informel pour ≈ 10 000 jours (≈ 27,4 ans) ; PAS une unité positionnelle (§4.2).
- **Hecto** — Unité positionnelle macro, 100 jours (§4.2).
- **Kilo** — Unité positionnelle macro, 1 000 jours ; le seul chiffre positionnel non borné (§4.2).
- **Kin** — Unité positionnelle macro, 1 jour ; le jour solaire (§4.2).
- **Lissage de seconde intercalaire** — Politique choisie par l'implémentation pour absorber les secondes intercalaires UTC (§8.2).
- **LST** — Local Solar Time ; surcouche de présentation non normative (§7).
- **Milli** — Unité positionnelle micro, 0,001 jour ≈ 1 min 26,4 s (§4.3).
- **Annexe multi-planétaire** — Annexe normative étendant ATS à des corps autres que la Terre.
- **Forme courte** — Représentation tronquée conversationnelle (§5).
- **Spec_version** — Chaîne au niveau racine dans les fichiers de vecteurs de conformance identifiant la révision de spec qui les a produits.
- **T+, T-** — Marqueurs de direction (§3).
- **UTC** — Temps universel coordonné (§0.2).

---

## Références

- **RFC 2119** — Key words for use in RFCs to Indicate Requirement Levels.
- **RFC 5234** — Augmented BNF for Syntax Specifications: ABNF.
- **RFC 5905** — Network Time Protocol Version 4: Protocol and Algorithms Specification.
- **RFC 8174** — Ambiguity of Uppercase vs Lowercase in RFC 2119 Key Words.
- **ITU-R TF.460** — Standard-frequency and time-signal emissions (UTC).
- **ISO 8601** — Date and time format.
- **BCP 14** — RFC 2119 + RFC 8174 (requirement levels).
- **IEEE 1588** — Precision Time Protocol (PTP).
