<script>
    //@ts-nocheck
    const { swdata } = $$props;
    import { calcPercentage, commafy, sortAlphabetic, sortNumeric } from "$lib/helper.js";
    import { getContext, onMount } from "svelte";
    import { hoverHelper, clearInteraction } from "$lib/actions/HoverAction";
    const decadeStore = getContext("myContext").decadeStore;
    const themeStore = getContext("myContext").themeStore;
    const dataviewContext = getContext("dataviewContext");

    let srttable;
    import "chartist/dist/index.css"

    import { PieChart } from 'chartist';
    $: stt_entries = Object.entries(swdata.strategies.strategyTypeTotals)
        .sort((a, b) => {
            return b[1][$decadeStore] - a[1][$decadeStore];
        })
        .reduce((accumulator, currentValue) => {
            currentValue[1] = currentValue[1][$decadeStore];
            accumulator.push(currentValue);
            return accumulator;
        }, []);

    $: strats = Object.entries(swdata.strategies.strategySourceTotals)
        .sort((a, b) => {
            return b[1][$decadeStore] - a[1][$decadeStore];
        })
        .reduce(
            (accumulator, currentValue) => {
                accumulator.labels.push(currentValue[0]);
                accumulator.data.push({
                    value: currentValue[1][$decadeStore],
                    name: currentValue[0],
                    className: `series-${currentValue[0]}`
                        .replace(" ", "-")
                        .toLowerCase(),
                });
                return accumulator;
            },
            {
                labels: [],
                data: [],
            }
        );

    let buildCtchart = async () => {
        var data = {
            labels: strats.labels,
            series: strats.data,
        };

        let total = 0;
        // Remove items without any data in reverse because this won't alter index when multiple items are 0;
        // Also calculate total;
        for(let i = data.series.length - 1; i >= 0; i--) {
            if(data.series[i].value === 0) {
                data.series.splice(i, 1);
                data.labels.splice(i, 1);
            } else {
                total += data.series[i].value;
            }
        };
        

        var responsiveOptions = [
            [
                "screen and (min-width: 640px)",
                {
                    chartPadding: 30,
                    labelOffset: 10,
                    labelDirection: "explode",
                    labelInterpolationFnc: function (value, i) {
                        return `${value}  (${Math.round((((data.series[i].value / total) * 100)) * 10) / 10.0}%)`;
                        return value;
                    },
                },
            ],
            [
                "screen and (min-width: 1024px)",
                {
                    labelOffset: 10,
                    chartPadding: 20,
                },
            ],
        ];

        new PieChart(
            ".strat-chart",
            data,
            {
                labelInterpolationFnc: function (value) {
                    return value[0];
                },
                width: "100%",
                height: 250,
            },
            responsiveOptions
        );
    };

    onMount(() => {
        buildCtchart();
    });

    let onHover = (event) => {
        hoverHelper(event, "strat-chart");
    };

    let onLeave = () => {
        clearInteraction("strat-chart");
    };

    dataviewContext.buildPie.set(buildCtchart);
    $: checkShow = !($themeStore == "strategies");
</script>

<div class="strategies-breakdown-container row panel-row" class:hider={checkShow}>
    <div class="row">
        <h4>Strategy Supplies Breakdown - {$decadeStore}<span class="units">(acre-feet/year)</span></h4>
    </div>
    <div class="row">
        <div class="six columns strategies-by-source-type-container">

            <h5>Share by Water Resource</h5>
            <div class="pie-chart-container">
                <div class="strat-chart" 
                on:mousemove={onHover}
                on:mouseleave={onLeave}
                />
            </div>
            <div id='strat-chart-tooltip' />
        </div>
        <div class="six columns strategies-by-source-type-container">
            <h5>Share by Strategy Type</h5>
            <table
                class="table-condensed u-full-width strategies-by-type-table"
                bind:this={srttable}
            >
                {#if swdata?.strategies?.strategyTypeTotals}
                    <tr>
                        <th on:click={() => {sortAlphabetic(srttable, 0, false)}}>Strategy Type</th>
                        <th on:click={() => {sortNumeric(srttable, 1, '(', ')', false)}}>Amount</th>
                    </tr>
                    {#each stt_entries as t}
                        {#if t[1] > 0}
                        <tr>
                            <td><a href="/wmstype/{t[0]}">{t[0]}</a></td>
                            <td>
                                {`${calcPercentage(stt_entries, t[1])} (${commafy(t[1].toString())})`}
                            </td>
                        </tr>
                        {/if}
                    {/each}
                {:else}
                    <span>No Strategy types found</span>
                {/if}
            </table>
        </div>
    </div>
</div>

<style>
    .hider {
        display: none;
    }
    .strat-chart .ct-label {
        font-size: 1rem !important;
        color: #000 !important;
        fill: #000 !important;
    }
</style>
