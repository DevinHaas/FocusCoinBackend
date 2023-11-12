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
    });

export default users;