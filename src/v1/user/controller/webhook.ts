import {Elysia} from "elysia";
import {Webhook} from "svix";
import {prisma} from "../../../libs/prisma";
import {UserSubscription} from "@prisma/client";

type EventType = "user.created" | "user.updated" | "user.deleted";

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
    .post("/api/webhooks", async ({headers, body}) => {

            // Get the body
            const payload: string | Buffer = body as Buffer;

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
                console.log("Webhook failed to verify. Error:", err.message);
                return {
                    status: 400,
                    success: false,
                    message: err.message
                }
            }

            // Get the ID and type
            const {id} = evt.data;
            const eventType = evt.type;

            console.log(`Webhook with an ID of ${id} and type of ${eventType}`);
            console.log("Webhook body:", evt.data);

            // Get the users ID from clerk
            const clerk_id = evt.data.id as string;

            // Perform actions based on event type
            switch (eventType) {
                case "user.created":
                    await createUser(clerk_id);
                    console.log("Created user");
                    break;
                case "user.updated":
                    console.log("Updated user");
                    break;
                case "user.deleted":
                    await deleteUser(clerk_id);
                    console.log("Deleted user");
                    break;
                default:
                    console.log("Unhandled event type:", eventType);
            }

            return {
                status: 200,
                success: true,
                message: "Webhook received"
            }
        },
        {
            detail: {
                tags: ["User Webhook"]
            }
        });

export default webhook;

async function createUser(clerk_id: string): Promise<void> {
    // Implement logic to create user using Prisma
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

async function deleteUser(clerk_id: string): Promise<void> {
    // Implement logic to delete user using Prisma
    await prisma.user.delete({
        where: {
            id: clerk_id,
        },
    });
}
