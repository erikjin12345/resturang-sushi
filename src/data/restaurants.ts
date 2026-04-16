export interface Restaurant {
  id: string;
  name: string;
  tagline: { sv: string; en: string };
  description: { sv: string; en: string };
  address: string;
  phone: string;
  email: string;
  hours: { sv: string; en: string }[];
  mapQuery: string;
}

export const restaurants: Record<string, Restaurant> = {
  trakvista: {
    id: "trakvista",
    name: "Träkvista Sushi",
    tagline: {
      sv: "Familjeägd sushi i hjärtat av Träkvista",
      en: "Family-owned sushi in the heart of Träkvista",
    },
    description: {
      sv: "Välkommen till Träkvista Sushi — en familjeägd restaurang där vi serverar handgjord sushi med kärlek och omtanke. Våra recept har gått i arv och vi använder alltid färska råvaror av högsta kvalitet.",
      en: "Welcome to Träkvista Sushi — a family-owned restaurant where we serve handmade sushi with love and care. Our recipes have been passed down through generations and we always use the freshest ingredients.",
    },
    address: "Träkvista Torg 5, 178 52 Ekerö",
    phone: "08-123 45 67",
    email: "info@abrahamssbergssushi.se",
    hours: [
      { sv: "Måndag–Fredag: 11:00–21:00", en: "Monday–Friday: 11:00–21:00" },
      { sv: "Lördag: 12:00–21:00", en: "Saturday: 12:00–21:00" },
      { sv: "Söndag: 12:00–20:00", en: "Sunday: 12:00–20:00" },
    ],
    mapQuery: "Träkvista+Torg+Ekerö",
  },
  abrahamsbergs: {
    id: "abrahamsbergs",
    name: "Abrahamsbergs Sushi",
    tagline: {
      sv: "Familjens sushi i Abrahamsberg",
      en: "Family sushi in Abrahamsberg",
    },
    description: {
      sv: "Abrahamsbergs Sushi är en mysig, familjeägd restaurang som har blivit en älskad del av kvarteret. Hos oss får du njuta av riktigt bra sushi lagad med passion — precis som hemma, fast bättre.",
      en: "Abrahamsbergs Sushi is a cozy, family-owned restaurant that has become a beloved part of the neighborhood. Enjoy truly great sushi made with passion — just like home, but better.",
    },
    address: "Abrahamsbergsvägen 10, 168 30 Bromma",
    phone: "08-765 43 21",
    email: "info@abrahamsbергssushi.se",
    hours: [
      { sv: "Måndag–Fredag: 11:00–21:00", en: "Monday–Friday: 11:00–21:00" },
      { sv: "Lördag: 12:00–21:00", en: "Saturday: 12:00–21:00" },
      { sv: "Söndag: 12:00–20:00", en: "Sunday: 12:00–20:00" },
    ],
    mapQuery: "Abrahamsbergsvägen+Bromma",
  },
};

export const restaurantIds = Object.keys(restaurants);
