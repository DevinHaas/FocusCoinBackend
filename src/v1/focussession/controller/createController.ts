import {Elysia, t} from "elysia";
import {prisma} from "../../../libs/prisma";
import {SessionState} from "@prisma/client";

const createController = new Elysia()
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
        },
        {
            detail: {
                tags: ['Focus-session']
            }
        });

export default createController;
