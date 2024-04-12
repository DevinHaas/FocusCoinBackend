import {Elysia, t} from "elysia";
import {prisma} from "../../../libs/prisma";
import {UserSubscription} from "@prisma/client";

const updateController = new Elysia()
    .put("/:clerk_id", async ({store, set, params: {clerk_id}, body}) => {
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

                } else {
                    return {
                        status: 400,
                        success: false,
                        message: "User with the given clerk_id does not exist",
                    };
                }

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
            body: t.Object({
                clerk_id: t.String(),
                focuscoins: t.Number(),
                subscription: t.Enum(UserSubscription),
                focus_sessions: t.Object({})
            }), detail: {
                tags: ['User']
            }
        });

export default updateController;
