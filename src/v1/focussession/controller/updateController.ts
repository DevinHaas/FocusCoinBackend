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
        },
        {
            detail: {
                tags: ['Focus-session']
            }
        });

export default updateController;
