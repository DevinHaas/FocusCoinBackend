import {Elysia, t} from "elysia";
import {prisma} from "../../../libs/prisma";
import {ProductType} from "@prisma/client";

const deleteController = new Elysia()
    .delete("/:product_id", async ({store, set, params}) => {
            // @ts-ignore
            if (!store.auth?.userId) {
                set.status = 403
                return 'Unauthorized'
            }
            try {

                const deletedProduct = await prisma.product.delete({
                    where: {
                        id: params.product_id,
                    }
                });

                return {
                    success: true,
                    message: `Deleted Product`,
                    data: {
                       deletedProduct,
                    },
                };
            } catch (error) {
                console.error("Error deleting product:", error);
                return {
                    status: 500,
                    success: false,
                    message: "Error deleting product",
                    error: error,
                };
            }
        },
        {
            detail: {
                tags: ['Product']
            }
        });

export default deleteController;
