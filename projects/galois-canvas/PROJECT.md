---
kind: "project"
slug: "galois-canvas"
name: "Galois Canvas"
description: "Maintain and improve the interactive equation calculator app."
owner: "product-lead"
---

This project covers the calculator experience in the current repository.

Primary surfaces:

- `src/components/BookShelf.tsx` for degree selection.
- `src/components/ExpandedBook.tsx` for the main calculator interaction.
- `src/components/NumericKeypad.tsx` for coefficient entry.
- `src/components/MathDisplay.tsx` for KaTeX rendering.
- `src/lib/GaloisEngine.ts` for equation solving and explanation steps.

Definition of done:

- The app builds.
- Relevant solver behavior has tests.
- UI changes preserve the book/calculator flow.
- The final response names the checks that ran.
