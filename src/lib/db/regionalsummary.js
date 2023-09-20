// @ts-nocheck
/**
 * @typedef A1
 * @property {String} DECADE The decade this record is for.
 * @property {Number} IRRIGATION User group irrigation (Context determined by parent)
 * @property {Number} LIVESTOCK User group livestock (Context determined by parent)
 * @property {Number} MANUFACTURING User group manufacturing (Context determined by parent)
 * @property {Number} MINING User group mining (Context determined by parent)
 * @property {Number} MUNICIPAL User group municipal (Context determined by parent)
 * @property {String} REGION User group region (Context determined by parent)
 * @property {Number} STEAM_ELECTRIC_POWER User group steam electric power (Context determined by parent)
 * @property {Number} TOTAL User group total (Context determined by parent)
 */

export default class RegionalSummary {
    constructor(db) {
        this.db = db;
    }

    #regionalsummary;
    #summaryTables = {
        demands: "vwWugDemandsA1",
        needs: "vwWugNeedsA1",
        supplies: "vwExistingWUGSupplyA1",
        population: "vwWugPopulationA1",
        strategies: "vwWMSWugSupplyA1",
    };

    #getAllTransaction = (key) => {
        return new Promise((resolve, reject) => {
            try {
                const transaction = this.db.transaction([key]);
                const objectStore = transaction.objectStore(key);
                const rdemands = objectStore.getAll();
                rdemands.onsuccess = (event) => {
                    // Do something with the request.result!
                    resolve(event.target.result);
                };
            } catch (err) {
                reject(err);
            }
        });
    };

    #decade_reducer = (result) => {
        return result.reduce(function (
            /** @type {any} */ r,
            /** @type {A1} */ a
        ) {
            r[a.DECADE] = r[a.DECADE] || [];
            r[a.DECADE].push(a);
            return r;
        },
        Object.create(null));
    };

    get = async () => {
        if (this.#regionalsummary) {
            return this.#regionalsummary;
        }
        if (!this.db) {
            console.err("db is not defined yet.");
        }

        try {
            let demands_observable = this.#getAllTransaction(
                this.#summaryTables.demands
            );
            let needs_observable = this.#getAllTransaction(
                this.#summaryTables.needs
            );
            let supplies_observable = this.#getAllTransaction(
                this.#summaryTables.supplies
            );
            let population_observable = this.#getAllTransaction(
                this.#summaryTables.population
            );
            let strategies_observable = this.#getAllTransaction(
                this.#summaryTables.strategies
            );

            /**
             * @param {any} result
             * @returns {A1} r - Result is now sorted into decades.
             */

            let [demands, needs, supplies, population, strategies] =
                await Promise.all([
                    demands_observable,
                    needs_observable,
                    supplies_observable,
                    population_observable,
                    strategies_observable,
                ]);

            this.#regionalsummary = {
                demands: this.#decade_reducer(demands),
                needs: this.#decade_reducer(needs),
                population: this.#decade_reducer(population),
                strategies: this.#decade_reducer(strategies),
                supplies: this.#decade_reducer(supplies),
            };

            return this.#regionalsummary;
        } catch (err) {
            console.log(err);
        }
    };
}
