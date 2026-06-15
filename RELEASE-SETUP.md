# ATS — Release setup walkthrough

**Status:** Pre-release v0.7
**Document type:** Process — maintainer-facing, **one-time setup**.
**Authoritative language:** EN authoritative, body in French (procédure opérationnelle).
**Cross-references:** [`RELEASE.md`](./RELEASE.md) (process de release récurrent), [`SECURITY.md §8.1`](./SECURITY.md#81-release-artefact-verification) (vérification publique des artefacts), [`versioning.en.md §7.2 (4)`](./docs/spec/versioning.en.md).

Marche à suivre concrète pour configurer **une fois pour toutes** les secrets et les *trusted publishers* nécessaires à `.github/workflows/release.yml`. À exécuter avant le premier `git push origin vX.Y.Z`. Compte environ **30 minutes** au total.

Cette doc est la version opérationnelle / pas-à-pas de [`RELEASE.md §3`](./RELEASE.md#3-one-time-setup-do-this-once-before-the-first-release) — pour la description normative (références, scopes, justifications), garder `RELEASE.md` comme source.

---

## 1) Générer la clé GPG (5 min)

GPG est un outil système (comme `git` ou `gh`) — l'installer via brew est OK même avec la règle Docker.

```bash
brew install gnupg               # si pas déjà installé
gpg --full-generate-key
```

Réponses recommandées :

- **Type** : `(1) RSA and RSA` (défaut)
- **Taille** : `4096`
- **Expiration** : `2y` (renouvellement régulier = bonne posture)
- **Nom** : `Sylvain Geffroy`
- **Email** : `sylvain.geffroy@gmail.com`
- **Commentaire** : `ATS editor of record (BDFL pre-v1.0)`
- **Passphrase** : forte, **notée dans un password manager** — elle sera collée dans un secret GitHub.

Récupère l'ID et l'empreinte :

```bash
gpg --list-secret-keys --keyid-format LONG
# Tu cherches une ligne comme :
#   sec   rsa4096/ABCDEF1234567890 2026-06-15 [SC] [expires: 2028-06-15]
#         FFFF AAAA BBBB CCCC DDDD  EEEE 1111 2222 3333 4444
#         ^^^^ c'est ton fingerprint (40 hex, espacé en 10 groupes de 4)
```

L'**ID court** (`ABCDEF1234567890`) sert aux commandes ci-dessous ; l'**empreinte complète** (40 hex sans espace) sera publiée dans [`SECURITY.md §8.1`](./SECURITY.md#81-release-artefact-verification) pour que les consommateurs puissent vérifier les artefacts.

## 2) Publier la clé publique (3 min)

Pour que `gpg --verify SHA256SUMS.asc SHA256SUMS` fonctionne chez les utilisateurs, la clé publique doit être trouvable au moins **2 endroits** (cross-publication, cf. `SECURITY.md §8.1`).

```bash
# Keyserver (canal canonique)
gpg --send-keys ABCDEF1234567890

# GitHub profile : Settings → SSH and GPG keys → New GPG key
gpg --armor --export ABCDEF1234567890 | pbcopy
# puis coller dans la zone GitHub

# (Optionnel) Keybase si tu en as un compte → https://keybase.io/sgeffroy
```

## 3) Exporter la clé privée pour GitHub Actions (1 min)

```bash
gpg --armor --export-secret-keys ABCDEF1234567890 > /tmp/ats-signing.asc
```

> ⚠️ Ce fichier est **secret**. Tu vas le copier dans GitHub puis le supprimer immédiatement (§4 dernière étape).

## 4) Ajouter les secrets GitHub (5 min)

Va sur <https://github.com/s-geffroy/ATS/settings/secrets/actions> et crée 3 (ou 4) **repository secrets** :

| Nom | Valeur | Comment l'obtenir |
|---|---|---|
| `GPG_PRIVATE_KEY` | contenu **complet** de `/tmp/ats-signing.asc` (avec les lignes `-----BEGIN/END PGP PRIVATE KEY BLOCK-----`) | `cat /tmp/ats-signing.asc \| pbcopy` |
| `GPG_PASSPHRASE` | la passphrase de l'étape 1 | password manager |
| `NPM_TOKEN` | token npm (voir §5 ci-dessous) | npmjs.com |
| `CARGO_REGISTRY_TOKEN` | (optionnel) token crates.io (voir §8) | crates.io |

Une fois `GPG_PRIVATE_KEY` collé dans GitHub :

```bash
rm /tmp/ats-signing.asc
```

## 5) Créer le token npm (3 min)

1. <https://www.npmjs.com/login> avec ton compte.
2. Avatar → **Access Tokens** → **Generate New Token** → **Granular Access Token**.
3. Réglages :
   - **Name** : `github-actions-ats-release`
   - **Expiration** : 1 an (note la date de renouvellement dans un calendrier)
   - **Packages and scopes** : Read and write, scope to `@s-geffroy/ats`
   - **Allowed IP ranges** : laisse vide (GitHub Actions n'a pas d'IP fixe)
4. **Generate** → copie le token immédiatement (il n'est montré qu'une seule fois).
5. Colle dans le secret GitHub `NPM_TOKEN` (§4).

## 6) PyPI trusted publishing — pending publisher (5 min)

Pas de token nécessaire grâce à l'OIDC. Configuration UI uniquement :

1. <https://pypi.org/login> ou créer un compte si nécessaire (email = `sylvain.geffroy@gmail.com` est cohérent avec `pyproject.toml`).
2. **Activer 2FA d'abord** — PyPI le requiert pour le trusted publishing.
3. <https://pypi.org/manage/account/publishing/> → **Add a new pending publisher**.
4. Champs exacts (**sensible à la casse**) :

| Champ | Valeur |
|---|---|
| **PyPI Project Name** | `ats-time` |
| **Owner** | `s-geffroy` |
| **Repository name** | `ATS` |
| **Workflow name** | `release.yml` |
| **Environment name** | `pypi` |

5. **Add**.

Le projet `ats-time` n'existe pas encore sur PyPI — c'est le mode « pending » qui le créera automatiquement au premier publish réussi. Documentation officielle : <https://docs.pypi.org/trusted-publishers/>.

## 7) Créer l'environnement GitHub `pypi` (1 min)

L'environnement est référencé par le job `publish-pypi` dans `release.yml` ; il **doit** exister côté GitHub pour que le trusted publisher OIDC fonctionne.

1. <https://github.com/s-geffroy/ATS/settings/environments>
2. **New environment** → nom : `pypi` (exactement) → **Configure**.
3. **(Optionnel mais recommandé)** coche **Required reviewers** et ajoute-toi → manuel-gate avant chaque publish PyPI. Tu cliques « Approve » dans Actions à chaque release. Désactive si trop de friction.
4. **Save protection rules**.

## 8) (Optionnel) Token crates.io (3 min)

Si tu ne configures pas ce secret, le job `publish-crates` du workflow loggue un `notice` et exit proprement — pas d'échec, pas de blocage.

1. <https://crates.io/login> via GitHub.
2. **Account Settings** → **API Tokens** → **New Token**.
3. **Name** : `github-actions-ats`, **Scopes** : `publish-update`, **Crates** : `ats` (si déjà claim — sinon laisser vide pour le premier publish).
4. Copie → secret GitHub `CARGO_REGISTRY_TOKEN` (§4).

> ⚠️ **Vérifier que le nom `ats` est libre** sur <https://crates.io/crates/ats> avant. S'il est pris, demander une renomination du crate (`ats-time` ou autre) avant le premier tag.

## 9) MAJ `SECURITY.md §8.1` avec l'empreinte (1 min)

Une fois la clé GPG créée, le placeholder dans [`SECURITY.md §8.1`](./SECURITY.md#81-release-artefact-verification) doit être remplacé par l'empreinte réelle (40 hex, format `FFFF AAAA BBBB CCCC DDDD EEEE 1111 2222 3333 4444`).

Édit direct :

```bash
$EDITOR SECURITY.md
# Remplacer la ligne :
#   > **Fingerprint:** _to be published when the first signed release ships..._
# par :
#   > **Fingerprint:** `FFFF AAAA BBBB CCCC DDDD EEEE 1111 2222 3333 4444`
git add SECURITY.md
git commit -m "docs(security): publish GPG fingerprint for release artefact verification"
git push
```

## 10) Smoke-test du workflow (2 min)

Avant le **vrai** tag, valide que tout marche sans rien publier :

```bash
# Depuis ta machine, dans le repo
gh workflow run release.yml -f dry_run=true

# Suivre l'exécution
gh run watch
```

Attendu :

- ✅ `verify` — versions × 4 cohérentes (`pyproject.toml`, `package.json`, `code/rust/ats/Cargo.toml`, `docs/sw.js CACHE_NAME`) + conformance JS + Rust.
- ✅ `build-python` — sdist + wheel produits.
- ✅ `build-npm` — tarball produit.
- ✅ `sign` — `SHA256SUMS` généré, signature **skippée** car dry-run.
- ⏭ `github-release`, `publish-pypi`, `publish-npm`, `publish-crates` — skippés (déclenchés uniquement par `push tags: v*`).

Si tout est vert, le pipeline est prêt. Pour le vrai cut, suivre [`RELEASE.md §2`](./RELEASE.md#2-the-release-sequence).

---

## Récap actions

| # | Action | Où | Statut |
|---|---|---|---|
| 1 | `brew install gnupg` + générer la clé (4096, 2 ans) | local | ☐ |
| 2 | `gpg --send-keys` + paste sur GitHub Profile | keyserver + github.com | ☐ |
| 3 | `gpg --armor --export-secret-keys` | local `/tmp` | ☐ |
| 4 | Secrets GitHub : `GPG_PRIVATE_KEY`, `GPG_PASSPHRASE`, `NPM_TOKEN`, (`CARGO_REGISTRY_TOKEN`) | github.com/.../settings/secrets | ☐ |
| 5 | Token npm Granular | npmjs.com | ☐ |
| 6 | PyPI pending publisher (`ats-time` × `s-geffroy/ATS` × `release.yml` × `pypi`) | pypi.org/manage/account/publishing | ☐ |
| 7 | GitHub Environment `pypi` | github.com/.../settings/environments | ☐ |
| 8 | (Optionnel) Token crates.io | crates.io | ☐ |
| 9 | MAJ `SECURITY.md §8.1` avec empreinte réelle | local + commit | ☐ |
| 10 | `gh workflow run release.yml -f dry_run=true` | local | ☐ |

Une fois la checklist verte, le premier vrai cut est : éditer les 4 versions → bumper `CACHE_NAME` → mettre à jour CHANGELOG → `git commit -m "chore(release): vX.Y.Z"` → `git tag -s vX.Y.Z` → `git push origin main vX.Y.Z`. Le workflow se déclenche, ferme `versioning.en.md §7.2 (4)`, et publie partout.

---

## See also

- [`RELEASE.md`](./RELEASE.md) — process complet récurrent (§2 sequence, §4 failure recovery, §5 key rotation).
- [`SECURITY.md §8.1`](./SECURITY.md#81-release-artefact-verification) — vérification publique des artefacts par les consommateurs.
- [`.github/workflows/release.yml`](./.github/workflows/release.yml) — le workflow orchestré.
- [`versioning.en.md §7.2 (4)`](./docs/spec/versioning.en.md) — l'exigence v1.0 que ce setup ferme.
