import {Elysia, t} from "elysia";
import {prisma} from "../../../libs/prisma";
import {
    ProductType
} from "@prisma/client";
import products from "../index";

const getAllController = new Elysia()
    .get("/", async ({store, set, params}) => {
            // @ts-ignore

            if (!store.auth?.userId) {
                set.status = 403
                return 'Unauthorized'
            }

            try {
                const products = await prisma.product.findMany()

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
                        product: products,
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
