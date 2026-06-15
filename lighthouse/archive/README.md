# Lighthouse — baselines archivées

Mesures Lighthouse historiques, conservées pour référence mais hors du jeu CI actif (`fr/index`, `fr/manifeste`, `en/embed`, `fr/age`).

| Fichier | Page | Contexte |
|---|---|---|
| `v0.7-blindage-embed-en.json` | `en/embed.html` | Blindage v0.7 — vérification post-blindage embed iframe |
| `v0.7-blindage-en_code-html.json` | `en/code.html` | Blindage v0.7 — page `code` (snippets, exemples API) |
| `v0.7-blindage-en_timeline-html.json` | `en/timeline.html` | Blindage v0.7 — frise chronologique |

Ne sont pas re-générés à chaque PR. Re-produire avec `lighthouse/run-lighthouse.sh` si besoin (ajouter ces pages temporairement aux `PAGES=`).
