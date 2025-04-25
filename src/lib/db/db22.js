// @ts-nocheck
let db22;
let UPGRADE_NEEDED = false;

/** @type {number} Configure window in ms for how long to attempt to reload page before timing out and logging an error. */
const RELOAD_WINDOW_MS = 10000;

import { build_func } from './db_helper.js';
let checksumPromise = async () => {
    /*placeholder*/
};

export const delete_database22 = () => {
    try {
        var del = window.indexedDB.deleteDatabase('iswpDB22');

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
    const checksum_url = 'https://tnris-droc.s3.amazonaws.com/iswp/2022/checksum.json';
    const response = await fetch(checksum_url);
    const cs = await response.json();
    localStorage.setItem('checksum2022', JSON.stringify(cs));
};

export function startDb22() {
    return new Promise(async (resolve, reject) => {
        const request22 = window.indexedDB.open('iswpDB22', 201);

        request22.onerror = (event) => {
            reject(event);
        };

        request22.onsuccess = async (event) => {
            db22 = event.target.result;
            if (UPGRADE_NEEDED) {
                let gz22 = await fetch('https://tnris-droc.s3.amazonaws.com/iswp/2022/cache.json', {
                    decompress: true
                });
                let j22 = await gz22.json();
                let object_stores = Array.from(db22.objectStoreNames);

                for (let id in object_stores) {
                    let oname = object_stores[id];
                    let store = db22.transaction(oname, 'readwrite').objectStore(oname);

                    j22[oname].forEach((vwc) => {
                        store.add(vwc);
                    });
                }
            }

            // Check we set entityCoordinates up and redownload if needed.
            if (localStorage.getItem('entitySuccess') !== 'true') {
                const transaction = db22.transaction(['vwEntityCoordinates']);
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
                let checksum = localStorage.getItem('checksum2022');
                if (checksum && checksum.length) {
                    checksum = JSON.parse(checksum);
                } else {
                    await storeChecksum();
                    checksum = JSON.parse(localStorage.getItem('checksum2022'));
                }

                // 1. Do a quick check.
                let IDB_IS_GOOD = db22.objectStoreNames.length == Object.keys(checksum).length

                // 2. Do a long check if quick check succeeds.
                if(IDB_IS_GOOD) {
                    // idb queriesmust be awaited.
                    IDB_IS_GOOD = await new Promise((res, rej) => {
                        const db22_tables = Object.values(db22.objectStoreNames)
                        let j = 0;
                        for(let i = 0; i < db22_tables.length; i++) {
                            try{
                                const item = db22_tables[i];
                                const transaction = db22.transaction([item], 'readonly');
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

                    request22.result.close(); // Close database because it'd invalid for now.
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
                    delete_database22();
                    window.location.reload();
                    reject('There was a problem loading database. Reload please.');
                } else {
                    localStorage.setItem('checkedDB', true);
                }
            }

            resolve(db22);
        };

        request22.onupgradeneeded = async (event) => {
            const STORED_EXPIRY = localStorage.getItem('STORED_EXPIRY');
            localStorage.clear(); // Clear all cached queries.
            localStorage.setItem('STORED_EXPIRY', STORED_EXPIRY);
            checksumPromise = storeChecksum();
            localStorage.setItem('checkedDB', false);
            // Begin upgrade now.
            UPGRADE_NEEDED = true;
            console.log('Starting building of the 2022 database.');

            build_func(event, 'vwEntityCoordinates', ['id', 'EntityId']);
            build_func(event, 'vwEntityNeedsAsPctOfDemand', ['id', 'EntityId']);
            build_func(event, 'vwExistingWugSupply', ['id', 'EntityId', 'MapSourceId', 'WugCounty', 'WugRegion', 'WugType']);
            build_func(event, 'vwExistingWUGSupplyA1', ['id']);
            build_func(event, 'vwSelectEntitiesInCounty', ['id', 'EntityId']);
            build_func(event, 'vwSelectEntitiesInRegion', ['id', 'EntityId']);
            build_func(event, 'vwWugDemand', ['id', 'EntityId', 'WugCounty', 'WugRegion', 'WugType']);
            build_func(event, 'vwWugDemandsA1', ['id']);
            build_func(event, 'vwWugNeeds', ['id', 'EntityId', 'WugCounty', 'WugRegion', 'WugType']);
            build_func(event, 'vwWugNeedsA1', ['id']);
            build_func(event, 'vwWugPopulation', ['id', 'EntityId', 'WugCounty', 'WugRegion', 'WugType']);
            build_func(event, 'vwWugPopulationA1', ['id']);
            build_func(event, 'vwSelectRegionsInCounty', ['id', 'RegionLetter']);
            build_func(event, 'vwWMSWugSupply', [
                'id',
                'EntityId',
                'MapSourceId',
                'WugCounty',
                'WugRegion',
                'WmsType',
                'WugType',
                'WmsId',
                'WmsSponsorRegion'
            ]);
            build_func(event, 'vwWMSWugSupplyA1', ['id']);
            build_func(event, 'vwWMSProjects', ['id', 'WmsProjectId', 'WugRegion', 'WmsProjectSponsorRegion']);
            build_func(event, 'vwWMSProjectByCounty', ['id', 'WugCounty', 'WmsProjectId']);
            build_func(event, 'vwWMSProjectByEntity', ['id', 'EntityId', 'WmsProjectId']);
            build_func(event, 'vwWMSProjectBySource', ['id', 'MapSourceId', 'WmsProjectId']);
            build_func(event, 'vwWMSProjectByWMS', ['id', 'WmsId', 'WmsProjectId']);
            build_func(event, 'vwWMSProjectsByWMSType', ['id', 'WmsProjectId', 'WmsType']);
            build_func(event, 'vwWMSProjectByWUGType', ['id', 'WmsProjectId', 'WmsProjectSponsorRegion']);
            build_func(event, 'vwWMSProjectByEntityWUGSplit', ['id', 'WmsProjectId', 'WmsId']);
            build_func(event, 'vwWMSProjectEntityRelationships', ['id', 'WmsProjectId', 'EntityId', 'MapSourceId']);
        };
    });
}
