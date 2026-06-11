# GTM / GA4 / Google Ads — setup checklist

This site sends conversion and engagement events to **Google Tag Manager** via `dataLayer`. GTM routes them to **GA4** and **Google Ads**. No GA4 or Ads IDs are hardcoded in the repo — everything is configured in the Google UIs.

**GTM container:** `GTM-M732SMQL`  
**GA4 Measurement ID (configure in GTM only):** `G-E10LNZV0VS`  
**Consent:** Cookiebot + Google Consent Mode v2 (loads before GTM in `index.html`)  
**Code:** event pushes live in `main.js` (merged via [PR #11](https://github.com/tasnadimark/website-testing/pull/11))

---

## Architecture

```
Contact form submit  ──► contact_form_submit  ──┐
Cal.com booking      ──► book_call_success     ──┼──► dataLayer ──► GTM ──► GA4 key events
mailto / tel click   ──► contact_click          ──┤              └──► Google Ads conversions
Book-audit CTA click ──► cta_click             ──┘
                              ▲
                    Cookiebot Consent Mode v2 gates tags until user accepts
```

---

## dataLayer events (reference)

### Primary conversions (use for bidding)

| Event | When it fires | Payload |
|-------|---------------|---------|
| `contact_form_submit` | Contact form successfully posts to Google Forms | `form_location`, `user_data.email`, `user_data.name` |
| `book_call_success` | Cal.com embed fires `bookingSuccessfulV2` after a booking | `booking_uid`, `booking_title`, `event_type_id`, `booking_status` |

**Note:** The form does **not** redirect to a thank-you URL — success is shown inline. Do **not** use URL-based conversion tracking in Google Ads for form submits.

**Note:** Cal.com booking does not expose attendee email in the embed payload, so the booking conversion uses click/cookie matching (not Enhanced Conversions). The form conversion **does** support Enhanced Conversions via `user_data.email`.

### Secondary engagement (observe only — do not optimize bidding on these)

| Event | When it fires | Payload |
|-------|---------------|---------|
| `contact_click` | User clicks a `mailto:` or `tel:` link | `contact_type` (`email` \| `phone`), `link_url` |
| `cta_click` | User clicks a button linking to `#contact` | `cta_location` (`hero`, `nav`, `cta_section`, `mobile_menu`), `cta_text` |

---

## Prerequisites

- [ ] Merge [PR #11](https://github.com/tasnadimark/website-testing/pull/11) and confirm GitHub Pages has redeployed
- [ ] Cookiebot domain group includes your live domain (e.g. `automatizalas.ai`)
- [ ] Google Ads campaign wizard: choose **“Set up manually using code”** for conversions — **not** “URL after form submit” (there is no thank-you page)

---

## Step 1 — Create GA4 property

- [ ] Go to [Google Analytics](https://analytics.google.com/) → **Admin** → **Create property**
- [ ] Property name: e.g. `OTTO / Automatizalas AI`
- [ ] Set timezone and currency (Hungary / HUF if targeting HU)
- [ ] Create a **Web** data stream for your live domain
- [ ] Copy the **Measurement ID** (`G-E10LNZV0VS`) — paste into the **Google Tag** in GTM (Step 2c). GA4 is **not** loaded via gtag.js in `index.html`; GTM only.

### Mark key events in GA4 (after GTM is live)

- [ ] **Admin** → **Events** → wait for `generate_lead` and `book_call_success` to appear (or create them)
- [ ] Toggle both as **Key events** (conversions in GA4)

### Link GA4 to Google Ads

- [ ] GA4 **Admin** → **Product links** → **Google Ads links** → Link your Ads account
- [ ] Enable personalized advertising and auto-tagging if prompted

---

## Step 2 — Configure GTM container (`GTM-M732SMQL`)

Open [tagmanager.google.com](https://tagmanager.google.com/) → your container → use a **Workspace** for changes, then **Submit** → **Publish** when done.

### 2a. Variables (Data Layer Variable type)

Create one variable per row. **Data Layer Variable Name** = the path in the left column.

| Variable name (in GTM) | Data Layer Variable Name |
|------------------------|--------------------------|
| DL - user email | `user_data.email` |
| DL - user name | `user_data.name` |
| DL - booking uid | `booking_uid` |
| DL - booking title | `booking_title` |
| DL - event type id | `event_type_id` |
| DL - booking status | `booking_status` |
| DL - cta location | `cta_location` |
| DL - contact type | `contact_type` |

### 2b. Triggers (Custom Event)

| Trigger name | Event name |
|--------------|------------|
| CE - contact_form_submit | `contact_form_submit` |
| CE - book_call_success | `book_call_success` |
| CE - contact_click | `contact_click` |
| CE - cta_click | `cta_click` |

### 2c. Tags

#### Always-on tags

- [ ] **Google Tag** (GA4 Configuration)
  - Tag type: **Google Tag**
  - Tag ID: `G-E10LNZV0VS`
  - Trigger: **All Pages**
  - This is the only place GA4 loads — do not add a separate gtag.js snippet to `index.html`

- [ ] **Conversion Linker**
  - Tag type: **Conversion Linker**
  - Trigger: **All Pages**
  - Required for accurate Google Ads attribution

#### GA4 event tags

- [ ] **GA4 - generate_lead (form)**
  - Tag type: **Google Analytics: GA4 Event**
  - Event name: `generate_lead`
  - Trigger: **CE - contact_form_submit**
  - Optional event parameters: `form_location` = `contact_section`

- [ ] **GA4 - book_call_success**
  - Tag type: **Google Analytics: GA4 Event**
  - Event name: `book_call_success`
  - Trigger: **CE - book_call_success**
  - Event parameters: `booking_title`, `event_type_id` (map from DL variables)

#### Google Ads conversion tags

Create conversion actions in Google Ads first (Step 3), then:

- [ ] **Google Ads - Lead form**
  - Tag type: **Google Ads Conversion Tracking**
  - Conversion ID + Label: from Ads (Step 3)
  - Trigger: **CE - contact_form_submit**
  - Enable **Enhanced conversions** → map email to **DL - user email**

- [ ] **Google Ads - Call booking**
  - Tag type: **Google Ads Conversion Tracking**
  - Conversion ID + Label: from Ads (Step 3)
  - Trigger: **CE - book_call_success**

#### Optional secondary tags (observation only)

- [ ] **GA4 - contact_click** → event `contact_click`, trigger **CE - contact_click**
- [ ] **GA4 - cta_click** → event `cta_click`, trigger **CE - cta_click**

### 2d. Consent settings (EU / Hungary)

Built-in Google tags (GA4, Conversion Linker, Ads) respect **Consent Mode v2** automatically when consent defaults are set in `index.html` before GTM loads.

- [ ] In GTM Preview, open the **Consent** tab — defaults should show `denied` before banner accept
- [ ] Accept cookies in Cookiebot banner — consent should update to `granted` for analytics/ads
- [ ] Do not fire non-Google marketing tags without matching consent checks

---

## Step 3 — Google Ads conversion actions

- [ ] **Goals** → **Conversions** → **New conversion action** → **Website**
- [ ] Choose **Set up manually using code** (or import from GA4 after Step 1 link)

Create **two** conversion actions:

| Name | Category | Primary? | GTM trigger |
|------|----------|----------|-------------|
| Lead - contact form | Submit lead form | **Yes — Primary** | `contact_form_submit` |
| Lead - call booking | Book appointment / Contact | **Yes — Primary** | `book_call_success` |

For each action, copy **Conversion ID** and **Conversion label** into the matching GTM Ads tag (Step 2c).

### Enhanced Conversions for leads

- [ ] Google Ads → **Goals** → **Conversions** → **Settings**
- [ ] Turn on **Enhanced conversions for leads**
- [ ] Method: **Google Tag Manager**
- [ ] Form tag maps `user_data.email` (already wired in Step 2c)

### Secondary events (do not use for bidding)

Mark these as **Secondary** if you create Ads conversions for them, or skip Ads tags entirely and only track in GA4:

- `contact_click` — email/phone link clicks
- `cta_click` — “Book audit” button clicks (scroll to contact, not a completed lead)

---

## Step 4 — Test end-to-end

### GTM Preview mode

- [ ] Open your live site (or localhost) with GTM Preview connected
- [ ] **Consent tab:** defaults denied → accept Cookiebot → updates to granted
- [ ] Submit contact form → `contact_form_submit` appears with `user_data.email` and `user_data.name`
- [ ] Complete a **test** Cal.com booking → `book_call_success` with `booking_uid`, `booking_title`
- [ ] Click footer email → `contact_click` with `contact_type: email`
- [ ] Click hero “Book audit” CTA → `cta_click` with `cta_location: hero`
- [ ] Confirm GA4 and Ads tags **fired** (or “consent not granted” before accept — expected)

### GA4 DebugView

- [ ] GA4 → **Admin** → **DebugView** (or install [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna) extension)
- [ ] Repeat form submit + test booking → see `generate_lead` and `book_call_success`

### Google Ads

- [ ] **Goals** → **Conversions** — status moves to “Recording conversions” within ~24 hours after real/test events
- [ ] Avoid judging campaign performance until conversions are recording

---

## Step 5 — Publish and maintain

- [ ] **Publish** GTM container version with a clear name (e.g. `GA4 + Ads conversions - initial`)
- [ ] Document your Measurement ID and Conversion IDs in a password manager or team doc (not in git)
- [ ] After domain or form changes, re-test `contact_form_submit` in GTM Preview
- [ ] After Cal.com event type changes, re-test `book_call_success`

---

## Troubleshooting

| Problem | Likely cause | Fix |
|---------|--------------|-----|
| No events in GTM Preview | PR #11 not deployed, or wrong site URL | Merge PR, hard-refresh, check `main.js` on live site |
| “Consent state before default was set” | Consent defaults after GTM | Ensure Cookiebot + consent script are **before** GTM in `index.html` |
| Form conversion never fires | Google Form misconfigured | Check `GOOGLE_FORM` in `main.js`; submit must reach success UI |
| Booking conversion never fires | Cal embed not loaded or listener missing | Scroll to `#contact`; check console; verify `Cal.ns.contact("on", …)` in `main.js` |
| Ads shows 0 conversions | Tags not published, consent denied, or wrong Conversion ID | Publish GTM; accept cookies in test; verify IDs in Ads tag |
| Used URL-based conversion in Ads wizard | No thank-you page exists | Switch to manual/GTM setup; use `contact_form_submit` event |

---

## Related files

| File | Role |
|------|------|
| `index.html` | Cookiebot, Consent Mode v2 defaults, GTM snippet |
| `main.js` | `pushToDataLayer()` and all event listeners |
| `TRACKING.md` | This checklist |
