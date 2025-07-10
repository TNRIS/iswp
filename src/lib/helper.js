import { onMount, afterUpdate } from 'svelte';
import { start_db_2017, start_db_2022, start_db_2027 } from './db/db.js';
import { Constant2027 } from './Constant2027.js';
import { Constant2022 } from './Constant2022.js';
import { Constant2017 } from './Constant2017.js';
import Statewide from '$lib/db/statewide.js';
import { getContext } from 'svelte';

export let DEFAULT_FLAG = '2027';

export let getConstants = (host) => {
    if (host.includes('2027')) {
        return new Constant2027();
    } else if (host.includes('2022')) {
        return new Constant2022();
    } else if (host.includes('2017')) {
        return new Constant2017();
    } else {
        if (DEFAULT_FLAG == '2017') {
            return new Constant2017();
        } else if (DEFAULT_FLAG == '2027'){
            return new Constant2027();
        }
        else if (DEFAULT_FLAG == '2022'){
            return new Constant2022();
        }
        else {
            return new Constant2022();
        }
    }
};

/**
 * Make onMount awaitable for use in async functions.
 * @returns {Promise<any>} mounted if successful, otherwise reject with error.
 */export let onMountSync = () => {
    return new Promise((resolve, reject) => {
        try {
            onMount(async () => {
                resolve('mounted');
            });
        } catch (err) {
            reject(err);
        }
    });
};

/**
 * Replace spaces with dash.
 * @param {*} s String to check for spaces, and replace them with dashes.
 * @returns {string} String with the spaces replaced with dashes.
 */
export let slugify = (s) => {
    return s.replace(/\s+/g, '-');
};

/**
 * Deep clone an object.
 * Needed when you want to clone an object and have two distinct objects to edit.
 * @param {*} obj Object to clone
 * @returns Object that is mapped to a seperate part of memory, making it a clone of the original rather than a pointer.
 */
export let real_clone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};

/**
 * This is for checking if the indexeddb is downloaded, and hiding portions of the page based on that info.
 * @returns {Promise<boolean>} true if successful, otherwise false.
 */
export let visualize_idb_downloading = async () => {
    try {
        let loadableContent /** @type {HTMLElement} */ = document.getElementById('loadable-content');
        let mainLoader /** @type {HTMLElement} */ = document.getElementById('main-loader');
        
        const checkDBDone = () => {
            if(!loadableContent || !mainLoader) {
                throw("Cannot find loadable content section or mainloader section.");
            }
            if (localStorage.getItem('checkedDB') == 'true') {
                clearInterval(interval);
                loadableContent.style.display = 'block';
                mainLoader.style.display = 'none';
                return true;
            } else {
                loadableContent.style.display = 'none';
                mainLoader.style.display = 'block';
            }
        };
        let interval = setInterval(checkDBDone, 50);
    } catch(err) {
        console.log("Error checking indexed database in visualize_idb_downloading function.")
        return false;
    }
};

/**
 * Promise wrapper around the afterUpdate callback function. To make it usable with a async/await style.
 * @returns {Promise<any>}
 */
export let afterUpdateSync = () => {
    return new Promise((resolve, reject) => {
        try {
            afterUpdate(async () => {
                resolve('updated');
            });
        } catch (err) {
            reject(err);
        }
    });
};

/**
 * Get a number format constructor that is configured to use USD. This has decimal points.
 * @returns {Intl.NumberFormatConstructor}
 */
export let usd_format = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
    //maximumFractionDigits: decimalpoints
});

/**
 * Get a number format constructor that is configured to use USD. This does not have decimal points.
 * @returns {Intl.NumberFormatConstructor}
 */
export let usd_format_whole = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
});

/**
 * Download and load water planning data into an indexeddb, for the year desired. This also checks the data for correctness.
 * 
 * @returns {Promise<any>} A promise indicating when the database is done downloading.
 */
 export let load_indexeddb = async () => {
    try {
        await onMountSync();
        let IS_2017_WEBSITE = window.location.href.indexOf('2017') > -1;
        let IS_2022_WEBSITE = window.location.href.indexOf('2022') > -1;
        let IS_2027_WEBSITE = window.location.href.indexOf('2027') > -1;

        if (IS_2022_WEBSITE) {
            return start_db_2022();
        } else if (IS_2017_WEBSITE) {
            return start_db_2017();
        } else if (IS_2027_WEBSITE) {
            return start_db_2027();
        } else {
            // SET TEST HERE
            if (DEFAULT_FLAG == '2017') {
                return start_db_2017();
            } if (DEFAULT_FLAG == '2022') {
                return start_db_2022();
            } if (DEFAULT_FLAG == '2027') {
                return start_db_2027();
            } else {
                return start_db_2022();
            }
        }
    } catch (err) {
        console.log(err);
    }
};

/**
 * Capitalizing function for the iswp.
 * 
 * @param { string } s String to be capitalized.
 * @param { string= } chosen Optional string that defaults to "" if it is set to wms then don't capitalize.
 * @returns 
 */
export let cap = (s,  chosen="") => {
    if (!s) return s;
  
    if(chosen && chosen.length && (chosen === 'wms' || chosen === 'project' || chosen === 'entity')) return s;
  
    let split_space = s.split(' ');
    let format_string = '';
    for (let i = 0; i < split_space.length; i++) {
        format_string += split_space[i].toLowerCase().charAt(0).toUpperCase() + split_space[i].toLowerCase().slice(1);
        format_string += ' ';
    }
    return format_string;
};

/**
 * Make a 2 dimensional array out of a 1 dimensional array. split the 1d array every size characters then push that subset into a new array. Then return it.
 * @param {number} size 
 * @param {number[]} array 
 * @returns 
 */
export let split_every = (size, array) => {
    var array2d = [];
    let arr = JSON.parse(JSON.stringify(array)); // Hard copy array.
    while (arr.length > 0) {
        array2d.push(arr.splice(0, size));
    }

    return array2d;
};

// Helper to calculate percentage of value in an array.
export let calcPercentage = (array, value) => {
    let total = 0;
    array.forEach((item) => {
        total += item[1];
    });

    let percent = Math.round((value / total) * 10 * 100) / 10;

    return `${percent}%`;
};

/**
 * Returns a string with commas every 3 characters.
 * @param {string} s
 * @returns {string}
 */
export let commafy = (s) => {
    return s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Some items use EntityLatCoord instead of LatCoord. So check for which is used. This is a workaround because the entities don't consistently use one or the other.
export const coordFitter = (item) => {
    let lat, lng;

    // 0 is valid so check for undefined.
    if (item.LatCoord !== undefined && item.LongCoord !== undefined) {
        lat = item.LatCoord;
        lng = item.LongCoord;
    } else if (item.EntityLatCoord !== undefined && item.EntityLongCoord !== undefined) {
        lat = item.EntityLatCoord;
        lng = item.EntityLongCoord;
    } else if (item.Latitude !== undefined && item.Longitude !== undefined) {
        lat = item.Latitude;
        lng = item.Longitude;
    }

    return [lat, lng];
};

/** 
 * Generic function to sort a html table. Currently defaults to skip bottom row. But can be changed using SKIP_BOTTOM_ROW flag.
 * @param {object} table Object referencing a table element selected with svelte.
 * @param {number} n Index of column to sort.
 * @param {function} parseFunc callback Function that is used to parse the inner HTML.
 * @param {boolean} SKIP_BOTTOM_ROW (For total column mainly (you don't want total sorted)).

 */
let tableSort = (table, n, parseFunc, SKIP_BOTTOM_ROW = true) => {
    let rows,
        shouldSwitch,
        x,
        y,
        i,
        switchcount = 0;
    let switching = true;
    let dir = 'asc';

    let offset = SKIP_BOTTOM_ROW ? 2 : 1;
    while (switching) {
        switching = false;
        // @ts-ignore
        rows = table.rows;

        for (i = 1; i < rows.length - offset; i++) {
            shouldSwitch = false;

            x = parseFunc(rows[i]);
            y = parseFunc(rows[i + 1]);

            if (dir == 'asc') {
                if (x > y) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == 'desc') {
                if (x < y) {
                    shouldSwitch = true;
                    break;
                }
            }
        }

        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;
        } else {
            if (switchcount == 0 && dir == 'asc') {
                dir = 'desc';
                switching = true;
            }
        }
    }

    let cells = rows[0].cells;
    // Remove the current sort by icon on all headers.
    for (let i = 0; i < cells.length; i++) {
        cells[i].classList.remove('asc');
        cells[i].classList.remove('desc');
    }

    if (dir == 'asc') {
        rows[0].cells[n].classList.add('asc');
    } else if (dir == 'desc') {
        rows[0].cells[n].classList.add('desc');
    }
};

/**
 * Sort a table numerically
 * @param {object} table Object referencing a table element selected with svelte.
 * @param {number} n Index of column to sort.
 * @param {string} [start] Optional Start value to sort between.
 * @param {string} [end] Optional End value to sort between.
 * @param {boolean} SKIP_BOTTOM_ROW whether to skip the bottom row or not, in case it's used as a header column.
 */
export let sortNumeric = (table, n, start, end, SKIP_BOTTOM_ROW = true) => {
    tableSort(
        table,
        n,
        (row) => {
            let ih = row.getElementsByTagName('td')[n].innerHTML;
            if (start && end) {
                ih = ih.substring(ih.indexOf(start) + 1, ih.lastIndexOf(end));
                return Number(ih.replaceAll(',', ''));
            } else {
                return Number(ih.replaceAll(',', ''));
            }
        },
        SKIP_BOTTOM_ROW
    );
};

/**
 * Sort a table alphabetically.
 * @param {object} table Object referencing a table element selected with svelte.
 * @param {number} n Index of column to sort.
 */
export let sortAlphabetic = (table, n, SKIP_BOTTOM_ROW = true) => {
    tableSort(
        table,
        n,
        (row) => {
            let ri = row.getElementsByTagName('td')[n].innerHTML.toLowerCase();
            return ri;
        },
        SKIP_BOTTOM_ROW
    );
};

/**
 * Left join two json objects where column matches (paramater where)
 * @param {object} left
 * @param {object} right
 * @param {Array<string>} where
 */
export let objLeftjoin = (left, right, where) => {
    let rightWhere = where[0];
    if (where.length > 2) {
        console.log('Error, only 2 where clauses allowed in objLeftJoin');
    } else if (where.length === 2) {
        rightWhere = where[1];
    }
    for (let i = 0; i < left.length; i++) {
        let match = right.find((match) => {
            return left[i][where[0]] === match[rightWhere];
        });
        if (match) {
            left[i] = { ...match, ...left[i] };
        }
    }
};

/**
 * Scale numbers to portion of new max
 * @param {number} scale1
 * @param {number} scale2
 * @param {Constant2017 | Constant2022 | Constant2027} constants
 */
export let scaleTonew = (scale1, scale2, constants) => {
    let portion = scale1 / scale2;

    let r = portion * constants.MIN_RADIUS;
    let radius = Math.floor(r) + constants.MIN_RADIUS;
    if(radius > constants.MAX_RADIUS) radius = constants.MAX_RADIUS;
    return radius;
};

/**
 * objectExistsInArray: Check if object exists in an array. Pass in keys to check so you can check if it partially matches..
 * @param {any[]} accumulator
 * @param {any}  label
 * @param {string[]} keys
 * @param {string[]} [secondkeys] Optional keys for the label object. Defaults to keys.
 */
export let objectExistsInArray = (accumulator, label, keys, secondkeys = keys) => {
    let exists /** @type {boolean} */ = false; // Default to false.
    try {
        if (accumulator.length) {
            exists = accumulator.some((/** @type {any} */ item) => {
                let match = true;
                keys.forEach((key, i) => {
                    if (!(item[secondkeys[i]] === label[key])) match = false;
                });
                return match;
            });

            return exists;
        }
    } catch (e) {
        return false;
    }
    return false;
};

/**
 * labelReducer: Create usable labels out of an array of strings.
 * @param {string[]} labels
 * @param {string} [label_prefix] - Optional Paramater to prefix labels with.
 * 
 * @typedef NavLabel
 * @type {object}
 * @property {string} value
 * @property {string} label
 */
export let labelReducer = (labels, label_prefix = '') => {
    return labels.reduce((/** @type {NavLabel[]} */ accumulator, /** @type {string} */ currentValue) => {
        let navlabel = /** @type {NavLabel}*/ ({
            value: currentValue,
            label: `${label_prefix}${currentValue}`
        });
        accumulator.push(navlabel);
        return accumulator;
    }, []);
};

/**
 * wrapupCommonIdbTasks: Wrap up common idb tasks.
 * @returns {Promise<Array<any>>}: Object with a indexeddb, and a Statewide object
 */
export let wrapupCommonIdbTasks = async () => {
    let db = getContext('db');
    await onMountSync();
    await visualize_idb_downloading();
    db = await db;
    let sw = new Statewide(db)

    let items = [
        db,
        sw
    ]
    return items;
}