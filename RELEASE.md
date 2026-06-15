# ATS — Release process

**Status:** Pre-release v0.7
**Document type:** Process — maintainer-facing.
**Authoritative language:** English.
**Cross-references:** `versioning.en.md §7.2 (4)`, `GOVERNANCE.md §1.2` (editor authority to cut a release), `SECURITY.md §8` (artefact verification).

This document is the operational manual for cutting an ATS release. It targets the **editor of record** (`GOVERNANCE.md §1.1`); reporters and contributors do not need to read it. End-users who want to *verify* a published release should read `SECURITY.md §8.1` instead.

---

## 0. The 30-second version

1. Bump the version in **three** files: `pyproject.toml`, `package.json`, `code/rust/ats/Cargo.toml`.
2. Bump `docs/sw.js` `CACHE_NAME` to match.
3. Open a `CHANGELOG.md` section for the new version (lift the relevant items from `[Unreleased]`).
4. Commit (`chore(release): vX.Y.Z`), tag with a **GPG-signed annotated tag**: `git tag -s vX.Y.Z -m "ATS vX.Y.Z"`.
5. Push the tag: `git push origin vX.Y.Z`. The `release.yml` workflow takes over.
6. Watch the run at <https://github.com/s-geffroy/ATS/actions/workflows/release.yml>. On success, the GitHub Release exists, PyPI/npm have published, and optionally crates.io.

If you have never published a release before, **read §3 first** for the one-time secrets / trusted-publisher setup.

---

## 1. Pre-flight checklist

Before tagging, **every** item below **MUST** be true:

| # | Item | How to verify |
|---|---|---|
| 1.1 | `pyproject.toml` `version` = `package.json` `version` = `code/rust/ats/Cargo.toml` `version` = `vX.Y.Z` | `grep -E '^version' pyproject.toml package.json code/rust/ats/Cargo.toml` |
| 1.2 | `docs/sw.js` `CACHE_NAME = "ats-vX.Y.Z"` | `grep CACHE_NAME docs/sw.js` |
| 1.3 | `CHANGELOG.md` has a `## [X.Y.Z] — YYYY-MM-DD` section above `[Unreleased]` | open the file |
| 1.4 | `main` CI is green | <https://github.com/s-geffroy/ATS/actions/workflows/ci.yml> |
| 1.5 | Working tree is clean | `git status` |
| 1.6 | Local conformance passes (Python + JS + Rust in Docker) | see `README.md §Conformance` |
| 1.7 | The signing key (§3.3) is available to your local `gpg` | `gpg --list-secret-keys` |

The `release.yml` `verify` job re-checks items 1.1, 1.2, and 1.6 on the CI side, so a missed local check fails fast at tag-push time rather than mid-publication.

---

## 2. The release sequence

### 2.1 Cut

```bash
# 1. Edit the four "where version lives" files.
$EDITOR pyproject.toml package.json code/rust/ats/Cargo.toml docs/sw.js

# 2. Promote Unreleased entries into a dated section in CHANGELOG.md.
$EDITOR CHANGELOG.md

# 3. Commit. Conventional commit, no co-author (this is a release act).
git add -p && git commit -m "chore(release): vX.Y.Z"
```

### 2.2 Sign-tag

The tag **MUST** be both **annotated** and **GPG-signed**:

```bash
git tag -s vX.Y.Z -m "ATS vX.Y.Z"
git tag -v vX.Y.Z          # local sanity check — must print "Good signature"
```

### 2.3 Push

```bash
git push origin main
git push origin vX.Y.Z     # this is the wake-up signal for release.yml
```

### 2.4 Watch

Open <https://github.com/s-geffroy/ATS/actions/workflows/release.yml> and confirm the run for `vX.Y.Z` completes cleanly. The jobs in order:

1. `verify` — version coherence + JS + Rust conformance.
2. `build-python` — sdist + wheel into `dist/`.
3. `build-npm` — `npm pack` into `dist-npm/`.
4. `sign` — `SHA256SUMS` + `SHA256SUMS.asc` (GPG detached, ASCII-armored).
5. `github-release` — `gh release create vX.Y.Z` with **all** artefacts attached (signed bundle).
6. `publish-pypi` — `pypa/gh-action-pypi-publish` via OIDC trusted publishing.
7. `publish-npm` — `npm publish --provenance --access public`.
8. `publish-crates` — optional, gated on `CARGO_REGISTRY_TOKEN`.

If any of 1–4 fails, **no publishing has happened** — fix and re-tag (`vX.Y.Z-rc1` or bump to `vX.Y.Z+1` per `versioning.en.md §1`). If 5 fails but 6/7/8 succeeded, you have a published package without a GitHub Release — go to §4.2.

### 2.5 Verify (post-publish)

```bash
# PyPI
pip download ats-time==X.Y.Z --no-deps
# npm
npm pack @s-geffroy/ats@X.Y.Z
# GitHub Release artefacts
gh release download vX.Y.Z
sha256sum -c SHA256SUMS
gpg --verify SHA256SUMS.asc SHA256SUMS
```

The `gpg --verify` line **MUST** print `Good signature from "Sylvain Geffroy <…>"` (or whoever is the active editor of record). If it does not, **DO NOT** announce the release — investigate per §4.

---

## 3. One-time setup (do this once, before the first release)

### 3.1 PyPI — trusted publishing (no token)

Modern PyPI supports **trusted publishing** via OIDC. The release workflow uses this; no API token is stored in GitHub Secrets.

1. Log into <https://pypi.org/manage/account/publishing/>.
2. Under **Add a new pending publisher** (for a project that does not exist on PyPI yet):
   - **PyPI Project Name:** `ats-time`
   - **Owner:** `s-geffroy`
   - **Repository name:** `ATS`
   - **Workflow name:** `release.yml`
   - **Environment name:** `pypi`
3. Save. The first release will create the project automatically.
4. After the first release, edit the publisher entry and confirm the project exists.

Reference: <https://docs.pypi.org/trusted-publishers/>

### 3.2 npm — `NPM_TOKEN` secret + provenance

1. Sign in at <https://www.npmjs.com/>.
2. Account → Access Tokens → Generate New Token → **Granular Access Token** (preferred) with:
   - **Permissions:** `Read and write` on `@s-geffroy/ats`.
   - **Expiration:** 1 year (renewal goes into your calendar).
3. Copy the token immediately (npm shows it once).
4. In the GitHub repo: Settings → Secrets and variables → Actions → New repository secret:
   - Name: `NPM_TOKEN`
   - Value: the token from step 3.

The workflow uses `npm publish --provenance`, which requires `id-token: write` (already set in `release.yml`) and produces a public provenance attestation linking the npm tarball back to the workflow run.

### 3.3 GPG — `GPG_PRIVATE_KEY` + `GPG_PASSPHRASE` secrets

The same key signs the git tag (`git tag -s`) and the `SHA256SUMS` artefact in the release workflow.

1. **Generate or pick a key.** If the editor of record does not yet have one:
   ```bash
   gpg --full-generate-key       # RSA 4096, 2-year expiry, real name + project email
   ```
2. **Get the key ID + fingerprint:**
   ```bash
   gpg --list-secret-keys --keyid-format LONG
   gpg --fingerprint <key-id>
   ```
3. **Publish the public key:**
   - Upload to a keyserver: `gpg --send-keys <key-id>` (default `hkps://keys.openpgp.org`).
   - Optionally publish on <https://keybase.io/>, GitHub profile, project site.
   - **Add the fingerprint to `SECURITY.md §8.1`** so users can verify releases.
4. **Export the secret key (armored):**
   ```bash
   gpg --armor --export-secret-keys <key-id> > /tmp/ats-signing.asc
   ```
5. **Add secrets** in GitHub repo → Settings → Secrets and variables → Actions:
   - `GPG_PRIVATE_KEY` = the full content of `/tmp/ats-signing.asc` (including `-----BEGIN PGP PRIVATE KEY BLOCK-----` and the trailing `-----END PGP PRIVATE KEY BLOCK-----`).
   - `GPG_PASSPHRASE` = the passphrase you set in step 1.
6. **Delete** `/tmp/ats-signing.asc` after saving the secret.

### 3.4 crates.io — `CARGO_REGISTRY_TOKEN` (optional)

Publishing `ats` to crates.io is **opt-in**. Without `CARGO_REGISTRY_TOKEN`, the `publish-crates` job logs a notice and exits.

1. Sign in at <https://crates.io/>.
2. Account Settings → API Tokens → New Token, scope `publish-update`, scope to the `ats` crate.
3. In the GitHub repo: Settings → Secrets → New: `CARGO_REGISTRY_TOKEN` = the token.

**One-time before the first publish**, the crate name `ats` may be unclaimed. Verify on <https://crates.io/crates/ats> first. If taken, change the crate name in `code/rust/ats/Cargo.toml` and ROADMAP.md before tagging.

### 3.5 GitHub Environment `pypi`

PyPI trusted publishing requires the `pypi` environment to exist on the GitHub repo.

1. Settings → Environments → New environment → name: `pypi`.
2. (Optional) Configure required reviewers if you want a manual approval gate before PyPI publishes.

---

## 4. Failure recovery

### 4.1 The `verify` job failed

A version mismatch between `pyproject.toml` / `package.json` / `Cargo.toml` / `sw.js` is the usual cause. The tag has been pushed but nothing has been published.

1. Fix the offending file on `main`.
2. Delete the local + remote tag:
   ```bash
   git tag -d vX.Y.Z
   git push origin :refs/tags/vX.Y.Z
   ```
3. Re-tag and push (§2.2 / §2.3).

### 4.2 GitHub Release failed but PyPI / npm published

This leaves users with a published package but no signed `SHA256SUMS` for verification — **not acceptable**.

1. Open <https://github.com/s-geffroy/ATS/releases/new?tag=vX.Y.Z>.
2. Manually download the artefacts from the failed workflow run (Actions → run → `signed-bundle` artifact).
3. Upload them and the `SHA256SUMS.asc` to the release.
4. Publish.

### 4.3 GPG signature failed

The `sign` step missed either `GPG_PRIVATE_KEY` or `GPG_PASSPHRASE`. Re-run the workflow from the failed step after adding the missing secret. If the failure is `passphrase incorrect`, rotate `GPG_PASSPHRASE` and re-run.

### 4.4 PyPI / npm published the wrong content

PyPI does not allow file replacement on an already-published version. You must:

1. **Yank** the broken version on PyPI (<https://pypi.org/manage/project/ats-time/release/X.Y.Z/>) — this keeps the file but signals consumers to upgrade.
2. Cut `vX.Y.Z+1` with the fix.

npm allows `npm unpublish` within 72 hours, but the better practice is to publish a patched `X.Y.(Z+1)` and let users `npm install` the fix.

---

## 5. Key rotation

### 5.1 GPG key rotation

When the editor's GPG key approaches expiry (or after a security incident):

1. Generate a new key per §3.3 step 1.
2. Sign the new public key with the old one (transition signature):
   ```bash
   gpg --default-key <old-key-id> --sign-key <new-key-id>
   ```
3. Publish both fingerprints in `SECURITY.md §8.1` (old + new, with a transition note).
4. Update `GPG_PRIVATE_KEY` + `GPG_PASSPHRASE` secrets per §3.3 step 5.
5. Cut a release with the new key. The release notes **MUST** mention the key rotation.

### 5.2 NPM_TOKEN rotation

1. Generate a new token per §3.2.
2. Update the `NPM_TOKEN` secret.
3. Revoke the old token at <https://www.npmjs.com/settings/s-geffroy/tokens>.

### 5.3 Steering committee handoff (post-v1.0)

Per `GOVERNANCE.md §2.2`, post-v1.0 the BDFL transitions to a steering committee of ≥ 3 editors. The release process changes:

- Each editor MAY hold an independent GPG key listed in `SECURITY.md §8.1`.
- The `GPG_PRIVATE_KEY` secret rotates to whichever editor is shepherding the release.
- `RELEASE.md §6` MAY be amended to require a co-signature from a second editor on the release commit before tagging.

This is out of scope for v1.0 itself; the BDFL handles all releases until the steering committee is seated.

---

## 6. Conventions

- **SemVer** per `versioning.en.md §1`. Pre-v1.0 the minor bump is a soft "we changed something interesting"; post-v1.0 the freeze (`versioning.en.md §3`) applies.
- **Tag style:** `vX.Y.Z` (lowercase `v`, three components, no `-rc` suffix in published tags — release candidates go to a separate workflow not described here).
- **CHANGELOG:** `[Unreleased]` always lives at the top; section headings are `## [X.Y.Z] — YYYY-MM-DD` per [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/).
- **Commit style:** the release commit is `chore(release): vX.Y.Z`; no Co-Authored-By trailer (this is a sovereign editorial act).
- **Tag message:** `ATS vX.Y.Z` — terse. Detailed notes live in `CHANGELOG.md` and the GitHub Release body.

---

## See also

- `versioning.en.md §7.2 (4)` — the requirement this process satisfies.
- `GOVERNANCE.md §1.2` — editor authority to cut a release.
- `SECURITY.md §8.1` — public-facing verification of released artefacts.
- `.github/workflows/release.yml` — the workflow this document orchestrates.
