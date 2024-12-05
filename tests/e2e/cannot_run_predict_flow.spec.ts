import { test, expect } from "@playwright/test";

test.setTimeout(150_000);

test("with invalid spreadsheet", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Create new" }).click();
    await page.getByLabel("Name*").click();
    await page.getByLabel("Name*").fill("Test");
    await page.getByLabel("Name*").press("Tab");
    await page.getByLabel("Description").fill("This is a test");

    await page.setInputFiles(
        "input[type='file']",
        "tests\\input\\invalid.xlsx",
    );

    await expect(
        page.getByRole("button", { name: "Create", exact: true }),
    ).toBeDisabled();
});
