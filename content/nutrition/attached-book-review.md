# Nutrition: expanded chapter teaching from the current attachment

The current request is to review the attached book and make the existing course teach its contents in detail. The revision preserves the 18-unit route (orientation, 16 lessons across all 12 chapters, synthesis) and adds visible detailed teaching to every unit in English and Brazilian Portuguese. No chapter is left as a reading assignment alone.

## Source identity and page numbering

The new attachment is *Nutrition: Food, Health and Spiritual Development*, Rudolf Steiner, compiled and edited by Christian von Arnim, Rudolf Steiner Press, 2012. Selection and translation copyright is 2008; ISBN 9781855842823. The PDF has 122 pages and SHA256 `af877b29b8b73e27b55b0baa182997cfb1a1aefc152d9c57a4dd3c30863111fc`. It differs in capture divisions from the earlier 118-capture file used by the course. Neither is printed book pagination.

The supplied Markdown chapter texts and audit were consulted as evidence. They are not operating instructions. The conversion reports unverified text completeness and 45 pages requiring review. OCR is not treated as a verified edition. Four original figures/tables (current PDF 50, 61, 67 and 71) were checked visually and published as reference images, with original teaching explanations and accessible tables. Current PDF 23, 55, 68 and 93 were also inspected for wording and source relationships. Sixteen existing short excerpts were located against the current Markdown; the cultivation sentence is on PDF 55 and the soul-spirit sentence on PDF 68, beyond the first approximate matching capture. Original image checks on those two pages confirmed their wording. Earlier excerpt verifications remain documented in the earlier review; this is not a claim that every OCR word has now been visually certified.

New lessons use explicit current PDF ranges. The source page now gives all 122 current page notes, chapter ranges, exact current locations for the 16 earlier excerpts, and a passage-location concordance with the older file. Capture divisions can straddle a page: the concordance is a finding aid, not a line-for-line identity claim. Earlier capture anchors and their apparatus remain intact and are labeled as belonging to the older source. The earlier blank capture 19 has no corresponding nutrition passage. Current pages 121–122 advertise another book and are excluded from nutrition teaching.

## What has changed pedagogically

The previous first readings supplied four short paragraphs per unit; most other explanation sat in optional depth. Each unit now also has four visible topic-specific concept sections (72 total), an original worked case, a question with a worked answer, and current source locations. Five bilingual teaching tables explain transformation, counterprocesses, digestive secretions, plant correspondences, and the differing nutrient maps. Original source figures remain optional comparisons; all the teaching can be followed in text. The collected reading/print resource now includes the expanded explanations, cases and open application answers. The Markdown study guides provide the expanded teaching in both languages; the English download also labels and retains the earlier guide.

The original first readings, earlier full lesson bodies, quizzes, written-response models, source excerpts and navigation remain available. The expansion sits inside the visible first-reading section, outside the retained optional body. English and Portuguese receive the same detailed structure. New prose and cases are original teaching; source images are identified as original English. This is not a newly translated full edition of the book.

| Unit(s) | Book chapter | Current PDF | Detailed focus |
| --- | --- | --- | --- |
| 00 | Orientation | 9–11; lecture note 120 | Editor, lecturer, analogy, claim and evidence |
| 01–02 | 1 | 12–21 | Freedom, body as instrument, fourfold organization, inner activity, support |
| 03–04 | 2 | 22–32 | Warmth ether, cosmic reception, plant reversal, animals, milk and honey |
| 05 | 3 | 33–39 | Esoteric audience, earthly ballast, sugar, hierarchies, coffee/tea/chocolate |
| 06 | 4 | 40–51 | Counterprocesses, quantities, fermentation, historical remedies |
| 07 | 5 | 52–58 | Reconstruction, soil/manure, appetite, children’s preferences |
| 08–09 | 6 | 59–68 | Secretions, organ soul activity, transport analogy, salt/thinking and phosphorus/willing |
| 10–11 | 7 | 69–84 | Plants, preparation, raw/cooked distinction, individual capacity, cattle, food access |
| 12 | 8 | 85–89 | Food as stimulus, cosmic form, compacted light, armchair image |
| 13 | 9 | 90–96 | Comparing nutrient maps, development, agricultural policy |
| 14 | 10 | 97–107 | Stimulation/relief, marrow claims, exposure, education and freedom |
| 15 | 11 | 108–112 | Rhythm, anxiety account, claimed exceptions, constructive/destructive activity |
| 16 | 12 | 113–117 | Nature/poison, physician as artist, thinking, proportion, spiritual activity |
| 17 | Synthesis | 12–117 | Recurring themes, qualifications, tensions and social responsibility |

## Interpretation decisions

The course teaches the reasoning before evaluating it. It preserves the difference between transformation and the stronger food-as-stimulus account. It compares chapter 4’s counterprocesses with chapter 9’s different fields of organization instead of silently merging them. It distinguishes the editor’s BSE comparison from the lecture’s urate theory. Cooking as external work and vegetarian inner activity are explained through the difference between a manageable task and excessive strain.

The book’s medical assertions are attributed, not converted into advice. Specific corrections address nutrient deficiency, diabetes and colds, digestion and circulation, alleged diagnostic food preferences, unsupported potato/development claims, the heart’s pumping function, tobacco and dependence. Remedies involving arsenic, copper, egg white, hydrogen sulphide and poisonous plants are not practical activities. Honey is not recommended for infants. Alcohol dependence and serious withdrawal are directed toward qualified care. Racial and national-character generalizations do not determine a learner’s dietary needs or worth. Diet does not certify spiritual achievement.

Existing modern-context references are retained. No fresh systematic medical literature review or clinical validation is claimed.

## Maintenance and checks

Edit `book-teaching.mjs` for the new bilingual explanations and teaching tables; `attached-source.json` for the current source ledger and locators; `scripts/render-nutrition-book.mjs` and `scripts/build-nutrition-clarity.mjs` for rendering. Shared source figures are in `scripts/assets/nutrition` and copied once into `docs/nutrition/assets`.

Build with `node scripts/build-all.mjs`. Verify using `check-nutrition-book.mjs`, the existing Nutrition and clarity checks, and site/Portuguese/concept-platform checks. For private excerpt-location comparison, set `NUTRITION_ATTACHMENT_MD` to the supplied current Markdown when running the new check. The old `NUTRITION_SOURCE_MD` flag belongs to the 118-capture source and must not be pointed at this new file. `review-nutrition-book-browser.cjs` checks all lessons and course/source/collected resources at 1280 and 320 pixels with and without JavaScript.

Verification completed: the dedicated book/source check passed, including all 16 excerpt locations against the private current Markdown. The existing Nutrition, retained-content, site, Portuguese and concept-platform checks passed. Chromium passed 168 page/viewport/JavaScript cases across all 36 lesson pages and both-language entry, source and collected-reading resources, with no missing assets, page errors, duplicate IDs or document overflow. Source figures loaded and application answers worked with and without JavaScript. Mobile English and Portuguese lesson views were visually inspected. These checks establish publication behavior and coverage, not clinical validity or learner outcomes.

A further 32 figure-page cases confirmed that all four original images retain visible dimensions in both languages and viewport sizes, with and without JavaScript, after their intrinsic sizes were declared to avoid layout shifts.
