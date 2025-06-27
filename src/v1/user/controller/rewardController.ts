import {Elysia, t} from "elysia";
import {prisma} from "../../../libs/prisma";
import {UserSubscription} from "@prisma/client";
import user from "../index";

const rewardController = new Elysia()
    .post("/rewards/claim", async (ctx) => {

            // @ts-ignore
            const logestic  = ctx.logestic
            logestic.info("Reward claim endpoint called");
            // @ts-ignore
            const auth = ctx.auth()
            const userId = auth.userId
            if (!auth?.userId) {
                logestic.warn("Unauthorized access to reward claim endpoint", { userId: userId });
                ctx.status(403)
                return 'Unauthorized'
            }
            try {
                const existingUser = await prisma.user.findUnique({
                    where: {
                        clerk_id: userId
                    },
                });

                if (existingUser) {
                    const updatedUser = await prisma.user.update({
                        where: {
                            clerk_id: userId
                        },
                        data: {
                            focuscoins : {
                                increment: ctx.body.reward
                            }
                        },
                    });
                    logestic.info("User updated successfully with reward", { userId: userId, reward: ctx.body.reward });
                    return {
                        success: true,
                        message: "Reward was paid",
                        data: updatedUser.focuscoins
                    };

                } else {
                    logestic.warn("User not found for reward claim", { userId: userId });
                    return {
                        status: 400,
                        success: false,
                        message: "User with the given clerk_id does not exist",
                    };
                }

            } catch (error) {
                logestic.error("Error during reward claim process", { error, userId: userId })
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
                reward: t.Number()
            }), detail: {
                tags: ['User']
            }
        });

export default rewardController;
