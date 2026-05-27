import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Rozpoczynam resetowanie bazy...");

  await prisma.transaction.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.savingsGoal.deleteMany();
  await prisma.category.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  const user = await prisma.user.create({
    data: { email: "demo@walletwise.pl", name: "Jan Kowalski" },
  });

  await prisma.account.create({
    data: { name: "Portfel Główny", balance: 4555.0, userId: user.id },
  });

  const categoriesData = [
    {
      name: "Jedzenie",
      limit: 1200,
      rollover: true,
      keywords: [
        "biedronka",
        "lidl",
        "żabka",
        "piekarnia",
        "kaufland",
        "auchan",
        "carrefour",
        "dino",
        "zakupy spożywcze",
        "netto",
        "lewiatan",
        "stokrotka",
        "delikatesy",
        "warzywniak",
      ],
    },
    {
      name: "Restauracje i kawiarnie",
      limit: 400,
      rollover: false,
      keywords: [
        "restauracja",
        "kawiarnia",
        "kfc",
        "mcdonalds",
        "burger",
        "pizza",
        "sushi",
        "obiad",
        "kolacja",
        "lunch",
        "pyszne",
        "glovo",
        "uber eats",
        "wolt",
        "starbucks",
        "costa",
      ],
    },
    {
      name: "Rozrywka",
      limit: 300,
      rollover: false,
      keywords: [
        "kino",
        "netflix",
        "spotify",
        "hbo",
        "steam",
        "gra",
        "koncert",
        "bilety",
        "teatr",
        "pub",
        "bar",
        "impreza",
        "disney",
        "amazon prime",
        "playstation",
        "xbox",
      ],
    },
    {
      name: "Transport",
      limit: 400,
      rollover: false,
      keywords: [
        "paliwo",
        "orlen",
        "bp",
        "shell",
        "uber",
        "bolt",
        "bilet",
        "mpk",
        "pociąg",
        "pkp",
        "autobus",
        "parking",
        "myjnia",
        "serwis",
        "olx",
        "blablacar",
      ],
    },
    {
      name: "Mieszkanie",
      limit: 2000,
      rollover: false,
      keywords: [
        "czynsz",
        "prąd",
        "woda",
        "gaz",
        "internet",
        "upc",
        "orange",
        "vectra",
        "meble",
        "ikea",
        "remont",
        "wynajem",
        "rata",
        "kredyt",
        "hipoteka",
      ],
    },
    {
      name: "Zdrowie",
      limit: 200,
      rollover: true,
      keywords: [
        "apteka",
        "lekarz",
        "dentysta",
        "badania",
        "leki",
        "luxmed",
        "medicover",
        "siłownia",
        "basen",
        "witaminy",
        "suplementy",
        "okulista",
        "fizjoterapeuta",
      ],
    },
    {
      name: "Ubrania i obuwie",
      limit: 300,
      rollover: true,
      keywords: [
        "zara",
        "h&m",
        "reserved",
        "zalando",
        "ccc",
        "deichmann",
        "nike",
        "adidas",
        "buty",
        "kurtka",
        "spodnie",
        "koszula",
        "sukienka",
        "odzież",
      ],
    },
    {
      name: "Elektronika",
      limit: 500,
      rollover: true,
      keywords: [
        "mediamarkt",
        "rtv euro agd",
        "x-kom",
        "morele",
        "komputronik",
        "apple",
        "samsung",
        "telefon",
        "laptop",
        "słuchawki",
        "tablet",
        "tv",
        "telewizor",
      ],
    },
    {
      name: "Subskrypcje",
      limit: 200,
      rollover: false,
      keywords: [
        "subskrypcja",
        "abonament",
        "premium",
        "youtube",
        "apple music",
        "tidal",
        "canva",
        "adobe",
        "microsoft",
        "office",
        "cloud",
        "icloud",
        "dropbox",
      ],
    },
    {
      name: "Edukacja",
      limit: 100,
      rollover: true,
      keywords: [
        "książka",
        "kurs",
        "szkoła",
        "studia",
        "udemy",
        "czesne",
        "artykuły biurowe",
        "coursera",
        "szkolenie",
        "konferencja",
        "empik",
      ],
    },
    {
      name: "Kosmetyki i higiena",
      limit: 150,
      rollover: false,
      keywords: [
        "rossmann",
        "hebe",
        "sephora",
        "douglas",
        "szampon",
        "krem",
        "makijaż",
        "perfumy",
        "fryzjer",
        "kosmetyczka",
        "manicure",
        "spa",
      ],
    },
    {
      name: "Dom i ogród",
      limit: 200,
      rollover: true,
      keywords: [
        "leroy merlin",
        "castorama",
        "obi",
        "jysk",
        "pepco",
        "action",
        "rośliny",
        "narzędzia",
        "dekoracje",
        "pościel",
        "ręczniki",
      ],
    },
    {
      name: "Zwierzęta",
      limit: 150,
      rollover: false,
      keywords: [
        "karma",
        "weterynarz",
        "zooplus",
        "maxi zoo",
        "kakadu",
        "pies",
        "kot",
        "akwarium",
        "smycz",
        "zabawki dla zwierząt",
      ],
    },
    {
      name: "Prezenty",
      limit: 200,
      rollover: true,
      keywords: [
        "prezent",
        "urodziny",
        "imieniny",
        "święta",
        "rocznica",
        "ślub",
        "chrzest",
        "komunia",
        "bukiet",
        "kwiaty",
      ],
    },
    {
      name: "Inne",
      limit: 200,
      rollover: false,
      keywords: ["inne", "nieplanowane", "różne"],
    },
  ];

  for (const cat of categoriesData) {
    await prisma.category.create({
      data: {
        name: cat.name,
        monthlyLimit: cat.limit,
        isRolloverEnabled: cat.rollover,
        aiKeywords: cat.keywords,
        userId: user.id,
      },
    });
  }

  const categories = await prisma.category.findMany({
    where: { userId: user.id },
  });

  const getCatId = (name: string) => {
    const id = categories.find((c) => c.name === name)?.id;
    return id === undefined ? null : id;
  };

  await prisma.transaction.createMany({
    data: [
      {
        amount: 5000.0,
        description: "Wypłata wynagrodzenia",
        type: "INCOME",
        date: new Date(),
        userId: user.id,
      },
      {
        amount: 150.0,
        description: "Zakupy w Biedronce",
        type: "EXPENSE",
        date: new Date(),
        userId: user.id,
        categoryId: getCatId("Jedzenie"),
      },
      {
        amount: 45.0,
        description: "Bilet do kina",
        type: "EXPENSE",
        date: new Date(new Date().setDate(new Date().getDate() - 1)),
        userId: user.id,
        categoryId: getCatId("Rozrywka"),
      },
      {
        amount: 250.0,
        description: "Paliwo Orlen",
        type: "EXPENSE",
        date: new Date(new Date().setDate(new Date().getDate() - 2)),
        userId: user.id,
        categoryId: getCatId("Transport"),
      },
    ],
  });

  const now = new Date();
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  await prisma.subscription.createMany({
    data: [
      {
        providerName: "Netflix",
        amount: 43.0,
        billingDay: 15,
        startDate: thisMonth,
        userId: user.id,
      },
      {
        providerName: "Spotify",
        amount: 19.99,
        billingDay: 1,
        startDate: thisMonth,
        userId: user.id,
      },
      {
        providerName: "YouTube Premium",
        amount: 25.99,
        billingDay: 10,
        startDate: nextMonth,
        userId: user.id,
      },
      {
        providerName: "iCloud 200GB",
        amount: 12.99,
        billingDay: 20,
        startDate: thisMonth,
        userId: user.id,
      },
    ],
  });

  await prisma.savingsGoal.create({
    data: {
      name: "Wakacje 2025",
      targetAmount: 5000,
      currentAmount: 1200,
      monthlyTarget: 400,
      userId: user.id,
    },
  });

  console.log("✅ Baza zasilona!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
