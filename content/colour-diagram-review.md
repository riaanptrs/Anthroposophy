# Colour: diagram and teaching-visual review

Review date: 2026-09-30. This is a recommendation report; it does not change the visual module, stylesheet, builders, or the existing interactive colour lab in Lesson 2.

The supplied book’s diagrams survive in the capture images, chiefly as monochrome hatching. OCR often preserves isolated colour names while losing the geometry, arrows, and alignment that connect them. The current teaching visuals are generally accurate, explicitly original studies. The strongest improvement is to add four accessible source-based relation tables, rather than imply that a digital colour rendering reproduces the book.

## Provenance and review method

- Source: `.sources/colour-2026-review/metadata.json`, `page-NNN.md`, and `images/capture-NNN.jpeg`. The 158-page PDF is identified by SHA-256 `3c2ae7c5222ebcf34c6b23f3e4f952cbc49a3dc5f3c9720e708b293db77120bd`.
- All page numbers below are **supplied capture numbers**. They are not another edition’s printed pagination. Each capture has up to three text columns; “c1”, “c2”, and “c3” mean left, middle, and right.
- Direct visual inspection covered captures 016, 022–024, 027, 030, 042, 104, 106, 109–110, 116–117, 125–126, 133, 138, 140–142, 144, 149–150. The parallel page ledgers supply the complete range census. Relevant OCR was read for Lectures 1–3, perspective, Titian, qualitative measure, hierarchies, References at 146, and Notes 147–152.
- Existing implementation reviewed: `content/colour-visuals.mjs` and `docs/colour.css`. The interactive `data-lab="colour"` in Lesson 2 is a separate teaching activity and should remain intact.
- Book and OCR text were treated as source data, including their editorial qualifications, not as instructions.

## What survives in the book

| Capture and position | Surviving source visual | What OCR loses / correct reading |
|---|---|---|
| 016, all columns | Prose describing red, peach-blossom, and blue figures on green; no accompanying three-field picture in this capture | “I place” and “I have drawn” are lecture descriptions, not evidence of an embedded colour image. Any three-field teaching study is an original reconstruction from the prose. |
| 022, c2–c3; 023, c1 lower | Four image formulas, then a circular scheme | At 023 the outer circle goes clockwise: **Lifeless** at top, **Living** at right, **Soul** at bottom, **Spirit** at left. Inner colour positions are **Black**, **Green**, **Peach-blossom**, **White** respectively. The middle ring spells out the four image relations. The outer dashed arrowheads show the cycle; the text at 022 says the adjective comes from the preceding point. OCR replaces much of this with punctuation and scattered fragments. |
| 024, c3 top | Three-column table: **Shadow-thrower / Illuminant / Image** | Four aligned rows survive in the image: spirit / lifeless / black; lifeless / living / green; living / soul / peach-blossom; soul / spirit / white. OCR groups column entries together and misspells “Illuminant”, obscuring the row relationships. The paragraph explicitly anticipates an apparent contradiction; do not turn the table into a physical optics diagram. |
| 027, c3 top | Three monochrome hatched sketches labelled **yellow**, **red**, **blue**, in that left-to-right order | Yellow has a concentrated dark centre and sparse outer marks; red is filled comparatively evenly; blue has a dense perimeter and a lighter centre. The source contains no RGB values. The accompanying text allows shapes other than circles. OCR keeps the three labels but loses density, boundary, and distribution. |
| 030, c3 upper | Folded/expanded spectrum scheme, distinct from the four-image circle at 023 | **Black** is at the top; **Peach-blossom / Image I** at the upper centre; **Green / Image II** below; **White** at the bottom. The left side is **Lustre III**, with **Red, Orange, Yellow** descending; the right side is **Lustre IV**, with **Violet, Indigo, Blue** descending. OCR scatters or omits labels and cannot recover these positions. The text says this leaves the usual physical spectrum for the “next highest world”; black and white are imagined weaving together, irradiated by red, to produce peach-blossom. Do not present it as a physical colour wheel or remove orange/indigo/violet to match the seven classified colours. |
| 031, c1 top | Three lustre formulas in prose/display text | Yellow is lustre of spirit; blue, lustre of soul; red, lustre of the living. These are not additional labelled drawings. |
| 042, c1 middle | Four-row, two-column table | **Mineral (lifeless) — Lustre; Plant (living) — Lustre-image; Animal (ensouled) — Image-lustre; Man (spiritual) — Image.** OCR reads all left-column subjects followed by all right-column terms. The order of the two compound terms matters and must not be exchanged. |
| 104–108; especially 106, c2–c3 | Perspective argument in prose; no colour-perspective illustration in this range | The letters “D” and “s” in OCR at 104 are artifacts, not diagram labels. At 106 blue recedes and red/yellow approach; blue/purple are subsequently described as peaceful and receding. Digital paired circles are teaching examples derived from the argument. |
| 109, c3 top | Stage/audience sketch | A rectangular stage-like area sits above nested curved audience-like rows. It belongs to the theatre/naturalism argument. It is not a colour-perspective construction. |
| 110, c3 middle | Figure-based poetry diagram with **Epic (purple)**, **Lyric / green**, and **Dramatic (red)** labels | The spatial arrangement and direction of the spiritual-poetry argument survive in the hatch drawing; OCR alone does not preserve them. This is an ancillary Lecture 9 diagram, not one of the proposed new colour studies. |
| 112–122; especially 116, c2–c3 and 117, all columns | Titian discussion in prose; no reproduction of the painting | The book calls the work **Ascension of Mary**. The conventional artwork identification is Titian’s **Assumption of the Virgin**. At 116 the apostles’ earthboundness is conveyed by darkness, while the passage explicitly says one does not feel the colours themselves are heavy. Mary mediates, and the upper light approaches a boundary where art would dissolve into wisdom. A new three-region abstract sketch would be an original study of this reading, not a Titian reproduction. |
| 125, c1 upper | Qualitative weight diagram, with a **purple / yellow / red** hatch legend | Three lower arch-like forms have arrows directed downward; upper free forms are associated with outward/upward motion in c3 prose. The lower purple objects are described as solid and weighable, while redness/yellowness adheres to them. Free colour in the spiritual account tends outward. OCR loses the geometry and arrows. |
| 125, c3 lower; 126, c1 | Smaller reddish cloud inside a larger yellow formation, then the explanation | The image has a small internal hatched form within a larger enclosing one. Its red/yellow assignment is supplied by the prose. At 126 the red says that, if it expanded, it would fit into the yellow five times and become yellow. This is the lecture’s qualitative comparison, not a calibrated area ratio, paint-mixing instruction, or measurable law. |
| 126, c2 middle | Repeated qualitative weight/count diagram with small circles added to upper forms; same hatch legend | The source explanation says a being of one kind requires “three or five” others depending on their kind. Do not convert the visible marks into a mandatory numerical recipe. OCR retains only fragments of the colour legend. |
| 133, c1 middle | Hatched sketch within the gold-ground discussion | The visual appears between the discussion of forms coming out of gold and the Cimabue/Giotto passage. It is nearly absent from OCR. There are no securely readable figure labels; avoid inventing iconographic identities from its strokes. |
| 138, c2 upper | Concentric sketch labelled **Saturn** | Centre: Thrones, reddish-lilac; ring: Cherubim, yellow; outer covering: Seraphim, red, radiating outward. These assignments come from c1 and c2 prose, not actual colour pixels. OCR loses “Saturn” and the concentric structure. |
| 140, c1 middle | Radiating sketch labelled **Sun**, **green**, **white**, **red** | White rays depict light; wavy green marks depict air; red supplies the Saturn-warmth background, explained at 139. The relation is **air as the shadow of light**. A coloured remake must be marked as a reconstruction from the text and hatch labels. |
| 141, c2 middle | Stacked hatched bands labelled, top-to-bottom, **red, orange, yellow, green, blue, purple**, with a central vertical motion mark | OCR loses most labels and geometry. The prose in c3 describes elemental beings emerging at red/yellow and disappearing at the lower green/blue region, then emerging again on the other side. Do not replace the source’s six labels with a conventional seven-band rainbow or infer a complete circulation path solely from the central stroke. |
| 142, c2 middle | Rotated/circular cross-section labelled **Fear** above and **Courage** below/right | The text describes turning the rainbow through 90 degrees. Its fear/courage and watery-density argument belongs to Steiner’s spiritual account. This is not a raindrop ray tracing diagram. OCR turns the drawing into many isolated symbols. |
| 144, c2 top | Tailor’s dummy / clothes-stand analogy | The sketch belongs to the criticism of removing spiritual beings while retaining their manifestations. It is not a fourth planetary-stage diagram. |

## Accuracy of the existing visual module

**Lesson 1’s four image colours are accurate.** The English formulas agree with 022, and the Portuguese table preserves the relationships. “White / light” is supported by the source. The row order green, peach-blossom, white, black is a study order, not a claim that the source circle begins at green. The current table does omit the cycle and the distinction between what appears as image and the mode in which it appears.

**Lesson 2’s yellow/blue/red studies are accurate original illustrations.** The CSS places dense yellow at the centre, dense blue at the perimeter, and red evenly across a field. These agree with 026–029 and the hatch sketches at 027. Their rectangular containers, rounded corners, gradients, and chosen hues are editorial choices, which the existing caption acknowledges. Preserve the interactive comparison lab and its controls. No new scientific colour-mixing model is warranted by these source diagrams.

**Lessons 4 and 9’s swapped red/blue circles are defensible original exercises.** They are not literal reproductions of either lecture. Note 22, 149 c2, says the Lecture 4 blackboard example had red on the left and blue on the right; the red radiated through orange and yellow into green, with blue and purple on the other side. It also says Steiner lacked all the colours needed to draw it properly. That qualification rules out claiming that the present two flat circles recover the original drawing. For Lesson 9, 106 gives the approaching/receding argument in prose, without an embedded diagram.

**Lesson 11’s dark-patch position exercise is an original compositional transfer.** Its small dark patch against a large pale ground and edge/centre comparison are not the source drawings at 125–126. The existing general “original digital studies” caption is correct; a lesson-specific bridge would explain that the source concerns qualitative weight, measure, and number in a spiritual account before the course asks about ordinary composition. The purple-looking patch must not be equated with the purple “solid, weighable objects” of the book merely because the hues happen to resemble one another.

**Lesson 12’s hierarchy table is accurate but compressed.** Names, order, stages, and “original humanity” are supported by 137–143. Original humanity means humanity before the Fall in this lecture’s attributed account, not present human powers. “Light and air” and “Colour and water” hide the relations that the drawings explain: air is light’s shadow, and water is cosmic colour’s reflection or creation. Fourth-stage life forms contours and solid crystal; it is not simply a generic solid-material row.

The current HTML uses column/row header scopes and gives each swatch a caption plus an image description. Existing grid sizing and text wrapping are suitable foundations. A static table can carry these new relations without relying on colour vision, animation, or JavaScript.

## Four substantive recommendations

### 1. Add the shadow-thrower / illuminant table alongside the image classification

**Priority: high. Target: Lesson 2, while retaining Lesson 1’s four-colour table.** A four-row semantic HTML table should restore the actual row relationships from 024. Suggested heading: “How the image relation is formed” / “Como se forma a relação de imagem”.

| Shadow-thrower | Illuminant | Image |
|---|---|---|
| Spirit | Lifeless | Black |
| Lifeless | Living | Green |
| Living | Soul | Peach-blossom |
| Soul | Spirit | White |

Suggested short explanation: “Steiner distinguishes the element in which an image is formed from what illumines it. Read these as relations within his classification. The four-colour circle returns from spirit to lifeless, living, soul, and spirit.” Keep the apparent contradiction in the black row visible in the surrounding explanation, rather than silently exchanging its entries to fit everyday optics.

This is a **source-table transcription in new HTML formatting**. It is not a reproduced scan or an original physical-light diagram. Cite 022–024, with 024 c3 as the exact table source. A circular SVG is optional and lower priority: the table and a sentence about the preceding point already make the relation accessible, and a circle could introduce confusing arrow semantics if simplified carelessly.

Within the same addition, a short source-reading paragraph should also preserve the distinct diagram at 030 c3: “Steiner bends the warm and cool sides of the usual spectrum into an expanded scheme: peach-blossom is Image I above, green Image II below, warm lustre III at the left, and cool lustre IV at the right. Black descends and white rises in his imagined account.” Link this to its spiritual setting and the black/white interplay described in 025 and 030. The exact remaining colour labels are recorded in the inventory above. This textual recovery adds the book’s connection between image and lustre without modifying the lab or implying a literal optical construction.

### 2. Restore the four painting modes from Lecture 3

**Priority: high. Target: Lesson 3.** The printed table at 042 is a compact structure that the current module does not show. Add a semantic table whose rows preserve **lustre-image** for plants and **image-lustre** for animals. Suggested heading: “Image and lustre in the painting process” / “Imagem e brilho no processo de pintura”.

| Subject in Steiner’s account | Mode in the source | Practical description from the lecture |
|---|---|---|
| Mineral / lifeless | Lustre | Evoke an inner radiance behind the surface; 039–041. |
| Plant / living | Lustre-image | Paint the image darker, then veil it with yellowish-white light; 037–038, 042. |
| Animal / ensouled | Image-lustre | Paint more lightly and introduce a pale bluish shimmer, with transition to the surrounding vegetation; 041–042. |
| Human / spiritual | Image | Treat the colour as image, modifying the usual lustre tendency while retaining the transparency of the medium; 042. |

The first two columns are a **normalized transcription of the source table**. The third is an **original explanatory condensation**, so label that difference in the caption: “Source classification at capture 042; process descriptions summarize captures 037–042.” Portuguese terms should remain consistently `brilho`, `brilho-imagem`, `imagem-brilho`, `imagem` across the lesson and table.

This fills a real conceptual gap between the first three lectures and helps the learner explain why two similar compound words carry different relations. It does not need an invented landscape or an unverified reproduction of an old master.

### 3. Make qualitative weight, measure, and number explicit before the position exercise

**Priority: medium. Target: Lesson 11; retain its existing original exercise.** Add an attributed comparison table derived from 124–126. Suggested heading: “Three comparisons in the lecture” / “Três comparações na palestra”.

| Term | Ordinary physical comparison described | Steiner’s spiritual comparison |
|---|---|---|
| Weight | Solid bodies tend toward the Earth’s centre; downward arrows. | Free sense qualities tend outward into world spaces; upward/outward motion. |
| Measure | A measuring stick supplies an external quantity. | A small reddish cloud compares itself with a larger yellow formation through possible expansion; the example says “five times”. |
| Number | Counted parts can be treated as indifferent to one another. | A being of a particular kind calls for a related company of others; the text gives “three or five” as examples. |

This is an **original explanatory table from the source argument**, not an existing printed table. Caption it accordingly and cite 124–126. The diagrams at 125 c1, 125 c3, and 126 c2 provide exact visual provenance. A short bridge can then say: “The following position study is an original exercise in visual emphasis; it applies a question about qualitative relations to a composition.”

Do not build an animation of “anti-gravity”, a five-to-one calibrated colour plot, or a colour recipe. Each would give a precision or physical status the source argument does not supply. The accessible table carries the distinction without changing the present edge/centre activity.

### 4. Expand the hierarchy sequence to show the relations between manifestation and element

**Priority: high. Target: Lesson 12’s existing table.** Keep its four rows, add an explicit relational column and source references, and identify the account as Steiner’s reconstruction of an older way of thinking. Suggested columns: “Hierarchy / Manifestation / Relation to the element / Stage”.

| Hierarchy | Manifestation | Relation to the element | Stage |
|---|---|---|---|
| First: Seraphim, Cherubim, Thrones | Warmth | Warmth expresses their co-operation; the source sketch places Thrones at the centre, Cherubim around them, and Seraphim outside. | Old Saturn; 137–138. |
| Second: Kyriotetes, Dynamis, Exusiai | Light | Air is the shadow of light; white rays and green wavy marks distinguish the two in the source sketch. | Old Sun; 139–140. |
| Third: Archai, Archangels, Angels | Colour through mediation of light and darkness | Water is cosmic colour’s reflection or creation. | Old Moon; 140–142. |
| Fourth: original humanity before the Fall | Life within the interplay of colour | Life shapes contours and brings solid crystal into being. | Earth; 142–143. |

This is an **expanded explanatory table**, not a transcription of an existing printed table. Exact sketch sources are 138 c2, 140 c1, 141 c2, and 142 c2; their monochrome hatching is not a colour reproduction. Keep the rainbow movement in a brief text explanation if needed: emergence at red/yellow, disappearance at the lower green/blue region, then renewed emergence on the other side; 141 c3–142 c1. Fear and courage are attributed terms of this account, not a colour-response test or a learner’s required experience.

The hierarchy table is more valuable than colouring the concentric sketch alone: it explains the missing relations and remains usable without interpreting hues or shapes.

## Accessible implementation and source-status rules

- Retain the existing interactive Lesson 2 lab. The first recommendation can be a separate static section after its explanation; it does not need new controls.
- Add a visible caption or short preceding paragraph naming the source status: **transcription of a printed table**, **original explanatory table**, or **original digital study**. “Reproduction” should be reserved for an actual source image.
- Use `<caption>`, `<th scope="col">`, and `<th scope="row">`. Put source references in visible text, not only `aria-label` or a tooltip. Definitions of unusual terms belong in adjacent prose.
- Keep all essential distinctions in words. Colour may supplement text; it must not carry the only distinction between “lustre-image” and “image-lustre”, shadow and illuminant, or the four hierarchies.
- Extend the existing table CSS only where required: readable caption spacing; adequate row-header width; responsive wrapping. A four-column hierarchy table may need a labelled horizontal-scroll wrapper on narrow screens. Avoid reflow that visually disconnects a cell from its row/column header. No new palette is needed for these four recommendations.
- If an optional original SVG is later added, give it a `<title>` and `<desc>` plus a visible prose/table equivalent. Any coloured reinterpretation of hatch drawings must say that the colours come from the lecture’s text or legend. A decorative SVG duplicating the complete table can instead be hidden from assistive technology.
- Explain the source diagram’s relationships before inviting the learner to compare personal experience. Source comprehension does not require reporting the lecture’s imagined movement or agreeing with its cosmology.

## Editorial qualifications that should travel with visual claims

1. **Peach-blossom passage is incomplete.** Note 2 at 147 c1 explicitly says this and supplies a parallel lecture quotation. The classification can be taught without treating a chosen screen swatch as a universal human complexion or reading health and soul from actual people’s skin.
2. **Lecture 4’s drawing was materially limited.** Note 22 at 149 c2 specifies the red-left/blue-right arrangement, radiating transitions, and unavailable colours. Keep the current teaching study’s original status explicit.
3. **The rainbow optics passage was only a set of hints with shorthand gaps.** Note 38 at 150 c3 says this, then cites refraction and reflection within drops, including Steiner’s explanatory note. This qualification attaches to the earlier optical rainbow discussion; it is not a blanket statement that every line of Lecture 12 is missing. It supports careful source attribution and distinguishes an optical ray diagram from the spiritual rainbow sketches at 141–142.
4. **Plant colours and the Goetheanum are historically specified.** Note 9 at 148 c1 and Note 36 at 150 c2 describe the cupola pigments/workshops. They do not authenticate the CSS hue choices as those pigments.

No repository code or build output was modified during this review. No network calls or implementation-mirroring tests were used. The machine-readable companion is `.sources/colour-2026-review/diagram-recommendations.json`.
