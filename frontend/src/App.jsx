import React from "react";
import translations from "./i18n/translations";
import { tables } from "./data/tablesData";
import { galleryImages } from "./data/restaurantData";
import HomePage from "./pages/HomePage";
import ReservationPage from "./pages/ReservationPage";
import MenuPage from "./pages/MenuPage";
import AdminPage from "./pages/AdminPage";

const safeReadStoredLanguage = () => {
  if (typeof window === "undefined") return "bg";
  const stored = window.localStorage.getItem("restaurant-lang");
  return stored === "en" ? "en" : "bg";
};

const getInitialPage = () => {
  if (typeof window === "undefined") return "home";

  if (window.location.pathname === "/admin") {
    return "admin";
  }

  return "home";
};

const runSanityChecks = () => {
  console.assert(typeof translations.bg.navGallery === "string", "BG translation missing navGallery");
  console.assert(typeof translations.en.navReservation === "string", "EN translation missing navReservation");
  console.assert(galleryImages.length > 0, "Gallery should not be empty");
  console.assert(tables.length > 0, "Tables should not be empty");
};

runSanityChecks();

export default function App() {
  const [language, setLanguage] = React.useState(safeReadStoredLanguage);
  const [currentPage, setCurrentPage] = React.useState(getInitialPage);

  const t = translations[language];

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("restaurant-lang", language);
      document.documentElement.lang = language;
    }
  }, [language]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const nextPath = currentPage === "admin" ? "/admin" : "/";
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, "", nextPath);
    }
  }, [currentPage]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const handlePopState = () => {
      setCurrentPage(window.location.pathname === "/admin" ? "admin" : "home");
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  if (currentPage === "admin") {
    return <AdminPage />;
  }

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