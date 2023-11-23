import {Elysia} from "elysia";
import createController from "./controller/createController";
import getController from "./controller/getController";
import updateController from "./controller/updateController";

const focusSessions = new Elysia({prefix: 'focus-sessions'})
    .use(createController)
    .use(getController)
    .use(updateController);

export default focusSessions;