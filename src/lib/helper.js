import { onMount } from "svelte";

// Helper to make onmount awaitable.
export let onMountSync = () => {
    return new Promise((resolve, reject) => {
        try {
            onMount(async () => {
                resolve("mounted");
            });
        } catch(err) {
            reject(err);
        }
    });
};

// Helper to format a number.
export let usd_format = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});