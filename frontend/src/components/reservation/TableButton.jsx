export default function TableButton({ table, isSelected, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(table)}
      className={`absolute ${table.position} flex h-16 w-16 items-center justify-center rounded-full border text-sm font-semibold shadow-xl transition hover:scale-105 ${
        isSelected
          ? "border-amber-300 bg-amber-400 text-stone-950"
          : "border-white/20 bg-stone-900/90 text-white hover:border-amber-300"
      }`}
    >
      {table.id}
    </button>
  );
}