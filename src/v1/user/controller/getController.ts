import {Elysia} from "elysia";
import {prisma} from "../../../libs/prisma";

const getController = new Elysia()
    .get("/:clerk_id", async ({store, set, params: {clerk_id}}) => {
            // @ts-ignore

            if (!store.auth?.userId) {
                set.status = 403
                return 'Unauthorized'
            }
            try {


                const user = await prisma.user.findUnique({
                    where: {
                        clerk_id,
                    },
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
                    user,

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
