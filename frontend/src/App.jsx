import React from "react";
import translations from "./i18n/translations";
import { tables } from "./data/tablesData";
import { galleryImages } from "./data/restaurantData";
import HomePage from "./pages/HomePage";
import ReservationPage from "./pages/ReservationPage";
import MenuPage from "./pages/MenuPage";

const safeReadStoredLanguage = () => {
  if (typeof window === "undefined") return "bg";
  const stored = window.localStorage.getItem("restaurant-lang");
  return stored === "en" ? "en" : "bg";
};

const runSanityChecks = () => {
  console.assert(typeof translations.bg.navGallery === "string", "BG translation missing navGallery");
  console.assert(typeof translations.en.navReservation === "string", "EN translation missing navReservation");
  //console.assert(Array.isArray(menuData.starters.bg), "BG starters should be an array");
  console.assert(galleryImages.length > 0, "Gallery should not be empty");
  console.assert(tables.length > 0, "Tables should not be empty");
};

runSanityChecks();

export default function App() {
  const [language, setLanguage] = React.useState(safeReadStoredLanguage);
  const [currentPage, setCurrentPage] = React.useState("home");

  const t = translations[language];

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("restaurant-lang", language);
      document.documentElement.lang = language;
    }
  }, [language]);

  if (currentPage === "reservation-map") {
    return (
      <ReservationPage
        t={t}
        language={language}
        setLanguage={setLanguage}
        onBack={() => setCurrentPage("home")}
      />
    );
  }

  if (currentPage === "menu") {
    return (
      <MenuPage
        t={t}
        language={language}
        setLanguage={setLanguage}
        onOpenReservation={() => setCurrentPage("reservation-map")}
        onBackHome={() => setCurrentPage("home")}
      />
    );
  }

  return (
    <HomePage
      t={t}
      language={language}
      setLanguage={setLanguage}
      onOpenReservation={() => setCurrentPage("reservation-map")}
      onOpenMenu={() => setCurrentPage("menu")}
    />
  );
}