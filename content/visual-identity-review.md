# Visual identity release review — 3 October 2026

The approved direction adds colour, expressive typography and original graphics to the existing Anthroposophy learning platform. It follows the Fraunces design sample and does not claim to reproduce Sophia Institute's current design; that site was inaccessible under the review environment's network policy.

The homepage now has one clear Foundations starting action, three balanced entry routes and illustrated Theosophy, Philosophy of Freedom and Higher Worlds features. Learn and practical-course directories use a related subject-artwork family. Read Steiner remains a restrained source directory. Theosophy's landing has its own subject symbol and an immediate link to its module map.

All 1,136 public HTML pages receive the shared identity after their existing course styles. The brand uses an original unfolding mark; reading surfaces use warm ivory and dark ink, with violet, teal, terracotta, green and ochre accents. These colours and symbols are editorial choices rather than historical Steiner graphics or asserted spiritual correspondences.

Headings use Fraunces at moderate weights, and text/navigation use Alegreya Sans with actual Regular and Bold masters. Three self-hosted WOFF2 files total 186,160 bytes. Full SIL OFL licenses, canonical source URLs and SHA-256 hashes accompany them. Portuguese and German accents, typographic quotation marks, dashes and ellipsis were checked in the actual bundled files. These are contemporary open-source faces, not specialist historical Anthroposophical fonts.

Implementation is source-owned and repeatable:

- `scripts/assets/visual-identity.css`: shared design tokens, typography, layout and responsive rules.
- `scripts/visual-identity.mjs`: route-aware subject accents, relative artwork links, original mark and deterministic asset copying.
- `scripts/assets/identity/`: licensed fonts and twelve original SVG illustrations.
- `scripts/platform-architecture.mjs`: bilingual homepage and illustrated course listings.
- `scripts/platform-integration.mjs`: one final versioned stylesheet per page, shared branding and route theme metadata.
- `scripts/platform-components.mjs`: Theosophy title artwork and immediate course-map link.

Existing teaching, primary-source content and storage controllers are preserved. A baseline comparison found no changes to 88 JSON content banks or eight published JavaScript controllers. All changes to visible main text are confined to the twelve intentional English/Portuguese homepage, directory and Theosophy landing routes. The separate legacy-body check retained 956 exact main bodies after previously documented URL normalization, with no additional differences.

Validation:

- All 29 repository validators pass, including source, bilingual route, notebook and teaching-diagram checks.
- Independent Chromium review passed 102 viewport cases: seventeen routes in English/Portuguese at 320, 390 and 1440 pixels. There were no horizontal page overflows, failed assets or JavaScript errors. Expanded course maps and long titles remained usable.
- Interactive Colour controls worked in both languages, and native reflection notes remained keyboard-accessible.
- Separate learning-flow checks verified bilingual reflections, bookmarks, completion, resume, export, legacy notebook isolation and operation without JavaScript.
- All nineteen collections' artwork paths were checked across English/Portuguese and deep route prefixes. All twelve SVGs parsed, all three fonts loaded, and asset copying was byte-identical on repetition.
- The mobile/desktop review caught a shell header rule affecting nested lesson headers. It was scoped to the direct page header and the full layout review repeated successfully before release.

Two existing validator assumptions were updated to preserve their purpose: the homepage identity is checked as exact visible H1 text with decorative markup allowed, and the human-constitution reference still requires exactly two teaching SVGs within its main content independently of the new shared brand SVG.

This release improves the visual identity and starting path. Other course teaching models, separate saving namespaces and source-commentary structures retain their existing behaviour.
