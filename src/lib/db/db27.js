// @ts-nocheck
let db27;
let UPGRADE_NEEDED = false;

import { build_func } from "./db_helper.js";
let checksumPromise = async () => {/*placeholder*/};

export const delete_database27 = () => {
    try {
        var del = window.indexedDB.deleteDatabase("iswpDB27")

        del.onsuccess = () => {
            console.log("Database has been deleted.");
        }
    
        del.onerror = () => {
            console.log("Couldn't delete database.");
        }
    
        del.onblocked = () => {
            console.log("Couldn't delete database due to the operation being blocked");
        }
    } catch (err) {
        console.log(`error deleting database: ${err}`);
    }

}

const storeChecksum = async () => {
    // Store checksum in localstorage
    const start = Date.now();
    const checksum_url = "https://tnris-droc.s3.amazonaws.com/iswp/2027/checksum.json";
    const response = await fetch(checksum_url);
    const cs = await response.json();
    localStorage.setItem("checksum2027", JSON.stringify(cs));
    //OK: Tested around 10 milliseconds cost in dev. Probably faster on a normal web server Rather than dev. Only ran on upgrade needed.
    console.log(`Checksum parse time: ${Date.now() - start}ms.`)
}

export function startDb27() {
    return new Promise(async (resolve, reject) => {
        const request27 = window.indexedDB.open("iswpdb27", 3);



        request27.onerror = (event) => {
            reject(event);
        };

        request27.onsuccess = async (event) => {
            db27 = event.target.result;
            if (UPGRADE_NEEDED) {
                const BASE_URL = "https://tnris-droc.s3.amazonaws.com/iswp/";
                const cache_2027 = "2027/cache.json";

                let gz27 = await fetch(BASE_URL + cache_2027, {
                    decompress: true,
                });
                let j27 = await gz27.json();

                let object_stores = Array.from(db27.objectStoreNames);
                for (let id in object_stores) {
                    let oname = object_stores[id];
                    let store = db27
                        .transaction(oname, "readwrite")
                        .objectStore(oname);
                    j27[oname].forEach((vwc) => {
                        store.add(vwc);
                    });
                }
            }
        // Check we set entityCoordinates up and redownload if needed.
        if(localStorage.getItem("entitySuccess") !== "true") {
            const transaction = db27.transaction(['vwEntityCoordinates']);
            const objectStore = transaction.objectStore('vwEntityCoordinates');
            const entityCoordinates = objectStore.getAll();

            entityCoordinates.onsuccess = (event) => {
                // Do something with the request.result!
                localStorage.setItem("entityCoordinates", JSON.stringify(event.target.result));

                // Practical check to make sure this has at least 1000 entities.
                if(event.target.result.length > 1000)
                    localStorage.setItem("entitySuccess", "true");
            };
            entityCoordinates.onerror = (event) => {
                localStorage.setItem("entitySuccess", "false");
                console.log("error making entitycache")
            }
        }
            


            // Check databases before resolving
            // Not very efficient so only do once per database refresh
            if(localStorage.getItem("checkedDB27") !== "true") {
                await checksumPromise;
                const start = Date.now();
                let checksum = localStorage.getItem("checksum2027");
                if(checksum && checksum.length) {
                    checksum = JSON.parse(checksum);
                }
                //OK: So fast not even 1ms Load time here. It measures 0ms!
                console.log(`get checksum from localstorage time: ${Date.now() - start}ms.`)
                
                if(db27.objectStoreNames.length !== Object.keys(checksum).length) {
                    request27.result.close();
                    delete_database27();
                    reject("There was a problem loading database. Reload please.");
                    window.location.reload();
                }
    
                Object.values(db27.objectStoreNames).forEach((item, i) => {
                    const transaction = db27.transaction([item], "readonly");
                    const objectStore = transaction.objectStore(item);
                    const myIndex = objectStore.index("id");
                    const countRequest = myIndex.count();
    
                    let j = 0;
                    let error = false;
                    countRequest.onsuccess = async (event) => {
    
                        let recordcount = event.currentTarget.result;
                        let record = event.currentTarget.source.objectStore.name;
    
                        if(recordcount !== checksum[record]) {
                            request27.result.close();
                            delete_database27();
                            reject("There was a problem loading database. Reload please.");
                            window.location.reload();         
                        }
                        j++;
    
                        if(j == Object.keys(checksum).length - 1) {
                            localStorage.setItem("checkedDB27", true);
                        }
                    }
    
                })
            }

            resolve(db27);
        };

        request27.onupgradeneeded = async (event) => {
            localStorage.clear(); // Clear all cached queries.
            checksumPromise = storeChecksum();
            localStorage.setItem("checkedDB27", false);
            // Begin upgrade now.

            UPGRADE_NEEDED = true;
            console.log("Starting building of the 2027 database.");

            build_func(event, "vwEntityCoordinates", ["id", "EntityId"]);
            build_func(event, "vwEntityNeedsAsPctOfDemand", ["id", "EntityId"]);
            build_func(event, "vwExistingWugSupply", [
                "EntityId",
                "MapSourceId",
                "WugCounty",
                "WugRegion",
                "WugType"
            ]);
            build_func(event, "vwExistingWUGSupplyA1", []);
            build_func(event, "vwSelectEntitiesInCounty", ["EntityId"]);
            build_func(event, "vwSelectEntitiesInRegion", ["EntityId"]);
            build_func(event, "vwWugDemand", [
                "EntityId",
                "WugCounty",
                "WugRegion",
                "WugType"
            ]);
            build_func(event, "vwWugDemandsA1", []);
            build_func(event, "vwWugNeeds", [
                "EntityId",
                "WugCounty",
                "WugRegion",
                "WugType"
            ]);
            build_func(event, "vwWugNeedsA1", []);
            build_func(event, "vwWugPopulation", [
                "EntityId",
                "WugCounty",
                "WugRegion",
                "WugType"
            ]);
            build_func(event, "vwWugPopulationA1", []);
            build_func(event, "vwSelectRegionsInCounty", ["RegionLetter"]);
            build_func(event, "vwWMSWugSupply", [
                "EntityId",
                "MapSourceId",
                "WugCounty",
                "WugRegion",
                "WmsType",
                "WugType",
                "WmsId",
                "WmsSponsorRegion"
            ]);
            build_func(event, "vwWMSWugSupplyA1", []);
            build_func(event, "vwWMSProjects", ["WmsProjectId", "WugRegion", "WmsProjectSponsorRegion"]);
            build_func(event, "vwWMSProjectByCounty", [
                "WugCounty",
                "WmsProjectId",
            ]);
            build_func(event, "vwWMSProjectByEntity", [
                "EntityId",
                "WmsProjectId",
            ]);
            build_func(event, "vwWMSProjectBySource", [
                "MapSourceId",
                "WmsProjectId",
            ]);
            build_func(event, "vwWMSProjectByWMS", ["WmsId", "WmsProjectId"]);
            build_func(event, "vwWMSProjectsByWMSType", ["WmsProjectId", "WmsType"]);
            build_func(event, "vwWMSProjectByWUGType", ["WmsProjectId", "WmsProjectSponsorRegion"]);
            build_func(event, "vwWMSProjectByEntityWUGSplit", ["WmsProjectId", "WmsId"]);
            build_func(event, "vwWMSProjectEntityRelationships", [
                "WmsProjectId",
                "EntityId",
                "MapSourceId",
            ]);
        };
    });
}
