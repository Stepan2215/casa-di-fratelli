import React from "react";

export default function BackToTopButton() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 520);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={scrollToTop}
      className={`fixed bottom-5 right-5 z-[70] flex h-12 w-12 items-center justify-center rounded-full border border-[#c9a56a]/35 bg-[#0f0b08]/88 text-[#f2d39a] shadow-2xl shadow-black/35 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-[#f2d39a]/70 hover:text-white md:bottom-7 md:right-7 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m18 15-6-6-6 6" />
      </svg>
    </button>
  );
}
