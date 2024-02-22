import {prisma} from "../../../libs/prisma";
import calculateReward from "../utils/calculateReward";
import {Elysia, t} from "elysia";
import {TimeManagementTechniqueEnum} from "../../../enums/TimeManagementTechniqueEnum";
import {SessionState} from "@prisma/client";

const createController = new Elysia()
    .post("/", async ({store, set, body}) => {
            // @ts-ignore
            if (!store.auth?.userId) {
                set.status = 403
                return 'Unauthorized'
            }
            try {
                const {user_id, session_settings, state, startedAt, endedAt} = body;

                const reward = calculateReward(session_settings.focusTime);

                const data: any = {
                    user_id,
                    session_settings,
                    reward,
                    state,
                    startedAt
                };

                if (endedAt) {
                    data.endedAt = endedAt;
                }

                const createdFocusSession = await prisma.focusSession.create({
                    data
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
            body: t.Object({
                user_id: t.String(),
                session_settings: t.Object({
                    focusTime: t.Number(),
                    timeManagementTechnique: t.Enum(TimeManagementTechniqueEnum),
                    pauseTime: t.Optional(t.Number()),
                    numberOfSession: t.Optional(t.Number())
                }),
                state: t.Enum(SessionState),
                startedAt: t.String(),
                endedAt: t.Optional(t.String()),
            }),detail: {
                tags: ['Focus-session']
            }
        });

export default createController;
