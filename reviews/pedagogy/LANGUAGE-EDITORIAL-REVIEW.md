# Bilingual editorial review — 16 October 2026

## Scope and method

The course-level review covers all 487 authored units in 24 groups. This additional language pass covers the generated English and Brazilian Portuguese website, including headings, navigation, optional answers, retained deeper readings, source/support pages and kitchen material.

The extraction inventories 1,587 HTML pages and approximately 58,500 distinct prose blocks, including closed disclosures. The local spelling scan checks approximately 1.14 million token occurrences. It does not send text to an external language service. Blockquotes are excluded from automatic spelling correction. All 4,047 dictionary flags from the reviewed scan have a recorded lexical disposition in `spelling-flag-dispositions.json`; dictionary omissions, names, titles, identifiers and explicitly recorded source/OCR spellings are not silently “corrected.” This is lexical triage, not certification of every sentence.

A separate extraction found 17,009 distinct bilingual string pairs in the authoring data. Contrast, negation, numerical and qualification checks produced 135 initial candidates and 184 expanded contrast candidates, inspected against the actual English and Portuguese wording. These counts include overlapping investigations and are not counts of independent errors. Ordinary uses of “além” for beyond, additional relationships or an actual “as well as” were retained. Numeric differences such as “Grade 6”/“sexto ano,” clock notation and condensed capture references were distinguished from changed claims. Repeated-word and encoding checks produced 29 candidates, largely adjacent labels, book titles or documented OCR; no blanket text replacement was used.

The short-path answer screen covers 1,588 language-specific question/answer pairs (794 English pairs with Portuguese counterparts). All 387 low-overlap English candidates were inspected for relevance; the entire Nutrition question/answer set was checked directly. This detected an additional systematic Foundations problem. Structural screening alone does not establish semantic correctness. The previous chapter-by-chapter pedagogical review and targeted independent bilingual review supplied further context; this pass is not represented as an independent line-by-line human rereading of over a million words.

## Corrections made

- 93 individually documented source-level corrections restore contrasts, qualifications, agreement, closing purposes, word spacing and English grammar. They include retained deeper content, not only the short readings. `language-editorial-corrections.json` gives exact old/new wording and affected authoring files.
- The recurrent “rather than” → “além de” error is corrected where it altered meaning: spiritual individuality versus the physical organism, technical Imagination versus fantasy, self-directed ethical action versus mere choice, and educational support versus waiting for a general developmental timetable.
- All 36 Foundations short lessons now supply the actual correct response before explaining it, in both languages. Previously their standalone answers had inherited only the explanation from a multiple-choice question. The 72 changes are recorded separately.
- Nutrition 05, 07, 10 and 13 now answer the actual first question: sugar/selfhood, growing conditions, external food preparation and fourfold nutrient relationships. These answers state the attributed spiritual interpretation without turning it into dietary advice.
- Nutrition 07 restores the explicit incompatibility of the breathed-nitrogen claim with ordinary human nutrition. Lesson 16 restores food, rather than the body, as what conditions the instrument. Portuguese pulse/smoking wording retains the English qualification.
- Foodwise 27 restores the purchased-only ingredient constraint. Portuguese recipe wording now explicitly includes adding the onion, occasional stirring, diced substitutions and adjusting cooking time for whole lentils.
- The three recipes remain visibly labelled original and untested, with estimated quantities/times, doneness checks, adult handling of heat and knives, ingredient/allergy checks and handling/storage guidance. No damaged OCR recipe, unverified book temperature or infant-feeding instruction was reconstructed. No kitchen test is claimed.
- The research-note typo “parataxt” was corrected in original editorial prose. Recorded source misspellings and the printed surname “Marcia Merryman means” remain intact.

## Verification and limits

The full build and 47 static validators pass. The changed-page browser pass covers 156 pages at desktop and narrow mobile widths: 312 cases. These technical checks support delivery and navigation; they are not linguistic sign-off.

All 127 blockquote instances on changed HTML pages are byte-identical to the review baseline. All 177 passage registry records retain their quotation, attribution and locator fields; only explicitly documented original teaching-note translations changed. Historical preservation validators now allow the exact reviewed editorial corrections and continue to compare the remaining content.

Unavailable original uploads still limit fresh source verification. Specialist spiritual terminology is preserved with attribution; untested recipes remain untested. The requested postpublication pass is recorded in postpublication-language-review.json. Pages deployment success and the exact initial revision are confirmed by the workflow and deploy-job log; direct live HTTP inspection is blocked by the environment proxy and web reader. The final pass screens 17,049 authoring pairs, finds no new lexical flags or old corrected paragraphs on teaching pages, and refines Nutrition 05 once more to avoid suggesting that altruism itself is the problem. No claim of perfect translation or exhaustive independent sentence-level proofreading is made.
