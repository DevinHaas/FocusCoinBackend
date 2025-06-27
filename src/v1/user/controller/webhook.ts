import {Elysia, t} from "elysia";
import {Webhook} from "svix";
import {prisma} from "../../../libs/prisma";
import {UserSubscription} from "@prisma/client";
import {Logestic} from "logestic";

type EventType = "user.created" | "user.deleted" | "user.updated" | "session.created";

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
    .post("/webhooks/auth", async (ctx) => {

        // @ts-ignore
        const logestic = ctx.logestic;
        logestic.info("Webhook auth endpoint called");
        // Get the body
        const payload: string = ctx.body;

        // Get the Svix values from the header
        const svixId =  ctx.headers["svix-id"] as string;
        const svixTimestamp = ctx.headers["svix-timestamp"] as string;
        const svixSignature = ctx.headers["svix-signature"] as string;

        if (!svixId || !svixTimestamp || !svixSignature) {
            logestic.warn("Missing Svix headers");
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
            logestic.info("Webhook payload verified successfully");
        } catch (err: any) {
            logestic.error("Webhook verification failed", { error: err.message });
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
        const clerk_id_for_session = evt.data.client_id as string;

        // Perform actions based on event type
        switch (eventType) {
            case "user.created":
                await createUser(clerk_id, logestic);
                break;
            case "session.created":
                await createUser(clerk_id_for_session, logestic);
                break;
            default:
                logestic.warn("Unhandled event type", { eventType });
        }
        logestic.info("Webhook processed successfully");
        return {
            status: 200,
            success: true,
            message: "Webhook received"
        }
    }, {
        body: t.String()
    });

export default webhook;

async function createUser(clerk_id: string, logestic: any): Promise<void> {


    const existingUser = await prisma.user.findUnique({
        where: {
            clerk_id: clerk_id,
        },
    });

    if (!existingUser) {
        logestic.info("Creating new user from webhook", { clerk_id });
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
    } else {
        logestic.info("User already exists, skipping creation", { clerk_id });
    }


}




