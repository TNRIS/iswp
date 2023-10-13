import { QuerySetting } from './QuerySetting.js';

/** Class representing settings to send to Statewide query to configure specific queries as needed. */
export class QuerySettings {
    /**
     * @param {string} [type]
     * @param {string} [whereClause]
     */
    constructor(type, whereClause) {
        this.type = type;
        this.whereClause = whereClause;
        this.s_demands = new QuerySetting(type, undefined, whereClause);
        this.s_needs = new QuerySetting(type, undefined, whereClause);
        this.s_supplies = new QuerySetting(type, undefined, whereClause);
        this.s_population = new QuerySetting(type, undefined, whereClause);
        this.s_strategies = new QuerySetting(type, undefined, whereClause);
        this.s_projects = new QuerySetting(type, undefined, whereClause);
    }
    
    /**
     * @param {string} filter
     */
    setAll(filter) {
        this.s_demands = new QuerySetting(this.type, filter, this.whereClause);
        this.s_needs = new QuerySetting(this.type, filter, this.whereClause);
        this.s_supplies = new QuerySetting(this.type, filter, this.whereClause);
        this.s_population = new QuerySetting(this.type, filter, this.whereClause);
        this.s_strategies = new QuerySetting(this.type, filter, this.whereClause);
        this.s_projects = new QuerySetting(this.type, filter, this.whereClause);
    }

    /**
     * @param {string} demands
     */
    setDemands(demands) {
        this.s_demands = new QuerySetting(this.type, demands, this.whereClause);
    }

    /**
     * Returns demands setting
     * @returns {QuerySetting}
     */
    getDemands() {
        return this.s_demands;
    }

    /**
     * @param {string} needs
     */
    setNeeds(needs) {
        this.s_needs = new QuerySetting(this.type, needs, this.whereClause);
    }

    /**
     *  Returns needs setting
     * @returns {QuerySetting}
     */
    getNeeds() {
        return this.s_needs;
    }

    /**
     * Setup a supplies setting object.
     * @param {string} supplies
     */
    setSupplies(supplies) {
        this.s_supplies = new QuerySetting(this.type, supplies, this.whereClause);
    }

    /**
     * Returns supplies setting
     * @returns {QuerySetting}
     */
    getSupplies() {
        return this.s_supplies;
    }

    /**
     * @param {string} population
     */
    setPopulation(population) {
        this.s_population = new QuerySetting(this.type, population, this.whereClause);
    }

    /**
     *  Returns population setting
     * @returns {QuerySetting}
     */
    getPopulation() {
        return this.s_population;
    }

    /**
     * @param {string} strategies
     */
    setStrategies(strategies) {
        this.s_strategies = new QuerySetting(this.type, strategies, this.whereClause);
    }

    /**
     *  Returns strategies setting
     * @returns {QuerySetting}
     */
    getStrategies() {
        return this.s_strategies;
    }

    /**
     * @param {string} projects
     */
    setProjects(projects) {
        this.s_projects = new QuerySetting(this.type, projects, this.whereClause);
    }

    /**
     *  Returns projects setting
     * @returns {QuerySetting}
     */
    getProjects() {
        return this.s_projects;
    }
}