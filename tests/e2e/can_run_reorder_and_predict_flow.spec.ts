import { test, expect } from "@playwright/test";

// For now we check the distribution using the summary. Using the prediction table would be better, but that's flakey
// Maybe use snapshots?

test("with spreadsheet and correct prediction", async ({ page }) => {
    page.on("filechooser", async (fileChooser) => {
        await fileChooser.setFiles("tests\\input\\dummy_data2_reorder.xlsx");
    });

    test.setTimeout(150_000);

    await page.goto("/");
    await page.getByRole("button", { name: "Create new" }).click();
    await page.getByLabel("Name*").click();
    await page.getByLabel("Name*").fill("Test");
    await page.getByLabel("Name*").press("Tab");
    await page.getByLabel("Description").fill("This is a test");
    await page.getByLabel("Select Files").click();
    await page.getByRole("button", { name: "Create", exact: true }).click();

    await page.waitForURL("#/reorder/*");
    await page.getByText("Age", { exact: true }).click();
    await page.getByText("Sex", { exact: true }).click();
    await page.getByRole("button", { name: "Finish" }).click();

    await page.waitForURL("#/detail/*");
    await expect(page.locator("#root")).toContainText(
        "100 Patients8 Cluster 1 10 Cluster 2 6 Cluster 3 76 Cluster 4",
    );
});
