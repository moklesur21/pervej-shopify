# shopify-dev/ — the code of every demo

Everything we author for a demo lives in **one folder named by its ID**, so two demos never touch the same file. The paperwork for the same demo lives in `demos/<id>/`.

```
shopify-dev/<id>/
  theme/        the demo's theme: a full Horizon copy (new builds) or Dawn copy (a Dawn-based
                client store) from tools/shopify/theme.sh new,
                committed untouched first, then the planted "before", then our work
  app/          only when the brief needs one: an extension-only app carrying checkout UI
                extensions, Functions or an app pixel (T4.2, T4.3, T5.1)
  middleware/   only when the brief needs one: a small service for webhooks (T5.2)
  pixel/        only for a custom pixel: the JS pasted into Settings → Customer events (T5.1)
  data/         only when the demo changes store data: reviewed GraphQL mutations or the
                metafield/metaobject definitions it needs (T1.5, T6.2)
```

## Rules

- **Full theme copy per demo.** Git stores identical files once, so thirty copies of a base theme cost about one (demo plan §5). The commit order is fixed: `sNN: baseline — Horizon main (sha), untouched` → `sNN: setup — …` (the planted before state, off the clock) → the build stages. `tools/shopify/theme.sh diff <id>` reviews from the setup commit, so the base theme never clutters a review.
- **Our code in our own files.** New sections, snippets, blocks and assets over edits to the base theme's files; a core edit is minimal and called out in the spec (T0.3, T1.6). Horizon is the base for new builds (strategy v1.4): our work goes in our own theme blocks and never edits Horizon's files, because its frequent updates overwrite direct customisations. On a Dawn-based store, match that architecture — section blocks — instead; never both block kinds in one section (T1.4, T1.6).
- **Strings** in `locales/en.default.json`, setting labels in `locales/en.default.schema.json` — no hardcoded storefront text (strategy §8.3).
- **Theme Check clean** before every commit that touches the theme: `tools/shopify/theme.sh check <id>`.
- **Nothing per-developer is committed:** no `shopify.theme.toml`, no `.shopify/`, no `.env*`, no tokens. The store comes from each person's `tools/shopify/.env.local`.
- **Store data is not in git.** Products, metafield definitions, discounts and app installs live on a person's dev store. If a demo creates any, `demos/<id>/setup/README.md` lists them and how to remove them at the Stage 6 reset; a demo that needs a lot of store data gets a fresh dev store.
- Merged demos stay here — this folder is the kit library (cart drawer, filters, speed recipes…). Only the current demo's themes sit on your store.
