import {PrismaClient} from "@prisma/client";

const client = new PrismaClient();

async function main() {
    const demoUser = await client.user.upsert({
        where: {id: '1'},
        update: {},
        create: {
            username: 'demo_user',
            focuscoins: 100,
            subscription: 'PREMIUM',
            profile_picture_url: 'https://example.com/profile.jpg',
            email: 'demo_user@example.com',
            users_FK: {
                create: {
                    id: '1',
                },
            },
            user_history: {
                create: {
                    operation: 'User created',
                },
            },
        },
    });

    console.log('Demo user created:', demoUser);
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