import {Elysia, t} from "elysia";
import {prisma} from "../../../libs/prisma";
import {UserSubscription} from "@prisma/client";

const updateController = new Elysia()
    .guard({
        body: t.Object({
            clerk_id: t.String(),
            focuscoins: t.Number(),
            subscription: t.Enum(UserSubscription),
            focus_sessions: t.Object({})
        })
    })
    .put("/:clerk_id", async ({store, set, params: {clerk_id}, body}) => {
            // @ts-ignore
            if (!store.auth?.userId) {
                set.status = 403
                return 'Unauthorized'
            }
            try {
                const updatedUser = await prisma.user.update({
                    where: {
                        clerk_id,
                    },
                    data: body,
                });

                return {
                    success: true,
                    message: "Update user by ID",
                    data: {
                        user: updatedUser,
                    },
                };
            } catch (error) {
                return {
                    status: 500,
                    success: false,
                    message: "Error updating user",
                    error: error,
                };
            }
        },
        {
            detail: {
                tags: ['User']
            }
        });

export default updateController;
