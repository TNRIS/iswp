<script>
    //@ts-nocheck
    import { onMount } from "svelte";
    import { Constant2022 } from "/src/lib/Constant2022.js";
    import LineChart from "./LineChart.svelte";
    import ChartDataTable from "/src/components/ChartDataTable.svelte";
    import ToggleDisplay from "/src/components/ToggleDisplay.svelte";
    import Statewide from "/src/lib/db/statewide.js";
    const { title, swdata } = $$props;
    import format from "format-number";

    const c22 = new Constant2022();
    //const c17 = new Constant2017();
    let constants = c22;
    let decades = constants.getDecades();
    var getData = async () => {
        try {

            // Create a simple line chart
            console.log("swdata.population.decadeTotals: " + JSON.stringify(swdata.population.decadeTotals));
            let data = {
                // A labels array that can contain any sort of values
                labels: decades,
                // Our series array that contains series objects or in this case series data arrays
                series: [
                    {
                        className: "series-population",
                        data: [
                            swdata.population.decadeTotals[decades[0]],
                            swdata.population.decadeTotals[decades[1]],
                            swdata.population.decadeTotals[decades[2]],
                            swdata.population.decadeTotals[decades[3]],
                            swdata.population.decadeTotals[decades[4]],
                            swdata.population.decadeTotals[decades[5]],
                        ],
                        meta: "population",
                        name: "population",
                    },
                ],
            };
            return data;
        } catch (err) {
            return err;
        }
    };
</script>

<div class="view-top statewide-view-top">
    <div class="summary-wrapper container">
        <div class="view-summary">
            <h2>{title}</h2>
            <div class="chart-header">
                <h5>Population</h5>
            </div>
            {#await getData()}
                <span>Loading</span>
            {:then data}
                <LineChart
                    {data}
                    chartTitle="ct-pop-chart"
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
