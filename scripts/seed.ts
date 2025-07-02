import {
  PrismaClient,
  SessionState,
  UserSubscription,
  ProductType,
} from "@prisma/client";

const client = new PrismaClient();
try {
  await client.user.upsert({
    where: {clerk_id: "user_2uHEdPcBwCXrLSzi0V4RS1AOakl"},
    create: {
      clerk_id: "user_2uHEdPcBwCXrLSzi0V4RS1AOakl",
      subscription: UserSubscription.STARTER,
      focuscoins: 150,
      total_generated_coins: 10,
      total_completed_sessions: 3,
      current_focus_session_id: "",
      focus_sessions: {
        create: [
          {
            session_settings: {},
            reward: 50,
            state: SessionState.RUNNING,
            startedAt: new Date(),
            endedAt: new Date(),
          },
          {
            session_settings: {},
            reward: 30,
            state: SessionState.COMPLETED,
            startedAt: new Date(),
            endedAt: new Date(),
          },
          {
            session_settings: {},
            reward: 20,
            state: SessionState.CANCELLED,
            startedAt: new Date(),
            endedAt: new Date(),
          },
        ],
      },
    },
    update:{}
  });

  const expireIn30Days = new Date(Date.now() + 30 * 24 * 60 * 60 * 1_000);

  const productsData = [
    {
      price_coins: 250,
      title: "10Fr.- Giftcard on Zalando",
      type: ProductType.DISCOUNT,
      images_urls: ["https://3nheyjgo3z.ufs.sh/f/02NjhvLLFoqlrqaa7n36LpusiBAlJ5UnTPqhWGaCw1dEXMk3", "https://3nheyjgo3z.ufs.sh/f/02NjhvLLFoqlrqaa7n36LpusiBAlJ5UnTPqhWGaCw1dEXMk3"],
      description:
        "Redeem this coupon to get 10 Fr.- for your next order on Zalando.",
      reference_link: "https://zalando.com",
      codes: ["SAVE20NOW", "SAVE40NOW", "TESTCODE10", "TESTCODE20", "TESTCODE30", "TESTCODE40", "TESTCODE50"],
      expiresAt: expireIn30Days,
      amount: 99,
    },
    {
      price_coins: 250,
      title: "10 Fr.- Giftcard Fizzen",
      type: ProductType.DISCOUNT,
      images_urls: ["https://3nheyjgo3z.ufs.sh/f/02NjhvLLFoqljcx0F0ZqWcIr9Y7gFJXs0kNbU3AM82R5VvZD", "https://3nheyjgo3z.ufs.sh/f/02NjhvLLFoqlAP7mBuMgjZhuDN95OUwg8YJvrB47sonXpLbP", "https://3nheyjgo3z.ufs.sh/f/02NjhvLLFoqlvxLtoJB5HxB6IkAg81RFZKJPuSqdMhjrmel7"],
      description: "Enjoy a free cup of coffee at any of our partner cafés. ☕️",
      reference_link: "https://www.fizzen.ch/",
      codes: ["FIZZZENMEGA", "SONICE"],
      expiresAt: expireIn30Days,
      amount: 99,
    },
    {
      price_coins: 250,
      title: "Galaxus 10Fr.- Giftcard",
      type: ProductType.DISCOUNT,
      images_urls: ["https://3nheyjgo3z.ufs.sh/f/02NjhvLLFoqlzSaMAcGdRF9jqATJP56tMXpLNmxcbufgsBDe", "https://3nheyjgo3z.ufs.sh/f/02NjhvLLFoqlzJn3AxOGdRF9jqATJP56tMXpLNmxcbufgsBD"],
      description:
        "Do you need a new electrical tool or something new for your home? Galaxus got your back.",
      reference_link: "https://www.galaxus.ch/de/",
      codes: ["BOOSTPACK10", "BOOSTPACK20", "BOOSTPACK20"],
      expiresAt: expireIn30Days,
      amount: 99,
    },
    {
      price_coins: 250,
      title: "Decathlon 10Fr.- Giftcard",
      type: ProductType.DISCOUNT,
      images_urls: ["https://3nheyjgo3z.ufs.sh/f/02NjhvLLFoqlT9G9WFiiG8FLXQHoyY9V4zAa0fhelIjC13qm", "https://3nheyjgo3z.ufs.sh/f/02NjhvLLFoql20D8YdTfDyRr4gHnIMhvZmoJl68pkYtzKCSA"],
      description:
          "Decathlon is the place to go for all your sports needs. Get a 10Fr.- giftcard to get started.",
      reference_link: "https://www.decathlon.ch/de/",
      codes: ["BOOSTPACK10", "BOOSTPACK20", "BOOSTPACK20"],
      expiresAt: expireIn30Days,
      amount: 99,
    },
  ];

  const created = await client.product.createMany({
    data: productsData,
    skipDuplicates: true, // in case you re-run seed
  });

  console.log(`Created ${created.count} products`);
} catch (error) {
  console.error(error);
  await client.$disconnect();
  process.exit(1);
}

