# Contributing to ATS

Welcome! ATS is a small, focused project — a specification of a decimal time system, two reference implementations (Python, JavaScript), and a static site. This document is a quick-start so you can land a useful first contribution in under 30 minutes.

If you have read this and something is still unclear, **that is a bug in this document** — open an issue or PR.

---

## TL;DR

```bash
git clone https://github.com/s-geffroy/ATS.git && cd ATS

# Run the full test suite (Docker, no install)
docker run --rm -v "$(pwd):/app" -w /app python:3.11-slim \
  python -m unittest discover tests

# Serve the site locally
docker run --rm -d --name ats-dev -p 8088:80 \
  -v "$(pwd)/docs:/usr/share/nginx/html:ro" nginx:alpine
# open http://localhost:8088/en/

# When you're done
docker stop ats-dev
```

If your change is a **typo fix, broken-link repair, translation, or new conformance vector that strictly conforms to the spec**, open a PR directly. If it modifies the spec (the manifesto sections 1–15, the canonical/short/binary formats, the §11.4 algebra, or the rounding policy), follow the **RFC procedure** — see §[5](#5-the-rfc-procedure-for-normative-changes) below.

---

## 1. Scope and welcome

ATS welcomes contributions in any of these areas:

- **Spec text** (`docs/spec/*.md`) — clarifications, translations, fixes to normative wording.
- **Reference implementations** (`code/ats.py`, `docs/assets/js/ats.js`) — bug fixes, performance, new conformance vectors.
- **Calendar bridges** (`code/bridges/`) — new calendar conversions that pass round-trip tests.
- **Site** (`docs/`) — pages, components, accessibility, internationalisation.
- **Tooling** (`.github/workflows/`, `scripts/`, `lighthouse/`) — CI improvements, build-time helpers.
- **Third-party implementations** in any language — see [`docs/en/code.html`](https://s-geffroy.github.io/ATS/en/code.html) and the conformance contract in [`docs/spec/manifesto.en.md §16.5`](docs/spec/manifesto.en.md).

Contributions can be issues, PRs, RFCs in GitHub Discussions, translations, or external implementations. No specific status is required — you are a contributor the moment you open an issue.

---

## 2. Where to start

- **First-time contributor:** look at [open issues labelled `good first issue`](https://github.com/s-geffroy/ATS/issues?q=is%3Aopen+label%3A%22good+first+issue%22). If none are open, the [ROADMAP.md](ROADMAP.md) "Vague 1" entries are short and self-contained.
- **Want to discuss an idea first:** open a [GitHub Discussion](https://github.com/s-geffroy/ATS/discussions). The `RFCs` category is for normative proposals; the `Ideas` category is for everything else.
- **Found a bug:** open an issue with a minimal reproduction (a Python snippet, a JS snippet, or a curl + URL).
- **Security issue:** do **NOT** open a public issue. Follow [`SECURITY.md`](SECURITY.md) — GitHub Security Advisories are the preferred channel.

---

## 3. Local setup (Docker only)

ATS uses **Docker exclusively** for local development. No `pip install -g`, no `npm install -g`. This keeps the contract identical across contributors and CI.

The only host requirements are `git` and a working Docker daemon.

```bash
# Clone
git clone https://github.com/s-geffroy/ATS.git
cd ATS

# Python — interactive REPL
docker run --rm -it -v "$(pwd):/app" -w /app python:3.11-slim python

# Node — interactive REPL
docker run --rm -it -v "$(pwd):/app" -w /app node:20-slim node

# Linter (Python — ruff)
docker run --rm -v "$(pwd):/app" -w /app python:3.11-slim \
  sh -c 'pip install -q ruff && ruff check code/ tests/'
```

---

## 4. Running the tests

Tests are the conformance contract. **Every PR must pass them.**

```bash
# Core conformance (12 core vectors + arithmetic + 5 bridges + 2 multi-planetary)
docker run --rm -v "$(pwd):/app" -w /app python:3.11-slim \
  python -m unittest discover tests

# JavaScript core
docker run --rm -v "$(pwd):/app" -w /app node:20-slim \
  node tests/test_vectors.mjs

# Property-based (Hypothesis, 1000+ instants)
docker run --rm -v "$(pwd):/app" -w /app python:3.11-slim \
  sh -c 'pip install -q hypothesis && python -m unittest tests.test_property'

# Performance bench (gregorian_to_ats median < 100 µs)
docker run --rm -v "$(pwd):/app" -w /app python:3.11-slim \
  python -m unittest tests.test_perf
```

All commands must exit 0. CI runs the same matrix on Python 3.9 / 3.11 / 3.13 × Node 20 / 22 — see `.github/workflows/ci.yml`.

If you change a conformance vector or add a new one, regenerate the affected `test-vectors-*.json` file deterministically (the test harness will tell you the exact byte diff to apply). See [`docs/spec/versioning.en.md §4`](docs/spec/versioning.en.md) for the vector-additivity policy.

---

## 5. The RFC procedure (for normative changes)

If your PR modifies any of the following, it requires an RFC **before** merge:

- `docs/spec/manifesto.{en,fr}.md` sections 1–15 (excluding §14, which is the list of annexes).
- The canonical / short / binary formats (manifesto §4, §5, §12).
- The §11.4 algebra.
- The rounding policy (manifesto §6).
- Any of the 12 core conformance vectors.

The full procedure is documented in [`docs/spec/versioning.en.md §6`](docs/spec/versioning.en.md). The short version:

1. **Open a GitHub Discussion** in the `RFCs` category titled `RFC: <topic>` with: problem statement, proposed change (concrete diff), alternatives considered, migration impact.
2. Wait **at least 14 days** of public comment.
3. The editor of record summarises consensus and writes a decision (accept / revise / reject) with rationale.
4. If accepted, the PR may proceed; the RFC is archived in [`docs/spec/rfcs/`](docs/spec/rfcs/) per [`GOVERNANCE.md §4`](GOVERNANCE.md).

**Editorial changes do NOT need an RFC** (cf. [`GOVERNANCE.md §3.1`](GOVERNANCE.md)): typo fixes, link repairs, translations, additional vectors strictly conforming to the existing spec, calendar bridges, dependency bumps, non-normative annex updates.

---

## 6. Code style

- **Python**: PEP 8, enforced with `ruff` (configuration in `pyproject.toml`). Run `ruff check code/ tests/` before committing.
- **JavaScript**: 2-space indent, single quotes, no semicolons-as-styles (the existing code uses semicolons; match that style). ESLint is planned for v1.0 but not yet wired into CI.
- **Imports**: standard library / third-party / local, separated by a blank line.
- **Tests**: every fix MUST come with a regression test that fails before the fix and passes after. The harness is `unittest` (Python) and node's built-in `node:test` (JavaScript).
- **No new runtime dependencies in core code** (`code/ats.py`, `docs/assets/js/ats.js`). Calendar bridges and tests MAY declare optional dependencies, but they MUST be opt-in via extras.

---

## 7. Translation contributions

The site and the spec are bilingual (EN / FR). **English is authoritative**; French is a translation (cf. [`docs/spec/versioning.en.md §0.3`](docs/spec/versioning.en.md)).

When you change a `*.en.md` or `*.html` file in `docs/en/`, the matching FR file MUST be updated in the same PR. Conversely, if you fix only the FR side (typo, phrasing), do not modify the EN file — file an issue describing the divergence if you suspect the EN text is wrong.

A new language (e.g. ES, DE) is welcomed via the same PR convention but should first be raised in a Discussion — the navigation chrome needs new strings (see [ROADMAP V1.0-E](ROADMAP.md)).

---

## 8. Commit messages

ATS follows a lightweight conventional-commits style:

```
<type>(<scope>): <short summary>

<optional body — explain the WHY, not the WHAT>

Co-Authored-By: <name> <email>
```

Types in use: `feat`, `fix`, `docs`, `spec`, `chore`, `refactor`, `test`. Scope is the area touched (`governance`, `security`, `embed`, `code`, `timeline`, `age`, `dials`, `lighthouse`, etc.).

CHANGELOG: **always update `CHANGELOG.md`** in the same PR. Documentation-only changes still get a `[Unreleased]` entry.

---

## 9. Cross-references

- [`GOVERNANCE.md`](GOVERNANCE.md) — editors of record, decision rule, accountability.
- [`SECURITY.md`](SECURITY.md) — vulnerability reporting, response cadence.
- [`docs/spec/versioning.en.md §6`](docs/spec/versioning.en.md) — full RFC procedure.
- [`docs/spec/manifesto.en.md §16`](docs/spec/manifesto.en.md) — standards process and governance overview.
- [`ROADMAP.md`](ROADMAP.md) — what is planned for v1.0 and beyond.

---

## 10. License

By contributing, you agree your contributions are licensed under MIT (for code) or CC-BY-4.0 (for documentation), per [`GOVERNANCE.md §8`](GOVERNANCE.md). There is no CLA.

Thank you for contributing. Δ
