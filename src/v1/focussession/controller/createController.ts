import {Elysia, t} from "elysia";
import {prisma} from "../../../libs/prisma";
import {SessionState} from "@prisma/client";
import calculateReward from "../utils/calculateReward";

const createController = new Elysia()
    .guard({
        body: t.Object({
            user_id: t.String(),
            session_settings: t.Object({
                timeInMinutes: t.Number(),
                timeManagementTechnique: t.String()
            }),
            state: t.Enum(SessionState),
            startedAt: t.Date(),
            endedAt: t.Date(),
        })
    })
    .post("/", async ({store, set, body}) => {
            // @ts-ignore
            if (!store.auth?.userId) {
                set.status = 403
                return 'Unauthorized'
            }
            try {
                const {user_id, session_settings, state, startedAt, endedAt} = body;

                const reward = calculateReward(session_settings.timeInMinutes);

                const createdFocusSession = await prisma.focusSession.create({
                    data: {
                        user_id,
                        session_settings,
                        reward,
                        state,
                        startedAt,
                        endedAt
                    }
                });

                await prisma.user.update({
                    where: {
                        clerk_id: user_id
                    },
                    data: {
                        current_focus_session_id: createdFocusSession.id
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
                console.error("Error creating focus-session:", error);
                return {
                    status: 500,
                    success: false,
                    message: "Error creating focus-session",
                    error: error,
                };
            }
        },
        {
            detail: {
                tags: ['Focus-session']
            }
        });

export default createController;
