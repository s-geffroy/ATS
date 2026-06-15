# ATS — Rust reference implementation

Third reference implementation of the Apollonian Time System, alongside Python
(`code/ats.py`) and JavaScript (`docs/assets/js/ats.js`). Targets
`spec_version = 0.7`. Closes `versioning.en.md §7.2 (3)` and `ROADMAP §V1.0-B`.

## Layout

```
code/rust/
├── Cargo.toml      # workspace
├── README.md       # this file
└── ats/            # publishable crate `ats` (crates.io target)
    ├── Cargo.toml
    ├── src/
    │   ├── lib.rs        # constants + re-exports
    │   ├── datetime.rs   # ATSDateTime + Add/Sub/Ord
    │   ├── duration.rs   # ATSDuration + Δd algebra (Add/Sub/Mul/Div/Neg)
    │   ├── convert.rs    # gregorian_to_ats / ats_to_gregorian
    │   ├── parser.rs     # FromStr canonical + parse_short(allow_short) + parse_duration_canonical
    │   ├── format.rs     # Display + to_short
    │   ├── places.rs     # pub(crate) split_abs_days_floor + integer_days_to_places
    │   └── error.rs
    └── tests/
        └── conformance.rs    # 24 bit-identical vectors + schema sanity for the 7 other JSONs
```

## Conformance (Docker — zero install)

```
docker run --rm -v "$(pwd):/app" -w /app/code/rust rust:1.88-slim cargo test --release
```

Expected:

- **`core_vectors_bit_identical`** — 12 instants from `docs/spec/test-vectors.json` round-trip bit-identically.
- **`arithmetic_vectors_bit_identical`** — 12 §11.4 algebra operations match canonical output.
- **`spec_version_check`** — every JSON file declares `spec_version ≥ 0.6`.
- **`short_form_strict`** — legacy `/cc` short form rejected; `allow_short=false` rejects valid short form.
- **`bridges_vectors_loaded` + `multi_planetary_vectors_loaded`** — `#[ignore]` markers (out of v1.0-B scope, schema-stable load only).

Lint:

```
docker run --rm -v "$(pwd):/app" -w /app/code/rust rust:1.88-slim cargo clippy --all-targets -- -D warnings
```

## Status

| Surface | Status |
|---|---|
| Core (`gregorian ↔ ATS`, Δ + Δd arithmetic, canonical/short parser) | ✅ v0.7 |
| Bridges (Hebrew, Islamic, Chinese, Hindu, Maya) | ⬜ post-v1.0 |
| Multi-planetary (Mars, Moon) | ⬜ post-v1.0 (see RFC-0001) |
| `no_std` support | ⬜ post-v1.0 |
| `crates.io` publication | ⬜ — gated on `versioning.en.md §7.2 (4)` |

## Design notes

- **Decimal:** `rust_decimal` (28 significant digits). `Decimal::floor()` rounds toward −∞; we only floor non-negative operands (the impl takes `abs_days` first), so the semantics match Python `ROUND_FLOOR` exactly.
- **Datetime:** `time` 0.3 (no `chrono`; no_std-friendly long-term).
- **Precision pivot:** integer microseconds since `ATS_EPOCH`, then one Decimal division by `86_400_000_000`. This mirrors `_timedelta_to_decimal_days` in `code/ats.py` so the test vectors validate byte-for-byte.
- **Regex strict:** `^…$` anchored, ASCII `[0-9]` only (not `\d`, to avoid Unicode digit drift across ecosystems).
- **Short-form contract:** parser refuses the legacy `Δ K.H.D.Kin/cc` form per spec §5, and returns `ATSError::ShortFormNotAllowed` unless the caller passes `allow_short = true` (mirrors Python's `ats_to_gregorian(allow_short=True)`).

## See also

- `docs/spec/manifesto.en.md` — normative spec.
- `docs/spec/rfcs/0001-multi-planetary-normative.md` — RFC promoting the multi-planetary annex; this crate covers Earth-anchored Δ only for v1.0-B.
- `code/ats.py` — Python reference impl (line-for-line model for this port).
- `tests/test_vectors.{py,mjs}` — sibling Python/JS conformance runners.
