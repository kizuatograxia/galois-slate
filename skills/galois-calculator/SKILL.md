---
name: "galois-calculator"
description: "Work safely on the Galois Canvas React calculator app."
---

# Galois Calculator

Use this skill when changing or reviewing the calculator app in this repository.

## App Map

- `src/pages/Index.tsx` owns the shelf-to-book state.
- `src/components/BookShelf.tsx` renders the selectable equation degrees.
- `src/components/ExpandedBook.tsx` is the main calculator screen.
- `src/components/NumericKeypad.tsx` handles keypad controls.
- `src/components/MathDisplay.tsx` renders LaTeX with KaTeX.
- `src/lib/GaloisEngine.ts` contains the solver functions and step text.

## Working Rules

- Keep solver changes covered by Vitest tests.
- Keep UI copy in Portuguese unless the surrounding component is already English.
- Preserve the animated book metaphor unless a task explicitly asks for a redesign.
- Do not introduce a backend for calculator-only changes.
- Prefer local component state and existing utilities over new global state.

## Checks

Run the smallest useful set:

```bash
npm run test
npm run lint
npm run build
```
