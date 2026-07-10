import { cn } from "@/lib/utils";
import type { Scores } from "@/types";

type CardDef = {
  key: keyof Scores;
  label: string;
  /** higher is better? for ambiguity higher = worse */
  invert?: boolean;
};

const CARDS: CardDef[] = [
  { key: "completeness", label: "Completeness" },
  { key: "ambiguity", label: "Ambiguity", invert: true },
  { key: "testability", label: "Testability" },
  { key: "consistency", label: "Consistency" },
];

/** Pick a status chip + bar colour from a 0-100 score. */
function band(value: number, invert?: boolean) {
  // invert => higher is worse
  const good = invert ? value <= 10 : value >= 85;
  const mid = invert ? value <= 25 : value >= 70;
  if (good)
    return {
      chip: "bg-teal-mint text-ink",
      chipLabel: invert ? "Healthy" : "Optimal",
      bar: "bg-ink",
    };
  if (mid)
    return {
      chip: "bg-rose-deep text-ink",
      chipLabel: invert ? "Action Needed" : "Review",
      bar: "bg-coral",
    };
  return {
    chip: "bg-rose text-coral-deep",
    chipLabel: invert ? "Action Needed" : "Review",
    bar: "bg-coral-deep",
  };
}

export function SummaryCards({ scores }: { scores: Scores }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {CARDS.map((card, i) => {
        const value = scores[card.key];
        const b = band(value, card.invert);
        const accent =
          card.key === "completeness"
            ? "bg-teal-mint"
            : card.key === "testability"
              ? "bg-teal-bright"
              : card.key === "consistency"
                ? "bg-rose-deep"
                : "bg-coral";
        return (
          <div
            key={card.key}
            className="bg-paper border-neo border-ink shadow-neo rounded-card p-6 relative overflow-hidden"
          >
            <div
              className={cn(
                "absolute top-0 right-0 w-16 h-16 rounded-bl-full border-neo border-ink border-t-0 border-r-0 -mt-[3px] -mr-[3px]",
                accent,
              )}
            />
            <h3 className="text-label-bold text-on-surface-variant mb-2 uppercase tracking-wider">
              {card.label}
            </h3>
            <div
              className={cn(
                "text-headline-lg mb-4 font-black",
                b.chip.includes("rose") || b.chip.includes("coral")
                  ? "text-coral-deep"
                  : "text-ink",
              )}
            >
              {value}%
            </div>
            <div className="w-full h-4 border-neo border-ink bg-paper mb-3">
              <div
                className={cn("h-full", b.bar)}
                style={{ width: `${Math.max(value, 4)}%` }}
              />
            </div>
            <span
              className={cn(
                "inline-block font-caption text-caption px-3 py-1 border-neo border-ink",
                b.chip,
              )}
            >
              {b.chipLabel}
            </span>
          </div>
        );
      })}
    </div>
  );
}
