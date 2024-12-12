// import { test, expect } from "./fixture/existing_analyse";
// import fs from "fs";
// import path from "path";
// import os from "os";

// test("Distribution", async ({ page }) => {
//     await page.goto("/#/detail/1");
//     await download_matches_snapshot(
//         page,
//         "Distribution.png",
//         async () =>
//             await page
//                 .locator("div")
//                 .filter({ hasText: /^Distribution$/ })
//                 .getByLabel("Download image of graph")
//                 .click(),
//     );
// });

// test("Swelling", async ({ page }) => {
//     await page.goto("/#/detail/1");
//     await download_matches_snapshot(
//         page,
//         "Swelling.png",
//         async () =>
//             await page.getByLabel("Download image of graph").nth(2).click(),
//     );
// });

// async function download_matches_snapshot(
//     page: any,
//     name: string,
//     action: () => Promise<void>,
// ): Promise<void> {
//     const downloadPromise = page.waitForEvent("download");

//     await action();

//     const download = await downloadPromise;

//     const downloadDir = fs.mkdtempSync(path.join(os.tmpdir(), "unit_tests_"));
//     const filePath = path.join(downloadDir, download.suggestedFilename());
//     await download.saveAs(filePath);

//     try {
//         const buffer = fs.readFileSync(filePath);
//         expect(buffer).toMatchSnapshot(name, { maxDiffPixelRatio: 0.1 });
//     } finally {
//         fs.rmSync(downloadDir, { force: true, recursive: true });
//     }
// }
