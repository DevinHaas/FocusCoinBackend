import {Elysia, t} from "elysia";
import {Webhook} from "svix";
import {prisma} from "../../../libs/prisma";
import {UserSubscription} from "@prisma/client";

type EventType = "user.created" | "user.deleted" | "user.updated";

type Event = {
    data: Record<string, string | number>;
    object: "event";
    type: EventType;
};

const webhookSecret = process.env.WEBHOOK_SECRET;

if (!webhookSecret) {
    throw new Error("Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local")
}

const webhook = new Elysia()
    .onParse(({request}, contentType) => {
        if (contentType === 'application/json') {
            return request.text();
        }
    })
    .post("/webhooks/auth", async ({headers, body }) =>
        {
            // Get the body
            const payload: string = body;

            // Get the Svix values from the header
            const svixId = headers["svix-id"] as string;
            const svixTimestamp = headers["svix-timestamp"] as string;
            const svixSignature = headers["svix-signature"] as string;

            if (!svixId || !svixTimestamp || !svixSignature) {
                return {
                    status: 400,
                    success: false,
                    message: "Error occurred -- no svix headers"
                }
            }

            // Create a new Svix instance with your secret.
            const wh = new Webhook(webhookSecret);

            let evt: Event | null = null;

            // Verify the payload with the headers
            try {
                evt = wh.verify(payload, {
                    "svix-id": svixId,
                    "svix-timestamp": svixTimestamp,
                    "svix-signature": svixSignature,
                }) as Event;
            } catch (err: any) {
                return {
                    status: 400,
                    success: false,
                    message: "Webhook failed to verify. Error:" + err.message
                }
            }

            // Get the ID and type
            const eventType = evt.type;

            // Get the users ID from clerk
            const clerk_id = evt.data.id as string;

            // Perform actions based on event type
            switch (eventType) {
                case "user.created":
                    await createUser(clerk_id);
                    break;
                case "user.updated":
                    await updateUser(clerk_id);
                    break;
                case "user.deleted":
                    await deleteUser(clerk_id);
                    break;
                default:
                    console.log("Unhandled event type:", eventType);
            }

            return {
                status: 200,
                success: true,
                message: "Webhook received"
            }
        },{
            body: t.String()
        });

export default webhook;

async function createUser(clerk_id: string): Promise<void> {
    await prisma.user.create({
        data: {
            clerk_id,
            focuscoins: 0,
            total_generated_coins: 0,
            total_completed_sessions: 0,
            subscription: UserSubscription.STARTER,
            current_focus_session_id: "",
            focus_sessions: {}
        },
    });
}

async function updateUser(clerk_id: string, ): Promise<void> {
    const existingUser = await prisma.user.findUnique({
        where: {
            clerk_id,
        },
    });

    if(!existingUser){
        await prisma.user.create({
            data: {
                clerk_id,
                focuscoins: 0,
                total_generated_coins: 0,
                total_completed_sessions: 0,
                subscription: UserSubscription.STARTER,
                current_focus_session_id: "",
                focus_sessions: {}
            },
        });
    }
}

async function deleteUser(clerk_id: string): Promise<void> {

    await prisma.focusSession.deleteMany({
        where: {
            user_id: clerk_id,
        },
    }).then(() => {
        prisma.user.delete({
            where: {
                clerk_id,
            },
        });
        }
    );
}
