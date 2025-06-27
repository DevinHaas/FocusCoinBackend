import { Elysia, t } from "elysia";
import { prisma } from "../../../libs/prisma";
class NotFoundError extends Error {}
class OutOfStockError extends Error {}
class UserNotFoundError extends Error {}
class NotEnoughCoinsError extends Error {}
const buyController = new Elysia()
    .post("/buy", async (ctx) => {
        // @ts-ignore
        const logestic = ctx.logestic;
        // @ts-ignore
        const auth = ctx.auth();
        logestic.info("Buy endpoint called");
        if (!auth?.userId) {
            logestic.warn("Unauthorized access to buy endpoint", { userId: auth?.userId });
            ctx.status(401);
            return {
                success: false,
                message: "Unauthorized",
                data: {}
            };
        }
        const { product_id } = ctx.body;
        try {
            const code = await buyProductFromDB(product_id, auth.userId, logestic);
            logestic.info("Product purchased successfully", { productId: product_id, userId: auth.userId });
            return {
                success: true,
                data: { code },
            };
        } catch (err) {
            logestic.error("Error in buy process", { error: err, userId: auth.userId });
            if (err instanceof NotFoundError) {
                ctx.status(404);
                return { success: false, message: err.message, data: {} };
            } else if (err instanceof OutOfStockError) {
                ctx.status(410);
                return { success: false, message: err.message, data: {} };
            } else if (err instanceof UserNotFoundError) {
                ctx.status(404);
                return { success: false, message: err.message, data: {} };
            } else if (err instanceof NotEnoughCoinsError) {
                ctx.status(400);
                return { success: false, message: err.message, data: {} };
            } else {
                ctx.status(500);
                return {
                    success: false,
                    message: "Server error while purchasing",
                    data: {}
                };
            }
        }
    }, {
        body: t.Object({
            product_id: t.String(),
        }),
        detail: {
            tags: ['Product'],
            summary: 'Buy a product, decrementing stock & returning a code'
        }
    });
async function buyProductFromDB(productId: string, userId: string, logestic: any): Promise<string> {
    return prisma.$transaction(async (tx) => {
        const user = await prisma.user.findUnique({
            where: { clerk_id: userId }
        });
        if (!user) {
            logestic.warn("User not found in buyProductFromDB", { userId });
            throw new UserNotFoundError("No user found");
        }
        const product = await tx.product.findUnique({
            where: { id: productId },
            select: { amount: true, codes: true },
        });
        if (!product) {
            logestic.warn("Product not found", { productId });
            throw new NotFoundError("Product not found");
        }
        if (user.focuscoins < product.amount) {
            logestic.warn("User does not have enough coins", { userId, required: product.amount });
            throw new NotEnoughCoinsError();
        }
        if (product.amount < 1 || product.codes.length === 0) {
            logestic.warn("Product out of stock", { productId });
            throw new OutOfStockError("No codes or out of stock");
        }
        const idx = Math.floor(Math.random() * product.codes.length);
        const code = product.codes[idx];
        const newCodes = product.codes.filter((_, i) => i !== idx);
        logestic.info("Updating user and product", { userId, productId });
        await tx.user.update({
            where: { id: user.id },
            data: {
                focuscoins: { decrement: product.amount }
            }
        });
        await tx.product.update({
            where: { id: productId },
            data: {
                codes: newCodes,
                amount: { decrement: 1 },
            },
        });
        return code;
    });
}
export default buyController;