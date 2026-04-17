import { memo } from "react";

interface GaloisLogoProps {
  /** "full" = icon + "Galois" + "Canvas" subtitle  |  "compact" = icon + "Galois" only */
  variant?: "full" | "compact";
  className?: string;
}

/**
 * Galois Canvas wordmark.
 *
 * The mark is a triangle inscribed in a circle — representing the three roots
 * of a cubic equation being permuted by the Galois group S₃.
 * The topmost vertex (brightest) is the generating element of the splitting field.
 */
const GaloisLogo = memo(({ variant = "full", className = "" }: GaloisLogoProps) => {
  const isCompact = variant === "compact";

  return (
    <svg
      viewBox={isCompact ? "0 0 148 36" : "0 0 220 52"}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Galois Canvas"
      role="img"
      className={className}
    >
      <defs>
        <radialGradient id="gc-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8ab8ff"/>
          <stop offset="100%" stopColor="#3a72d8"/>
        </radialGradient>
        <linearGradient id="gc-tri" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2d62cc"/>
          <stop offset="100%" stopColor="#174082"/>
        </linearGradient>
      </defs>

      {/* ── Icon mark ── */}
      {isCompact ? (
        /* compact: icon 36×36 */
        <g>
          <circle cx="18" cy="18" r="12.6" stroke="#1e3e7a" strokeWidth="0.9" opacity="0.45"/>
          <polygon
            points="18,6 27.39,23.5 8.61,23.5"
            stroke="url(#gc-tri)"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <circle cx="18" cy="6" r="2.8" fill="url(#gc-glow)"/>
          <circle cx="27.39" cy="23.5" r="2.2" fill="#3a72d8"/>
          <circle cx="8.61" cy="23.5" r="2.2" fill="#3a72d8"/>
        </g>
      ) : (
        /* full: icon 52×52 */
        <g>
          <circle cx="26" cy="26" r="18.2" stroke="#1e3e7a" strokeWidth="1" opacity="0.4"/>
          <polygon
            points="26,8.75 39.58,32.5 12.42,32.5"
            stroke="url(#gc-tri)"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="26" cy="8.75" r="3.8" fill="url(#gc-glow)"/>
          <circle cx="39.58" cy="32.5" r="3" fill="#3a72d8"/>
          <circle cx="12.42" cy="32.5" r="3" fill="#3a72d8"/>
        </g>
      )}

      {/* ── Wordmark ── */}
      {isCompact ? (
        <text
          x="46"
          y="24"
          fontFamily="'Cormorant Garamond', Georgia, serif"
          fontSize="22"
          fontWeight="600"
          fill="hsl(215, 50%, 10%)"
        >
          Galois
        </text>
      ) : (
        <>
          <text
            x="66"
            y="34"
            fontFamily="'Cormorant Garamond', Georgia, serif"
            fontSize="30"
            fontWeight="600"
            fill="hsl(215, 50%, 10%)"
          >
            Galois
          </text>
          <text
            x="67"
            y="48"
            fontFamily="'Cormorant Garamond', Georgia, serif"
            fontSize="12"
            fontWeight="400"
            letterSpacing="0.28em"
            fill="hsl(215, 25%, 46%)"
          >
            CANVAS
          </text>
        </>
      )}
    </svg>
  );
});

GaloisLogo.displayName = "GaloisLogo";
export default GaloisLogo;
