# Concept-led platform: navigation and existing-material audit

Audited 2 October 2026. Phase 1 only. This document records the current published tree and the constraints for the proposed Learn / Explore Concepts / Practice / Read Steiner architecture. No site implementation, course rewriting, build or browser run was performed for this audit. Private PDFs were not freshly inspected. Source-review statements below describe existing authored records, not new verification.

The audit read the generated English and Portuguese homepage, all collection indexes, beginner paths, theme/reference/research hubs, course catalogue, source-link metadata and relevant generators. Two independent read-only reviews checked retained course-route ownership and existing Waldorf coverage. Progress and notebook implementation are the separate technical audit's responsibility.

## 1. Current sitemap and inventory

The current `docs/` tree contains **964 HTML files**: **421 English/Portuguese route pairs plus 122 shared English research notes**. The latter have English and Portuguese library indexes, not invented Portuguese note bodies. These counts describe this audit snapshot; future route totals should remain manifest-derived.

```text
/index.html                              Homepage: 36-lesson beginner path
/learn/index.html                        Current beginner-path contents
  /learn/lessons/01.html … 36.html        Cross-source beginner teaching
/introduction-to-anthroposophy/index.html Separate 28-lesson introduction
  /parts/<slug>.html                     Seven parts
  /lessons/01.html … 28.html
  /source-notes.html
/books/index.html                        Mixed book/practice/source collection hub
/theosophy/index.html                    Current 28-reading Shields book guide
  /chapters/book-<slug>.html             Four chapter contents/syntheses
  /source-notes.html
/lessons/00.html … 27.html                Existing Theosophy readings
/<other-course>/index.html               Retained indexes listed below
/<other-course>/chapters/<slug>.html     Existing source/group landing pages
/<other-course>/lessons/<NN>.html        Ordinary retained readings
/meditation/00.html … 08.html             Meditation has a different route shape
/biodynamics/index.html                  24-lesson agricultural course
  /parts/<slug>.html                     Six parts and syntheses
  /lessons/01.html … 24.html
  /practice/index.html                   Existing course-specific practice library
  /sources.html, /background.html
/themes/index.html#<theme-id>             Twelve scoped application themes
/reference/human-constitution.html       Existing shared concept reference
/research/index.html                     Searchable notes, source works, fingerprints
/research/notes/<document-id>.html        122 original authored English notes
/pt/...                                  Partners for the paired routes above
```

There are **19 learning/source collections** when the 16 catalogue entries, Foundations, Introduction and the separately authored Biodynamics course are considered together. The current Books hub shows twelve primary cards and five source-companion links. Foundations and Introduction are outside that hub. Do not derive the redesigned platform exclusively from the 16-entry catalogue.

| Existing collection | Readings per language | Existing routes to preserve | Main discovery role |
| --- | ---: | --- | --- |
| Beginner path, proposed name **Foundations** | 36 | `learn/index.html`; `learn/lessons/01`–`36.html` | Learn; cross-source introduction |
| Introduction to Anthroposophy | 28 | `introduction-to-anthroposophy/index.html`, seven part pages, lessons `01`–`28`, source notes | Learn; distinct existing introductory course |
| Theosophy | 28 | `theosophy/index.html`, four chapter pages, source notes, **`lessons/00`–`27.html`** | Existing source-led text/commentary to retain in Read Steiner |
| The Philosophy of Freedom | 22 | `philosophy-of-freedom/`; lessons `00`–`21` | Read Steiner; sixteen core readings plus six optional practices |
| How to Know Higher Worlds | 19 | `higher-worlds/`; lessons `00`–`18` | Read Steiner; related voluntary practices |
| According to Luke | 12 | `according-to-luke/`; lessons `00`–`11` | Read Steiner; lecture cycle |
| Colour | 14 | `colour/`; lessons `00`–`13` | Read Steiner; links from Explore Concepts and Practice |
| Practical Training in Thought | 12 core + optional forecasting | `practical-thinking/`; all thirteen existing lesson files, four parts, `tools.html`, source notes | Practice; source guide remains accessible |
| Understanding Temperaments | 12 | `understanding-temperaments/`; lessons `00`–`11` | Practice; original combined course |
| The Four Temperaments | 11 | `temperaments/`; lessons `00`–`10` | Read Steiner; distinct primary source companion |
| Understand Your Temperament! | 13 | `understand-temperament/`; lessons `00`–`12` | Related-author reading: Gilbert Childs |
| The Mystery of Temperaments | 15 | `mystery-temperaments/`; lessons `00`–`14` | Read Steiner; distinct continuous source discussion |
| Encountering the Self | 17 | `encountering-the-self/`; lessons `00`–`16` | Related-author reading: Hermann Koepke, with Holtzapfel separately credited |
| Myth, Meaning and Human Consciousness | 8 | `ancient-myths/`; lessons `00`–`07` | Read Steiner; attributed lecture readings |
| Meditation and Inner Life | 9 | `meditation/index.html`; **`meditation/00`–`08.html`** | Practice; selected texts and separate contributor credits |
| Biodynamic Agriculture | 24 | `biodynamics/`; lessons `01`–`24`, six parts, practice/source/background pages | Existing applied course; discover through Learn and Practice without rebuilding |
| What Is Biodynamics? | 14 | `what-is-biodynamics/`; lessons `00`–`13` | Optional anthology/source companion; Courtney and Steiner voices distinguished |
| Agriculture Course | 18 | `agriculture/`; lessons `00`–`17` and eight lecture-group pages | Read Steiner; complete lecture reading companion |
| Toward a Threefold Society — Introduction and Preface | 7 | `toward-threefold-society/`; lessons `00`–`06` | Read Steiner; **supplied opening only**, Smith introduction distinct from Steiner |

All ordinary collection prefixes above also retain their existing chapter/group pages and `/pt/` partners; the table abbreviates those URLs rather than permitting their removal. Course-created parts, actual source chapters, continuous discussions and numbered lectures are already distinguished in catalogue data. Preserve that distinction.

## 2. Concrete navigation findings

### A. Two beginner entries need an explicit relationship

The homepage H1 is “Learn Anthroposophy”; its main button starts `learn/lessons/01.html`, and `learn/index.html` is the 36-lesson contents page. A separate “Introduction to Anthroposophy” section is appended after the homepage's method, deeper-study cards and Theosophy/reference links. The Learn index itself contains only the 36-lesson path. A newcomer is not told why there are two introductory courses or which to choose.

Evidence: `scripts/build-learning-system.mjs:64–70`; `scripts/build-introduction-anthroposophy.mjs:147–166`; generated `docs/index.html` and `docs/learn/index.html`.

**Architecture recommendation:** make `learn/index.html` a genuine course hub. Give the preserved 36-lesson course the distinct Foundations name and its own `learn/foundations/index.html`; keep its existing lesson URLs. Present the existing Introduction and the new Theosophy prototype with concrete purposes and a clear starting recommendation. Adding a new Theosophy course must not conceal either introductory path or silently replace its teaching.

### B. The book hub conflates learner purposes and authors

Books currently includes primary book/lecture readings, Practical Thinking, combined Temperaments, Meditation, Koepke, and Biodynamics. Its subtitle says “Keep the author's sequence in view,” but several entries are original practical sequences. A blanket “Read Steiner” relabel would also misattribute Childs, Koepke, Courtney, Bamford and other distinct voices.

Evidence: `scripts/build-learning-system.mjs:18,80–82`; `scripts/link-biodynamic-course.mjs:37–46`; generated `docs/books/index.html`.

**Architecture recommendation:** divide discovery by purpose while retaining cross-links: conceptual courses in Learn, individual concepts in Explore Concepts, voluntary activities in Practice, and source-led readings/commentary in Read Steiner. Keep a visibly credited related-authors/anthologies section. “Read Steiner” must state that these are selected passages, reading assignments and commentary; full uploaded books remain private. The original sequence remains available when a reader enters a source guide.

The homepage currently advertises “16 book and practice collections,” while Books contains the catalogue's sixteen plus the new Biodynamics course. This is a current count mismatch caused by separately added integration. The redesigned hubs should derive visible counts and entries from one complete discovery manifest.

### C. Explore Concepts has useful source material but no current hub

There is no general concept-listing route. The illustrated `reference/human-constitution.html` explains physical, etheric and astral bodies, the I, natural kingdoms, sleep and terminology; the current navigation classifies this pedagogical reference as Research. Foundations and Introduction expose many concepts only inside course lists. The Themes page primarily indexes applications such as Waldorf, colour and agriculture, rather than providing a concept-led learning map.

Evidence: `scripts/build-learning-system.mjs:159–160`; `scripts/build-human-constitution.mjs:23`; `docs/reference/human-constitution.html`; `docs/themes/index.html`.

**Architecture recommendation:** make Explore Concepts a separate bilingual hub and give the Theosophy prototype's key concepts clear course/source/practice connections. Preserve the existing reference page and anchors as useful deep links. A concept page should distinguish its concise explanation, source support, related concepts and voluntary activity; application themes remain a secondary route, not an automatic synonym for concepts.

### D. Practical material is available but distributed

Practical Thinking has four parts and separate tools/journal pages; combined Temperaments has learner-support and self-education work; Meditation has nine sessions; Biodynamics has a real categorized practice library. Colour and Koepke contain observation and form-drawing activities. There is no platform-wide Practice hub.

Evidence: `scripts/build-practical-thinking.mjs:36`; `scripts/build-biodynamic-agriculture.mjs:148–150`; generated practice-course indexes; `content/temperament-course.mjs:42`.

**Architecture recommendation:** index existing activities with their purpose and source/course return link. Do not duplicate or reauthor the non-Theosophy courses in this prototype. Preserve the distinction between a study exercise, child-education proposal, adult self-education activity and historical spiritual account. Practice must remain optional; a completion mark does not establish an attainment or source claim.

### E. Research and themes should stay reachable with their scope intact

Research already has search, book/theme/kind/status filters, current/archive labels, edition limitations and private-source fingerprints. The recent Theosophy correction archives the older 1971 plan/review and directs readers to the current 28-reading Shields guide. Portuguese research indexes deliberately open the same original English note bodies. Themes exposes twelve application anchors and marks available, limited and uncovered scope.

Evidence: `scripts/learning-research.mjs:181–199,203–218`; `content/learning-system-research-map.json`; `docs/research/index.html` and its Portuguese partner.

**Architecture recommendation:** retain visible secondary access to Research Library and Themes from the platform shell and relevant pages. Preserve all twelve theme IDs, the current/archive distinction and original-language disclosures. Do not turn historical source ledgers into lessons, bibliographic leads into reviewed teaching, or secondary interpretations into Steiner's own text.

## 3. Existing Waldorf coverage and its limits

The site has substantial **bounded child-development source study**, not a complete Waldorf educational programme. The current Waldorf theme links five readings: Koepke `00`, `06`, `08`; combined Temperaments `07`; Steiner Temperaments `08`. Foundations `31` and Introduction `23`/`24` provide additional introductory coverage, but are not presently listed in that theme card.

Useful retained material includes Koepke's listening/authority/repair discussions (`01`–`03`), biography (`04`), developmental comparisons and curriculum (`05`–`08`), separately credited historical medical material (`09`–`11`), drawing/spatial exploration (`14`–`15`) and synthesis (`16`). Combined Temperaments `07` asks the reader to adapt support, observe the response and revise an assumption; this is an original fictional task. Koepke's Peter and Monica conversations are constructed source conversations, not observed clinical cases.

Relevant routes: `encountering-the-self/index.html`, `understanding-temperaments/lessons/07.html`, `temperaments/lessons/08.html`, `learn/lessons/31.html`, `introduction-to-anthroposophy/lessons/23.html` and `24.html`, and their `/pt/` partners. Existing `themes/index.html#waldorf`, `#art`, `#biography`, `#medicine` and `#eurythmy` connect this material. Koepke has eight research records, including five page ledgers.

Attribution must survive rediscovery: Koepke is a secondary interpreter; Holtzapfel authors the school-doctor contribution; mediated Steiner quotations and Sease/Smit/other contributions retain their identities. Form-drawing quotations were checked through Koepke, not independently against the referenced original educational lectures. Listening, voluntary support and geometric activities labelled as course adaptations do not validate every physiological, spiritual or cosmic interpretation in the source.

Introduction `24` explicitly identifies the missing specialist Waldorf witness. GA 13 and the 1909 temperament lecture do not supply a complete curriculum, classroom rhythm, founding chronology or artistic teaching method. Medicine, eurythmy, architecture and social threefolding are currently limited study; Nutrition has no reviewed substantive course. Preserve those honest limits rather than filling a new navigation category with implied coverage.

Evidence: `content/encountering-self-source-audit.md:13–15,37`; `content/encountering-self-course-review.md:17`; `content/introduction-anthroposophy-lesson-24.json:104`; `content/learning-system-research-map.json:5942,6216,6255`; `content/encountering-self-connections.mjs:4`.

## 4. Proposed sitemap for architecture review

Only the new Theosophy lesson prefix and Foundations landing below are fixed by the current scope. `concepts/index.html`, `practice/index.html` and the retained commentary landing are route proposals for Phase 2 approval. Reusing `books/index.html` for the Read Steiner hub preserves a familiar existing address.

```text
/index.html                              Platform orientation and four clear choices
/learn/index.html                        Course hub
  /learn/foundations/index.html          Preserved 36-lesson path, distinct name
    -> /learn/lessons/01 … 36.html        Existing addresses and teaching retained
  -> /introduction-to-anthroposophy/     Existing 28-lesson course retained
  -> /theosophy/index.html               New concept-led Theosophy prototype landing
       /theosophy/lessons/...            New conceptual lessons, distinct ownership
       [conceptual part/synthesis routes from approved curriculum]
/concepts/index.html                     Explore Concepts
  [Theosophy concept entries from approved curriculum]
  -> /reference/human-constitution.html Existing reference and anchors preserved
/practice/index.html                     Platform practice discovery
  [Theosophy voluntary exercises from approved curriculum]
  -> existing Practical Thinking, Temperaments, Meditation,
     Biodynamics library, Colour/Koepke activities with source context
/books/index.html                        Read Steiner / source-led reading hub
  [explicit retained Theosophy commentary landing, e.g. books/theosophy/index.html]
    -> /lessons/00 … 27.html              Existing text/commentary and IDs retained
    -> /theosophy/chapters/book-*.html    Existing source chapter guides retained
    -> /theosophy/source-notes.html      Existing edition/capture map retained
  -> all other existing source-led course routes
  -> related-author/anthology section with explicit author credits
/themes/index.html#...                   Accessible secondary applications hub
/research/index.html                     Accessible secondary evidence/archive hub
/research/notes/...                      Existing authored notes retained
/pt/...                                  Native paired hubs, courses and concept pages
```

Each primary area should answer one learner question: Which course should I follow? Which idea do I want to understand? What can I practise? Which source argument am I reading? One item may appear in more than one area with contextual links, but its full teaching and source identity should have one clear owner.

## 5. Route and generator traps to resolve before implementation

1. **Theosophy index ownership currently belongs to the source guide.** `scripts/build-theosophy-guided.mjs:6–8,88–103` writes both `theosophy/index.html` and `lessons/00`–`27.html`; it runs late in `build-learning-system.mjs:147–148`. A new concept-course landing at the same index will be overwritten without an explicit ownership split. Merely changing the current reading-path helper relocates existing commentary instead of preserving it. Keep the current 28 source-reading URLs and create a separately reachable commentary overview.
2. **Old Theosophy IDs are not pedagogical sequence numbers.** The source reading order is `00,01,02,03,23,04,05,24,06,07,08,27,09,10,25,11,26,12,13,14,15,16,17,18,19,20,21,22`. New conceptual order must be a distinct manifest. Preserve all existing chapter/index anchors and explain their source-guide destination if the index changes purpose.
3. **Moving Foundations' landing breaks hardcoded relative links.** Current Begin/list links are `lessons/NN.html` at `build-learning-system.mjs:69–70`; lesson breadcrumbs and returns are `../index.html#part-N` at `:76`. A landing under `learn/foundations/` needs links back to the existing `learn/lessons/` files. Existing part backlinks need the new Foundations landing or deliberate retained aliases, because `learn/index.html` will become a hub.
4. **Source links cannot be blanket-retargeted to conceptual lessons.** Foundations' `bookLinks` and quoted source links, including `#book-passage`, refer to existing source commentary (`build-learning-system.mjs:55–57,75`; `content/learning-system-sources.json`). Cross-course references to `lessons/NN.html` must continue to resolve to their original source material. Add separate “learn this concept” links rather than changing the meaning of existing source locators.
5. **Navigation has multiple owners and late writers.** The shared pass hardcodes Learn/Books/Themes/Research and classifies every `theosophy/` route as Books (`build-learning-system.mjs:154–180`). Introduction owns its own four-link shell before that pass (`build-introduction-anthroposophy.mjs:47`); Biodynamics builds after it and emits its own navigation (`build-lessons.mjs:99–102`; `build-biodynamic-agriculture.mjs:52`). Use explicit page roles and one final navigation contract covering every generator. New `theosophy/lessons/` and old `lessons/` have different roles despite sharing a logical book name.
6. **Discovery is split across manifests and HTML integrations.** Catalogue-only lists omit Introduction and Biodynamics. Introduction appends its homepage section; Biodynamics inserts/replaces Books cards and adds theme/onward notices (`link-biodynamic-course.mjs:37–64`). A new source-owned homepage/hub must replace these assumptions deliberately, so later generators do not restore old cards or lose valid companions.
7. **The catalogue already contains a stale route-description sentence.** `learning-system-catalogue.json:7` still says the Theosophy index is the homepage. Actual fields/generated routes correctly use `theosophy/index.html`. Revise descriptive semantics when introducing conceptual/source-guide roles; do not use the stale sentence as an implementation contract.
8. **Validators currently enforce the former navigation architecture.** `check-learning-system.mjs:177–182` requires one navigation and an active Books destination for retained course prefixes. Native Biodynamics has exact Learn/Books/Themes/Research assertions (`check-site.mjs:229–238`). `check-site.mjs:343–382` derives an exact inventory. Adapt architecture expectations while retaining source-specific assertions, old-route membership, language pairs, anchors and content protections. Do not loosen checks to accept arbitrary extra output.
9. **Bilingual and private/public boundaries are explicit.** Use the shell's provided partner routes (`learning-html.mjs:18–21`), not string guesses for the unusual old Theosophy and Meditation paths. Research notes remain shared original English. Source books/transcripts stay private; the research renderer only publishes registered authored notes under its public-note contract (`learning-research.mjs:203–218`). The new internal audits must not automatically become public library entries.

The technical audit separately owns resume state, opt-in progress, note preservation and the conditional publication/ownership contract. Navigation changes must use that reviewed contract rather than renaming existing stored study identities as part of a route refactor.

## 6. Phase boundary and verification requirements

This audit authorizes no implementation. Complete the global architecture and reusable-component designs before the Theosophy landing, then approve the conceptual curriculum before rewriting lessons. Preserve the existing text/commentary, create the concept/practice connections and synthesis, and validate the complete prototype before beginning another course.

For later verification, save the existing route/anchor/language-pair inventory and compare against it. Check the four primary hubs, secondary Research/Themes access, all nineteen existing collection entries, the old and new Theosophy reading paths, Foundations part backlinks, source-passage deep links and credited related-author collections. Test narrow screens, keyboard navigation, print/no-JavaScript access and optional practice behavior. The platform should not imply a specialist Waldorf, medical, eurythmy or nutrition course where only bounded source coverage exists.

No HTML, CSS, JavaScript, generator, catalogue, research map or course teaching was changed by this Phase 1 audit. The only authored file is this internal document.
