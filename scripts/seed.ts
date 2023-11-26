import {PrismaClient, SessionState, UserSubscription} from "@prisma/client";

const client = new PrismaClient();

async function main() {
    const demoUser = await client.user.create({
        data: {
            clerk_id: 'user_1',
            focuscoins: 150,
            subscription: UserSubscription.STARTER,
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
                        state: SessionState.FINISHED,
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