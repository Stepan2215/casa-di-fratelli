import React from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import MenuHero from "../components/menu/MenuHero";
import ChefHighlight from "../components/menu/ChefHighlight";
import MenuCategorySection from "../components/menu/MenuCategorySection";
import menuPageData from "../data/menuPageData";

export default function MenuPage({
  t,
  language,
  setLanguage,
  onOpenReservation,
  onBackHome,
}) {
  const data = menuPageData[language];
  const [activeCategory, setActiveCategory] = React.useState(
    data.categories[0]?.id || ""
  );

  React.useEffect(() => {
    const sectionIds = data.categories.map((category) => category.id);

    const handleScroll = () => {
      let current = sectionIds[0];

      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (!element) continue;

        const rect = element.getBoundingClientRect();

        if (rect.top <= 160) {
          current = id;
        }
      }

      setActiveCategory(current);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [data.categories]);

  const handleCategoryClick = (id) => {
    const element = document.getElementById(id);
    if (!element) return;

    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="min-h-screen bg-[#0f0b08] text-white">
      <Header
        t={t}
        language={language}
        setLanguage={setLanguage}
        onOpenReservation={onOpenReservation}
        onOpenMenu={() => {}}
        onGoHome={onBackHome}
      />

        <MenuHero
        data={data}
        onOpenReservation={onOpenReservation}
        language={language}
        />

      <div className="sticky top-[78px] md:top-[160px] z-40 border-b border-white/10 bg-[#0f0b08]/95 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-3 md:px-6 md:py-4">
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
            {data.categories.map((category) => {
              const isActive = activeCategory === category.id;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleCategoryClick(category.id)}
                  className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? "border-[#c9a56a]/40 bg-[#c9a56a] text-black"
                      : "border-white/10 bg-white/5 text-white/75 hover:border-[#c9a56a]/30 hover:text-[#f2d3a0]"
                  }`}
                >
                  {category.title}
                </button>
              );
            })}

            <button
              type="button"
              onClick={onBackHome}
              className="whitespace-nowrap rounded-full border border-[#c9a56a]/30 bg-[#c9a56a]/10 px-4 py-2 text-sm font-medium text-[#f2d3a0] transition hover:bg-[#c9a56a]/20"
            >
              {language === "bg" ? "Начало" : "Home"}
            </button>
          </div>
        </div>
      </div>

      <ChefHighlight data={data} />

      <div className="mx-auto grid max-w-7xl gap-14 px-6 pb-20 pt-10">
        {data.categories.map((category) => (
          <MenuCategorySection key={category.id} category={category} />
        ))}
      </div>

      <Footer t={t} />
    </div>
  );
}