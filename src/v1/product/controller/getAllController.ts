import { Elysia } from "elysia";
import { prisma } from "../../../libs/prisma";

const getAllController = new Elysia()
    .get("/", async (ctx) => {
        // @ts-ignore
        const logestic = ctx.logestic;
        logestic.info("Get all products endpoint called");

        // @ts-ignore
        const auth = ctx.auth();
        if (!auth?.userId) {
            logestic.warn("Unauthorized access to get all products endpoint");
            ctx.status(401);
            return {
                success: false,
                message: "Unauthorized"
            };
        }
        try {
            const products = await prisma.product.findMany({
                where: {
                    amount: { gte: 1 },
                    codes: { isEmpty: false }
                }
            });
            if (!products || products.length === 0) {
                logestic.warn("No products found");
                return {
                    success: false,
                    message: "No Products found",
                };
            }
            logestic.info("Products fetched successfully");
            return {
                success: true,
                message: "Products returned",
                data: { products },
            };
        } catch (error) {
            logestic.error("Error fetching products", { error });
            return {
                success: false,
                message: "Error fetching products",
                error,
            };
        }
    }, {
        detail: {
            tags: ['Product']
        }
    });

export default getAllController;