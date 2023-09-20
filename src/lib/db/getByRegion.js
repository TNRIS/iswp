// @ts-nocheck
import RegionalSummaryInd from "./regionalsummaryind.js";
export default class GetByRegion {
    constructor(region, where, db) {
        this.region = region;
        this.where = where;
        this.db = db;
    }

    #getAllTransaction = (key) => {
        return new Promise((resolve, reject) => {
            try {
                const transaction = this.db.transaction([key]);
                const objectStore = transaction.objectStore(key);
                objectStore.index("WugRegion").getAll(this.region).onsuccess = (
                    event
                ) => {
                    resolve(event.target.result);
                };
            } catch (err) {
                reject(err);
            }
        });
    };

    get = async () => {
        let projects_observable = this.#getAllTransaction("vwWMSProjects");
        let project = await projects_observable;

        let rs1 = new RegionalSummaryInd(this.region, "WugRegion", this.db);
        let value = await rs1.get();

        return {
            project: project,
            ...value,
        };
    };
}
