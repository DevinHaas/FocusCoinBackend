import Elysia from "elysia";

import user from "./user";
import focusSession from "./focussession";
import product from "./product";

const v1 = new Elysia({prefix: 'v1'})
    .use(focusSession)
    .use(product)
    .use(user)

export default v1;