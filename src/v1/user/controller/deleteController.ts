import {Elysia} from "elysia";
import {prisma} from "../../../libs/prisma";

const deleteController = new Elysia()
    .delete("/:clerk_id", async ({store, set, params: {clerk_id}}) => {
            // @ts-ignore
            if (!store.auth?.userId) {
                set.status = 403
                return 'Unauthorized'
            }
            try {
                // delete all sessions from user
                await prisma.focusSession.deleteMany({
                    where: {
                        user_id: clerk_id,
                    },
                });

                // delete user
                const deletedUser = await prisma.user.delete({
                    where: {
                        clerk_id,
                    },
                });

                if (!deletedUser) {
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
                        deletedUser,
                    },
                };
            } catch (error) {
                console.error("Error deleting user:", error);
                return {
                    status: 500,
                    success: false,
                    message: "Internal Server Error",
                };
            }
        },
        {
            detail: {
                tags: ['User']
            }
        });

export default deleteController;
