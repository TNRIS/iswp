<script>
    // @ts-nocheck
    import LineChart from "$lib/components/Charts/LineChart.svelte";
    import IconSpread from "$lib/components/IconSpread.svelte";
    import { onMount } from "svelte";
    import ThemeSelector from "$lib/components/ThemeSelector.svelte";
    import ChartDataTable from "$lib/components/ChartDataTable.svelte";
    import ctAxisTitle from "chartist-plugin-axistitle";

    import { commafy } from "$lib/helper.js";
    const { chartTitle, swdata, constants, title } = $$props;
    let decades = constants.getDecades();
    let titleMap = {
        irrigation: "Irrigation",
        livestock: "Livestock",
        manufacturing: "Manufacturing",
        "steam-electric-power": "Steam Electric Power",
        mining: "Mining",
        municipal: "Municipal"
    }
    const chartOptions = {
        height: "240px",
        lineSmooth: false,
        axisY: {
            low: 0,
            labelInterpolationFnc: function(value) {
                return commafy(value + '');
            }
        },
        chartPadding: {
            left: 40,
            right: 40,
        },
        fullWidth: true,
        plugins: [
            ctAxisTitle({
            axisY: {
                axisTitle: 'acre-feet/year',
                axisClass: 'ct-axis-title',
                offset: {
                    x: 0,
                    y: 0
                },
                textAnchor: 'middle',
                flipTitle: false
            }
            })
        ]

    };

    let titles = constants.getThemeTitles();

    let usage_types = constants.getUsageTypes();

    let selectedTheme = "demands";
    let demands_visible = true;
    let supplies_visible = false;
    let needs_visible = false;
    let strategies_visible = false;
    let show = (event) => {
        selectedTheme = event.target.value;
        switch (event.target.value) {
            case "demands":
                supplies_visible = false;
                needs_visible = false;
                strategies_visible = false;
                demands_visible = true;
                break;
            case "supplies":
                demands_visible = false;
                needs_visible = false;
                strategies_visible = false;
                supplies_visible = true;
                break;
            case "needs":
                demands_visible = false;
                supplies_visible = false;
                strategies_visible = false;
                needs_visible = true;
                break;
            case "strategies":
                demands_visible = false;
                supplies_visible = false;
                needs_visible = false;
                strategies_visible = true;
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
                                "mining",
                                usage_types[5],
                                swdata
                            ),
                            makeSeries(
                                "demands",
                                "livestock",
                                usage_types[4],
                                swdata
                            ),
                            makeSeries(
                                "demands",
                                "steam-electric-power",
                                usage_types[3],
                                swdata
                            ),
                            makeSeries(
                                "demands",
                                "manufacturing",
                                usage_types[2],
                                swdata
                            ),
                            makeSeries(
                                "demands",
                                "municipal",
                                usage_types[1],
                                swdata
                            ),
                            makeSeries(
                                "demands",
                                "irrigation",
                                usage_types[0],
                                swdata
                            )
                        ],
                    };

                    data.needs = {
                        // A labels array that can contain any sort of values
                        labels: constants.getDecades(),
                        // Our series array that contains series objects or in this case series data arrays
                        series: [
                            makeSeries(
                                "needs",
                                "irrigation",
                                usage_types[0],
                                swdata
                            ),
                            makeSeries(
                                "needs",
                                "livestock",
                                usage_types[4],
                                swdata
                            ),
                            makeSeries(
                                "needs",
                                "manufacturing",
                                usage_types[2],
                                swdata
                            ),
                            makeSeries(
                                "needs",
                                "steam-electric-power",
                                usage_types[3],
                                swdata
                            ),
                            makeSeries(
                                "needs",
                                "mining",
                                usage_types[5],
                                swdata
                            ),
                            makeSeries(
                                "needs",
                                "municipal",
                                usage_types[1],
                                swdata
                            ),
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
                                usage_types[0],
                                swdata
                            ),
                            makeSeries(
                                "population",
                                "livestock",
                                usage_types[4],
                                swdata
                            ),
                            makeSeries(
                                "population",
                                "manufacturing",
                                usage_types[2],
                                swdata
                            ),
                            makeSeries(
                                "population",
                                "steam-electric-power",
                                usage_types[3],
                                swdata
                            ),
                            makeSeries(
                                "population",
                                "mining",
                                usage_types[5],
                                swdata
                            ),
                            makeSeries(
                                "population",
                                "municipal",
                                usage_types[1],
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
                                usage_types[0],
                                swdata
                            ),
                            makeSeries(
                                "strategies",
                                "livestock",
                                usage_types[4],
                                swdata
                            ),
                            makeSeries(
                                "strategies",
                                "manufacturing",
                                usage_types[2],
                                swdata
                            ),
                            makeSeries(
                                "strategies",
                                "steam-electric-power",
                                usage_types[3],
                                swdata
                            ),
                            makeSeries(
                                "strategies",
                                "mining",
                                usage_types[5],
                                swdata
                            ),
                            makeSeries(
                                "strategies",
                                "municipal",
                                usage_types[1],
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
                                usage_types[0],
                                swdata
                            ),
                            makeSeries(
                                "supplies",
                                "livestock",
                                usage_types[4],
                                swdata
                            ),
                            makeSeries(
                                "supplies",
                                "manufacturing",
                                usage_types[2],
                                swdata
                            ),
                            makeSeries(
                                "supplies",
                                "steam-electric-power",
                                usage_types[3],
                                swdata
                            ),
                            makeSeries(
                                "supplies",
                                "mining",
                                usage_types[5],
                                swdata
                            ),
                            makeSeries(
                                "supplies",
                                "municipal",
                                usage_types[1],
                                swdata
                            ),
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
    <div style="pointer-events:auto;" class="row panel-row">
        <div class="chart-header">
            <div class="row">
                {#if title}
                <span class="view-name">{title}</span>
                {/if}
                <h4>
                    {titles[selectedTheme]} by Usage Type
                    <span class="units">(acre-feet/year)</span>
                    <!--<Units />-->
                </h4>
                <!--<UsageTypeChartLegend className="u-pull-right legend-types-by-decade" />-->
                <IconSpread />
            </div>
            <ThemeSelector {show} showPopulation={false} bind:select_theme={selectedTheme} />
        </div>

        {#await getData()}
            <div class="loader"></div>
        {:then data}
            {#if demands_visible}
                <LineChart
                    data={data.demands}
                    chartTitle={`${chartTitle}-demands`}
                    options={chartOptions}
                />
                <div class="toggle-container">
                <ChartDataTable
                header={decades}
                body={data.demands.series}
                titles={true}
                showHide={true}
                {titleMap} 
                showTotal={true} />
                </div>
            {/if}
            {#if supplies_visible}
                <LineChart
                    data={data.supplies}
                    chartTitle={`${chartTitle}-supplies`}
                    options={chartOptions}
                />

                <div class="toggle-container">
                    <ChartDataTable
                    header={decades}
                    body={data.supplies.series}
                    titles={true}
                    showHide={true}
                    {titleMap} 
                    showTotal={true}  />
                </div>
            {/if}
            {#if needs_visible}
                <LineChart
                    data={data.needs}
                    chartTitle={`${chartTitle}-needs`}
                    options={chartOptions}
                />


                <div class="toggle-container">
                    <ChartDataTable
                    header={decades}
                    body={data.needs.series}
                    titles={true}
                    showHide={true}
                    {titleMap} 
                    showTotal={true}  />
                </div>
            {/if}
            {#if strategies_visible}
                <LineChart
                    data={data.strategies}
                    chartTitle={`${chartTitle}-strategies`}
                    options={chartOptions}
                />

    
                <div class="toggle-container">
                    <ChartDataTable
                    header={decades}
                    body={data.strategies.series}
                    titles={true}
                    showHide={true}
                    {titleMap} 
                    showTotal={true}  />
                </div>
            {/if}
        {:catch error}
            <span>There is a error: {error.message}</span>
        {/await}
    </div>
</div>
