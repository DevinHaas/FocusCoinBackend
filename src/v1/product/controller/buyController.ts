import {Elysia, t} from "elysia";
import {prisma} from "../../../libs/prisma";

class NotFoundError extends Error {}
class OutOfStockError extends Error {}
class UserNotFoundError extends Error {}
class NotEnoughCoinsError extends Error {}

const buyController = new Elysia()
    .post("/buy", async (ctx) => {

            // @ts-ignore
            const auth = ctx.auth()

            if (!auth?.userId) {
                console.log("unauthorized")
                ctx.status(401)
                return {
                    success: false,
                    message: "Unauthorized",
                    data : {}
                }
            }


            const {product_id} = ctx.body

            try {


                const code = await buyProductFromDB(product_id, auth.userId);

                return {
                    success: true,
                    data: { code },
                };
            } catch (err) {
                console.log(err)
                if (err instanceof NotFoundError) {
                    ctx.status(404)
                    return { success: false, message: err.message, data : {} };
                } else if (err instanceof OutOfStockError) {
                    ctx.status(410)
                    return { success: false, message: err.message, data : {} };
                } else {
                    console.error("Unexpected buy error:", err);
                    ctx.status(500)
                    return {
                        success: false,
                        message: "Server error while purchasing",
                        data: {}
                    };
                }
            }
        },
        {
            body: t.Object({
                product_id: t.String(),
            }),
            detail: {
                tags: ['Product'],
                summary: 'Buy a product, decrementing stock & returning a code'
            }
        });


async function buyProductFromDB(productId: string, userId: string): Promise<string> {
    return prisma.$transaction(async (tx) => {
        const user = await prisma.user.findUnique({
            where:{clerk_id: userId}
        })


        if (!user) {
            throw new UserNotFoundError("No user found")
        }

        const product = await tx.product.findUnique({
            where: {id: productId},
            select: {amount: true, codes: true},
        });
        if (!product) {
            throw new NotFoundError("Product not found");
        }

        if (user.focuscoins < product.amount ){
            throw new NotEnoughCoinsError()
        }
        if (product.amount < 1 || product.codes.length === 0) {
            throw new OutOfStockError("No codes or out of stock");
        }

        const idx = Math.floor(Math.random() * product.codes.length);
        const code = product.codes[idx];


        console.log("old codes"+ product.codes)
        const newCodes = product.codes.filter((_, i) => i !== idx);

        console.log("new codes" + newCodes)

        await tx.user.update({
            where: {id: user.id},
            data: {
                focuscoins : {decrement: product.amount}
            }
        })
        await tx.product.update({
            where: {id: productId},
            data: {
                codes: newCodes,
                amount: {decrement: 1},
            },
        });

        return code;
    });
}

export default buyController;