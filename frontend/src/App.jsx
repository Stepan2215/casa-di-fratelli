import React from "react";
import translations from "./i18n/translations";
import { tables } from "./data/tablesData";
import { galleryImages } from "./data/restaurantData";
import HomePage from "./pages/HomePage";
import ReservationPage from "./pages/ReservationPage";
import MenuPage from "./pages/MenuPage";
import AdminPage from "./pages/AdminPage";
import PrivacyPage from "./pages/PrivacyPage";
import { API_BASE_URL } from "./config/api";
import BackToTopButton from "./components/layout/BackToTopButton";

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

  if (window.location.pathname === "/reservation") {
    return "reservation-map";
  }

  if (window.location.pathname === "/menu") {
    return "menu";
  }

  if (window.location.pathname === "/privacy") {
    return "privacy";
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

function isInteractiveSwipeTarget(target) {
  return Boolean(target?.closest?.("input, textarea, select, button, a, [role='button']"));
}

export default function App() {
  const [language, setLanguage] = React.useState(safeReadStoredLanguage);
  const [currentPage, setCurrentPage] = React.useState(getInitialPage);
  const [cmsMenuItems, setCmsMenuItems] = React.useState([]);
  const swipeStartRef = React.useRef(null);

  const t = translations[language];

  const loadMenuItems = React.useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/menu`);
      if (!response.ok) return;

      const data = await response.json();
      setCmsMenuItems(Array.isArray(data) ? data : []);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn("Using fallback menu because public menu failed to load.", error);
      }
    }
  }, []);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("restaurant-lang", language);
      document.documentElement.lang = language;
    }
  }, [language]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const pagePaths = {
      admin: "/admin",
      "reservation-map": "/reservation",
      menu: "/menu",
      privacy: "/privacy",
      home: "/",
    };
    const nextPath = pagePaths[currentPage] || "/";
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, "", nextPath);
    }
  }, [currentPage]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const handlePopState = () => {
      const path = window.location.pathname;

      if (path === "/admin") {
        setCurrentPage("admin");
        return;
      }

      if (path === "/reservation") {
        setCurrentPage("reservation-map");
        return;
      }

      if (path === "/menu") {
        setCurrentPage("menu");
        return;
      }

      if (path === "/privacy") {
        setCurrentPage("privacy");
        return;
      }

      setCurrentPage("home");
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  React.useEffect(() => {
    loadMenuItems();
  }, [loadMenuItems]);

  React.useEffect(() => {
    if (typeof window === "undefined" || currentPage === "admin") return undefined;

    const pages = ["home", "menu", "reservation-map", "privacy"];

    const handleTouchStart = (event) => {
      if (event.touches.length !== 1 || isInteractiveSwipeTarget(event.target)) {
        swipeStartRef.current = null;
        return;
      }

      const touch = event.touches[0];
      swipeStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
      };
    };

    const handleTouchEnd = (event) => {
      const start = swipeStartRef.current;
      swipeStartRef.current = null;
      if (!start || event.changedTouches.length !== 1) return;

      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - start.x;
      const deltaY = touch.clientY - start.y;
      if (Math.abs(deltaX) < 70 || Math.abs(deltaX) < Math.abs(deltaY) * 1.35) return;

      const index = pages.indexOf(currentPage);
      if (index === -1) return;

      const nextIndex = deltaX < 0 ? index - 1 : index + 1;
      if (nextIndex < 0 || nextIndex >= pages.length) return;

      setCurrentPage(pages[nextIndex]);
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentPage]);

  if (currentPage === "admin") {
    return (
      <>
        <AdminPage onMenuChanged={loadMenuItems} />
        <BackToTopButton />
      </>
    );
  }

  if (currentPage === "reservation-map") {
    return (
      <>
        <ReservationPage
          t={t}
          language={language}
          setLanguage={setLanguage}
          onBack={() => setCurrentPage("home")}
          onOpenPrivacy={() => setCurrentPage("privacy")}
        />
        <BackToTopButton />
      </>
    );
  }

  if (currentPage === "menu") {
    return (
      <>
        <MenuPage
          t={t}
          language={language}
          setLanguage={setLanguage}
          onOpenReservation={() => setCurrentPage("reservation-map")}
          onBackHome={() => setCurrentPage("home")}
          onOpenPrivacy={() => setCurrentPage("privacy")}
          cmsMenuItems={cmsMenuItems}
        />
        <BackToTopButton />
      </>
    );
  }

  if (currentPage === "privacy") {
    return (
      <>
        <PrivacyPage
          t={t}
          language={language}
          setLanguage={setLanguage}
          onOpenReservation={() => setCurrentPage("reservation-map")}
          onOpenMenu={() => setCurrentPage("menu")}
          onBackHome={() => setCurrentPage("home")}
        />
        <BackToTopButton />
      </>
    );
  }

  return (
    <>
      <HomePage
        t={t}
        language={language}
        setLanguage={setLanguage}
        onOpenReservation={() => setCurrentPage("reservation-map")}
        onOpenMenu={() => setCurrentPage("menu")}
        onOpenPrivacy={() => setCurrentPage("privacy")}
        cmsMenuItems={cmsMenuItems}
      />
      <BackToTopButton />
    </>
  );
}
