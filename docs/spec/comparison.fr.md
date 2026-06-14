# L'ATS face aux standards temporels alternatifs

> *Aucun standard n'est adopté sur les seuls mérites du design. L'adoption est ingénierie + dépendance au chemin. Cette annexe expose le dossier d'ingénierie honnêtement — y compris là où ATS perd.*

**Statut :** Pré-release v0.7
**Type de document :** **ANNEXE NON NORMATIVE** à la spécification ATS.
**Référence normative :** `manifesto.fr.md` (la spec proprement dite).
**Langue source :** Anglais (`comparison.en.md`). Cette traduction française est fournie pour l'accessibilité ; en cas de divergence, l'anglais fait foi.
**Posture centrale :** Cette annexe compare ATS à 17 standards temporels alternatifs répartis en six familles. Chaque alternative est présentée dans la version la plus forte que ses défenseurs reconnaîtraient. Des critères de comparaison explicites sont énoncés d'emblée pour que le cherry-picking soit visible. Une section dédiée (§8) concède les critères sur lesquels les alternatives gagnent. L'intention est l'auditabilité, pas le triomphalisme.

---

## 0. Périmètre et posture

Cette annexe est **non normative**. Les implémentations d'ATS ne sont pas tenues d'accepter ses revendications comparatives ; la conformance (cf. `manifesto.fr.md §16.5`) est jugée sur le contenu normatif du standard.

Ce que cette annexe offre :

- Un ensemble fixe de **critères de comparaison** (§1) appliqués uniformément aux alternatives, pour que le cherry-picking soit visible.
- Une présentation de chaque alternative dans sa **version la plus forte** telle que ses défenseurs l'endosseraient, sourcée lorsque possible.
- Une section explicite **« où les alternatives gagnent »** (§8) qui concède les critères sur lesquels ATS ne gagne pas.
- Une section explicite **objections anticipées** (§9) qui pré-empte les attaques les plus communes sur la comparaison.

Ce que cette annexe *n'offre pas* :

- Une revendication de supériorité totale. ATS gagne sur un ensemble spécifique de critères (multi-planétaire, simplicité computationnelle, alignement biologique) ; d'autres systèmes gagnent sur d'autres (alignement culturel, inertie de déploiement, héritage astronomique).
- Une comparaison avec les calendriers culturels et religieux vivants (hébraïque, islamique, hindou, chinois, bahá'í, Long Count maya). Ceux-ci remplissent des fonctions qu'ATS ne traite pas ; la relation est **interopération, pas déplacement**. Cf. §7 et les bridges de conformance dans `code/bridges/*.py`.
- Une prédiction d'adoption. L'adoption de standards est dépendante du chemin et seulement partiellement prévisible depuis la conception. La comparaison expose le dossier d'ingénierie ; le marché des standards juge le reste.

---

## 1. Critères de comparaison

Les huit critères suivants sont appliqués à chaque alternative aux §§2–6. Chaque critère est observable et définissable ; les verdicts comparatifs au §10 les utilisent explicitement.

| # | Critère | Question à laquelle il répond |
|---|---|---|
| **C1** | Simplicité computationnelle | Quelle est la complexité de l'arithmétique sur durées et instants ? `t₂ − t₁` est-il une simple soustraction ou requiert-il une logique consciente du calendrier ? |
| **C2** | Élimination des fuseaux horaires | Le standard définit-il un instant global unique par moment, ou porte-t-il un champ fuseau horaire ? |
| **C3** | Régularité d'unités | Les unités macro et micro sont-elles de longueur fixe, ou varient-elles (mois 28–31, semaines bissextiles, jours blancs) ? |
| **C4** | Inertie d'adoption | Quelle est la base déployée estimée et le nombre d'années en opération ? |
| **C5** | Généralité multi-planétaire | Le standard se généralise-t-il à des corps célestes autres que la Terre ? |
| **C6** | Alignement biologique / cognitif | Les frontières d'unités correspondent-elles aux cycles humains mesurés (circadien, ultradien, attention, récupération) ? Cf. `philosophy.fr.md §2–5`. |
| **C7** | Neutralité culturelle de l'ancrage | L'ancrage ou le nommage des unités est-il dérivé d'une religion, nation ou empire spécifique ? |
| **C8** | Contrat de précision | Le standard prescrit-il un comportement sous-seconde déterministe (arrondi, politique de leap second, lissage) ? |

Ces critères ne pèsent pas également pour chaque cas d'usage. Pour l'échange logiciel C1+C2+C8 dominent ; pour l'usage culturel C6+C7 dominent ; pour la coordination spatiale C5 domine. La comparaison est **multi-dimensionnelle**, pas scalaire.

---

## 2. Famille A — Échelles temporelles computationnelles (les vrais cousins d'ATS)

Ce sont les **cibles de comparaison honnêtes** : compteurs linéaires ancrés sur un point singulier, sans mois ni semaines, utilisés par le logiciel et l'astronomie. ATS partage le plus d'ADN avec cette famille ; sa différenciation contre elles est la plus structurante.

### 2.1 Unix Epoch (temps POSIX)

- **Ancrage.** 1970-01-01T00:00:00Z (UTC).
- **Unité.** Secondes SI (compteur linéaire).
- **Plage.** 32 bits signés (déborde en 2038, le « problème Y2038 ») ; 64 bits sur les systèmes modernes.
- **Défenseurs.** Origine Unix V6 (1975) ; *de facto* standard pour les timestamps logiciels. Base déployée estimée : tout système famille Unix, toute JVM, toute base de données, milliards d'appareils [Lewine 1991 sur la sémantique POSIX].
- **Où il gagne.** **C1, C4, C8.** Soustraction unique pour `t₂ − t₁`. Inertie d'adoption imbattue (~50 ans, ~10¹⁰ instances déployées). La sémantique POSIX des leap seconds est déterministe (le leap est absorbé).
- **Où ATS diffère.** **C3, C5, C6, C7.** Unix Epoch n'a pas de lecture positionnelle — c'est un compteur brut, opaque pour les humains. ATS est Unix Epoch *avec une grammaire positionnelle décimale* : `K.H.D.Kin.fffff` affiche la même information que `seconds_since(epoch_unix)`, mais s'adresse à un humain. Les deux sont linéaires ; un seul est conversationnel. ATS offre aussi des ancrages multi-planétaires (C5) et des unités biologiquement significatives (C6, cf. annexe philosophie) ; Unix Epoch n'a aucun des deux.

### 2.2 Julian Day Number (JDN) et Modified Julian Day (MJD)

- **Ancrage.** JDN : −4712-01-01T12:00:00 (midi julien proleptique), soit 4713 avant notre ère en grégorien proleptique. MJD : 1858-11-17T00:00:00 UTC (défini comme JDN − 2_400_000,5).
- **Unité.** Jours (linéaire, fractionnable).
- **Plage.** Pratiquement non bornée ; l'époque JDN couvre toute l'astronomie enregistrée.
- **Défenseurs.** Joseph Scaliger (1583) pour JDN ; introduit par l'IAU en 1957 pour MJD. Universel en astronomie, astrodynamique et chronologie historique [Doggett 1992 dans le *Explanatory Supplement to the Astronomical Almanac*].
- **Où il gagne.** **C1, C7 (partiel), C5 (héritage).** Soustraction unique pour les durées. L'ancrage à 4713 BCE est si ancien qu'aucun groupe culturel ou politique ne le revendique ; fonctionnellement neutre. Les astronomes ont utilisé JDN pour des calculs liés à Mars ; l'héritage du chronométrage multi-corps dans JDN est réel.
- **Où ATS diffère.** **C3, C5 (explicite), C6, C8.** JDN exprime les jours comme `2_460_476,5`, un décimal continu — utile pour l'astronomie, opaque pour un lecteur humain. ATS rend la même information positionnelle (`Δ K.H.D.Kin.fffff`) qui est *lisible* (un humain peut dire « Kilo 20, Hecto 7, Deka 8… »). JDN ne traite pas le multi-planétaire explicitement ; il est de facto Terre-centré (date *julienne*, sur Terre). ATS rend l'extension multi-corps explicite (`multi-planetary.md`). JDN n'a pas de politique de leap second propre ; il hérite d'UTC ou TAI selon la variante.

### 2.3 GPS Time

- **Ancrage.** 1980-01-06T00:00:00 UTC.
- **Unité.** Secondes SI (depuis la semaine GPS zéro) ; semaine + seconde-de-semaine comme format fil.
- **Plage.** Compteur de semaine 10 bits (déborde tous les ~20 ans, cf. « GPS week rollover » 1999 et 2019) ; récepteurs modernes utilisent 13 bits ou plus.
- **Défenseurs.** Défini par le signal opérationnel GPS (ICD-GPS-200) ; utilisé par toute infrastructure dépendant GNSS [Misra & Enge 2010].
- **Où il gagne.** **C8.** GPS Time est **sans leap second** : il suit TAI moins 19 secondes sans lissage. Précision sub-microseconde est le point de design.
- **Où ATS diffère.** **C5, C6, C7.** GPS Time est lié à la Terre (satellites en orbite terrestre). Il n'a pas de grammaire positionnelle (c'est un compte de secondes depuis la semaine zéro plus un index de semaine). Il est fonctionnellement neutre culturellement (l'ancrage est une date de convenance d'ingénierie), mais le format est réservé aux ingénieurs. ATS fournit lecture positionnelle, options de lissage des leap seconds (`manifesto.fr.md §8.2`), et extension multi-planétaire.

### 2.4 TAI (Temps Atomique International)

- **Ancrage.** 1958-01-01T00:00:00 UT (TAI = UTC à cet instant, par définition).
- **Unité.** Secondes SI, sans leap seconds — TAI s'écoule uniformément.
- **Plage.** Pratiquement non bornée.
- **Défenseurs.** Défini par le BIPM ; la référence maîtresse pour le temps SI [BIPM CCTF 1971 ; Allan, Ashby & Hodge 1997].
- **Où il gagne.** **C8.** TAI est l'échelle temporelle la plus profondément déterministe disponible. Pas de leap seconds, pas de lissage, pas de choix de politique.
- **Où ATS diffère.** **C5, C6, C7 (partiel).** ATS-UTC est le défaut v0.7 ; une variante ATS-TAI est réservée (`manifesto.fr.md §8.3`) pour usage futur, notamment aérospatial et science haute précision. Pour la plupart des usages logiciels, ATS-UTC suffit parce que la différence est bornée (actuellement 37 secondes et croissante).

### Synthèse Famille A

Unix Epoch, JDN/MJD, GPS Time et TAI sont les compétiteurs fonctionnels réels d'ATS. **ATS ne prétend pas les remplacer.** Il prétend offrir une *grammaire positionnelle* sur le même axe temporel — une couche lisible par humain qui adresse le gap cognitif entre « 1750_000_000 » (secondes Unix) et une forme conversationnelle. La relation est **complémentaire** : un système peut stocker des secondes Unix et émettre ATS pour l'affichage.

---

## 3. Famille B — Réformes calendaires (optimisation solaire)

Propositions du XXᵉ siècle qui ont gardé la structure civile (mois, semaines) mais rationalisé ses irrégularités. Aucune n'a atteint une adoption large.

### 3.1 International Fixed Calendar (IFC)

- **Ancrage.** Co-aligné avec le grégorien ; réforme de structure seulement.
- **Structure.** 13 mois × 28 jours + 1 « Year Day » (intercalaire, blanc), + 1 jour bissextile en années bissextiles. Chaque mois identique, chaque date un jour de semaine fixe. Le 13ᵉ mois nommé « Sol » fut proposé.
- **Défenseurs.** Auguste Comte (1849, « calendrier positiviste »), Moses B. Cotsworth (1902), George Eastman (Eastman Kodak adopta IFC en interne 1928–1989) [Eastman 1923 *Yearbook* ; Cotsworth 1905 *The Rational Almanac*].
- **Où il gagne.** **C3.** Les mois sont réguliers (28 jours, aucune exception). L'alignement jour-de-semaine est permanent — une date donnée tombe toujours sur un jour donné. La comparabilité statistique inter-mois est préservée.
- **Où ATS diffère.** **C1, C5, C6.** IFC garde mois et semaines (structure calendaire → arithmétique consciente du calendrier toujours requise). Il ne traite pas les fuseaux (C2 non traité). Il ne se généralise pas à d'autres planètes. Le mois de 28 jours ne correspond pas mieux aux cycles biologiques mesurés que le mois de 30 jours ; l'échelle d'unités n'est pas liée à la recherche sur l'attention ou le travail-repos. IFC est un « meilleur grégorien » — ATS est une famille différente.
- **Verdict.** IFC reste un meilleur grégorien pour les cultures attachées à la structure mois/semaine. ATS propose un système structurellement différent ; la comparaison n'est pas « ATS remplace IFC » mais « ATS est dans une autre catégorie ».

### 3.2 World Calendar

- **Ancrage.** Co-aligné avec le grégorien.
- **Structure.** 12 mois de 30 ou 31 jours organisés en quatre trimestres égaux de 91 jours + 1 « Worldsday » (intercalaire, blanc) + 1 jour bissextile. Chaque trimestre identique ; chaque année identique [Achelis 1937].
- **Défenseurs.** Elisabeth Achelis (1930), World Calendar Association. Le Conseil économique et social de l'ONU a examiné la proposition en 1955 mais ne l'a pas adoptée (les États-Unis s'y sont opposés, citant l'objection religieuse au jour blanc rompant le cycle hebdomadaire du Sabbat).
- **Où il gagne.** **C3.** Les trimestres sont réguliers (91 jours, fixes). L'arithmétique des dates se simplifie pour la finance et la planification.
- **Où ATS diffère.** Idem IFC : mois et semaines préservés, pas de traitement fuseaux, pas d'extension multi-planétaire, pas de revendication d'alignement biologique.
- **Verdict.** Un IFC plus conservateur. A échoué pour la même raison religieuse-culturelle qui bloque toutes les réformes à « jour blanc ».

### 3.3 Calendrier Permanent Hanke-Henry

- **Ancrage.** Co-aligné avec le grégorien.
- **Structure.** 364 jours/an = 52 semaines exactement. Mois : 30, 30, 31, 30, 30, 31, 30, 30, 31, 30, 30, 31. Tous les 5–6 ans, une semaine bissextile (« Xtra ») est ajoutée en décembre.
- **Défenseurs.** Richard Henry & Steve Hanke (Johns Hopkins, 2012) [Henry & Hanke 2012].
- **Où il gagne.** **C3 (par an), C8 (arithmétique intra-année).** Au sein d'une année, dates et jours de semaine sont stables ; les calculs financiers se simplifient (52 semaines × 5 jours = 260 jours ouvrés par an, exactement).
- **Où ATS diffère.** **C2, C5, C6.** La semaine bissextile réintroduit une irrégularité pluriannuelle. Fuseaux non traités. Multi-planétaire non traité. Alignement biologique non traité.
- **Verdict.** Hanke-Henry optimise pour la finance. ATS optimise pour le calcul distribué et l'usage multi-planétaire. Les deux pourraient coexister (Hanke-Henry pour la finance face-humain, ATS pour le calcul face-logiciel), mais ils ciblent des problèmes différents.

### 3.4 Pax Calendar

- **Ancrage.** Co-aligné avec le grégorien.
- **Structure.** 13 mois de 28 jours + 1 semaine bissextile (« Pax ») insérée avant décembre dans les années divisibles par 100 sauf divisibles par 400 (similaire à la logique de bissextilité grégorienne).
- **Défenseurs.** James Colligan (1930). Moins largement promu que IFC ; techniquement similaire.
- **Où il gagne.** Idem IFC pour les mois réguliers ; règle de bissextilité plus propre que l'approche « jour blanc » d'IFC.
- **Où ATS diffère.** Idem IFC.
- **Verdict.** Le petit frère moins connu d'IFC. Même catégorie, même destin.

---

## 4. Famille C — Expériences de temps décimal

Deux tentatives antérieures de temps décimal. Leurs échecs sont instructifs ; ATS emprunte leurs victoires et évite leurs défaites.

### 4.1 Calendrier Républicain français (1793–1805)

- **Ancrage.** 1792-09-22 (« Vendémiaire 1, an I » — l'équinoxe d'automne, le lendemain de la proclamation de la Première République).
- **Structure.** 12 mois × 30 jours + 5 ou 6 « sansculottides » en fin d'an. Chaque mois : 3 décades (semaines de 10 jours). Chaque jour : 10 heures × 100 minutes × 100 secondes (un « jour décimal »).
- **Défenseurs.** Convention nationale française 1793 ; conçu par Charles-Gilbert Romme, Joseph Lagrange, Pierre-Simon Laplace, Gaspard Monge et autres. Utilisé officiellement 1793–1805 ; restauré brièvement sous la Commune de Paris (1871, 18 jours) [Shaw 2011 *Time and the French Revolution*].
- **Pourquoi il a échoué.** Trois raisons documentées :
  1. **Rupture religieuse-culturelle trop forte.** La semaine de 10 jours impliquait 1 jour de repos sur 10 vs 1 sur 7 pour la semaine traditionnelle. Les travailleurs avaient moins de repos, et le sabbat dominical était éliminé.
  2. **Le temps décimal sur l'horloge a échoué plus vite que le calendrier.** Les horloges à temps décimal étaient coûteuses à fabriquer ; la population a résisté au réapprentissage. Napoléon abolit le temps décimal en 1795, six ans avant de retirer le calendrier en 1806.
  3. **Symbolisme politique.** Le calendrier était associé à la Terreur ; son rejet était partiellement un rejet des excès révolutionnaires, pas de la logique décimale.
- **Où ATS emprunte.** Grammaire décimale du temps-de-la-journée ; clarté positionnelle ; engagement à la base 10 (`manifesto.fr.md §1.1` sur la rationalité d'ingénierie).
- **Où ATS diverge.** Trois leçons explicites :
  1. **ATS ne légifère pas sur les rythmes de repos** (`manifesto.fr.md §13.3`). Le Deka est une unité de mesure ; la répartition travail-repos est laissée ouverte (`philosophy.fr.md §3.2`).
  2. **ATS n'abolit pas l'horloge 24 heures pour le temps civil.** Bloc/Centi/Milli d'ATS sont des lectures positionnelles d'UTC ; les horloges 24 heures existantes continuent de fonctionner. L'adoption est additive, pas soustractive.
  3. **ATS est ancré sur un événement vérifiable, non politique** (jour de l'alunissage d'Apollo 11, `manifesto.fr.md §2`). L'ancrage républicain était lié à un régime ; celui d'ATS est lié à un acte à l'échelle de l'espèce avec une reconnaissance large.
- **Verdict.** Le calendrier républicain fut la première expérience sérieuse de temps décimal et reste instructif. ATS est son descendant côté technique et son élève côté politique.

### 4.2 Swatch Internet Time (1998)

- **Ancrage.** Pas d'époque ; le jour est divisé en 1000 `.beats`. `@000` est minuit au Biel Mean Time (UTC+1). Pas de système de date — dates grégoriennes conservées.
- **Structure.** 1 jour = 1000 .beats. 1 .beat = 86,4 secondes (= 1 Centi ATS).
- **Défenseurs.** Swatch (horloger suisse), avec Nicholas Negroponte (MIT) et Yoshiyuki Naito. Promu comme « temps Internet universel » 1998–années 2000 [Negroponte 1998 chronique *Wired*].
- **Pourquoi il a échoué.** Trois raisons documentées :
  1. **Poussé par marketing plutôt qu'infrastructure.** Promu par un horloger vendant des pièces décoratives, pas adopté par les organismes de standards Internet. Pas d'implémentation de référence dans aucun OS ni langage de programmation majeur.
  2. **Biel Mean Time est suisso-centré.** Un standard « universel » ancré dans un pays sape son propre universalisme. (La même critique s'appliquait à UTC vs Greenwich ; UTC adopté explicitement pour éviter le problème.)
  3. **Pas de grammaire de date.** Swatch ne traitait que la fraction intra-journée. L'arithmétique inter-jours nécessitait de revenir au grégorien. Le standard était incomplet.
- **Où ATS emprunte.** L'intuition que les unités décimales intra-jour sont utiles ; l'abolition des fuseaux horaires (Swatch Internet Time avait raison qu'Internet avait besoin de lectures UTC-seules).
- **Où ATS diverge.**
  1. **Ancrage universel.** L'époque d'ATS est UTC, pas BMT.
  2. **Grammaire de date complète.** La lecture positionnelle d'ATS couvre Kilo à Blink ; pas de repli grégorien nécessaire.
  3. **Chemin d'infrastructure.** Les implémentations de référence d'ATS ciblent l'échange logiciel (Python, JavaScript), pas les montres consommateur. L'adoption logicielle est dépendante du chemin ; l'adoption en biens consommateur est dépendante de la marque. La première est plus difficile mais plus durable.
- **Verdict.** Swatch Internet Time était structurellement une esquisse du système intra-journée d'ATS, marketé d'une manière qui empêchait l'adoption. ATS est la version d'ingénierie : complète, ancrée sur UTC, avec vecteurs de conformance.

---

## 5. Famille D — Réformes d'ère et d'époque

Trois propositions qui gardent la structure grégorienne mais déplacent l'époque / le compte.

### 5.1 Ère Holocène (HE / Ère Humaine)

- **Ancrage.** −10 000 BCE (début approximatif de l'Holocène, l'époque géologique actuelle et le début de l'agriculture).
- **Structure.** Calendrier grégorien inchangé ; compte d'année décalé d'exactement +10 000. 2026 CE = 12026 HE.
- **Défenseurs.** Cesare Emiliani (1993, *Calendar Reform*) [Emiliani 1993 ; promu récemment dans une vidéo populaire de Kurzgesagt].
- **Où il gagne.** **C6 (intuition archéologique), C7 (pas d'ancrage religieux).** « Année 12026 » place l'auditeur dans le long arc de l'agriculture plutôt que dans un compte sectaire. L'ancrage Holocène est non politique (géologique).
- **Où ATS diffère.** **C1, C3, C5, C8.** Holocène est un *décalage cosmétique* du grégorien : mêmes mois, semaines, règles bissextiles et fuseaux horaires sont préservés. Aucun des problèmes computationnels sous-jacents n'est traité. Holocène est de la peinture ; ATS est de la structure.
- **Verdict.** Holocène gagne sur le cadrage archéologique. ATS ne concurrence pas Holocène sur cet axe ; ils pourraient coexister (un compte d'année Holocène + un compte de jour ATS). Pour la plupart des usages logiciels, Holocène n'offre aucun bénéfice computationnel et ATS aucun bénéfice archéologique.

### 5.2 Calendrier Cosmique (Sagan)

- **Ancrage.** Big Bang (≈ il y a 13,8 milliards d'années), cartographié sur « 1ᵉʳ janvier 00:00:00 ».
- **Structure.** Toute l'histoire cosmologique mise à l'échelle d'une année calendaire.
- **Défenseurs.** Carl Sagan, *Cosmos* (1980).
- **Où il gagne.** **C7 (neutralité cosmologique).** Pure pédagogie ; pas d'ancrage politique ou culturel.
- **Où ATS diffère.** Le Calendrier Cosmique est une **échelle pédagogique**, pas un standard temporel computationnel. Il ne traite pas dates, instants, fuseaux ni arithmétique. Le comparer à ATS est une erreur de catégorie ; inclus ici seulement parce qu'il apparaît dans le discours populaire.

### 5.3 Anno Mundi / Anno Hijri (formes compte-d'ère des calendriers culturels vivants)

Le calendrier hébraïque utilise Anno Mundi (an depuis la création : 5786 en 2026). Le calendrier islamique Hijri utilise les années depuis l'Hégire (1448 AH en 2026). Ce sont des *comptes d'ère*, pas des propositions de réforme ; ATS coexiste avec eux via les bridges d'interopération (`code/bridges/hebrew.py`, `islamic.py`).

Où ils gagnent : alignement culturel et religieux pour leurs communautés. Où ATS diffère : ATS est **computationnel**, pas culturel ; les deux servent des objectifs disjoints. Cf. §7.

---

## 6. Famille E — Spécifiques à une planète

### 6.1 Calendrier Darian (Mars)

- **Ancrage.** Équinoxe de printemps de l'An Martien 209 (1953-12-19 date Terre dans certaines implémentations ; varie selon la variante Darian).
- **Structure.** 24 mois martiens (chacun ~28 sols) + diverses intercalations pour suivre l'année martienne de 668,59 sols. Semaines de sept sols. Conçu pour sembler familier aux humains acclimatés à la Terre sur Mars.
- **Défenseurs.** Thomas Gangale (1985 ; raffiné 1986, 2006) [Gangale 1986 *Journal of the British Interplanetary Society*].
- **Où il gagne.** **C6 (pour les colons martiens).** Les frontières de mois et semaines de Darian sont accordées sur les saisons locales martiennes. Pour l'agriculture, les festivals et les rythmes biologiques sur Mars, Darian est plus significatif que n'importe quel standard ancré sur la Terre.
- **Où ATS diffère.** **C5 (explicite), C2.** Darian est *local* — utile seulement sur Mars. ATS-Mars (`multi-planetary.md`) fournit un système de coordonnées parallèle qui aligne le temps martien avec le compteur ATS universel, permettant la synchronisation Terre-Mars. Les deux pourraient coexister sur Mars : Darian pour les objectifs civils et biologiques, ATS-Mars pour la coordination inter-planétaire.
- **Verdict.** Utilisez Darian pour l'agriculture et les festivals martiens ; ATS pour la communication Terre-Mars. La relation est **complémentaire**.

### 6.2 Compteurs de sols (spécifiques à une mission)

Les missions NASA (Viking, Mars Pathfinder, MER, Curiosity, Perseverance) utilisent des compteurs linéaires de sols depuis l'atterrissage : « Sol 1, Sol 2, … ». Ce sont des chronométrages privés de mission ; ils ne proposent pas de standard général.

- **Où ils gagnent.** Pure simplicité ; un compteur par mission.
- **Où ATS diffère.** ATS-Mars utilise une *époque partagée* (atterrissage de Mars Pathfinder, 1997-07-04, cf. `multi-planetary.md`) afin que l'arithmétique cross-mission et Terre-Mars soit universelle. Les compteurs de sols par mission sont des silos par mission.

---

## 7. Famille F — Calendriers culturels et religieux vivants (interopérés, non comparés)

Les calendriers hébraïque (luni-solaire), islamique (lunaire hijri), hindou (plusieurs systèmes luni-solaires régionaux), chinois (luni-solaire), bahá'í (solaire 19×19), Long Count maya (compte linéaire de jours depuis 3114 BCE), persan (solaire), éthiopien (solaire), et beaucoup d'autres sont des **systèmes vivants servant des fonctions culturelles et religieuses**. Ils ne sont pas dans le même espace de comparaison qu'ATS.

- ATS est computationnel et culturellement neutre par conception (`philosophy.fr.md §5.4`).
- Les calendriers culturels vivants portent des fonctions religieuses, agricoles et identitaires qu'ATS ne traite pas explicitement (`manifesto.fr.md §13`).
- La relation est **interopération** : chaque instant ATS se cartographie sur un instant dans n'importe quel calendrier culturel via des bridges. L'implémentation de référence inclut cinq bridges (hébraïque, islamique, chinois, hindou, maya) dans `code/bridges/*.py`.

Inclure ces calendriers dans une matrice de « comparaison » serait une erreur de catégorie. Ils ne sont pas en concurrence pour le même rôle qu'ATS remplit ; ils coexistent avec lui.

---

## 8. Où les alternatives gagnent — concessions honnêtes

ATS ne revendique pas la supériorité totale. Les éléments suivants sont des critères sur lesquels d'autres systèmes battent ATS aujourd'hui, sans discussion :

- **Inertie d'adoption (C4) :** Unix Epoch gagne décisivement. Un demi-siècle d'appareils déployés, milliards de timestamps en production. ATS est pré-v1.0 ; sa base déployée est les implémentations de référence + ce site. Toute évaluation honnête classe ATS comme « early adopter uniquement » sur C4 aujourd'hui.
- **Héritage astronomique (C4 dans une niche spécifique) :** Julian Day Number gagne. Les astronomes utilisent JDN depuis 1583 ; chaque catalogue d'étoiles, éphéméride et propagateur d'orbites émet JDN. ATS ne concurrence pas dans cette niche ; il complémente (un astronome peut stocker JDN et émettre ATS pour la communication inter-domaine).
- **Alignement culturel dans les communautés (C7 pour cette communauté) :** Les calendriers hébraïque, islamique, hindou, chinois et autres calendriers culturels gagnent dans leurs communautés adoptantes. ATS est culturellement neutre *globalement* mais n'est pas culturellement aligné avec une communauté spécifique. C'est par conception (`manifesto.fr.md §2.3 Attaque A`) ; c'est aussi un coût réel pour l'adoption dans ces communautés.
- **Stabilité des jours de semaine (C3 pour usage liturgique) :** International Fixed Calendar et World Calendar gagnent. La semaine liturgique de 7 jours, cartographiée sur des dates fixes, simplifie l'observance religieuse récurrente. ATS abandonne délibérément la semaine de 7 jours comme unité normative ; les communautés qui en ont besoin utilisent le grégorien en parallèle.
- **Alignement du calendrier financier (C3 pour la finance) :** Hanke-Henry gagne pour le reporting trimestriel financier. L'Hecto d'ATS est proche (100 jours ≈ 1 trimestre financier) mais pas identique ; les systèmes financiers déjà calibrés sur des motifs façon Hanke-Henry gagnent peu à passer à l'Hecto ATS.
- **Agriculture et écologie martiennes locales (C6 pour Mars) :** Le Calendrier Darian gagne. Les colons martiens plantant des cultures se soucient des saisons martiennes, pas d'unités Terre-centrées. ATS-Mars fournit le *système de coordonnées* pour le travail inter-planétaire ; Darian fournit le *calendrier civil* pour la vie locale.
- **Portée pédagogique (C7 pour le discours cosmique) :** Le Calendrier Cosmique (Sagan) gagne. ATS n'offre pas une pédagogie à l'échelle 13,8 milliards d'années ; il opère sur l'échelle temporelle humaine.

ATS gagne sur un ensemble différent et spécifié : **C1 (simplicité computationnelle), C2 (élimination des fuseaux), C5 (généralité multi-planétaire), C6 (alignement biologique), C8 (contrat de précision)**. C'est le système qui **combine au maximum** ces cinq critères. Pour les cas d'usage où n'importe quel sous-ensemble de ceux-ci domine, ATS est la meilleure option d'ingénierie en v0.7. Pour les cas d'usage dominés par C4 (inertie) ou C7 communauté-spécifique, ATS ne gagne pas encore, et ne gagnera peut-être jamais.

---

## 9. Objections anticipées

### 9.1 « Votre comparaison omet l'opérateur historique — le calendrier grégorien. »

Le grégorien est la baseline contre laquelle toutes les réformes du §3 sont définies (IFC, World, Hanke-Henry, Pax commencent tous « co-alignés avec le grégorien »). Le standard est implicite au §3. Explicitement : le grégorien gagne sur **C4 (décisif)** et **C7 (au sein des sociétés dérivées chrétiennes)**. ATS gagne sur **C1, C2, C5, C6, C8**. Le calendrier grégorien continue à fonctionner pour les objectifs agricoles, ecclésiastiques et civiques ; ATS fournit des coordonnées parallèles pour les objectifs computationnels et multi-planétaires. Cf. `philosophy.fr.md §1` pour l'argument complet.

### 9.2 « Vous omettez Unix Epoch et Julian Day Number — les vrais cousins d'ATS. »

§2.1 et §2.2 les couvrent tous deux extensivement. ATS est *positionné* contre eux dans la même famille, avec des concessions explicites sur l'adoption (Unix) et l'héritage astronomique (JDN). ATS ne prétend pas remplacer aucun ; il prétend offrir une *grammaire positionnelle* sur le même axe temporel.

### 9.3 « La colonne verdict est sélective. »

Les verdicts aux §3–6 utilisent les critères C1–C8 énoncés au §1. Chaque comparaison cite le critère sur lequel ATS diffère. Là où les alternatives gagnent sur un critère, §8 le concède explicitement. Si un lecteur n'est pas d'accord avec un verdict spécifique, le critère-C qui le fonde est identifiable et l'objection devient spécifique plutôt que rhétorique.

### 9.4 « Le temps décimal a été tenté en 1793 et a échoué. ATS échouera aussi. »

§4.1 documente les trois raisons de l'échec républicain (rupture religieuse-culturelle, coût de fabrication des horloges décimales, symbolisme politique) et les trois leçons qu'ATS en tire :
1. ATS ne légifère pas sur les rythmes de repos.
2. ATS n'abolit pas les horloges civiles 24 heures.
3. L'ancrage d'ATS est non politique (`manifesto.fr.md §2.3`).
Aucun des modes d'échec de 1793 ne s'applique à ATS. L'échec de 1793 est une *contrainte* sur l'espace de design (qu'ATS respecte), pas une *preuve* contre le temps décimal.

### 9.5 « Swatch Internet Time a échoué en 1998. ATS échouera aussi. »

§4.2 documente les trois raisons de l'échec Swatch (poussée marketing seule, ancrage suisso-centré, pas de grammaire de date) et les trois différenciations d'ATS (ancrage universel, grammaire complète, chemin d'infrastructure). Swatch était une esquisse ; ATS est la version d'ingénierie avec vecteurs de conformance et implémentations de référence.

### 9.6 « Hanke-Henry a un vrai soutien financier (Johns Hopkins) ; ATS n'en a pas. »

Le soutien n'a pas produit l'adoption : Hanke-Henry a été proposé en 2012 et n'a aucun utilisateur déployé 14 ans après. Le mécanisme d'adoption d'ATS est de type open-source-software, pas type endorsement académique : implémentations de référence, suites de conformance, processus RFC public (`manifesto.fr.md §16`). Les deux stratégies sont différentes ; les deux ne sont pas éprouvées pour les standards temporels au XXIᵉ siècle.

### 9.7 « L'Ère Holocène est intuitive (vous êtes en 12026 de l'agriculture). ATS ne l'est pas. »

Holocène gagne sur l'intuition archéologique (§5.1). ATS ne concurrence pas sur cet axe. Une communauté qui préfère un compte d'année 12026 HE et un compte de jour ATS peut avoir les deux : Holocène est purement un décalage de compte d'année, et ATS coexiste.

### 9.8 « Pourquoi les calendriers hébraïque, islamique, chinois, hindou, bahá'í, maya, perse, éthiopien, etc., ne sont-ils pas dans votre comparaison ? »

§7 répond directement à cette question. Ce sont des **systèmes vivants** servant des fonctions culturelles et religieuses qu'ATS ne traite pas. La relation est **interopération, pas comparaison**. L'implémentation de référence fournit cinq bridges (`code/bridges/*.py`) ; le standard ne propose pas de déplacer aucun d'eux. Traiter un calendrier religieux comme un « compétiteur » d'un standard computationnel est une erreur de catégorie.

### 9.9 « ATS est présenté comme universel mais est en réalité d'ingénierie occidentale. »

L'ancrage Apollo 11 est américain en origine (`manifesto.fr.md §2.3 Attaque A`). Le nommage des unités (Kilo, Hecto, Deka, Centi, Milli) vient de la famille de préfixes SI, aussi d'origine occidentale. Le standard est ouvert au processus RFC depuis n'importe quelle communauté (`manifesto.fr.md §16.2`). La revendication de neutralité culturelle (C7) est **fonctionnelle** : ATS n'embarque pas de contenu religieux ou national dans sa sémantique. L'origine des *éditeurs* est reconnue ; le *standard* est portable.

---

## 10. Synthèse

Le tableau ci-dessous note chaque alternative sur les critères C1–C8. **+** = gagne clairement, **−** = perd clairement, **=** = à peu près équivalent, **N/A** = critère non applicable.

| Standard | C1 Comp | C2 FH | C3 Rég | C4 Inertie | C5 Multi-pl | C6 Bio | C7 Neutre | C8 Précision |
|---|---|---|---|---|---|---|---|---|
| **Grégorien** | − | − | − | **+** | − | − | =* | − |
| Unix Epoch | **+** | **+** | **+** | **+** | − | − | **+** | **+** |
| Julian Day | **+** | **+** | **+** | =* | =* | − | **+** | = |
| GPS Time | **+** | **+** | **+** | **+** | − | − | **+** | **+** |
| TAI | **+** | **+** | **+** | =* | − | − | **+** | **+** |
| IFC / World / Pax | − | − | **+** | − | − | − | − | − |
| Hanke-Henry | − | − | =* | − | − | − | =* | − |
| Républicain (1793) | =* | − | **+** | N/A | − | − | − | − |
| Swatch (.beat) | =* | **+** | **+** | − | − | =* | − | − |
| Ère Holocène | − | − | − | =* | − | − | **+** | − |
| Cosmique (Sagan) | N/A | N/A | N/A | N/A | N/A | N/A | **+** | N/A |
| Darian (Mars) | − | − | =* | − | =* | =*-sur-Mars | =* | − |
| **ATS v0.7** | **+** | **+** | **+** | − | **+** | **+** | **+** | **+** |

*Notes :*
- C7 pour le grégorien est « = » plutôt que « − » parce que, bien que l'*origine* grégorienne soit sectaire (calendrier de l'Église catholique, ancré sur le Christ), l'*usage global actuel* a détaché le compte de l'origine pour la plupart des utilisateurs (l'année 2026 est juste un nombre ; peu d'utilisateurs invoquent le Christ en l'énonçant).
- C6 (alignement biologique) pour Unix Epoch et JDN est « − » parce qu'ils n'ont *pas* de lecture positionnelle ; la question ne s'applique pas significativement. La lecture positionnelle d'ATS est le différenciateur.

**ATS est le système unique dans cette comparaison qui obtient une note positive simultanément sur {C1, C2, C5, C6, C8}.** Sa faiblesse est C4 (adoption), dépendant du chemin et adressable seulement avec le temps et par l'ingénierie cumulée des implémentations de référence, des bridges et des vecteurs de conformance.

Cette annexe est offerte comme argument comparatif pour ATS, présenté honnêtement. Le marché des standards jugera ; le dossier d'ingénierie est consigné.

---

## Références

- Achelis, E. (1937). *The Calendar for the Modern Age*. Putnam.
- Allan, D. W., Ashby, N., & Hodge, C. C. (1997). *The Science of Timekeeping* (Hewlett-Packard Application Note 1289).
- BIPM (1971). *CCTF Recommendation: Time scale TAI*. Bureau International des Poids et Mesures.
- Cotsworth, M. B. (1905). *The Rational Almanac*. Cotsworth Educational Publishing.
- Doggett, L. E. (1992). *Calendars*. Dans Seidelmann (Ed.), *Explanatory Supplement to the Astronomical Almanac*. University Science Books.
- Eastman, G. (1923). *Eastman Kodak Yearbook* (description de l'adoption IFC interne).
- Emiliani, C. (1993). *Calendar Reform*. Nature, 366, 716.
- Gangale, T. (1986). *Martian standard time*. Journal of the British Interplanetary Society, 39, 282–288.
- Gangale, T. (2006). *The Darian calendar for Mars*. ASCE Engineering, Construction, and Operations in Challenging Environments.
- Henry, R. C., & Hanke, S. H. (2012). *The Permanent Earth Calendar (Hanke-Henry)*. Johns Hopkins.
- Lewine, D. (1991). *POSIX Programmer's Guide*. O'Reilly. (Description de la sémantique temps POSIX.)
- Misra, P., & Enge, P. (2010). *Global Positioning System: Signals, Measurements, and Performance* (2ᵉ éd.). Ganga-Jamuna Press.
- Negroponte, N. (1998). *Beyond digital* (chronique sur Swatch Internet Time). *Wired*, 6.12.
- Sagan, C. (1980). *Cosmos*. Random House. (Chapitre sur le Calendrier Cosmique.)
- Scaliger, J. J. (1583). *De emendatione temporum*. (Origine du Julian Day Number.)
- Shaw, M. (2011). *Time and the French Revolution: The Republican Calendar, 1789–Year XIV*. Boydell Press.

Cette annexe ne fait aucune affirmation empirique originale. Toutes les affirmations sur les systèmes concurrents sont sourcées ou étiquetées comme évaluation des éditeurs. Les lecteurs identifiant des comparaisons faibles, des alternatives manquantes ou des verdicts contestés sont invités à ouvrir une issue à l'emplacement canonique (`manifesto.fr.md §16.1`).
