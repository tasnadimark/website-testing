/* ============================================================
   OTTO® — interactions, motion & i18n
   ============================================================ */

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
const isMobile = window.innerWidth < 768;

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------
   Smooth scroll (Lenis) — desktop only
------------------------------------------------------------ */
let lenis = null;
if (!prefersReducedMotion && !isTouch && typeof Lenis !== "undefined") {
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  window.__lenis = lenis;
}

/* ------------------------------------------------------------
   i18n — EN / HU
------------------------------------------------------------ */
const I18N = {
  en: {
    "meta.title": "AI Automation for SMBs | OTTO® — automatizalas.ai",
    "meta.desc": "OTTO designs and ships AI automations that erase repetitive work for small and medium businesses — in weeks, not quarters.",
    "nav.services": "Services",
    "nav.process": "Process",
    "nav.results": "Results",
    "nav.faq": "FAQ",
    "nav.contact": "Contact",
    "nav.cta": "Book a call",
    "hero.eyebrow": "AI Automation Studio — built for SMBs",
    "hero.line1": "Your busywork,",
    "hero.line2": "<em>automated</em>&nbsp;away.",
    "hero.sub": "We design and ship AI automations that erase repetitive work for small and medium businesses — in weeks, not quarters.",
    "hero.cta1": "Book a free audit",
    "hero.cta2": "See what we automate",
    "hero.scroll": "Scroll",
    "stats.s1": "automations shipped",
    "stats.s2": "hours saved / year",
    "stats.s3": "average first-year ROI",
    "m.1": "Invoice processing",
    "m.2": "Lead routing",
    "m.3": "Support agents",
    "m.4": "Report generation",
    "m.5": "Client onboarding",
    "m.6": "Inventory sync",
    "m.7": "Email triage",
    "m.8": "Quote follow-ups",
    "statement": "Every week, your team burns hours on work a machine should do. Copy-pasting between tools. Chasing invoices. Answering the same questions. <em>We make that disappear.</em>",
    "services.label": "<span>01</span> — What we automate",
    "services.title": "Four engines.<br>Zero busywork.",
    "svc1.h": "Sales & CRM",
    "svc1.p": "Leads captured, enriched, scored and routed the second they arrive. Follow-ups that send themselves.",
    "svc1.i1": "Lead capture & enrichment",
    "svc1.i2": "Smart routing & scoring",
    "svc1.i3": "Automated follow-up sequences",
    "svc2.h": "Operations",
    "svc2.p": "Invoices read, matched and filed. Documents processed. Schedules that build themselves around your rules.",
    "svc2.i1": "Invoice & document processing",
    "svc2.i2": "Scheduling & dispatch",
    "svc2.i3": "Cross-tool data sync",
    "svc3.h": "Customer support",
    "svc3.p": "AI agents trained on your knowledge that resolve 70% of tickets instantly — and hand off the rest gracefully.",
    "svc3.i1": "24/7 AI support agents",
    "svc3.i2": "Smart escalation & triage",
    "svc3.i3": "Voice & chat in your tone",
    "svc4.h": "Data & reporting",
    "svc4.p": "Dashboards that update while you sleep. Weekly digests written by AI, delivered before your Monday coffee.",
    "svc4.i1": "Live KPI dashboards",
    "svc4.i2": "Auto-generated reports",
    "svc4.i3": "Anomaly alerts",
    "process.label": "<span>02</span> — How it works",
    "process.title": "From audit to autopilot<br>in three moves.",
    "step1.h": "Audit",
    "step1.p": "We sit inside your workflows for a week and map where the hours hide. You get a ranked list of automations with the ROI of each — free, no strings.",
    "step1.meta": "Week 0 — Free",
    "step2.h": "Build",
    "step2.p": "We ship your first automation in 2–4 weeks, wired into the tools you already use. No rip-and-replace, no six-month rollout.",
    "step2.meta": "Weeks 1–4 — Fixed price",
    "step3.h": "Scale",
    "step3.p": "We monitor, maintain and keep improving. Each month we find the next thing to automate, so the savings compound.",
    "step3.meta": "Ongoing — Cancel anytime",
    "results.label": "<span>03</span> — Results",
    "results.title": "Numbers our clients<br>brag about.",
    "res1.label": "Hours given back to client teams, every year",
    "res2.label": "Average ROI in the first twelve months",
    "res3.label": "Median time from kickoff to first live automation",
    "res4.label": "Of clients stay with us after year one",
    "q1.text": "“OTTO automated our entire invoicing flow in three weeks. My ops manager got her Fridays back.”",
    "q1.role": "COO, Brightline Logistics — 45 people",
    "q2.text": "“Their support agent resolves most tickets before we wake up. Customers think we hired a night shift.”",
    "q2.role": "Founder, Veldt Outdoor — 12 people",
    "q3.text": "“The audit alone paid for itself. They found 11 hours a week hiding in our quoting process.”",
    "q3.role": "MD, Northgate Surveying — 28 people",
    "faq.label": "<span>04</span> — FAQ",
    "faq.title": "You're probably<br>wondering…",
    "faq.q1": "Do we need technical staff to work with you?",
    "faq.a1": "No. We handle everything — discovery, build, integration and maintenance. If your team can use email, they can use what we build.",
    "faq.q2": "What tools do you integrate with?",
    "faq.a2": "Whatever you already run: Gmail or Outlook, Slack, HubSpot, Salesforce, Xero, QuickBooks, Notion, Airtable, Shopify and 200+ others. No rip-and-replace.",
    "faq.q3": "How much does it cost?",
    "faq.a3": "The audit is free. Builds are fixed-price from $4k depending on scope, and ongoing care plans start at $900/month. Every proposal shows projected hours saved next to the price.",
    "faq.q4": "Is our data safe?",
    "faq.a4": "Yes. Least-privilege access, encrypted credentials, EU/US data residency options, and we never train models on your data. SOC 2-aligned processes throughout.",
    "faq.q5": "What if an automation breaks?",
    "faq.a5": "Every automation ships with monitoring and alerting. Most issues are fixed before you notice; care-plan clients get a 4-hour response SLA.",
    "cta.line1": "Stop doing",
    "cta.line2": "<em>robot work.</em>",
    "cta.sub": "Book a free 30-minute audit. We'll show you exactly which hours you can get back — even if you never hire us.",
    "cta.btn": "Book your free audit",
    "cta.note": "No pitch deck. No obligation. Just a map of your hidden hours.",
    "contact.label": "<span>05</span> — Contact",
    "contact.title": "Let's find your<br>hidden hours.",
    "contact.formHead": "Write to us",
    "contact.calHead": "Or book a call directly",
    "form.name": "Name",
    "form.email": "Work email",
    "form.company": "Company",
    "form.message": "What should we automate?",
    "form.send": "Send message",
    "form.sending": "Sending…",
    "form.error": "Something went wrong. Please try again or email mark@automatizalas.ai.",
    "form.successH": "Message sent.",
    "form.successP": "Thanks — we'll get back to you within one business day.",
    "footer.contact": "Contact",
    "footer.menu": "Menu",
    "footer.social": "Social",
    "footer.copy": "© 2026 OTTO Automation Studio",
    "footer.privacy": "Privacy",
    "footer.terms": "Terms",
  },
  hu: {
    "meta.title": "AI-automatizálás KKV-knak | OTTO® — automatizalas.ai",
    "meta.desc": "Az OTTO olyan AI-automatizációkat tervez és szállít, amelyek eltüntetik az ismétlődő munkát a kis- és középvállalkozásoknál — hetek, nem negyedévek alatt.",
    "nav.services": "Szolgáltatások",
    "nav.process": "Folyamat",
    "nav.results": "Eredmények",
    "nav.faq": "GYIK",
    "nav.contact": "Kapcsolat",
    "nav.cta": "Beszéljünk",
    "hero.eyebrow": "AI-automatizálási stúdió — KKV-knak építve",
    "hero.line1": "A monoton munka",
    "hero.line2": "<em>automatizálva.</em>",
    "hero.sub": "Olyan AI-automatizációkat tervezünk és szállítunk, amelyek eltüntetik az ismétlődő munkát a kis- és középvállalkozásoknál — hetek, nem negyedévek alatt.",
    "hero.cta1": "Kérj ingyenes auditot",
    "hero.cta2": "Nézd meg, mit automatizálunk",
    "hero.scroll": "Görgess",
    "stats.s1": "leszállított automatizáció",
    "stats.s2": "megspórolt óra / év",
    "stats.s3": "átlagos első éves ROI",
    "m.1": "Számlafeldolgozás",
    "m.2": "Lead-irányítás",
    "m.3": "AI-ügyfélszolgálat",
    "m.4": "Riportkészítés",
    "m.5": "Ügyfél-onboarding",
    "m.6": "Készletszinkron",
    "m.7": "E-mail-rendszerezés",
    "m.8": "Ajánlat-utánkövetés",
    "statement": "A csapatod minden héten órákat éget el olyan munkára, amit egy gépnek kellene végeznie. Másolgatás az eszközök között. Számlák utáni rohangálás. Ugyanazok a kérdések, újra és újra. <em>Mi ezt eltüntetjük.</em>",
    "services.label": "<span>01</span> — Mit automatizálunk",
    "services.title": "Négy motor.<br>Nulla robotmunka.",
    "svc1.h": "Értékesítés és CRM",
    "svc1.p": "A leadek érkezésük pillanatában rögzítve, gazdagítva, pontozva és a megfelelő emberhez irányítva. Utánkövetések, amelyek magukat küldik el.",
    "svc1.i1": "Lead-rögzítés és -gazdagítás",
    "svc1.i2": "Okos irányítás és pontozás",
    "svc1.i3": "Automatikus utánkövetési sorozatok",
    "svc2.h": "Működés",
    "svc2.p": "Számlák beolvasva, párosítva és iktatva. Dokumentumok feldolgozva. Ütemezések, amelyek a te szabályaid szerint épülnek fel.",
    "svc2.i1": "Számla- és dokumentumfeldolgozás",
    "svc2.i2": "Ütemezés és munkakiosztás",
    "svc2.i3": "Adatszinkron az eszközök között",
    "svc3.h": "Ügyfélszolgálat",
    "svc3.p": "A te tudásodon betanított AI-ügynökök, amelyek a kérdések 70%-át azonnal megoldják — a többit pedig elegánsan továbbadják.",
    "svc3.i1": "0–24 AI-ügyfélszolgálat",
    "svc3.i2": "Okos eszkaláció és rendszerezés",
    "svc3.i3": "Hang és chat a te stílusodban",
    "svc4.h": "Adatok és riportok",
    "svc4.p": "Dashboardok, amelyek alvás közben frissülnek. AI által írt heti összefoglalók, még a hétfői kávéd előtt.",
    "svc4.i1": "Élő KPI-dashboardok",
    "svc4.i2": "Automatikusan készülő riportok",
    "svc4.i3": "Anomália-riasztások",
    "process.label": "<span>02</span> — Hogyan dolgozunk",
    "process.title": "Az audittól a robotpilótáig<br>három lépésben.",
    "step1.h": "Audit",
    "step1.p": "Egy hétig a munkafolyamataidban ülünk, és feltérképezzük, hol bújnak meg az órák. Rangsorolt listát kapsz az automatizációkról, mindegyik megtérülésével — ingyen, kötelezettségek nélkül.",
    "step1.meta": "0. hét — Ingyenes",
    "step2.h": "Építés",
    "step2.p": "Az első automatizációdat 2–4 hét alatt szállítjuk, a már használt eszközeidbe bekötve. Semmi rendszercsere, semmi féléves bevezetés.",
    "step2.meta": "1–4. hét — Fix ár",
    "step3.h": "Skálázás",
    "step3.p": "Monitorozunk, karbantartunk és folyamatosan fejlesztünk. Minden hónapban megtaláljuk a következő automatizálnivalót, így a megtakarítás kamatozik.",
    "step3.meta": "Folyamatos — Bármikor lemondható",
    "results.label": "<span>03</span> — Eredmények",
    "results.title": "Számok, amikkel az<br>ügyfeleink dicsekednek.",
    "res1.label": "Óra, amit évente visszaadunk az ügyfeleink csapatainak",
    "res2.label": "Átlagos megtérülés az első tizenkét hónapban",
    "res3.label": "Medián idő a kickofftól az első éles automatizációig",
    "res4.label": "Az ügyfeleink ennyi százaléka marad velünk az első év után",
    "q1.text": "„Az OTTO három hét alatt automatizálta a teljes számlázási folyamatunkat. Az operációs vezetőm visszakapta a péntekjeit.”",
    "q1.role": "COO, Brightline Logistics — 45 fő",
    "q2.text": "„Az ügyfélszolgálati ügynökük a legtöbb kérdést megoldja, mire felébredünk. Az ügyfelek azt hiszik, éjszakai műszakot vettünk fel.”",
    "q2.role": "Alapító, Veldt Outdoor — 12 fő",
    "q3.text": "„Már maga az audit kifizetődött. Heti 11 órát találtak elrejtve az ajánlatkészítési folyamatunkban.”",
    "q3.role": "Ügyvezető, Northgate Surveying — 28 fő",
    "faq.label": "<span>04</span> — GYIK",
    "faq.title": "Valószínűleg ezeken<br>gondolkodsz…",
    "faq.q1": "Kell hozzá saját fejlesztő vagy IT-s?",
    "faq.a1": "Nem. Mindent mi intézünk — felmérés, építés, integráció és karbantartás. Ha a csapatod tud e-mailt használni, azt is tudja majd használni, amit építünk.",
    "faq.q2": "Milyen eszközökkel integráltok?",
    "faq.a2": "Amit már most is használsz: Gmail vagy Outlook, Slack, HubSpot, Salesforce, Xero, QuickBooks, Notion, Airtable, Shopify és 200+ további. Semmit nem kell lecserélni.",
    "faq.q3": "Mennyibe kerül?",
    "faq.a3": "Az audit ingyenes. Az építés fix áras, terjedelemtől függően 4 ezer dollártól, a folyamatos karbantartási csomagok pedig havi 900 dollártól indulnak. Minden ajánlatban az ár mellett ott a várható óramegtakarítás is.",
    "faq.q4": "Biztonságban vannak az adataink?",
    "faq.a4": "Igen. Minimális jogosultságok, titkosított hozzáférések, EU/US adattárolási opciók — és soha nem tanítunk modelleket az adataidon. Végig SOC 2-höz igazodó folyamatokkal dolgozunk.",
    "faq.q5": "Mi van, ha elromlik egy automatizáció?",
    "faq.a5": "Minden automatizáció monitorozással és riasztással együtt érkezik. A legtöbb hibát azelőtt javítjuk, hogy észrevennéd; a karbantartási csomagos ügyfelek 4 órás válaszidő-garanciát kapnak.",
    "cta.line1": "Elég volt a",
    "cta.line2": "<em>robotmunkából.</em>",
    "cta.sub": "Foglalj egy ingyenes, 30 perces auditot. Pontosan megmutatjuk, mely órákat kaphatod vissza — akkor is, ha sosem szerződsz velünk.",
    "cta.btn": "Foglald le az ingyenes auditod",
    "cta.note": "Semmi pitch deck. Semmi kötelezettség. Csak egy térkép a rejtett óráidról.",
    "contact.label": "<span>05</span> — Kapcsolat",
    "contact.title": "Találjuk meg a<br>rejtett óráitokat.",
    "contact.formHead": "Írj nekünk",
    "contact.calHead": "Vagy foglalj időpontot rögtön",
    "form.name": "Név",
    "form.email": "Munkahelyi e-mail",
    "form.company": "Cég",
    "form.message": "Mit automatizáljunk?",
    "form.send": "Üzenet küldése",
    "form.sending": "Küldés…",
    "form.error": "Valami hiba történt. Próbáld újra, vagy írj a mark@automatizalas.ai címre.",
    "form.successH": "Üzenet elküldve.",
    "form.successP": "Köszönjük — egy munkanapon belül válaszolunk.",
    "footer.contact": "Kapcsolat",
    "footer.menu": "Menü",
    "footer.social": "Közösségi",
    "footer.copy": "© 2026 OTTO Automation Studio",
    "footer.privacy": "Adatvédelem",
    "footer.terms": "Feltételek",
  },
};

/* Language is determined by URL: / is Hungarian, /en/ is English.
   Each URL serves statically baked content (scripts/build-i18n.js); the
   runtime applyLang pass keeps dynamic pieces (counters, statement split,
   marquee) consistent with it. */
let currentLang = location.pathname.startsWith("/en") ? "en" : "hu";

/* wrap hero/cta title lines for masked reveal — moves data-i18n onto the
   inner span so language swaps don't destroy the wrapper */
document.querySelectorAll(".hero__title .line, .cta__title .line").forEach((line) => {
  const inner = document.createElement("span");
  inner.className = "line-inner";
  inner.style.display = "block";
  if (line.dataset.i18n) {
    inner.dataset.i18n = line.dataset.i18n;
    delete line.dataset.i18n;
  }
  while (line.firstChild) inner.appendChild(line.firstChild);
  line.appendChild(inner);
});

/* split statement into word spans, preserving <em> */
function splitWords(node) {
  [...node.childNodes].forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      const frag = document.createDocumentFragment();
      child.textContent.split(/(\s+)/).forEach((part) => {
        if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(part));
        else if (part) {
          const span = document.createElement("span");
          span.className = "word";
          span.textContent = part;
          frag.appendChild(span);
        }
      });
      node.replaceChild(frag, child);
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      splitWords(child);
    }
  });
}

let statementTween = null;
function rebuildStatement() {
  const statement = document.getElementById("statementText");
  if (!statement) return;
  if (statementTween) {
    if (statementTween.scrollTrigger) statementTween.scrollTrigger.kill();
    statementTween.kill();
    statementTween = null;
  }
  splitWords(statement);
  statementTween = gsap.to(statement.querySelectorAll(".word"), {
    opacity: 1,
    stagger: 0.06,
    ease: "none",
    scrollTrigger: {
      trigger: statement,
      start: "top 80%",
      end: "bottom 45%",
      scrub: 0.5,
    },
  });
}

let marqueeTween = null;

function formatCounter(value, decimals, suffix) {
  let s = value.toFixed(decimals);
  if (currentLang === "hu") s = s.replace(".", ",");
  return s + (suffix || "");
}

function applyLang(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;

  const dict = I18N[lang];
  document.title = dict["meta.title"];
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute("content", dict["meta.desc"]);

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const t = dict[el.dataset.i18n];
    if (t != null) el.innerHTML = t;
  });

  // counters: localized suffixes + re-render finished ones
  document.querySelectorAll(".counter").forEach((el) => {
    const perLang = lang === "hu" ? el.dataset.suffixHu : el.dataset.suffixEn;
    if (perLang != null) el.dataset.suffix = perLang;
    if (el.dataset.done) {
      el.textContent = formatCounter(
        parseFloat(el.dataset.target),
        parseInt(el.dataset.decimals || "0", 10),
        el.dataset.suffix
      );
    }
  });

  // statement was re-written by the i18n pass above — re-split + re-animate
  rebuildStatement();

  // marquee width changed — re-evaluate the function-based x
  if (marqueeTween) marqueeTween.invalidate();

  document.querySelectorAll(".lang__btn").forEach((b) => {
    b.classList.toggle("is-active", b.dataset.lang === lang);
  });

  ScrollTrigger.refresh();
}

/* The toggle navigates to the other language's URL so each language keeps
   its own indexable page (SEO: hreflang pair). */
document.querySelectorAll(".lang__btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.dataset.lang === currentLang) return;
    location.href = btn.dataset.lang === "en" ? "/en/" : "/";
  });
});

/* ------------------------------------------------------------
   Color themes
------------------------------------------------------------ */
const THEMES = {
  volt: {},
  ember: {},
  orchid: {},
  paper: { light: true },
};
let heroSetAccent = null; // assigned by initHero once WebGL is up

function hexToRgb01(hex) {
  const c = parseInt(hex.replace("#", ""), 16);
  return [((c >> 16) & 255) / 255, ((c >> 8) & 255) / 255, (c & 255) / 255];
}
function accentHex() {
  return getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
}

function applyTheme(name) {
  if (!THEMES[name]) name = "volt";
  document.documentElement.dataset.theme = name;
  localStorage.setItem("otto-theme", name);
  document.querySelectorAll(".theme-dot").forEach((d) => {
    d.classList.toggle("is-active", d.dataset.theme === name);
  });
  if (heroSetAccent) heroSetAccent(accentHex(), !!THEMES[name].light);
}

document.querySelectorAll(".theme-dot").forEach((d) => {
  d.addEventListener("click", () => applyTheme(d.dataset.theme));
});
applyTheme(localStorage.getItem("otto-theme") || "volt");

/* ------------------------------------------------------------
   Anchor links work with Lenis
------------------------------------------------------------ */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    closeMenu();
    if (lenis) lenis.scrollTo(target, { offset: -70 });
    else target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
  });
});

/* ------------------------------------------------------------
   Three.js hero — particle wave
------------------------------------------------------------ */
async function initHero() {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas || prefersReducedMotion) return;

  try {
    const THREE = await import("three");

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.set(0, 2.2, 8);
    camera.lookAt(0, 0, 0);

    // Grid of points displaced by layered sine "noise" in the vertex shader
    const COLS = isMobile ? 90 : 160;
    const ROWS = isMobile ? 55 : 90;
    const W = 26, D = 16;
    const count = COLS * ROWS;
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    let i = 0;
    for (let x = 0; x < COLS; x++) {
      for (let z = 0; z < ROWS; z++) {
        positions[i * 3] = (x / (COLS - 1) - 0.5) * W;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = (z / (ROWS - 1) - 0.5) * D;
        seeds[i] = Math.random();
        i++;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uColor: { value: new THREE.Vector3(...hexToRgb01(accentHex())) },
    };
    const themeIsLight = () => !!THEMES[document.documentElement.dataset.theme]?.light;

    const material = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      depthWrite: false,
      // additive glow on dark themes washes out on light backgrounds
      blending: themeIsLight() ? THREE.NormalBlending : THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        uniform float uTime;
        uniform vec2 uMouse;
        uniform float uPixelRatio;
        attribute float aSeed;
        varying float vElev;
        varying float vDist;

        void main() {
          vec3 p = position;
          float t = uTime * 0.6;

          // layered waves
          float e = sin(p.x * 0.45 + t) * 0.45
                  + sin(p.z * 0.7 - t * 1.3) * 0.35
                  + sin((p.x + p.z) * 0.3 + t * 0.7) * 0.5;

          // mouse ripple
          vec2 m = uMouse * vec2(13.0, 8.0);
          float md = distance(p.xz, m);
          e += smoothstep(4.5, 0.0, md) * sin(md * 2.2 - uTime * 3.0) * 0.6;

          p.y += e;
          vElev = e;

          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          vDist = -mv.z;
          gl_Position = projectionMatrix * mv;
          gl_PointSize = (1.4 + aSeed * 1.6 + max(e, 0.0) * 1.2) * uPixelRatio * (9.0 / -mv.z);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        varying float vElev;
        varying float vDist;

        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          float alpha = smoothstep(0.5, 0.1, d);

          // fade with distance
          alpha *= smoothstep(22.0, 6.0, vDist);

          vec3 dim = uColor * 0.30 + vec3(0.12);
          vec3 col = mix(dim, uColor, smoothstep(-0.6, 1.1, vElev));

          gl_FragColor = vec4(col, alpha * 0.85);
        }
      `,
    });

    heroSetAccent = (hex, light) => {
      uniforms.uColor.value.set(...hexToRgb01(hex));
      material.blending = light ? THREE.NormalBlending : THREE.AdditiveBlending;
      material.needsUpdate = true;
    };

    const points = new THREE.Points(geometry, material);
    points.rotation.x = -0.12;
    scene.add(points);

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    if (!isTouch) {
      window.addEventListener("pointermove", (e) => {
        mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.ty = -((e.clientY / window.innerHeight) * 2 - 1);
      });
    }

    function resize() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener("resize", resize);

    const clock = new THREE.Clock();
    let raf;
    function tick() {
      const t = clock.getElapsedTime();
      uniforms.uTime.value = t;
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      uniforms.uMouse.value.set(mouse.x, mouse.y);
      camera.position.x = mouse.x * 0.6;
      camera.position.y = 2.2 + mouse.y * 0.3;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    }
    tick();

    // pause when hero off-screen
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { clock.start(); tick(); }
      else cancelAnimationFrame(raf);
    });
    io.observe(canvas);
  } catch (err) {
    console.warn("Hero WebGL disabled:", err);
  }
}
initHero();

/* ------------------------------------------------------------
   Preloader → hero intro
------------------------------------------------------------ */
const preloader = document.getElementById("preloader");
const countEl = document.getElementById("preloaderCount");

let introTl = null;
function heroIntro() {
  if (introTl) return introTl;
  const tl = (introTl = gsap.timeline({ defaults: { ease: "power4.out" } }));
  tl.to(preloader, { yPercent: -100, duration: 0.9, ease: "power4.inOut" })
    .set(preloader, { display: "none" })
    .from(".hero__title .line-inner", { yPercent: 110, duration: 1.1, stagger: 0.12 }, "-=0.45")
    .from("#heroSub", { y: 30, autoAlpha: 0, duration: 0.9 }, "-=0.7")
    .from("#heroCta .btn", { y: 24, autoAlpha: 0, duration: 0.8, stagger: 0.08 }, "-=0.6")
    .from(".hero__eyebrow", { autoAlpha: 0, duration: 0.6 }, "-=0.8")
    .from("#heroStats > *", { y: 20, autoAlpha: 0, duration: 0.7, stagger: 0.07 }, "-=0.5")
    .from("#nav", {
      yPercent: -100, autoAlpha: 0, duration: 0.7,
      onComplete: () => gsap.set("#nav", { clearProps: "all" }),
    }, "-=0.8");
  return tl;
}

/* Watchdog: rAF is throttled in hidden/background tabs, which would leave the
   preloader stuck. Force-finish the intro if it hasn't completed in time. */
setTimeout(() => {
  if (!prefersReducedMotion) {
    heroIntro().progress(1);
    gsap.set("#nav", { clearProps: "all" });
  }
}, 4000);

if (prefersReducedMotion) {
  preloader.style.display = "none";
} else {
  const counter = { v: 0 };
  gsap.to(counter, {
    v: 100,
    duration: 1.4,
    ease: "power2.inOut",
    onUpdate: () => (countEl.textContent = Math.round(counter.v)),
    onComplete: heroIntro,
  });
}

/* ------------------------------------------------------------
   Custom cursor
------------------------------------------------------------ */
if (!isTouch && !prefersReducedMotion) {
  const cursor = document.getElementById("cursor");
  const dot = cursor.querySelector(".cursor__dot");
  const ring = cursor.querySelector(".cursor__ring");
  const pos = { x: -100, y: -100 }, ringPos = { x: -100, y: -100 };

  window.addEventListener("pointermove", (e) => {
    pos.x = e.clientX; pos.y = e.clientY;
  });
  gsap.ticker.add(() => {
    ringPos.x += (pos.x - ringPos.x) * 0.16;
    ringPos.y += (pos.y - ringPos.y) * 0.16;
    dot.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%,-50%)`;
    ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translate(-50%,-50%)`;
  });
  document.querySelectorAll("[data-cursor='hover'], a, button, summary").forEach((el) => {
    el.addEventListener("pointerenter", () => cursor.classList.add("is-hover"));
    el.addEventListener("pointerleave", () => cursor.classList.remove("is-hover"));
  });
}

/* ------------------------------------------------------------
   Magnetic buttons
------------------------------------------------------------ */
if (!isTouch && !prefersReducedMotion) {
  document.querySelectorAll(".magnetic").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      gsap.to(el, {
        x: (e.clientX - r.left - r.width / 2) * 0.25,
        y: (e.clientY - r.top - r.height / 2) * 0.35,
        duration: 0.4, ease: "power3.out",
      });
    });
    el.addEventListener("pointerleave", () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
    });
  });
}

/* ------------------------------------------------------------
   Nav: hide on scroll down, glass on scroll
------------------------------------------------------------ */
const nav = document.getElementById("nav");
let lastY = 0;
ScrollTrigger.create({
  start: 0,
  end: "max",
  onUpdate: (self) => {
    const y = self.scroll();
    nav.classList.toggle("is-scrolled", y > 40);
    if (y > 500 && y > lastY && !menuOpen) nav.classList.add("is-hidden");
    else nav.classList.remove("is-hidden");
    lastY = y;
  },
});

/* ------------------------------------------------------------
   Mobile menu
------------------------------------------------------------ */
const burger = document.getElementById("burger");
const menu = document.getElementById("menu");
let menuOpen = false;

function openMenu() {
  menuOpen = true;
  burger.classList.add("is-open");
  burger.setAttribute("aria-expanded", "true");
  menu.setAttribute("aria-hidden", "false");
  gsap.set(menu, { visibility: "visible" });
  gsap.to(menu, { clipPath: "inset(0% 0 0% 0)", duration: 0.7, ease: "power4.inOut" });
  gsap.fromTo(".menu__link", { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.06, delay: 0.25, ease: "power3.out" });
  if (lenis) lenis.stop();
}
function closeMenu() {
  if (!menuOpen) return;
  menuOpen = false;
  burger.classList.remove("is-open");
  burger.setAttribute("aria-expanded", "false");
  menu.setAttribute("aria-hidden", "true");
  gsap.to(menu, {
    clipPath: "inset(0 0 100% 0)", duration: 0.6, ease: "power4.inOut",
    onComplete: () => gsap.set(menu, { visibility: "hidden" }),
  });
  if (lenis) lenis.start();
}
gsap.set(menu, { clipPath: "inset(0 0 100% 0)" });
burger.addEventListener("click", () => (menuOpen ? closeMenu() : openMenu()));
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});

/* ------------------------------------------------------------
   Marquee
------------------------------------------------------------ */
const track = document.getElementById("marqueeTrack");
const group = track.querySelector(".marquee__group");
for (let i = 0; i < 3; i++) track.appendChild(group.cloneNode(true));
if (!prefersReducedMotion) {
  marqueeTween = gsap.to(track, {
    x: () => -group.offsetWidth,
    duration: 22,
    ease: "none",
    repeat: -1,
  });
}

/* ------------------------------------------------------------
   Apply saved language (re-writes text, splits statement)
------------------------------------------------------------ */
applyLang(currentLang);

/* ------------------------------------------------------------
   Generic section reveals
------------------------------------------------------------ */
gsap.utils.toArray(".section-head").forEach((head) => {
  gsap.from(head.children, {
    y: 50, autoAlpha: 0, duration: 1, stagger: 0.12, ease: "power3.out",
    scrollTrigger: { trigger: head, start: "top 82%" },
  });
});

gsap.utils.toArray(".service-card").forEach((card, i) => {
  gsap.from(card, {
    y: 60, autoAlpha: 0, duration: 0.9, delay: (i % 2) * 0.1, ease: "power3.out",
    scrollTrigger: { trigger: card, start: "top 88%" },
  });
  // cursor-tracked glow
  card.addEventListener("pointermove", (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  });
});

gsap.utils.toArray(".quote, .faq__item").forEach((el) => {
  gsap.from(el, {
    y: 40, autoAlpha: 0, duration: 0.8, ease: "power3.out",
    scrollTrigger: { trigger: el, start: "top 90%" },
  });
});

/* Results section scales in slightly */
gsap.from(".results", {
  scale: 0.96, autoAlpha: 0.4, duration: 1, ease: "power2.out",
  scrollTrigger: { trigger: ".results", start: "top 85%" },
});

/* ------------------------------------------------------------
   Process: progress bar + active step highlighting
------------------------------------------------------------ */
const steps = gsap.utils.toArray(".process-step");
const processBar = document.getElementById("processBar");
if (steps.length && processBar) {
  gsap.to(processBar, {
    scaleY: 1,
    ease: "none",
    scrollTrigger: {
      trigger: "#processSteps",
      start: "top 70%",
      end: "bottom 45%",
      scrub: 0.4,
      onUpdate: (self) => {
        const idx = Math.min(steps.length - 1, Math.floor(self.progress * steps.length));
        steps.forEach((s, i) => s.classList.toggle("is-active", i <= idx));
      },
    },
  });
}

/* ------------------------------------------------------------
   Counters
------------------------------------------------------------ */
gsap.utils.toArray(".counter").forEach((el) => {
  const target = parseFloat(el.dataset.target);
  const decimals = parseInt(el.dataset.decimals || "0", 10);
  const obj = { v: 0 };
  const render = () => (el.textContent = formatCounter(obj.v, decimals, el.dataset.suffix));
  gsap.to(obj, {
    v: target,
    duration: 1.8,
    ease: "power2.out",
    scrollTrigger: { trigger: el, start: "top 85%" },
    onUpdate: render,
    onComplete: () => {
      el.dataset.done = "1";
      render();
    },
  });
});

/* ------------------------------------------------------------
   CTA title masked reveal
------------------------------------------------------------ */
gsap.from(".cta__title .line-inner", {
  yPercent: 110, duration: 1.1, stagger: 0.12, ease: "power4.out",
  scrollTrigger: { trigger: ".cta__title", start: "top 80%" },
});
gsap.from(".cta__sub, .cta .btn, .cta__note", {
  y: 30, autoAlpha: 0, duration: 0.9, stagger: 0.1, ease: "power3.out",
  scrollTrigger: { trigger: ".cta__title", start: "top 75%" },
});

/* ------------------------------------------------------------
   Footer wordmark parallax
------------------------------------------------------------ */
gsap.from(".footer__wordmark", {
  yPercent: 40,
  ease: "none",
  scrollTrigger: { trigger: ".footer", start: "top bottom", end: "bottom bottom", scrub: 0.5 },
});

/* FAQ smooth open/close height */
document.querySelectorAll(".faq__item").forEach((item) => {
  const summary = item.querySelector("summary");
  const content = item.querySelector("p");
  summary.addEventListener("click", (e) => {
    if (prefersReducedMotion) return; // native behavior
    e.preventDefault();
    if (item.open) {
      gsap.to(content, {
        height: 0, opacity: 0, duration: 0.35, ease: "power2.inOut",
        onComplete: () => { item.open = false; gsap.set(content, { clearProps: "all" }); },
      });
    } else {
      item.open = true;
      gsap.from(content, { height: 0, opacity: 0, duration: 0.45, ease: "power3.out" });
    }
  });
});

/* ------------------------------------------------------------
   GTM dataLayer — conversion & engagement events
------------------------------------------------------------ */
function pushToDataLayer(payload) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

function getCtaLocation(el) {
  if (el.closest(".hero")) return "hero";
  if (el.closest(".cta")) return "cta_section";
  if (el.closest(".nav")) return "nav";
  if (el.closest(".menu")) return "mobile_menu";
  return "unknown";
}

/* Secondary engagement events (mark as Secondary in Google Ads) */
document.querySelectorAll('a[href^="mailto:"], a[href^="tel:"]').forEach((link) => {
  link.addEventListener("click", () => {
    pushToDataLayer({
      event: "contact_click",
      contact_type: link.href.startsWith("mailto:") ? "email" : "phone",
      link_url: link.getAttribute("href"),
    });
  });
});

document.querySelectorAll('a[href="#contact"]').forEach((link) => {
  if (!link.classList.contains("btn")) return;
  link.addEventListener("click", () => {
    pushToDataLayer({
      event: "cta_click",
      cta_location: getCtaLocation(link),
      cta_text: (link.textContent || "").trim(),
    });
  });
});

/* ------------------------------------------------------------
   Contact form → Google Forms
   Setup:
   1. Create a Google Form with Name, Email, Company, Message fields
   2. Link it to a Google Sheet (Responses tab)
   3. Send → Get pre-filled link → fill each field → Generate link
   4. Copy entry.xxxxx IDs from the URL into GOOGLE_FORM.entries below
   5. Paste the formResponse URL (ends in /formResponse) into GOOGLE_FORM.action
------------------------------------------------------------ */
const GOOGLE_FORM = {
  action: "https://docs.google.com/forms/d/e/1FAIpQLSeV-eC-0zQ8dHazRJ6XUKA2Q4B-3BvaUN423HaZugAhWkwC2Q/formResponse",
  entries: {
    name: "entry.548348004",
    email: "entry.803460232",
    company: "entry.937920678",
    message: "entry.1463795472",
  },
};

function isGoogleFormConfigured() {
  const { action, entries } = GOOGLE_FORM;
  if (!action || action.includes("YOUR_FORM_ID")) return false;
  return Object.values(entries).every((id) => id && !id.startsWith("entry.YOUR_"));
}

async function submitToGoogleForm(data) {
  const body = new URLSearchParams();
  body.set(GOOGLE_FORM.entries.name, data.name);
  body.set(GOOGLE_FORM.entries.email, data.email);
  if (data.company) body.set(GOOGLE_FORM.entries.company, data.company);
  body.set(GOOGLE_FORM.entries.message, data.message);

  await fetch(GOOGLE_FORM.action, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
}

const contactForm = document.getElementById("contactForm");
if (contactForm) {
  const formError = document.getElementById("formError");
  const formSuccess = document.getElementById("formSuccess");
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const submitLabel = submitBtn?.querySelector("[data-i18n='form.send']");

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (contactForm.website.value) return;

    if (!isGoogleFormConfigured()) {
      console.error("Google Form is not configured — update GOOGLE_FORM in main.js");
      if (formError) formError.hidden = false;
      return;
    }

    const data = Object.fromEntries(new FormData(contactForm));
    formError.hidden = true;
    submitBtn.disabled = true;
    if (submitLabel) submitLabel.textContent = I18N[currentLang]["form.sending"];

    try {
      await submitToGoogleForm(data);
      pushToDataLayer({
        event: "contact_form_submit",
        form_location: "contact_section",
        user_data: { email: data.email, name: data.name },
      });
      contactForm.hidden = true;
      formSuccess.hidden = false;
    } catch (err) {
      console.error("Form submit failed:", err);
      formError.hidden = false;
      submitBtn.disabled = false;
      if (submitLabel) submitLabel.textContent = I18N[currentLang]["form.send"];
    }
  });
}

/* ------------------------------------------------------------
   Cal.com inline embed
------------------------------------------------------------ */
const CAL_LINK = "mark-tasnadi-rqaerj";
if (document.getElementById("cal-embed")) {
  /* official Cal.com embed loader */
  (function (C, A, L) {
    let p = function (a, ar) { a.q.push(ar); };
    let d = C.document;
    C.Cal = C.Cal || function () {
      let cal = C.Cal;
      let ar = arguments;
      if (!cal.loaded) {
        cal.ns = {};
        cal.q = cal.q || [];
        d.head.appendChild(d.createElement("script")).src = A;
        cal.loaded = true;
      }
      if (ar[0] === L) {
        const api = function () { p(api, arguments); };
        const namespace = ar[1];
        api.q = api.q || [];
        if (typeof namespace === "string") {
          cal.ns[namespace] = cal.ns[namespace] || api;
          p(cal.ns[namespace], ar);
          p(cal, ["initNamespace", namespace]);
        } else p(cal, ar);
        return;
      }
      p(cal, ar);
    };
  })(window, "https://app.cal.com/embed/embed.js", "init");

  const calTheme = THEMES[document.documentElement.dataset.theme]?.light ? "light" : "dark";
  Cal("init", "contact", { origin: "https://cal.com" });
  Cal.ns.contact("inline", {
    elementOrSelector: "#cal-embed",
    calLink: CAL_LINK,
    config: { layout: "month_view", theme: calTheme },
  });
  Cal.ns.contact("ui", {
    theme: calTheme,
    cssVarsPerTheme: {
      dark: { "cal-brand": accentHex() },
      light: { "cal-brand": accentHex() },
    },
    hideEventTypeDetails: false,
  });

  Cal.ns.contact("on", {
    action: "bookingSuccessfulV2",
    callback: (e) => {
      const b = (e && e.detail && e.detail.data) || {};
      pushToDataLayer({
        event: "book_call_success",
        booking_uid: b.uid,
        booking_title: b.title,
        event_type_id: b.eventTypeId,
        booking_status: b.status,
      });
    },
  });
}

/* Contact columns reveal */
gsap.from(".contact__col", {
  y: 50, autoAlpha: 0, duration: 0.9, stagger: 0.12, ease: "power3.out",
  scrollTrigger: { trigger: ".contact__grid", start: "top 85%" },
});

/* Refresh ScrollTrigger after fonts/layout settle */
window.addEventListener("load", () => ScrollTrigger.refresh());
