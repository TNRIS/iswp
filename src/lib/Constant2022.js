export class Constant2022 {
    #decades = ["2020", "2030", "2040", "2050", "2060", "2070"];
    #usage_types = [
        "IRRIGATION",
        "MUNICIPAL",
        "MANUFACTURING",
        "STEAM ELECTRIC POWER",
        "LIVESTOCK",
        "MINING",
    ];
    #themes = ["demands", "supplies", "needs", "strategies"];

    #theme_titles = {
        demands: "Demands",
        supplies: "Existing Supplies",
        needs: "Needs (Potential Shortages)",
        strategies: "Strategy Supplies",
        population: "Population",
    };

    #year = 2022;

    getThemeTitles() {
        return this.#theme_titles;
    }

    getDecades() {
        return this.#decades;
    }

    getUsageTypes() {
        return this.#usage_types;
    }

    getThemes() {
        return this.#themes;
    }

    getYear() {
        return this.#year;
    }
}
