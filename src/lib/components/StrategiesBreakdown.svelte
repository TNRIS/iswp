<script>
    //@ts-nocheck
    const { swdata } = $$props;
    import { calcPercentage, commafy, sortAlphabetic, sortNumeric } from '$lib/helper.js?v1';
    import { getContext, onMount } from 'svelte';
    import { hoverHelper, clearInteraction } from '$lib/actions/HoverAction';
    const decadeStore = getContext('myContext').decadeStore;
    const themeStore = getContext('myContext').themeStore;
    const dataviewContext = getContext('dataviewContext');
    export let title;
    let srttable;
    import 'chartist/dist/index.css';

    import { PieChart } from 'chartist';

    let buildEntries = () => {
        if (!swdata?.strategies?.strategyTypeTotals) return [];
        return Object.entries(swdata.strategies.strategyTypeTotals)
            .sort((a, b) => {
                return b[1][$decadeStore] - a[1][$decadeStore];
            })
            .reduce((accumulator, currentValue) => {
                currentValue[1] = currentValue[1][$decadeStore];
                accumulator.push(currentValue);
                if (stt_entries_empty && currentValue[1]) stt_entries_empty = false;
                return accumulator;
            }, []);
    };
    let stt_entries_empty = true;
    let stt_entries = buildEntries();

    const buildStrats = () => {
        if (!swdata?.strategies?.strategyTypeTotals)
            return {
                labels: [],
                data: []
            };
        return Object.entries(swdata.strategies.strategySourceTotals)
            .sort((a, b) => {
                return b[1][$decadeStore] - a[1][$decadeStore];
            })
            .reduce(
                (accumulator, currentValue) => {
                    accumulator.labels.push(currentValue[0]);
                    accumulator.data.push({
                        value: currentValue[1][$decadeStore],
                        name: currentValue[0],
                        className: `series-${currentValue[0]}`.replace(' ', '-').toLowerCase()
                    });
                    if (strats_empty && currentValue[1][$decadeStore]) strats_empty = false;

                    return accumulator;
                },
                {
                    labels: [],
                    data: []
                }
            );
    };

    let strats_empty = true;
    let strats = buildStrats();

    // Run a function to reset stt_entries_empty if stt_entries is modified. I need fine control over when entries and stats are updated. So I check decadeStore change.
    $: if ($decadeStore) {
        stt_entries_empty = true;
        strats_empty = true;
        stt_entries = buildEntries();
        strats = buildStrats();
    }

    $: if ($themeStore) {
        stt_entries_empty = true;
        strats_empty = true;
        stt_entries = buildEntries();
        strats = buildStrats();
    }

    let buildCtchart = async () => {
        var data = {
            labels: strats.labels,
            series: strats.data
        };

        let total = 0;
        // Remove items without any data in reverse because this won't alter index when multiple items are 0;
        // Also calculate total;
        for (let i = data.series.length - 1; i >= 0; i--) {
            if (data.series[i].value === 0) {
                data.series.splice(i, 1);
                data.labels.splice(i, 1);
            } else {
                total += data.series[i].value;
            }
        }
        if (data?.series?.length === 1 && data.series[0]?.className) data.series[0].className += ' single-slice';

        var responsiveOptions = [
            [
                'screen and (min-width: 640px)',
                {
                    chartPadding: 0,
                    labelOffset: 10,
                    labelDirection: 'neutral',
                    labelPosition: 'neutral',
                    preventOverlappingLabelOffset: 6,
                    labelInterpolationFnc: function (value, i) {
                        return `${value}  (${Math.round((data.series[i].value / total) * 100 * 10) / 10.0}%)`;
                    }
                }
            ],
            [
                'screen and (min-width: 1024px)',
                {
                    chartPadding: 0
                }
            ]
        ];

        new PieChart(
            '.strat-chart',
            data,
            {
                labelInterpolationFnc: function (value) {
                    return value[0];
                },
                width: '100%',
                height: 250,
                startAngle: 270
            },
            responsiveOptions
        );
    };

    onMount(() => {
        buildCtchart();
    });

    let onHover = (event) => {
        hoverHelper(event, 'strat-chart');
    };

    let onLeave = () => {
        clearInteraction('strat-chart');
    };

    dataviewContext.buildPie.set(buildCtchart);
    $: checkShow = !($themeStore == 'strategies');
</script>

<div class="strategies-breakdown-container row panel-row" class:hider={checkShow}>
    {#if title}
        <span class="view-name">{title}</span>
    {/if}
    <div class="row">
        <h4 aria-level="3">Strategy Supplies Breakdown - {$decadeStore}<span class="units">(acre-feet/year)</span></h4>
    </div>
    {#if !strats_empty && !stt_entries_empty}
        <div class="row">
            <div class="six columns strategies-by-source-type-container">
                <h5 aria-level="4" for="share_by_water_resource_chart">Share by Water Resource</h5>
                <div
                    class="pie-chart-container"
                    title="Pie Chart describing Water Share usage percentages."
                    aria-label="Pie Chart describing Water Share usage percentages."
                    role="figure"
                    id="share_by_water_resource_chart">
                    <div class="strat-chart" on:mousemove={onHover} on:mouseleave={onLeave} role="presentation" />
                </div>
                <div id="strat-chart-tooltip" />
            </div>
            <div class="six columns strategies-by-source-type-container">
                <h5 id="sharelabel">Share by Strategy Type</h5>
                <table
                    class="table-condensed u-full-width strategies-by-type-table"
                    aria-describedby="sharelabel"
                    role="grid"
                    bind:this={srttable}>
                    <tr id="strat_header">
                        <th
                            on:click={() => {
                                sortAlphabetic(srttable, 0, false);
                            }}>Strategy Type</th>
                        <th
                            on:click={() => {
                                sortNumeric(srttable, 1, '(', ')', false);
                            }}>Amount</th>
                    </tr>
                    {#each stt_entries as t}
                        {#if t[1] > 0}
                            <tr>
                                <td role="link"><a href="/wmstype/{t[0]}">{t[0]}</a></td>
                                <td>
                                    {`${calcPercentage(stt_entries, t[1])} (${commafy(t[1].toString())})`}
                                </td>
                            </tr>
                        {/if}
                    {/each}
                </table>
            </div>
        </div>
    {:else}
        <span>The strategies do not affect any water user groups in the chosen decade: {$decadeStore}</span>
    {/if}
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
    #strat_header {
        cursor: pointer;
    }
</style>
