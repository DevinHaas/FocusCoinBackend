import {Elysia} from "elysia";
import {prisma} from "../../../libs/prisma";

const getController = new Elysia()
    .get("/:clerk_id", async ({store, set, params}) => {
            // @ts-ignore
            if (!store.auth?.userId) {
                set.status = 403
                return 'Unauthorized'
            }
            try {
                const userFocusSessions = await prisma.focusSession.findMany({
                    where: {
                        user_id: params.clerk_id,
                    },
                });

                return {
                    success: true,
                    message: "Fetch focus-sessions by user ID",
                    data: {
                        focusSessions: userFocusSessions,
                    },
                };
            } catch (error) {
                console.error("Error fetching focus-sessions:", error);
                return {
                    status: 500,
                    success: false,
                    message: "Internal Server Error",
                    error: error,
                };
            }
        },
        {
            detail: {
                tags: ['Focus-session']
            }
        })
    .get("/:clerk_id/:id", async ({params}) => {
            try {
                const focusSession = await prisma.focusSession.findUnique({
                    where: {
                        user_id: params.clerk_id,
                        id: params.id,
                    },
                });

                if (!focusSession) {
                    return {
                        status: 404,
                        success: false,
                        message: "Focus-session not found",
                    };
                }

                return {
                    success: true,
                    message: "Fetch focus-session by user ID and ID",
                    data: {
                        focusSession,
                    },
                };
            } catch (error) {
                console.error("Error fetching focus-session:", error);
                return {
                    status: 500,
                    success: false,
                    message: "Internal Server Error",
                    error: error,
                };
            }
        },
        {
            detail: {
                tags: ['Focus-session']
            }
        });

export default getController;
