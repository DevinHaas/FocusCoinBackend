import {Elysia} from "elysia";
import {prisma} from "../../../libs/prisma";

const getController = new Elysia()
    .get("/", async () => {
            const focusSessions = await prisma.focusSession.findMany();
            return {
                success: true,
                message: "Fetch focus-sessions",
                data: {
                    focusSessions,
                }
            };
        },
        {
            detail: {
                tags: ['Focus-session']
            }
        })
    .get("/:clerk_id", async ({params}) => {
            const focusSession = await prisma.focusSession.findMany({
                where: {
                    user_id: params.clerk_id,
                },
            });

            return {
                success: true,
                message: "Fetch focus-sessions by user ID",
                data: {
                    focusSession,
                },
            };
        },
        {
            detail: {
                tags: ['Focus-session']
            }
        })
    .get("/:clerk_id/:id", async ({params}) => {
            const focusSession = await prisma.focusSession.findUnique({
                where: {
                    user_id: params.clerk_id,
                    id: parseInt(params.id, 10),
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
        },
        {
            detail: {
                tags: ['Focus-session']
            }
        });

export default getController;
