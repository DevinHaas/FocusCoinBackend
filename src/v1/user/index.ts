import {Elysia, t} from "elysia";
import {prisma} from "../../libs/prisma";
import {UserSubscription} from "@prisma/client";

const users = new Elysia({prefix: 'users'})
    .get("/", async () => {
            const users = await prisma.user.findMany();
            return {
                success: true,
                message: "Fetch users",
                data: {
                    users,
                }
            };
        },
        {
            detail: {
                tags: ['User']
            }
        })
    .get("/:clerk_id", async ({params}) => {
            const user = await prisma.user.findUnique({
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
                message: "Fetch user by ID",
                data: {
                    user,
                },
            };
        },
        {
            detail: {
                tags: ['User']
            }
        })
    .guard({
        body: t.Object({
            clerk_id: t.String(),
            focuscoins: t.Number(),
            subscription: t.Enum(UserSubscription),
            focus_sessions: t.Object({})
        })
    })
    .post("/", async ({body}) => {
            const {clerk_id} = body;
            try {
                const createdUser = await prisma.user.create({
                    data: {
                        clerk_id,
                        focuscoins: 0,
                        subscription: UserSubscription.STARTER,
                        focus_sessions: {}
                    }
                })

                return {
                    success: true,
                    message: "Created user",
                    data: {
                        user: createdUser,
                    },
                };
            } catch (error) {
                return {
                    status: 500,
                    success: false,
                    message: "Error creating user",
                    error: error,
                };
            }

        },
        {
            detail: {
                tags: ['User']
            }
        })
    .put("/:clerk_id", async ({params, body}) => {
            try {
                const updatedUser = await prisma.user.update({
                    where: {
                        clerk_id: params.clerk_id,
                    },
                    data: body,
                });

                return {
                    success: true,
                    message: "Update user by ID",
                    data: {
                        user: updatedUser,
                    },
                };
            } catch (error) {
                return {
                    status: 500,
                    success: false,
                    message: "Error updating user",
                    error: error,
                };
            }
        },
        {
            detail: {
                tags: ['User']
            }
        })
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

export default users;