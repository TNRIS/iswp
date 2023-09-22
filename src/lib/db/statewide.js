// @ts-nocheck
/** Class for statewide indexeddb queries. */

import { Constant2022 } from "../Constant2022.js";


export default class Statewide {
    constructor(db) {
        const c22 = new Constant2022();
        let constants = c22;
        this.db = db;
        this.decades = constants.getDecades();
        //console.log("this.decades: " + this.decades[0])
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

    // for each type, for each decade, add the records decade total for that type to the storage decade total for that type.
    #buildTypeTotals = (ident, a, b, id) => {
        a.typeTotals[ident][this.decades[0]] =
            b.WugType == ident
                ? a.typeTotals[ident][this.decades[0]] + b[id + this.decades[0]]
                : a.typeTotals[ident][this.decades[0]];
        a.typeTotals[ident][this.decades[1]] =
            b.WugType == ident
                ? a.typeTotals[ident][this.decades[1]] + b[id + this.decades[1]]
                : a.typeTotals[ident][this.decades[1]];
        a.typeTotals[ident][this.decades[2]] =
            b.WugType == ident
                ? a.typeTotals[ident][this.decades[2]] + b[id + this.decades[2]]
                : a.typeTotals[ident][this.decades[2]];
        a.typeTotals[ident][this.decades[3]] =
            b.WugType == ident
                ? a.typeTotals[ident][this.decades[3]] + b[id + this.decades[3]]
                : a.typeTotals[ident][this.decades[3]];
        a.typeTotals[ident][this.decades[4]] =
            b.WugType == ident
                ? a.typeTotals[ident][this.decades[4]] + b[id + this.decades[4]]
                : a.typeTotals[ident][this.decades[4]];
        a.typeTotals[ident][this.decades[5]] =
            b.WugType == ident
                ? a.typeTotals[ident][this.decades[5]] + b[id + this.decades[5]]
                : a.typeTotals[ident][this.decades[5]];

        return a;
    };

    #buildStratTotals = (ident, a, b, id) => {
        a.strategySourceTotals[ident][this.decades[0]] =
            b.WugType == ident
                ? a.strategySourceTotals[ident][this.decades[0]] + b[id + this.decades[0]]
                : a.strategySourceTotals[ident][this.decades[0]];
        a.strategySourceTotals[ident][this.decades[1]] =
            b.WugType == ident
                ? a.strategySourceTotals[ident][this.decades[1]] + b[id + this.decades[1]]
                : a.strategySourceTotals[ident][this.decades[1]];
        a.strategySourceTotals[ident][this.decades[2]] =
            b.WugType == ident
                ? a.strategySourceTotals[ident][this.decades[2]] + b[id + this.decades[2]]
                : a.strategySourceTotals[ident][this.decades[2]];
        a.strategySourceTotals[ident][this.decades[3]] =
            b.WugType == ident
                ? a.strategySourceTotals[ident][this.decades[3]] + b[id + this.decades[3]]
                : a.strategySourceTotals[ident][this.decades[3]];
        a.strategySourceTotals[ident][this.decades[4]] =
            b.WugType == ident
                ? a.strategySourceTotals[ident][this.decades[4]] + b[id + this.decades[4]]
                : a.strategySourceTotals[ident][this.decades[4]];
        a.strategySourceTotals[ident][this.decades[5]] =
            b.WugType == ident
                ? a.strategySourceTotals[ident][this.decades[5]] + b[id + this.decades[5]]
                : a.strategySourceTotals[ident][this.decades[5]];
        return a;
    };

    #buildStratWmsTotals = (ident, a, b, id) => {
        a.strategyTypeTotals[ident][this.decades[0]] =
            b.WmsType == ident
                ? a.strategyTypeTotals[ident][this.decades[0]] + b[id + this.decades[0]]
                : a.strategyTypeTotals[ident][this.decades[0]];
        a.strategyTypeTotals[ident][this.decades[1]] =
            b.WmsType == ident
                ? a.strategyTypeTotals[ident][this.decades[1]] + b[id + this.decades[1]]
                : a.strategyTypeTotals[ident][this.decades[1]];
        a.strategyTypeTotals[ident][this.decades[2]] =
            b.WmsType == ident
                ? a.strategyTypeTotals[ident][this.decades[2]] + b[id + this.decades[2]]
                : a.strategyTypeTotals[ident][this.decades[2]];
        a.strategyTypeTotals[ident][this.decades[3]] =
            b.WmsType == ident
                ? a.strategyTypeTotals[ident][this.decades[3]] + b[id + this.decades[3]]
                : a.strategyTypeTotals[ident][this.decades[3]];
        a.strategyTypeTotals[ident][this.decades[4]] =
            b.WmsType == ident
                ? a.strategyTypeTotals[ident][this.decades[4]] + b[id + this.decades[4]]
                : a.strategyTypeTotals[ident][this.decades[4]];
        a.strategyTypeTotals[ident][this.decades[5]] =
            b.WmsType == ident
                ? a.strategyTypeTotals[ident][this.decades[5]] + b[id + this.decades[5]]
                : a.strategyTypeTotals[ident][this.decades[5]];
        return a;
    };

    // Warning: This function is reused in regionalsummaryind.js
    statewide_reducer = async (result, id) => {
        let that = this;
        //console.log("starting reduce");
        //console.log(JSON.stringify("result" + result));
        let reduced = await result.reduce(function (a, b) {
            try{ 
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
                        }),
                            (a["strategyTypeTotals"] = {
                                "AGRICULTURAL CONSERVATION": {
                                    ...init
                                },
                                "AQUIFER STORAGE AND RECOVERY": {
                                    ...init
                                },
                                "CONJUNCTIVE USE": {
                                    ...init
                                },
                                "DIRECT POTABLE REUSE": {
                                    ...init
                                },
                                "DROUGHT MANAGEMENT": {
                                    ...init
                                },
                                "GROUNDWATER DESALINATION": {
                                    ...init
                                },
                                "GROUNDWATER WELLS AND OTHER": {
                                    ...init
                                },
                                "INDIRECT REUSE": {
                                    ...init
                                },
                                "INDUSTRIAL CONSERVATION": {
                                    ...init
                                },
                                "MUNICIPAL CONSERVATION": {
                                    ...init
                                },
                                "NEW MAJOR RESERVOIR": {
                                    ...init
                                },
                                "OTHER DIRECT REUSE": {
                                    ...init
                                },
                                "OTHER STRATEGIES": {
                                    ...init
                                },
                                "OTHER SURFACE WATER": {
                                    ...init
                                },
                                "SEAWATER DESALINATION": {
                                    ...init
                                },
                            });
                    }
                }
    
                a = that.#buildTypeTotals("IRRIGATION", a, b, id);

                a = that.#buildTypeTotals("LIVESTOCK", a, b, id);
                a = that.#buildTypeTotals("MANUFACTURING", a, b, id);
                a = that.#buildTypeTotals("MINING", a, b, id);
                a = that.#buildTypeTotals("MUNICIPAL", a, b, id);
                a = that.#buildTypeTotals("STEAM ELECTRIC POWER", a, b, id);
                if (id == "SS") {
                    a = that.#buildStratTotals("DEMAND REDUCTION", a, b, id);
                    a = that.#buildStratTotals("GROUNDWATER", a, b, id);
                    a = that.#buildStratTotals("REUSE", a, b, id);
                    a = that.#buildStratTotals("SEAWATER", a, b, id);
                    a = that.#buildStratTotals("SURFACE WATER", a, b, id);
    
                    a = that.#buildStratWmsTotals(
                        "AGRICULTURAL CONSERVATION",
                        a,
                        b,
                        id
                    );
                    a = that.#buildStratWmsTotals(
                        "AQUIFER STORAGE AND RECOVERY",
                        a,
                        b,
                        id
                    );
                    a = that.#buildStratWmsTotals("CONJUNCTIVE USE", a, b, id);
                    a = that.#buildStratWmsTotals("DIRECT POTABLE REUSE", a, b, id);
                    a = that.#buildStratWmsTotals("DROUGHT MANAGEMENT", a, b, id);
                    a = that.#buildStratWmsTotals(
                        "GROUNDWATER DESALINATION",
                        a,
                        b,
                        id
                    );
                    a = that.#buildStratWmsTotals(
                        "GROUNDWATER WELLS AND OTHER",
                        a,
                        b,
                        id
                    );
                    a = that.#buildStratWmsTotals("INDIRECT REUSE", a, b, id);
                    a = that.#buildStratWmsTotals(
                        "INDUSTRIAL CONSERVATION",
                        a,
                        b,
                        id
                    );
                    a = that.#buildStratWmsTotals(
                        "MUNICIPAL CONSERVATION",
                        a,
                        b,
                        id
                    );
                    a = that.#buildStratWmsTotals("NEW MAJOR RESERVOIR", a, b, id);
                    a = that.#buildStratWmsTotals("OTHER DIRECT REUSE", a, b, id);
                    a = that.#buildStratWmsTotals("OTHER STRATEGIES", a, b, id);
                    a = that.#buildStratWmsTotals("OTHER SURFACE WATER", a, b, id);
                    a = that.#buildStratWmsTotals(
                        "SEAWATER DESALINATION",
                        a,
                        b,
                        id
                    );
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

    get = async () => {
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
        //console.log("returning this after reducing. " + JSON.stringify(c));
        return c;
    };
}