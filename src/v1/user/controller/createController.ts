import {Elysia, t} from "elysia";
import {prisma} from "../../../libs/prisma";
import {UserSubscription} from "@prisma/client";

const createController = new Elysia()
    .guard({
        body: t.Object({
            clerk_id: t.String(),
            focuscoins: t.Number(),
            subscription: t.Enum(UserSubscription),
            focus_sessions: t.Object({})
        })
    })
    .post("/", async ({body}) => {
            const {clerk_id} = body;
            try {
                const createdUser = await prisma.user.create({
                    data: {
                        clerk_id,
                        focuscoins: 0,
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
