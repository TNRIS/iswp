// @ts-nocheck
let db22;
let UPGRADE_NEEDED = false;

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
    const start = Date.now();
    const checksum_url = 'https://tnris-droc.s3.amazonaws.com/iswp/2022/checksum.json';
    const response = await fetch(checksum_url);
    const cs = await response.json();
    localStorage.setItem('checksum2022', JSON.stringify(cs));
    //OK: Tested around 10 milliseconds cost in dev. Probably faster on a normal web server Rather than dev. Only ran on upgrade needed.
    console.log(`Checksum parse time: ${Date.now() - start}ms.`);
};

export function startDb22() {
    return new Promise(async (resolve, reject) => {
        const request22 = window.indexedDB.open('iswpDB22', 199);

        request22.onerror = (event) => {
            reject(event);
        };

        request22.onsuccess = async (event) => {
            db22 = event.target.result;
            if (UPGRADE_NEEDED) {
                const BASE_URL = 'https://tnris-droc.s3.amazonaws.com/iswp/';
                const cache_2022 = '2022/cache.json';
                let start = Date.now();
                let gz22 = await fetch(BASE_URL + cache_2022, {
                    decompress: true
                });

                console.log(`Time step 1: ${Date.now() - start}`);
                let j22 = await gz22.json();

                let object_stores = Array.from(db22.objectStoreNames);
                console.log(`Time step 2: ${Date.now() - start}`);

                for (let id in object_stores) {
                    let oname = object_stores[id];
                    let store = db22.transaction(oname, 'readwrite').objectStore(oname);

                    j22[oname].forEach((vwc) => {
                        store.add(vwc);
                    });
                }
                console.log(`Time step 3: ${Date.now() - start}`);
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

            //Change to this eventually. But later localStorage.getItem("checkedDB") !== "true"
            if (true) {
                await checksumPromise;
                const start = Date.now();
                let checksum = localStorage.getItem('checksum2022');
                if (checksum && checksum.length) {
                    checksum = JSON.parse(checksum);
                } else {
                    storeChecksum();
                }
                //OK: So fast not even 1ms Load time here. It measures 0ms!
                console.log(`get checksum from localstorage time: ${Date.now() - start}ms.`);

                if (db22.objectStoreNames.length !== Object.keys(checksum).length) {
                    request22.result.close();
                    delete_database22();
                    reject('There was a problem loading database. Reload please.');

                    //TODO Limit this to 5 tries
                    window.location.reload();
                }
                let j = 0;

                Object.values(db22.objectStoreNames).forEach((item, i) => {
                    const transaction = db22.transaction([item], 'readonly');
                    const objectStore = transaction.objectStore(item);
                    const countRequest = objectStore.count();

                    let error = false;
                    countRequest.onsuccess = async (event) => {
                        let recordcount = event.currentTarget.result;
                        let record = event.currentTarget.source.name;
                        if (recordcount !== checksum[record]) {
                            request22.result.close();
                            delete_database22();
                            window.location.reload();
                            reject('There was a problem loading database. Reload please.');
                        }
                        j++;

                        if (j == Object.keys(checksum).length - 1) {
                            localStorage.setItem('checkedDB', true);
                        }
                    };
                });
            }

            resolve(db22);
        };

        request22.onupgradeneeded = async (event) => {
            localStorage.clear(); // Clear all cached queries.
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
