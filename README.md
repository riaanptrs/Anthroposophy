# Anthroposophy

A bilingual learning website for studying Anthroposophy in English and Brazilian Portuguese.

Research, source comparisons, lecture timestamps, illustration briefs and future improvements are tracked in the [research index](content/research-index.md). The [source register](content/source-register.json) identifies reviewed input files by filename and fingerprint. Full source books and lecture transcripts remain local; they are not backed up by this repository.

## Learning system

The homepage now leads into **Learn Anthroposophy**, a 36-lesson concept and question sequence in English and Brazilian Portuguese. **Study the Books** retains all 13 original collections and adds the biodynamics anthology, the complete Agriculture Course and the threefold-society opening: 16 collections and 232 reading pairs, with 57 chapter and part landing pairs and visible course/part/chapter/reading context. **Themes and Applications** maps 12 subjects to available study; **Research / Source Library** exposes 121 authored notes with current/archive labels and search.

Begin at `docs/learn/index.html`; the original Theosophy book course is at `docs/theosophy/index.html`, with its existing `docs/lessons/NN.html` URLs preserved. The original 177 passage records and 185 book checks remain unchanged. Fourteen separately stored anthology passages support the new biodynamics course and revised beginner lesson 32. This reviewed anthology includes GA 327 lectures 4–6; all eight Agriculture lectures are now covered in a separate eighteen-reading companion course. Social threefolding now draws on a reviewed fourteen-page OCR opening of GA 23, with seven readings and seven separate passage records. Its main chapters and native PDF remain absent; nutrition is a bibliography gap.

Edit beginner teaching in `content/learning-lessons-01-12.json`, `learning-lessons-13-24.json` and `learning-lessons-25-36.json`; source mappings in `learning-system-sources.json`; book hierarchy/questions in `learning-system-catalogue.json`; retrieval checks in `learning-book-checks.json`; and research metadata in `learning-system-research-map.json`. The final `scripts/build-learning-system.mjs` pass retains original course guides, sources, practice journals and note identities. Source-owned legacy home templates keep the existing build chain repeatable.

Checks are brief and unscored, with explanations and retry. Beginner notes/completion use a separate opt-in local namespace; old notebooks retain their keys and bilingual content. Full book texts and uploaded transcripts remain private. Research bodies retain their original English; bilingual indexes identify that clearly.

Build with `node scripts/build-all.mjs`, then run every `scripts/check-*.mjs` (25 validators, including `check-practical-thinking.mjs`, `check-learning-system.mjs`, `check-introduction-anthroposophy.mjs`, `check-biodynamics-source.mjs`, `check-agriculture-source.mjs` and `check-threefold-source.mjs`). Use `node scripts/preview.mjs` for local browser checks. No package installation is required. See the [revision summary](content/learning-system-review.md) and [site audit](content/learning-system-site-audit.md).

The separate **Introduction to Anthroposophy** course is at `docs/introduction-to-anthroposophy/index.html`, mirrored under `docs/pt/`. All 28 lessons in seven parts are available in English and Brazilian Portuguese, with precise source assignments, original explanations, unscored comprehension checks and part syntheses. GA26 uses the supplied George and Mary Adams EPUB and numbered Leading Thoughts. The existing 36-lesson path, Theosophy, book courses and their saved records remain separate and preserved. Edit `content/introduction-anthroposophy-lesson-NN.json` and the [source plan](content/introduction-anthroposophy-plan.md); the dedicated builder runs before shared navigation. See the [implementation and validation review](content/introduction-anthroposophy-review.md).

## What Is Biodynamics?

The complete supplied anthology was reviewed across all 135 PDF captures and the matching Markdown. Its fourteen bilingual readings begin at `docs/what-is-biodynamics/index.html` and distinguish Courtney’s introduction, Steiner’s seven lectures and editorial commentary. See the [revision summary and page notes](content/what-is-biodynamics-reading-review.md).

Edit teaching in `content/what-is-biodynamics.json`, quotations in `content/what-is-biodynamics-passages.json`, choice questions in `content/what-is-biodynamics-checks.json` and provenance in `content/what-is-biodynamics-source-map.json`. The full build runs the anthology builder before the shared learning layer. The original passage registry and question bank remain separate.

## Agriculture Course — complete lecture sequence

The biodynamics path now includes all eight GA 327 lectures and four discussions in eighteen English/Portuguese readings, beginning at `docs/agriculture/index.html`. Both supplied Markdown editions were reviewed page by page (192 + 178 captures). The PDFs exceed the transfer limit; diagrams and PDF layout remain unverified. The 1993 export ends during the bibliography. See the [revision and detailed reading notes](content/agriculture-reading-review.md).

Edit `content/agriculture.json`, the separate passage/check banks, and `content/agriculture-source-map.json`. The full build also generates eight lecture landing pairs and links this complete course from the anthology, beginner path and biodynamics theme.

## Toward a Threefold Society — supplied opening

The fourteen-page OCR Markdown supplies front matter, Frank Thomas Smith’s introduction and Steiner’s 1920 preface. All blocks were reviewed; no PDF or main-chapter bodies were supplied. Seven bilingual readings begin at `docs/toward-threefold-society/index.html`; beginner lesson 35 now draws on the preface. See the [bounded revision and page notes](content/toward-threefold-society-reading-review.md).

Edit teaching in `content/toward-threefold-society.json`, separate quotations/checks in `toward-threefold-society-passages.json` and `toward-threefold-society-checks.json`, and provenance in `toward-threefold-society-source-map.json`. Source references are Markdown page markers, with no invented PDF or printed pagination. A complete GA 23 book is still needed for its main-chapter argument.

## Website

The generated static website lives in `docs/`. Viewing or hosting it needs no installation.
Open `docs/index.html` locally to preview it. The Portuguese edition is in `docs/pt/index.html`.

To publish with GitHub Pages, use **Settings → Pages → Deploy from a branch**, choose the branch containing these files, and select **/docs**. The expected address is https://riaanptrs.github.io/Anthroposophy/ once Pages is enabled and deployment succeeds.

## Developing the lessons

The **Theosophy course follows all 94 captures of the newly supplied Elizabeth Douglas Shields translation (1910), reissued by Delhi Open Books**. Its 28 bilingual readings retain the four source chapters, distinguish the course’s teaching divisions, and provide precise source assignments, reasoning, brief comprehension checks and chapter syntheses. The 1971 Monges/Church edition and its thirteen addenda remain separately identified historical and parallel material. See the [current revision review](content/theosophy-guided-review.md) and [primary source map](content/theosophy-guided-source-map.json). Run `node scripts/check-theosophy.mjs` after the complete build.

The **thirteen primary book and practice courses**, including Meditation, Agriculture, What Is Biodynamics? and the threefold-society introduction/preface, use a source-first reading sequence: an attributed excerpt or precise source assignment, explanation, chapter teaching, example, and practice. The 177 selections in `content/passage-study.json` cover the original 185 English readings and their Portuguese partners. Fourteen anthology selections are kept in `content/what-is-biodynamics-passages.json`; seven Markdown-only opening selections are in `content/toward-threefold-society-passages.json`. Edit the appropriate source collection to revise passages or close-reading notes, then run the complete build and all validators. See [edition choices and verification](content/passage-study-review.md).

Earlier connections with *The Philosophy of Freedom* and Brian’s preface lectures remain in `content/philosophy-of-freedom-connections.mjs` as historical material. The active Theosophy course keeps its primary source argument central and offers further-book links in its final synthesis. The separate GA 4 course publishes the reviewed material through Chapter 14 and the conclusion: 16 core lessons and six optional exercises, in both languages.

The **Philosophy of Freedom** course has been revised against the supplied 166-page Michael Wilson PDF and matching Markdown (Rudolf Steiner Press, 2012, eighth English edition). Its sixteen core lessons and six optional practices retain their URLs and notebooks. See the [book-based revision and page notes](content/philosophy-of-freedom-course-review.md). The seventeen supplied Brian Gray/Wise Cosmos transcripts now support twenty-one bilingual lecture guides with original examples and explained questions. See the [lecture integration review](content/philosophy-of-freedom-lecture-integration-review.md). Chapter 8 is now integrated; a dedicated conclusion transcript remains unavailable.

The site now offers **thirteen primary bilingual book and practice courses**: Myth, Meaning and Human Consciousness (8 lessons), Practical Training in Thought (12 core lessons plus 1 optional forecasting exercise), Understanding Temperaments (12 lessons), Theosophy (28), How to Know Higher Worlds (19), The Philosophy of Freedom (16 core lessons plus 6 optional exercises), According to Luke (12), Colour (14), Encountering the Self (17), Meditation (9), What Is Biodynamics? (14), Agriculture (18), and Toward a Threefold Society — Introduction and Preface (7). The separate Introduction to Anthroposophy (28 lessons) brings the primary course total to fourteen, alongside the 36-lesson beginner path. Three earlier temperament book companions remain in the optional source library, with all 39 lessons, URLs and notebooks preserved. The new temperament core combines their teaching into one subject path.

Edit Course 2 in `content/higher-worlds.mjs` and its four short GA 9 supplements in `content/higher-worlds-connections.mjs`. Every Course 2 lesson includes a worked example, explanation, source assignment, glossary, activity, three answer checks, a rubric and a link back to Course 1. Its nineteen bilingual lessons have been revised against every page of the supplied **108-page PDF** (Dead Authors Society, 2018), with thirteen English passages verified against the images and six retained German parallel readings with study translations and revised commentary. The smaller PDF and both identical Markdown uploads contain a different book. See the [revision summary and page-by-page notes](content/higher-worlds-course-review.md); run `node scripts/check-higher-worlds.mjs` after the full build. Full source books remain private; selected, attributed passages appear in the public lessons.

`node scripts/build-all.mjs` (or `node scripts/build-lessons.mjs`) builds all courses and source companions in order. `node scripts/check-site.mjs` checks all generated pages, their links and anchors, language pairs, required learning sections and content completeness. The source comparison and editorial history remain in `content/higher-worlds-reading-review.md` and `content/higher-worlds-course-plan.md`.

The [original book-course outline](content/course-outline.md) follows Rudolf Steiner's **Theosophy / Teosofia (GA 9)**. The concept-based beginner path now precedes these detailed book courses. The [chapter-by-chapter teaching plan](content/theosophy-chapter-teaching-plan.md) records the source analysis. The active Theosophy course now contains an introduction, 26 chapter readings and a final synthesis in both languages.

Within the Theosophy book course, begin at `docs/theosophy/index.html`. Its Introduction distinguishes comprehending an account from investigating its objects. Reading numbers follow the chapter sequence; source citations use PDF captures because the Kindle export does not establish printed pagination. Writing and saved progress are optional, and existing bilingual notebook records remain compatible.

Edit the active course in `content/theosophy-guided-introduction.json`, `theosophy-guided-chapter-1.json` through `theosophy-guided-chapter-4.json`, and `theosophy-guided-synthesis.json`. `content/theosophy-guided.mjs` loads these files; `scripts/build-theosophy-guided.mjs` runs in the complete build after the historical builders. Always run `node scripts/build-all.mjs` to regenerate the final website. Earlier modules, source banks and source notes remain available as historical material.

Each standard Theosophy reading identifies its primary text before explaining the argument, defining a key term and checking comprehension. A selected quotation appears only where its wording has been verified; other readings assign a precise book section. Course examples and Portuguese study translations are explicitly identified. One optional deeper task and model response conclude each chapter, followed by an architecture-based final synthesis.

1. Supply a book, excerpt, or transcript, together with available author, edition, page, or timestamp information.
2. Identify the learning objectives and create a draft using `content/lesson-template.md`.
3. Prepare matching English and Brazilian Portuguese lessons, a glossary, reflection questions, and review answers.
4. Review source accuracy and translations before adding published lesson pages under `docs/` and linking them from both homepages.

The editorial plan remains a working record. The published lessons are introductory reading companions, with source assignments for deeper study; they do not reproduce the book or claim expert endorsement.

Keep original source files intended only for preparation in `.sources/` (ignored by Git). Publish only material intended for the website. The `content/` folder contains editorial templates and is outside the Pages publishing folder.

## Design

Responsive, accessible static HTML and CSS with matching language navigation, semantic headings, visible keyboard focus, and no third-party scripts or services.

## According to Luke course

Course 4 starts at `docs/according-to-luke/index.html`, with matching Portuguese pages under `docs/pt/according-to-luke/`. Edit `content/according-to-luke.mjs` and the three supplements in `content/according-to-luke-connections.mjs`. The supplied capture includes only the introduction and part of Lecture 1; the complete ten-lecture sequence uses a clearly identified parallel primary edition. See the [source review and lecture map](content/according-to-luke-reading-review.md). Lessons distinguish Gospel text, spiritual interpretation and the reader's judgment, with original examples, activities, answer checks and a final portfolio. The build adds six supplementary sections across the English and Portuguese versions of GA 10 Lesson 10 and GA 4 Lessons 16 and 20.

## Philosophy of Freedom course

The course starts at `docs/philosophy-of-freedom/index.html`, with matching Portuguese pages under `docs/pt/philosophy-of-freedom/`. Edit the active 22 bilingual book lessons in `content/philosophy-of-freedom-consolidated.mjs`, the twenty-one lecture companions in `content/philosophy-of-freedom-lecture-guides.mjs`, source selections in `content/passage-study.json`, and study prompts in `content/guided-prompts.mjs`. The older split-chapter modules remain historical material and no longer supply the active lesson teaching. The core follows both prefaces, all fourteen chapters, the conclusion and the 1918 appendix; six optional workshops retain their existing links and notebooks. See the [book-based review](content/philosophy-of-freedom-course-review.md) and its complete page ledgers.

## Colour course

Course 5 starts at `docs/colour/index.html`, with matching Portuguese pages under `docs/pt/colour/`. All 158 captures of the supplied PDF and Markdown have been reviewed, including twelve lectures and editorial notes. Fourteen bilingual lessons now include full reading guides, source-based questions, thirteen verified English selections covering all fourteen lessons, precise capture/column credits and four accessible relationship tables. Edit `content/colour.mjs`, `content/colour-source-guides.mjs`, `content/colour-visuals.mjs` and `content/colour-connections.mjs`. The imprint identifies Salter for Lectures 1–3 and Wehrle for 4–12, with translation copyright 1992; this copy's publication year is unstated. Existing colour studies, interactive lab and three paired course connections are preserved. See the [revision and page ledgers](content/colour-course-review.md); run `node scripts/check-colour-source.mjs` after the full build.

## The Four Temperaments course

Course 6 starts at `docs/temperaments/index.html`, with matching Portuguese pages under `docs/pt/temperaments/`. Eleven lessons divide the single Berlin lecture of 4 March 1909 into orientation, nine study sections and synthesis. Edit `content/temperaments.mjs` and `content/temperaments-visuals.mjs`. Three existing lessons receive bilingual supplements: GA 9 Lesson 6, GA 10 Lesson 7 and GA 4 Lesson 20. The [source review and teaching map](content/temperaments-reading-review.md) records the superseded capture gaps, the parallel edition and the distinction between original claims and teaching adaptations. The course includes reading maps, examples, activities and explained answers, without a personality test.

The complete 23-capture PDF supplied on 30 September 2026 has been read page by page. All eleven bilingual lessons now include a source guide and verified passage from the 2012 B. Kelly translation, revised by Matthew Barton (revision copyright 2008). The complete lecture in captures 6–13 supersedes the earlier capture gaps. Ten related primary-course lessons use the same edition, while the two Childs lessons keep their own source. See the [completed revision and page notes](content/four-temperaments-course-review.md).

## Understand Your Temperament! course

Course 7 starts at `docs/understand-temperament/index.html`, with Portuguese pages under `docs/pt/understand-temperament/`. This is Gilbert Childs’s later guide, kept distinct from Steiner’s lecture. Thirteen bilingual lessons cover the nine chapters, both appendices, orientation and synthesis. Edit `content/understand-temperament.mjs` and `content/understand-temperament-visuals.mjs`. Four lessons in the preceding Temperaments course gain bilingual supplements. The [source review and chapter map](content/understand-temperament-reading-review.md) preserves the earlier capture record and links the corrected map.

The complete 97-capture PDF and Markdown supplied on 30 September 2026 have been reviewed page by page. All thirteen bilingual lessons now begin with verified Childs passages, followed by chapter explanations and source-comprehension questions. Nine chapters, both appendices and the references are covered; readable diagrams support four source-based teaching tables. The relevant combined-course lessons and two earlier Childs connections have been refined. Edit `content/childs-temperament-source-guides.mjs` for the source teaching and `content/childs-temperament-core-additions.mjs` for combined-course additions. See the [completed revision and full page notes](content/childs-temperament-course-review.md).

## Encountering the Self course

Course 8 starts at `docs/encountering-the-self/index.html`, with matching Portuguese pages under `docs/pt/encountering-the-self/`. Seventeen lessons follow Hermann Koepke’s parent conversations, biography, developmental account, curriculum, school-doctor contribution and all four appendices. Edit `content/encountering-the-self.mjs` and `content/encountering-the-self-visuals.mjs`. Three existing lessons gain bilingual supplements: GA 10 Lesson 03, Temperaments Lesson 08 and Colour Lesson 01. The [source review and section map](content/encountering-the-self-reading-review.md) records the corrected capture positions, constructed conversations, historical medical claims and limits of proposed cosmic correspondences.

All 76 PDF captures and matching Markdown pages supplied on 1 October 2026 have now been reviewed. The seventeen bilingual lessons each include a source guide, an individually verified short passage and three source-comprehension questions. The new native copy resolves earlier interruptions and provides readable diagrams, including the dental chart. Six accessible original tables clarify the source’s relationships; the original reflection SVG remains. Three existing related supplements were refined while their parent lessons were preserved. English 1989 edition particulars are verified; the electronic publication date is unstated. See the [completed review and all page notes](content/encountering-self-course-review.md). Edit `content/encountering-self-source-guides.mjs` and run `node scripts/check-encountering-self-source.mjs` after the full build.

## The Mystery of Temperaments companion

Course 9 starts at `docs/mystery-temperaments/index.html`, with Portuguese pages under `docs/pt/mystery-temperaments/`. All 33 supplied PDF captures and Markdown pages were reviewed: discussion in 3–31, advertisements excluded in 32–33. Fifteen bilingual lessons now include source guides, fifteen image-verified short passages, three source checks per lesson and two accessible teaching tables. The supplied translation and edition remain unidentified; its native repetitions and damaged wording are documented. The Dawson translation remains a separately credited parallel. Three scoped additions improve the combined temperament course while preserving its twelve primary passages and existing practical cases. See the [completed revision and page notes](content/mystery-temperaments-course-review.md); edit `content/mystery-temperaments-source-guides.mjs` and run `node scripts/check-mystery-temperaments-source.mjs` after the full build.

## Guided study

All 176 lesson pages per language now offer a first attempt, optional hint, expandable explanation, source connection and revised answer. Selected lessons include arithmetic feedback, colour comparisons, staged conversations and revealable diagrams. Notes and study marks save only after the learner opts in, on this browser and device; export a copy to retain it elsewhere. There is no account or device sync.

Run `node scripts/check-guided-study.mjs` alongside the site checker. See [implementation notes](content/guided-study-implementation.md) and [the Mystery source review](content/mystery-temperaments-reading-review.md).

## Consolidated Philosophy of Freedom

One main path follows the complete Wilson 2012 edition: orientation, fourteen chapter lessons and conclusion/synthesis, including the 1918 additions and appendix. Earlier Amrine comparisons and Brian lecture reviews remain separately attributed supplementary material. Six former split-chapter exercises remain optional at their existing URLs. Edit `content/philosophy-of-freedom-consolidated.mjs` and build with `node scripts/build-all.mjs`. Run `node scripts/check-freedom-route.mjs`, `node scripts/check-freedom-source.mjs` and `node scripts/check-freedom-lectures.mjs` to check chapter coverage, core navigation, all 166 page records and current source credits. See the [book-based review](content/philosophy-of-freedom-course-review.md).

## Practice courses and unified temperaments

Practical Training in Thought now revises the existing material into twelve source-led lessons in four parts, with four syntheses and the original forecasting route retained as optional. Edit `content/practical-thinking-part-1.json` through `practical-thinking-part-4.json` and `practical-thinking-forecast.json`; `scripts/build-practical-thinking.mjs` renders the final course during the complete build. Its [complete GA 108 source map](content/practical-thinking-source-map.json) records all 48 available translated paragraphs, source exercises, exact excerpts and the untranslated paragraph 49. The [revision review](content/practical-thinking-review.md) explains the source-conditioned sequence and preservation decisions. Existing URLs and bilingual notes retain their topic identities; saving, compact notes and progress remain optional.

Understanding Temperaments still uses `content/temperament-course.mjs` and the original `scripts/build-practice-courses.mjs` flow, with its three dated entries per lesson and course journal unchanged. The Philosophy of Freedom retains its existing optional practice bridges. Run `node scripts/check-practical-thinking.mjs` and `node scripts/check-practice-courses.mjs` as well as the other site checks. The [earlier implementation notes](content/practice-courses-implementation.md) remain historical context.

## Ancient Myths

The eight-lesson `ancient-myths` route follows the seven lectures in the supplied 1971 Cotterell edition, with orientation, original examples, interpretation maps, activities and a final adult teaching project. Edit `content/ancient-myths.mjs`; the builder adds four optional connections to existing courses. Run `node scripts/check-ancient-myths.mjs`. See [source and teaching review](content/ancient-myths-review.md).

## Meditation and Inner Life

Nine bilingual guided sessions at docs/meditation/index.html and docs/pt/meditation/index.html use Start Now!, Weekly Meditations and The Foundation Stone. They include a daily verse, four complete Calendar verses and the complete Foundation Stone in new study translations of its printed German original. Source directions, editorial commentary and course adaptations are distinguished. Build with node scripts/build-all.mjs; validate with node scripts/check-meditation.mjs and the existing site checks. See content/meditation-reading-review.md for source scope and transcription decisions.
