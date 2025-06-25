import {Elysia} from "elysia";
import {prisma} from "../../../libs/prisma";

const getController = new Elysia()
    .get("/", async (ctx) => {

            // @ts-ignore
            const auth = ctx.auth()
            if (!auth?.userId) {
                console.log("unauthorized")
                ctx.status(401)
                return {
                    success: false,
                    message: "Unauthorized"
                }
            }
            try {



                const user = await prisma.user.findUnique({
                    where: {
                        clerk_id: auth?.userId,
                    },
                    select: {
                        focuscoins: true,
                        total_completed_sessions: true,
                        total_generated_coins: true,
                    }
                });

                if (!user) {
                    return {
                        status: 404,
                        success: false,
                        message: "User not found",
                    };
                }

                return {
                    success: true,
                    message: "Fetch user by ID",
                    data:user,

                };
            } catch (error) {
                console.error("Error fetching user:", error);
                return {
                    status: 500,
                    success: false,
                    message: "Internal Server Error",
                };
            }
        },
        {
            detail: {
                tags: ['User'],
            },
        });

export default getController;
