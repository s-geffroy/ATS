# ATS — Contrat de stabilité et versionnement

**Statut :** v0.6.0
**Référence normative :** `manifesto.fr.md` (la spec)

---

## 1. Schéma SemVer

L'ATS suit **[SemVer 2.0.0](https://semver.org/lang/fr/)** strict avec une politique de stabilité **renforcée** une fois v1.0 atteinte :

- **MAJOR** (`X.0.0`) : changement de format incompatible. **Interdit après v1.0** (cf. §3).
- **MINOR** (`0.X.0`) : ajouts rétrocompatibles : nouvelles annexes, nouvelles unités d'agrément, nouveaux ponts calendaires.
- **PATCH** (`0.0.X`) : corrections rédactionnelles, ajouts de vecteurs, clarifications.

## 2. Champ `spec_version` dans les vecteurs

Tous les fichiers `docs/spec/test-vectors*.json` portent désormais un champ racine :

```json
{
  "spec_version": "0.6",
  "...": "..."
}
```

Les consommateurs vérifient ce champ pour détecter contre quelle spec le jeu de vecteurs a été produit. La valeur suit le format `MAJOR.MINOR` (sans PATCH ; les patches ne touchent jamais aux vecteurs existants).

## 3. Engagements post-v1.0 (gelés)

Dès la publication de v1.0, **les éléments suivants sont définitivement gelés** :

1. **L'époque** : `1969-07-20T00:00:00Z` (début du jour de l'alunissage d'Apollo 11).
2. **Le format canonique** : `T+ Δ K.H.D.Kin.fffff` — sept positions, ordre, séparateurs, fenêtre `T+/T-`.
3. **Le format court** : `Δ K.H.D.Kin/cc` — règles de troncature au sol.
4. **Le tronquage** : `ROUND_FLOOR` strict (§6).
5. **L'algèbre §11.4** : signatures `Δ + Δd → Δ`, `Δ − Δ → Δd`, `Δd ± Δd → Δd`, `Δd × n / Δd ÷ n → Δd`, `−Δd`, `|Δd|`, comparaisons `< ≤ = ≥ >`.
6. **Le format binaire §12** : 64 bits big-endian, complément à deux sur le compteur de jours.
7. **Les 12 vecteurs core** : `docs/spec/test-vectors.json`. Aucun ne sera modifié ; uniquement ajouts.

**Une rupture sur l'un de ces points exige un nouveau projet (ATS 2) avec une nouvelle époque distincte.** La spec ATS 1.x ne deviendra jamais ATS 2.x.

## 4. Politique de vecteurs

- **Additifs uniquement.** Un vecteur publié n'est jamais retiré ni modifié.
- Un nouveau jeu de vecteurs (par exemple une nouvelle annexe calendaire) crée son propre fichier JSON avec un `spec_version` aligné sur la spec qui l'introduit.
- Les consommateurs MAY (recommandé : SHOULD) tester contre la totalité des vecteurs ; ils MUST tester contre ceux dont le `spec_version` est ≤ à celui qu'ils prétendent supporter.

## 5. Annexes non-normatives

Les **annexes non-normatives** (cf. `conventions.fr.md` §0) sont **explicitement exemptes** de ces engagements. Elles peuvent être ajoutées, modifiées, retirées entre deux versions mineures. Leur rôle est purement documentaire.

## 6. Processus de modification (RFC léger)

1. Ouverture d'une **GitHub Discussion** « RFC: <titre> » avec proposition complète.
2. **2 semaines minimum** de commentaires publics.
3. Si consensus, une PR matérialise les changements (manifeste + vecteurs si nécessaire).
4. La PR est revue par le **BDFL** (cf. `GOVERNANCE.md`) qui accepte ou rejette avec motif écrit.
5. Une fois mergée, la PR déclenche un bump de version sur le prochain release.

**Pas de RFC requis pour** : corrections typographiques, ajouts de vecteurs, traductions, ajouts d'annexes non-normatives, nouveaux ponts calendaires (ils sont par essence rétrocompatibles).

## 7. Migration v0.x → v1.0

La transition de v0.x à v1.0 n'introduira **aucun changement de format** par construction — toute la batterie de vecteurs v0.6 sera valide en v1.0. Les seules différences :
- Ajout des champs `spec_version` (déjà fait en v0.6).
- Ajout de l'annexe multi-planétaire (§3.1 de la roadmap, en cours).
- Ajout d'au moins une implémentation tierce certifiée (Rust ou Go).
- Publication des artefacts (npm, PyPI, GitHub Release signée).

## 8. Référence normative

En cas de désaccord entre cette spec et `manifesto.fr.md` ou la traduction anglaise (`versioning.en.md`), **le manifeste anglais (`manifesto.en.md`) prime**. Cette annexe n'introduit aucun mécanisme nouveau ; elle codifie uniquement les contraintes de stabilité.
