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

// A few lightweight writers sit on top of dense static rows. This keeps the
// "chalk writing" feel without animating hundreds of independent cells.
const CHALK_KEYFRAMES = `
  @keyframes chalkWrite {
    0%   { clip-path: inset(0 100% 0 0); opacity: 0; }
    5%   { opacity: .92; }
    24%  { clip-path: inset(0 0% 0 0); opacity: .92; }
    78%  { clip-path: inset(0 0% 0 0); opacity: .92; }
    94%  { clip-path: inset(0 0% 0 0); opacity: 0; }
    100% { clip-path: inset(0 0% 0 0); opacity: 0; }
  }

  @media (prefers-reduced-motion: reduce) {
    .chalk-writer {
      animation: none !important;
      clip-path: none !important;
      opacity: .85 !important;
    }
  }
`;

interface MathBackgroundProps {
  opacity?: number;
  color?: string;
  className?: string;
}

const ROW_COUNT = 72;
const TERMS_PER_ROW = 30;
const WRITER_COUNT = 16;

const makeLine = (seed: number, terms: number) =>
  Array.from({ length: terms }, (_, i) => mathLines[(seed * 7 + i * 11) % mathLines.length]).join("   ");

const MathBackground = memo(({ opacity = 0.09, color, className = "" }: MathBackgroundProps) => {
  const rows = useMemo(
    () =>
      Array.from({ length: ROW_COUNT }, (_, i) => ({
        text: makeLine(i, TERMS_PER_ROW),
        top: `${-3 + (i * 106) / (ROW_COUNT - 1)}%`,
        left: `${-34 - rng(i + 20) * 18}%`,
        rotate: (rng(i + 40) - 0.5) * 1.8,
        sizeScale: 0.88 + rng(i + 60) * 0.24,
        alpha: 0.7 + rng(i + 80) * 0.3,
      })),
    [],
  );

  const writers = useMemo(
    () =>
      Array.from({ length: WRITER_COUNT }, (_, i) => {
        const duration = 16 + rng(i + 120) * 16;

        return {
          text: mathLines[(i * 13 + 5) % mathLines.length],
          top: `${4 + rng(i + 140) * 90}%`,
          left: `${-6 + rng(i + 160) * 98}%`,
          rotate: (rng(i + 180) - 0.5) * 4,
          sizeScale: 0.95 + rng(i + 200) * 0.35,
          animation: `chalkWrite ${duration.toFixed(1)}s -${(rng(i + 220) * duration).toFixed(1)}s infinite linear`,
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
          fontSize: "clamp(0.68rem, 1.05vw, 1rem)",
        }}
      >
        <div className="absolute inset-0" style={{ contain: "layout paint style" }}>
          {rows.map((row, i) => (
            <span
              key={i}
              className="absolute font-chalk whitespace-nowrap"
              style={{
                top: row.top,
                left: row.left,
                fontSize: `${row.sizeScale}em`,
                lineHeight: 0.95,
                opacity: row.alpha,
                transform: `rotate(${row.rotate}deg)`,
                transformOrigin: "left center",
                textShadow: "0 0 1px currentColor",
              }}
            >
              {row.text}
            </span>
          ))}

          {writers.map((writer, i) => (
            <span
              key={`writer-${i}`}
              className="chalk-writer absolute inline-block font-chalk whitespace-nowrap"
              style={{
                top: writer.top,
                left: writer.left,
                fontSize: `${writer.sizeScale}em`,
                lineHeight: 0.95,
                transform: `rotate(${writer.rotate}deg)`,
                transformOrigin: "left center",
                animation: writer.animation,
                textShadow: "0 0 1px currentColor",
                willChange: "clip-path, opacity",
              }}
            >
              {writer.text}
            </span>
          ))}
        </div>
      </div>
    </>
  );
});

MathBackground.displayName = "MathBackground";

export default MathBackground;
