import { memo } from "react";

// Extensive real math expressions for background texture
const mathLines = [
  "∫₀^∞ e^{-x²} dx = √π/2",
  "∑ₙ₌₁^∞ 1/n² = π²/6",
  "eⁱᵖ + 1 = 0",
  "∂²u/∂t² = c²∇²u",
  "det(A-λI) = 0",
  "∇×E = -∂B/∂t",
  "ζ(s) = ∑ 1/nˢ",
  "Gal(E/F) ≅ S₃",
  "x = -b±√(b²-4ac)/2a",
  "lim h→0 [f(x+h)-f(x)]/h",
  "∮ F·dr = ∬ (∇×F)·dS",
  "P(A|B) = P(B|A)P(A)/P(B)",
  "∂L/∂q - d/dt(∂L/∂q̇) = 0",
  "[G:H] = |G|/|H|",
  "Ker(φ) ◁ G",
  "f(z) = ∑aₙ(z-z₀)ⁿ",
  "Tr(AB) = Tr(BA)",
  "‖u×v‖ = ‖u‖‖v‖sinθ",
  "∫∫∫ ρ dV = M",
  "∇²φ = -ρ/ε₀",
  "Rⁿ → Rᵐ : T(αu+βv)",
  "dim(V) = rank(T) + null(T)",
  "σ(AB) \\ {0} = σ(BA) \\ {0}",
  "∏ₚ (1-p⁻ˢ)⁻¹ = ζ(s)",
  "H = -∑ pᵢ log₂ pᵢ",
  "3x³ + 2x² - 7x + 1 = 0",
  "Δ = -4p³ - 27q²",
  "x₁ + x₂ + x₃ = -b/a",
  "x₁·x₂·x₃ = -d/a",
  "t³ + pt + q = 0",
  "u = ∛(-q/2 + √D)",
  "cos(α+β) = cosα·cosβ - sinα·sinβ",
  "d/dx[xⁿ] = nxⁿ⁻¹",
  "∫ sin²x dx = x/2 - sin(2x)/4",
  "A⁻¹ = adj(A)/det(A)",
  "λ₁λ₂λ₃ = det(A)",
  "‖Ax‖ ≤ ‖A‖·‖x‖",
  "(a+b)ⁿ = ∑ C(n,k)aⁿ⁻ᵏbᵏ",
  "φ(n) = n∏(1-1/p)",
  "a ≡ b (mod n)",
  "gcd(a,b)·lcm(a,b) = |ab|",
  "∑ₖ₌₀ⁿ (-1)ᵏC(n,k) = 0",
  "F(s) = ∫₀^∞ f(t)e⁻ˢᵗ dt",
  "Γ(n+1) = n!",
  "Bₙ = ∑ S(n,k)",
  "χ(G) = ∑ (-1)ⁱ rank(Hᵢ)",
  "12 × 47 = 564",
  "√2 ≈ 1.41421356…",
  "π ≈ 3.14159265…",
  "e ≈ 2.71828182…",
  "ln(ab) = ln(a) + ln(b)",
  "log₁₀(1000) = 3",
  "7! = 5040",
  "2¹⁰ = 1024",
  "∛27 = 3",
  "sin²θ + cos²θ = 1",
  "tan(π/4) = 1",
  "i² = -1",
  "ℝ ⊂ ℂ",
  "|z| = √(a²+b²)",
  "arg(z₁z₂) = arg(z₁)+arg(z₂)",
  "f'(x₀) = lim Δy/Δx",
  "∫₁^e 1/x dx = 1",
  "∑ 1/n! = e",
  "d(fg) = f·dg + g·df",
];

interface MathBackgroundProps {
  opacity?: number;
  color?: string;
  className?: string;
}

const MathBackground = memo(({ opacity = 0.06, color, className = "" }: MathBackgroundProps) => {
  // Create a dense grid of math expressions
  const cols = 5;
  const rows = Math.ceil(mathLines.length / cols);

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none ${className}`}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 grid gap-y-3 gap-x-6 px-4 py-4"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          opacity,
          color: color || "hsl(var(--foreground))",
        }}
      >
        {mathLines.map((line, i) => (
          <span
            key={i}
            className="whitespace-nowrap font-chalk text-sm md:text-base leading-relaxed"
            style={{
              transform: `translateY(${(i % 7) * 3}px)`,
            }}
          >
            {line}
          </span>
        ))}
      </div>
      {/* Repeat for taller screens */}
      <div
        className="absolute inset-x-0 top-[600px] grid gap-y-3 gap-x-6 px-4 py-4"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          opacity: opacity * 0.8,
          color: color || "hsl(var(--foreground))",
        }}
      >
        {[...mathLines].reverse().map((line, i) => (
          <span
            key={`r-${i}`}
            className="whitespace-nowrap font-chalk text-sm md:text-base leading-relaxed"
            style={{
              transform: `translateY(${(i % 5) * 4}px)`,
            }}
          >
            {line}
          </span>
        ))}
      </div>
      <div
        className="absolute inset-x-0 top-[1200px] grid gap-y-3 gap-x-6 px-4 py-4"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          opacity: opacity * 0.6,
          color: color || "hsl(var(--foreground))",
        }}
      >
        {mathLines.slice(0, 40).map((line, i) => (
          <span
            key={`t-${i}`}
            className="whitespace-nowrap font-chalk text-sm md:text-base leading-relaxed"
            style={{
              transform: `translateY(${(i % 3) * 5}px)`,
            }}
          >
            {line}
          </span>
        ))}
      </div>
    </div>
  );
});

MathBackground.displayName = "MathBackground";

export default MathBackground;
