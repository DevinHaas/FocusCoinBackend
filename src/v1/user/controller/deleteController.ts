import {Elysia} from "elysia";
import {prisma} from "../../../libs/prisma";

const deleteController = new Elysia()
    .delete("/:clerk_id", async ({params}) => {
            const user = await prisma.user.delete({
                where: {
                    clerk_id: params.clerk_id,
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
                message: "Delete user by ID",
                data: {
                    user,
                },
            };
        },
        {
            detail: {
                tags: ['User']
            }
        });

export default deleteController;
