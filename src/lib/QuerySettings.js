/**
 * @typedef {import ('./QuerySetting.js').QuerySetting} QuerySetting
 */

export class QuerySettings {
    /**
     * @param {QuerySetting} s_demands
     * @param {QuerySetting} s_needs
     * @param {QuerySetting} s_supplies
     * @param {QuerySetting} s_population
     * @param {QuerySetting} s_strategies
     * @param {QuerySetting} s_projects
     */
    constructor(s_demands, s_needs, s_supplies, s_population, s_strategies, s_projects) {
        this.s_demands = s_demands,
        this.s_needs = s_needs,
        this.s_supplies =  s_supplies,
        this.s_population = s_population,
        this.s_strategies = s_strategies,
        this.s_projects = s_projects
    }

    /**
     * @param {QuerySetting} s_demands
     */
    setDemands(s_demands) {
        this.s_demands = s_demands;
    }

    /**
     * @param {QuerySetting} s_needs
     */
    setNeeds(s_needs) {
        this.s_needs = s_needs;
    }

    /**
     * @param {QuerySetting} s_supplies
     */
    setSupplies(s_supplies) {
        this.s_supplies = s_supplies;
    }

    /**
     * @param {QuerySetting} s_population
     */
    setPopulation(s_population) {
        this.s_population = s_population;
    }

    /**
     * @param {QuerySetting} s_strategies
     */
    setStrategies(s_strategies) {
        this.s_strategies = s_strategies;
    }

    /**
     * @param {QuerySetting} s_projects
     */
    setProjects(s_projects) {
        this.s_projects = s_projects;
    }
}