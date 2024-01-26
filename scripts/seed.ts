import {PrismaClient, SessionState, UserSubscription} from "@prisma/client";
import {prisma} from "../src/libs/prisma";

const client = new PrismaClient();

async function main() {
    const demoUser = await client.user.create({
        data: {
            clerk_id: 'user_1',
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
    });

    console.log('Demo user created:', demoUser);
}

await main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        console.log("Disconnected from database.");
    });