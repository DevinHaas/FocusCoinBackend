import {Elysia} from "elysia";
import createController from "./controller/createController";
import getController from "./controller/getController";
import updateController from "./controller/updateController";
import calculateReward from "./utils/calculateReward";

const focusSessions = new Elysia({prefix: 'focus-sessions'})
    .use(createController)
    .use(getController)
    .use(updateController)
    .use(calculateReward);

export default focusSessions;