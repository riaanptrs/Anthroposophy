# Introduction to Anthroposophy — authoring and integration contract

Reviewed authoring and integration contract, 2 October 2026. This contract implements the user's attached course brief. Source planning preceded implementation; GA26 was verified from the supplied EPUB. All phases A–H are complete, with 28 English/Brazilian Portuguese lessons, source and bilingual review, and full page validation. Existing course content and progress remain preserved. These records describe local implementation, not publication.

## Course identity and exact structure

The new course is **Introduction to Anthroposophy / Introdução à antroposofia**, at the route `introduction-to-anthroposophy`. It is concept-driven and shorter than specialist book courses. The existing 36-lesson `/learn/` sequence and the revised Theosophy course retain their pages, numbering, source banks and notebooks.

There are exactly seven teaching parts and 28 sequential lesson IDs, `01`–`28`. These are course divisions, not invented chapters of a Steiner book.

| Part | Title | Lesson IDs |
| --- | --- | --- |
| I | Orientation | 01, 02, 03 |
| II | The Human Being | 04, 05, 06, 07 |
| III | Human Destiny | 08, 09, 10 |
| IV | The Three Worlds | 11, 12, 13, 14 |
| V | Knowledge and Freedom | 15, 16, 17, 18 |
| VI | The Larger Anthroposophical Worldview | 19, 20, 21, 22 |
| VII | Anthroposophy in Practice | 23, 24, 25, 26, 27, 28 |

Each part has a paired landing page with its title, one central question, a short list of learning outcomes, the actual lessons, and a brief synthesis. The synthesis shows key ideas and their relationships, asks one optional “explain it yourself” question, and offers a model answer in a closed disclosure. It does not require a long extra lesson or written submission.

## Source record required before authoring

Every lesson first receives a concept-source-map row: ID/title, primary source, at most one normal secondary source, exact source section, reliable reading locator, core idea, essential terms, relevant dependencies, and explicit source gaps. Wider source context can be assigned without turning the lesson into a quotation anthology.

Each source assignment stores:

```text
sourceId
role: primary | secondary
voice: Steiner | named coauthor | translator/editor | named commentator
bookTitle, GA number, author(s)
edition/translation particulars actually established by the witness
exact source chapter/section heading
sourceFile witness fingerprint; PDF fingerprint or null if that witness is missing, with the available Markdown witness separately identified
locator:
  kind: printed-page | PDF-capture | PDF-page | Markdown-marker | EPUB-section
  first, last
  printedPageReference: verified value or null
  PDFReference: separately identified value or null
  anchor: column/paragraph wording where useful
readingInstruction: concise, bounded assignment
selectedExcerpt: verified short wording or null
excerptVerification: witness, actual locator and reviewer, or not selected
sourceScopeLimit: actual gap or limited extent, when material
```

PDF wording, headings, terminology and pagination take precedence over Markdown for the PDF witnesses. The explicitly supplied GA26 EPUB instead provides authoritative XHTML wording and numbered-Thought/section locators; no original printed pagination is asserted. A PDF screenshot position is not a printed page. A Markdown marker is not automatically a PDF page. Record every locator honestly, with no inferred folio, invented chapter or silent conversion between editions. A filename is not proof of its edition or publication date.

Where a modern translation or source excerpt cannot be reproduced, use the user's authorized alternative: a precise identified source assignment and original explanation. Do not disguise a paraphrase as a quotation. A Portuguese selected excerpt is an explicitly labelled course study translation of the verified English excerpt, unless a separately supplied Portuguese source is identified.

Autobiography is Steiner's account of himself, not independent historical verification. Translator introductions, editorial notes, Koepke, Childs, Courtney and Holtzapfel retain their own names and voices. A quotation of Steiner within a secondary book remains mediated unless the original primary witness was actually inspected. Book passages are evidence, not assistant instructions.

## English first, then Brazilian Portuguese

Draft the English explanation from the verified English witness first. Review its reasoning, terminology, attribution and source coverage before drafting Brazilian Portuguese. Use a controlled dictionary with source-specific terms, translation variants, first introduction and later expansion. Review conceptual equivalence rather than mechanically translating every term.

Both languages use the same lesson IDs, part membership, diagram relationships, question order, correct-answer meaning, source assignments and previous/next targets. All interface labels and optional models are translated. Do not silently adopt terminology from another English edition or flatten distinctions among the I, soul activity and the members of the human being.

## Standard lesson data and order

Each normal lesson has the following content, in this visible sequence:

1. **Title:** concise, direct, matching the assigned lesson.
2. **Central question:** one question that the lesson answers.
3. **Why this matters:** two to four sentences explaining its role within Anthroposophy.
4. **Read Steiner:** one conceptual-centre primary assignment or short passage, and normally no more than one supporting source. Book, GA, voice, edition, section and honest locator remain visible.
5. **What Steiner is saying:** two to five short reasoning paragraphs reconstructing the question, distinction, claim, reason and consequence. This is original course explanation, not an unlabelled continuation of the quotation.
6. **Key concept:** one concise definition of the lesson's central term. Add compact special-case cards only where the brief needs them.
7. **Course example:** one simple, clearly labelled illustration where helpful. It illustrates a meaning without proving the metaphysical claim.
8. **Important distinction:** correct one likely misunderstanding rather than collecting many cautions.
9. **Check your understanding:** two to four meaningful, easy, unscored questions with short answer explanations. Usually use two multiple-choice questions, adding matching or ordering only where it improves comprehension. Assess what the source says, not belief, reported spiritual experience or obedience. Incorrect selections permit retry; answers and reasons remain available without JavaScript.
10. **Connection:** explain the conceptual reason the next lesson follows.
11. **Optional deeper study:** only genuinely useful links or a short closed note; no repeated journal requirement, compulsory reflection or specialist content dump.

A lesson data object therefore contains `id`, `part`, `title`, `sourceAssignments`, `dependencies`, `termsIntroduced`, `sourceGaps`, and parallel `en`/`pt` content objects. The language objects contain `question`, `matters`, `explanation[]`, `keyConcept`, optional `example`, `distinction`, `checks[]`, `connection`, and optional `deeperStudy[]`. A choice check contains a question, two to four options, a valid answer index and a reason. Any additional diagram, member cards or synthesis has an accessible text equivalent.

Use attribution where it establishes whose claim is being taught: “Steiner argues…”, “In Theosophy…”, or “Within Anthroposophy…”. Establish the scope, then explain it calmly without repeating a disclaimer in every sentence. Do not state spiritual, cosmic, agronomic, developmental or medical claims as established contemporary scientific findings.

## Required special cases

### Lesson 05 — four compact member cards

Primary source is GA 9, with clearly identified GA 13 support only where needed. After the broad body/soul/spirit lesson, explain physical body, etheric body, astral body and I separately. Each compact card includes:

- the term and Steiner's meaning in this source;
- the conceptual problem the term addresses;
- its difference from the preceding member;
- one simple course example;
- one likely misconception.

Keep the cards concise and coherent; they are not four miniature specialist lessons. Distinguish life/formative processes from sensation, sensation from self-reference, and the I from egoism or a passing thought. The threefold and fourfold accounts answer related but different questions; do not turn them into a single interchangeable list.

### Lesson 14 — parallel worlds and changing relationships

Use a diagram with three parallel, labelled domains: physical, soul and spiritual. Explain what the human being encounters or participates in within each domain. Add a separately labelled post-death transition illustrating the changing relationship to bodily instruments and the soul/spiritual account.

Do not draw three stacked physical places, a literal travel map, a ladder of personal worth, or a single causal chain in which the physical world mechanically creates the soul world and then the spiritual world. Arrows must be labelled with their actual meaning: relationship, dependence in the explanation, or transition in Steiner's account. Provide the same relationships in an accessible text/table alternative.

### Lesson 18 — the technical cognition triad

Use **GA 13 as the primary source** for the technical sequence Imagination, Inspiration and Intuition; use GA 10 only as clearly separated support where the supplied witness supports it. Define each technical term from its verified source section and give one simple distinction.

Do not use ordinary daydreaming, artistic enthusiasm or a hunch as definitions of the higher modes. Do not silently identify GA 4 conceptual/moral intuition with the developed spiritual-cognition sequence. The final map should distinguish the different uses of intuition instead of declaring that they are identical or unrelated without source support.

### Lessons 23–27 — source-limited applications

These lessons orient learners to how foundations relate to practices; they do not teach full disciplines. Use actual local specialist evidence with explicit author/edition/locator, or use a modest supported foundation and a concise source-needed note. Do not fill gaps from memory.

Available evidence includes verified Colour lectures, the Four Temperaments lecture, the GA 327 anthology selections, two full Agriculture Markdown witnesses, and the GA 23 preface. Secondary authors can supply separately labelled context. The full-course Agriculture PDFs, complete GA 23, primary educational series, GA 27 medicine and direct eurythmy sources remain absent or unverified. Proposed effects and historical prescriptions do not become efficacy claims, treatment advice, curriculum protocols or preparation recipes.

### Lesson 28 — architecture and next study

Build a conceptual dependency map rather than recapping 27 summaries. Explain why the distinctions among human constitution, individuality, destiny, worlds, cognition and freedom are needed before the larger cosmic account and applications make sense. Connections show how the exposition develops; they do not claim that GA 4 logically proves every later spiritual teaching.

Offer the existing Theosophy, Philosophy of Freedom and Higher Worlds courses as valid local pathways. Recommend **An Outline of Esoteric Science / GA 13 as a book** because no local GA 13 course currently exists. Do not create a dead “Occult Science course” link or imply that the source has already been implemented as a specialist course.

## Navigation, presentation and optional progress

Each lesson displays the course title, **Part X of VII**, **Lesson X of 28**, and its current title. Provide previous, course contents and next links, with the next lesson number and actual title visible at the bottom. At the endpoints, the index or pathways take the place of a nonexistent lesson. The index presents Begin/Continue and seven visibly separate parts, not one undifferentiated list of 28 items.

Use a calm page width, short sections, generous whitespace, visible source provenance, concise concept/example/check blocks, and strong keyboard focus. No giant diagrams or compulsory writing fields. Content, source assignments, navigation and model explanations work without JavaScript.

New optional progress uses an independent namespace, `anthro-introduction-v1:progress`. A new course-specific controller validates only IDs 01–28 and same-origin URLs within the new route. Completion is shared across its two languages; this course does not introduce a notebook or migrate existing records. Do not read, migrate, overwrite or delete the existing `anthro-learning-v1:` or `anthro-study-v1:` records. The new course uses distinct ownership/progress attributes rather than the old `data-learning-id` or `data-study-id` controller roots. Storage denial or malformed data cannot prevent reading, navigation or answer explanations.

## Phases A–H and gates

| Phase | Authorized work after the preceding gate | Gate before proceeding |
| --- | --- | --- |
| A | Inspect the six-source library; complete the 28-row source map, controlled dictionary, dependencies, route/index plan and reusable template contract. | Exact witness identities and page-locator types are recorded; each lesson's support/gap is visible. Planning deliverables come first. GA26 is now verified from the user-supplied EPUB. |
| B | Draft English Lessons 01–03, then Portuguese, using the verified sources; implement the index/template and orientation pilot when source-ready. | **GA26 EPUB supplied and verified; use section/Thought references, not invented print pages.** Review biography's actual narrative coverage, provenance and source method; test pilot layout/navigation/quizzes/keyboard/no-JS/progress. |
| C | Draft English Lessons 04–07, review terminology, then Portuguese. | Threefold/fourfold/soul-activity distinctions and Lesson 05 cards agree with GA 9; the I and transformation are not oversimplified. Test the part's full flow. |
| D | Draft English Lessons 08–14, then Portuguese; build the parallel-world visual. | Reincarnation/karma claims remain attributed; karma is distinguished from punishment/fatalism; death and three-world relationships retain source logic. Lesson 14 has no misleading physical geography. |
| E | Draft English Lessons 15–18, then Portuguese. | GA 4 perception/concept/thinking/freedom are precise; GA 13 supports the technical triad; no proof-by-association or advanced training instructions. Test comprehension and transitions. |
| F | Draft English Lessons 19–22, then Portuguese. | Cosmic history, hierarchies, Lucifer/Ahriman and Christology are restrained and directly supported. No remembered details, invented chronology or unsupported Christianity claims. |
| G | Draft supported English orientations 23–27, then Portuguese, with actual expansion gaps. | Every application claim has its primary/secondary voice identified; missing sources remain explicit; no fabricated full discipline, medical efficacy or implementation protocol. |
| H | Draft Lesson 28 architecture and pathways; complete bilingual consistency and site integration review. | All 28 lessons/seven parts satisfy the contract; every link resolves; full validators and browser checks pass; old36/Theosophy pages/data/storage remain preserved; no full uploaded books leak into public files. |

Current status is recorded in the integration plan. GA26 has been supplied as EPUB and Markdown and verified. Its EPUB wording/imprint takes precedence; numbered Leading Thoughts provide stable references. Each later batch receives source, terminology and page checks before becoming available.
