import {PrismaClient} from "@prisma/client";

const client = new PrismaClient();

async function main() {
    const john = await client.user.create({
        data: {
            name: "John Dough",
            email: `john-${Math.random()}@example.com`,
        },
    });
}

main()
    .then(() => {
        client.$disconnect();
        process.exit(0);
    })
    .catch((e) => {
        console.log("error:", e);
        client.$disconnect();
        process.exit(1);
    });