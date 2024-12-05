export const reorderObjectValuesByKeyList = (
    obj: any,
    keyOrder: string[],
): any[] => {
    const result = keyOrder.filter((key) => key in obj).map((key) => obj[key]);

    if (result.length !== keyOrder.length) {
        const missingKeys = keyOrder.filter((key) => !(key in obj));
        throw new Error("Missing properties:" + missingKeys);
    }

    return result;
};
