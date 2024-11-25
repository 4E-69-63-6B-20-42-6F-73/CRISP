import { test, expect } from "./fixture/existing_analyse";

test("Analyse", async ({ page }) => {
    await page.goto("/#");

    await page.getByRole("gridcell", { name: "Test", exact: true }).hover();

    await page.getByLabel("Delete Test").click();

    await page.getByRole("button", { name: "Undo" }).click();
    await expect(page.locator("#root")).toContainText(
        "NameDescriptionDateFilesTestThis is a testThu Nov 21 2024xlsxdummy_data2_reorder.xlsx",
    );
});
