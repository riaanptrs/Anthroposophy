# Learning-system revision — 1 October 2026

The existing website now has a clear beginner path while retaining its detailed book courses and source work. This is an extension of the existing static build, with the existing reading URLs and notebook identities preserved.

## What changed

- **Learn Anthroposophy** is the dominant homepage entry. Its 36 English/Portuguese lesson pairs follow seven conceptual parts and a final synthesis, from Steiner and spiritual knowledge through the human being, destiny, spiritual worlds, freedom, Christ and applications.
- Each new lesson has one question, a short introduction, a reviewed passage or identified section, concise explanation, key concept, illustrative example, important distinction, three checks and a reasoned continuation. Author claims, course explanations and examples are labelled separately.
- **Study the Books** retains all 13 earlier collections and adds What Is Biodynamics?, the complete Agriculture course and the supplied Toward a Threefold Society opening: 16 collections and 224 bilingual reading/session pairs. The complete Agriculture course adds an orientation, two readings for each of the eight source lectures and a synthesis, with separate lecture landing pages. Source numbering is distinguished from our own course divisions; Freedom’s six optional practices retain their parent chapters and core navigation.
- Existing readings now have a specific question before the source, visible course/part/chapter/reading context, a source-focused choice with feedback and retry, and their original annotated questions. The 39 formerly single-check readings also receive an ungraded reflection. Core checks stay within two to four; the original replaced question remains available as deeper study.
- Numeric self-grading is replaced with a checklist about meaning, distinctions, source support and the kind of claim. Reflective responses and spiritual attainment are not graded.
- Supplementary book connections and lecturer commentary are expandable. The main source explanation remains open. Original chapter teaching, source guides, illustrations, activities and notebooks remain intact.
- **Themes and Applications** maps 12 subjects to reviewed study links and accurately identifies limited coverage and bibliography gaps.
- **Research / Source Library** renders the pre-existing authored notes and added biodynamics, Agriculture and threefold-society source records, retaining original headings, tables and detailed bodies. It distinguishes current records from historical records and supports full-text search and combined filters. The indexes are bilingual; original research bodies remain explicitly identified as English.
- Four primary destinations appear throughout the site. Existing course controls return to the visible reading hierarchy, and saved book study can be resumed from the book indexes. Narrow-screen tables and long research references are contained.

## Source preservation and limits

The original 177 reviewed passage records, 185 book checks and thirteen catalogue structures remain unchanged. Fourteen image-verified anthology passages, eighteen separately registered Agriculture Markdown passages and seven Markdown-only opening passages each have their own question records. The source revisions update beginner lessons 32, 35 and 36, source metadata and theme links; pre-existing book source modules and authored notes are preserved. Short beginner excerpts reference registered records; no quotation or printed page number was invented. Edition and translator credits remain visible, including the original German Luke selections and their new study translations.

Biodynamics now draws on the complete reviewed What Is Biodynamics? anthology: Courtney’s introduction and seven Steiner lectures from three cycles. Its Agriculture selection comprises GA 327 lectures 4–6. A complementary eighteen-reading course now follows all eight lectures in two complete supplied Agriculture Markdown texts, the 1993 Creeger/Gardner and 2012 Adams editions. The new PDFs exceeded the transfer limit and were not visually checked; source markers identify the supplied transcriptions, and edition-specific quotations remain separate. Social threefolding now draws on the reviewed GA 23 opening: Smith’s introduction and Steiner’s 1920 preface in a fourteen-page OCR Markdown witness. Main chapters and the native PDF are absent; quotation checks use the supplied transcription only. Broader cosmology and Lucifer/Ahriman identify the limits of the local selections. Medicine preserves Holtzapfel’s authorship and historical scope. Architecture and eurythmy use the available material without implying a complete specialist course. Nutrition remains a bibliography gap.

Full uploaded books and transcripts remain private. Public research pages contain authored preparation notes and registered provenance, without private source download links. Historical statements retain their original date and archive context.

## Notes and development

Beginner notes and completion use an independent opt-in local storage namespace, with separate language notes and shared completion. Export and deletion work locally. Existing `anthro-study-v1` keys, all source reading URLs, and practice journals remain; deleting a lesson also clears a matching stale resume pointer.

The final learning-system generator follows the existing builders. Source-owned legacy homepage templates make repeat builds deterministic. Node 20 or newer is sufficient; no package installation or external service is required.

Run `node scripts/build-all.mjs`, then every `scripts/check-*.mjs`. The validators cover the generated HTML pages, source fidelity, reading coverage, language routes, local links/anchors, chapter structure, mixed unscored checks and existing study tools. Browser verification covers desktop/mobile layouts, quizzes, local notebooks, research filters, keyboard controls and no-JavaScript fallbacks. Reusable cloud startup instructions build and check an isolated copy before starting the local preview.

## Biodynamics source revision

All 135 PDF captures and the supplied Markdown were reviewed. The new fourteen-reading bilingual course distinguishes Courtney, Steiner and the editors, with capture/column/Kindle locators, source discussions and qualifications. See the [source revision and detailed notes](what-is-biodynamics-reading-review.md).

## Complete Agriculture course revision

The complete eight-lecture GA 327 sequence now complements the anthology course without changing its fourteen lesson identities. Eighteen bilingual readings retain the author’s lecture order, connect whole-farm relationships with preparations and animal feeding, and distinguish source claims, course explanations and illustrative examples. Beginner lessons 32 and 36 and the book catalogue now identify the complete course. The new uploaded PDFs were not transferred; page-by-page review and quotation checks use the two supplied Markdown witnesses. See the [source revision and detailed notes](agriculture-reading-review.md).

## Threefold-society opening revision

All fourteen supplied Markdown blocks were read and the seven quotations/translations independently reviewed. The seven-reading course preserves strong educational self-administration, associative contracts/prices, recurrent social judgment and equal rights, while clearly distinguishing the missing main chapters and native pages. See the [source revision and detailed notes](toward-threefold-society-reading-review.md).

## Audit records

- [Complete site inventory](learning-system-site-audit.md)
- [Teaching audit](learning-system-teaching-audit.md)
- [Navigation and progress audit](learning-system-navigation-audit.md)
- [Beginner source map and coverage](learning-system-source-audit.md)
- [Research and application coverage](learning-system-research-audit.md)

The revision is prepared in the working repository. It has not been deployed or published.
