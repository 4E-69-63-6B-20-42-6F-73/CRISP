import { useState, useEffect } from "react";

// A debounce is a technique that delays a function call until a specified time has passed without further input changes.
// It helps reduce unnecessary calls, like waiting for a user to stop typing before triggering an action.
export function useDebounce(input: any, delay: number) {
    const [debounceValue, setDebounceValue] = useState(input);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebounceValue(input);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [input, delay]);
    return debounceValue;
}
