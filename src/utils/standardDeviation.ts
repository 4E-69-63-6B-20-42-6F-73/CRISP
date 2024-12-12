export const standardDeviation = (
    arr: number[],
    usePopulation = false,
): number => {
    if (arr.length === 0) {
        throw new Error("Array must not be empty.");
    }

    const mean = arr.reduce((acc, val) => acc + val, 0) / arr.length;

    const variance = arr.reduce((acc, val) => acc + (val - mean) ** 2, 0);

    return Math.sqrt(variance / (arr.length - (usePopulation ? 0 : 1)));
};
