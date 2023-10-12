<script>
    // @ts-nocheck
    import { Constant2022 } from "/src/lib/Constant2022.js";
    import LineChart from "/src/components/Charts/LineChart.svelte";
    import ChartDataTable from "/src/components/ChartDataTable.svelte";
    import { onMount } from "svelte";
    import Statewide from "/src/lib/db/statewide.js";
    import ThemeSelector from "/src/components/ThemeSelector.svelte";
    import format from "format-number";

    const c22 = new Constant2022();
    const { chartTitle, swdata } = $$props;
    const chartOptions = {
        height: "240px",
        lineSmooth: false,
        axisY: {
            low: 0,
            labelInterpolationFnc: format(),
        },
        chartPadding: {
            left: 40,
            right: 40,
        },
        fullWidth: true,
    };

    let titles = c22.getThemeTitles();
    let selectedTheme = "demands";
    let demands_visible = true;
    let supplies_visible = false;
    let needs_visible = false;
    let strategies_visible = false;
    let constants = c22;
    let show = (event) => {
        switch (event.target.innerHTML) {
            case "Demands":
                supplies_visible = false;
                needs_visible = false;
                strategies_visible = false;
                demands_visible = true;
                selectedTheme = "demands";
                break;
            case "Existing Supplies":
                demands_visible = false;
                needs_visible = false;
                strategies_visible = false;
                supplies_visible = true;
                selectedTheme = "supplies";
                break;
            case "Needs (Potential Shortages)":
                demands_visible = false;
                supplies_visible = false;
                strategies_visible = false;
                needs_visible = true;
                selectedTheme = "needs";
                break;
            case "Strategy Supplies":
                demands_visible = false;
                supplies_visible = false;
                needs_visible = false;
                strategies_visible = true;
                selectedTheme = "strategies";
                break;
        }
    };

    let makeSeries = (type, name, ID, data) => {
        let decades = constants.getDecades();
        let series = [];
        for (let year in decades) {
            series.push(data[type].typeTotals[ID][decades[year]]);
        }

        return {
            className: `series-${name}`,
            data: series,
            meta: name,
            name: name,
        };
    };

    var getData = () => {
        return new Promise((resolve, reject) => {
            onMount(async () => {
                try {
                    // Create a simple line chart
                    let data = {};
                    data.demands = {
                        // A labels array that can contain any sort of values
                        labels: constants.getDecades(),
                        // Our series array that contains series objects or in this case series data arrays
                        series: [
                            makeSeries(
                                "demands",
                                "irrigation",
                                "IRRIGATION",
                                swdata
                            ),
                            makeSeries("demands", "livestock", "LIVESTOCK", swdata),
                            makeSeries(
                                "demands",
                                "manufacturing",
                                "MANUFACTURING",
                                swdata
                            ),
                            makeSeries(
                                "demands",
                                "steam-electric-power",
                                "STEAM ELECTRIC POWER",
                                swdata
                            ),
                            makeSeries("demands", "livestock", "LIVESTOCK", swdata),
                            makeSeries("demands", "municipal", "MUNICIPAL", swdata),
                        ],
                    };

                    data.needs = {
                        // A labels array that can contain any sort of values
                        labels: constants.getDecades(),
                        // Our series array that contains series objects or in this case series data arrays
                        series: [
                            makeSeries("needs", "irrigation", "IRRIGATION", swdata),
                            makeSeries("needs", "livestock", "LIVESTOCK", swdata),
                            makeSeries(
                                "needs",
                                "manufacturing",
                                "MANUFACTURING",
                                swdata
                            ),
                            makeSeries(
                                "needs",
                                "steam-electric-power",
                                "STEAM ELECTRIC POWER",
                                swdata
                            ),
                            makeSeries("needs", "livestock", "LIVESTOCK", swdata),
                            makeSeries("needs", "municipal", "MUNICIPAL", swdata),
                        ],
                    };

                    data.population = {
                        // A labels array that can contain any sort of values
                        labels: constants.getDecades(),
                        // Our series array that contains series objects or in this case series data arrays
                        series: [
                            makeSeries(
                                "population",
                                "irrigation",
                                "IRRIGATION",
                                swdata
                            ),
                            makeSeries(
                                "population",
                                "livestock",
                                "LIVESTOCK",
                                swdata
                            ),
                            makeSeries(
                                "population",
                                "manufacturing",
                                "MANUFACTURING",
                                swdata
                            ),
                            makeSeries(
                                "population",
                                "steam-electric-power",
                                "STEAM ELECTRIC POWER",
                                swdata
                            ),
                            makeSeries(
                                "population",
                                "livestock",
                                "LIVESTOCK",
                                swdata
                            ),
                            makeSeries(
                                "population",
                                "municipal",
                                "MUNICIPAL",
                                swdata
                            ),
                        ],
                    };

                    data.strategies = {
                        // A labels array that can contain any sort of values
                        labels: constants.getDecades(),
                        // Our series array that contains series objects or in this case series data arrays
                        series: [
                            makeSeries(
                                "strategies",
                                "irrigation",
                                "IRRIGATION",
                                swdata
                            ),
                            makeSeries(
                                "strategies",
                                "livestock",
                                "LIVESTOCK",
                                swdata
                            ),
                            makeSeries(
                                "strategies",
                                "manufacturing",
                                "MANUFACTURING",
                                swdata
                            ),
                            makeSeries(
                                "strategies",
                                "steam-electric-power",
                                "STEAM ELECTRIC POWER",
                                swdata
                            ),
                            makeSeries(
                                "strategies",
                                "livestock",
                                "LIVESTOCK",
                                swdata
                            ),
                            makeSeries(
                                "strategies",
                                "municipal",
                                "MUNICIPAL",
                                swdata
                            ),
                        ],
                    };

                    data.supplies = {
                        // A labels array that can contain any sort of values
                        labels: constants.getDecades(),
                        // Our series array that contains series objects or in this case series data arrays
                        series: [
                            makeSeries(
                                "supplies",
                                "irrigation",
                                "IRRIGATION",
                                swdata
                            ),
                            makeSeries("supplies", "livestock", "LIVESTOCK", swdata),
                            makeSeries(
                                "supplies",
                                "manufacturing",
                                "MANUFACTURING",
                                swdata
                            ),
                            makeSeries(
                                "supplies",
                                "steam-electric-power",
                                "STEAM ELECTRIC POWER",
                                swdata
                            ),
                            makeSeries("supplies", "livestock", "LIVESTOCK", swdata),
                            makeSeries("supplies", "municipal", "MUNICIPAL", swdata),
                        ],
                    };

                    resolve(data);
                } catch (err) {
                    reject(err);
                }
            });
        });
    };
</script>

<div class="summary-wrapper container">
    <div style="pointer-events:auto; height:384px;" class="row panel-row">
        <div class="chart-header">
            <h4>
                {titles[selectedTheme]} by Usage Type
                <span class="units">(acre-feet/year)</span>
                <!--<Units />-->
            </h4>
            <!--<UsageTypeChartLegend className="u-pull-right legend-types-by-decade" />-->
            <ThemeSelector {show} bind:select_theme={selectedTheme}/>
        </div>

        {#await getData()}
            <span>Loading</span>
        {:then data}
            {#if demands_visible}
                <LineChart
                    data={data.demands}
                    chartTitle={`${chartTitle}-demands`}
                    options={chartOptions}
                />
            {/if}
            {#if supplies_visible}
                <LineChart
                    data={data.supplies}
                    chartTitle={`${chartTitle}-supplies`}
                    options={chartOptions}
                />
            {/if}
            {#if needs_visible}
                <LineChart
                    data={data.needs}
                    chartTitle={`${chartTitle}-needs`}
                    options={chartOptions}
                />
            {/if}
            {#if strategies_visible}
                <LineChart
                    data={data.strategies}
                    chartTitle={`${chartTitle}-strategies`}
                    options={chartOptions}
                />
            {/if}
        {:catch error}
            <span>There is a error: {error.message}</span>
        {/await}
    </div>
</div>
