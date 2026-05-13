import React from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import MenuHero from "../components/menu/MenuHero";
import ChefHighlight from "../components/menu/ChefHighlight";
import MenuCategorySection from "../components/menu/MenuCategorySection";
import menuPageData from "../data/menuPageData";
import { buildMenuDataFromCms } from "../utils/menuUtils";

export default function MenuPage({
  t,
  language,
  setLanguage,
  onOpenReservation,
  onBackHome,
  cmsMenuItems,
}) {
  const data = React.useMemo(
    () => buildMenuDataFromCms(cmsMenuItems, language, menuPageData[language]),
    [cmsMenuItems, language]
  );
  const [activeCategory, setActiveCategory] = React.useState(
    data.categories[0]?.id || ""
  );
  const activeCategoryData =
    data.categories.find((category) => category.id === activeCategory) ||
    data.categories[0];

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
    <div className="luxury-shell min-h-screen text-white">
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

      <div className="relative z-40 border-y border-white/10 bg-[#090705]/90 backdrop-blur-2xl">
        <div className="mx-auto max-w-7xl px-4 py-2.5 md:px-6 md:py-3">
          <div className="mb-2 flex items-center justify-between gap-3 md:hidden">
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-[0.22em] text-[#d8b377]">
                {language === "bg" ? "Секция" : "Section"}
              </div>
              <div className="truncate text-sm font-semibold text-[#fff4df]">
                {activeCategoryData?.title}
              </div>
            </div>
            <button
              type="button"
              onClick={onBackHome}
              className="ghost-button shrink-0 rounded-full px-3 py-2 text-xs font-medium"
            >
              {language === "bg" ? "Начало" : "Home"}
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none md:gap-3">
            {data.categories.map((category) => {
              const isActive = activeCategory === category.id;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleCategoryClick(category.id)}
                  className={`whitespace-nowrap rounded-full border px-3.5 py-2 text-xs font-semibold transition active:scale-95 md:px-4 md:text-sm ${
                    isActive
                      ? "border-[#c9a56a]/40 bg-[#c9a56a] text-black shadow-lg shadow-[#c9a56a]/20"
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
              className="ghost-button hidden whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium md:block"
            >
              {language === "bg" ? "Начало" : "Home"}
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="order-2 mx-auto grid max-w-7xl gap-10 px-6 pb-12 pt-8 md:gap-14 md:pb-20 md:pt-10">
          {data.categories.map((category) => (
            <MenuCategorySection
              key={category.id}
              category={category}
              language={language}
            />
          ))}
        </div>

        <div className="order-1">
          <ChefHighlight data={data} />
        </div>
      </div>

      <Footer t={t} />
    </div>
  );
}
