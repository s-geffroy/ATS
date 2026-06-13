# Conventions ATS — annexe non-normative

> **Annexe non-normative.** Les éléments décrits ici ne sont **pas exigés** par la spec Δ ATS. Une implémentation conforme à `manifesto.fr.md` peut les ignorer entièrement. Ils sont présents pour documenter des **conventions sociales** observées, recommandées ou expérimentales — utiles pour l'adoption, mais hors du contrat de conformité.

**Statut :** v0.6+
**Symbole :** Δ
**Référence normative :** `manifesto.fr.md`

---

## 1. Cycles de fête

### 1.1 Kilo-versaire (Δ K.0.0.0)

Un **Kilo-versaire** marque le passage d'un Kilo entier — soit 1 000 jours depuis l'époque d'un compteur (instant ATS), soit 1 000 jours depuis un instant personnel (date de naissance, fondation d'organisation, début de projet).

- Le 1ᵉʳ Kilo-versaire de l'humanité moderne (ancrage Apollo 11) : **Δ 1.0.0.0 = 1972-04-15** (UTC). Voir frise chronologique.
- Le n-ième Kilo-versaire individuel : ajouter `n × Δd 1.0.0.0` à la date de référence.
- **Forme courte :** `Δ K!` (par exemple `Δ 22!` pour le 22ᵉ Kilo-versaire).

### 1.2 Hecto-fête (Δ K.H.0.0)

Un **Hecto-fête** marque le passage d'un Hecto (100 jours). Plus fréquent qu'un Kilo-versaire (~3,3 par an grégorien), proposé comme rythme **trimestriel décimal** sans dépendance aux saisons astronomiques.

- Pour la civilisation : Hecto-fête `Δ 0.1.0.0` = **1969-10-28** UTC.
- Pour un compteur personnel : `Δ k.h.0.0` est un Hecto-fête (h ≠ 0) ou un Kilo-versaire (h = 0).

### 1.3 Deka-jour (Δ K.H.D.0)

Optionnel — un **Deka-jour** (10 jours) peut servir de cycle « décade » à mi-chemin entre la semaine et le mois. Suggéré dans les contextes où le rythme 7+3 (§2) est utilisé.

---

## 2. Rythme 7+3 sur la Deka

Une **Deka** vaut 10 jours. Le rythme **7+3** est une convention sociale optionnelle qui découpe une Deka en :

- **7 jours actifs** (travail, école, engagement).
- **3 jours de repos** (récupération, famille, projets personnels).

| Position dans la Deka | Position | Rôle proposé |
|---|---|---|
| 1, 2, 3, 4, 5, 6, 7 | Active phase | Travail, école, projets |
| 8, 9, 0 | Rest phase | Récupération, social, personnel |

Comparé à la semaine grégorienne (5 + 2), le 7+3 conserve un ratio proche (70 % actif vs 71 %) tout en s'alignant naturellement sur l'horloge décimale : un Hecto = 10 Dekas = 10 cycles complets.

**Cette convention n'est pas exigée.** Une implémentation conforme peut traduire les durées ATS dans n'importe quel rythme local (Sabbat hebdomadaire, vendredi-dimanche, cycle de marché 10 jours, etc.).

---

## 3. Bandes solaires locales (08–22)

L'horloge analogique du site (cf. `analog-clock.fr.md`) dessine pour chaque ville un **arc** correspondant à sa journée active locale 08:00 → 22:00. Cette annexe formalise cette convention sociale :

| Tronçon | Heure locale | Étiquette | Style de l'arc |
|---|---|---|---|
| Matin | 08:00–12:00 | `matin` | trait hachuré |
| Midi | 12:00–14:00 | `midi` | trait plein |
| Après-midi | 14:00–18:00 | `apres-midi` | pointillé |
| Soir | 18:00–22:00 | `soir` | tiret-point |

**Pourquoi 08–22 ?** Compromis empirique entre :

- les définitions OMS du sommeil sain (7–9 h adulte, recommandé 22:00–07:00),
- les heures d'ouverture commerciales standard (08:00–22:00 en Europe / Amérique),
- la fourchette des correspondances scolaires (08:00–18:00).

**Cette convention n'est pas exigée par la spec.** Elle ne sert qu'à représenter visuellement la « journée active » par fuseau sur l'horloge analogique. Une implémentation peut choisir d'autres bornes (06–20, 09–23, etc.) — il est recommandé alors de le documenter dans l'attribut `aria-describedby` du SVG.

---

## 4. Compteurs personnels

Tout instant ATS personnel (`Δ_self`) peut être utilisé comme nouvelle époque locale pour calculer un compteur **égocentré** :

```
Δd_age = Δ_now − Δ_self
```

Exemples :

- « J'ai vécu Δd 18.5.4.2.50000 » = un instant personnel rapporté à sa propre naissance.
- « Ce projet a Δd 0.2.4.7.00000 » = 247 jours depuis le lancement.

Le calculateur « Mon âge » du site (`age.html`) implémente cette convention en exportant des Kilo-versaires et Hecto-fêtes au format `.ics`.

---

## 5. Pour le rituel

Quelques propositions de jalons remarquables, sans valeur normative :

- **Δ 100** (Hecto-fête originelle, 1969-10-28) — anniversaire de l'humanité « lunaire ».
- **Δ 1000** (Kilo-versaire 1, 1972-04-15) — premier millénaire post-alunissage.
- **Δ 10000** (Δ 10.0.0.0, 1996-12-04) — première dizaine de Kilos.
- **Δ 20000** (Δ 20.0.0.0, 2024-04-23) — vingtième Kilo, génération ATS.
- **Δ 50000** (Δ 50.0.0.0, 2106-08-22) — première moitié de centi-Kilo.

Implémentations libres de calculer leurs propres jalons via §11.4 (algèbre Δ/Δd).
