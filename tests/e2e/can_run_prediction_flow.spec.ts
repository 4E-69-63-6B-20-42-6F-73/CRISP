import { test, expect } from "@playwright/test";

// For now we check the distribution using the summary. Using the prediction table would be better, but that's flakey

test("with spreadsheet and correct prediction", async ({ page }) => {
    page.on("filechooser", async (fileChooser) => {
        await fileChooser.setFiles("tests\\input\\dummy_data2.xlsx");
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
    await page.waitForURL("detail/*");
    await expect(page.locator("#root")).toContainText(
        "100 Patients14 Cluster 1 11 Cluster 2 24 Cluster 3 51 Cluster 4",
    );
});

test("with csv and correct prediction", async ({ page }) => {
    page.on("filechooser", async (fileChooser) => {
        await fileChooser.setFiles("tests\\input\\dummy_data.csv");
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
    await page.waitForURL("detail/*");

    await expect(page.locator("#root")).toContainText(
        "100 Patients12 Cluster 1 14 Cluster 2 19 Cluster 3 55 Cluster 4  ",
    );
});

test("with mixed input and correct prediction", async ({ page }) => {
    page.on("filechooser", async (fileChooser) => {
        await fileChooser.setFiles([
            "tests\\input\\dummy_data.csv",
            "tests\\input\\dummy_data2.xlsx",
        ]);
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
    await page.waitForURL("detail/*");
    await expect(page.locator("#root")).toContainText(
        "200 Patients26 Cluster 1 25 Cluster 2 43 Cluster 3 106 Cluster 4",
    );
});
