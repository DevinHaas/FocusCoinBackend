import {Elysia, t} from "elysia";
import {prisma} from "../../../libs/prisma";
import {ProductType} from "@prisma/client";

const updateController = new Elysia()
    .put("/:id", async ({store, set, params, body}) => {
        // @ts-ignore
        if (!store.auth?.userId) {
            set.status = 403
            return 'Unauthorized'
        }
        try {
            const updatedProduct = await prisma.product.update({
                where: {
                    id: params.id,
                },
                data: body,
            });

            return {
                success: true,
                message: "Update product by ID",
                data: {
                    product: updatedProduct,
                },
            };
        } catch (error) {
            console.error("Error updating product:", error);
            return {
                status: 500,
                success: false,
                message: "Error updating product",
                error: error,
            };
        }
    }, {
        body: t.Object({
            price_coins: t.Number(),
            title: t.String(),
            type: t.Enum(ProductType),
            images_urls: t.Array(
                t.String()
            ),
            description: t.String(),
            reference_link: t.String(),
            publishedAt: t.Date(),
            expiresAt: t.Date(),
            amount: t.Number(),
        }), detail: {
            tags: ['Product']
        }
    });

export default updateController;
