import React from "react";
import { API_BASE_URL } from "../config/api";

const fallbackGoogleReviewUrl = "https://www.google.com/search?q=Casa+di+Fratelli+Plovdiv+reviews";

export default function ReviewLandingPage({ language = "bg", waiterSlug = "" }) {
  const [googleUrl, setGoogleUrl] = React.useState(fallbackGoogleReviewUrl);
  const [waiterName, setWaiterName] = React.useState("");
  const [status, setStatus] = React.useState("loading");

  React.useEffect(() => {
    let cancelled = false;
    let timer;

    async function trackAndRedirect() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/review/${encodeURIComponent(waiterSlug)}/click`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        const data = response.ok ? await response.json() : {};
        const nextUrl = data.googleReviewUrl || fallbackGoogleReviewUrl;

        if (cancelled) return;
        setGoogleUrl(nextUrl);
        setWaiterName(data.waiterName || "");
        setStatus(data.tracked ? "tracked" : "fallback");

        timer = window.setTimeout(() => {
          window.location.href = nextUrl;
        }, 1400);
      } catch {
        if (cancelled) return;
        setStatus("fallback");
        timer = window.setTimeout(() => {
          window.location.href = fallbackGoogleReviewUrl;
        }, 1400);
      }
    }

    trackAndRedirect();

    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [waiterSlug]);

  return (
    <main className="luxury-shell flex min-h-screen items-center justify-center px-5 py-12 text-white">
      <section className="luxury-panel relative w-full max-w-xl overflow-hidden rounded-[34px] p-7 text-center shadow-2xl md:p-10">
        <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#f2d39a]/70 to-transparent" />
        <img
          src="/casa-di-fratelli-logo.svg"
          alt="Casa di Fratelli"
          className="brand-logo mx-auto h-20 w-[240px] object-contain"
        />

        <p className="section-kicker mt-7">
          {language === "bg" ? "Благодарим ви" : "Thank you"}
        </p>
        <h1 className="mt-4 text-3xl font-semibold leading-tight text-[#fff4df] md:text-5xl">
          {language === "bg" ? "Благодарим ви за посещението!" : "Thank you for visiting!"}
        </h1>
        <p className="mt-5 text-base leading-8 text-white/68 md:text-lg">
          {language === "bg"
            ? "Сега ще отворим страницата в Google, където можете да оставите отзив за ресторанта."
            : "We will now open Google, where you can leave a review for the restaurant."}
        </p>

        {waiterName && (
          <div className="mx-auto mt-5 inline-flex rounded-full border border-[#c9a56a]/25 bg-[#c9a56a]/10 px-4 py-2 text-sm text-[#f2d39a]">
            {language === "bg" ? "Обслужи ви: " : "Served by: "}{waiterName}
          </div>
        )}

        <a
          href={googleUrl}
          className="luxury-button mt-8 inline-flex w-full items-center justify-center rounded-2xl px-6 py-4 text-sm font-semibold sm:w-auto"
        >
          {language === "bg" ? "Остави отзив в Google" : "Leave a review on Google"}
        </a>

        <p className="mt-5 text-xs leading-6 text-white/45">
          {status === "loading"
            ? language === "bg"
              ? "Подготвяме пренасочването..."
              : "Preparing redirect..."
            : language === "bg"
            ? "Отчитаме само сканиране/преминаване към Google, не гарантираме публикуван отзив."
            : "We track only the scan/transition to Google, not a guaranteed published review."}
        </p>
      </section>
    </main>
  );
}
