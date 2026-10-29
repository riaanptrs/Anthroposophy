# Academy interface refresh

Shared UI adds a violet/teal hero, Fraunces headings, consistent course cards, a subject menu and a search launcher across all 2,050 existing pages. Search indexes the main content of 1,081 English and 958 Portuguese pages, omitting duplicate print/download editions. Search is loaded only when requested, ranks title matches first, ignores accents, and displays up to 40 results with context. Native dialog provides keyboard focus containment; Escape closes search and returns focus. Ctrl/Cmd+K opens it.

Source: `scripts/assets/platform-polish.css`, `scripts/assets/platform-polish.js`, and `scripts/build-academy-ui.mjs`. `scripts/build-all.mjs` applies the shared interface after all course builders. To refresh only the UI without regenerating teaching, import and call `applyAcademyPolish()` from the new builder.

Validation: 20 browser cases at 320, 390, 768 and 1440 pixels across English/Portuguese homepages, course catalogues and a representative lesson; no horizontal overflow or JavaScript exceptions; subject menu, accent-insensitive full-text search, empty results, Escape and restored focus. Browser script: `node scripts/review-academy-ui.cjs`. Both new Waldorf family-guide and illustration-localization checks pass. JavaScript syntax and Git whitespace checks pass.

Content preservation: all 2,050 generated HTML pages compare byte-for-byte with their originals after removing the two added stylesheet/script tags, including remote updates 94461d79 and d8d3cd50. Existing course content, language switching and saved study data are retained.

The existing `check-site.mjs` does not pass for this repository snapshot: its route manifest expects 2,028 pages and does not recognize the English home or the new Portuguese Esoteric Social pages; it also reports legacy lesson control/content assertions. This UI pass does not alter those contents or routes. The complete content build was not rerun because this change only layers the interface onto the existing published output.
