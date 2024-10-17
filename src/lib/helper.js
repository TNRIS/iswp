import { onMount, beforeUpdate, afterUpdate } from 'svelte';
import { start_all_db, start_db_2017, start_db_2022, start_db_2027 } from './db/db.js';
import { Constant2027 } from './Constant2027.js';
import { Constant2022 } from './Constant2022.js';
import { Constant2017 } from './Constant2017.js';
export let DEFAULT_FLAG = '2022';

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
        } else {
            return new Constant2022();
        }
    }
};

// Helper to make onmount awaitable.
export let onMountSync = () => {
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

export let slugify = (s) => {
    return s.replace(/\s+/g, '-');
};

export let real_clone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};

export let is_idb_loaded = () => {
    return new Promise((resolve, reject) => {
        try {
            const checkDBDone = () => {
                //console.log("Checking idb");
                //console.log("checkedDB" + localStorage.getItem("checkedDB"));
                if (localStorage.getItem('checkedDB') == 'true') {
                    //console.log("resolving.")
                    clearInterval(interval);
                    document.getElementById('main-content').style.display = 'block';
                    document.getElementById('main-loader').style.display = 'none';
                    resolve('Done');
                } else {
                    document.getElementById('main-content').style.display = 'none';
                    document.getElementById('main-loader').style.display = 'block';
                }
            };
            let interval = setInterval(checkDBDone, 50);
        } catch (err) {
            reject('error checking idb');
        }
    });
};

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

// Helper to format a number.
export let usd_format = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
    //maximumFractionDigits: decimalpoints
});

export let usd_format_whole = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
});

// Load indexeddb
export let load_indexeddb = async () => {
    try {
        const start = Date.now();
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
 * Sort a table Numerically
 * @param {object} table Object referencing a table element selected with svelte.
 * @param {number} n Index of column to sort.
 * @param {string} [start] Optional Start value to sort between.
 * @param {string} [end] Optional End value to sort between.
 * @param {number} [skips=1] how many columns to skip (For total column mainly (you don't want total sorted)) make 0 if there is no total.
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
 * Sort a table Numerically
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
 * @param {number} newMax
 */
export let scaleTonew = (scale1, scale2, constants) => {
    let portion = scale1 / scale2;

    let r = portion * constants.MIN_RADIUS;
    let radius = Math.floor(r) + constants.MIN_RADIUS;
    if(radius > constants.MAX_RADIUS) radius = constants.MAX_RADIUS;
    return radius;
};
