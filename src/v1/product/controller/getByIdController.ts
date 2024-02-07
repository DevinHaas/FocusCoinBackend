import {Elysia, t} from "elysia";
import {prisma} from "../../../libs/prisma";
import {
    ProductType
} from "@prisma/client";
import products from "../index";

const getByIdController = new Elysia()
    .get("/:product_id", async ({store, set, params}) => {
            // @ts-ignore

            if (!store.auth?.userId) {
                set.status = 403
                return 'Unauthorized'
            }

            try {
                const product = await prisma.product.findUnique({
                    where: {
                        id : params.product_id
                    }
                })


                if (!product) {
                    return {
                        status: 404,
                        success: false,
                        message: "Product not found",
                    };
                }

                return {
                    success: true,
                    message: "Product found",
                    data: {
                        product,
                    },
                };
            } catch (error) {
                console.error("Error fetching product:", error);
                return {
                    status: 500,
                    success: false,
                    message: "Error fetching product",
                    error: error,
                };
            }
        },
        {
            detail: {
                tags: ['Product']
            }
        });

export default getByIdController;
