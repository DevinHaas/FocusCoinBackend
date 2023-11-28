import {Elysia, t} from "elysia";
import {prisma} from "../../../libs/prisma";
import {UserSubscription} from "@prisma/client";

const createController = new Elysia()
    .guard({
        body: t.Object({
            clerk_id: t.String()
        })
    })
    .post("/", async ({store, set, body: {clerk_id}}) => {
            // @ts-ignore
            if (!store.auth?.userId) {
                set.status = 403
                return 'Unauthorized'
            }
            try {
                const existingUser = await prisma.user.findUnique({
                    where: {
                        clerk_id,
                    },
                });

                if (existingUser) {
                    return {
                        status: 400,
                        success: false,
                        message: "User with the given clerk_id already exists",
                    };
                }

                const createdUser = await prisma.user.create({
                    data: {
                        clerk_id,
                        focuscoins: 0,
                        total_generated_coins: 0,
                        total_completed_sessions: 0,
                        subscription: UserSubscription.STARTER,
                        focus_sessions: {}
                    }
                })

                return {
                    success: true,
                    message: "Created user",
                    data: {
                        user: createdUser,
                    },
                };
            } catch (error) {
                return {
                    status: 500,
                    success: false,
                    message: "Error creating user",
                    error: error,
                };
            }
        },
        {
            detail: {
                tags: ['User']
            }
        });

export default createController;
