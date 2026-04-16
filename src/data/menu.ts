export interface MenuItem {
  name: string;
  price: number;
  description?: { sv: string; en: string };
  combo?: boolean;
}

export interface MenuCategory {
  id: string;
  name: { sv: string; en: string };
  items: MenuItem[];
}

export const menuCategories: MenuCategory[] = [
  {
    id: "kampanj",
    name: { sv: "Månadens Kampanj", en: "Monthly Special" },
    items: [
      { name: "Kampanj Dynamite Roll", price: 135 },
      { name: "Kampanj Kyckling Poké Bowl", price: 135 },
    ],
  },
  {
    id: "lunch",
    name: { sv: "Lunch", en: "Lunch" },
    items: [
      { name: "Lunch Maki", price: 100 },
      { name: "Lunch 10 Bitar", price: 110 },
      { name: "Lunch 12 Bitar", price: 140 },
    ],
  },
  {
    id: "bowls",
    name: { sv: "Bowls", en: "Bowls" },
    items: [
      { name: "Tonfisk Poké Bowl", price: 145, combo: true },
      { name: "Räkor Poké Bowl", price: 145, combo: true },
      { name: "Kyckling Poké Bowl", price: 135, combo: true },
      { name: "Tofu Poké Bowl", price: 140, combo: true },
      { name: "Poké Bowl Mix", price: 165, combo: true },
    ],
  },
  {
    id: "sushi",
    name: { sv: "Sushi", en: "Sushi" },
    items: [
      { name: "Stor Sushi 14 Bitar", price: 160, combo: true },
      { name: "House Special 18 Bitar", price: 205, combo: true },
      { name: "Mamma Sushi 10 Bitar", price: 120 },
      { name: "Vegansk Sushi 10 Bitar", price: 120, combo: true },
      { name: "Familjesushi 30 Bitar", price: 360 },
      { name: "Sashimi", price: 140, combo: true },
    ],
  },
  {
    id: "maki",
    name: { sv: "Maki", en: "Maki" },
    items: [
      { name: "Alaska Roll", price: 150 },
      { name: "Spicy Tuna Roll", price: 140 },
      { name: "Tempura Roll", price: 170 },
      { name: "Dynamite Roll", price: 135 },
    ],
  },
  {
    id: "klassiker",
    name: { sv: "Klassiker", en: "Classics" },
    items: [
      { name: "Lax Rullar", price: 105, combo: true },
      { name: "Lax Avokado", price: 110, combo: true },
      { name: "Lax Avokado Rullar", price: 115, combo: true },
      { name: "Lax Avokado Räkor", price: 120, combo: true },
    ],
  },
  {
    id: "varmratter",
    name: { sv: "Varmrätter", en: "Hot Dishes" },
    items: [
      { name: "Bento", price: 180 },
      { name: "Yakiniku", price: 135, combo: true },
      { name: "Yakitori", price: 120, combo: true },
      { name: "Dumplings", price: 110, combo: true },
      { name: "Fried Chicken", price: 150, combo: true },
    ],
  },
  {
    id: "familj",
    name: { sv: "Familjeerbjudande", en: "Family Deals" },
    items: [
      { name: "30 Bitar", price: 335 },
      { name: "40 Bitar", price: 430 },
      { name: "50 Bitar", price: 520 },
    ],
  },
  {
    id: "tillagg",
    name: { sv: "Tillägg", en: "Extras" },
    items: [
      { name: "Sjögrässallad Skål", price: 40 },
      { name: "Ingefära Skål", price: 40 },
      { name: "Ris", price: 20 },
      { name: "Sushiris", price: 30 },
    ],
  },
  {
    id: "dryck",
    name: { sv: "Dryck", en: "Drinks" },
    items: [
      { name: "Pepsi Max 33cl", price: 25 },
      { name: "Fanta Orange 33cl", price: 25 },
      { name: "Fanta Exotic 33cl", price: 25 },
      { name: "Loka Naturell 33cl", price: 25 },
      { name: "Loka Citron 33cl", price: 25 },
      { name: "Trocadero 33cl", price: 25 },
    ],
  },
];
