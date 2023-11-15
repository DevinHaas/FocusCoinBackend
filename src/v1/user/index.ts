import {Elysia} from "elysia";
import getController from "./controller/getController";
import createController from "./controller/createController";
import updateController from "./controller/updateController";
import deleteController from "./controller/deleteController";

const users = new Elysia({prefix: 'users'})
    .use(createController)
    .use(deleteController)
    .use(getController)
    .use(updateController);

export default users;