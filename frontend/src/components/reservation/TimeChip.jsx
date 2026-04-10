export default function TimeChip({ time, active, onClick, variant = "free" }) {
  const styles =
    variant === "free"
      ? active
        ? "border-amber-300 bg-amber-400 text-stone-950"
        : "border-emerald-400/30 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20"
      : "border-red-400/30 bg-red-500/10 text-red-200";

  return (
    <button
      type="button"
      disabled={variant !== "free"}
      onClick={onClick}
      className={`rounded-2xl border px-4 py-2 text-sm transition ${styles} ${
        variant !== "free" ? "cursor-not-allowed opacity-70" : ""
      }`}
    >
      {time}
    </button>
  );
}