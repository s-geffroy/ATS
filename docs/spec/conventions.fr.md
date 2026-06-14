# Conventions ATS — annexe non normative

> *Les conventions sont opt-in. Le standard n'en exige aucune ; cette annexe documente ce qui fonctionne pour les adopteurs qui choisissent de superposer la pratique humaine au compteur temporel. Adopter ATS n'engage aucune communauté à aucune convention listée ici.*

**Statut :** Pré-release v0.7
**Type de document :** **ANNEXE NON NORMATIVE** à la spécification ATS.
**Référence normative :** `manifesto.fr.md` (la spec proprement dite).
**Langue source :** Anglais (`conventions.en.md`). Cette traduction française est fournie pour l'accessibilité ; en cas de divergence, l'anglais fait foi.
**Posture centrale :** Cette annexe documente des **conventions sociales** observées, recommandées et expérimentales construites par-dessus ATS — cycles de célébration, rythmes travail-repos, bandes solaires, compteurs personnels, jalons civilisationnels. Chaque convention est offerte avec citations ou avec reconnaissance explicite d'être une proposition. La conformance ATS (`manifesto.fr.md §16.5`) est **indépendante** de chaque section de ce document.

---

## 0. Périmètre et posture

Cette annexe est **non normative**. Une implémentation strictement conforme à `manifesto.fr.md` peut ignorer chaque section de ce document.

Ce que cette annexe offre :

- Un catalogue de **conventions opt-in** que les adopteurs d'ATS ont trouvées utiles — Kilo-versaire, Hecto-fête, rythme 7+3, bandes solaires, compteurs personnels, jalons.
- Pour chaque convention : une définition, la méthode de calcul, l'usage suggéré, des parallèles avec des motifs culturels existants, et des citations là où des affirmations empiriques sont faites.
- Une section explicite **« ce que ces conventions ne sont pas »** (§6) qui pré-empte les erreurs de catégorie.
- Une section explicite **objections anticipées** (§7) qui traite les attaques les plus courantes sur les conventions.

Ce que cette annexe *n'offre pas* :

- Une prescription pour la culture temporelle d'une communauté. Chaque convention est opt-in.
- Une revendication que les conventions ATS sont supérieures aux rythmes culturels existants (Sabbat, dimanche, prière du vendredi, moissons, festivals). Elles sont *parallèles*, pas des remplacements.
- Une revendication que les jalons civilisationnels portent une signification spéciale au-delà de leur arithmétique. `Δ 1000` est juste `époque + 1 000 jours` ; le « sens » est ce qu'une communauté choisit d'y attacher.
- Une anthropologie universaliste. Le rythme 7+3, la bande solaire 08–22, les Trois Ères (cf. `philosophy.fr.md §5`) reflètent tous des cadrages culturels spécifiques. Les alternatives sont explicitement reconnues dans chaque section.

La posture est **affirmative mais transparente** : chaque affirmation chiffrée est vérifiable, chaque choix culturel est étiqueté, chaque convention est réversible. Les communautés ne perdent rien à ignorer toute ou partie de cette annexe.

---

## 1. Cycles de célébration

ATS propose quatre cycles de célébration, chacun calé sur une unité positionnelle du calendrier :

- **Kilo-versaire** tous les 1 000 jours (§1.1).
- **Hecto-fête** tous les 100 jours (§1.2).
- **Deka-day** tous les 10 jours (§1.3).
- **Beat-mark** et **Blink-flash** pour la décoration sous-seconde (§1.4, optionnel).

### 1.1 Kilo-versaire (tous les 1 000 jours, ≈ 2,74 ans)

Un **Kilo-versaire** marque le passage d'un Kilo complet — 1 000 jours depuis l'époque d'un compteur.

**Calcul.** Étant donné un instant de référence `t₀` (l'époque, une naissance, le début d'un projet), le n-ième Kilo-versaire est :

```
Kilo_n = t₀ + Δd n.0.0.0.00000
```

En forme courte : `Δ K!` (où `K = n`). Exemple : `Δ 22!` dénote le 22ᵉ Kilo-versaire de l'époque civilisationnelle, tombant à `T+ Δ 22.0.0.0.00000` = 2029-04-08T00:00:00Z.

**Kilo-versaires civilisationnels.** Le tableau de référence ci-dessous enregistre les dix premiers Kilo-versaires de l'époque ATS :

| n | ATS | Date UTC | Notes |
|---|---|---|---|
| 0 | `T+ Δ 0.0.0.0.00000` | 1969-07-20 | Époque — jour de l'alunissage d'Apollo 11. |
| 1 | `T+ Δ 1.0.0.0.00000` | 1972-04-15 | Premier Kilo-versaire du premier jour lunaire de l'espèce. |
| 2 | `T+ Δ 2.0.0.0.00000` | 1975-01-09 | Second Kilo. |
| 3 | `T+ Δ 3.0.0.0.00000` | 1977-10-05 | Troisième Kilo. |
| 4 | `T+ Δ 4.0.0.0.00000` | 1980-07-01 | Quatrième Kilo. |
| 5 | `T+ Δ 5.0.0.0.00000` | 1983-03-28 | Cinquième Kilo. |
| 10 | `T+ Δ 10.0.0.0.00000` | 1996-12-04 | Premier Deka de Kilos (10 000 jours). |
| 20 | `T+ Δ 20.0.0.0.00000` | 2024-04-23 | Vingtième Kilo — une « Génération » (informelle). |
| 25 | `T+ Δ 25.0.0.0.00000` | 2038-05-29 | Quart-de-siècle-Kilo. |
| 50 | `T+ Δ 50.0.0.0.00000` | 2106-08-22 | Demi-siècle-Kilo. |

**Usage personnel.** Tout individu ou organisation peut calculer sa propre série de Kilo-versaires en choisissant `t₀` = instant de naissance ou de fondation. La page de référence `age.html` implémente cela pour l'usage personnel et exporte des événements `.ics` pour les dix prochains Kilo-versaires.

**Parallèles dans les cultures existantes.** Le Kilo-versaire occupe une fenêtre temporelle où aucun rituel répandu existant ne siège : entre les anniversaires annuels (trop fréquents pour la réflexion à l'échelle projet) et les jubilés décennaux (trop rares). Motifs comparables :

- Jubilés catholiques décennaux et années de pèlerinage (tous les 25 ans à partir de 1300 ; tous les 50 ans à partir de 1450).
- Réunions universitaires des cinq ans dans la tradition anglophone.
- La cadence soviétique « Piatiletka » (plan quinquennal).
- Rétrospectives OKR / planification stratégique aux frontières trimestrielles ou semestrielles (cf. `philosophy.fr.md §4`).

Un Kilo-versaire s'insère entre ces motifs et fournit un point de réflexion personnelle ou organisationnelle à cadence stable.

### 1.2 Hecto-fête (tous les 100 jours, ≈ 3,3 mois)

Une **Hecto-fête** marque le passage d'un Hecto. Plus fréquente qu'un Kilo-versaire, proposée comme **rythme trimestriel décimal** sans dépendance aux saisons astronomiques ni aux mois calendaires.

**Calcul.** La h-ième Hecto-fête à l'intérieur du Kilo k est à `T+ Δ k.h.0.0.00000`.

**Hecto-fêtes civilisationnelles.** Les onze premières Hecto-fêtes après l'époque :

| ATS | Date UTC | Note |
|---|---|---|
| `T+ Δ 0.0.0.0.00000` | 1969-07-20 | Époque (aussi Kilo-versaire 0). |
| `T+ Δ 0.1.0.0.00000` | 1969-10-28 | Première Hecto-fête. |
| `T+ Δ 0.2.0.0.00000` | 1970-02-05 | Seconde Hecto. |
| `T+ Δ 0.5.0.0.00000` | 1970-11-21 | Demi-Kilo. |
| `T+ Δ 0.9.0.0.00000` | 1972-01-06 | Dernière Hecto avant le Kilo 1. |
| `T+ Δ 1.0.0.0.00000` | 1972-04-15 | Kilo-versaire 1. |

**Usage proposé.** Rétrospectives de projet, revues trimestrielles OKR, bilans de bien-être organisationnel, jalons de challenges fitness. Le motif des 100 jours est bien attesté dans la pratique humaine (cf. `philosophy.fr.md §4.2`) : « 100 premiers jours » dans les transitions politiques, jalons de récupération d'addiction à 90 jours, challenges fitness 100 jours. L'Hecto-fête formalise cela comme caractéristique calendaire plutôt que tradition ad-hoc.

**Coexistence avec les trimestres grégoriens.** Un trimestre grégorien fait 90–92 jours ; un Hecto fait 100. Les deux cadences dérivent d'environ 10 jours par cycle. Les organisations utilisant les deux conservent les trimestres grégoriens pour le reporting fiscal et superposent les Hecto-fêtes comme points de revue supplémentaires ; la dérive est suffisamment petite pour être cognitivement gérable.

### 1.3 Deka-day (tous les 10 jours)

Un **Deka-day** marque la frontière entre Dekas — `T+ Δ k.h.d.0.00000`. Optionnel et léger ; suggéré comme marqueur de rythme pour les communautés utilisant la répartition 7+3 (§2). Dans ce contexte, le Deka-day est la transition entre la phase de repos d'un Deka et la phase active du suivant.

Pour les communautés n'utilisant pas la répartition 7+3, le Deka-day n'a aucune valeur rituelle particulière ; il reste un tick calendaire.

### 1.4 Beat-mark et Blink-flash (décoration sous-seconde)

Deux conventions décoratives optionnelles pour les affichages live :

- **Beat-mark.** Une pulsation visuelle subtile à chaque Beat (8,64 s). Utilisée sur l'horloge analogique (`analog-clock.md`) comme l'anneau intérieur de marques. Peut aussi être utilisée comme indicateur de battement de cœur dans les dashboards.
- **Blink-flash.** Un flash visuel à l'échelle du pixel à chaque Blink (0,864 s). L'horloge analogique de référence a une aiguille Blink et un petit disque qui tournent ensemble (cf. `analog-clock.md §5`) ; la décoration en point est un Blink-flash.

Aucun n'a de statut normatif ; ce sont des choix de présentation que les adopteurs trouvent agréables.

---

## 2. Le rythme 7+3 sur le Deka

Le **rythme 7+3** est une convention sociale optionnelle qui découpe le Deka de 10 jours en :

- **7 jours actifs** (travail, école, engagement).
- **3 jours de repos** (récupération, famille, projets personnels, participation civique).

### 2.1 Le tableau

| Jour du Deka (dernier chiffre) | Phase | Rôle proposé |
|---|---|---|
| 1, 2, 3, 4, 5, 6, 7 | **Actif** | Travail, école, projets, focalisation soutenue |
| 8, 9, 0 | **Repos** | Récupération, social, personnel, civique |

### 2.2 Comparaison avec la semaine grégorienne 5+2

| Rythme | Jours actifs | Jours de repos | Longueur du cycle | Ratio actif | Ratio repos |
|---|---|---|---|---|---|
| Grégorien 5+2 | 5 | 2 | 7 | 71 % | 29 % |
| ATS 7+3 | 7 | 3 | 10 | 70 % | 30 % |

Le rythme 7+3 préserve le *ratio* travail-repos de la semaine 5+2 à un point de pourcentage près tout en s'alignant sur le calendrier décimal (un Hecto = 10 Dekas = 10 cycles complets, pas de dérive).

### 2.3 Répartitions alternatives

Le rythme 7+3 est **une** convention parmi plusieurs qu'une communauté adoptant ATS pourrait utiliser. L'unité Deka rend une telle variation lisible parce que chaque ratio est un énoncé de la longueur d'une phrase ; le ratio existant 5+2 est opaque pour quiconque hors de la convention. Répartitions alternatives :

| Répartition | Ratio actif | Profil de repos | Adaptée à |
|---|---|---|---|
| **7+3** | 70 % | Un week-end de 3 jours | Défaut général, ratio équivalent à 5+2 |
| **6+1+2+1** | 70 % | Pause mi-Deka + week-end | Anti-burnout, récupération distribuée |
| **8+2** | 80 % | Un week-end de 2 jours | Travail haute intensité cycle court |
| **5+5** | 50 % | Alternance sabbatique | Travail créatif / autonome |
| **6+4** | 60 % | Long week-end | Communauté orientée récupération |

Le choix est **social**, non spécifié par le standard.

### 2.4 Pluralité culturelle (reconnaissance explicite)

Le rythme 7+3 est offert comme convention **superposée à** ATS, pas comme déplacement de tout rythme culturel existant. La semaine liturgique de 7 jours (Sabbat hébraïque, dimanche chrétien, prière du vendredi islamique) est un cadre religieux avec sa propre logique, et le rythme 7+3 ne s'aligne pas avec elle : un Sabbat qui se répète tous les 7 jours terrestres tombera sur différentes positions des Dekas consécutifs. Les communautés engagées dans la semaine liturgique de 7 jours ont trois réponses raisonnables :

1. **Retenir la semaine grégorienne à côté d'ATS.** Le compteur ATS et la semaine liturgique de 7 jours coexistent sur la même chronologie. ATS est utilisé pour le logiciel, la comptabilité, les données scientifiques ; la semaine grégorienne gouverne la pratique liturgique.
2. **Adopter 7+3 séculièrement** tout en retenant l'observance liturgique de 7 jours en parallèle. Le Sabbat est observé comme d'habitude ; le rythme 7+3 structure le motif séculier travail-repos. Les deux cycles se chevauchent avec une dérive prévisible.
3. **Décliner entièrement le rythme 7+3** et définir un rythme spécifique à la communauté sur le Deka (par exemple 6+1+2+1 pour permettre une observance Sabbat à mi-Deka).

Aucune option n'est normativement préférée. Le standard ATS n'exige aucun rythme choisi ; il exige seulement le compteur (`manifesto.fr.md §13.3`).

### 2.5 Sourcer la revendication du ratio de repos

L'objectif 70 % actif / 30 % repos est empiriquement fondé :

- La littérature moderne de santé au travail (Schaufeli & Bakker 2004 ; Maslach 2003 ; OMS 2019) documente que le ratio de repos 29 % du cycle 5+2 est à l'extrémité basse des normes historiques et biologiques.
- Le travail saisonnier pré-industriel atteignait 30–40 % de repos, variant par saison (Thompson 1967).
- La Convention OIT 47 (1935) sur la semaine de 40 heures suppose implicitement un cycle 5+2 avec 29 % de repos.
- Un ratio de repos de 30 % (7+3) approche la moyenne pré-industrielle tout en restant compatible avec les attentes de productivité modernes.

Le rythme 7+3 est donc une *petite* déviation du statu quo 5+2 (un jour de repos supplémentaire par cycle), pas un départ radical. Les communautés l'adoptant connaissent une charge active marginalement plus légère et un budget de repos marginalement plus lourd ; l'effet cumulé sur un Hecto est de +10 jours de repos vs la période grégorienne équivalente.

---

## 3. Bandes solaires locales (08–22)

Le cadran analogique du site (cf. `analog-clock.md`) dessine, pour chaque ville, un **arc** correspondant à sa journée active locale 08:00 → 22:00. Cette convention est la base de la coloration des activités quotidiennes sur la carte Cités (`/fr/cities.html`).

### 3.1 Les bandes

| Section | Heure locale | Label | Style d'arc de référence |
|---|---|---|---|
| **Matin** | 08:00 – 12:00 | `morning` | pointillé |
| **Midi** | 12:00 – 14:00 | `noon` | plein |
| **Après-midi** | 14:00 – 18:00 | `afternoon` | tireté |
| **Soir** | 18:00 – 22:00 | `evening` | tireté-pointillé |
| **Nuit** | 22:00 – 08:00 | `night` | (aucun arc ; le cadran est sombre dans cette bande) |

### 3.2 Pourquoi 08–22 spécifiquement

Les bornes sont un compromis empirique entre trois contraintes :

- **Recommandations de sommeil.** La Sleep Foundation (Hirshkowitz et al. 2015) recommande 7–9 heures pour les adultes, avec un coucher dans la fenêtre 22:00–24:00 pour les chronotypes typiques. La borne 22:00 préserve un temps de transition avant le sommeil.
- **Heures d'ouverture commerciales.** Les heures d'ouverture commerciales standards en Europe et aux Amériques s'étendent de 08:00 à 22:00 avec variation régionale. Les bornes s'alignent sur l'emploi du temps observable modal (Eurostat 2019 données heures-de-vente-au-détail).
- **Fenêtres scolaires et de trajet.** Les heures d'entrée scolaire dans les pays OCDE se groupent autour de 08:00 (OCDE 2022 indicateurs d'éducation) ; le trajet du soir se termine à 19:00 pour la plupart des travailleurs. La borne 08:00 marque le début de la journée institutionnelle.

### 3.3 Variation et cas particuliers

La bande 08–22 est un **défaut**, pas un mandat. Les implémentations sont libres d'utiliser d'autres bornes, et plusieurs cas particuliers motivent la variation :

- **Régions polaires.** Au-dessus du Cercle Arctique et en-dessous du Cercle Antarctique, le temps solaire perd son sens pendant le jour ou la nuit polaire. Les implémentations couvrant ces régions devraient utiliser des bandes basées sur l'horloge plutôt que solaires-relatives.
- **Culture de la sieste méditerranéenne.** Les villes du sud de l'Europe et de l'Amérique latine étendent communément la journée active à 23:00 ou 00:00, avec une pause mi-après-midi. Une bande 08–24 peut être plus représentative.
- **Climats tropicaux à départ matinal.** Beaucoup de villes tropicales démarrent la journée active à 06:00 pour éviter la chaleur de midi. Une bande 06–22 peut être plus représentative.
- **Fenêtres d'observance religieuse.** Les cinq prières quotidiennes islamiques structurent la journée différemment ; les fenêtres matinales et du soir de puja hindoue de même. Les implémentations servant ces communautés peuvent superposer des marqueurs de prière sur le cadran.

Quand une implémentation choisit des bornes non par défaut, il est **RECOMMANDÉ** que le choix soit documenté dans l'attribut `aria-describedby` du SVG concerné, pour que les lecteurs d'écran et les consommateurs en aval comprennent la convention en usage.

### 3.4 Sources

Le dataset de la carte Cités (`docs/assets/data/cities.json`) porte des heures d'activité par ville collectées depuis les normes régionales et les médianes publiées. La note du dataset énonce explicitement : *« Moyennes culturelles indicatives pour des capitales représentatives — issues de normes régionales (semaine de travail, horaires scolaires, repas). Les heures locales sont des médianes publiées. »* Les bandes 08–22 sont un défaut visuel ; les heures d'activité par ville dévient selon la coutume locale.

---

## 4. Compteurs personnels

Tout instant ATS personnel `Δ_self` (typiquement un instant de naissance) peut être utilisé comme point de référence alternatif pour calculer un compteur **ego-centré** :

### 4.1 Calcul

```
Δd_age = Δ_now − Δ_self
```

où `Δ_now` est l'instant ATS courant et `Δ_self` est la référence (naissance, fondation, début de projet). Le résultat est une durée signée (`Δd`) dans la forme canonique de durée ATS (cf. `manifesto.fr.md §11`).

### 4.2 Exemples

| Événement de référence | Δ_self | Temps écoulé | Résultat |
|---|---|---|---|
| Naissance le 2000-01-01 | `T+ Δ 11.1.2.5.50000` | À 2026-06-13 12:00 UTC | `T+ Δd 9.6.5.7.00000` (≈ 26,5 ans) |
| Lancement de projet | `T+ Δ 20.5.3.0.00000` | Après 247 jours | `T+ Δd 0.2.4.7.00000` |
| Doctorat commencé | `T+ Δ 19.8.5.6.50000` | Après 1500 jours | `T+ Δd 1.5.0.0.00000` |

### 4.3 Kilo-versaire personnel

Le n-ième Kilo-versaire personnel est l'instant `Δ_self + Δd n.0.0.0.00000`. La page de référence `age.html` calcule les dix prochains Kilo-versaires pour une date de naissance donnée et les exporte comme événements de calendrier `.ics`.

### 4.4 Algèbre multi-compteurs

L'algèbre ATS (`manifesto.fr.md §11.4`) permet une arithmétique arbitraire sur les compteurs personnels :

- Différence entre les âges de deux personnes : `(Δ_now − Δ_self_A) − (Δ_now − Δ_self_B) = Δ_self_B − Δ_self_A`.
- Temps jusqu'au n-ième Kilo-versaire : `(Δ_self + Δd n.0.0.0.00000) − Δ_now`.
- Âge moyen d'une équipe : `(Σ (Δ_now − Δ_self_i)) ÷ N`.

Ces calculs sont stables dans le temps à travers les changements de fuseau et de DST parce que tous les opérandes sont des instants UTC.

---

## 5. Suggestions de jalons

Les jalons civilisationnels et multi-planétaires suivants sont offerts comme suggestions, sans valeur normative. Les communautés sont libres de calculer les leurs.

### 5.1 Jalons civilisationnels Terre

| Jalon | ATS | UTC | Cadrage culturel suggéré |
|---|---|---|---|
| Premier Hecto | `T+ Δ 0.1.0.0.00000` | 1969-10-28 | « Réflexion à cent jours post-alunissage. » |
| Premier Kilo | `T+ Δ 1.0.0.0.00000` | 1972-04-15 | « Premier Kilo-versaire de l'humanité lunaire. » |
| Premier Deka de Kilos | `T+ Δ 10.0.0.0.00000` | 1996-12-04 | « Dix Kilos = 10 000 jours = première Génération informelle. » |
| Vingtième Kilo | `T+ Δ 20.0.0.0.00000` | 2024-04-23 | « Deux Générations depuis Apollo 11. » |
| Quart-de-siècle Kilo | `T+ Δ 25.0.0.0.00000` | 2038-05-29 | « Quart d'un centi-Kilo. » |
| Demi-siècle Kilo | `T+ Δ 50.0.0.0.00000` | 2106-08-22 | « Demi-centi-Kilo. » |
| Centi-Kilo (Cent Kilos) | `T+ Δ 100.0.0.0.00000` | 2243-10-25 | « Cent mille jours post-alunissage. » |

### 5.2 Jalons multi-planétaires (cf. `multi-planetary.md`)

Ces jalons sont calculés sur les époques spécifiques aux corps. Ils ne coïncident pas en UTC-Terre.

| Corps | Jalon | ATS | UTC-Terre approximatif |
|---|---|---|---|
| Terre | Premier Kilo lunaire | `T+ Δ_Earth 1.0.0.0.00000` | 1972-04-15 (cf. §5.1) |
| Lune | Premier Kilo Lunaire (compteur Δ_Moon) | `T+ Δ_Moon 1.0.0.0.00000` | Époque lunaire + 1 000 sols (≈ 2050) — cf. annexe |
| Mars | Premier Kilo Martien (compteur Δ_Mars) | `T+ Δ_Mars 1.0.0.0.00000` | Époque Mars-Pathfinder (1997) + 1 000 sols (≈ 2000-04-01) |

Les équivalents UTC exacts dépendent de la longueur du jour spécifique au corps (sols vs jours terrestres) ; cf. `multi-planetary.md §5` et les vecteurs de conformance.

### 5.3 Jalons personnels

Tout individu ou organisation calcule ses propres jalons en utilisant §1.1 (Kilo-versaire) et §1.2 (Hecto-fête). La page de référence `age.html` génère un calendrier personnalisé de jalons.

---

## 6. Ce que ces conventions *ne sont pas*

Pour pré-empter les erreurs de catégorie, quatre frontières sont rendues explicites. Elles reflètent `manifesto.fr.md §1.1` adaptées aux conventions sociales.

1. **Ce ne sont pas des éléments normatifs.** Le standard ATS n'exige aucune convention ici. La conformance (`manifesto.fr.md §16.5`) dépend seulement du contenu normatif du standard ; cette annexe est entièrement optionnelle.
2. **Ce ne sont pas des prescriptions.** Aucun individu, organisation ou communauté n'est invité à adopter le rythme 7+3, les bandes solaires 08–22, le Kilo-versaire ou la narration de vie des Trois Ères. Ils sont offerts comme motifs documentés que certains adopteurs ont trouvés utiles.
3. **Ces conventions ne déplacent pas les rythmes culturels ou religieux.** La semaine liturgique de 7 jours, le Sabbat, la prière du vendredi, les festivals des moissons et autres cycles culturels continuent d'opérer sur la même chronologie qu'ATS. La relation est **coexistence**, pas remplacement.
4. **Ce ne sont pas universalistes.** La bande solaire 08–22 est un compromis modal nord-atlantique ; le rythme 7+3 est une parmi plusieurs alternatives ; les jalons reflètent un cadrage spécifique de signification. Les communautés préférant des conventions différentes ne perdent rien à les adopter à la place de celles-ci.

---

## 7. Objections anticipées

### 7.1 « Vous prétendez qu'ATS ne légifère pas sur le rythme, mais cette annexe définit un rythme 7+3. »

Le rythme 7+3 est documenté dans cette annexe, pas légiféré par le standard. `manifesto.fr.md §13.3` est explicite : ATS ne légifère pas sur les répartitions travail-repos. Le rythme 7+3 est offert à côté de 6+1+2+1, 8+2, 5+5 et 6+4 comme **alternatives** que l'unité Deka rend lisibles. Un adopteur d'ATS qui choisit l'une d'elles — ou aucune — reste conformant.

### 7.2 « 7+3 désavantage les communautés à traditions religieuses de 7 jours (Sabbat, dimanche, prière du vendredi). »

§2.4 traite cela directement. Les communautés engagées dans une semaine liturgique de 7 jours ont trois réponses raisonnables : retenir la semaine grégorienne à côté d'ATS, adopter 7+3 séculièrement tout en retenant l'observance liturgique de 7 jours en parallèle, ou décliner 7+3 et définir un rythme spécifique à la communauté. Aucune option n'est normativement préférée. ATS est additif, pas soustractif.

### 7.3 « 08–22 est eurocentré et ne représente pas les emplois du temps méditerranéens, tropicaux, polaires ou est-asiatiques. »

§3.3 documente cela explicitement et recommande la variation pour chaque cas. Le défaut 08–22 est un point de départ pour l'affichage du cadran analogique ; ce n'est pas une revendication sur la façon dont les gens *devraient* organiser leurs journées. Les implémentations couvrant des régions spécifiques sont encouragées à utiliser des bornes appropriées à la coutume locale et à documenter le choix dans `aria-describedby`.

### 7.4 « Qu'en est-il des régions polaires où il n'y a pas de cycle solaire quotidien ? »

§3.3 reconnaît explicitement les régions polaires. En jour polaire ou nuit polaire, les bandes solaires-relatives perdent leur sens ; les bandes basées sur l'horloge sont le seul défaut sensé. Les implémentations couvrant les régions polaires devraient traiter 08–22 comme une convention d'horloge, pas solaire.

### 7.5 « Les compteurs personnels sont juste `now() - birthday()` ; pourquoi élever cela à une convention ? »

L'arithmétique est triviale. La convention est le **cadrage** — qu'ATS représente l'âge d'une personne comme une durée positionnelle (`Δd K.H.D.Kin.fffff`) plutôt qu'un compte d'années. Le cadrage conventionnel soutient :

- Une arithmétique stable à travers les changements de DST et de fuseau (un Kilo-versaire personnel est un instant UTC unique, pas « minuit dans une heure locale »).
- L'algèbre multi-compteurs (§4.4) : différences, moyennes, intersections de plusieurs compteurs personnels se réduisent à l'algèbre ATS.
- L'export `.ics` et l'interopération de calendrier sans gymnastique de fuseau horaire.

La convention est une petite chose qui passe bien à l'échelle ; triviale individuellement, utile à l'échelle d'une page `age.html` générant des Kilo-versaires pour des dates de naissance arbitraires.

### 7.6 « Les jalons civilisationnels (Δ 100, Δ 1000, …) sentent l'astrologie — assigner du sens à des accidents arithmétiques. »

L'arithmétique est l'arithmétique ; le sens est un choix communautaire. ATS n'affirme pas que `Δ 1000` porte une signification cosmique. Il affirme que 1 000 jours se sont écoulés depuis l'époque, et l'offre comme *point de coordination* pour les communautés qui veulent le marquer. Il en est de même pour chaque jalon calendaire : un centenaire est « 100 ans depuis quelque chose », et le sens est ce que la communauté y attache. ATS n'ajoute rien de magique et ne retire rien.

### 7.7 « Pourquoi inclure des conventions sous-seconde (Beat-mark, Blink-flash) ? Personne ne marque le temps à l'échelle de la seconde. »

Ce sont des conventions de présentation pour les affichages live — horloges analogiques, dashboards, interfaces utilisateur sensibles au temps. Le Beat-mark est une pulsation subtile à chaque 8,64 s ; le Blink-flash est une animation à l'échelle du pixel à chaque 0,864 s. Les deux sont décoratifs, les deux opt-in. La page de référence d'horloge analogique (`analog-clock.md`) les utilise ; d'autres applications sont libres de les ignorer. Ils sont documentés ici pour que les implémentations qui les utilisent soient cohérentes.

### 7.8 « Cette annexe pad pour avoir l'air RFC-grade alors que c'est juste une liste de motifs sociaux. »

L'annexe est non normative et est présentée comme telle (§0). La structure RFC-grade (citations, cadrage opt-in, objections anticipées) est empruntée au manifeste normatif pour **cohérence de voix à travers l'ensemble de la spec**, pas parce que le contenu de cette annexe porte le même poids. Le lecteur est invité à traiter chaque section comme une suggestion documentée ; rejeter quoi que ce soit ne porte aucun coût.

---

## 8. Synthèse

Chaque convention dans cette annexe est opt-in. Les adopteurs mélangent et assortissent :

| Convention | Section | Cadence | Exigée par ATS ? |
|---|---|---|---|
| Kilo-versaire | §1.1 | tous les 1 000 jours | Non |
| Hecto-fête | §1.2 | tous les 100 jours | Non |
| Deka-day | §1.3 | tous les 10 jours | Non |
| Beat-mark / Blink-flash | §1.4 | toutes les 8,64 s / 0,864 s | Non |
| Rythme travail-repos 7+3 | §2 | par Deka | Non |
| Bandes solaires locales 08–22 | §3 | quotidien | Non |
| Compteurs personnels | §4 | par instant ATS | Non |
| Jalons civilisationnels | §5.1 | discret | Non |
| Jalons multi-planétaires | §5.2 | discret | Non |

Aucune n'est exigée pour la conformance ATS. Toutes sont documentées parce que les adopteurs d'ATS, interrogés sur quelles conventions ils ont trouvées utiles, ont convergé sur approximativement ce catalogue. L'annexe est un instantané de la pratique communautaire ; elle évoluera.

Pour le contenu strictement normatif d'ATS, voir `manifesto.fr.md`. Pour la justification philosophique derrière les choix d'unités, voir `philosophy.fr.md`. Pour la comparaison avec les standards temporels alternatifs, voir `comparison.fr.md`. Cette annexe se trouve entre pratique et réflexion.

---

## Références

- Achelis, E. (1937). *The Calendar for the Modern Age*. Putnam. (Cadrage équivalence trimestrielle pertinent pour §1.2.)
- Doerr, J. (2018). *Measure What Matters*. Portfolio. (Comparaison cadence trimestrielle OKR.)
- Eurostat (2019). *Statistiques sur le commerce de détail et les heures d'ouverture, UE-27*. (Source pour §3.2 données heures commerciales.)
- Hirshkowitz, M., Whiton, K., Albert, S. M., et al. (2015). *National Sleep Foundation's sleep time duration recommendations: methodology and results summary*. Sleep Health, 1(1), 40–43. (Source pour §3.2 recommandations de sommeil.)
- Organisation Internationale du Travail (1919). *Convention sur la durée du travail (industrie) (n°1)*. (Origine de la journée de 8 heures.)
- Organisation Internationale du Travail (1935). *Convention sur la semaine de quarante heures (n°47)*. (Origine de la semaine de 40 heures.)
- Kerkhof, G. A. (1985). *Inter-individual differences in the human circadian system: a review*. Biological Psychology, 20(2), 83–112. (Source pour variation des chronotypes en §3.3.)
- Maslach, C., & Leiter, M. P. (2003). *The Truth About Burnout*. Jossey-Bass. (Source pour §2.5 revendications de ratio de repos.)
- OCDE (2022). *Regards sur l'éducation : indicateurs OCDE 2022*. (Source pour §3.2 heures de rentrée scolaire.)
- Schaufeli, W. B., & Bakker, A. B. (2004). *Job demands, job resources, and their relationship with burnout and engagement*. Journal of Organizational Behavior, 25(3), 293–315. (Source pour §2.5.)
- Thompson, E. P. (1967). *Time, work-discipline, and industrial capitalism*. Past & Present, 38(1), 56–97. (Source pour la revendication de ratio de repos pré-industriel en §2.5.)
- Organisation Mondiale de la Santé (2019). *Classification Internationale des Maladies, 11ᵉ révision (CIM-11)*. Burnout classé comme phénomène professionnel (QD85). (Source pour §2.5.)

Toutes les affirmations chiffrées dans cette annexe sont arithmétiquement vérifiables à partir de `manifesto.fr.md §9` (définition de la conversion) et `code/ats.py` (implémentation de référence). Toutes les affirmations culturelles sont sourcées. Les lecteurs identifiant des citations faibles, des alternatives manquantes ou des motifs contestés sont invités à ouvrir une issue à l'emplacement canonique (`manifesto.fr.md §16.1`).
