export const BGN_TO_EUR_RATE = 1.95583;

const categoryLabels = {
  salads: { bg: "Салати", en: "Salads" },
  starters: { bg: "Нещо за начало", en: "Starters" },
  "pasta-risotto": { bg: "Паста и ризото", en: "Pasta & Risotto" },
  mains: { bg: "Основни и рибни", en: "Mains & Fish" },
  pizza: { bg: "Пица", en: "Pizza" },
  bread: { bg: "Домашен хляб", en: "Homemade Bread" },
  desserts: { bg: "Десерти", en: "Desserts" },
  main: { bg: "Основни", en: "Main" },
  drinks: { bg: "Напитки", en: "Drinks" },
};

export function formatEuroFromBgn(value) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    return "€0.00";
  }

  const eur = numericValue / BGN_TO_EUR_RATE;
  const roundedUp = Math.ceil(eur * 10) / 10;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(roundedUp);
}

export function priceTextToEuro(priceText) {
  const match = String(priceText || "").match(/[\d]+(?:[.,]\d+)?/);

  if (!match) return priceText || "";

  return formatEuroFromBgn(match[0].replace(",", "."));
}

export function localizeStaticMenuPrices(data) {
  return {
    ...data,
    categories: data.categories.map((category) => ({
      ...category,
      items: category.items.map((item) => ({
        ...item,
        price: priceTextToEuro(item.price),
      })),
    })),
  };
}

function getValue(item, key) {
  return item?.[key] ?? item?.[key[0].toUpperCase() + key.slice(1)];
}

function slugify(value) {
  return String(value || "main")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]+/gi, "-")
    .replace(/^-+|-+$/g, "") || "main";
}

export function buildMenuDataFromCms(items, language, fallbackData) {
  if (!Array.isArray(items) || items.length === 0) {
    return localizeStaticMenuPrices(fallbackData);
  }

  const activeItems = items.filter((item) => getValue(item, "isActive") !== false);
  const grouped = new Map();

  activeItems.forEach((item) => {
    const rawCategory = getValue(item, "category") || "Main";
    const categoryId = slugify(rawCategory);

    if (!grouped.has(categoryId)) {
      const labels = categoryLabels[categoryId] || categoryLabels[String(rawCategory).toLowerCase()];
      grouped.set(categoryId, {
        id: categoryId,
        title: labels?.[language] || rawCategory,
        items: [],
      });
    }

    grouped.get(categoryId).items.push({
      name: getValue(item, language === "bg" ? "nameBg" : "nameEn") || getValue(item, "nameBg") || "",
      weight: getValue(item, "weight") || "",
      price: formatEuroFromBgn(getValue(item, "price")),
      description:
        getValue(item, language === "bg" ? "descriptionBg" : "descriptionEn") ||
        getValue(item, "descriptionBg") ||
        "",
      featured: Boolean(getValue(item, "notifySubscribers")),
    });
  });

  const categories = Array.from(grouped.values()).filter((category) => category.items.length > 0);

  if (categories.length === 0) {
    return localizeStaticMenuPrices(fallbackData);
  }

  return {
    ...fallbackData,
    categories,
  };
}
