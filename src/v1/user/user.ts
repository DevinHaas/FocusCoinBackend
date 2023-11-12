import Elysia from "elysia";

const users = new Elysia({ prefix: 'users'})
    .get("/", () => "Users");

export default users;