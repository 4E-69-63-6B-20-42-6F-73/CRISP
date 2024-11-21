import { openDB } from "idb";

const dbPromise = openDB("zustand-db", 1, {
    upgrade(db) {
        db.createObjectStore("zustand-store");
    },
});

const setItem = async (key: string, value: any) => {
    const db = await dbPromise;
    return db.put("zustand-store", value, key);
};

const getItem = async (key: string) => {
    const db = await dbPromise;
    return db.get("zustand-store", key);
};

const removeItem = async (key: string) => {
    const db = await dbPromise;
    return db.delete("zustand-store", key);
};

export { setItem, getItem, removeItem };
