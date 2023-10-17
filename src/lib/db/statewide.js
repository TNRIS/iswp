// @ts-nocheck
/** Class for statewide indexeddb queries. */

import { Constant2022 } from "$lib/Constant2022.js";

export default class Statewide {
    constructor(db) {
        const c22 = new Constant2022();
        this.constants = c22; 
        this.db = db;
        this.decades = this.constants.getDecades();
        this.TEST = true;
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
        wmstype: 'vwWMSProjectsByWmsType',
        project: 'vwWMSProjectByWMS'//Not included as project information in project view is pulled from the vwWMSProjectByEntityWUGSplit table
        //usagetype: vwWMSProjectByWUGType //Not included because results are too large
    };

    // for each type, for each decade, add the records decade total for that type to the storage decade total for that type.
    #pattern = (ident, a, b, id, totalIdent, type) => {
        for(let decade of this.decades) {
            try {
                if(b[type] == ident) {
                    a[totalIdent][ident][decade] = a[totalIdent][ident][decade] + b[id + decade];
                }
            } catch(err) {
                console.log(`error ${err}`);
            }
        }

        return a;
    }
    statewide_reducer = async (result, id) => {
        let that = this;
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
                // First push b to a.rows[]
                a.rows.push(b);
                a = that.#pattern("IRRIGATION", a, b, id, "typeTotals", "WugType");
                a = that.#pattern("LIVESTOCK", a, b, id, "typeTotals", "WugType");
                a = that.#pattern("MANUFACTURING", a, b, id, "typeTotals", "WugType");
                a = that.#pattern("MINING", a, b, id, "typeTotals", "WugType");
                a = that.#pattern("MUNICIPAL", a, b, id, "typeTotals", "WugType");
                a = that.#pattern("STEAM ELECTRIC POWER", a, b, id, "typeTotals", "WugType");

                if (id == "SS") {
                    a = that.#pattern("DEMAND REDUCTION", a, b, id, "strategySourceTotals", "SourceType");
                    a = that.#pattern("GROUNDWATER", a, b, id, "strategySourceTotals", "SourceType");
                    a = that.#pattern("REUSE", a, b, id, "strategySourceTotals", "SourceType");
                    a = that.#pattern("SEAWATER", a, b, id, "strategySourceTotals", "SourceType");
                    a = that.#pattern("SURFACE WATER", a, b, id, "strategySourceTotals", "SourceType");

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

    #getAllTransaction = (key, where, project_filter) => {
        return new Promise((resolve, reject) => {
            try {

                //console.log("getAllTransaction for " + key);
                if(key == 'vwWMSProjectsByWmsType') {
                    // Temporary workaround until I find out why these are cased differently.
                    key = 'vwWMSProjectsByWMSType'
                }

                const transaction = this.db.transaction([key]);
                const objectStore = transaction.objectStore(key);
                let rdemands;
                if(where)
                    rdemands = objectStore.index(where).getAll(project_filter);
                else 
                    rdemands = objectStore.getAll(project_filter);
                rdemands.onsuccess = (event) => {
                    // Do something with the request.result!
                    resolve(event.target.result);
                };
                rdemands.onerror = (event) => {
                    reject(event);
                }
            } catch (err) {
                reject(err);
            }
        });
    };
    #measuredStateWideReducer = async(obj, id) => {
        const start = Date.now();
        let red =  await this.statewide_reducer(obj, id);
        if(this.TEST) {
            console.log(`statewide reducer time: ${Date.now() - start} ms.`);
        }

        return red;
    }
    get = async (setting) => {
        let demands_observable = this.#getAllTransaction(
            this.#DATA_TABLES.demands, setting.s_demands.whereClause, setting.s_demands.filter
        );
        let needs_observable = this.#getAllTransaction(this.#DATA_TABLES.needs, setting.s_needs.whereClause, setting.s_needs.filter);
        let supplies_observable = this.#getAllTransaction(
            this.#DATA_TABLES.supplies, setting.s_supplies.whereClause, setting.s_supplies.filter
        );
        let population_observable = this.#getAllTransaction(
            this.#DATA_TABLES.population, setting.s_population.whereClause, setting.s_population.filter
        );
        let strategies_observable = this.#getAllTransaction(
            this.#DATA_TABLES.strategies, setting.s_strategies.whereClause, setting.s_strategies.filter
        );
        
        let projects_observable;
        if(setting.type == "region") {
            projects_observable = this.#getAllTransaction(
                this.#PROJECT_TABLES.region, setting.s_projects.whereClause, setting.s_projects.filter
            );
        } else if(setting.type == "entity") {
            projects_observable = this.#getAllTransaction(
                this.#PROJECT_TABLES.entity, setting.s_projects.whereClause, setting.s_projects.filter
            );
        } else {
            projects_observable = this.#getAllTransaction(
                this.#PROJECT_TABLES.county, setting.s_projects.whereClause, setting.s_projects.filter
            );
        }
        

        let [demands, needs, supplies, population, strategies, projects] =
            await Promise.all([
                demands_observable,
                needs_observable,
                supplies_observable,
                population_observable,
                strategies_observable,
                projects_observable
            ]);
        
        //TODO: Make more efficient.
        demands = await this.#measuredStateWideReducer(demands, "D");
        needs = await this.#measuredStateWideReducer(needs, "N");
        supplies = await this.#measuredStateWideReducer(supplies, "WS");
        population = await this.#measuredStateWideReducer(population, "P");
        strategies = await this.#measuredStateWideReducer(strategies, "SS");

        let c = {
            demands: demands,
            needs: needs,
            population: population,
            strategies: strategies,
            supplies: supplies,
            projects: projects
        };

        return c;
    };
}