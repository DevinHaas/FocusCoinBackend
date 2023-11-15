import { Elysia } from "elysia";
import { prisma } from "../../../libs/prisma";

const getController = new Elysia()
    .get("/", async () => {
            const users = await prisma.user.findMany();
            return {
                success: true,
                message: "Fetch users",
                data: {
                    users,
                },
            };
        },
        {
            detail: {
                tags: ['User'],
            },
        })
    .get("/:clerk_id", async ({ params }) => {
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
                tags: ['User'],
            },
        });

export default getController;
