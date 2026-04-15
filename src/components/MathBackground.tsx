import { memo, useMemo } from "react";

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
  "Ric - ½Rg + Λg = 8πG/c⁴ T",
  "ds² = -c²dt² + a²(t)dr²",
  "∇·B = 0",
  "∇·E = ρ/ε₀",
  "S = k_B ln Ω",
  "E = mc²",
  "p̂ = -iℏ∇",
  "Ĥψ = iℏ∂ψ/∂t",
  "⟨x|p⟩ = e^{ipx/ℏ}/√(2πℏ)",
  "[x̂, p̂] = iℏ",
  "ΔxΔp ≥ ℏ/2",
  "F = ma",
  "∮ E·da = Q/ε₀",
  "d²x/dt² + ω²x = 0",
  "T = 2π√(L/g)",
  "v² = u² + 2as",
  "∂f/∂x = lim Δx→0",
  "∫₀^π sinx dx = 2",
  "A = πr²",
  "V = 4/3 πr³",
  "C = 2πr",
  "e^{iθ} = cosθ + isinθ",
  "∇f = (∂f/∂x, ∂f/∂y)",
  "det(AB) = det(A)det(B)",
  "rank(A) ≤ min(m,n)",
  "∑ₖ₌₁ⁿ k = n(n+1)/2",
  "∑ₖ₌₁ⁿ k² = n(n+1)(2n+1)/6",
  "∫ eˣ dx = eˣ + C",
  "d/dx(ln x) = 1/x",
  "lim n→∞ (1+1/n)ⁿ = e",
  "aⁿ - bⁿ = (a-b)∑aᵏbⁿ⁻¹⁻ᵏ",
  "∫₀^1 xⁿ dx = 1/(n+1)",
  "nCr = n!/r!(n-r)!",
  "∂²f/∂x∂y = ∂²f/∂y∂x",
  "curl(grad f) = 0",
  "div(curl F) = 0",
  "W = ∫ F·ds",
  "dS/dt ≥ 0",
  "PV = nRT",
  "ΔG = ΔH - TΔS",
  "λ = h/p",
  "E = hν",
  "R_μν = 0",
];

// Deterministic pseudo-random from index (no Math.random — SSR-safe)
const rng = (seed: number): number => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
};

// Equations stay visible ~93 % of their cycle; invisible only ~7 %.
// Three profiles vary the write-speed for natural feel.
const CHALK_KEYFRAMES = `
  @keyframes chalkWrite1 {
    0%   { clip-path: inset(0 100% 0 0); opacity: 0; }
    2%   { opacity: 1; }
    10%  { clip-path: inset(0 0% 0 0);   opacity: 1; }
    89%  { clip-path: inset(0 0% 0 0);   opacity: 1; }
    96%  { clip-path: inset(0 0% 0 0);   opacity: 0; }
    100% { clip-path: inset(0 100% 0 0); opacity: 0; }
  }
  @keyframes chalkWrite2 {
    0%   { clip-path: inset(0 100% 0 0); opacity: 0; }
    2%   { opacity: 1; }
    15%  { clip-path: inset(0 0% 0 0);   opacity: 1; }
    87%  { clip-path: inset(0 0% 0 0);   opacity: 1; }
    95%  { clip-path: inset(0 0% 0 0);   opacity: 0; }
    100% { clip-path: inset(0 100% 0 0); opacity: 0; }
  }
  @keyframes chalkWrite3 {
    0%   { clip-path: inset(0 100% 0 0); opacity: 0; }
    2%   { opacity: 1; }
    8%   { clip-path: inset(0 0% 0 0);   opacity: 1; }
    91%  { clip-path: inset(0 0% 0 0);   opacity: 1; }
    97%  { clip-path: inset(0 0% 0 0);   opacity: 0; }
    100% { clip-path: inset(0 100% 0 0); opacity: 0; }
  }
`;

interface MathBackgroundProps {
  opacity?: number;
  color?: string;
  className?: string;
}

// Generate enough cells to fill up to 2K screens (2560×1440).
// auto-fill columns + fixed row height = no gaps at any viewport.
const CELL_COUNT = 800;

const MathBackground = memo(({ opacity = 0.09, color, className = "" }: MathBackgroundProps) => {
  const cells = useMemo(
    () =>
      Array.from({ length: CELL_COUNT }, (_, i) => {
        const cycleDuration = 18 + rng(i) * 22;               // 18–40 s
        const startOffset = -(rng(i + 100) * cycleDuration);   // start mid-cycle
        const rotate = (rng(i + 200) - 0.5) * 3;              // ±1.5°
        const sizeScale = 0.85 + rng(i + 300) * 0.3;          // 0.85–1.15 em
        const variant = (Math.floor(rng(i + 400) * 3) + 1) as 1 | 2 | 3;

        return {
          text: mathLines[i % mathLines.length],
          duration: `${cycleDuration.toFixed(2)}s`,
          delay: `${startOffset.toFixed(2)}s`,
          rotate,
          sizeScale,
          variant,
        };
      }),
    [],
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CHALK_KEYFRAMES }} />

      <div
        className={`pointer-events-none absolute inset-0 overflow-hidden select-none ${className}`}
        aria-hidden="true"
        style={{
          color: color ?? "hsl(var(--foreground))",
          opacity,
          // Responsive base size: scales with viewport width
          fontSize: "clamp(0.58rem, 0.9vw, 0.92rem)",
        }}
      >
        <div
          style={{
            display: "grid",
            // Auto-fill: adds more columns on wider screens
            gridTemplateColumns: "repeat(auto-fill, minmax(9rem, 1fr))",
            // Fixed compact row height — scales with vh so rows stay tight on any screen
            gridAutoRows: "clamp(1.3rem, 2.4vh, 2.2rem)",
            width: "100%",
            height: "100%",
          }}
        >
          {cells.map((cell, i) => (
            <span
              key={i}
              className="font-chalk whitespace-nowrap overflow-hidden"
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: `${cell.sizeScale}em`,
                transform: `rotate(${cell.rotate}deg)`,
                transformOrigin: "left center",
                lineHeight: 1.2,
                animation: `chalkWrite${cell.variant} ${cell.duration} ${cell.delay} infinite linear`,
                textShadow: "0 0 1px currentColor",
              }}
            >
              {cell.text}
            </span>
          ))}
        </div>
      </div>
    </>
  );
});

MathBackground.displayName = "MathBackground";

export default MathBackground;
