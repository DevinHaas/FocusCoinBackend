import {Elysia} from "elysia";
import {prisma} from "../../../libs/prisma";

const getAllController = new Elysia()
    .get("/", async (ctx) => {


            // @ts-ignore
            const auth = ctx.auth()
            if (!auth?.userId) {
                console.log("unauthorized")
                ctx.status(401)
                return {
                    success: false,
                    message: "Unauthorized"
                }
            }


            try {

                const products = await prisma.product.findMany({
                    where: {
                        amount: {
                            gte : 1
                        },
                        codes: {
                            isEmpty: false
                        },
                    }
                })

                if (!products) {
                    return {
                        status: 404,
                        success: false,
                        message: "No Products found",
                    };
                }

                return {
                    success: true,
                    message: "Products returned",
                    data: {
                        products,
                    },
                };
            } catch (error) {
                console.error("Error fetching products:", error);
                return {
                    status: 500,
                    success: false,
                    message: "Error fetching products",
                    error: error,
                };
            }
        },
        {
            detail: {
                tags: ['Product']
            }
        });

export default getAllController;
