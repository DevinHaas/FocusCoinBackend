import Elysia from "elysia";
import {prisma} from "../../libs/prisma";

const focusSessions = new Elysia({ prefix: 'focus-sessions'})
    .get("/", async () => {
        const focusSessions = await prisma.focusSession.findMany();
        return {
            success: true,
            message: "Fetch focus-sessions",
            data: {
                focusSessions,
            }
        };
    });

export default focusSessions;