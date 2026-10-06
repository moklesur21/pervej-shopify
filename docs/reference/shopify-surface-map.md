# Shopify surface map — where every ask lives

The lookup tables behind `docs/house-rules.md`, collected from the T-series. Where the Woo repo verified hook names against the installed source, here the source of truth is current Shopify documentation: anything marked **verify** drifts (plan gating, limits, API shapes, CLI flags) and is checked with the Shopify dev MCP on the day it matters. "Checked" dates say when this file last confirmed a fact.

## 1. The decision map [T0.2]

```
Client asks for X
├─ Storefront look or behaviour?         → THEME (Liquid + CSS + JS)                    T1–T3
├─ Merchant-editable content or data?    → SECTION SETTINGS · METAFIELDS · METAOBJECTS  T1.3, T1.5
├─ Discount / shipping / payment /
│  validation logic?                     → SHOPIFY FUNCTIONS                            T4.3
├─ Anything inside checkout UI?          → CHECKOUT UI EXTENSION (never theme code)     T4.2
├─ Analytics?                            → WEB PIXEL (official app first)               T5.1
├─ Sync, automation, external systems?   → Flow → Zapier/Make → APP: API + WEBHOOKS     T5.2, T5.3
└─ None of the above?                    → possibly not possible: check, then say so
```

## 2. Where logic lives [T5.2]

| Need | Home |
|---|---|
| Storefront behaviour | Theme |
| Checkout UI | Checkout UI extension (inside an extension-only app) |
| Pricing, eligibility, validation | Functions |
| Analytics | Web pixels |
| Store data in or out | Admin GraphQL API |
| Buying surfaces (headless, kiosks) | Storefront API |
| Events out | Webhooks + a reconciliation sweep |
| Automation | Flow → no-code → middleware |

## 3. Woo → Shopify, the concepts [T0.2, T1.x bridges]

| WooCommerce | Shopify | Where it breaks |
|---|---|---|
| LocalWP / MAMP site | Dev store in the cloud + CLI sync | There is no local Shopify |
| WP-CLI · PHPCS/WPCS | Shopify CLI · `shopify theme check` | — |
| `debug.log`, Query Monitor | Console, Network tab, `\| json`, Theme Check, Function run logs | No PHP, no server logs |
| Staging site with a DB copy | Unpublished theme on the same store | Only theme code stages |
| Child theme | Full theme copy (a fork) | Base updates are manual merges |
| `functions.php`, actions and filters | Surfaces above; Functions only at sanctioned sockets | No interception of page renders |
| Hooks (in-process, sync) | Webhooks (async, after the fact) | React, never intercept |
| `wp_posts` / `wp_postmeta`, `$wpdb` | Admin GraphQL API | No database access |
| Post meta / ACF | Metafields with definitions | Typed and validated |
| Custom post types | Metaobjects | No `meta_query` |
| Product → attributes → variations | Product → max 3 options → variants | The 3-option wall |
| Categories / tags | Manual and automated collections + tags | — |
| Plugin | App (external service + sanctioned surfaces) | Weight arrives as injected scripts |
| Customizer / ACF fields | Theme editor + `{% schema %}` | The editor writes your JSON files |
| `get_template_part()` | `{% render %}` | Isolated scope |
| `is_product()` etc. | `request.page_type` | One string |
| `apply_filters()` | Liquid filters | Transforms only — nothing hooks in |
| Prices as floats | Integer cents | `\| money` at output |
| WP users and roles | Customers and Staff, separate systems | B2B = companies, not roles |
| Cart fragments | Cart AJAX API + `sections` parameter | Ask per request |
| `WP_Query` | The query map (§6) | You render state, you don't compose queries |

## 4. Woo checkout habits → Shopify homes [T4.1]

| Woo habit | Shopify home | Notes |
|---|---|---|
| `woocommerce_checkout_fields` | UI extension field → attribute or note | Lands on the order automatically |
| `woocommerce_before/after_checkout_form`, `review_order` | Block targets placed in the checkout editor | Merchant positions them |
| `woocommerce_cart_calculate_fees` | **Gap** — discounts only go down | Say so in scoping |
| `woocommerce_available_payment_gateways` | Payment customization Function | |
| `woocommerce_package_rates` | Delivery customization Function | Hide / rename / reorder |
| `woocommerce_checkout_process` + `wc_add_notice` | Cart and checkout validation Function | Server-enforced |
| `woocommerce_thankyou` | Thank-you / order-status extension targets | All plans |
| Additional scripts on checkout | Web pixels | The script box is gone |
| Reorder checkout steps | **Wall** | |
| CSS overrides on checkout | Branding (editor for all; token API on Plus) | Extensions can't touch CSS |
| A payment gateway plugin | Payments Partner app business | Refer, don't absorb |

## 5. Function sockets [T4.3]

| Function API | Decides | Typical ask |
|---|---|---|
| Discount (product, order, shipping classes) | Automatic pricing | "10% off over $100", VIP %, volume tiers |
| Delivery customization | Hide / rename / reorder shipping options | "Hide express for PO boxes" |
| Payment customization | Hide / rename / reorder payment methods | "No COD under $50" |
| Cart and checkout validation | Block progress with a message | "Max 2 per customer", no preorder + in-stock mix |
| Cart transform | Merge / expand lines | Bundles as one line |

Plan gating per Function API: **verify** per client (T4.1 checkpoint).

## 6. The query map — what replaced `WP_Query` [T2.4]

| "I need products by…" | Tool |
|---|---|
| The current collection page | `collection.products` + `{% paginate %}` |
| User-chosen attributes, price, stock | Filters (Search & Discovery config + `collection.filters`) |
| A fixed set the merchant picks | `collection` / `product_list` section settings, or an automated collection |
| One or a few by handle | `all_products['handle']` · `collections['handle'].products` |
| Related / complementary | Recommendations endpoint (`intent=complementary`) |
| Typed search | `/search` + predictive (`/search/suggest`) |
| Structured custom data | Metafields / metaobjects |
| Anything else | The APIs — or "not on this platform" |

## 7. Platform facts that drift

Values as the T-series stated them (Sep 2026). **Verify** before a client decision depends on one.

| Fact | Value | Source |
|---|---|---|
| Options / variants per product | 3 options · 2,048 variants (since Oct 2025) | T0.2 |
| `all_products` handles per page | 20 | T2.4 |
| Collection loop without `paginate` | 50 | T2.4 |
| Metaobjects by handle per page | 20 | T1.5 |
| Metaobject `values` loop | 50 default · 250 paginated | T1.5 |
| Theme blocks per theme · nesting depth | 300 · 8 levels | T1.4 |
| Theme library (standard plans) | 20 themes | T7.1 |
| Core Web Vitals | LCP ≤ 2.5 s · CLS ≤ 0.1 · INP ≤ 200 ms | T3.1 |
| Field-data lag after a fix | up to ~28 days | T3.2 |
| `checkout.liquid` · Shopify Scripts | retired · off since June 2026 | T4.1 |
| Checkout UI extensions | Polaris web components; React ≤ API 2025-07 is legacy | T4.1, T4.2 |
| Info / shipping / payment-step extensions | Plus per the API reference, despite the Winter '26 expansion — **verify** | T4.1 |
| Native B2B on non-Plus | since April 2026: up to 3 catalogs via Markets | T6.1 |
| Admin API versions | quarterly, ~1 year support each | T5.2 |
| Webhook retries | ~2 days with backoff, then the subscription is at risk | T5.2 |
| UCP endpoint | `/.well-known/ucp`, MCP at `/api/ucp/mcp`; agent profile required | T6.2 |
| `agents.md` | canonical; `/llms.txt`, `/llms-full.txt` mirror; context = `request` + `agents` only | T6.2 |
| Shopify CLI | 4.x current; Node 22.12+ | T0.1 |
| Dawn | latest tag `v16.0.0` (checked 6 Oct 2026) — the T-series was written against 15.x | `git ls-remote` |
| Horizon | the house base for new builds (strategy v1.4); frequent updates that overwrite direct edits; no release tags — pin the commit SHA (checked 6 Oct 2026) | T1.6, `git ls-remote` |

## 8. CLI — the flags we rely on

Checked against shopify.dev on 6 Oct 2026.

| Command | Flags we use | Banned |
|---|---|---|
| `shopify theme push` | `--store` · `--path` · `--theme <id\|name>` · `--unpublished` · `--strict` (Theme Check must pass) · `--nodelete` · `--only` · `--ignore` · `--json` · `--password` (Theme Access) | `--allow-live` · `--publish` |
| `shopify theme pull` | `--theme` · `--live` · `--development` · `--only` | — |
| `shopify theme list` | `--store` · `--name` · `--role live\|unpublished\|development` · `--json` | — |
| `shopify theme delete` | `--store` · `--theme` · `--force` | never on a live theme |
| `shopify theme dev` | `--store` · `--path` · `--theme-editor-sync` (imperfect: prefer an explicit pull) | — |
| `shopify theme check` | `--path` | — |
| `shopify app` | `init` · `generate extension` · `dev` · `deploy` · `function run` | — |
| `shopify webhook trigger` | sample payloads to an endpoint | — |

`tools/shopify/theme.sh` wraps the theme commands for demos with these defaults built in.

## 9. Test payments [T0.2, T7.2]

Dev stores: the Bogus gateway (Settings → Payments) — card number `1` success · `2` declined · `3` gateway error; any name, expiry and CVV. Live client stores: never toggle Shopify Payments test mode without the agency's explicit go; propose a low-value order with a 100% discount code, tagged `test`, refunded.
