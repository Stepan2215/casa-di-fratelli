import React from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import MenuHero from "../components/menu/MenuHero";
import ChefHighlight from "../components/menu/ChefHighlight";
import MenuCategorySection from "../components/menu/MenuCategorySection";
import menuPageData from "../data/menuPageData";
import { buildMenuDataFromCms } from "../utils/menuUtils";
import { API_BASE_URL } from "../config/api";

function readOrderLinkParams() {
  if (typeof window === "undefined") {
    return { reservationId: "", token: "" };
  }

  const params = new URLSearchParams(window.location.search);
  return {
    reservationId: params.get("reservation") || "",
    token: params.get("token") || "",
  };
}

function formatOrderPrice(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

export default function MenuPage({
  t,
  language,
  setLanguage,
  onOpenReservation,
  onBackHome,
  onOpenSection,
  onOpenPrivacy,
  cmsMenuItems,
}) {
  const data = React.useMemo(
    () => buildMenuDataFromCms(cmsMenuItems, language, menuPageData[language]),
    [cmsMenuItems, language]
  );
  const [activeCategory, setActiveCategory] = React.useState(
    data.categories[0]?.id || ""
  );
  const [orderParams] = React.useState(readOrderLinkParams);
  const [orderSession, setOrderSession] = React.useState(null);
  const [orderItems, setOrderItems] = React.useState([]);
  const [orderNotes, setOrderNotes] = React.useState("");
  const [orderError, setOrderError] = React.useState("");
  const [orderNotice, setOrderNotice] = React.useState("");
  const [isSubmittingOrder, setIsSubmittingOrder] = React.useState(false);
  const activeCategoryData =
    data.categories.find((category) => category.id === activeCategory) ||
    data.categories[0];
  const orderEnabled = Boolean(orderParams.reservationId && orderParams.token && orderSession);
  const orderTotal = orderItems.reduce((total, item) => total + Number(item.priceValue || 0) * item.quantity, 0);

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

  React.useEffect(() => {
    if (!orderParams.reservationId || !orderParams.token) return;

    let cancelled = false;

    async function loadOrderSession() {
      setOrderError("");
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/dining-orders/session?reservationId=${encodeURIComponent(orderParams.reservationId)}&token=${encodeURIComponent(orderParams.token)}`
        );
        const payload = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(payload?.message || (language === "bg" ? "Линкът за поръчка не е активен." : "The order link is not active."));
        }

        if (!cancelled) setOrderSession(payload);
      } catch (error) {
        if (!cancelled) setOrderError(error?.message || (language === "bg" ? "Не успяхме да заредим поръчката." : "Could not load the order session."));
      }
    }

    loadOrderSession();

    return () => {
      cancelled = true;
    };
  }, [language, orderParams.reservationId, orderParams.token]);

  function addToOrder(item) {
    setOrderNotice("");
    setOrderError("");
    setOrderItems((prev) => {
      const key = item.id || item.name;
      const existing = prev.find((entry) => entry.key === key);
      if (existing) {
        return prev.map((entry) =>
          entry.key === key ? { ...entry, quantity: Math.min(entry.quantity + 1, 99) } : entry
        );
      }

      return [
        ...prev,
        {
          key,
          menuItemId: Number.isFinite(Number(item.id)) ? Number(item.id) : null,
          name: item.name,
          priceValue: Number(item.priceValue || 0),
          quantity: 1,
        },
      ];
    });
  }

  function updateOrderQuantity(key, nextQuantity) {
    const quantity = Number(nextQuantity || 0);
    setOrderItems((prev) =>
      quantity <= 0
        ? prev.filter((item) => item.key !== key)
        : prev.map((item) => (item.key === key ? { ...item, quantity: Math.min(quantity, 99) } : item))
    );
  }

  async function submitOrder() {
    if (!orderEnabled || orderItems.length === 0) return;

    setIsSubmittingOrder(true);
    setOrderError("");
    setOrderNotice("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/dining-orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reservationId: Number(orderParams.reservationId),
          token: orderParams.token,
          notes: orderNotes,
          items: orderItems.map((item) => ({
            menuItemId: item.menuItemId,
            name: item.name,
            unitPrice: item.priceValue,
            quantity: item.quantity,
          })),
        }),
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.message || (language === "bg" ? "Поръчката не беше изпратена." : "The order was not sent."));
      }

      setOrderItems([]);
      setOrderNotes("");
      setOrderNotice(language === "bg" ? "Поръчката е изпратена към екипа." : "Your order was sent to the team.");
    } catch (error) {
      setOrderError(error?.message || (language === "bg" ? "Поръчката не беше изпратена." : "The order was not sent."));
    } finally {
      setIsSubmittingOrder(false);
    }
  }

  return (
    <div className="luxury-shell min-h-screen text-white">
      <Header
        t={t}
        language={language}
        setLanguage={setLanguage}
        onOpenReservation={onOpenReservation}
        onOpenMenu={() => {}}
        onOpenSection={onOpenSection}
        onGoHome={onBackHome}
        isMenuPage
      />

      <MenuHero
        data={data}
        onOpenReservation={onOpenReservation}
        language={language}
      />

      {(orderSession || orderError) && (
        <div className="border-y border-[#c9a56a]/20 bg-[#14100c]/95">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="section-kicker">
                {language === "bg" ? "Поръчка от масата" : "Table order"}
              </div>
              <div className="mt-1 text-sm text-white/75">
                {orderSession
                  ? `${language === "bg" ? "Маса" : "Table"} ${orderSession.tableIds?.join(", ")} · ${orderSession.guestName}`
                  : orderError}
              </div>
            </div>
            {orderNotice && <div className="rounded-full border border-emerald-300/25 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-100">{orderNotice}</div>}
          </div>
        </div>
      )}

      <div className="sticky top-[124px] z-40 border-y border-white/10 bg-[#090705]/90 backdrop-blur-2xl md:top-[152px]">
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
              orderEnabled={orderEnabled}
              onAddToOrder={addToOrder}
            />
          ))}
        </div>

        <div className="order-1">
          <ChefHighlight data={data} />
        </div>
      </div>

      {orderEnabled && (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[#c9a56a]/25 bg-[#090705]/95 px-4 py-3 text-white shadow-[0_-18px_60px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
          <div className="mx-auto grid max-w-7xl gap-3 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-[0.22em] text-[#d8b377]">
                    {language === "bg" ? "Вашата поръчка" : "Your order"}
                  </div>
                  <div className="mt-1 text-sm text-white/60">
                    {orderItems.length} {language === "bg" ? "позиции" : "items"} · {formatOrderPrice(orderTotal)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={submitOrder}
                  disabled={orderItems.length === 0 || isSubmittingOrder}
                  className="luxury-button rounded-2xl px-5 py-3 text-sm font-semibold disabled:opacity-50"
                >
                  {isSubmittingOrder
                    ? language === "bg" ? "Изпращане..." : "Sending..."
                    : language === "bg" ? "Изпрати" : "Send"}
                </button>
              </div>
              {orderItems.length > 0 && (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  {orderItems.map((item) => (
                    <div key={item.key} className="flex min-w-[220px] items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-[#fff4df]">{item.name}</div>
                        <div className="text-xs text-white/45">{formatOrderPrice(item.priceValue * item.quantity)}</div>
                      </div>
                      <div className="flex items-center overflow-hidden rounded-full border border-white/10">
                        <button type="button" onClick={() => updateOrderQuantity(item.key, item.quantity - 1)} className="px-3 py-1 text-[#f2d39a]">-</button>
                        <span className="min-w-8 text-center text-sm">{item.quantity}</span>
                        <button type="button" onClick={() => updateOrderQuantity(item.key, item.quantity + 1)} className="px-3 py-1 text-[#f2d39a]">+</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <input
                value={orderNotes}
                onChange={(event) => setOrderNotes(event.target.value)}
                placeholder={language === "bg" ? "Бележка към поръчката..." : "Order note..."}
                className="mt-3 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none placeholder:text-white/35 focus:border-[#f2d39a]/60"
              />
              {orderError && <div className="mt-2 text-sm text-red-200">{orderError}</div>}
            </div>
          </div>
        </div>
      )}

      <Footer t={t} onOpenPrivacy={onOpenPrivacy} />
    </div>
  );
}
