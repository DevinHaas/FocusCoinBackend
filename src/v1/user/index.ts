import Elysia from "elysia";
import { prisma } from "../../libs/prisma";

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
    })
    .get("/:id", async ({params}) => {
        const user = await prisma.user.findUnique({
            where: {
                clerk_id: params.id,
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
    })
    .post("/", async ({body}) => {
        return body;
    })
    .put("/:id", async ({params, body}) => {
        return body;
    })
    .delete("/:id", async ({params}) => {
        const user = await prisma.user.delete({
            where: {
                clerk_id: params.id,
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
    });

export default users;