# Pervej.com — Demo client fact sheets: w01, s01, w03, w05

**v1.0 · Wed 7 Oct 2026 · Owner: Yeasir**
**Internal — Yeasir and Claude in the project chat only.** Never in the demos repo. Never given to Claude Code or to whoever builds the demo.
**Reads with:** `pervej-demo-project-plan-v1.md` §4 · `pervej-demo-cycle-runbook-v1.md` §5 · the four brief files

---

## How this file is used

Claude plays the client. Each brief holds what a client would write. This file holds what the client knows but did not write, and what the client will check before accepting.

- **A fact is given only when the builder asks for it.** That is what makes the "questions asked before starting" slide honest.
- **Mid-build question:** paste it into the project chat. Claude answers as the client from this file. The question, the answer and both times go into the brief file in the repo.
- **A question this file does not cover:** Claude answers as that client would, and the answer is added here so it stays consistent.
- **Plan approval:** approve a plan that has tasks, hours and a delivery date inside the deadline. Push back once if it skips testing or ignores a rule in the brief.
- **Acceptance:** once. A missing before clip, an empty QA line or a handoff without a rollback note is not accepted. The client's own checks below are run before accepting.

---

---

## s01 · flooring-roll-calculator

**The client:** the owner of a home-gym equipment brand. Practical, knows the product, not technical.

### If asked

| About | The client says |
|---|---|
| A last roll shorter than 10 ft | "Take it off the roll before. 55 ft is a 45 and a 10, not a 50 and a 10. I never want a customer paying for feet they didn't ask for." |
| A room that needs less than 10 ft in total | "Then it's one 10 ft roll. That's the shortest we cut." |
| Order of the rolls in the cart | "Longest first." |
| Extra for waste | "Nothing automatic. Put a line under the result: 'Allow 5–10% extra for cuts around posts and corners.' I want to be able to change that text." |
| Units | "Feet only. Decimals are fine, like 12.5. No inches, no metric." |
| Length × width | "Just the area. It doesn't need to plan how the strips are laid." |
| The largest online order | "5,000 sq ft. Above that, show: 'For orders over 5,000 sq ft, call or e-mail us for a quote.' And add nothing." |
| Adhesive and tape | "Ticked by default. If the customer unticks one, it stays unticked when they change the size." |
| Not enough stock for one item | "Add nothing, and say which item is short." |
| The normal quantity box on flooring products | "The calculator replaces it. Nobody should be able to buy a single 5 ft length." |
| Changing a roll's quantity in the cart | "They can remove a roll, not change it. For a different size they go back to the calculator." |
| Choosing roll lengths by hand | "Not now. Maybe later." |
| Theme | "Dawn, the current version, with the cart drawer." |
| Where numbers are edited | "I edit products in the admin. Extra fields there are fine. I never touch theme code." |
| Returns | "Cut rolls can't come back." If a line near the button is suggested: "Yes: 'Cut to order. Not returnable.'" |
| Shipping | "By weight. It's already set on each unit." |
| Adhesive basis | "The area they are buying, not the area they typed." |
| Running the calculator twice | "Fine. The lines add up. No need to merge them." |

### The client's own checks at handoff

| Enters | Expects |
|---|---|
| 201 sq ft | 1 × 45 ft + 1 × 10 ft · 3 pails · 1 tape roll · $600.00 |
| 810 sq ft | 3 × 50 ft + 1 × 45 ft + 1 × 10 ft · 9 pails · 4 tape rolls · $2,160.00 |
| 20 sq ft | 1 × 10 ft · 1 pail · no tape · $122.00 |
| 480 sq ft, after changing the 8 mm black rate to 1.20 in the admin | 6 pails · $1,284.00 |
| 480 sq ft with adhesive and tape unticked | three flooring lines · $1,008.00 |
| 5,001 sq ft | the quote message, nothing added |
| "abc", blank, 0, −5 | a message, nothing added |
| A phone at 360 px | the result is readable and the button can be reached |
| The cart and the order | each roll line shows its cut length |
| A roll line in the cart | it can be removed; its quantity cannot be changed |
| The flooring product page | a single 5 ft length can no longer be bought on its own |

If 201 sq ft gives 50 ft + 10 ft, reject once: "That is 5 ft the customer didn't ask for."

---

## w03 · two-store-stock-sync

**The client:** an agency account manager speaking for the tea brand's operations lead.

### If asked

| About | The client says |
|---|---|
| Where the stock count is entered | "WooCommerce. The stock room uses its stock screen and counts every Friday. Nobody should edit stock in Shopify." |
| Someone edits stock in Shopify anyway | "Overwrite it the next time the two are compared, and show in the report that it happened." |
| How fast | "Within two minutes is fine." |
| Refunds | "Only a refund marked as returned to stock puts goods back. Damaged goods don't." |
| Cancellations | "They put the goods back." |
| Both sites sell the last unit at once | "We accept it can happen. Don't block the order. Show zero, never a minus number, remember that we are one short, and e-mail us at once so we can call the customer." No hold-back number for now. |
| SKUs that don't match | "List them. We'll fix them in Shopify ourselves. Don't guess." For reference: Earl Grey 100 g should be `TEA-EGR-100`, Sencha 50 g is missing its SKU, and the gift tin should be `TEA-CHG-250`. |
| Why never guess | "They tried a paid sync app last year. It matched by product title and got two wrong." |
| Paused | "Nothing is sent while it's paused. When it's switched back on, it catches up." |
| Who reads the log | "Me and their operations lead. Plain words, newest first, searchable by SKU." |
| Volume | "About 40 retail and 10 trade orders a day. Three times that in December." |
| Shopify set-up | "Basic plan, one location, no point of sale, no draft orders." |
| The sampler box | "Its own product with its own stock. Not a bundle." |
| Backorders | "Not allowed. Out of stock means out of stock on both." |
| New products | "Out of scope. They add them to both sites by hand with the same SKU." |
| Where alerts go | The operations address. Use a placeholder on the practice site. |

### The client's own checks at handoff

1. An order for 2 of a matched tea on Shopify: WooCommerce drops by 2 within two minutes, and the log shows it.
2. An order on WooCommerce: Shopify drops.
3. A cancelled Shopify order: both go back up.
4. The same event sent twice: one change.
5. Pause, place an order, switch back on: it catches up.
6. A stock count typed into WooCommerce: Shopify follows.
7. Stock changed by hand in Shopify: the report shows the difference, and the next comparison puts WooCommerce's number back.
8. The unmatched list has exactly three trade-site products: Earl Grey 100 g, Sencha 50 g and Masala chai 250 g. The gift tin appears as the reason beside Masala chai 250 g, not as a fourth entry.
9. The replay result sheet: 200 deliveries, all 22 matched products on the expected numbers, every failed update retried.
10. The last-unit case: no negative number on either site, the shortfall logged and e-mailed, and stock at 0 after one unit is returned.
11. Someone else can follow the setup steps, and the rollback note exists.

---
