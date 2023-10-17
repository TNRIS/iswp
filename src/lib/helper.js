import { onMount } from "svelte";
import { start_all_db } from "$lib/db/db.js";

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

// Load indexeddb
export let load_indexeddb = async () => {
    const start = Date.now();
    await onMountSync();

    let IS_2022_WEBSITE = window.location.href.indexOf("2022") > -1;
    let IS_2017_WEBSITE = window.location.href.indexOf("2017") > -1;

    // Start indexeddb, efficient if upgrade is not needed.
    let [db17, db22] = await start_all_db();

    // Choose database depending on url.
    if (!(db22 && db17)) throw "Databases are null.";
    console.log(`exec time: ${Date.now() - start} ms.`);

    if (IS_2022_WEBSITE) {
        return db22;
    } else if (IS_2017_WEBSITE) {
        return db17;
    } else {
        return db22;
    }
};

export let split_every = (size, array) => {
    var array2d = [];
    let arr = JSON.parse(JSON.stringify(array)); // Hard copy array.
    while (arr.length > 0) {
        array2d.push(arr.splice(0, size));
    }

    return array2d;
}

// Helper to calculate percentage of value in an array.
export let calcPercentage = (array, value) => {
    let total = 0;
    array.forEach((item) => {
        total += item[1];
    });

    let percent = Math.round(((value / total) * 10) * 100) / 10;

    return `${percent}%` ;
}