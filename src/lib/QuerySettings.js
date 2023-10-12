import { QuerySetting } from './QuerySetting.js';

/** Class representing settings to send to Statewide query to configure specific queries as needed. */
export class QuerySettings {
    /**
     * @param {string} type
     */
    constructor(type) {
        this.type = type;
        this.s_demands = new QuerySetting(type);
        this.s_needs = new QuerySetting(type);
        this.s_supplies = new QuerySetting(type);
        this.s_population = new QuerySetting(type);
        this.s_strategies = new QuerySetting(type);
        this.s_projects = new QuerySetting(type);
    }

    /**
     * @param {string} demands
     */
    setDemands(demands) {
        this.s_demands = new QuerySetting(this.type, demands);
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
        this.s_needs = new QuerySetting(this.type, needs);
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
        this.s_supplies = new QuerySetting(this.type, supplies);
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
        this.s_population = new QuerySetting(this.type, population);
    }

    getPopulation() {
        return this.s_population;
    }

    /**
     * @param {string} strategies
     */
    setStrategies(strategies) {
        this.s_strategies = new QuerySetting(this.type, strategies);
    }

    getStrategies() {
        return this.s_strategies;
    }

    /**
     * @param {string} projects
     */
    setProjects(projects) {
        this.s_projects = new QuerySetting(this.type, projects);
    }

    getProjects() {
        return this.s_projects;
    }
}