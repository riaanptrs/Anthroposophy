# Navigation, progress and browser audit for the learning system

Audited 2026-10-01 before broad restructuring. The review read the supplied learning-system brief, homepage, all thirteen course collections, their English and Portuguese indexes, generated lesson layouts, storage scripts, shared styles, build chain and relevant validators. Chromium inspected all 26 bilingual indexes and 30 representative page/viewport combinations against the local preview. No external website was accessed.

The current material already has source excerpts, substantial explanations, bilingual lessons, careful edition attribution and useful activities. Its main weakness is orientation: a beginner encounters a library of equally weighted courses, while the source discussion, optional bridges, practice and notebooks can occupy the same long page. Preserve that material and its stable addresses while adding an explicit beginner path and navigable layers.

## Existing map

The generated site has 398 HTML pages: 176 pairs of ordinary lessons, nine pairs of meditation sessions, thirteen pairs of course indexes and one pair of human-constitution reference pages. The Theosophy index is currently the homepage. All pages have a language partner. There are 177 selected-passage records assigning excerpts to 185 lessons/sessions, producing 370 bilingual source pages.

| Existing collection | Lessons or sessions per language | Current index and boundaries |
| --- | ---: | --- |
| Theosophy | 23 | Homepage; orientation, four source chapters and synthesis grouped visibly. No separate book index or chapter landing pages. |
| How to Know Higher Worlds | 19 | Five pedagogical groups, including orientation; chapter references occur inside lessons. These groups must not be mistaken for the book's chapter names. |
| The Philosophy of Freedom | 22 | Sixteen core readings and six optional practices; core path, philosophical overview and lecture companion share the index. |
| According to Luke | 12 | Orientation, ten lectures and synthesis in a flat reading list. |
| Colour | 14 | Orientation, twelve lectures and portfolio; collection and edition explanations precede a flat reading list. |
| The Four Temperaments | 11 | Optional source companion; source scope and flat reading list. |
| Understand Your Temperament! | 13 | Orientation, nine chapters, two appendices and synthesis; flat list despite source chapter structure. |
| Encountering the Self | 17 | Orientation, three book parts and appendices distributed across teaching divisions; flat list. |
| The Mystery of Temperaments | 15 | Teaching divisions of a continuous discussion, not fifteen source chapters; optional source companion. |
| Practical Training in Thought | 10 | Practice course, exercise-choice map and aggregated course journal. |
| Understanding Temperaments | 12 | Combined practice course drawing on three companions; aggregated journal. |
| Myth, Meaning and Human Consciousness | 8 | Orientation and seven lecture-based thematic readings; further-study entry. |
| Meditation and Inner Life | 9 | Separate session system, actual texts, prerequisite links and transient reflection downloads. |

Each ordinary lesson has previous/next controls, but these usually say only “Previous” and “Next lesson.” A reader must infer why the next idea follows. Chapter landing pages are absent from every audited index. Book parts, actual chapters, lecture numbers, teaching divisions and optional practices need explicit labels rather than one undifferentiated concept of “chapter.”

## Entry and navigation findings

The homepage H1 is “A space to wonder.” Its hero advertises ten courses, while its description metadata still advertises eight. Ten cards have equal visual prominence. A human-constitution reference and reading-method explanation appear before the begin button. Theosophy's entire 23-reading path also occupies the homepage.

The begin button was below the initial viewport: its top was 1,108 pixels at a 390-pixel screen width and 1,373 pixels at 320 pixels. The header of every audited course index contains language links but no primary content navigation. A newcomer receives no visible distinction between a progressive introduction, book study, practical themes and specialist research.

Recommended hierarchy:

| Level | Learner purpose | Navigation treatment |
| --- | --- | --- |
| **Learn Anthroposophy** | The proposed 36-lesson introduction organized by questions and concepts. | Dominant hero, a single “Begin the course” button and seven visible parts plus synthesis. Show this before source-library notices. |
| **Study the Books** | Complete existing book and lecture courses, retaining primary source sequence. | Separate book hub and a distinct Theosophy overview; links continue to existing lesson URLs. |
| **Themes and Applications** | Existing practical thinking, temperaments, meditation, colour and education material, plus connections to beginner application lessons. | Secondary hub grouped by actual available material. Avoid representing a topic mention as a completed specialist course. |
| **Research / Source Library** | Edition maps, extended notes, terminology, source limits and deeper comparisons. | Secondary hub linking useful research and the constitution reference, with clear routes back to learning. |

Every substantial source chapter should gain a short landing page showing its central question, learning aims and readings. A lesson should show course → part → chapter or lecture → reading, its position, and the next reading's title and reason. Continuous lectures and course-created divisions should retain their own honest labels. Add chapter pages around existing readings; preserve their URLs and saved identities.

## Teaching and long-page boundaries

Source passages already precede explanations on the 370 source pages. Preserve those credits and the distinction between quotation, explanation, example and context. Several pages mix a core guide, later lecture material, links to other courses, a worked example, activities, three note fields and multiple answer reveals. The human-constitution reference contains approximately 3,321 words; several English source lessons exceed 2,200 words before considering their source reading assignment.

These measures locate pages needing review; they are not an instruction to cut at a word limit. In book courses, show clear reading sections and move extended comparisons under an explicitly optional deeper-study area. Keep the material accessible and give its source. In the beginner course, keep one central question, a source excerpt or identified section, a short explanation, one key distinction, a useful example, two to four retrieval questions and a meaningful continuation.

Most existing checks reveal a suggested answer rather than responding to a selected answer. A few arithmetic, colour, dialogue and reflection labs offer immediate feedback. Ninety-two current HTML pages contain a numerical 0–2 self-assessment rubric. The new brief calls for feedback without arbitrary points: replace that scoring wording with a concise invitation to explain accurately, cite the reading, notice a missing distinction and try again. Preserve the reasoning and allow supported disagreement.

A maintainable comprehension component should use labelled radio groups or occasional true/false options, show a short explanation in a live status region, permit another attempt and offer a reveal. Reflection prompts remain open rather than automatically graded. Keep controls unobtrusive and usable without scripting through visible questions and suggested explanations.

## Saved notes and progress compatibility

The current storage contract is valuable and must remain stable:

| Storage item | Existing behavior |
| --- | --- |
| `anthro-study-v1:enabled` | Global opt-in preference; saving remains local to this browser. |
| `anthro-study-v1:<course>/<NN>` | Lesson record with separate `en` and `pt` notes, one shared `complete` flag and an update timestamp. |
| `anthro-study-v1:last` | Last lesson URL, title and course for resume links. |
| `first`, `source`, `after` | Standard note fields. |
| `session1`–`session3` | Extra dated practice entries for the two applied courses. |

A fresh, isolated browser test confirmed saving, export, restoring English after a Portuguese save, and completion shared across languages. Storage failures are caught. Export produces plain text; the two practice indexes also aggregate a course journal. Turning saving off does not delete old notes. Deleting a lesson clears both languages and its completion mark, but retains the global preference and last-lesson pointer, so the homepage can still offer that deleted lesson as “Resume.” The delete button should state its bilingual scope clearly, and the matching resume pointer can be cleared deliberately.

Do not rename existing `data-study-id` values or merge book and beginner completion marks. Add a distinct beginner identity such as `learn/00`, with clear per-part and course progress. Completion is a learner's study mark, not a graded score.

The existing resume validator accepts only local `/lessons/NN.html` paths. It cannot resume meditation's `/meditation/NN.html` routes or chapter pages. If new supported routes are added, validate origin and permitted route structure deliberately. Do not make arbitrary stored URLs navigable.

Meditation uses a separate `meditation.js` module. Its reflection is intentionally transient and disappears on reload; the page explains this and supplies a download button. Preserve that behavior or perform an explicit, tested enhancement rather than suggesting it already saves. The standard study script assumes that every `data-study-id` root contains note status, save, completion, preview, export and delete controls. New shorter lesson templates must supply that contract or guard optional controls.

## Browser and accessibility observations

Chromium checked representative pages at 320, 390 and 1,280 pixels. The audited pages produced no JavaScript exceptions. Each had a single main landmark and H1; sampled form fields had associated labels. The first keyboard target was the skip link. Note statuses use announced status regions, and source diagrams have existing textual descriptions. These are useful foundations, not a claim of complete accessibility certification.

One concrete narrow-screen defect was found: the three-column cognition table on Luke lesson 01 extended the document to 349 pixels at a 320-pixel viewport. Use a focusable, labelled horizontal table wrapper, or a readable alternative layout, instead of horizontal page scrolling. Preserve captions and row/column headers. Some language and continuation links on the constitution reference measured only 17 pixels high; primary navigation should have comfortably spaced targets.

Keep the present palette and readable typography while simplifying layout. Stack the hero and secondary choices on small screens, give the begin button an early position, allow breadcrumbs to wrap, and keep previous/next controls visible with useful labels. Use reduced-motion behavior already present in the styles. Test new chapter lists, feedback, expanded research sections and long source credits at narrow widths.

The read-only static checker passed all 398 existing pages, local links and anchors. Broken local links were not found in this baseline. The audit did not test external archive availability.

## Build order and idempotence

`build-all.mjs` imports `build-lessons.mjs`, which runs the remaining builders sequentially: Higher Worlds → Freedom → Luke → Colour → Temperaments → Childs → Koepke → Mystery → Freedom route and lecture guides → practice courses → myths → guided study → meditation → passage study → constitution → terminology links.

The homepage is both input and output. The initial builder expects the current intro/path/guide structure and extracts its favicon from the page. Higher Worlds recreates course markers before a path section. Later builders insert cards at the exact `</div></section><!-- courses:end -->` sequence, and practice consolidation relocates three source companions. Guided study skips a page already containing its script filename. This means a final homepage replacement alone can break the next full generation even if the first output looks correct.

Use a deterministic source-owned homepage seed or a dedicated homepage generator, then run the new hierarchy builder after the legacy content builders. Keep content generation distinct from navigation decoration. Derive hubs, chapter routes, language partners, lesson identities and expected counts from a shared manifest. Prove that a second full build produces identical bytes and exactly one copy of navigation, assets, note controls and source sections.

## Validation changes needed

| Existing checker | Required adaptation while preserving its useful checks |
| --- | --- |
| `check-site.mjs` | Replace the fixed 398-page total with manifest-derived pages. Handle the new beginner route before the legacy lesson fallback. Validate new hubs, chapter links and breadcrumbs. Count answer controls by purpose rather than counting every non-guided `details` element. |
| `check-guided-study.mjs` | Replace fixed 352 pages / 176 pairs and ten homepage cards. Adding 36 pairs with the same note contract produces 424 pages / 212 pairs. Check all identities and partner routes from the manifest. |
| `check-practice-courses.mjs` | Require both practice courses and all three source companions to remain reachable through the new hubs, instead of requiring exactly ten homepage cards. Preserve notebook fields, journal export, old identities and navigation. |
| `check-passage-study.mjs` | Preserve the current thirteen collections and 370 source pages. If all 36 beginner lessons use excerpts, that becomes 442 source pages; section-based paraphrases need their own typed validation rather than fabricated quotations. |
| `check-meditation.mjs` | Replace the homepage meditation-card location requirement with hub access; retain the eighteen sessions, complete selected texts, bilingual routes and download behavior. |
| Source-specific checks | Move homepage card-marker expectations to hub reachability. Keep edition evidence, verified page ranges, author/translator credit, source-guide contents and passages intact. |

Keeping the old 398 pages and adding 36 lesson pairs yields 470 pages before new bilingual hubs, chapter overviews and the distinct Theosophy index. Count those additional routes from the manifest rather than choosing a guessed total. Browser checks should cover each hub, chapter entry, first/middle/final beginner lessons, feedback/retry/reveal, old bilingual note restoration, export/delete, scripting disabled and narrow-screen overflow. Save a baseline of every existing route and study identity to demonstrate preservation.

The detailed baseline inventory, browser measurements, isolated storage results and implementation recommendations are recorded privately in `.sites-runtime/learning-system-2026-review/navigation-audit.json`. No active HTML, CSS, JavaScript or build script was changed by this audit.
