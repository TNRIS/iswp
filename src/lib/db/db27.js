// @ts-nocheck
let db27;
let UPGRADE_NEEDED = false;

import { build_func } from "./db_helper.js";

export function startDb27() {
    return new Promise(async (resolve, reject) => {
        const request27 = window.indexedDB.open("iswpdb27", 2);

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
            resolve(db27);
        };

        request27.onupgradeneeded = async (event) => {
            UPGRADE_NEEDED = true;
            console.log("Starting building of the 2027 database.");

            build_func(event, "vwEntityCoordinates", ["EntityId"]);
            build_func(event, "vwEntityNeedsAsPctOfDemand", ["EntityId"]);
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
                "WmsId"
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
