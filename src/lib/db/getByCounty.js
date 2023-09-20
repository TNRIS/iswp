// @ts-nocheck
class GetByCounty {
    constructor(county) {
        this.county = county;
    }

    #getAllTransaction = (key) => {
        return new Promise((resolve, reject) => {
            try {
                const transaction = db.transaction([key]);
                const objectStore = transaction.objectStore(key);
                objectStore.index("WugCounty").getAll(this.county).onsuccess = (
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
        let projects_observable = this.#getAllTransaction(
            "vwWMSProjectByCounty"
        );
        let project = await projects_observable;

        let rs1 = new RegionalSummary(this.county);
        let value = await rs1.get();

        return {
            project: project,
            ...value,
        };
    };
}
