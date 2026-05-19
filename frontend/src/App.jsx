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

const safeReadAdminToken = () => {
  if (typeof window === "undefined") return "";
  return window.sessionStorage.getItem("admin-token") || "";
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

function AdminLogin({ onLogin }) {
  const [email, setEmail] = React.useState(() =>
    typeof window === "undefined"
      ? "admin@casadifratelli.local"
      : window.localStorage.getItem("admin-email") || "admin@casadifratelli.local"
  );
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  function storeLogin(data) {
    window.sessionStorage.setItem("admin-token", data.token);
    window.sessionStorage.setItem("admin-user", JSON.stringify(data.user));
    window.localStorage.setItem("admin-email", email);
    onLogin(data.token, data.user);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        setError("Грешен email или парола.");
        return;
      }

      storeLogin(await response.json());
    } catch {
      setError("Неуспешен вход. Опитайте отново.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleQuickLogin() {
    const credentialToken = window.localStorage.getItem("admin-device-token");
    if (!credentialToken) {
      setError("Бързият вход не е активиран на това устройство.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      if (window.PublicKeyCredential && navigator.credentials?.get) {
        await navigator.credentials.get({
          publicKey: {
            challenge: crypto.getRandomValues(new Uint8Array(32)),
            timeout: 60000,
            userVerification: "required",
          },
        });
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/device-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credentialToken }),
      });

      if (!response.ok) {
        setError("Бързият вход не е активен. Влезте с парола.");
        return;
      }

      storeLogin(await response.json());
    } catch {
      setError("Бързият вход беше отказан.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="luxury-shell flex min-h-screen items-center justify-center px-5 py-10 text-white">
      <form
        onSubmit={handleSubmit}
        className="luxury-panel w-full max-w-md rounded-[28px] p-6 md:p-8"
      >
        <img
          src="/casa-di-fratelli-logo.svg"
          alt="Casa di Fratelli"
          className="brand-logo mb-7 h-16 w-[220px] object-left"
        />
        <p className="section-kicker">Casa di Fratelli Admin OS</p>
        <h1 className="mt-3 text-3xl font-semibold text-[#fff4df]">Admin Login</h1>
        <p className="mt-3 text-sm leading-6 text-stone-400">
          Въведете email и парола за достъп до CRM панела.
        </p>

        <label className="mt-7 block text-sm font-semibold text-white/65">Email</label>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoFocus
          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition focus:border-[#f2d39a]/55"
        />

        <label className="mt-4 block text-sm font-semibold text-white/65">Парола</label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-white outline-none transition focus:border-[#f2d39a]/55"
        />

        {error && (
          <div className="mt-4 rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="luxury-button mt-6 w-full rounded-2xl px-5 py-4 text-sm font-semibold disabled:opacity-60"
        >
          {isSubmitting ? "Влизане..." : "Влез"}
        </button>
        <button
          type="button"
          onClick={handleQuickLogin}
          disabled={isSubmitting}
          className="ghost-button mt-3 w-full rounded-2xl px-5 py-4 text-sm font-semibold disabled:opacity-60"
        >
          Face ID / Touch ID
        </button>
      </form>
    </div>
  );
}

export default function App() {
  const [language, setLanguage] = React.useState(safeReadStoredLanguage);
  const [currentPage, setCurrentPage] = React.useState(getInitialPage);
  const [cmsMenuItems, setCmsMenuItems] = React.useState([]);
  const [adminToken, setAdminToken] = React.useState(safeReadAdminToken);
  const [adminUser, setAdminUser] = React.useState(() => {
    if (typeof window === "undefined") return null;
    try {
      return JSON.parse(window.sessionStorage.getItem("admin-user") || "null");
    } catch {
      return null;
    }
  });
  const swipeStartRef = React.useRef(null);
  const pendingHomeSectionRef = React.useRef("");

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

  const openHomeSection = React.useCallback((sectionId) => {
    pendingHomeSectionRef.current = sectionId;
    setCurrentPage("home");
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (pendingHomeSectionRef.current) return;

    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  }, [currentPage]);

  React.useEffect(() => {
    if (currentPage !== "home" || !pendingHomeSectionRef.current) return;

    const sectionId = pendingHomeSectionRef.current;
    pendingHomeSectionRef.current = "";

    window.requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, [currentPage]);

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
    if (!adminToken) {
      return (
        <AdminLogin
          onLogin={(token, user) => {
            setAdminToken(token);
            setAdminUser(user);
          }}
        />
      );
    }

    return (
      <>
        <AdminPage
          adminToken={adminToken}
          onAdminLogout={() => {
            window.sessionStorage.removeItem("admin-token");
            window.sessionStorage.removeItem("admin-user");
            setAdminToken("");
            setAdminUser(null);
          }}
          adminUser={adminUser}
          onMenuChanged={loadMenuItems}
        />
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
          onOpenSection={openHomeSection}
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
          onOpenSection={openHomeSection}
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
        onOpenSection={openHomeSection}
        onOpenPrivacy={() => setCurrentPage("privacy")}
        cmsMenuItems={cmsMenuItems}
      />
      <BackToTopButton />
    </>
  );
}
