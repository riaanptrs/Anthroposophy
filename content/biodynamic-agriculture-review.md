# Biodynamic Agriculture rebuild — 2 October 2026

## Source policy and release status

The user's final instruction, “use the markdown files,” authorizes release from the supplied Markdown and supersedes the original PDF-inspection publication condition. Release checks now use verified canonical capture excerpts, explicit Markdown locators and original teaching diagrams. The generated release passes the final source, site and browser checks below. The earlier private-preview results are retained as previous validation; deployment is verified separately against the pushed commit and live files.

Neither of the two supplied Agriculture PDFs was inspected in this revision; their pagination and source illustrations also remain unverified. PDF-inspection flags remain false, printed pages are not invented, and historical illustrations are not claimed as seen or reproduced. Those limits remain visible without blocking the authorized Markdown release. The existing source maps preserve extraction damage and unresolved edition differences.

Modern teaching sources are verified within their declared review extents: relevant sections of Demeter's 2026 standard, FiBL's official DOK descriptions and 2024 results summaries, and NRCS soil-health/testing pages. The longer standard and dossier were reviewed in applicable sections; the eight-page FiBL fact sheet and NRCS pages were read fully. The [modern register](biodynamic-modern-evidence.json) records 21 located findings and source fingerprints. Runtime status reports stale policy information, so actual supported-proxy access results are recorded separately.

Two preliminary bibliography errors were corrected: FiBL project 533 was unrelated (DOK is project 404), and Brock's review is in *Open Agriculture*, DOI `10.1515/opag-2019-0064`. The Mäder and Brock papers remain explicitly unread optional leads. Their full texts were blocked by publisher/proxy access and support no direct teaching claims; FiBL-reported findings are attributed to the reviewed FiBL synthesis.

## Sources and preparation

The canonical Markdown witness is Rudolf Steiner, *Spiritual Foundations for the Renewal of Agriculture*, GA 327, translated by Catherine E. Creeger and Malcolm Gardner, edited by Gardner, Bio-Dynamic Farming and Gardening Association, 1993. The supplied cover includes SteinerBooks branding; that does not establish a separate later publication year.

The comparison witness is *Agriculture Course: The Birth of the Biodynamic Method*, George Adams's 1958 translation, Rudolf Steiner Press, 2012. Its terminology and locators are kept separate. Course quotations use the Creeger/Gardner text only. Portuguese passages are original study translations of those excerpts.

The new Markdown files are byte-identical to the previously reviewed copies:

| Witness | Captures | SHA-256 |
| --- | ---: | --- |
| Creeger/Gardner | 192 | `8ec1fbf787c122fea7b7ee28ccf520f1a0442e20253bf0329a7f4cfcc01a2d5c` |
| Adams | 178 | `ce60b99e02febcf3ee07f0d7f644936e9b43f0fd0467b09ab1d64a92ec3cd78d` |

All eight lectures and four discussions were reread and mapped before lesson authoring. The separately dated Experimental Circle address and June 20 report, editorial notes, remembered supplements and Pfeiffer's commentary have distinct attribution. The canonical export ends during the bibliography; the remaining bibliography, index and colour plates are absent. Digital capture numbers are not represented as printed book pages.

The internal records are [foundations](biodynamic-map-foundations.json), [preparations and challenges](biodynamic-map-preparations.json), [farm, animals and apparatus](biodynamic-map-farm.json), and the [master map](biodynamic-master-map.json). The master map connects 42 concepts to 24 lessons and preserves 36 translation/provenance issues. It links the existing full 370-capture ledger instead of duplicating it. Source fingerprints, capture locators and cross-file pointers were validated before authoring.

## Legacy material

The checkout had no native `biodynamics/` course. Its agricultural teaching occupied two source companions: `what-is-biodynamics/` and `agriculture/`. The [legacy audit](biodynamic-legacy-audit.md) reviews every one of their 100 English/Portuguese pages and 12 authored research notes.

The new course is the primary agricultural learning path for this release. Both older companions retain their URLs and source banks. Courtney is labelled secondary commentary; GA 230 and GA 136 become optional background after the agricultural question has been introduced. The existing complete-lecture companion remains available for sustained reading. No obsolete page is deleted.

The linking helper updates discovery cards and onward links without changing old passage banks or notebook identities. The older agriculture companions did not contain local lesson notebooks; this revision does not claim to migrate nonexistent saved records. Notes elsewhere on the site remain under their established keys.

## Teaching and implementation

The authoring sequence follows six parts in order. All six parts are complete and reviewed. The 24 bilingual lessons are accompanied by six part syntheses and a separate 14-entry practice library in five categories.

The applied template begins with an agricultural question, a short attributed passage, an explanation and an original process diagram. It then connects an example, anthroposophical interpretation, modern context, limits of inference, comprehension and observation. Two multiple-choice checks and one reflection test understanding rather than belief. Each part has a synthesis and optional model answer.

The index has six part cards, Begin/Continue controls and a separate practice library. It does not duplicate the entire lesson list. Bilingual lessons have explicit part/lesson positions, reciprocal language links, previous/next navigation and six opt-in note fields. Progress and the last biodynamics lesson use the shared storage consent and a course-specific resume record; records from other courses are preserved. The consent text states that the preference applies across courses.

The renderer's process figures and tables are original explanations. They are not described as reconstructions of unseen PDF drawings. The farm-cycle figure has separate animal/manure and plant-residue routes, including direct manure return or composting where actually practised. Modern research diagrams have their own captions rather than being attributed to Steiner. Any future historical-image reproduction would need a separately inspected image witness; it is not required for this release.

Important source distinctions remain visible: farm closure is qualified; preparations supplement ordinary manuring; preparation numbers are later labels; horsetail has a different role; plants' relation to astrality is distinguished from animals' internal organization. Conflicting depth, radiation and pathological terminology is left unresolved rather than combined into precise recipes. Later calendars and current certification rules are not attributed wholesale to the 1924 lectures.

Modern comparisons teach measurement and causal inference with precisely attributed research summaries. A whole-system result does not isolate a preparation effect or establish the proposed etheric/planetary mechanism. DOK's NOFERT treatment also receives 500/501, so it is not a preparation-free control. Current certification requirements are distinguished from research outcomes; the mandatory section 6.2 and recommended Appendix 8 of the Demeter standard are not conflated.

## Previous private-preview validation

Before the rebuild, all 27 existing validators passed. The modified site and guided-study checks passed against the then-unchanged published tree: 895 HTML pages and 143 retained bilingual notebook pairs. Integration-helper checks preserved old source collections and were idempotent. All 24 quotations matched their actual canonical Markdown captures. The 68-page private course passed its structural/source checker, and the complete private preview passed site checks across 963 HTML pages and retained all 143 legacy bilingual notebook pairs. The corrected private browser review passed all 290 checks, with zero page, console, request or HTTP errors and no external network attempts.

That private validation used:

```bash
node scripts/build-all.mjs
node scripts/build-biodynamic-agriculture.mjs --draft
node scripts/check-biodynamic-agriculture.mjs --draft --canonical-md /path/to/Agriculture.md
node scripts/check-site.mjs --docs-dir "$PWD/.sites-runtime/biodynamic-course-preview/docs"
node scripts/check-guided-study.mjs --docs-dir "$PWD/.sites-runtime/biodynamic-course-preview/docs"
node scripts/preview-biodynamic-agriculture.mjs
# In a second terminal, with the isolated server running:
node scripts/review-biodynamic-browser.cjs
```

The preview has its own root and port 4174. Generated files live under the ignored `.sites-runtime/biodynamic-course-preview/docs` directory. Full uploaded books remain private and are never copied into the site.

The final source policy uses the verified supplied Markdown captures. Modern teaching-reference review is complete within the recorded extents; migration and browser verification from the private run are recorded below. Source flags must continue to distinguish verified Markdown from uninspected PDFs and historical images.


## Previous private-review evidence

At that stage, the normal complete build and all 28 validators passed; the new course validator built its own private tree. Exact canonical Markdown excerpts were additionally checked with `--canonical-md`. The published tree was unchanged: all 921 files and eight protected source-bank fingerprints matched the before snapshot. Private integration changed 14 discovery/onward pages, added 68 native course pages and two scoped assets, and removed no existing file. All 100 older agricultural companion pages remained available.

The private browser run covered all 68 native pages at widths 320, 390 and 1280 (204 layout checks), 12 bilingual lesson quiz flows (24 questions), 12 reading-without-JavaScript cases, four mobile branched-cycle cases, keyboard-accessible tables, the final project and discovery links. It also verified saved-note consent, EN/PT restoration, pending-edit flushing, unknown fields, unrelated legacy records, malformed-record preservation, export, and course-specific resume including 11 checks under the actual `/Anthroposophy/` URL prefix.

The initial browser run exposed two test-harness timing problems: a font/animation promise under disabled JavaScript, and assertions before a language-switch page had finished loading. Both were corrected without changing the shared notebook or site controller. An isolated replay verified note preservation, followed by the complete 290/290 passing run.

Review artifacts are private and ignored by Git:

- [Final browser report](../.sites-runtime/biodynamic-course-preview/review/report.json)
- [English course index](../.sites-runtime/biodynamic-course-preview/review/course-index-en-1280.png)
- [Portuguese course index](../.sites-runtime/biodynamic-course-preview/review/course-index-pt-1280.png)
- [Mobile farm-cycle diagram](../.sites-runtime/biodynamic-course-preview/review/farm-cycle-lesson-11-en-320.png)
- [Preparation comparison table](../.sites-runtime/biodynamic-course-preview/review/preparation-role-table-en-1280.png)
- [Final-project example](../.sites-runtime/biodynamic-course-preview/review/final-project-en-390.png)

Modern-reference, migration and browser checks were completed for that private review. Both PDF witnesses and historical-image inspection remain unverified. The previous run did not update the live site or publish a task commit.

## Release validation and deployment

The complete public build passes all **28 validators**. The source checker additionally verifies both actual uploaded Markdown fingerprints (370 captures) and all 24 English excerpts within their assigned canonical captures. Markdown source mode passes with PDF-inspection flags false; missing source, locator, diagram-provenance or required review checks still reject release.

The release browser run passes **290/290 checks**, including all 204 layout cases, 12 bilingual quiz flows, 12 cases without JavaScript, note preservation and 11 resume cases under `/Anthroposophy/`. All 68 public native pages match the browser-tested preview byte for byte after removing its private-preview notice. The public pages contain no draft notice or PDF-inspection prerequisite.

The final site has 963 HTML pages. It retains all 921 previous files, adds 68 course pages and two assets, updates only 14 discovery/onward pages, and removes nothing. Eight protected source-bank fingerprints remain unchanged. Both agricultural reading companions and all other notebook identities remain available. Release integration explicitly preserves agricultural term explanations instead of automatically linking them to the human-body glossary; temperament coverage remains unchanged.

[Release browser report](../.sites-runtime/biodynamic-course-preview/review/markdown-release/report.json), [validator results](../.sites-runtime/biodynamic-course-preview/review/markdown-release/biodynamic-markdown-release-checks.json) and [preservation evidence](../.sites-runtime/biodynamic-course-preview/review/markdown-release/biodynamic-markdown-release-preservation.json) are private local artifacts. The reproducible checker also accepts `--comparison-md /path/to/Agriculture\ course.md` for direct verification of the second uploaded witness.

The generated course is published through the existing GitHub Pages source, `main:/docs`, at [Biodynamic Agriculture](https://riaanptrs.github.io/Anthroposophy/biodynamics/index.html), with its [Portuguese partner](https://riaanptrs.github.io/Anthroposophy/pt/biodynamics/index.html). Deployment verification checks the pushed commit, the Pages build and fetched live HTML/assets before the task reports publication complete. Historical PDF and image inspection remains unclaimed; the user's Markdown source instruction is the release authority.
