import GoldStar from "../../assets/GoldStar.svg";
import Star from "../../assets/Star.svg";

/**
 * Half star: outline + gold as same-sized backgrounds; gold clipped to left 50% (vertical cut).
 * Shared by customer ServiceCard / dealer detail and pro dashboard.
 */
export function HalfStarCut({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <div className={`relative inline-block shrink-0 ${className}`} aria-hidden>
      <div
        className="pointer-events-none absolute inset-0 bg-contain bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${Star})` }}
      />
      <div
        className="pointer-events-none absolute inset-0 bg-contain bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${GoldStar})`,
          clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)",
          WebkitClipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)",
        }}
      />
    </div>
  );
}
