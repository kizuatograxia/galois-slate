---
kind: "task"
slug: "stabilize-equation-engine"
name: "Stabilize equation solver behavior"
project: "galois-canvas"
assignee: "calculator-engineer"
---

Add focused Vitest coverage for `src/lib/GaloisEngine.ts`.

Cover at least:

- Linear equation with one root.
- Linear equation with zero leading coefficient.
- Quadratic with two real roots.
- Quadratic with complex conjugate roots.
- Cubic with three simple real roots.

If tests expose a solver bug, fix it in the smallest safe patch.
