import {Elysia} from "elysia";
import getController from "./controller/getController";
import createController from "./controller/createController";
import updateController from "./controller/updateController";
import deleteController from "./controller/deleteController";
import webhook from "./controller/webhook";
import rewardController from "./controller/rewardController";

const users = new Elysia({prefix: 'user'})
    .use(createController)
    .use(deleteController)
    .use(getController)
    .use(updateController)
    .use(rewardController)
    .use(webhook);

export default users;