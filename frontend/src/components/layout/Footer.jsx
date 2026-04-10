export default function Footer({ t }) {
  return (
    <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-stone-400">
      <div className="mb-2 text-xs uppercase tracking-[0.35em] text-red-400">
        Grill, Pizza, Pasta
      </div>
      {t.footer}
    </footer>
  );
}