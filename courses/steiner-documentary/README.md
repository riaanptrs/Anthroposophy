# The Challenge of Rudolf Steiner — Documentary course

Imported from the owner's existing Sites course, source commit `3d15d66ef3ea14f64b6a9220fe5475ba3c5a5bf6`, for publication on the Anthroposophy GitHub Pages website. The original course has 12 lessons, 43 transcript reader sections, voices, a workbook, explained questions and teaching resources. It contains no documentary video. Notes and progress are stored in the browser when storage is available; moving between website origins does not transfer existing notes automatically.

`content/` contains the original course and consolidated transcript Markdown. `site/` preserves the portable static application. To regenerate its data after editing Markdown, install `requirements.txt` in a Python environment and run `python courses/steiner-documentary/build.py`. The normal repository build needs no added packages: `node scripts/build-all.mjs` copies the prepared static application to `docs/learn/steiner-documentary/`, adds the main website navigation and creates a Portuguese entry that identifies the full course as English.

Hosting identities, credentials and the original source repository's Git history are excluded. The source Site remains unchanged.

The imported reader renderer demotes embedded transcript level-one headings to level two, leaving one page title per view. Transcript wording is unchanged.
