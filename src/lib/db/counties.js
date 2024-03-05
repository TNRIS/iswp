// @ts-nocheck
/** Class for statewide indexeddb queries. */

import { Constant2017 } from "$lib/Constant2017.js";
import { Constant2022 } from "$lib/Constant2022.js";
import { Constant2027 } from "$lib/Constant2027.js";

export default class Counties {
    host = window.location.hostname;

    constructor(db) {
        if(this.host.includes(2027)) {
            this.constants = new Constant2027();
        } else if (this.host.includes(2022)) {
            this.constants = new Constant2022();
        } else if (this.host.includes(2017)) {
            this.constants = new Constant2017();
        } else {
            this.constants = new Constant2022();
        }

        this.db = db;
        this.decades = this.constants.getDecades();
        this.usage_types = this.constants.getUsageTypes();
    }

    #getAllTransaction = (key, where, project_filter) => {
        return new Promise(async (resolve, reject) => {
            try {
                if(key == `${this.constants.tappend}WMSProjectsByWmsType`) {
                    // Temporary workaround until I find out why these are cased differently.
                    key = `${this.constants.tappend}WMSProjectsByWMSType`
                }
                const transaction = this.db.transaction([key]);
                const objectStore = transaction.objectStore(key);
                let rdemands;
                if(where) {
                    rdemands = objectStore.index(where).getAll(project_filter);
                }
                else {
                    rdemands = objectStore.getAll(project_filter);

                }
                rdemands.onsuccess = (event) => {
                    // Do something with the request.result!
                    resolve(event.target.result);
                };
                rdemands.onerror = (event) => {
                    reject(event);
                }
            } catch (err) {
                console.error(`error in getAllTransaction: key ${key}, where ${where}, project_filter ${project_filter}`)
                reject(err);
            }
        });
    };

    get = async (setting) => {
        let a = this.#getAllTransaction(`${this.constants.tappend}SelectRegionsInCounty`, "RegionLetter", `${setting} `);

        return a;
    };
}