import {Elysia, t} from "elysia";
import {prisma} from "../../libs/prisma";
import {SessionState} from "@prisma/client";

const focusSessions = new Elysia({prefix: 'focus-sessions'})
    .guard({
        body: t.Object({
            minutes: t.Number()
        })
    })
    .post("/calculate-reward", async ({body}) => {
        const {minutes} = body;

        if (minutes > 90) {
            return {
                status: 400,
                success: false,
                message: "Minutes must be less than or equal to 90",
            };
        }

        const coinsPerMinute = 0.25;

        const rewardInCoins = Math.round(minutes * coinsPerMinute);

        return {
            success: true,
            message: "Calculate reward in coins",
            data: {
                rewardInCoins,
            },
        };
    })
    .get("/", async () => {
        const focusSessions = await prisma.focusSession.findMany();
        return {
            success: true,
            message: "Fetch focus-sessions",
            data: {
                focusSessions,
            }
        };
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
    })
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
    .post("/", async ({body}) => {
        const {user_id, session_settings, reward, state, startedAt, endedAt} = body;
        try {
            const createdFocusSession = await prisma.focusSession.create({
                data: {
                    user_id,
                    session_settings,
                    reward,
                    state,
                    startedAt,
                    endedAt
                }
            })

            return {
                success: true,
                message: "Created focus-session",
                data: {
                    focusSession: createdFocusSession,
                },
            };
        } catch (error) {
            return {
                status: 500,
                success: false,
                message: "Error creating focus-session",
                error: error,
            };
        }
    })
    .put("/:clerk_id/:id", async ({params, body}) => {
        try {
            const updatedFocusSession = await prisma.focusSession.update({
                where: {
                    user_id: params.clerk_id,
                    id: parseInt(params.id, 10),
                },
                data: body,
            });

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
    });

export default focusSessions;