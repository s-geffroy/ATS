# FAQ — Δ ATS

## Pourquoi pas la convention déjà mondiale (calendrier grégorien) ?

Le grégorien optimise le calage saisonnier d'une société agricole du XVIᵉ siècle. Pour calculer une durée, comparer deux périodes ou raisonner sur des cycles humains (focus, repos, projet, génération), il introduit du bruit : mois irréguliers, semaines bibliques, fuseaux mouvants, heure d'été. L'ATS ne supprime pas le grégorien — il offre une **mesure** plus propre, qui coexiste avec lui.

## Pourquoi 1969-07-20 et pas une date "neutre" ?

L'alunissage est l'événement le plus consensuellement positif et techniquement vérifiable du XXᵉ siècle. C'est aussi le premier instant où un humain a posé son enveloppe sur un autre corps céleste, ce qui colle au projet "civilisation multi-planétaire" du manifeste.

## Pourquoi le **début** du jour (00:00 UTC) et non l'instant exact de l'alunissage (20:17:40 UTC) ?

Pour aligner le compteur de jour avec UTC : avec l'époque calée sur minuit, **Bloc 5 = 12:00 UTC** exactement (5 × 2 h 24 min), Bloc 0 = minuit, etc. Les versions antérieures (« RC v1.1 ») ancraient sur l'instant exact de l'alunissage ; Bloc 5 tombait alors à 08:17:40 UTC, ce qui déroutait (« pourquoi Bloc 5 n'est pas midi ? »). v0.5 corrige cela. L'instant de l'alunissage reste honoré comme un point remarquable à l'intérieur de Δ 0, à `T+ Δ 0.0.0.0.84560` (Bloc 8, Centi 4, Deka 5, Kin 6).

## Pourquoi pas le premier pas (21/07 02:56:15Z) comme ancrage ?

Le premier pas a une charge symbolique plus forte que l'alunissage — mais il arrive 6 h 35 après que Eagle s'est posé, et le *lendemain* UTC (Δ 1). Le monde retient l'alunissage comme « 20 juillet 1969 » ; ancrer sur le début de ce jour préserve la mémoire culturelle tout en alignant sur UTC.

## Pourquoi pas l'année tropique (365.2422 j) comme unité macro ?

Parce qu'elle n'est pas un multiple entier d'un jour. La forcer dans un format positionnel oblige à des bissextiles ou des fractions, qui sont exactement ce qu'on essaie d'éliminer.

## Pourquoi pas la base 12 ou la base 20 ?

La base 12 a des avantages divisibilité (2, 3, 4, 6), la base 20 colle au Compte Long maya. Mais l'écosystème (numéraires, SI, informatique, finance) est entièrement en base 10. Le choix décimal réduit la friction d'adoption à ~0.

## Comment lire `T+ Δ 20.7.8.0.61137` à voix haute ?

La spec ne fixe pas de standard oral. Trois usages observés : point-par-point ("Deux Zéro point Sept point Huit point Zéro point Six Un Un Trois Sept"), groupé par paire ("Vingt point Sept point Huit point Zéro point Six mille cent trente-sept"), ou court ("Vingt sept huit zéro / soixante-et-un").

## "Δ 20.7.8 / 65", c'est ambigu sur quel jour ?

Oui — c'est précisément pourquoi v0.1.2 a **rétabli `Kin`** dans la forme courte : `Δ 20.7.8.5/65`. La forme courte garde maintenant la précision au jour près. La perte ne porte plus que sur Milli/Beat/Blink (±14 min 24 s).

## Pourquoi pas de fuseau horaire ?

Parce que c'est la source #1 de bugs en logiciel. ATS = UTC strict. Pour calibrer ses activités au soleil local, on utilise la couche **LST (Local Solar Time)** comme surcouche informative (§7), jamais comme champ stocké.

## Et les changements d'heure été/hiver ?

Disparus côté ATS. Ils existent encore dans la culture, mais aucune valeur ATS ne bouge le jour du changement. Une société qui veut profiter du soleil l'été décale ses **horaires d'activité** (en ATS), pas son horloge.

## Que se passe-t-il pour une seconde intercalaire (leap second) ?

L'ATS s'aligne sur POSIX : un jour vaut **exactement 86 400 secondes**. La seconde intercalaire est absorbée silencieusement, comme dans Unix time. Pour les usages aérospatiaux où ça compte (TAI ≠ UTC), une variante TAI pourrait être définie ultérieurement.

## Pourquoi le `Kin` est-il en position 1 et non Bloc/Centi ?

Parce que la partie entière (Kilo.Hecto.Deka.Kin) répond à la question "quel jour ?" et la partie fractionnaire (Bloc.Centi.Milli.Beat.Blink) à la question "à quel moment du jour ?". Les deux ont une utilité distincte ; les séparer par `.` (canonique) ou `/` (court) clarifie la lecture.

## La troncature ne va-t-elle pas afficher du retard ?

Oui — et c'est voulu. ATS est un compteur d'**unités complétées**. Tant que la prochaine fraction n'est pas pleinement écoulée, on ne l'affiche pas. Conséquence : l'horloge est toujours ≤ instant réel (drift ≤ 864 ms à précision 5 chiffres).

## Pourquoi pas l'arrondi banker's (half-even) ?

Tenté en v0.1.0, rejeté en v0.1.1. Le half-even peut faire passer brièvement l'affichage **au-dessus** de l'instant réel — incompatible avec un compteur monotone. Cf. §6 du manifeste.

## Et au-delà de 9 Kilos ?

Le Kilo n'a pas de borne supérieure. `Δ 124.3.5.7.00000` est valide (124 000 + 357 jours = ~344 ans). En interne, on utilise un entier non borné.

## Comment je sais qu'une lib tierce respecte la spec ?

`docs/spec/test-vectors.json` contient 12 instants de référence avec leurs encodages canonique + court. Toute implémentation doit produire des sorties identiques bit pour bit. La CI du projet exécute ce contrat sur Python et JavaScript à chaque push.
