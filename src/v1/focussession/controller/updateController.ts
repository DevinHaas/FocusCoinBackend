import {Elysia, t} from "elysia";
import {prisma} from "../../../libs/prisma";
import {SessionState} from "@prisma/client";

const updateController = new Elysia()
    .guard({
        body: t.Object({
            user_id: t.String(),
            session_settings: t.Object({}),
            reward: t.Number(),
            state: t.Enum(SessionState),
            startedAt: t.Date(),
            endedAt: t.Date(),
        })
    })
    .put("/:clerk_id/:id", async ({store, set, params, body}) => {
            // @ts-ignore
            if (!store.auth?.userId) {
                set.status = 403
                return 'Unauthorized'
            }
            try {
                const updatedFocusSession = await prisma.focusSession.update({
                    where: {
                        user_id: params.clerk_id,
                        id: params.id,
                    },
                    data: body,
                });

                const currentFocusSession = await prisma.focusSession.findUnique({
                    where: {
                        user_id: params.clerk_id,
                        id: params.id,
                    }
                });

                if (currentFocusSession?.state === SessionState.FINISHED) {
                    await prisma.user.update({
                        where: {
                            clerk_id: params.clerk_id,
                        },
                        data: {
                            focuscoins: {
                                increment: currentFocusSession?.reward,
                            },
                            total_generated_coins: {
                                increment: currentFocusSession?.reward,
                            },
                            total_completed_sessions: {
                                increment: 1,
                            },
                        },
                    });
                }

                return {
                    success: true,
                    message: "Update focus-session by user ID and ID",
                    data: {
                        focusSession: updatedFocusSession,
                    },
                };
            } catch (error) {
                return {
                    status: 500,
                    success: false,
                    message: "Error updating focus-session",
                    error: error,
                };
            }
        },
        {
            detail: {
                tags: ['Focus-session']
            }
        });

export default updateController;
