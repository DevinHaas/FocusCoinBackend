import {Elysia, t} from "elysia";
import {prisma} from "../../../libs/prisma";
import {
    ProductType
} from "@prisma/client";

const createController = new Elysia()
    .guard({
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
        })
    })
    .post("/", async ({store, set, body}) => {
            // @ts-ignore

            if (!store.auth?.userId) {
                set.status = 403
                return 'Unauthorized'
            }

            try {
                const {
                    price_coins,
                    title,
                    type,
                    images_urls,
                    description,
                    reference_link,
                    publishedAt,
                    expiresAt,
                    amount
                } = body;

                const createdFocusSession = await prisma.product.create({
                    data: {
                        price_coins,
                        title,
                        type,
                        images_urls,
                        description,
                        reference_link,
                        publishedAt,
                        expiresAt,
                        amount,
                    }
                });

                return {
                    success: true,
                    message: "Created product",
                    data: {
                        focusSession: createdFocusSession,
                    },
                };
            } catch (error) {
                console.error("Error creating product:", error);
                return {
                    status: 500,
                    success: false,
                    message: "Error creating product",
                    error: error,
                };
            }
        },
        {
            detail: {
                tags: ['Product']
            }
        });

export default createController;
