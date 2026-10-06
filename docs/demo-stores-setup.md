# Demo dev stores A and B — setup guide

How to create the two weekly-demo stores in the Partner organisation, give Asad access, and fill in each person's `tools/shopify/.env.local` until `tools/shopify/theme.sh doctor` shows every line `[ok]`. This expands `docs/demo-procedure.md` Stage 0 steps 2–3.

Shopify facts checked against shopify.dev and the Help Center on 2026-10-06. The Shopify docs MCP timed out that day, so the sources are listed at the end. If a screen doesn't match what's written here, follow the screen and note the difference.

**What changed since the handbook was written**

- Dev stores are now created in the **Dev Dashboard** (`dev.shopify.com/dashboard`). The old Partner Dashboard route (Stores → Add store → Create development store) may still work, but the Dev Dashboard is the documented path.
- Team members are managed under **Organization settings** using **roles** (Organization administrator, App developer, Store administrator, Collaborator access) and a store-access list. The old Partner "Team" page is gone.
- The house docs call it the **Bogus gateway**. The admin now lists it as **Test payment gateway**. The test cards are unchanged: `1` approved, `2` declined, `3` gateway failure.
- Dev stores can't be transferred to a client or turned into paid stores, and their password page can't be removed. That's fine for demos.

| Part | Who | Time |
|---|---|---|
| 1. Update the Shopify CLI | Yeasir, then Asad on his machine | 5 min |
| 2. Create stores A and B | Yeasir | 10 min |
| 3. Add Asad to the organisation | Yeasir, then Asad accepts | 5 min |
| 4. Check Asad's access | Asad, Yeasir watching | 5 min |
| 5. Configure each store | Each person on their own store | 15 min each |
| 6. Fill in `.env.local` | Each person on their own machine | 2 min |
| 7. Run doctor and the first store command | Each person | 5 min |

---

## 0. Decide before you click

1. **Who creates the stores.** Yeasir creates **both** A and B while signed in to the Partner organisation. The person who creates a dev store becomes its owner, so store B stays with the organisation if the arrangement changes (demo plan §6.2). Asad gets access to B as a staff member.
2. **Store names.** The name typed at creation becomes the permanent `<name>.myshopify.com` address. Suggested: `pervej-demo-a` and `pervej-demo-b`.
   - The display name is a separate setting (Part 5a). Shoppers see it in the header and the browser tab, so it shows up in recordings.
   - Give both stores the same **neutral, made-up shop name**. Captures from A and B then look alike, and nothing on screen points to us or to a real brand (house rules §15, video guideline "Clean").
3. **Plan.** Choose **Basic** for both. A demo should only use features a typical client store has. A brief that needs Plus (for example, checkout-step extensions) gets its own fresh dev store on Plus (workflow §8), not store A or B.

Note the handles and the shop name here once chosen (they aren't secret):

- Store A (Yeasir): `pervej-demo-a.myshopify.com`
- Store B (Asad): `________________.myshopify.com`
- Shop name, both stores: **Oak & Thread**

---

## 1. Update the Shopify CLI — Yeasir, then Asad

Doctor fails on CLI 3.x because `theme push --strict` doesn't exist there. Install 4.x from npm, not Homebrew: on macOS 14, `brew install`/`upgrade shopify-cli` builds its dependencies from source and can hang.

Yeasir's machine: done on 2026-10-06 (the Homebrew 3.53.0 copy removed, 4.8.4 installed from npm).

If your CLI came from Homebrew (`brew list shopify-cli` finds it), remove that copy first. npm can't replace Homebrew's `shopify` link, and two copies leave the wrong one on your PATH:

```bash
brew uninstall shopify-cli
```

Then install:

```bash
npm install -g @shopify/cli@latest
```

Open a new terminal, then check the version:

```bash
shopify version
```

It should print 4.x. Then check that the `--strict` flag exists:

```bash
shopify theme push --help | grep -- --strict
```

It should print one line describing `--strict`.

```bash
which -a shopify
```

This should show a single path.

Asad does the same on his machine (getting-started §1). He needs Node 22.19+ and CLI 4.x.

---

## 2. Create stores A and B — Yeasir

Repeat these steps once for A and once for B.

1. Sign in at **partners.shopify.com**. Use the organisation switcher to make sure you're in the **pervej Partner organisation**, not a personal one.
2. Open the **Dev Dashboard**: `https://dev.shopify.com/dashboard/`.
3. In the left sidebar, choose **Stores** → **Create store**, then choose **Dev** as the store type.
4. **Name:** the handle from Part 0 (`pervej-demo-a`, then `pervej-demo-b`).
5. **Plan:** **Basic**.
6. Tick **Generate test data for store**, so the store doesn't start empty. Leave **Test a feature preview** off.
7. Click **Create store**, then log in to the new store once. Write the exact `*.myshopify.com` address in Part 0.

**Command-line alternative** (needs CLI 4.x from Part 1). Run `shopify store create dev --help` first, because the docs disagree on the name of the test-data flag:

```bash
shopify store create dev --name pervej-demo-a --plan basic --demo-data
```

**Done when:** the Dev Dashboard's **Stores** list shows both stores under the Partner organisation, and you can open each one's admin.

---

## 3. Add Asad to the Partner organisation — Yeasir, then Asad

**Yeasir:**

1. Go to `partners.shopify.com/organizations` → **Organization settings** → **Add users**.
2. **Email:** Asad's email. Invitations and store notifications go to this address.
3. Under **Roles and groups**, click **+** to **Assign** roles. Give him only what the work needs:
   - **Store administrator**, with store access set to **specific stores → demo store B**. Don't choose **Assign all and future stores**: he pushes only to his own store, and store A is yours.
   - **App developer**, so he can create his own `asad-training` store for the T-series and run app work when a demo has `shopify-dev/<id>/app/`. According to the docs, this role gives no access to financials, production store data or user management. If the screen also asks for store access on this role, limit it the same way.
4. Click **Done**.
5. **Two-step authentication:** **Required**.
6. Click **Save**. Asad shows as **Pending** until he accepts. The invitation **expires after 7 days**; to resend one, remove him and add him again.

**Asad:**

1. In the invitation email, click **Accept invite**.
2. Sign in with your Shopify account. If you don't have one, create it with the same email, using your real first and last name.
3. Click the **pervej** organisation name to join.
4. Set up two-step authentication when asked.

---

## 4. Check Asad's access — Asad, Yeasir watching

Demo plan §6.2 requires this check after creation. Every item must pass.

- [ ] In **Organization settings**, Yeasir sees Asad as **Active** (not Pending), with the roles from Part 3.
- [ ] Asad opens the **Dev Dashboard** → **Stores** and sees demo store B. He can open its admin.
- [ ] Asad **can't** see financials or **Organization settings** → users.

The real test comes in Part 7. The CLI needs Asad to be the store's owner **or have a staff account on the store**. If his `theme.sh list` is refused, Yeasir adds him directly in store B's admin: **Settings → Users** → **Add users**, with his email and full access. Then he runs the command again.

---

## 5. Configure each store — Yeasir on A, Asad on B

Use the same checklist on both stores, so a demo set up on A reproduces on B. If Asad isn't in yet, Yeasir can do B as well.

Store A: done on 2026-10-06 (Yeasir), including a test order with card `1`.

**a. Display name.** In the admin, go to **Settings → General**. Under **Store contact details**, click the first row (it shows the current store name and the store email). Set the store name to the shop name from Part 0 and save. Both stores use the same name.

- There is no "Store details" section any more. The store name lives in that first contact-details row.
- Leave **Business details** ("<handle> - entity") as it is. That's the billing and tax entity, not the shop name, and it doesn't show on the storefront.

**b. Storefront password.** Go to **Online Store → Preferences → Password protection** and set a **Password**.

- Write it down, because it goes into `.env.local` in Part 6.
- On a dev store the password page can't be removed, and the visitor message can't be edited.
- Use a password used nowhere else. It ends up in a plain-text file on your machine.

**c. Test payment gateway** (the house docs call it the Bogus gateway):

1. Go to **Settings → Payments**.
2. If a credit card provider is already active, deactivate it:
   - For a third-party provider: **Manage → Deactivate**.
   - For Shopify Payments: **Manage → Manage payment methods → Switch to a third-party provider**, and confirm.
3. Click **Choose a provider** (or **See all other providers**).
4. Choose **Test payment gateway**, activate it, and click **Save**.

**d. Drawer cart.** Go to **Online Store → Themes**, then **Customize** on the current theme. Open **Theme settings** (the gear icon) → **Cart** → **Cart type: Drawer** → **Save**.

This changes only the store's own published theme. Every demo theme pushed from the repo carries its own `config/settings_data.json`.

**e. Smoke test.** This proves the store can take an order.

1. Open the storefront and enter the storefront password.
2. Add any product to the cart and go to checkout.
3. Pay with card number `1`, any name, any 3-digit CVV and any future expiry date.
4. In the admin, the order appears under **Orders**. Card `2` gives a declined payment and `3` a gateway failure, if you want to see them.

The shared baseline catalogue (Stage 0 step 5, `tools/shopify/baseline/`) is imported on both stores later, once that `chore/` branch has been merged. It isn't part of this guide.

---

## 6. Fill in `tools/shopify/.env.local` — each person, own machine, own store

From the repo root:

```bash
cp tools/shopify/.env.example tools/shopify/.env.local
```

Open `tools/shopify/.env.local` and set only these two lines. Leave everything else commented out.

```bash
SHOPIFY_STORE=pervej-demo-a.myshopify.com
SHOPIFY_STOREFRONT_PASSWORD=the-password-from-part-5b
```

Asad uses `pervej-demo-b.myshopify.com` and **his** store's password.

How the file is read:

- `SHOPIFY_STORE` is the `*.myshopify.com` address. Don't use the display name or an `admin.shopify.com/store/...` link: doctor would show `[ok]` for `admin.shopify.com`, but every theme command would then fail.
- The script reads each line literally and **doesn't support comments after a value**. `PASSWORD=abc # mine` stores `abc # mine` as the password. If the password has spaces or symbols, wrap it in quotes, `"..."` or `'...'`; the script strips them.
- Values already set in your shell environment override the file.

Confirm git ignores the file:

```bash
git check-ignore -v tools/shopify/.env.local
```

This must print a `.gitignore` rule. `git status` must not list the file. If it does, stop and don't commit.

---

## 7. Run doctor, then the first store command — each person

Run doctor:

```bash
tools/shopify/theme.sh doctor
```

Expected output, six lines, all `[ok]`:

```text
[ok] Node 23.9.0
[ok] Shopify CLI 4.8.4
[ok] Settings: tools/shopify/.env.local
[ok] Store pervej-demo-a.myshopify.com — HTTP 302
[ok] Storefront password set
[ok] git identity: Yeasir
```

- Your Node version will differ; anything from 22.12 up passes, and the video toolkit needs 22.19.
- The HTTP code can be any value. A dev store usually answers `302`, a redirect to its password page. Only `000` means the store isn't reachable.

**Doctor only checks settings.** It doesn't log in or prove you can push to the store. So run one store command next:

```bash
tools/shopify/theme.sh list
```

The first time, a browser opens for the CLI login (or log in first with `shopify auth login`). Sign in with the **Shopify account that belongs to the Partner organisation**. The command should list the store's themes; the store's own published theme shows as `live`. For Asad, this is the access check from Part 4.

---

## Sign-off

- [ ] Both stores in the Dev Dashboard under the Partner organisation, both created by Yeasir, both on Basic
- [ ] Both stores have the same neutral display name, a storefront password, Test payment gateway active and the drawer cart on
- [ ] A test order with card `1` on each store, visible in its admin under Orders
- [ ] Asad is Active in Organization settings, with access to store B only (plus App developer)
- [ ] On Yeasir's machine: doctor all `[ok]` and `theme.sh list` works against store A
- [ ] On Asad's machine: doctor all `[ok]` and `theme.sh list` works against store B
- [ ] `git status` is clean on both machines, with no `.env.local`, `shopify.theme.toml` or `.shopify/`

Then each person creates their own `<name>-training` store the same way as Part 2 (T-series labs only, never on a demo store), and Stage 0 moves on to step 4 (`chore/shopify-capture`).

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| Doctor: "has no push --strict" | The CLI is still 3.x. See Part 1. Run `which -a shopify` to find a second, older copy earlier on your PATH. |
| Doctor: "No tools/shopify/.env.local" | You're not at the repo root, or the file has a different name. See Part 6. |
| Doctor: `[warn] Store … not reachable` | There's a typo in `SHOPIFY_STORE`, or you're offline. Open `https://<store>.myshopify.com` in a browser. |
| Doctor: `[warn] SHOPIFY_STOREFRONT_PASSWORD not set` | The line is empty or still commented out. |
| `theme.sh list` signs in as the wrong account | Run `shopify auth logout`, then run `theme.sh list` again and pick the Partner-organisation account. |
| `theme.sh list` says you have no access to the store | You're not the owner and have no staff account on that store. See the end of Part 4. |
| Asad's invitation link has expired | After 7 days it stops working. Remove him in **Organization settings** and add him again. |
| No **Test payment gateway** under providers | A card provider is still active. Deactivate it first (Part 5c, step 2). |
| The preview or storefront shows the password page | That's expected on dev stores. Enter the password once in that browser. |

---

## Sources

- [Dev stores — shopify.dev](https://shopify.dev/docs/apps/build/stores/development-stores) (creation, plans, owner and staff, limits, CLI `store create dev`)
- [Development stores for themes — shopify.dev](https://shopify.dev/docs/storefronts/themes/tools/development-stores) (CLI needs owner or staff account; password at Online Store → Preferences)
- [`shopify store create dev` — CLI reference](https://shopify.dev/docs/api/shopify-cli/store/store-create-dev)
- [`shopify auth logout` — CLI reference](https://shopify.dev/docs/api/shopify-cli/general-commands/auth-logout)
- [Inviting users — Partner Help Center](https://help.shopify.com/en/partners/manage-account/manage-users/invite-users)
- [Dev Dashboard user permissions (system roles) — shopify.dev](https://shopify.dev/docs/apps/build/dev-dashboard/user-permissions)
- [Payments test mode / Test payment gateway — Help Center](https://help.shopify.com/en/manual/checkout-settings/test-orders/payments-test-mode)
- Horizon `config/settings_schema.json` (`main`): Theme settings → Cart → `cart_type` = `page` (default) | `drawer`
