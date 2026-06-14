# ATS — Versionnement, stabilité et processus

**Statut :** Pré-release v0.7
**Type de document :** **ANNEXE NORMATIVE** à la spécification ATS.
**Référence normative :** `manifesto.fr.md` (la spec proprement dite).
**Langue source :** Anglais (`versioning.en.md`). Cette traduction française est fournie pour l'accessibilité ; en cas de divergence, l'anglais fait foi.
**Thèse centrale :** Cette annexe définit le contrat de stabilité qui transforme ATS d'un projet personnel en un standard fiable. Elle spécifie ce qui change entre versions, ce qui est gelé pour toujours post-v1.0, comment fonctionne le processus RFC, et comment les implémentations revendiquent et maintiennent la conformance dans le temps.

---

## 0. Conventions

### 0.1 Niveaux d'exigence

Les mots clés **DOIT**, **NE DOIT PAS**, **REQUIS**, **DEVRA**, **NE DEVRA PAS**, **DEVRAIT**, **NE DEVRAIT PAS**, **RECOMMANDÉ**, **NON RECOMMANDÉ**, **PEUT** et **OPTIONNEL** dans ce document doivent être interprétés comme décrits dans BCP 14 [RFC 2119, RFC 8174] quand, et seulement quand, ils apparaissent en majuscules.

### 0.2 Glossaire

- **Vecteur de conformance** — Un cas de test machine-readable dans un fichier JSON utilisé par les implémentations pour vérifier la sortie bit-à-bit identique.
- **Éditeur d'enregistrement** — Une personne listée dans `GOVERNANCE.md` avec l'autorité de merger les changements normatifs à cette spécification.
- **Implémenteur** — Une partie produisant une implémentation conformante d'ATS.
- **RFC** (dans cette annexe) — Un document public de demande de commentaires déposé dans le tracker du projet proposant un changement normatif. Ne pas confondre avec les RFC IETF (le format ici est léger, pas IETF).
- **Champ `spec_version`** — Une chaîne au niveau racine requise dans chaque fichier de vecteurs de conformance identifiant la révision de spec qui les a produits.
- **SemVer** — Semantic Versioning 2.0.0 [SemVer 2.0.0].

### 0.3 Périmètre

Cette annexe spécifie :

- Le schéma de numéro de version (§1).
- Le champ `spec_version` utilisé par les consommateurs pour détecter la dérive de spec (§2).
- L'ensemble des éléments gelés post-v1.0 (§3).
- La politique additive des vecteurs (§4).
- Le rôle et le traitement des annexes non normatives (§5).
- La procédure RFC pour les changements normatifs (§6).
- Le plan de migration de v0.x à v1.0 (§7).
- Le contrat formel de compatibilité descendante (§8).
- Les objections anticipées à ce contrat (§9).

Cette annexe **ne** spécifie **pas** la gouvernance (`GOVERNANCE.md`), les exigences d'implémentation (`manifesto.fr.md §16.5`), ni le contenu des vecteurs de test (les fichiers `test-vectors-*.json` eux-mêmes).

---

## 1. Schéma SemVer

ATS utilise **Semantic Versioning 2.0.0** [SemVer 2.0.0] avec une politique de stabilité post-v1.0 renforcée.

### 1.1 Sémantique du triplet de version

Une version est un triplet `MAJEUR.MINEUR.PATCH`. Chaque composant porte un sens défini :

| Composant | Pré-v1.0 (actuel) | Post-v1.0 (engagé) |
|---|---|---|
| **MAJEUR** (`X.0.0`) | Changement rupture au format, à l'algèbre ou à l'encodage binaire | **INTERDIT** — tout changement nécessitant un bump MAJEUR déclenche un nouveau projet (ATS 2) selon §3.5 |
| **MINEUR** (`0.X.0`) | Changement additif : nouvelles annexes, nouveaux corps, nouveaux bridges, nouveaux vecteurs de conformance | Additif uniquement — strictement rétrocompatible |
| **PATCH** (`0.0.X`) | Corrections éditoriales, clarifications, vecteurs additionnels testant le comportement existant | Identique : corrections éditoriales uniquement |

### 1.2 Politique de version courante (pré-v1.0)

En v0.x, les changements rupture aux frontières MINEURES sont **PERMIS**. Les implémentations **DOIVENT** consulter `CHANGELOG.md` entre versions mineures et suivre le chemin de migration documenté. Chaque changement rupture en v0.x **DOIT** être consigné dans `CHANGELOG.md` avec le chemin de migration explicité.

La transition v0.6 → v0.7 est l'exemple documenté le plus récent : la syntaxe de la forme courte est passée de `Δ K.H.D.Kin/cc` à `ΔK.H.D.Kin-BC.M`. Le changement était rupture ; la migration était documentée ; les implémentations ont été mises à jour.

### 1.3 Tags pré-release

Les versions pré-release utilisent les identifiants de build SemVer : `v1.0.0-rc1`, `v1.0.0-rc2`, etc. Les implémentations **PEUVENT** annoncer la conformance à une version pré-release, mais **DEVRAIENT** traiter une telle conformance comme provisoire jusqu'au ship de la version stable correspondante.

---

## 2. Le champ `spec_version`

### 2.1 Format

Chaque fichier de vecteurs de conformance dans `docs/spec/test-vectors*.json` **DOIT** porter un champ au niveau racine :

```json
{
  "spec_version": "0.7",
  "...": "..."
}
```

La valeur du champ utilise la syntaxe :

```abnf
spec_version = major "." minor
major        = 1*DIGIT
minor        = 1*DIGIT
```

PATCH **NE DOIT PAS** apparaître dans `spec_version`. Les patches ne modifient jamais les vecteurs existants (cf. §4.1).

### 2.2 Obligations du producteur

Un producteur (l'éditeur ajoutant ou modifiant des vecteurs) **DOIT** :

- Mettre `spec_version` au `MAJEUR.MINEUR` de la spec sous laquelle les vecteurs ont été produits.
- Mettre à jour `spec_version` seulement quand un bump MINEUR introduit des vecteurs testant un nouveau contenu normatif.
- **JAMAIS** modifier un vecteur existant sous le même `spec_version`. La modification requiert un nouveau MINEUR avec un nouveau `spec_version`.

### 2.3 Obligations du consommateur

Un consommateur (un implémenteur revendiquant la conformance à une version donnée) **DOIT** :

- Valider que le champ `spec_version` existe et parse.
- Rejeter les fichiers de vecteurs dont `spec_version` déclare un MAJEUR supérieur à la version revendiquée.
- Rejeter les fichiers de vecteurs dont le MINEUR dépasse la version revendiquée (de tels vecteurs testent du contenu pas encore dans la spec revendiquée).
- Tester contre chaque vecteur dont `spec_version` est **≤** la version de conformance revendiquée.

### 2.4 Fichiers multiples

Un dépôt **PEUT** contenir plusieurs fichiers de vecteurs (`test-vectors.json`, `test-vectors-arithmetic.json`, `test-vectors-multi-planetary-mars.json`, etc.). Chaque fichier porte son propre `spec_version`. Un consommateur **DOIT** évaluer chaque fichier indépendamment contre son propre champ `spec_version`.

---

## 3. Engagements post-v1.0 (gelés)

Les éléments suivants deviennent **gelés** au ship d'ATS v1.0. Modifier l'un d'eux post-v1.0 est INTERDIT aux frontières MINEURES ; la modification requiert un nouveau projet comme défini au §3.5.

### 3.1 L'époque

L'époque ATS Terre est `1969-07-20T00:00:00Z`. Post-v1.0, cette valeur **NE DOIT PAS** changer. Les autres corps ont leurs propres époques gelées séparément (cf. `multi-planetary.fr.md §7`).

### 3.2 Le format canonique

Le format canonique `T± Δ K.H.D.Kin.fffff` est gelé tel que spécifié dans `manifesto.fr.md §4.1` (grammaire ABNF). Post-v1.0 :

- L'ordre positionnel **NE DOIT PAS** changer.
- Les séparateurs (`.`) **NE DOIVENT PAS** changer.
- Le marqueur de direction (`T+` / `T-`) **NE DOIT PAS** être omis.
- La fraction par défaut à 5 chiffres **NE DOIT PAS** changer en tant que défaut ; la précision étendue (par exemple 9 chiffres) reste optionnelle selon `manifesto.fr.md §4.4`.

### 3.3 La forme courte

La forme courte `ΔK.H.D.Kin-BC.M` est gelée telle que spécifiée dans `manifesto.fr.md §5.1`. L'ancienne forme `Δ K.H.D.Kin/cc` (avant v0.7) **NE DOIT PAS** être ré-introduite ; son rejet au parseur est un invariant post-v1.0.

### 3.4 Politique de troncature

La règle stricte de troncature plancher (`ROUND_FLOOR`) définie dans `manifesto.fr.md §6` est gelée. Les implémentations **NE DOIVENT PAS** introduire de modes d'arrondi alternatifs (half-up, half-even, round-to-zero) pour la sortie canonique.

### 3.5 L'algèbre du §11.4

L'algèbre des durées définie dans `manifesto.fr.md §11.4` est gelée. Spécifiquement :

- Les sept opérations typées (`Δ+Δd→Δ`, `Δd+Δ→Δ`, `Δ−Δd→Δ`, `Δ−Δ→Δd`, `Δd+Δd→Δd`, `Δd−Δd→Δd`, `Δd×n→Δd`, `Δd÷n→Δd`) **NE DOIVENT PAS** changer de signature.
- Les comparaisons (`< ≤ = ≥ >`) **DOIVENT** lever une erreur de type sur des opérandes mixtes `Δ × Δd`.
- La sémantique de débordement (Kilo non borné ; chiffres inférieurs tronqués plancher) **NE DOIT PAS** changer.
- Des opérations additionnelles **PEUVENT** être ajoutées en releases MINEURES à condition qu'elles ne modifient pas les signatures existantes.

### 3.6 Le format binaire

La disposition binaire 64 bits définie dans `manifesto.fr.md §12` est gelée :

- 40 bits hauts, signés (complément à deux), big-endian : compte de jours.
- 24 bits bas, non signés, big-endian : fraction du jour, mise à l'échelle 2²⁴.

Des dispositions alternatives (offset biaisé, little-endian, précision 96 bits) **PEUVENT** être introduites comme formats additionnels avec des noms distincts ; elles **NE DOIVENT PAS** remplacer la forme canonique 64 bits.

### 3.7 Les vecteurs de conformance principaux

`docs/spec/test-vectors.json` contient 12 vecteurs en v0.7. Post-v1.0 :

- Ces 12 vecteurs **NE DOIVENT PAS** être modifiés.
- Des vecteurs additionnels **PEUVENT** être ajoutés en releases MINEURES.
- La suppression d'un vecteur quelconque est **INTERDITE** (politique additive, cf. §4).

### 3.8 La porte de sortie nouveau projet

Si ATS requiert un jour des changements rupture aux éléments des §§3.1–3.7, les éditeurs **DOIVENT** lancer un nouveau projet nommé `ATS 2` (ou supérieur) avec :

- Une nouvelle époque distincte (pour que les valeurs d'ATS 1.x et ATS 2.x ne soient pas confondables).
- Un nouveau nom de projet dans `pyproject.toml`, `package.json`, etc.
- Un nouveau dépôt GitHub, ou une branche/répertoire clairement séparé.
- Une nouvelle suite de vecteurs de conformance.

ATS 1.x et ATS 2.x sont des **standards distincts**. Les implémentations **NE DOIVENT PAS** revendiquer la conformance à « ATS » au sens non qualifié ; elles **DOIVENT** spécifier la version.

---

## 4. Politique des vecteurs

### 4.1 Additifs uniquement

Un vecteur de conformance publié **NE DOIT PAS** être retiré ou modifié après publication sous un `spec_version` donné. L'ensemble des vecteurs à la version `vX.Y` **DOIT** être un sous-ensemble de l'ensemble à toute version ultérieure `vX.Z` où `Z ≥ Y`.

Si un vecteur publié est découvert faux (par exemple, une erreur de calcul), le processus de correction est :

1. Ouvrir une RFC documentant l'erreur (§6).
2. Si la spec était correcte et le vecteur faux, déprécier le vecteur en **ajoutant** un nouveau vecteur corrigé avec un label clair (`label: "Corrected from <old vector id>"`).
3. Le vecteur faux reste dans le fichier avec un flag `deprecated: true` et un champ raison, pour que les consommateurs exécutant l'ancienne suite de tests voient la dépréciation.

Cette procédure préserve l'invariant additif-uniquement tout en permettant la correction d'erreur sans modification.

### 4.2 Obligations de test pour les implémenteurs

Un consommateur revendiquant la conformance à la version `vX.Y` **DOIT** :

- Passer chaque vecteur non déprécié avec `spec_version ≤ vX.Y`.
- Documenter dans ses notes de release quels vecteurs il a sauté (par exemple, vecteurs de précision étendue si l'implémentation ne supporte que 5 chiffres).

Les implémentations **DEVRAIENT** publier leur rapport de test de conformance (la sortie de l'exécution de la suite de vecteurs) pour que les utilisateurs puissent vérifier la conformance indépendamment. Le workflow CI de référence `tests/test_vectors.py` et `tests/test_vectors.mjs` produit un tel rapport.

### 4.3 Nouvelles suites de vecteurs

Une nouvelle suite de vecteurs (par exemple, `test-vectors-multi-planetary-venus.json`) ship avec :

- Son propre champ `spec_version`, correspondant au MAJEUR.MINEUR de la spec qui introduit le corps.
- Un minimum de 5 vecteurs couvrant l'époque du corps, des nombres ronds en mi-vie, des cas limites fractionnaires et une date dans le siècle suivant.
- Un champ `label` sur chaque vecteur pour le contexte humainement lisible.

---

## 5. Annexes non normatives

Les annexes suivantes sont **explicitement non normatives** :

- `philosophy.fr.md`
- `comparison.fr.md`
- `conventions.fr.md`
- `analog-clock.fr.md`

Ces annexes :

- **PEUVENT** être ajoutées, modifiées ou retirées entre versions MINEURES.
- **NE PORTENT PAS** de vecteurs de conformance qui gatent la conformance des implémentations.
- **NE PARTICIPENT PAS** aux gels post-v1.0 du §3.
- **PEUVENT** référencer du contenu normatif mais **NE DOIVENT PAS** le redéfinir.

Un lecteur de la spec qui saute chaque annexe non normative a toujours une spécification normative complète (`manifesto.fr.md` + `versioning.fr.md` + `multi-planetary.fr.md`).

---

## 6. Procédure RFC

Tout changement normatif à cette spécification (y compris cette annexe elle-même) **DOIT** suivre la procédure ci-dessous.

### 6.1 Déposer une RFC

Le proposeur **DOIT** :

1. Ouvrir un document public dans le tracker du projet (Issue GitHub ou PR) titré `RFC: <sujet>`.
2. Le document **DOIT** contenir :
   - **Résumé** : un paragraphe décrivant le changement.
   - **Motivation** : pourquoi le changement est nécessaire.
   - **Spécification** : le texte normatif proposé.
   - **Migration** : comment les implémentations existantes sont affectées et ce qu'elles DOIVENT faire.
   - **Analyse de compatibilité descendante** : si le changement est additif (MINEUR) ou rupture (interdit post-v1.0).
   - **Impact sur les vecteurs de conformance** : quels vecteurs sont ajoutés, lesquels sont dépréciés.

### 6.2 Période de commentaire public

La RFC **DOIT** rester ouverte au commentaire public pendant un **minimum de 14 jours calendaires** depuis le dépôt. Durant cette période :

- Le proposeur **PEUT** réviser la RFC en réponse aux commentaires.
- Les éditeurs d'enregistrement **NE DOIVENT PAS** merger le changement avant l'expiration de la période.
- Si une révision substantielle est faite (c.-à-d., le texte normatif change), le compteur de 14 jours **REPART** depuis la date de révision.

### 6.3 Décision

Après la période de commentaire :

- Les éditeurs d'enregistrement enregistrent une décision : **ACCEPTER**, **MODIFIER** ou **REJETER**.
- La décision **DOIT** inclure une justification écrite.
- L'acceptation requiert un **consensus approximatif** parmi les éditeurs d'enregistrement (aucun éditeur ne s'oppose pour des raisons de compatibilité descendante ou de périmètre).
- Un seul éditeur PEUT opposer son veto sur des bases de **compatibilité descendante** uniquement ; un désaccord substantiel sur le mérite de design est résolu par majorité.

### 6.4 Merge et bump de version

Si acceptée, la RFC est mergée avec :

- Mises à jour des fichiers spec affectés (`manifesto.fr.md`, cette annexe, etc.).
- Mises à jour de `CHANGELOG.md`.
- Bump de la version dans `pyproject.toml`, `package.json`, tous les footers HTML.
- Un nouveau fichier de vecteurs de conformance (si applicable) ou ajouts aux fichiers existants.

Le merge déclenche la prochaine release. Le versionnement suit §1.

### 6.5 Changements ne requérant pas de RFC

Les changements suivants **PEUVENT** être faits par les éditeurs sans RFC :

- Corrections de typo et de formatage qui ne changent pas la sémantique.
- Mises à jour de traduction (préservant la version anglaise faisant foi).
- Ajouts ou révisions d'annexes non normatives (cf. §5).
- Nouveaux bridges calendaires (`code/bridges/*.py`) — additifs par construction.
- Nouveaux vecteurs de conformance au `spec_version` courant (testant le comportement existant).
- Restructuration éditoriale de la numérotation de sections avec redirections pour que les références existantes résolvent toujours.

### 6.6 Archive des RFC

Chaque RFC, acceptée ou rejetée, **DOIT** être archivée sous `docs/spec/rfcs/`. L'archive **DOIT** inclure :

- Le texte de proposition original.
- Le fil de commentaires complet (ou un lien si le tracker le stocke).
- La décision des éditeurs et la justification.

Cela rend l'histoire des décisions auditable.

---

## 7. Migration v0.x → v1.0

### 7.1 Invariant de stabilité

La transition v0.x → v1.0 **NE DOIT PAS** introduire de changement de format. La batterie complète de vecteurs v0.7 **DOIT** valider contre v1.0 bit-à-bit.

### 7.2 Exigences pour v1.0

ATS v1.0 ship quand **tous** les points suivants sont vrais :

1. Champ `spec_version` présent sur tous les vecteurs de conformance. (FAIT en v0.6.)
2. Annexe multi-planétaire normative. (FAIT en v0.7.)
3. Au moins une implémentation tierce de référence (Rust ou Go) passant 100 % des vecteurs de conformance.
4. Artefacts publiés : `npm publish @s-geffroy/ats`, `twine upload ats-time`, GitHub Release signée GPG.
5. Archive RFC dans `docs/spec/rfcs/` avec au moins une RFC décidée.
6. `GOVERNANCE.md` dans le dépôt nommant les éditeurs d'enregistrement.
7. Workflow Lighthouse CI produisant des scores ≥ 90 sur les 4 catégories standards pour 4 pages de référence. (FAIT en v0.7.)

Quand les sept tiennent, les éditeurs d'enregistrement peuvent tagger v1.0 en suivant §6.4.

### 7.3 Évolution post-v1.0

Entre v1.0 et v1.x, la spec évolue additivement selon §1. Exemples de changements v1.x permis :

- Un nouveau corps céleste dans `multi-planetary.md` avec nouveaux vecteurs.
- Une nouvelle opération au §11.4 (par exemple, `Δd modulo n`) à condition qu'elle ne modifie pas les signatures existantes.
- Nouvelles annexes non normatives.
- Nouveaux fichiers de vecteurs de conformance pour précision additionnelle (par exemple, tests de fraction à 9 chiffres).

Exemples de changements v1.x INTERDITS (requièrent ATS 2.x) :

- Changer l'époque.
- Renommer une unité positionnelle.
- Modifier la disposition binaire.
- Retirer un élément gelé post-v1.0 (§3).

---

## 8. Contrat de compatibilité descendante et ascendante

### 8.1 Définitions

- **Compatible descendante** : Un changement à la spec est compatible descendante si chaque implémentation conformante à la version précédente reste conformante à la nouvelle version.
- **Compatible ascendante** : Un consommateur revendiquant la conformance à la version `vX.Y` est compatible ascendant avec les fichiers de vecteurs déclarant `spec_version > vX.Y` s'il saute les vecteurs inconnus plutôt que d'échouer.

### 8.2 Obligations de l'implémentation

Une implémentation **DOIT** :

- Accepter les fichiers de vecteurs de conformance avec `spec_version` égal ou inférieur à sa version de conformance revendiquée.
- Rejeter les fichiers avec `spec_version` supérieur (la compatibilité ascendante n'est PAS REQUISE mais RECOMMANDÉE pour l'outillage).
- Documenter dans ses notes de release la version exacte revendiquée.

Une implémentation **DEVRAIT** :

- Supporter la compatibilité ascendante en sautant les vecteurs inconnus avec un avertissement.
- Rafraîchir son exécution de conformance à chaque nouvelle release de fichier de vecteurs.

### 8.3 Politique de dépréciation

Quand une fonctionnalité est destinée au retrait dans une future release MAJEURE (c'est-à-dire en ATS 2.x) :

- La fonctionnalité **DOIT** être marquée dépréciée dans la version où l'intention est décidée.
- Le marqueur de dépréciation **DOIT** être visible dans le texte de spec (par exemple, `> **DÉPRÉCIÉ en v1.5.0**, retrait prévu en ATS 2.0`).
- Les implémentations **PEUVENT** émettre des avertissements de dépréciation aux utilisateurs.
- La fonctionnalité **DOIT** continuer à fonctionner correctement jusqu'à la frontière MAJEURE (qui, selon §3.8, est un nouveau projet).

En pratique, cela signifie **rien n'est retiré durant ATS 1.x**. Les marques de dépréciation indiquent l'intention de laisser tomber en ATS 2.x.

---

## 9. Objections anticipées

### 9.1 « Les engagements de stabilité post-v1.0 sont inapplicables. Qu'est-ce qui vous empêche de les briser ? »

Les engagements sont appliqués par le **coût de migration** : toute implémentation ayant passé les vecteurs de conformance à v1.0 est cassée par une violation. Le coût de briser le contrat est visible — pour les utilisateurs, pour les autres implémenteurs, pour quiconque exécute la suite de conformance. Les éditeurs d'enregistrement sont responsables de ce coût. Les standards ne sont de toute façon pas appliqués par sanctions légales ; ils sont appliqués par le coût de non-conformance. §3.8 (nouveau projet requis) est la porte de sortie formelle : si un changement rupture est vraiment nécessaire, les éditeurs scindent le projet plutôt que de trahir le contrat.

### 9.2 « Le modèle BDFL / éditeur d'enregistrement est un point unique de défaillance. »

Pré-v1.0, le projet a un éditeur d'enregistrement unique. Post-v1.0, §6.3 requiert un consensus approximatif parmi **au moins trois éditeurs d'enregistrement** listés dans `GOVERNANCE.md`. Le pool d'éditeurs est ouvert aux implémenteurs conformants reconnus (selon `manifesto.fr.md §16.4`). Si le projet perd tous ses éditeurs (mort, retraite, abandon), les vecteurs de conformance restent stables pour toujours ; une implémentation continue à valider même si la spec n'est plus maintenue. Le coût d'une spec abandonnée est une nouveauté réduite, pas des implémentations cassées.

### 9.3 « La période RFC de 14 jours est trop courte pour des standards internationaux. »

Les RFC IETF tournent typiquement sur des périodes de last-call de plusieurs mois ; les standards ISO tournent sur des cycles de plusieurs années. Le minimum de 14 jours d'ATS reflète son échelle actuelle (un seul éditeur, un seul dépôt). Quand ATS approche du périmètre IETF / ISO (c'est-à-dire quand §7.2 item 3 est satisfait par plusieurs implémentations et §7.2 item 4 publie via des organismes de standards), la période RFC **SERA** ré-évaluée. Le minimum de 14 jours est suffisant pour la cohorte actuelle de contributeurs ; le plancher PEUT être relevé dans les révisions futures.

### 9.4 « La politique additive de vecteurs empêche de corriger les erreurs. »

§4.1 traite cela : les erreurs sont corrigées en **ajoutant** un vecteur corrigé et en **marquant** l'original déprécié. Le vecteur faux reste dans le fichier (a) pour que les consommateurs exécutant l'ancienne suite de tests voient la dépréciation, (b) pour que le record historique de quel comportement la spec exigeait à v(X) soit préservé, et (c) pour que l'invariant additif tienne. Le coût est de la verbosité dans le fichier de vecteurs ; le bénéfice est l'auditabilité.

### 9.5 « Le champ `spec_version` n'a pas de validation de schéma. »

Les implémentations sont libres de valider le champ avec JSON Schema ou tout autre mécanisme. La spec elle-même ne mandate pas de schéma parce que la diversité de l'outillage est une fonctionnalité (les implémentations Python, JavaScript, Rust, etc., utilisent chacune le validateur que leur écosystème préfère). Un JSON Schema de référence **PEUT** être ajouté en une future MINEURE si les implémentations en demandent un (la demande est elle-même une RFC).

### 9.6 « Pourquoi ne pas adopter directement le processus IETF ou W3C ? »

ATS est actuellement une spécification développée publiquement, pas un standard international reconnu (selon `manifesto.fr.md §16.3`). La procédure RFC du §6 est assez légère pour faire progresser à l'échelle actuelle du projet ; les processus IETF / W3C sont conçus pour des groupes de travail de nombreuses organisations. Les éditeurs ont l'INTENTION de soumettre ATS à IETF ou W3C **après** que v1.0 ship (selon `manifesto.fr.md §16.3`), moment où le processus plus lourd prend le relais.

### 9.7 « Les implémentations pourraient mentir sur leur version de conformance. »

La conformance est vérifiable : la suite de vecteurs de test produit un résultat déterministe. Un consommateur peut exécuter l'implémentation contre les vecteurs et vérifier la revendication indépendamment. La spec ne police pas les revendications ; le marché le fait.

### 9.8 « Les 7 exigences pour v1.0 au §7.2 sont arbitraires. »

Chaque exigence cible un mode d'échec spécifique :

- (1) Champ `spec_version` — prévient la dérive silencieuse de spec.
- (2) Annexe multi-planétaire — remplit la revendication « conçu pour le multi-planétaire » de `manifesto.fr.md §1`.
- (3) Implémentation tierce — prévient le biais d'implémenteur unique (Python + JS partagent trop d'ADN).
- (4) Artefacts publiés — rend la spec installable, pas seulement téléchargeable.
- (5) Archive RFC — prouve que le processus existe.
- (6) `GOVERNANCE.md` — nomme les parties responsables.
- (7) Lighthouse CI — prouve que la spec ship comme un site déployable, pas juste un fichier Markdown.

La liste **PEUT** être révisée par RFC si les exigences se révèlent inadéquates ou excessives en pratique.

---

## 10. Précédence de référence normative

En cas de désaccord entre cette annexe et le manifeste, **`manifesto.fr.md` prévaut**. En cas de désaccord entre la version anglaise de cette annexe et la traduction française (`versioning.fr.md`), **la version anglaise prévaut**. Cette annexe n'introduit pas de nouveau mécanisme au-delà du manifeste ; elle codifie les contraintes de stabilité et de processus uniquement.

---

## Références

- **RFC 2119** — Bradner, S. *Key words for use in RFCs to Indicate Requirement Levels*. IETF (1997).
- **RFC 5234** — Crocker, D., & Overell, P. *Augmented BNF for Syntax Specifications: ABNF*. IETF (2008).
- **RFC 8174** — Leiba, B. *Ambiguity of Uppercase vs Lowercase in RFC 2119 Key Words*. IETF (2017).
- **BCP 14** — RFC 2119 + RFC 8174 (niveaux d'exigence).
- **SemVer 2.0.0** — Preston-Werner, T. *Semantic Versioning 2.0.0*. https://semver.org/spec/v2.0.0.html.
- **`manifesto.fr.md`** — La spécification ATS (référence normative).
- **`multi-planetary.fr.md`** — Annexe normative multi-planétaire.
- **`GOVERNANCE.md`** — Gouvernance du projet et liste des éditeurs.

Toutes les revendications dans cette annexe sont soit dérivées des sources citées soit des décisions de politique des éditeurs d'enregistrement. Les lecteurs identifiant des incohérences, des justifications faibles ou des scénarios manquants sont invités à ouvrir une RFC selon §6.
