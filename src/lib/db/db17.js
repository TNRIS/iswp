// @ts-nocheck
let db17;
let UPGRADE_NEEDED = false;

import { build_func } from "./db_helper.js";

export function startDb17() {
    return new Promise(async (resolve, reject) => {
        const request17 = window.indexedDB.open("iswpDB17", 140);
        request17.onerror = (event) => {
            reject(event);
        };
        request17.onsuccess = async (event) => {
            db17 = event.target.result;
            if (UPGRADE_NEEDED) {
                const BASE_URL = "https://tnris-droc.s3.amazonaws.com/iswp/";
                const cache_2017 = "2017/cache.json";

                let gz17 = await fetch(BASE_URL + cache_2017, {
                    decompress: true,
                });
                let j17 = await gz17.json();

                let object_stores = Array.from(db17.objectStoreNames);
                for (let id in object_stores) {
                    let oname = object_stores[id];
                    let store = db17
                        .transaction(oname, "readwrite")
                        .objectStore(oname);
                    j17[oname].forEach((vwc) => {
                        store.add(vwc);
                    });
                }
            }
            resolve(db17);
        };

        request17.onupgradeneeded = async (event) => {
            UPGRADE_NEEDED = true;
            console.log("Starting building of the 2017 database.");

            build_func(event, "vwEntityCoordinates", ["EntityId"]);
            build_func(event, "vwEntityNeedsAsPctOfDemand", ["EntityId"]);
            build_func(event, "vwExistingWugSupply", [
                "EntityId",
                "MapSourceId",
                "WugCounty",
                "WugRegion",
            ]);
            build_func(event, "vwExistingWUGSupplyA1", []);
            build_func(event, "vwSelectEntitiesInCounty", ["EntityId"]);
            build_func(event, "vwSelectEntitiesInRegion", ["EntityId"]);
            build_func(event, "vwWugDemand", [
                "EntityId",
                "WugCounty",
                "WugRegion",
            ]);
            build_func(event, "vwWugDemandsA1", []);
            build_func(event, "vwWugNeeds", [
                "EntityId",
                "WugCounty",
                "WugRegion",
            ]);
            build_func(event, "vwWugNeedsA1", []);
            build_func(event, "vwWugPopulation", [
                "EntityId",
                "WugCounty",
                "WugRegion",
            ]);
            build_func(event, "vwWugPopulationA1", []);
            build_func(event, "vwSelectRegionsInCounty", []);
            build_func(event, "vwWMSWugSupply", [
                "EntityId",
                "MapSourceId",
                "WugCounty",
                "WugRegion",
            ]);
            build_func(event, "vwWMSWugSupplyA1", []);
            build_func(event, "vwWMSProjects", ["WmsProjectId", "WugRegion"]);
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
            build_func(event, "vwWMSProjectsByWMSType", ["WmsProjectId"]);
            build_func(event, "vwWMSProjectByWUGType", ["WmsProjectId"]);
            build_func(event, "vwWMSProjectByEntityWUGSplit", ["WmsProjectId"]);
            build_func(event, "vwWMSProjectEntityRelationships", [
                "WmsProjectId",
                "EntityId",
                "MapSourceId",
            ]);
        };
    });
}
