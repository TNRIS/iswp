// @ts-nocheck
/** Class for statewide indexeddb queries. */

import { Constant2022 } from "/src/lib/Constant2022.js";
let wugRegionFilter = undefined;

export default class Statewide {
    constructor(db) {
        const c22 = new Constant2022();
        this.constants = c22; 
        this.db = db;
        this.decades = this.constants.getDecades();
    }

    /**
     * Create a Statewide.
     */
    #DATA_TABLES = {
        demands: "vwWugDemand",
        needs: "vwWugNeeds",
        supplies: "vwExistingWugSupply",
        population: "vwWugPopulation",
        strategies: "vwWMSWugSupply",
    };

    #PROJECT_TABLES = {
        region: 'vwWMSProjects',
        county: 'vwWMSProjectByCounty',
        entity: 'vwWMSProjectByEntity',
        source: 'vwWMSProjectBySource',
        wmstype: 'vwWMSProjectsByWmsType'
        // project: 'vwWMSProjectByWMS'//Not included as project information in project view is pulled from the vwWMSProjectByEntityWUGSplit table
        //usagetype: vwWMSProjectByWUGType //Not included because results are too large
    };

    // for each type, for each decade, add the records decade total for that type to the storage decade total for that type.
    #pattern = (ident, a, b, id, totalIdent, type) => {
        for(let decade of this.decades) {
            try {
                a[totalIdent][ident][decade] = b[type] == ident
                ? a[totalIdent][ident][decade] + b[id + decade]
                : a[totalIdent][ident][decade];
            } catch(err) {
                console.log(`error ${err}`);
            }
        }

        return a;
    }
    // Warning: This function is reused in regionalsummaryind.js
    statewide_reducer = async (result, id) => {
        let that = this;
        //console.log("starting reduce");
        //console.log(JSON.stringify("result" + result));
        let reduced = await result.reduce(function (a, b) {
            try { 
                if (Object.keys(a).length === 0) {
                    let init = {};
                                    
                    init[that.decades[0]] = 0;
                    init[that.decades[1]] = 0;
                    init[that.decades[2]] = 0;
                    init[that.decades[3]] = 0;
                    init[that.decades[4]] = 0;
                    init[that.decades[5]] = 0;
    
                    //console.log("init: " + JSON.stringify(init));
                    a = {
                        rows: [],
                        typeTotals: {
                            IRRIGATION: {
                                ...init
                            },
                            LIVESTOCK: {
                                ...init
                            },
                            MANUFACTURING: {
                                ...init
                            },
                            MINING: {
                                ...init
                            },
                            MUNICIPAL: {
                                ...init
                            },
                            "STEAM ELECTRIC POWER": {
                                ...init
                            },
                        },
                        decadeTotals: {
                            ...init
                        },
                    };
                    //console.log( "a.decadeTotals " + JSON.stringify(a.decadeTotals ));
    
                    // Special strat supplies object
                    if (id == "SS") {
                        (a["strategySourceTotals"] = {
                            "DEMAND REDUCTION": {
                                ...init
                            },
                            GROUNDWATER: {
                                ...init
                            },
                            REUSE: {
                                ...init
                            },
                            SEAWATER: {
                                ...init
                            },
                            "SURFACE WATER": {
                                ...init
                            },
                        });

                        a["strategyTypeTotals"] = {};
                        for(let type of that.constants.WMS_TYPES) {
                            a["strategyTypeTotals"][type] = {...init}
                        }
                    }
                }
    
                a = that.#pattern("IRRIGATION", a, b, id, "typeTotals", "WugType");
                a = that.#pattern("LIVESTOCK", a, b, id, "typeTotals", "WugType");
                a = that.#pattern("MANUFACTURING", a, b, id, "typeTotals", "WugType");
                a = that.#pattern("MINING", a, b, id, "typeTotals", "WugType");
                a = that.#pattern("MUNICIPAL", a, b, id, "typeTotals", "WugType");
                a = that.#pattern("STEAM ELECTRIC POWER", a, b, id, "typeTotals", "WugType");

                if (id == "SS") {
                    a = that.#pattern("DEMAND REDUCTION", a, b, id, "strategySourceTotals", "WugType");
                    a = that.#pattern("GROUNDWATER", a, b, id, "strategySourceTotals", "WugType");
                    a = that.#pattern("REUSE", a, b, id, "strategySourceTotals", "WugType");
                    a = that.#pattern("SEAWATER", a, b, id, "strategySourceTotals", "WugType");
                    a = that.#pattern("SURFACE WATER", a, b, id, "strategySourceTotals", "WugType");

                    for(let type of that.constants.WMS_TYPES) {
                        a = that.#pattern(type, a, b, id, "strategyTypeTotals", "WmsType");
                    }
                }
                
                // Add records decade total to storage decade total for each decade.
                a.decadeTotals[that.decades[0]] = a.decadeTotals[that.decades[0]] + b[id + that.decades[0]];
                a.decadeTotals[that.decades[1]] = a.decadeTotals[that.decades[1]] + b[id + that.decades[1]];
                a.decadeTotals[that.decades[2]] = a.decadeTotals[that.decades[2]] + b[id + that.decades[2]];
                a.decadeTotals[that.decades[3]] = a.decadeTotals[that.decades[3]] + b[id + that.decades[3]];
                a.decadeTotals[that.decades[4]] = a.decadeTotals[that.decades[4]] + b[id + that.decades[4]];
                a.decadeTotals[that.decades[5]] = a.decadeTotals[that.decades[5]] + b[id + that.decades[5]];
    
                return a;
            } catch(err) {
                console.log("reducer err: " + err);
            }

        }, Object.create(null));
        //console.log("reduced: " + JSON.stringify(reduced))
        return reduced;
    };

    #getAllTransaction = (key) => {
        return new Promise((resolve, reject) => {
            try {
                //console.log("getAllTransaction for " + key);
                const transaction = this.db.transaction([key]);
                const objectStore = transaction.objectStore(key);
                const rdemands = objectStore.index('WugRegion').getAll(wugRegionFilter);
                rdemands.onsuccess = (event) => {
                    // Do something with the request.result!
                    resolve(event.target.result);
                };
            } catch (err) {
                reject(err);
            }
        });
    };

    get = async (wfilter=undefined) => {
        if(wfilter) {
            wugRegionFilter = wfilter.replace(/[^a-zA-Z ]/g, "");
        }

        let demands_observable = this.#getAllTransaction(
            this.#DATA_TABLES.demands
        );
        let needs_observable = this.#getAllTransaction(this.#DATA_TABLES.needs);
        let supplies_observable = this.#getAllTransaction(
            this.#DATA_TABLES.supplies
        );
        let population_observable = this.#getAllTransaction(
            this.#DATA_TABLES.population
        );
        let strategies_observable = this.#getAllTransaction(
            this.#DATA_TABLES.strategies
        );

        let [demands, needs, supplies, population, strategies] =
            await Promise.all([
                demands_observable,
                needs_observable,
                supplies_observable,
                population_observable,
                strategies_observable,
            ]);

        demands = await this.statewide_reducer(demands, "D");
        needs = await this.statewide_reducer(needs, "N");
        supplies = await this.statewide_reducer(supplies, "WS");
        population = await this.statewide_reducer(population, "P");
        strategies = await this.statewide_reducer(strategies, "SS");

        let c = {
            demands: demands,
            needs: needs,
            population: population,
            strategies: strategies,
            supplies: supplies,
        };

        return c;
    };
}