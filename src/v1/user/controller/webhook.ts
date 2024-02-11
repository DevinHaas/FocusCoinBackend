import {Elysia} from "elysia";
import {Webhook} from "svix";

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
    .post("/api/webhooks", async ({headers, body}) => {

            // Get the headers
            console.log(headers);

            // Get the body
            console.log(body);
            const payload: string | Buffer = body as Buffer;

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
