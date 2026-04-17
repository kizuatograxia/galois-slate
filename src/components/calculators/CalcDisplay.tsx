interface CalcDisplayProps {
  display: string;
  history: string;
  accentColor?: string;
}

const CalcDisplay = ({ display, history, accentColor = "hsl(220,18%,18%)" }: CalcDisplayProps) => (
  <div
    className="rounded-xl px-4 pt-3 pb-4 mb-4 text-right select-none"
    style={{ background: accentColor }}
  >
    <div className="text-white/40 text-xs h-5 truncate font-mono">{history || "\u00a0"}</div>
    <div
      className="text-white font-mono truncate leading-none mt-1"
      style={{ fontSize: display.length > 12 ? "1.4rem" : display.length > 8 ? "1.8rem" : "2.4rem" }}
    >
      {display}
    </div>
  </div>
);

export default CalcDisplay;
