// @ts-nocheck
let db17;
let UPGRADE_NEEDED = false;

import { build_func } from "./db_helper.js";

export function startDb17() {
    return new Promise(async (resolve, reject) => {
        const request17 = window.indexedDB.open("iswpDB17", 141);
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

            build_func(event, "vw2017MapEntityCoordinates", ["EntityId"]);
            build_func(event, "vw2017MapEntityNeedsAsPctOfDemand", ["EntityId"]);
            build_func(event, "vw2017MapExistingWugSupply", [
                "EntityId",
                "MapSourceId",
                "WugCounty",
                "WugRegion",
            ]);
            build_func(event, "vw2017MapExistingWUGSupplyA1", []);
            build_func(event, "vw2017MapSelectEntitiesInCounty", ["EntityId"]);
            build_func(event, "vw2017MapSelectEntitiesInRegion", ["EntityId"]);
            build_func(event, "vw2017MapWugDemand", [
                "EntityId",
                "WugCounty",
                "WugRegion",
            ]);
            build_func(event, "vw2017MapWugDemandsA1", []);
            build_func(event, "vw2017MapWugNeeds", [
                "EntityId",
                "WugCounty",
                "WugRegion",
            ]);
            build_func(event, "vw2017MapWugNeedsA1", []);
            build_func(event, "vw2017MapWugPopulation", [
                "EntityId",
                "WugCounty",
                "WugRegion",
            ]);
            build_func(event, "vw2017MapWugPopulationA1", []);
            build_func(event, "vw2017MapSelectRegionsInCounty", ["RegionLetter"]);
            build_func(event, "vw2017MapWMSWugSupply", [
                "EntityId",
                "MapSourceId",
                "WugCounty",
                "WugRegion",
            ]);
            build_func(event, "vw2017MapWMSWugSupplyA1", []);
            build_func(event, "vw2017MapWMSProjects", ["WmsProjectId", "WugRegion"]);
            build_func(event, "vw2017MapWMSProjectByCounty", [
                "WugCounty",
                "WmsProjectId",
            ]);
            build_func(event, "vw2017MapWMSProjectByEntity", [
                "EntityId",
                "WmsProjectId",
            ]);
            build_func(event, "vw2017MapWMSProjectBySource", [
                "MapSourceId",
                "WmsProjectId",
            ]);
            build_func(event, "vw2017MapWMSProjectByWMS", ["WmsId", "WmsProjectId"]);
            build_func(event, "vw2017MapWMSProjectsByWMSType", ["WmsProjectId"]);
            build_func(event, "vw2017MapWMSProjectByWUGType", ["WmsProjectId"]);
            build_func(event, "vw2017MapWMSProjectByEntityWUGSplit", ["WmsProjectId"]);
            build_func(event, "vw2017MapWMSProjectEntityRelationships", [
                "WmsProjectId",
                "EntityId",
                "MapSourceId",
            ]);
        };
    });
}
