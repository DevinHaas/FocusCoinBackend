import { Elysia } from "elysia";
import { PrismaClient } from "@prisma/client";

const app = new Elysia().get("/", () => "Hello Elysia").listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

const prisma = new PrismaClient();

// create a new user
await prisma.user.create({
    data: {
        name: "John Dough",
        email: `john-${Math.random()}@example.com`,
    },
});

// count the number of users
const count = await prisma.user.count();
console.log(`There are ${count} users in the database.`);

