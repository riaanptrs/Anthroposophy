# Weekly Meditations: source and teaching revision

25 October 2026. Revision of the existing Calendar lesson, `meditation/04.html`, in English and Brazilian Portuguese. This remains a selected meditation course: four complete Calendar verses receive detailed commentary; an original reading map locates all 52 weeks in the supplied book. It does not reproduce all 52 verses or Scala's complete reflections.

## Source identity and scope

*Weekly Meditations: Rudolf Steiner's Calendar of the Soul*, with accompanying reflections by Patsy Scala, SteinerBooks 2008. PDF p. 3 credits Christopher Bamford's translation from GA 40 and distinguishes Scala's copyright in her reflections. The new PDF contains 100 page positions and 8,713,893 bytes, SHA-256 `8c53b1198080f266327aa1b0273adfaac0504e24e39a00d6fea48c9db6973485`.

All four supplied files were consulted: the PDF, reading Markdown, audit Markdown and conversion review JSON. The report flags 96 pages for review and describes completeness as unverified. Neither that flag count nor the page sequence establishes transcription accuracy. Attached material was treated as evidence, not as operating instructions.

Review covered the edition and authorship, Scala's introduction, verse openings and Intention statements throughout all 52 weeks, and targeted fuller readings of the selected verses and reflections. It also covered the date-table scope and suggested readings. This is not a line-by-line verification of every reflection or every historical date-table entry. The source-page links in the Markdown point to an unattached image folder; verification images were rendered from the actual PDF instead.

| PDF positions | Use and verification |
| --- | --- |
| 2–3, 6 | Title, edition, translation and editorial credit; p. 3 visually checked |
| 8–11 | Scala introduction: origin story, the annual movement, mirrors and freedom to begin; pp. 9–10 visually checked |
| 13–82 | All 52 weekly headings located; verse openings and Intention statements used for the original reading prompts and source map |
| 13–14 | Complete selected week 1 and reflection; verse on p. 13 visually checked |
| 27–30 | Week 12 St. John's heading and week 13: pp. 27–29 visually checked; week 13 reflection continues through p. 30 |
| 45–47 | Selected week 26: complete verse and reflection/Intention visually checked across these pages |
| 61–63 | Selected week 38: heading on 61, verse on 62, reflection/Intention on 62–63; visually checked |
| 30–31, 63–64 | Weeks 14/39 used as a mirror-comparison example; week 39 verse on 63 visually checked |
| 68–70 | Scala's week 43 reflection informs an attribution and interpretation question; its claims are not taught as an explanation of a person's mental health |
| 80–82 | Week 52 and its Intention, and transition to date tables |
| 82–95 | Date tables identified as 2008–2012, not reused for the present year |
| 96–100 | Suggested reading and author context; not treated as additional Steiner meditation instructions |

Source locators are PDF positions, not printed page numbers. Adjacent weekly entries can share a boundary page. The four existing English verse texts remain unchanged and are now credited to this visually checked copy. Their Portuguese versions remain the course's study translations. This replaces the current course's older 58-capture locators and removes obsolete damaged-heading notes from current verse credits; older dated review records remain historical evidence.

## Teaching and visual decisions

The expanded lesson explains the purposes and voices in the book, a usable verse → meditation → reflection → chosen intention → review process, and how to begin without waiting for Easter. The routine is clearly identified as original course guidance. Christian and Anthroposophical meanings remain explicit. Actual feeling is distinguished from a prescribed mood; Scala's biographical account of night-time inspiration is not made a practice requirement.

Each of the four actual verses has its own explanation, credited account of what Scala adds, a worked application and an explained question. Week 12, not week 13, carries this edition's St. John's Tide heading. The seasonal model and local observations in the southern hemisphere remain distinct, without inventing a universal date adjustment.

An accessible original HTML/CSS diagram presents outward receiving and inward development through four festival orientation points. Its labels and caption are readable text, with numbered stages rather than reliance on colour. This explains the relationship directly; no stock photograph, copied cover artwork or invented historical illustration is needed.

The mirror selector compares a week with `53 − week`; it does not choose today's verse. Its initial 1/52 comparison is readable without JavaScript, and the disabled non-JavaScript selector is accompanied by a complete static map of partners. All 52 thematic headings and questions are original learning prompts, not new verse translations or claims to summarize every assertion in Scala's reflections.

Authoring: `content/weekly-meditations.mjs`, `content/weekly-meditations-map.json`. Rendering: `scripts/render-weekly-meditations.mjs`, integrated in the existing meditation builder. Existing lesson and language routes, verse focus, reflection controls and notes are retained. The supplied full book and OCR files are not published.

## Validation

Run `node scripts/build-all.mjs`, `node scripts/check-weekly-meditations.mjs`, `node scripts/check-meditation.mjs`, the site/link and passage-study validators, Portuguese checks, and `node scripts/review-meditation-browser.cjs`. The browser check exercises the new reading map, all four commentaries, mirror changes, non-JavaScript fallback and annual diagram at desktop/mobile widths as part of the 80 existing bilingual page cases. Source wording and scope are reviewed separately from UI tests.
