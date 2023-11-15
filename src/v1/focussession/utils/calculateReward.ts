import {Elysia, t} from "elysia";

const calculateReward = new Elysia()
    .guard({
        body: t.Object({
            minutes: t.Number()
        })
    })
    .post("/calculate-reward", async ({body}) => {
            const {minutes} = body;

            if (minutes > 90) {
                return {
                    status: 400,
                    success: false,
                    message: "Minutes must be less than or equal to 90",
                };
            }

            const coinsPerMinute = 0.25;

            const rewardInCoins = Math.round(minutes * coinsPerMinute);

            return {
                success: true,
                message: "Calculate reward in coins",
                data: {
                    rewardInCoins,
                },
            };
        },
        {
            detail: {
                tags: ['Focus-session']
            }
        });

export default calculateReward;
