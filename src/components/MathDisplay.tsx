import { useEffect, useRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface MathDisplayProps {
  latex: string;
  displayMode?: boolean;
  className?: string;
}

const MathDisplay = ({ latex, displayMode = true, className = "" }: MathDisplayProps) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current) {
      try {
        katex.render(latex, ref.current, {
          displayMode,
          throwOnError: false,
          trust: true,
        });
      } catch {
        if (ref.current) ref.current.textContent = latex;
      }
    }
  }, [latex, displayMode]);

  return <span ref={ref} className={className} />;
};

export default MathDisplay;
