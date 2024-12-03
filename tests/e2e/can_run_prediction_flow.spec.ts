import { test, expect } from "@playwright/test";

const testCases = [
    {
        name: "spreadsheet",
        files: "tests\\input\\dummy_data2.xlsx",
        expectedText:
            "100 Patients14 Cluster 1 11 Cluster 2 24 Cluster 3 51 Cluster 4",
    },
    {
        name: "spreadsheet and empty cells",
        files: "tests\\input\\dummy_data2_empty_columns.xlsx",
        expectedText:
            "4 Patients1 Cluster 1 1 Cluster 2 0 Cluster 3 2 Cluster 4",
    },
    {
        name: "csv",
        files: "tests\\input\\dummy_data.csv",
        expectedText:
            "100 Patients12 Cluster 1 14 Cluster 2 19 Cluster 3 55 Cluster 4",
    },
    {
        name: "mixed input",
        files: [
            "tests\\input\\dummy_data.csv",
            "tests\\input\\dummy_data2.xlsx",
        ],
        expectedText:
            "200 Patients26 Cluster 1 25 Cluster 2 43 Cluster 3 106 Cluster 4",
    },
    {
        name: "multiple tabs in excel",
        files: "tests\\input\\dummy_data_with_legend_and_multiple_tabs.xlsx",
        expectedText:
            "200 Patients26 Cluster 1 25 Cluster 2 43 Cluster 3 106 Cluster 4",
    },
];

test.describe("File upload and prediction tests", () => {
    for (const testCase of testCases) {
        test(`with ${testCase.name} and correct prediction`, async ({
            page,
        }) => {
            test.setTimeout(150_000);

            page.on("filechooser", async (fileChooser) => {
                await fileChooser.setFiles(testCase.files);
            });

            await page.goto("/");
            await page.getByRole("button", { name: "Create new" }).click();
            await page.getByLabel("Name*").click();
            await page.getByLabel("Name*").fill("Test");
            await page.getByLabel("Name*").press("Tab");
            await page.getByLabel("Description").fill("This is a test");
            await page.getByLabel("Select Files").click();
            await page
                .getByRole("button", { name: "Create", exact: true })
                .click();

            await page.waitForURL("#/detail/*");
            await expect(page.locator("#root")).toContainText(
                testCase.expectedText,
            );
        });
    }
});
