const sv = {
  nav: {
    start: "Start",
    menu: "Meny",
    contact: "Kontakt",
    location: "Hitta hit",
  },
  landing: {
    welcome: "Välkommen",
    subtitle: "Två familjerestauranger — en passion för sushi",
    chooseRestaurant: "Välj restaurang",
    familyOwned: "Familjeägd sedan starten",
    visitUs: "Besök oss",
  },
  start: {
    aboutUs: "Om oss",
    ourStory: "Vår historia",
    viewMenu: "Se menyn",
    todaysSpecial: "Månadens kampanj",
    familyRestaurant: "Familjerestaurang",
    orderOnline: "Beställ online",
    orderOnlineSubtitle: "Beställ din favoritsushi för avhämtning",
    orderNow: "Beställ nu",
  },
  menu: {
    title: "Meny",
    currency: "kr",
    combo: "Komboprodukt",
  },
  contact: {
    title: "Kontakt",
    phone: "Telefon",
    email: "E-post",
    hours: "Öppettider",
    sendMessage: "Skicka meddelande",
    name: "Namn",
    message: "Meddelande",
    send: "Skicka",
    messageSent: "Tack för ditt meddelande!",
  },
  location: {
    title: "Hitta hit",
    address: "Adress",
    directions: "Vägbeskrivning",
    getDirections: "Få vägbeskrivning",
  },
  footer: {
    rights: "Alla rättigheter förbehållna",
    familyOwned: "Familjeägd med stolthet",
  },
};

export default sv;

type DeepStringify<T> = {
  [K in keyof T]: T[K] extends string ? string : DeepStringify<T[K]>;
};

export type Translations = DeepStringify<typeof sv>;
