const calculateReward = (seconds: number) => {
    if (seconds > 5400) {
        return -1;
    }

    const coinsPerMinute = 0.25;

    return Math.round((seconds / 60)* coinsPerMinute);
};

export default calculateReward;
