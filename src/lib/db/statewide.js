// @ts-nocheck
/** Class for statewide indexeddb queries. */

import { Constant2017 } from '../../lib/Constant2017.js';
import { Constant2022 } from '../../lib/Constant2022.js';
import { Constant2027 } from '../../lib/Constant2027.js';

import { writable } from 'svelte/store';
import { objLeftjoin, real_clone, DEFAULT_FLAG } from '../../lib/helper';
let page;
export default class Statewide {
    host = window.location.hostname;

    constructor(db) {
        page = window.location.pathname.split('/')[1];

        if (this.host.includes(2027)) {
            this.constants = new Constant2027();
        } else if (this.host.includes(2022)) {
            this.constants = new Constant2022();
        } else if (this.host.includes(2017)) {
            this.constants = new Constant2017();
        } else {
            // If not specified in url then use default flag.
            if (DEFAULT_FLAG === '2017') {
                this.constants = new Constant2017();
            } else if (DEFAULT_FLAG === '2022') {
                this.constants = new Constant2022();
            } else if (DEFAULT_FLAG === '2027') {
                this.constants = new Constant2027();
            } else {
                this.constants = new Constant2022();
            }
        }

        this.db = db;
        this.decades = this.constants.getDecades();
        this.usage_types = this.constants.getUsageTypes();
    }

    // for each type, for each decade, add the records decade total for that type to the storage decade total for that type.
    #pattern = (ident, a, b, id, totalIdent, type) => {
        for (let decade of this.decades) {
            try {
                if (b[type]) {
                    let bt = b[type];
                    if (ident.includes(bt)) {
                        a[totalIdent][bt][decade] = a[totalIdent][bt][decade] + b[id + decade];
                    }
                }
            } catch (err) {
                console.log(`error ${err}`);
            }
        }

        return a;
    };

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

                    let typeTotals = {};
                    typeTotals[that.usage_types[0]] = real_clone(init);
                    typeTotals[that.usage_types[1]] = real_clone(init);
                    typeTotals[that.usage_types[2]] = real_clone(init);
                    typeTotals[that.usage_types[3]] = real_clone(init);
                    typeTotals[that.usage_types[4]] = real_clone(init);
                    typeTotals[that.usage_types[5]] = real_clone(init);
                    a = {
                        rows: [],
                        typeTotals: typeTotals,
                        decadeTotals: {
                            ...init
                        }
                    };

                    // Special strat supplies object
                    if (id == 'SS') {
                        a['strategySourceTotals'] = {
                            'DEMAND REDUCTION': {
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
                            'SURFACE WATER': {
                                ...init
                            }
                        };

                        a['strategyTypeTotals'] = {};
                        for (let type of that.constants.WMS_TYPES) {
                            a['strategyTypeTotals'][type] = { ...init };
                        }
                    }
                }
                // First push b to a.rows[]
                a.rows.push(b);
                a = that.#pattern(that.usage_types, a, b, id, 'typeTotals', 'WugType');

                if (id == 'SS') {
                    a = that.#pattern(
                        ['DEMAND REDUCTION', 'GROUNDWATER', 'REUSE', 'SEAWATER', 'SURFACE WATER'],
                        a,
                        b,
                        id,
                        'strategySourceTotals',
                        'SourceType'
                    );
                    a = that.#pattern(that.constants.WMS_TYPES, a, b, id, 'strategyTypeTotals', 'WmsType');
                }

                // Add records decade total to storage decade total for each decade.
                a.decadeTotals[that.decades[0]] = a.decadeTotals[that.decades[0]] + b[id + that.decades[0]];
                a.decadeTotals[that.decades[1]] = a.decadeTotals[that.decades[1]] + b[id + that.decades[1]];
                a.decadeTotals[that.decades[2]] = a.decadeTotals[that.decades[2]] + b[id + that.decades[2]];
                a.decadeTotals[that.decades[3]] = a.decadeTotals[that.decades[3]] + b[id + that.decades[3]];
                a.decadeTotals[that.decades[4]] = a.decadeTotals[that.decades[4]] + b[id + that.decades[4]];
                a.decadeTotals[that.decades[5]] = a.decadeTotals[that.decades[5]] + b[id + that.decades[5]];

                return a;
            } catch (err) {
                console.log('reducer err: ' + err);
            }
        }, Object.create(null));
        //console.log("reduced: " + JSON.stringify(reduced))
        return reduced;
    };

    #getAllTransaction = (key, where, project_filter) => {
        return new Promise((resolve, reject) => {
            try {
                let start = Date.now();
                //vwWMSProjectsByWmsType
                if (key == `${this.constants.tappend}WMSProjectsByWmsType`) {
                    // Temporary workaround until I find out why these are cased differently.
                    key = `${this.constants.tappend}WMSProjectsByWMSType`;
                }

                if (key == `${this.constants.tappend}WMSProjectsByWmsType`) {
                    // Temporary workaround until I find out why these are cased differently.
                    key = `${this.constants.tappend}WMSProjectsByWMSType`;
                }
                const transaction = this.db.transaction([key]);
                const objectStore = transaction.objectStore(key);
                let rdemands;

                if (where) {
                    rdemands = objectStore.index(where).getAll(project_filter);
                } else {
                    rdemands = objectStore.getAll(project_filter);
                }
                rdemands.onsuccess = (event) => {
                    // Do something with the request.result!
                    console.log(`Transaction in ms: ${Date.now() - start}`);

                    resolve(event.target.result);
                };
                rdemands.onerror = (event) => {
                    reject(event);
                };
            } catch (err) {
                console.error(`error in getAllTransaction: key ${key}, where ${where}, project_filter ${project_filter}`);
                reject(err);
            }
        });
    };
    #measuredStateWideReducer = async (obj, id) => {
        if (!obj) return [];
        let red = await this.statewide_reducer(obj, id);
        return red;
    };
    get = async (setting) => {
        let start = Date.now();
        console.log('Starting get timer');

        let demands_observable;
        let needs_observable;
        let population_observable;

        if (
            setting.type !== 'source' &&
            setting.type !== 'strategies' &&
            setting.type !== 'wms' &&
            setting.type !== 'datastrategies' &&
            setting.type !== 'wmstype'
        ) {
            population_observable = this.#getAllTransaction(
                this.constants.DATA_TABLES.population,
                setting.s_population.whereClause,
                setting.s_population.filter
            );
            demands_observable = this.#getAllTransaction(
                this.constants.DATA_TABLES.demands,
                setting.s_demands.whereClause,
                setting.s_demands.filter
            );
            needs_observable = this.#getAllTransaction(
                this.constants.DATA_TABLES.needs,
                setting.s_needs.whereClause,
                setting.s_needs.filter
            );
        }
        console.log(`get time 1 in ms: ${Date.now() - start}`);

        let supplies_observable, strategies_observable;

        if (setting.type !== 'strategies' && setting.type !== 'wms' && setting.type !== 'wmstype') {
            if (setting.type !== 'datastrategies') {
                supplies_observable = this.#getAllTransaction(
                    this.constants.DATA_TABLES.supplies,
                    setting.s_supplies.whereClause,
                    setting.s_supplies.filter
                );
            }

            strategies_observable = this.#getAllTransaction(
                this.constants.DATA_TABLES.strategies,
                setting.s_strategies.whereClause,
                setting.s_strategies.filter
            );
        }
        console.log(`get time 2 in ms: ${Date.now() - start}`);

        let projects_observable;
        const HAS_PROJECTS =
            setting.type == 'county' ||
            setting.type == 'region' ||
            setting.type == 'entity' ||
            setting.type == 'source' ||
            setting.type == 'wms' ||
            setting.type == 'strategies' ||
            setting.type == 'wmstype';
        if (HAS_PROJECTS) {
            projects_observable = this.#getAllTransaction(
                this.constants.PROJECT_TABLES[setting.type],
                setting.s_projects.whereClause,
                setting.s_projects.filter
            );
        }

        let [demands, needs, supplies, population, strategies, projects] = await Promise.all([
            demands_observable,
            needs_observable,
            supplies_observable,
            population_observable,
            strategies_observable,
            projects_observable
        ]);
        console.log(`get time 3 in ms: ${Date.now() - start}`);

        //TODO: Make more efficient.

        [demands, needs, supplies, population, strategies] = await Promise.all([
            this.#measuredStateWideReducer(demands, 'D'),
            this.#measuredStateWideReducer(needs, 'N'),
            this.#measuredStateWideReducer(supplies, 'WS'),
            this.#measuredStateWideReducer(population, 'P'),
            this.#measuredStateWideReducer(strategies, 'SS')
        ]);

        console.log(`get time 4 in ms: ${Date.now() - start}`);

        let c = {
            demands: demands,
            needs: needs,
            population: population,
            strategies: strategies,
            supplies: supplies,
            projects: projects
        };

        // Get wug data for the map!
        if (page !== '' && page !== 'statewide') {
            let b = await this.#getAllTransaction(`${this.constants.tappend}EntityCoordinates`);
            let ent5 = await this.#getAllTransaction(`${this.constants.tappend}WMSProjects`);
            let ent6 = await this.#getAllTransaction(`${this.constants.tappend}WMSProjectBySource`);
            console.log(`get time 5 in ms: ${Date.now() - start}`);

            if (c.strategies.rows) objLeftjoin(c.strategies.rows, b, ['EntityId']);
            if (c.needs.rows) objLeftjoin(c.needs.rows, b, ['EntityId']);
            if (c.supplies.rows) objLeftjoin(c.supplies.rows, b, ['EntityId']);
            if (c.demands.rows) objLeftjoin(c.demands.rows, b, ['EntityId']);
            if (c.population.rows) objLeftjoin(c.population.rows, b, ['EntityId']);
            objLeftjoin(ent5, ent6, ['WmsProjectId']);
            c.wug_projects = ent5;
        }

        console.log(`get time total in ms: ${Date.now() - start}`);

        return c;
    };

    getEntities = () => {
        return new Promise((resolve, reject) => {
            const stored = localStorage.content;
            if (stored) {
                resolve(JSON.parse(stored));
            }

            const transaction = this.db.transaction([`${this.constants.tappend}EntityCoordinates`]);
            const objectStore = transaction.objectStore(`${this.constants.tappend}EntityCoordinates`);

            // We should store here.

            let rdemands = objectStore.getAll();

            rdemands.onsuccess = (event) => {
                // Set the stored value or a sane default.
                let content = writable(JSON.stringify(event.target.result));

                // Anytime the store changes, update the local storage value.
                content.subscribe((value) => (localStorage.content = value));
                resolve(event.target.result);
            };
            rdemands.onerror = (event) => {
                reject(event);
            };
        });
    };

    getProjects = () => {
        return new Promise((resolve, reject) => {
            const stored = localStorage.project;
            if (stored != '[]' && stored) {
                return resolve(JSON.parse(stored));
            }
            if (stored !== '[]' || stored !== undefined) {
                const transaction = this.db.transaction([`${this.constants.tappend}WMSProjects`]);

                // We should store here.
                const objectStore = transaction.objectStore(`${this.constants.tappend}WMSProjects`);

                let rdemands = objectStore.getAll();
                rdemands.onsuccess = (event) => {
                    // Set the stored value or a sane default.
                    let project = writable(JSON.stringify(event.target.result));

                    // Anytime the store changes, update the local storage value.
                    project.subscribe((value) => (localStorage.project = value));
                    resolve(event.target.result);
                };
                rdemands.onerror = (event) => {
                    reject(event);
                };
            } else {
                resolve(JSON.parse(stored));
            }
        });
    };

    getWms = () => {
        return new Promise((resolve, reject) => {
            const stored = localStorage.wms;
            if (stored != '[]' && stored) {
                return resolve(JSON.parse(stored));
            }

            const transaction = this.db.transaction([`${this.constants.tappend}WMSProjectByWMS`]);
            const objectStore = transaction.objectStore(`${this.constants.tappend}WMSProjectByWMS`);

            // We should store here.

            let rdemands = objectStore.getAll();

            rdemands.onsuccess = (event) => {
                // Set the stored value or a sane default.
                let wms = writable(JSON.stringify(event.target.result));

                // Anytime the store changes, update the local storage value.
                wms.subscribe((value) => (localStorage.wms = value));
                resolve(event.target.result);
            };
            rdemands.onerror = (event) => {
                reject(event);
            };
        });
    };
}
