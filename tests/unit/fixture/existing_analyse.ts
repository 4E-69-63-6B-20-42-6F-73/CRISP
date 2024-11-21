import { test as baseTest } from "@playwright/test";
import { error } from "console";

import state from "./application_state.json" with { type: "json" };

// We create a fixture that adds an existing application state to indexDB so that we can run the tests quicker.
export const test = baseTest.extend({
    page: async ({ page }, use) => {
        await page.goto("CRISP");

        await page.evaluate((state) => {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open("zustand-db", 1);

                request.onupgradeneeded = (event) => {
                    // @ts-ignore This runs in the browser and is correct, but according to TS it's not.
                    const db = event.target.result;

                    if (!db.objectStoreNames.contains("zustand-store")) {
                        db.createObjectStore("zustand-store");
                    }
                };

                request.onsuccess = () => {
                    const db = request.result;

                    const transaction = db.transaction(
                        "zustand-store",
                        "readwrite",
                    );
                    const store = transaction.objectStore("zustand-store");

                    store.put(
                        {
                            state,
                        },
                        "application-store",
                    );

                    transaction.oncomplete = () => {
                        db.close();
                        resolve(true);
                    };

                    transaction.onerror = () => {
                        console.log(error);
                        reject(request.error);
                    };
                };

                request.onerror = () => {
                    console.log(error);
                    reject(request.error);
                };
            });
        }, state);

        await use(page);
    },
});

export { expect } from "@playwright/test";
