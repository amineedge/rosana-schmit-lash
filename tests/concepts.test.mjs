import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function source() {
  const [html, css, script] = await Promise.all([
    readFile(new URL("index.html", root), "utf8"),
    readFile(new URL("styles.css", root), "utf8"),
    readFile(new URL("app.js", root), "utf8"),
  ]);
  return { html, css, script, all: `${html}\n${css}\n${script}` };
}

test("ships one final Rosana Schmit identity instead of the discarded concepts", async () => {
  const { html, all } = await source();
  assert.match(html, /Rosana Schmit/);
  assert.match(html, /Lash Designer/);
  assert.doesNotMatch(all, /Quiet Luxury|Brazilian Glow|Bold Beauty|data-theme-choice|\bLUME\b|Lash Atelier/i);
});

test("contains the confirmed services, locations and contact channels", async () => {
  const { html, script } = await source();
  for (const expected of [
    "Lash Designer",
    "Lash Lifting",
    "Servidão das Palmeiras Nativas, 48, Loja 1",
    "Av. Campeche, 2906, Lojas 4 e 5",
    "Atendimento domiciliar sob consulta",
    "+55 (46) 99917-9775",
    "@roschmitlash",
  ]) assert.match(`${html}\n${script}`, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  assert.match(script, /wa\.me\/5546999179775/);
});

test("supports Portuguese, English and Spanish with localized metadata", async () => {
  const { html, script } = await source();
  for (const language of ["pt", "en", "es"]) {
    assert.match(html, new RegExp(`data-language="${language}"`));
    assert.match(script, new RegExp(`\\b${language}: \\{`));
  }
  assert.match(script, /document\.documentElement\.lang/);
  assert.match(script, /meta\[name="description"\]/);
});

test("provides the RS logo to WhatsApp and social link previews", async () => {
  const { html } = await source();
  await Promise.all([
    access(new URL("assets/rs-logo.svg", root)),
    access(new URL("assets/rs-social-preview.png", root)),
  ]);
  assert.match(html, /property="og:image" content="https:\/\/amineedge\.github\.io\/rosana-schmit-lash\/assets\/rs-social-preview\.png"/);
  assert.match(html, /property="og:image:width" content="1400"/);
  assert.match(html, /property="og:image:height" content="1400"/);
  assert.match(html, /rel="icon" href="\.\/assets\/rs-logo\.svg"/);
  assert.match(html, /rel="canonical" href="https:\/\/rosanaschmit\.com\.br\/"/);
});

test("keeps unconfirmed content visibly honest", async () => {
  const { html, script } = await source();
  assert.match(html, /Apresentação completa em breve/);
  assert.match(html, /Certificados em breve/);
  assert.match(html, /A confirmar/);
  assert.match(html, /autorização das clientes/);
  assert.match(html, /Textos descritivos aguardam validação final/);
  assert.match(script, /methodPending: "Detalhes a confirmar com Rosana/);
  assert.doesNotMatch(`${html}\n${script}`, /clientes satisfeitas|anos de experiência|★★★★★|5[,.]0/i);
});

test("uses Rosana's real portrait and recent Instagram portfolio images", async () => {
  const { html } = await source();
  const media = [
    ["assets/rosana-portrait.jpg", null],
    ["assets/instagram/result-2025-08-18.jpg", "DNhFarus7HG"],
    ["assets/instagram/result-2025-07-31.jpg", "DMyudyRsbRG"],
    ["assets/instagram/result-2025-06-03.jpg", "DKcAtUcRFA"],
    ["assets/instagram/result-2025-04-11.jpg", "DIT7OA1x6t6"],
    ["assets/instagram/result-2025-03-05.jpg", "DG0rAAds2qK"],
    ["assets/instagram/result-2025-01-06.jpg", "DEfQnGbxb4q"],
  ];
  for (const [file, shortcode] of media) {
    await access(new URL(file, root));
    assert.match(html, new RegExp(file.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    if (shortcode) assert.match(html, new RegExp(`instagram\\.com/p/${shortcode}`));
    if (shortcode) {
      const stem = file.replace(/\.jpg$/, "");
      await Promise.all([360, 720].map((width) => access(new URL(`${stem}-${width}.webp`, root))));
      assert.match(html, new RegExp(`${stem}-360\\.webp`));
      assert.match(html, new RegExp(`${stem}-720\\.webp`));
    }
  }
  await access(new URL("assets/instagram/PROVENANCE.md", root));
  assert.doesNotMatch(html, /portrait-placeholder|media-placeholder/);
  assert.equal((html.match(/class="gallery-card"/g) || []).length, 6);
  assert.equal((html.match(/srcset=/g) || []).length, 6);
});

test("includes responsive and accessible interaction states", async () => {
  const { html, css, script } = await source();
  assert.match(html, /class="skip-link"/);
  assert.match(html, /aria-expanded="false"/);
  assert.match(css, /@media \(max-width: 560px\)/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /@media \(max-width: 1180px\)[\s\S]*?\.menu-toggle \{[^}]*display: block/);
  assert.match(css, /--taupe-text: #806b5d/);
  assert.match(script, /event\.key === "Escape"/);
  assert.match(html, /data-i18n-aria="navAria"/);
});

test("keeps the mobile opening compact and the brand subtitle centered", async () => {
  const { css } = await source();
  assert.match(css, /\.brand \{[^}]*display: inline-grid;[^}]*justify-items: center/);
  assert.match(css, /\.brand span \{[^}]*width: 100%;[^}]*text-align: center/);
  const mobile = css.slice(css.indexOf("@media (max-width: 560px)"));
  assert.match(mobile, /\.hero \.eyebrow, \.hero \.location-line \{ display: none; \}/);
  assert.match(mobile, /\.hero-media \{ display: none; \}/);
  assert.match(mobile, /\.hero-copy \{[^}]*min-height: 0;[^}]*padding-top: 38px;[^}]*padding-bottom: 30px/);
});

test("ships the editorial hero and accepted design concepts", async () => {
  await Promise.all([
    "assets/rosana-hero.png",
    "concepts/rosana-brand-hero.png",
    "concepts/rosana-brand-services.png",
    "concepts/rosana-brand-contact.png",
  ].map((file) => access(new URL(file, root))));
});
