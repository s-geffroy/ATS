# FAQ — Δ ATS

**Statut :** Pré-release v0.7
**Type de document :** FAQ non normative. Complément conversationnel à la spec normative.
**Référence normative :** `manifesto.fr.md`
**Langue source :** Anglais (`faq.en.md`). Cette traduction française est fournie pour l'accessibilité.

> Chaque réponse ci-dessous cite la section source dans le manifeste ou une annexe pour que les affirmations soient vérifiables. Les questions se regroupent autour des **fondations** (§1), du **format et de la notation** (§2), des **maths et de la précision** (§3), du **multi-planétaire** (§4), des **calendriers culturels et de l'adoption** (§5), de l'**implémentation et de la conformance** (§6), du **site et de l'UI** (§7), et du **versionnement et processus** (§8). Utilisez la navigation pour sauter.

---

## 1. Fondations

### Pourquoi pas le calendrier grégorien ?

Le grégorien optimise le calage saisonnier d'une société agricole du XVIᵉ siècle. Pour calculer une durée, comparer deux périodes ou raisonner sur des cycles humains (focus, repos, projet, génération), il ajoute du bruit : mois irréguliers (28-31 jours), semaines religieuses (sans justification biologique), fuseaux mouvants, heure d'été. ATS ne remplace pas le grégorien — il offre une **couche de mesure** plus propre qui coexiste avec lui. Cf. `comparison.fr.md §9.1` pour l'argument comparatif complet ; `philosophy.fr.md §1` pour la justification.

### Pourquoi 1969-07-20, et pas une date « neutre » ?

L'alunissage d'Apollo 11 est l'événement le plus universellement positif et techniquement vérifiable du XXᵉ siècle. Il marque la première fois qu'un membre de notre espèce a occupé, en personne, la surface d'un corps autre que la Terre — la discontinuité qu'ATS utilise comme ancrage. Les quatre propriétés qui rendent Apollo 11 uniquement adapté comme époque ATS (vérifiabilité, témoignage à l'échelle de l'espèce, sans victime humaine, discontinuité de présence-ailleurs) sont documentées dans `manifesto.fr.md §2.3`. Six alternatives rejetées (Spoutnik, Hiroshima, Wright, lancement Apollo 11, premier pas, etc.) sont documentées à `manifesto.fr.md §2.2`.

### Pourquoi le début du jour (00:00 UTC), et pas l'instant de l'alunissage (20:17:40 UTC) ?

Pour garder le compteur de jour aligné sur UTC : avec l'époque sur la frontière de minuit, **Bloc 5 = 12:00 UTC** exactement (5 × 2 h 24 min), Bloc 0 = minuit, et ainsi de suite. Les versions précédentes (« RC v1.1 ») ancraient sur l'instant exact d'alunissage ; cela faisait tomber Bloc 5 à 08:17:40 UTC, ce qui surprenait les nouveaux venus (« pourquoi Bloc 5 n'est pas midi ? »). v0.5 a corrigé cela. L'alunissage lui-même est préservé comme un instant remarquable à l'intérieur de Δ 0, à `T+ Δ 0.0.0.0.84560` (Bloc 8, Centi 4, Deka 5, Kin 6). Cf. `manifesto.fr.md §2.1`.

### Pourquoi pas le premier pas (1969-07-21T02:56:15Z) comme ancrage ?

Le premier pas est symboliquement plus lourd que l'alunissage — mais il a lieu 6 h 35 après qu'Eagle a déjà touché terre, et le jour UTC *suivant* (Δ 1). Le monde se souvient de l'alunissage comme « 20 juillet 1969 » ; choisir le début de ce jour préserve la mémoire culturelle tout en s'alignant sur UTC. Le rejet apparaît dans le tableau des candidats `manifesto.fr.md §2.2`.

### Pourquoi pas l'année tropique (365,2422 jours) comme unité macro ?

Parce qu'elle n'est pas un multiple entier d'un jour. La forcer dans un format positionnel exige des jours bissextiles ou des fractions — exactement ce qu'ATS est conçu pour éliminer. La même logique rejette le mois synodique (29,53 jours) comme unité positionnelle sur Terre, et s'applique en sens inverse sur la Lune (où le jour lunaire synodique *est* l'unité naturelle ; cf. `multi-planetary.fr.md §3.3`).

### Pourquoi pas la base 12 ou la base 20 ?

La base 12 a des bénéfices de divisibilité (2, 3, 4, 6) ; la base 20 correspond au Long Count maya. Mais l'écosystème global — unités SI, monnaies, notation scientifique, informatique, finance — est massivement base 10. Le choix décimal réduit la friction d'adoption à près de zéro. Le choix est **ingénierie, pas numérologie** — `manifesto.fr.md §1.1` est explicite à ce sujet.

### Pourquoi pas l'Ère Holocène (Année 12026 = ancrage début-agriculture) ?

L'Ère Holocène garde la structure grégorienne et ne décale que le compte d'année de +10 000. C'est une amélioration cosmétique ; elle ne traite pas les problèmes computationnels sous-jacents (mois irréguliers, fuseaux, règles bissextiles). ATS garde un compteur décimal propre sous le même axe UTC. Cf. `comparison.fr.md §5.1` — Holocène gagne sur l'intuition archéologique ; ATS gagne sur la simplicité computationnelle. Les deux pourraient coexister (année Holocène + compte de jour ATS).

### ATS est-il une religion ou une vision du monde ?

Non. ATS est un système de coordonnées sur l'axe temporel UTC. Ce n'est pas une théorie sur la nature du temps, pas un remplacement des calendriers culturels ou religieux, pas un protocole de synchronisation d'horloges, et pas une affirmation métaphysique sur la base 10. Les quatre frontières explicites sont énoncées dans `manifesto.fr.md §1.1`. Les rituels culturels proposés dans `conventions.fr.md` (Kilo-versaire, Hecto-fête, transitions de Génération) sont des échafaudages cognitifs opt-in sans contenu métaphysique ; `philosophy.fr.md §8.1` traite explicitement l'accusation de « religion séculière ».

---

## 2. Format & notation

### Comment lire `T+ Δ 20.7.8.0.61137` à voix haute ?

La spec ne standardise pas la forme orale (`manifesto.fr.md §5` ne décrit que les formes écrites). Trois usages observés :

- **Chiffre par chiffre** : « té-plus delta deux-zéro point sept point huit point zéro point six-un-un-trois-sept ».
- **Groupé** : « vingt virgule sept virgule huit virgule zéro virgule soixante-et-un mille cent trente-sept ».
- **Conversationnel court** (`Δ20.7.8.0-61.1`) : « delta vingt point sept point huit point zéro tiret soixante-et-un point un ».

Choisissez ce qui colle à votre contexte.

### Quelle est la différence entre la forme canonique et la forme courte ?

- **Canonique** (`T+ Δ K.H.D.Kin.fffff`) : pleine précision, utilisée pour les logs, le stockage et l'échange. Porte toujours le marqueur de direction (`T+` ou `T-`). Cf. `manifesto.fr.md §4`.
- **Courte** (`ΔK.H.D.Kin-BC.M`, v0.7+) : forme conversationnelle pour UI et montres. Pas d'espace après Δ, séparateur `-` entre Kin et BC, séparateur `.` avant Milli. Pas de marqueur de direction (T+ implicite). Cf. `manifesto.fr.md §5`.

### D'où vient le chiffre Milli ? (mise à jour v0.7)

Avant v0.7, la forme courte était `Δ K.H.D.Kin/cc` (par exemple, `Δ 20.7.8.2/50`), encodant Bloc et Centi mais pas Milli — précision ±14 min 24 s. Depuis v0.7, le format est `ΔK.H.D.Kin-BC.M` (par exemple, `Δ20.7.8.2-50.0`), ajoutant le chiffre Milli et amenant la précision à ±1 min 26 s. Le chiffre Milli est **toujours émis**, y compris quand sa valeur est 0, pour que le plancher de précision soit prévisible. Cf. `manifesto.fr.md §5.1`.

### Pourquoi `Δ20.7.8.2-50` — sans chiffre Milli — est-il rejeté ?

Le parseur court v0.7 est strict : le `.M` de fin fait partie du format. Le chiffre Milli doit toujours être présent (même quand 0). Refuser un Milli manquant prévient l'ambigüité à la frontière de précision — une valeur sans `.M` ressemble à du pré-v0.7. La grammaire ABNF `manifesto.fr.md §5.1` impose cela ; les parseurs Python et JS de référence rejettent la forme sans `.M` avec une erreur explicite.

### « Δ20.7.8-65.1 » — quel jour exactement ?

C'est encore ambigu sur quel jour, parce que le chiffre Kin manque. v0.1.2 a **ramené `Kin`** dans la forme courte précisément pour corriger cela : la forme courte v0.7 est `Δ20.7.8.5-65.1` (avec Kin = 5). La forme courte est maintenant précise au jour près, avec le chiffre Milli (depuis v0.7) amenant la précision intra-jour à ±1 min 26 s. Cf. `manifesto.fr.md §5.1`.

### Pourquoi pas de fuseaux horaires ?

Parce que les fuseaux horaires sont la source N°1 de bugs de gestion de date dans le logiciel commercial [Hertel 2011 dans les références de `philosophy.fr.md`]. ATS = UTC strict par spec (`manifesto.fr.md §7`). Pour calibrer l'activité humaine au soleil local, utilisez la surcouche **LST (Local Solar Time)** comme commodité de couche-présentation uniquement — ne stockez jamais une valeur LST comme partie d'un instant ATS. Les interfaces logicielles transportant des valeurs ATS **ne doivent pas** porter de champ fuseau horaire (`manifesto.fr.md §7`).

### Et l'heure d'été (DST) ?

Disparue, en ce qui concerne ATS. Le DST est une convention culturelle appliquée à la couche présentation ; aucune valeur ATS ne bouge quand le DST change. Une société qui veut plus de soleil d'été décale ses **heures d'activité** (en ATS), pas son horloge. Le dataset cities-page (`docs/assets/data/cities.json`) reflète les fenêtres d'activité ; certaines villes décalent visiblement leurs fenêtres d'activité été-vers-hiver. ATS lui-même est inchangé.

### Que se passe-t-il pendant une seconde intercalaire ?

ATS s'aligne sur POSIX : un jour fait **exactement 86 400 secondes SI**. La seconde intercalaire est absorbée, comme dans Unix time. Les implémentations choisissent une de trois politiques de lissage documentées — POSIX-naïf, lissage linéaire, ou saut discret — et doivent documenter le choix (`manifesto.fr.md §8.2`). Une future variante ATS-TAI est réservée (`manifesto.fr.md §8.3`) pour l'aérospatial et la science haute-précision où le comportement leap-second compte à l'échelle sous-seconde.

### Pourquoi `Kin` est-il dans la partie entière, pas dans la fraction ?

Parce que la partie entière (`Kilo.Hecto.Deka.Kin`) répond à « **quel jour ?** » et la partie fractionnaire (`Bloc.Centi.Milli.Beat.Blink`) répond à « **à quel moment du jour ?** ». Deux questions distinctes, deux moitiés distinctes. En forme canonique ils sont séparés par `.` ; en forme courte par `-` (depuis v0.7). Le Kin est la plus petite unité macro (1 jour) — il appartient à la date, pas à l'horloge.

### Et au-delà de Kilo > 9 ?

Kilo n'a pas de borne supérieure. `T+ Δ 124.3.5.7.00000` est valide (124 × 1000 + 357 jours = ~344 ans après époque). En interne c'est un entier non borné ; l'implémentation Python de référence utilise `int` Python (précision arbitraire) ; l'implémentation JS de référence utilise le `number` JavaScript jusqu'à 2^53. Cf. `manifesto.fr.md §4.2`.

### Puis-je omettre le marqueur de direction `T+` en forme canonique ?

Non. `manifesto.fr.md §3` et §4.1 sont stricts : la forme canonique requiert soit `T+` soit `T-`, jamais omis. Le raccourci d'omission existe seulement dans la forme courte conversationnelle (`manifesto.fr.md §5`), où `T+` est implicite.

---

## 3. Maths & précision

### La troncature ne va-t-elle pas faire prendre du retard à l'horloge ?

Oui — par conception. ATS est un compteur d'unités **complétées**. Tant que la prochaine fraction n'est pas pleinement écoulée, elle n'est pas montrée. Conséquence : le temps affiché est toujours ≤ l'instant réel ; dérive ≤ 864 ms à précision 5 chiffres. Cf. `manifesto.fr.md §6` pour les invariants formels. L'implémentation Python de référence passe un test property-based (Hypothesis) sur 1000 instants aléatoires vérifiant la borne de dérive (`tests/test_property.py`).

### Pourquoi pas l'arrondi banker (half-even) ?

Essayé en v0.1.0, annulé en v0.1.1. Le half-even peut brièvement pousser l'affichage **devant** la réalité — incompatible avec un compteur monotone. ATS privilégie la monotonicité véridique sur la symétrie de moyennage. Cf. `manifesto.fr.md §6.4` pour la justification.

### Quelle est la précision de la forme courte ?

La forme courte `ΔK.H.D.Kin-BC.M` porte BC (2 chiffres de Bloc+Centi) plus M (1 chiffre de Milli) — trois chiffres de précision intra-jour, donnant ±1 min 26 s. Les chiffres Beat et Blink ne sont pas présents dans la forme courte. La forme canonique complète a 5 chiffres et ±864 ms de précision ; les implémentations à précision étendue (9 chiffres) atteignent ±0,0086 ms. Cf. `manifesto.fr.md §4.4`.

### La forme courte peut-elle round-tripper en UTC ?

Oui, avec la précision documentée. Décoder `Δ20.7.8.2-50.0` produit un instant ATS dont l'interprétation UTC est un intervalle semi-ouvert `[utc_decoded, utc_decoded + 86,4 s)` — exactement un Milli d'incertitude. Les décodeurs doivent labéliser le résultat comme approximatif (`manifesto.fr.md §10`). La forme canonique 5 chiffres round-trippe avec une dérive ≤ 864 ms.

---

## 4. Multi-planétaire

### Pourquoi Mars Pathfinder comme époque Mars ?

Le touchdown de la Sagan Memorial Station de Mars Pathfinder (1997-07-04T16:56:55Z) a été le premier atterrissage Mars moderne réussi de l'ère contemporaine, avec des records publics précis à la seconde. La date symbolique du 4 juillet correspond au cadrage culturel d'Apollo 11. Six alternatives rejetées — Viking 1, Mars 3, Curiosity, Perseverance, Schiaparelli, futur atterrissage humain — sont documentées dans `multi-planetary.fr.md §8.1`. Le premier atterrissage humain sur Mars **peut** devenir l'ancrage dans une révision future via le processus RFC.

### Pourquoi la Lune partage-t-elle l'époque Terre ?

Choix doctrinal : la Lune est le satellite de la Terre ; le système Terre-Lune est gravitationnellement et astronomiquement un système. Utiliser une époque reflète cela. Les colons lunaires expérimentent le jour synodique (≈ 29,53 jours terrestres) comme cycle intra-jour naturel, mais l'époque est partagée avec celle de la Terre pour que la coordination inter-corps soit plus simple. Cf. `multi-planetary.fr.md §8.2`.

### Pourquoi le jour lunaire synodique, pas le jour sidéral ?

Trois raisons (`multi-planetary.fr.md §3.3.2`) :

1. Les colons lunaires expérimentent le cycle synodique (lever-coucher-lever de soleil), pas le sidéral.
2. Le cycle synodique correspond au cycle de phases observé depuis la Terre — la référence culturelle.
3. Le framework NASA Coordinated Lunar Time (2024) utilise le cycle synodique.

Le jour sidéral **peut** être exposé comme unité additionnelle non normative par les implémentations qui en ont besoin.

### Puis-je définir un ATS Vénus ou un ATS Europe ?

Oui. Le framework générique dans `multi-planetary.fr.md §6` permet à toute implémentation d'enregistrer `Δ_X` pour n'importe quel corps en fournissant quatre paramètres : `epoch_X`, `day_seconds_X`, `suffix_X`, et (optionnel) `symbol_X`. L'implémentation Python de référence (`code/ats_multi_planetary.py`) fournit une classe `Body` avec cette interface. Les exigences de vecteurs sont dans `multi-planetary.fr.md §6.3`.

### Les effets relativistes comptent-ils pour ATS ?

Pour la précision 5 chiffres (résolution 864 ms), non. L'horloge à la surface lunaire dérive ≈ 58,7 µs/jour plus vite qu'UTC [NIST 2024] — environ 14 700× plus petit qu'un Blink. Même sur 50 ans, la dérive cumulée est ≈ 1,07 s. Pour la précision ATS par défaut, c'est négligeable. Pour l'usage à précision sous-milliseconde (planification autonome de rover lunaire, communication espace lointain), les implémentations doivent maintenir leurs propres tables de correction TAI ↔ surface-locale (`multi-planetary.fr.md §9.3`). Une future variante ATS-TAI est réservée.

---

## 5. Calendriers culturels & adoption

### ATS remplace-t-il mon calendrier religieux ?

Non. ATS est un standard temporel computationnel ; les calendriers culturels et religieux (hébraïque, islamique, hindou, chinois, bahá'í, Long Count maya, perse, éthiopien, etc.) remplissent des fonctions culturelles et religieuses qu'ATS ne traite pas. La relation est **interopération, pas déplacement** (`manifesto.fr.md §13.1`). L'implémentation de référence inclut 5 bridges (`code/bridges/*.py`) démontrant qu'un instant ATS se cartographie sur un instant dans n'importe quel calendrier culturel. Cf. `comparison.fr.md §7` pour la discussion complète.

### ATS légifère-t-il une semaine de 10 jours ?

Non. Le Deka (10 jours) est une unité de mesure, pas un mandat social (`manifesto.fr.md §13.3`). Le rythme 7+3 travail-repos proposé dans `conventions.fr.md §2` est une parmi plusieurs alternatives (6+1+2+1, 8+2, 5+5, 6+4) ; adopter l'une, ou aucune, est compatible avec ATS. Les communautés engagées dans la semaine liturgique de 7 jours (Sabbat, dimanche, prière du vendredi) la retiennent ; `conventions.fr.md §2.4` documente trois réponses raisonnables pour ces communautés.

### Et les calendriers hébraïque/islamique/hindou/chinois ?

Ils coexistent avec ATS via les bridges d'interop. Les bridges sont dans `code/bridges/{hebrew,islamic,hindu,chinese,maya}.py`. Chacun mappe un instant ATS à sa représentation dans le calendrier culturel (et inversement). Les vecteurs de conformance pour les bridges sont dans `docs/spec/test-vectors-bridges-*.json`. Cf. `comparison.fr.md §7` pour la discussion sur pourquoi les calendriers culturels sont interopérés, pas comparés.

### Le temps décimal n'a-t-il pas échoué comme le Calendrier Républicain français (1793) ?

Le Calendrier Républicain français a échoué pour trois raisons documentées (`philosophy.fr.md §4.1`, `comparison.fr.md §4.1`) :

1. **Rupture religieuse-culturelle trop forte** — la semaine de 10 jours impliquait 1 jour de repos sur 10 au lieu d'1 sur 7.
2. **Les horloges décimales étaient coûteuses à fabriquer** et la population a résisté au réapprentissage.
3. **Symbolisme politique** — le calendrier était associé à la Terreur.

ATS tire trois leçons explicites :

1. ATS ne légifère **pas** sur les rythmes de repos.
2. ATS n'abolit **pas** l'horloge civile 24 heures — ATS analogique et horloges murales grégoriennes coexistent.
3. ATS est ancré sur un événement vérifiable, non politique (`manifesto.fr.md §2.3`).

Aucun des modes d'échec de 1793 ne s'applique à ATS. L'échec de 1793 est une *contrainte* sur l'espace de conception (qu'ATS respecte), pas une *preuve* contre le temps décimal.

### ATS fonctionne-t-il sur mobile / dans le navigateur / hors ligne ?

Oui. Le site de référence (`/{fr,en}/index.html`) est une Progressive Web App ; la référence JavaScript (`docs/assets/js/ats.js`) fait ~10 KB et s'exécute partout où un `<script>` s'exécute. Le site est installable sur Chrome Android et Safari iOS ; le cadran analogique fonctionne hors ligne une fois caché.

---

## 6. Implémentation & conformance

### Comment vérifier qu'une bibliothèque tierce est conforme à la spec ?

`docs/spec/test-vectors.json` liste 12 instants de référence avec encodages canonique et court ; `test-vectors-arithmetic.json` liste 12 cas d'algèbre ; `test-vectors-multi-planetary-{mars,moon}.json` listent 10 cas par corps. Toute implémentation doit produire des sorties **bit-à-bit identiques** (`manifesto.fr.md §16.5`). Le CI du projet exécute ce contrat contre Python et JavaScript à chaque push ; le fichier workflow est `.github/workflows/ci.yml`.

### Que signifie « conformance » exactement ?

La conformance à ATS v0.7 signifie :

1. Passer `test-vectors.json` (Terre) bit-à-bit.
2. Passer `test-vectors-arithmetic.json` (algèbre) bit-à-bit.
3. Implémenter les parseurs canonique et court strict.
4. Documenter la politique de lissage des leap seconds choisie (`manifesto.fr.md §8.2`).
5. Documenter la classe de précision (5 chiffres par défaut ou étendue).

Le support multi-planétaire ajoute passer les vecteurs Mars et Lune. La conformance est **binaire, non graduée** : une implémentation est conformante ou ne l'est pas. La conformance partielle aux sections optionnelles doit être documentée (`manifesto.fr.md §16.5`).

### Quelle politique de lissage de leap second devrais-je utiliser ?

Trois politiques sont des options normatives (`manifesto.fr.md §8.2`) :

- **Lissage POSIX-naïf** : correspond à la sémantique `time_t` ; RECOMMANDÉ pour l'usage général.
- **Lissage linéaire (style Google)** : distribue le leap sur une fenêtre de 20 heures ; RECOMMANDÉ pour les systèmes distribués où la tolérance aux sauts d'horloge est faible.
- **Saut discret (aligné TAI)** : suit TAI en interne ; PERMIS pour l'aérospatial et l'usage scientifique.

L'implémentation Python de référence utilise POSIX-naïf (hérité du `datetime` Python). Documentez votre choix dans vos notes de release.

### Y a-t-il un JSON schema pour `spec_version` ?

Pas en v0.7 — le champ utilise la syntaxe `MAJEUR.MINEUR` (pas de PATCH) définie informellement dans `versioning.fr.md §2.1`. Les implémentations sont libres de valider le champ avec JSON Schema ou tout autre mécanisme. Un JSON Schema de référence **peut** être ajouté en une future MINEURE si les implémentations en demandent (la demande est elle-même une RFC ; cf. `versioning.fr.md §6`).

### Y a-t-il une implémentation Rust ou Go ?

Pas encore. Une implémentation tierce de référence en Rust ou Go est une **exigence de ship v1.0** (`versioning.fr.md §7.2 (3)`). Elle est sur la feuille de route (`ROADMAP.md` V1.0-B). Les contributeurs sont bienvenus.

---

## 7. Site & UI

### À quoi sert l'horloge analogique ?

À rendre ATS lisible d'un seul geste visuel, comme une montre-bracelet grégorienne est lisible. Cinq aiguilles (Bloc, Centi, Milli, Beat, Blink) sont à cinq paliers fixes de longueur-et-couleur, avec l'aiguille la plus lente la plus courte et la plus rapide la plus longue (convention horlogère). Le cadran porte aussi un anneau extérieur d'arcs de villes montrant les fenêtres de journée active 08–22 locales de 8 capitales. Cf. `analog-clock.fr.md` pour le design de référence complet et `philosophy.fr.md §2` pour la justification derrière l'unité Bloc.

### Comment fonctionnent les arcs de villes ?

Chaque ville dessine un arc coloré couvrant sa journée active locale 08:00 → 22:00. Les arcs utilisent quatre styles de stroke différents par slot (matin/midi/après-midi/soir) pour rendre le moment-du-jour visuellement scannable. Cliquer un trigramme de ville entre dans le **mode focus** : une superposition « camembert » apparaît au centre du cadran, les arcs des autres villes s'atténuent, et le trigramme de la ville focalisée s'agrandit. Cf. `analog-clock.fr.md §9` et §10.

### Qu'est-ce que la page Cités carte ?

Une page de référence séparée à `/{fr,en}/cities.html` montrant une carte du monde de ~40 capitales avec un emoji par ville évoluant avec l'activité en cours localement (dormir, travailler, déjeuner, etc.) à l'instant ATS courant. Un slider laisse explorer 24 h UTC. Cf. `analog-clock.fr.md §12` et `conventions.fr.md §3.4`.

### Puis-je ajouter ma propre ville ?

Oui. Ouvrez le panneau `<details>` sous l'horloge, entrez un code (2-4 lettres), un nom, un fuseau IANA (autocomplete depuis `Intl.supportedValuesOf('timeZone')`) et choisissez une couleur. Jusqu'à 6 villes personnalisées sont persistées dans `localStorage["ats-custom-cities"]`. Rien ne quitte le navigateur. Cf. `analog-clock.fr.md §11`.

### Pourquoi l'horloge utilise-t-elle un rafraîchissement à 10 Hz au lieu de 60 Hz ?

Trois raisons (`analog-clock.fr.md §8.1`) :

1. La position Blink se rafraîchit toutes les ≈ 864 ms, en dessous de la visibilité à 10 Hz ; des ticks plus rapides ne montreraient pas de nouvelle information.
2. 10 Hz est peu coûteux en CPU et batterie.
3. Les navigateurs mobiles throttlent les timers en arrière-plan à 1 Hz ; 10 Hz actif donne une marge sans gigue visible quand l'onglet revient au focus.

Une implémentation 60 Hz pilotée par `requestAnimationFrame` est permise.

---

## 8. Versionnement & processus

### Qu'est-ce qui change entre les versions v0.x ?

Les changements rupture sont permis aux frontières mineures pré-v1.0 ; chacun est consigné dans `CHANGELOG.md` avec un chemin de migration. L'exemple le plus récent : v0.6 → v0.7 a changé la syntaxe de forme courte de `Δ K.H.D.Kin/cc` à `ΔK.H.D.Kin-BC.M`. Post-v1.0, les changements rupture sont interdits aux frontières mineures ; ils requièrent un nouveau projet (ATS 2) selon `versioning.fr.md §3.8`.

### v1.0 est-il sorti ?

Non. v1.0 ship quand **toutes** les sept exigences dans `versioning.fr.md §7.2` sont satisfaites. À partir de v0.7 :

- (1) Champ `spec_version` sur tous les vecteurs — **FAIT** (v0.6).
- (2) Annexe multi-planétaire normative — **FAIT** (v0.7).
- (3) Implémentation tierce (Rust ou Go) — TODO.
- (4) Artefacts publiés (`npm publish`, `twine upload`, GitHub Release signée) — TODO.
- (5) Archive RFC (`docs/spec/rfcs/`) — TODO.
- (6) `GOVERNANCE.md` nommant les éditeurs d'enregistrement — TODO.
- (7) Workflow Lighthouse CI — **FAIT** (v0.7).

3 des 7 exigences satisfaites ; 4 restantes.

### Comment proposer un changement à la spec ?

Ouvrir une Issue ou PR GitHub publique titrée `RFC: <sujet>` contenant les sections requises (résumé, motivation, spécification, migration, analyse compat descendante, impact vecteurs). Période de commentaire publique : minimum 14 jours calendaires. La décision est enregistrée par les éditeurs d'enregistrement avec justification écrite. Les RFC acceptées sont mergées et la version bumpée. Cf. `versioning.fr.md §6` pour la procédure complète.

### Pourquoi ATS n'est-il pas encore une RFC IETF ?

Les éditeurs ont l'intention de soumettre ATS comme RFC informationnelle à l'IETF **après** que v1.0 ship (`manifesto.fr.md §16.3`). Pré-v1.0, la spec itère trop rapidement pour le processus IETF (périodes de last-call de plusieurs mois). La procédure RFC légère documentée dans `versioning.fr.md §6` est suffisante pour la cohorte actuelle de contributeurs. Un registre IANA pour les labels canonique/court et les identifiants de corps multi-planétaires est planifié pour la soumission IETF.

### Y a-t-il un document de gouvernance ?

Pas encore. `GOVERNANCE.md` (nommant les éditeurs d'enregistrement et la procédure de décision) est une exigence de ship v1.0 (`versioning.fr.md §7.2 (6)`). Pré-v1.0, les décisions appartiennent à l'éditeur d'enregistrement du document. Post-v1.0, un modèle multi-éditeurs avec consensus approximatif et veto compat descendante s'applique (`versioning.fr.md §6.3`).

### Y a-t-il une feuille de route publique ?

Oui, dans `ROADMAP.md` à la racine du projet. Elle suit le travail livré (v0.6 + v0.7) et les bloquants v1.0 restants (V1.0-B Rust/Go, V1.0-C convertisseur JS, V1.0-E i18n, V1.0-F tests, V1.0-G background sync, V1.0-H branding, V1.0-I signal d'adoption). À partir de v0.7, 3 des 9 bloquants v1.0 sont fermés.

---

## Ce que cette FAQ n'est *pas*

Pour pré-empter les erreurs de catégorie (reflétant la posture des autres annexes) :

1. **Ce n'est pas normatif.** La conformance (`manifesto.fr.md §16.5`) ne dépend d'aucune réponse ici. La FAQ existe pour rendre le contenu normatif plus accessible, pas pour définir du nouveau contenu normatif.
2. **Ce n'est pas exhaustif.** Les questions sont ajoutées à mesure qu'elles émergent de l'interaction utilisateur. Soumettre une question via une issue GitHub est bienvenu (`manifesto.fr.md §16.1`).
3. **Ce n'est pas un conseil légal ou financier.** ATS est une représentation du temps ; comment vous l'utilisez dans un contexte régulé (reporting financier, contrats légaux) est votre responsabilité. Le calendrier Hanke-Henry peut être plus adapté pour le reporting fiscal (`comparison.fr.md §3.3`).

---

## Références croisées en un coup d'œil

| Sujet | Section normative | Annexe non normative |
|---|---|---|
| Époque et test à 4 propriétés | `manifesto.fr.md §2`, §2.3 | `philosophy.fr.md §5`, `comparison.fr.md §5` |
| Formats canonique & court | `manifesto.fr.md §4`, §5 | — |
| Politique de troncature | `manifesto.fr.md §6` | — |
| Fuseaux horaires (UTC strict) | `manifesto.fr.md §7` | `conventions.fr.md §3` (bandes 08–22) |
| Secondes intercalaires | `manifesto.fr.md §8` | — |
| Algèbre Δd | `manifesto.fr.md §11.4` | — |
| Encodage binaire | `manifesto.fr.md §12` | — |
| Multi-planétaire | `multi-planetary.fr.md` | `philosophy.fr.md`, `comparison.fr.md §6` |
| Stabilité / processus RFC | `versioning.fr.md` | — |
| Rituels (Kilo-versaire, etc.) | — | `conventions.fr.md §1`, `philosophy.fr.md §6` |
| Design horloge analogique | — | `analog-clock.fr.md` |
| Comparaison aux alternatives | — | `comparison.fr.md` |

Chaque revendication dans cette FAQ soit référence une section de spec soit s'étiquette comme opinion de l'éditeur. Si vous repérez une réponse qui ne peut être tracée à une source normative, ouvrez une issue.
