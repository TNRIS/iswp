// @ts-nocheck
let db27;
let UPGRADE_NEEDED = false;

import { build_func } from './db_helper.js?v1';

/** @type {number} Configure window in ms for how long to attempt to reload page before timing out and logging an error. */
const RELOAD_WINDOW_MS = 10000;

let checksumPromise = async () => {
    /*placeholder*/
};

export const delete_database27 = () => {
    try {
        var del = window.indexedDB.deleteDatabase('iswpdb27');

        del.onsuccess = () => {
            console.log('Database has been deleted.');
        };

        del.onerror = () => {
            console.log("Couldn't delete database.");
        };

        del.onblocked = () => {
            console.log("Couldn't delete database due to the operation being blocked");
        };
    } catch (err) {
        console.log(`error deleting database: ${err}`);
    }
};

const storeChecksum = async () => {
    // Store checksum in localstorage
    const start = Date.now();
    const checksum_url = 'https://tnris-droc.s3.amazonaws.com/iswp/2027/checksum.json';
    const response = await fetch(checksum_url);
    const cs = await response.json();
    localStorage.setItem('checksum2027', JSON.stringify(cs));
    //OK: Tested around 10 milliseconds cost in dev. Probably faster on a normal web server Rather than dev. Only ran on upgrade needed.
    console.log(`Checksum parse time: ${Date.now() - start}ms.`);
};

export function startDb27() {
    return new Promise(async (resolve, reject) => {
        const request27 = window.indexedDB.open('iswpdb27', 8);

        request27.onerror = (event) => {
            reject(event);
        };

        request27.onsuccess = async (event) => {
            db27 = event.target.result;
            if (UPGRADE_NEEDED) {
                const BASE_URL = 'https://tnris-droc.s3.amazonaws.com/iswp/';
                const cache_2027 = '2027/cache.json';

                let gz27 = await fetch(BASE_URL + cache_2027, {
                    decompress: true
                });
                let j27 = await gz27.json();

                let object_stores = Array.from(db27.objectStoreNames);
                for (let id in object_stores) {
                    let oname = object_stores[id];
                    let store = db27.transaction(oname, 'readwrite').objectStore(oname);
                    j27[oname].forEach((vwc) => {
                        store.add(vwc);
                    });
                }
            }
            // Check we set entityCoordinates up and redownload if needed.
            if (localStorage.getItem('entitySuccess') !== 'true') {
                const transaction = db27.transaction(['vwEntityCoordinates']);
                const objectStore = transaction.objectStore('vwEntityCoordinates');
                const entityCoordinates = objectStore.getAll();

                entityCoordinates.onsuccess = (event) => {
                    // Do something with the request.result!
                    localStorage.setItem('entityCoordinates', JSON.stringify(event.target.result));

                    // Practical check to make sure this has at least 1000 entities.
                    if (event.target.result.length > 1000) localStorage.setItem('entitySuccess', 'true');
                };
                entityCoordinates.onerror = (event) => {
                    localStorage.setItem('entitySuccess', 'false');
                    console.log('error making entitycache');
                };
            }

            // Check databases before resolving
            // Not very efficient so only do once per database refresh
            if (localStorage.getItem("checkedDB") !== "true") {
                await checksumPromise;
                const start = Date.now();
                let checksum = localStorage.getItem('checksum2027');
                if (checksum && checksum.length) {
                    checksum = JSON.parse(checksum);
                } else {
                    await storeChecksum();
                    checksum = JSON.parse(localStorage.getItem('checksum2027'));
                }

                // 1. Do a quick check.
                let IDB_IS_GOOD = db27.objectStoreNames.length == Object.keys(checksum).length

                // 2. Do a long check if quick check succeeds.
                  if(IDB_IS_GOOD) {
                    // idb queriesmust be awaited.
                    IDB_IS_GOOD = await new Promise((res, rej) => {
                        const db27_tables = Object.values(db27.objectStoreNames)
                        let j = 0;
                        for(let i = 0; i < db27_tables.length; i++) {
                            try{
                                const item = db27_tables[i];
                                const transaction = db27.transaction([item], 'readonly');
                                const objectStore = transaction.objectStore(item);
                                const countRequest = objectStore.count();

                                countRequest.onsuccess = (event) => {
                                    j++;
                                    const recordcount = event.currentTarget.result;
                                    const record = event.currentTarget.source.name;
            
                                    if (recordcount !== checksum[record]) {
                                        // Resolve to false if the records don't match.
                                        res(false);
                                    } else if(j >= Object.keys(checksum).length - 1) {
                                        // Resolve to true if every record was checked.
                                        UPGRADE_NEEDED = false;
                                        localStorage.setItem('checkedDB', true);
                                        res(true);
                                    }
                                };
        
                                countRequest.onerror = (event) => {
                                    j++;
                                    res(false);
                                }
                            } catch(err) {
                                IDB_IS_GOOD = false;
                                res(false);
                            }
                        };
                    });   
                }

                // 3. If IDB is still not good then reset if it is not stuck. Log a error message if so suggesting user clears cache.
                if (!IDB_IS_GOOD) {
                    const NOW_TIMESTAMP  = new Date().getTime();
                    const STORED_EXPIRY = Number(localStorage.getItem('STORED_EXPIRY'));
                    const IS_RELOAD_TIMEOUT_OVER = (STORED_EXPIRY + 60000) < NOW_TIMESTAMP;
                    const SHOULD_TIMEOUT = (STORED_EXPIRY + RELOAD_WINDOW_MS) < NOW_TIMESTAMP;

                    request27.result.close(); // Close database because it'd invalid for now.
                    if(STORED_EXPIRY) {
                        if (IS_RELOAD_TIMEOUT_OVER) {
                            localStorage.setItem('STORED_EXPIRY', NOW_TIMESTAMP + RELOAD_WINDOW_MS);
                        } else if(SHOULD_TIMEOUT) {
                            const ERR_MSG = 'There was a problem loading the application. Please clear your cache.';
                            console.error(ERR_MSG);
                            document.getElementById("loader-msg").innerHTML = ERR_MSG;
                            reject('There was a problem loading database. Reload please.');
                        }
                    } else {
                        localStorage.setItem('STORED_EXPIRY', NOW_TIMESTAMP + RELOAD_WINDOW_MS);
                    }

                    // Reload the database and refresh the page. This will reset the checksum and rebuild the database. 
                    localStorage.setItem('checkedDB', false);
                    delete_database27();
                    window.location.reload();
                    reject('There was a problem loading database. Reload please.');
                } else {
                    localStorage.setItem('checkedDB', true);
                }
            }

            resolve(db27);
        };

        request27.onupgradeneeded = async (event) => {
            const STORED_EXPIRY = localStorage.getItem('STORED_EXPIRY');
            localStorage.clear(); // Clear all cached queries.
            localStorage.setItem('STORED_EXPIRY', STORED_EXPIRY);
            checksumPromise = storeChecksum();
            localStorage.setItem('checkedDB', false);
            // Begin upgrade now.

            UPGRADE_NEEDED = true;
            console.log('Starting building of the 2027 database.');

            build_func(event, 'vwEntityCoordinates', ['id', 'EntityId']);
            build_func(event, 'vwEntityNeedsAsPctOfDemand', ['id', 'EntityId']);
            build_func(event, 'vwExistingWugSupply', ['EntityId', 'MapSourceId', 'WugCounty', 'WugRegion', 'WugType']);
            build_func(event, 'vwExistingWUGSupplyA1', []);
            build_func(event, 'vwSelectEntitiesInCounty', ['EntityId']);
            build_func(event, 'vwSelectEntitiesInRegion', ['EntityId']);
            build_func(event, 'vwWugDemand', ['EntityId', 'WugCounty', 'WugRegion', 'WugType']);
            build_func(event, 'vwWugDemandsA1', []);
            build_func(event, 'vwWugNeeds', ['EntityId', 'WugCounty', 'WugRegion', 'WugType']);
            build_func(event, 'vwWugNeedsA1', []);
            build_func(event, 'vwWugPopulation', ['EntityId', 'WugCounty', 'WugRegion', 'WugType']);
            build_func(event, 'vwWugPopulationA1', []);
            build_func(event, 'vwSelectRegionsInCounty', ['RegionLetter']);
            build_func(event, 'vwWMSWugSupply', [
                'EntityId',
                'MapSourceId',
                'WugCounty',
                'WugRegion',
                'WmsType',
                'WugType',
                'WmsId',
                'WmsSponsorRegion'
            ]);
            build_func(event, 'vwWMSWugSupplyA1', []);
            build_func(event, 'vwWMSProjects', ['WmsProjectId', 'WugRegion', 'WmsProjectSponsorRegion']);
            build_func(event, 'vwWMSProjectByCounty', ['WugCounty', 'WmsProjectId']);
            build_func(event, 'vwWMSProjectByEntity', ['EntityId', 'WmsProjectId']);
            build_func(event, 'vwWMSProjectBySource', ['MapSourceId', 'WmsProjectId']);
            build_func(event, 'vwWMSProjectByWMS', ['WmsId', 'WmsProjectId']);
            build_func(event, 'vwWMSProjectsByWMSType', ['WmsProjectId', 'WmsType']);
            build_func(event, 'vwWMSProjectByWUGType', ['WmsProjectId', 'WmsProjectSponsorRegion']);
            build_func(event, 'vwWMSProjectByEntityWUGSplit', ['WmsProjectId', 'WmsId']);
            build_func(event, 'vwWMSProjectEntityRelationships', ['WmsProjectId', 'EntityId', 'MapSourceId']);
        };
    });
}
