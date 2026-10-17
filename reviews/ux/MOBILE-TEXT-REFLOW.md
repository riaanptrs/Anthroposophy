# Mobile text reflow and introductory teaching

Baseline: published commit `fdb2e7ad869e20c2076bdd8995eb8f2895c92441`.

## Reproduced failure and correction

Normal mobile text passed the previous viewport-width checks. With mobile text autosizing increased to 150–200%, the non-wrapping site brand, intrinsic header grid columns, and non-wrapping lesson toolbar could make the document wider than the viewport. The initial seven-family bilingual matrix had 86 failures out of 168 cases. A screenshot's physical pixel dimensions do not identify its CSS viewport or text scale.

The shared layout and Theosophy layout now allow the header and toolbar to wrap. Flex children can shrink within the available inline space; the position label can wrap. Reading containers use border-box sizing and stay within both their available width and existing desktop reading-column maximum. Section links and the drawer heading also accommodate enlarged text. No overflow-hiding rule, text-size-adjust restriction, maximum zoom or user-scalable restriction was added.

This is a demonstrated enlarged-text defect. The supplied `5520.jpg` could not be downloaded: the authorized Library transfer failed with proxy CONNECT 403, including an approved escalated attempt. Library supplied extracted text and image dimensions, but no renderable pixels. Accordingly, this review does not claim a pixel-for-pixel reproduction of that particular Android browser state. A physical-device confirmation remains useful after publication.

## Regression coverage

`scripts/review-mobile-text-reflow.cjs` uses mobile Chromium at 320, 360, 390 and 412 CSS pixels, device scale factor 2.625, 100%, 150% and 200% mobile text autosizing, dark preference and Chromium forced dark mode. It exercises both languages across all 24 course families, plus the second introductory Steiner lesson: 600 cases. It opens and closes the chapter drawer and expands the complete readings on the two Steiner routes.

The test checks actual text-node Range rectangles against the viewport and clipping ancestors, as well as document scroll width. A negative control deliberately clips a non-wrapping paragraph while keeping the document width unchanged; the text-fragment check must detect it. This catches cases that scrollWidth alone misses. A final 96-case rerun covers all eight revised lesson routes after the final answer wording was restored.

Receipts: `mobile-all-course-reflow.json`, `mobile-focused-reflow.json`, `mobile-validators.json`, `mobile-preservation.json` and `mobile-interactions.json`. All 47 existing validators and 13 study/navigation/print interaction checks pass. CSS changes leave the study scripts and storage namespaces untouched. The tests simulate mobile text enlargement; they are not a physical Android or Safari certification.

## Teaching correction

The Foundations and Introduction versions of “Who was Rudolf Steiner?” now identify Steiner and his dates, philosophical work and anthroposophy before introducing Goethe's scientific writings. The plant example follows an explicit explanation of why development matters to that part of his work. The existing biography, philosophical argument and spiritual-report distinctions remain.

The existing “What is anthroposophy?” lessons begin with a plain definition of the spiritual philosophy and movement. Body, soul and spirit are explained as terms within Steiner's account. Inner development is connected with attention and responsible choices, followed by the painting example and the influence on Waldorf education and biodynamic agriculture. Spiritual claims remain attributed, without turning the introduction into an extended disclaimer.

Both definitions explain Greek *anthropos* (human being) and *sophia* (wisdom): human wisdom, commonly explained as wisdom about the human being. The Portuguese explanation uses *antropos + sofia → antroposofia* and makes clear that *phos* is not the second component. The word roots were checked against the [Anthroposophical Society](https://www.anthroposophy.org/); [Sunbridge Institute](https://www.sunbridge.edu/rudolf-steiner-and-anthroposophy) uses “wisdom of the human being.” No new source quotation or page locator was inserted into lessons.

A natural link immediately after each Steiner opening takes the learner to the existing definition in the same language. Only these four lessons in two languages change their main teaching body; the other 1,579 main documents remain unchanged. Retained full readings, original source qualifications, anchors, notes and progress hooks are preserved. The older validator's fixed four-paragraph assumption now makes explicit exceptions for the six/seven-paragraph beginner definitions; its other content and preservation assertions remain.
