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