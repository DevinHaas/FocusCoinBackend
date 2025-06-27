import {Elysia} from "elysia";
import {prisma} from "../../../libs/prisma";

const getController = new Elysia()
    .get("/", async (ctx) => {




            // @ts-ignore
            const logestic  = ctx.logestic

            logestic.info("called")
            console.log("called")
            // @ts-ignore
            const auth = ctx.auth()
            if (!auth?.userId) {
                logestic.warn("Not authorized to get user")
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

                    logestic.warn("No user was found")
                    ctx.status(404)
                    return {
                        success: false,
                        message: "User not found",
                    };
                }


                logestic.info("Fetched user successfully")
                return {
                    success: true,
                    message: "Fetch user by ID",
                    data:user,

                };
            } catch (error) {
                logestic.error( "Error fetching user:", error)
                ctx.status(500)
                return {
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
