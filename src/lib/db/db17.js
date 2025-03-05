// @ts-nocheck
let db17;
let UPGRADE_NEEDED = false;

import { build_func } from './db_helper.js?v1';
let checksumPromise = async () => {
    /*placeholder*/
};
export const delete_database17 = () => {
    try {
        var del = window.indexedDB.deleteDatabase('iswpDB17');

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
    const checksum_url = 'https://tnris-droc.s3.amazonaws.com/iswp/2017/checksum.json';
    const response = await fetch(checksum_url);
    const cs = await response.json();
    localStorage.setItem('checksum2017', JSON.stringify(cs));
    //OK: Tested around 10 milliseconds cost in dev. Probably faster on a normal web server Rather than dev. Only ran on upgrade needed.
    console.log(`Checksum parse time: ${Date.now() - start}ms.`);
};

export function startDb17() {
    return new Promise(async (resolve, reject) => {
        const request17 = window.indexedDB.open('iswpDB17', 144);

        request17.onerror = (event) => {
            reject(event);
        };
        request17.onsuccess = async (event) => {
            db17 = event.target.result;
            if (UPGRADE_NEEDED) {
                const BASE_URL = 'https://tnris-droc.s3.amazonaws.com/iswp/';
                const cache_2017 = '2017/cache.json';

                let gz17 = await fetch(BASE_URL + cache_2017, {
                    decompress: true
                });
                let j17 = await gz17.json();

                let object_stores = Array.from(db17.objectStoreNames);
                for (let id in object_stores) {
                    let oname = object_stores[id];
                    let store = db17.transaction(oname, 'readwrite').objectStore(oname);
                    j17[oname].forEach((vwc) => {
                        store.add(vwc);
                    });
                }
            }

            // Check we set entityCoordinates up and redownload if needed.
            if (localStorage.getItem('entitySuccess') !== 'true') {
                const transaction = db17.transaction(['vw2017MapEntityCoordinates']);
                const objectStore = transaction.objectStore('vw2017MapEntityCoordinates');
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
            //May change to check localStorage.getItem("checkedDB") !== "true" but need to test
            if (true) {
                await checksumPromise;
                const start = Date.now();
                let checksum = localStorage.getItem('checksum2017');
                if (checksum && checksum.length) {
                    checksum = JSON.parse(checksum);
                } else {
                    storeChecksum();
                }
                //OK: So fast not even 1ms Load time here. It measures 0ms!
                console.log(`get checksum from localstorage time: ${Date.now() - start}ms.`);

                if (db17.objectStoreNames.length !== Object.keys(checksum).length) {
                    request17.result.close();
                    delete_database17();
                    reject('There was a problem loading database. Reload please.');
                    window.location.reload();
                }

                let j = 0;
                Object.values(db17.objectStoreNames).forEach((item, i) => {
                    const transaction = db17.transaction([item], 'readonly');
                    const objectStore = transaction.objectStore(item);
                    const countRequest = objectStore.count();

                    let error = false;
                    countRequest.onsuccess = async (event) => {
                        let recordcount = event.currentTarget.result;
                        let record = event.currentTarget.source.name;

                        if (recordcount !== checksum[record]) {
                            request17.result.close();
                            delete_database17();
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

            resolve(db17);
        };

        request17.onupgradeneeded = async (event) => {
            localStorage.clear(); // Clear all cached queries.
            checksumPromise = storeChecksum();
            localStorage.setItem('checkedDB', false);
            // Begin upgrade now.

            UPGRADE_NEEDED = true;
            console.log('Starting building of the 2017 database.');

            build_func(event, 'vw2017MapEntityCoordinates', ['id', 'EntityId']);
            build_func(event, 'vw2017MapEntityNeedsAsPctOfDemand', ['id', 'EntityId']);
            build_func(event, 'vw2017MapExistingWugSupply', ['id', 'EntityId', 'MapSourceId', 'WugCounty', 'WugRegion', 'WugType']);
            build_func(event, 'vw2017MapExistingWUGSupplyA1', ['id']);
            build_func(event, 'vw2017MapSelectEntitiesInCounty', ['id', 'EntityId']);
            build_func(event, 'vw2017MapSelectEntitiesInRegion', ['id', 'EntityId']);
            build_func(event, 'vw2017MapWugDemand', ['id', 'EntityId', 'WugCounty', 'WugRegion', 'WugType']);
            build_func(event, 'vw2017MapWugDemandsA1', ['id']);
            build_func(event, 'vw2017MapWugNeeds', ['id', 'EntityId', 'WugCounty', 'WugRegion', 'WugType']);
            build_func(event, 'vw2017MapWugNeedsA1', ['id']);
            build_func(event, 'vw2017MapWugPopulation', ['id', 'EntityId', 'WugCounty', 'WugRegion', 'WugType']);
            build_func(event, 'vw2017MapWugPopulationA1', ['id']);
            build_func(event, 'vw2017MapSelectRegionsInCounty', ['id', 'RegionLetter']);
            build_func(event, 'vw2017MapWMSWugSupply', [
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
            build_func(event, 'vw2017MapWMSWugSupplyA1', ['id']);
            build_func(event, 'vw2017MapWMSProjects', ['id', 'WmsProjectId', 'WugRegion', 'WmsProjectSponsorRegion']);
            build_func(event, 'vw2017MapWMSProjectByCounty', ['id', 'WugCounty', 'WmsProjectId']);
            build_func(event, 'vw2017MapWMSProjectByEntity', ['id', 'EntityId', 'WmsProjectId']);
            build_func(event, 'vw2017MapWMSProjectBySource', ['id', 'MapSourceId', 'WmsProjectId']);
            build_func(event, 'vw2017MapWMSProjectByWMS', ['id', 'WmsId', 'WmsProjectId']);
            build_func(event, 'vw2017MapWMSProjectsByWMSType', ['id', 'WmsProjectId', 'WmsType']);
            build_func(event, 'vw2017MapWMSProjectByWUGType', ['id', 'WmsProjectId', 'WmsProjectSponsorRegion']);
            build_func(event, 'vw2017MapWMSProjectByEntityWUGSplit', ['id', 'WmsProjectId', 'WmsId']);
            build_func(event, 'vw2017MapWMSProjectEntityRelationships', ['id', 'WmsProjectId', 'EntityId', 'MapSourceId']);
        };
    });
}
