import {Elysia} from "elysia";
import {Webhook} from "svix";

type EventType = "user.created" | "user.updated" | "user.deleted";

type Event = {
    data: Record<string, string | number>;
    object: "event";
    type: EventType;
};

const webhookSecret: string = process.env.WEBHOOK_SECRET || "";

const webhook = new Elysia()
    .post("/api/webhooks", async ({set, body}) => {

            const headers = set.headers;
            const payload: Buffer = body as Buffer;

            const svixId = headers["svix-id"];
            const svixTimestamp = headers["svix-timestamp"];
            const svixSignature = headers["svix-signature"];

            if (!svixId || !svixTimestamp || !svixSignature) {
                return {
                    status: 400,
                    success: false,
                    message: "Error occurred -- no svix headers"
                }
            }

            const wh = new Webhook(webhookSecret);

            let evt: Event | null = null;

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
                tags: ['User Webhook']
            }
        });

export default webhook;
