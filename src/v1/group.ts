import Elysia from "elysia";

import user from "./user";
import focusSession from "./focussession";

const v1 = new Elysia({prefix: 'v1'})
    .use(user)
    .use(focusSession);

export default v1;