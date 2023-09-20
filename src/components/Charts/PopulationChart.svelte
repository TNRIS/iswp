<script>
    import { onMount } from "svelte";
    import { Constant2022 } from "../../lib/Constant2022.js";
    import LineChart from "./LineChart.svelte";
    import ChartDataTable from "../ChartDataTable.svelte";
    import ToggleDisplay from "../ToggleDisplay.svelte";
    import Statewide from "../../lib/db/statewide.js";
    const { chartTitle, db } = $$props;
    import format from "format-number";

    const c22 = new Constant2022();
    //const c17 = new Constant2017();
    let constants = c22;
    let decades = constants.getDecades();
    var getData = () => {
        return new Promise((resolve, reject) => {
            onMount(async () => {
                try {
                    let sw = new Statewide(db);
                    let a = await sw.get();
                    // Create a simple line chart
                    console.log("a.population.decadeTotals: " + JSON.stringify(a.population.decadeTotals));
                    let data = {
                        // A labels array that can contain any sort of values
                        labels: decades,
                        // Our series array that contains series objects or in this case series data arrays
                        series: [
                            {
                                className: "series-population",
                                data: [
                                    a.population.decadeTotals[decades[0]],
                                    a.population.decadeTotals[decades[1]],
                                    a.population.decadeTotals[decades[2]],
                                    a.population.decadeTotals[decades[3]],
                                    a.population.decadeTotals[decades[4]],
                                    a.population.decadeTotals[decades[5]],
                                ],
                                meta: "population",
                                name: "population",
                            },
                        ],
                    };
                    console.log(data)
                    resolve(data);
                } catch (err) {
                    console.log(err);
                    reject(err);
                }
            });
        });
    };
</script>

<div class="view-top statewide-view-top">
    <div class="summary-wrapper container">
        <div class="view-summary">
            <h2>TEXAS</h2>
            <div class="chart-header">
                <h5>Population</h5>
            </div>
            {#await getData()}
                <span>Loading</span>
            {:then data}
                <LineChart
                    {data}
                    {chartTitle}
                    options={{
                        height: "100px",
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
                    }}
                />
                <ChartDataTable
                    header={decades}
                    body={data.series}
                    titles={false}
                    showHide={true}>Inner in populationchart
                    </ChartDataTable>
            {:catch error}
                <span>There is a error. {error.message}</span>
            {/await}
        </div>
    </div>
</div>
