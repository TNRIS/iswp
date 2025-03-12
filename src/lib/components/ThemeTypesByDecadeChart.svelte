<script>
    // @ts-nocheck
    import LineChart from '$lib/components/Charts/LineChart.svelte';
    import IconSpread from '$lib/components/IconSpread.svelte';
    import ThemeSelector from '$lib/components/ThemeSelector.svelte';
    import ChartDataTable from '$lib/components/ChartDataTable.svelte';
    import ctAxisTitle from 'chartist-plugin-axistitle';
    import { commafy, onMountSync } from '$lib/helper.js';

    const { chartTitle, lrp, constants, title="" } = $props();
    let /** @type {visible} */ visible = $state(false);
    let decades = constants.getDecades();
    let titleMap = {
        irrigation: 'Irrigation',
        livestock: 'Livestock',
        manufacturing: 'Manufacturing',
        'steam-electric-power': 'Steam Electric Power',
        mining: 'Mining',
        municipal: 'Municipal'
    };
    const chartOptions = {
        height: '240px',
        lineSmooth: false,
        axisY: {
            low: 0,
            labelInterpolationFnc: function (value) {
                return commafy(value + '');
            }
        },
        chartPadding: {
            left: 40,
            right: 40
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

    let selectedTheme = $state('demands');
    let demands_visible = $state(true);
    let supplies_visible = $state(false);
    let needs_visible = $state(false);
    let strategies_visible = $state(false);
    let show = (event) => {
        selectedTheme = event.target.value;
        switch (event.target.value) {
            case 'demands':
                supplies_visible = false;
                needs_visible = false;
                strategies_visible = false;
                demands_visible = true;
                break;
            case 'supplies':
                demands_visible = false;
                needs_visible = false;
                strategies_visible = false;
                supplies_visible = true;
                break;
            case 'needs':
                demands_visible = false;
                supplies_visible = false;
                strategies_visible = false;
                needs_visible = true;
                break;
            case 'strategies':
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
            name: name
        };
    };

    let buildData = (async () => {
        const swdata = await lrp;
        // Create a simple line chart
        let data = {};
        data.demands = {
            // A labels array that can contain any sort of values
            labels: constants.getDecades(),
            // Our series array that contains series objects or in this case series data arrays
            series: [
                makeSeries('demands', 'mining', usage_types[5], swdata),
                makeSeries('demands', 'livestock', usage_types[4], swdata),
                makeSeries('demands', 'steam-electric-power', usage_types[3], swdata),
                makeSeries('demands', 'manufacturing', usage_types[2], swdata),
                makeSeries('demands', 'municipal', usage_types[1], swdata),
                makeSeries('demands', 'irrigation', usage_types[0], swdata)
            ]
        };

        data.needs = {
            // A labels array that can contain any sort of values
            labels: constants.getDecades(),
            // Our series array that contains series objects or in this case series data arrays
            series: [
                makeSeries('needs', 'irrigation', usage_types[0], swdata),
                makeSeries('needs', 'livestock', usage_types[4], swdata),
                makeSeries('needs', 'manufacturing', usage_types[2], swdata),
                makeSeries('needs', 'steam-electric-power', usage_types[3], swdata),
                makeSeries('needs', 'mining', usage_types[5], swdata),
                makeSeries('needs', 'municipal', usage_types[1], swdata)
            ]
        };

        data.population = {
            // A labels array that can contain any sort of values
            labels: constants.getDecades(),
            // Our series array that contains series objects or in this case series data arrays
            series: [
                makeSeries('population', 'irrigation', usage_types[0], swdata),
                makeSeries('population', 'livestock', usage_types[4], swdata),
                makeSeries('population', 'manufacturing', usage_types[2], swdata),
                makeSeries('population', 'steam-electric-power', usage_types[3], swdata),
                makeSeries('population', 'mining', usage_types[5], swdata),
                makeSeries('population', 'municipal', usage_types[1], swdata)
            ]
        };

        data.strategies = {
            // A labels array that can contain any sort of values
            labels: constants.getDecades(),
            // Our series array that contains series objects or in this case series data arrays
            series: [
                makeSeries('strategies', 'irrigation', usage_types[0], swdata),
                makeSeries('strategies', 'livestock', usage_types[4], swdata),
                makeSeries('strategies', 'manufacturing', usage_types[2], swdata),
                makeSeries('strategies', 'steam-electric-power', usage_types[3], swdata),
                makeSeries('strategies', 'mining', usage_types[5], swdata),
                makeSeries('strategies', 'municipal', usage_types[1], swdata)
            ]
        };

        data.supplies = {
            // A labels array that can contain any sort of values
            labels: constants.getDecades(),
            // Our series array that contains series objects or in this case series data arrays
            series: [
                makeSeries('supplies', 'irrigation', usage_types[0], swdata),
                makeSeries('supplies', 'livestock', usage_types[4], swdata),
                makeSeries('supplies', 'manufacturing', usage_types[2], swdata),
                makeSeries('supplies', 'steam-electric-power', usage_types[3], swdata),
                makeSeries('supplies', 'mining', usage_types[5], swdata),
                makeSeries('supplies', 'municipal', usage_types[1], swdata)
            ]
        };

        return data;
    })();
</script>

<div class="summary-wrapper container" id="point-chart-usage-type">
    <div style="pointer-events:auto;" class="row panel-row">
        <div class="chart-header">
            <div class="row">
                {#if title}
                    <span class="view-name">{title}</span>
                {/if}
                <h4 aria-level="3">
                    {titles[selectedTheme]} by Usage Type
                    <span class="units">(acre-feet/year)</span>
                    <!--<Units />-->
                </h4>
                <!--<UsageTypeChartLegend className="u-pull-right legend-types-by-decade" />-->
                <IconSpread />
            </div>
            <ThemeSelector {show} showPopulation={false} bind:select_theme={selectedTheme} id_pre="usage_type" />
        </div>
        {#await Promise.all([onMountSync(), buildData])}
            <div class="loader"></div>
        {:then data}
            {#if demands_visible}
                <LineChart
                    data={data[1].demands}
                    chartTitle={`${chartTitle}-demands`}
                    altClass={'ct-line-chart-size'}
                    options={chartOptions} />
                <div class="toggle-container">
                    <ChartDataTable
                        bind:visible
                        header={decades}
                        body={data[1].demands.series}
                        titles={true}
                        showHide={true}
                        {titleMap}
                        showTotal={true}
                        ariaHint={`${titles[selectedTheme]} by usage type in acre feet per year`}
                        byDecade={true} />
                </div>
            {/if}
            {#if supplies_visible}
                <LineChart
                    data={data[1].supplies}
                    chartTitle={`${chartTitle}-supplies`}
                    altClass={'ct-line-chart-size'}
                    options={chartOptions} />

                <div class="toggle-container">
                    <ChartDataTable
                        bind:visible
                        header={decades}
                        body={data[1].supplies.series}
                        titles={true}
                        showHide={true}
                        {titleMap}
                        showTotal={true}
                        ariaHint={`${titles[selectedTheme]} by usage type in acre feet per year`}
                        byDecade={true} />
                </div>
            {/if}
            {#if needs_visible}
                <LineChart
                    data={data[1].needs}
                    chartTitle={`${chartTitle}-needs`}
                    altClass={'ct-line-chart-size'}
                    options={chartOptions} />

                <div class="toggle-container">
                    <ChartDataTable
                        bind:visible
                        header={decades}
                        body={data[1].needs.series}
                        titles={true}
                        showHide={true}
                        {titleMap}
                        showTotal={true}
                        ariaHint={`${titles[selectedTheme]} by usage type in acre feet per year`}
                        byDecade={true} />
                </div>
            {/if}
            {#if strategies_visible}
                <LineChart
                    data={data[1].strategies}
                    chartTitle={`${chartTitle}-strategies`}
                    altClass={'ct-line-chart-size'}
                    options={chartOptions} />

                <div class="toggle-container">
                    <ChartDataTable
                        bind:visible
                        header={decades}
                        body={data[1].strategies.series}
                        titles={true}
                        showHide={true}
                        {titleMap}
                        showTotal={true}
                        ariaHint={`${titles[selectedTheme]} by usage type in acre feet per year`}
                        byDecade={true} />
                </div>
            {/if}
        {:catch error}
        <span>There is a error: {error.message}</span>
        {/await}
    </div>
</div>

<style>
    #point-chart-usage-type {
        min-height: 390px;
    }
</style>
