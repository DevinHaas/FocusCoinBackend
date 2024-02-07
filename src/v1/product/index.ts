import {Elysia} from "elysia";
import createController from "./controller/createController";
import updateController from "./controller/updateController";
import getByIdController from "./controller/getByIdController";
import getAllController from "./controller/getAllController";
import deleteController from "./controller/deleteController";

const products = new Elysia({prefix: 'products'})
    .use(createController)
    .use(updateController)
    .use(getByIdController)
    .use(getAllController)
    .use(deleteController)


export default products;