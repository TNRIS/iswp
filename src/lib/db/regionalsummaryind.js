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

import { Constant2017 } from '$lib/Constant2017.js';
import { Constant2022 } from '$lib/Constant2022.js';
import { Constant2027 } from '$lib/Constant2027.js';
export default class RegionalSummaryInd {
    host = window.location.hostname;
    constructor(wkey, where, db) {
        this.wkey = wkey;
        this.where = where;
        this.db = db;

        if (this.host.includes(2027)) {
            this.constants = new Constant2027();
        } else if (this.host.includes(year == 2022)) {
            this.constants = new Constant2022();
        } else if (this.host.includes(year == 2017)) {
            this.constants = new Constant2017();
        } else {
            this.constants = new Constant2022();
        }

        this.#summaryTables = {
            demands: `${this.constants.tappend}WugDemand`,
            needs: `${this.constants.tappend}WugNeeds`,
            supplies: `${this.constants.tappend}ExistingWugSupply`,
            population: `${this.constants.tappend}WugPopulation`,
            strategies: `${this.constants.tappend}WMSWugSupply`
        };
    }

    #getAllTransaction = (key) => {
        return new Promise(async (resolve, reject) => {
            try {
                this.db = await this.db;
                const transaction = this.db.transaction([key]);
                const objectStore = transaction.objectStore(key);
                objectStore.index(this.where).getAll(this.wkey).onsuccess = (
                    event
                ) => {
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
        }, Object.create(null));
    };
    get = async () => {
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

        let [demands, needs, supplies, population, strategies] =
            await Promise.all([
                demands_observable,
                needs_observable,
                supplies_observable,
                population_observable,
                strategies_observable
            ]);

        let item = {
            demands: this.#decade_reducer(demands),
            needs: this.#decade_reducer(needs),
            population: this.#decade_reducer(population),
            strategies: this.#decade_reducer(strategies),
            supplies: this.#decade_reducer(supplies)
        };
        let demands1 = sw.statewide_reducer(demands, 'D');
        let needs1 = sw.statewide_reducer(needs, 'N');
        let supplies1 = sw.statewide_reducer(supplies, 'WS');
        let population1 = sw.statewide_reducer(population, 'P');
        let strategies1 = sw.statewide_reducer(strategies, 'SS');

        return {
            demands: {
                ...item.demands,
                ...demands1
            },
            needs: {
                ...item.needs,
                ...needs1
            },
            supplies: {
                ...item.supplies,
                ...supplies1
            },
            population: {
                ...item.population,
                ...population1
            },
            strategies: {
                ...item.strategies,
                ...strategies1
            }
        };
    };
}
