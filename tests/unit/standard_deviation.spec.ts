import { test, expect } from "@playwright/test";
import { standardDeviation } from "@/utils/standardDeviation";

test.describe("standardDeviation Function", () => {
    test("calculates sample standard deviation correctly", async ({}) => {
        const data = [2, 4, 6, 8];
        const result = standardDeviation(data);
        expect(result).toBeCloseTo(2.58199, 5);
    });

    test("calculates population standard deviation correctly", async ({}) => {
        const data = [2, 4, 6, 8];
        const result = standardDeviation(data, true);
        expect(result).toBeCloseTo(2.23607, 5);
    });

    test("throws error for empty array", async ({}) => {
        expect(() => standardDeviation([])).toThrowError(
            "Array must not be empty.",
        );
    });

    test("returns 0 for single element with population", async ({}) => {
        const data = [5];
        const result = standardDeviation(data, true);
        expect(result).toBe(0);
    });

    test("handles negative numbers correctly", async ({}) => {
        const data = [-2, -4, -6, -8];
        const result = standardDeviation(data);
        expect(result).toBeCloseTo(2.58199, 5);
    });

    test("handles mixed positive and negative numbers", async ({}) => {
        const data = [-1, 0, 1, 2];
        const result = standardDeviation(data);
        expect(result).toBeCloseTo(1.29099, 5);
    });

    test("handles identical elements correctly", async ({}) => {
        const data = [5, 5, 5, 5];
        const result = standardDeviation(data);
        expect(result).toBe(0);
    });
});
