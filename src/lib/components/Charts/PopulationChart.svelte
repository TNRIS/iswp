<!-- Population Line Chart displayed on most pages including homepage. -->

<script>
    //@ts-nocheck
    import LineChart from './LineChart.svelte';
    import ChartDataTable from '$lib/components/ChartDataTable.svelte';
    let { title, lrp, titleOnly, constants, tagline, noMap, dont_capitalize_title } = $$props;
    import PopulationMap from '$lib/components/Maps/PopulationMap.svelte';
    import { commafy } from '$lib/helper.js';

    let decades = constants.getDecades();
    var getData = async () => {
        let swdata = await lrp;
        try {
            // Create a simple line chart
            let data = {
                // A labels array that can contain any sort of values
                labels: decades,
                // Our series array that contains series objects or in this case series data arrays
                series: [
                    {
                        className: 'series-population',
                        data: [
                            swdata.population.decadeTotals[decades[0]],
                            swdata.population.decadeTotals[decades[1]],
                            swdata.population.decadeTotals[decades[2]],
                            swdata.population.decadeTotals[decades[3]],
                            swdata.population.decadeTotals[decades[4]],
                            swdata.population.decadeTotals[decades[5]]
                        ],
                        meta: 'population',
                        name: 'population'
                    }
                ]
            };
            return data;
        } catch (err) {
            return err;
        }
    };
</script>

<div class={noMap ? 'noMapTitle view-top statewide-view-top' : 'view-top statewide-view-top'}>
    <div class="summary-wrapper container" style="z-index: 600">
        <div class="view-summary">
            {#if dont_capitalize_title}
                <h2 class={title.length > 18 ? 'long-name' : ''}>{title}</h2>
            {:else}
                <h2 class={title.length > 18 ? 'long-name' : ''}>{title.toUpperCase()}</h2>
            {/if}

            {#if tagline}
                <span id="tagline">{@html tagline}</span>
            {/if}
            {#if titleOnly !== true}
                <div class="chart-header">
                    <h5>Population</h5>
                </div>
                {#await getData()}
                    <div class="loader"></div>
                {:then data}
                    <LineChart
                        {data}
                        chartTitle="ct-pop-chart"
                        options={{
                            height: '100px',
                            lineSmooth: false,
                            chartPadding: {
                                left: 40,
                                right: 40
                            },
                            fullWidth: true,
                            axisY: {
                                low: 0,
                                labelInterpolationFnc: function (value) {
                                    return commafy(value + '');
                                }
                            }
                        }} />
                    <ChartDataTable
                        header={decades}
                        body={data.series}
                        titles={false}
                        showHide={true}
                        ariaHint={`Population Chart for ${title}`} />
                {:catch error}
                    <span>There is a error. {error.message}</span>
                {/await}
            {/if}
        </div>
    </div>
    {#if !noMap}
        {#await lrp then swdata}
            <PopulationMap {title} {swdata} {constants} />
        {/await}
    {/if}
</div>

<style>
    #tagline {
        font-style: italic;
    }

    .noMapTitle {
        height: auto !important;
    }
</style>
