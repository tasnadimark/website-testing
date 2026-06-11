#!/usr/bin/env node
/**
 * Bakes the bilingual static pages from scripts/index.template.html:
 *   - /index.html     -> Hungarian (default, lang="hu")
 *   - /en/index.html  -> English  (lang="en")
 *
 * Translations come from the I18N dict in main.js (single source of truth).
 * Each output gets: localized text baked into the markup, localized
 * <title>/<meta description>, canonical + hreflang links, Open Graph /
 * Twitter cards, and JSON-LD (Organization, ProfessionalService, FAQPage).
 *
 * Usage: node scripts/build-i18n.js
 * IMPORTANT: edit scripts/index.template.html (not index.html), then rebuild.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SITE = "https://www.automatizalas.ai";

const template = fs.readFileSync(path.join(__dirname, "index.template.html"), "utf8");
const mainJs = fs.readFileSync(path.join(ROOT, "main.js"), "utf8");

/* ---- extract the I18N dict from main.js ---- */
const dictMatch = mainJs.match(/const I18N = (\{[\s\S]*?\n\});/);
if (!dictMatch) {
  console.error("Could not find I18N dict in main.js");
  process.exit(1);
}
const I18N = new Function(`return ${dictMatch[1]}`)();

const PAGES = {
  hu: { out: "index.html", canonical: `${SITE}/`, ogLocale: "hu_HU", altLocale: "en_US" },
  en: { out: "en/index.html", canonical: `${SITE}/en/`, ogLocale: "en_US", altLocale: "hu_HU" },
};

const stripTags = (s) => s.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim();
const escAttr = (s) => stripTags(s).replace(/"/g, "&quot;");

function jsonLd(lang, dict, canonical) {
  const faq = [1, 2, 3, 4, 5, 6].map((i) => ({
    "@type": "Question",
    name: stripTags(dict[`faq.q${i}`]),
    acceptedAnswer: { "@type": "Answer", text: stripTags(dict[`faq.a${i}`]) },
  }));
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE}/#org`,
        name: "OTTO — Automatizalas.ai",
        url: `${SITE}/`,
        logo: `${SITE}/assets/otto-logo-square.png`,
        email: "mark@automatizalas.ai",
        description: stripTags(dict["meta.desc"]),
      },
      {
        "@type": "ProfessionalService",
        "@id": `${SITE}/#service`,
        name: "OTTO — Automatizalas.ai",
        url: canonical,
        image: `${SITE}/assets/otto-ad-landscape.png`,
        description: stripTags(dict["meta.desc"]),
        areaServed: { "@type": "Country", name: "Hungary" },
        availableLanguage: ["hu", "en"],
        parentOrganization: { "@id": `${SITE}/#org` },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE}/#website`,
        url: `${SITE}/`,
        name: "Automatizalas.ai",
        inLanguage: lang,
        publisher: { "@id": `${SITE}/#org` },
      },
      { "@type": "FAQPage", "@id": `${canonical}#faq`, inLanguage: lang, mainEntity: faq },
    ],
  });
}

function seoHead(lang, dict, page) {
  const title = escAttr(dict["meta.title"]);
  const desc = escAttr(dict["meta.desc"]);
  return `
  <!-- SEO: canonical + hreflang (generated) -->
  <link rel="canonical" href="${page.canonical}" />
  <link rel="alternate" hreflang="hu" href="${SITE}/" />
  <link rel="alternate" hreflang="en" href="${SITE}/en/" />
  <link rel="alternate" hreflang="x-default" href="${SITE}/" />

  <!-- Open Graph / Twitter (generated) -->
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="OTTO — Automatizalas.ai" />
  <meta property="og:url" content="${page.canonical}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${desc}" />
  <meta property="og:image" content="${SITE}/assets/otto-ad-landscape.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="628" />
  <meta property="og:locale" content="${page.ogLocale}" />
  <meta property="og:locale:alternate" content="${page.altLocale}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${desc}" />
  <meta name="twitter:image" content="${SITE}/assets/otto-ad-landscape.png" />

  <!-- Structured data (generated) -->
  <script type="application/ld+json">${jsonLd(lang, dict, page.canonical)}</script>`;
}

function build(lang) {
  const page = PAGES[lang];
  const dict = I18N[lang];
  let html = template;

  // bake translations into every data-i18n element (no same-tag nesting in content)
  for (const [key, value] of Object.entries(dict)) {
    const re = new RegExp(
      `(<([a-z0-9]+)((?:(?!>)[\\s\\S])*?data-i18n="${key.replace(/\./g, "\\.")}"(?:(?!>)[\\s\\S])*?)>)[\\s\\S]*?(</\\2>)`,
      "g"
    );
    html = html.replace(re, `$1${value}$4`);
  }

  // lang attribute, title, meta description
  html = html.replace(/<html lang="[a-z-]*">/, `<html lang="${lang}">`);
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escAttr(dict["meta.title"])}</title>`);
  html = html.replace(
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${escAttr(dict["meta.desc"])}" />`
  );

  // absolute asset paths so /en/ resolves them
  html = html
    .replace(/href="styles\.css"/, 'href="/styles.css"')
    .replace(/src="main\.js"/, 'src="/main.js"')
    .replace(/href="favicon\.png"/g, 'href="/favicon.png"');

  // language switch active state
  html = html
    .replace(/class="lang__btn( is-active)?" data-lang="en"/, `class="lang__btn${lang === "en" ? " is-active" : ""}" data-lang="en"`)
    .replace(/class="lang__btn( is-active)?" data-lang="hu"/, `class="lang__btn${lang === "hu" ? " is-active" : ""}" data-lang="hu"`);

  // inject SEO head block after the meta description
  html = html.replace(
    /(<meta name="description"[^>]*\/>)/,
    `$1\n${seoHead(lang, dict, page)}`
  );

  // generated-file banner
  html = html.replace(
    /^<!DOCTYPE html>/,
    `<!DOCTYPE html>\n<!-- GENERATED FILE — edit scripts/index.template.html and run: node scripts/build-i18n.js -->`
  );

  const outPath = path.join(ROOT, page.out);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html);
  console.log(`built ${page.out} (${lang}, ${html.length} bytes)`);
}

build("hu");
build("en");
