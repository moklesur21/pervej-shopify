# Brief — s01 · flooring-roll-calculator

**Type T1 · Custom commerce logic · Shopify (Dawn)**
**Issued:** ______________ (Dhaka) ← T0. Write the time when this brief is handed over. The clock starts here.
**Client:** the owner of a US home-gym equipment brand that sells on Shopify
**Practice build from a public job brief. Anonymised.**

---

## 1. Client brief

### The ask, in the client's words

"We added rubber flooring rolls this year. They are cut to order, so every sale starts with a customer e-mailing to ask how many rolls they need, and half of them forget the adhesive. I want a calculator on the product page. The customer types the size of the room, sees exactly which rolls and extras they need, and adds the lot to the cart in one click. And I need to be able to change the numbers myself when a supplier changes a spec."

**Problem line for the video and the post:** Every flooring sale starts with an e-mail asking how many rolls to buy.

### What we know

- An existing Shopify store on the Dawn theme. No Shopify Plus. No paid apps for this.
- Three flooring products and two accessories, in the data sheet below. Flooring is already sold in units of 5 linear feet.
- The warehouse cuts each roll from the order, so the order has to show every roll's length.

### The client's data sheet

| Product | SKU | Price per sq ft | Unit sold today | Adhesive rate |
|---|---|---|---|---|
| Rubber roll 8 mm, black | `RR-8-BLK` | $2.10 | 5 ft length (20 sq ft): $42.00 | 1.00 gallon per 100 sq ft |
| Rubber roll 8 mm, blue fleck | `RR-8-FLK` | $2.45 | 5 ft length (20 sq ft): $49.00 | 1.00 gallon per 100 sq ft |
| Rubber roll 12 mm, black | `RR-12-BLK` | $3.20 | 5 ft length (20 sq ft): $64.00 | 1.25 gallons per 100 sq ft |
| Flooring adhesive, 1-gallon pail | `ADH-1G` | — | $38.00 | — |
| Seam tape, 50 ft roll | `TAPE-50` | — | $24.00 | — |

Roll facts, the same for all three today: 4 ft wide · cut in 5 ft steps · shortest cut 10 ft · longest roll 50 ft.

### The rules, as the client gave them

1. The customer gives the room's length and width in feet, or its area in square feet.
2. Feet of flooring = area ÷ roll width, rounded up to the next 5 ft.
3. That length is supplied as rolls of up to 50 ft: as few rolls as possible, full 50 ft rolls first. No roll is ever shorter than 10 ft.
4. Adhesive is worked out from the area of flooring bought, at that product's rate, in whole pails.
5. Seam tape is added when there are two or more rolls. Feet of tape = total feet of flooring minus the longest roll, in whole 50 ft rolls.
6. Adhesive and tape are ticked by default. The customer can untick them.
7. One click adds everything. Each roll is its own line in the cart, with its cut length on it.

### The client's worked examples

8 mm black unless the row says otherwise.

| # | Customer enters | Rolls | Adhesive pails | Tape rolls | Order total |
|---|---|---|---|---|---|
| 1 | 160 sq ft | 1 × 40 ft | 2 | 0 | $412.00 |
| 2 | 20 ft × 24 ft | 2 × 50 ft + 1 × 20 ft | 5 | 2 | $1,246.00 |
| 3 | 400 sq ft | 2 × 50 ft | 4 | 1 | $1,016.00 |
| 4 | 200 sq ft | 1 × 50 ft | 2 | 0 | $496.00 |
| 5 | 30 sq ft | 1 × 10 ft | 1 | 0 | $122.00 |
| 6 | 480 sq ft, 12 mm black | 2 × 50 ft + 1 × 20 ft | 6 | 2 | $1,812.00 |
| 7 | 12.5 ft × 16 ft | 1 × 50 ft | 2 | 0 | $496.00 |
| 8 | 1,000 sq ft | 5 × 50 ft | 10 | 4 | $2,576.00 |

"I will also try some numbers of my own before I accept."

### Done, from the client's side

1. The eight examples put exactly these lines and totals in the cart.
2. Two real test orders complete through checkout (examples 2 and 8), and each order shows every roll's cut length.
3. I change one product's adhesive rate in the Shopify admin and the result changes, with no code edit.
4. Wrong input (blank, zero, a negative number, letters) adds nothing to the cart and says why.
5. It works on a phone at 360, 390 and 768 px and on desktop.
6. Apart from what the calculator needs, nothing in the theme changes. Theme Check is clean and there are no console errors.
7. Speed: Lighthouse mobile performance on the product page stays within 2 points of the figure measured before the build. Three runs each time, middle value.

### Out of scope

Choosing roll lengths by hand, planning how the strips are laid, shipping rates.

### Constraints

- **Deadline:** end of day, two days after issue. Date: ______________
- **Budget:** up to 8 hours. If the hours will not be enough, say so before cutting anything.
- Dev store only, on a copy of the theme. Never the published theme.
- No paid apps. Checkout stays as Shopify provides it. Theme code only.

### Deliverables

Theme preview link · handover note, including where each number is edited · rollback note · one thing to flag to the client · the 2-minute handoff walkthrough

---

## 2. Mini approach

- Keep price and stock native. The flooring stays a normal product sold in 5 ft units; the calculator only decides how many units go on which line.
- One cart line per roll, carrying its cut length and its roll number as line item properties. Without the number, two rolls of the same length merge into one line.
- Every number the owner might change lives in product metafields or theme settings: roll width, cut step, shortest and longest roll, adhesive rate, which products are the adhesive and the tape, and their pack sizes.
- Do the maths in whole units, never in floating point, so that 200 sq ft is one 50 ft roll and not 55 ft.
- Turn the examples table into an automated check first. Build the interface second.
- Add everything in one cart request, and decide what happens when one item is short on stock.

---

## 3. Shoot list

1. **Before.** The product page as it is today: a price for a 5 ft length and a quantity box, and the customer has to work the rest out. Frame the buy area.
2. **The plan.** The questions asked and the plan, from the Q&A and `plan.md`.
3. **The hardest part solved.** 20 ft × 24 ft typed in. The result shows 2 × 50 ft + 1 × 20 ft, 5 pails and 2 tape rolls. One click, then the cart with its five lines. Same framing as the before clip.
4. **QA passing.** The examples table passing, one test order through checkout, the phone widths, and the adhesive rate edited in the admin with the result changing.
5. **Handoff.** What the client receives, and the flag.

---

## Starting state

Built off the clock, on a dev store:

- A fresh copy of Dawn, unpublished.
- The five products exactly as in the data sheet. Each flooring product is sold as a 5 ft unit, with stock tracked at 500 units. Adhesive and tape have 100 in stock each.
- Each flooring description ends: "Sold in 5 ft lengths. Not sure how much you need? E-mail us."
- No calculator.

**Check:** the 8 mm black product page shows $42.00 and a quantity box, and nothing that works out rolls.

---

## Before you start

Off the clock: branch `s01-flooring-roll-calculator` from `main`, build the starting state, run the check, record the before clip and the before speed figure, and commit. Then log "brief received" with the real time. Ask your questions before planning. Nothing starts until the plan is approved.
