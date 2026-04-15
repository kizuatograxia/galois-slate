import { describe, expect, it } from "vitest";
import { solveQuadratic } from "@/lib/GaloisEngine";

describe("solveQuadratic", () => {
  it("shows Bhaskara substitution with negative roots for x^2 + 5x + 6", () => {
    const solution = solveQuadratic(1, 5, 6);

    expect(solution.roots.map((root) => root.real)).toEqual([-2, -3]);
    expect(solution.steps[0].latex).toBe("x^2 + 5x + 6 = 0");
    expect(solution.steps.some((step) => step.description.includes("-b = -5"))).toBe(true);
    expect(solution.steps.some((step) => step.latex.includes("x_1") && step.latex.includes("= -2"))).toBe(true);
    expect(solution.steps.some((step) => step.latex.includes("(x + 2)(x + 3) = 0"))).toBe(true);
  });
});
