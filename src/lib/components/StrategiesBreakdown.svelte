<script>
    //@ts-nocheck
    const { swdata } = $$props;
    import { calcPercentage } from "$lib/helper.js";
    import { getContext, onMount } from "svelte";
    const decadeStore = getContext("myContext").decadeStore;
    const themeStore = getContext("myContext").themeStore;
    const dataviewContext = getContext("dataviewContext");

    $: stt_entries = Object.entries(swdata.strategies.strategyTypeTotals)
        .sort((a, b) => {
            return b[1][$decadeStore] - a[1][$decadeStore];
        })
        .reduce((accumulator, currentValue, index) => {
            if (index == 1) {
                let body = [];
                accumulator[1] = accumulator[1][$decadeStore];
                body.push(accumulator);
                accumulator = body;
            }
            currentValue[1] = currentValue[1][$decadeStore];
            accumulator.push(currentValue);
            return accumulator;
        });

    $: strats = Object.entries(swdata.strategies.strategySourceTotals)
        .sort((a, b) => {
            return b[1][$decadeStore] - a[1][$decadeStore];
        })
        .reduce((accumulator, currentValue, index) => {
            if (index == 1) {
                accumulator = {
                    labels: [accumulator[0]],
                    data: [
                        {
                            value: accumulator[1][$decadeStore],
                            name: accumulator[0],
                            className: `series-${accumulator[0]}`
                                .replace(" ", "-")
                                .toLowerCase(),
                        },
                    ],
                };
            }
            accumulator.labels.push(currentValue[0]);
            accumulator.data.push({
                value: currentValue[1][$decadeStore],
                name: currentValue[0],
                className: `series-${currentValue[0]}`
                    .replace(" ", "-")
                    .toLowerCase(),
            });
            return accumulator;
        });

    let buildCtchart = async () => {
        var data = {
            labels: strats.labels,
            series: strats.data,
        };

        var responsiveOptions = [
            [
                "screen and (min-width: 640px)",
                {
                    chartPadding: 30,
                    labelOffset: 10,
                    labelDirection: "explode",
                    labelInterpolationFnc: function (value) {
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

        new Chartist.Pie(
            ".strat-chart",
            data,
            {
                labelInterpolationFnc: function (value) {
                    return value[0];
                },
                width: "100%",
                height: 250
            },
            responsiveOptions
        );
    };

    onMount(() => {
        buildCtchart();
    });
    dataviewContext.buildPie.set(buildCtchart)
    $: checkShow = !($themeStore == "strategies");
</script>

<div class="strategies-breakdown-container" class:hider={checkShow}>
    <div class="row panel-row">
        <div class="six columns strategies-by-source-type-container">
            <h4>Strategy Supplies Breakdown - {$decadeStore}</h4>

            <h5>Share by Water Resource</h5>
            <div class="pie-chart-container">
                <div class="strat-chart" />
            </div>
        </div>
        <div class="six columns strategies-by-source-type-container">
            <h5>Share by Strategy Type</h5>
            <table
                class="table-condensed u-full-width strategies-by-type-table"
            >
                {#if swdata?.strategies?.strategyTypeTotals}
                    <tr>
                        <th>Strategy Type</th>
                        <th>Amount</th>
                    </tr>
                    {#each stt_entries as t}
                        <tr>
                            <td>{t[0]}</td>
                            <td>
                                {calcPercentage(stt_entries, t[1])}
                            </td>
                        </tr>
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
</style>

<script>
    //@ts-nocheck
    const { swdata } = $$props;
    import { calcPercentage, onMountSync } from "$lib/helper.js";
    import { getContext } from "svelte";
    const decadeStore = getContext("myContext").decadeStore;
    const themeStore = getContext("myContext").themeStore;

    $: stt_entries = Object.entries(swdata.strategies.strategyTypeTotals)
        .sort((a, b) => {
            return b[1][$decadeStore] - a[1][$decadeStore];
        })
        .reduce((accumulator, currentValue, index) => {
            if (index == 1) {
                let body = [];
                accumulator[1] = accumulator[1][$decadeStore];
                body.push(accumulator);
                accumulator = body;
            }
            currentValue[1] = currentValue[1][$decadeStore];
            accumulator.push(currentValue);
            return accumulator;
        })
        
        $: keyz = stt_entries.reduce((accumulator, currentValue, index) => {
            if (index == 1) {
                accumulator = [accumulator[1]]
            }
            accumulator.push(currentValue[1])
            return accumulator
        });

    let buildCtchart = async () => {
        await onMountSync();
        var data = {
            series: keyz,
        };

        var sum = function (a, b) {
            return a + b;
        };

        new Chartist.Pie(".strat-chart", data, {
            labelInterpolationFnc: function (value) {
                return (
                    Math.round((value / data.series.reduce(sum)) * 100) + "%"
                );
            },
        });
    };

    buildCtchart();

    $: checkShow = !($themeStore == "strategies");
</script>


<div class="twelve columns" class:hider={checkShow}>
    <div class="strategies-breakdown-container">
        <h4>Strategy Supplies Breakdown - {$decadeStore}</h4>
        <div class="row">
            <div class="six columns strategies-by-type-container">
                <h5>Share by Water Resource</h5>
                <div class="strat-chart" />
            </div>
            <div class="six columns strategies-by-source-type-container">
                <h5>Share by Strategy Type</h5>
                <table
                    class="table-condensed u-full-width strategies-by-type-table"
                >
                    {#if swdata?.strategies?.strategyTypeTotals}
                        <tr>
                            <th>Strategy Type</th>
                            <th>Amount</th>
                        </tr>
                        {#each stt_entries as t}
                            <tr>
                                <td>{t[0]}</td>
                                <td>
                                    {calcPercentage(stt_entries, t[1])}
                                </td>
                            </tr>
                        {/each}
                    {:else}
                        <span>No Strategy types found</span>
                    {/if}
                </table>
            </div>
        </div>
    </div>
</div>

<style>
    .hider {
        display:none;
    }
</style>