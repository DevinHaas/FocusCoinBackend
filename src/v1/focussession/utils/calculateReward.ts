const calculateReward = (minutes: number) => {
    if (minutes > 90) {
        return -1;
    }

    const coinsPerMinute = 0.25;

    return Math.round(minutes * coinsPerMinute);
};

export default calculateReward;
