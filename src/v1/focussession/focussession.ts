import Elysia from "elysia";

const focusSessions = new Elysia({ prefix: 'focus-sessions'})
    .get("/", () => "Focus-sessions");

export default focusSessions;