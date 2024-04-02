<script>
    // @ts-nocheck
    import { split_every } from "$lib/helper.js";
    import BarChart from "./Charts/BarChart.svelte";
    import UsageTypeIcon from "./UsageTypeIcon.svelte";
    import { onMount } from "svelte";
    import ChartDataTable from "$lib/components/ChartDataTable.svelte";
    import { slugify } from "$lib/helper.js";
    import ColorCodeSpread from "$lib/components/ColorCodeIcons/ColorCodeSpread.svelte";
    const { swdata, constants } = $$props;

    const everyTwoTypes = split_every(2, constants.getUsageTypes());

    let dataUsageTypeData;
    var getData = () => {
        return new Promise((resolve, reject) => {
            onMount(async () => {
                try {
                    dataUsageTypeData = await buildDataUsageTypeData(swdata);

                    resolve(dataUsageTypeData);
                } catch (err) {
                    reject(err);
                }
            });
        });
    };

    let buildDataUsageTypeData = (a) => {
        return new Promise((resolve, reject) => {
            try {
                let seriesByType = {};
                constants.getUsageTypes().forEach((type) => {
                    seriesByType[type] = constants.getThemes().map((theme) => {
                        return {
                            name: constants.getThemeTitles()[theme],
                            meta: theme,
                            className: `series-${theme}`,
                            data: constants.getDecades().map((year) => {
                                if (a?.[theme]?.typeTotals?.[type]) {
                                    return a[theme].typeTotals[type][year];
                                }
                                return 0;
                            }),
                        };
                    });
                });
                resolve(seriesByType);
            } catch (err) {
                reject(err);
            }
        });
    };
</script>

<div class="container">
    <div>
        <div class="clear-float u-full-width">
            <div class="row panel-row">
                <div class="chart-header">
                    <h4>
                        Data by Usage Type
                        <span class="units">(acre-feet/year)</span>
                    </h4>
                    <ColorCodeSpread />
                </div>

                {#await getData()}
                    <div class="loader"></div>

                {:then data}
                    {#each everyTwoTypes as group_name, i}
                        <div class="row" key={i} id="bar_chart_container_dut">
                            <div class="six columns wide type-chart-container">
                                <UsageTypeIcon group_name={group_name[0]} />
                                <h5
                                    class={"cap heading-" +
                                        slugify(group_name[0].toLowerCase())}
                                >
                                    {group_name[0].toLowerCase()}
                                </h5>
                                <BarChart
                                    iterator={i}
                                    {data}
                                    group_name={group_name[0]}
                                    chartTitle={group_name[0] + '-bc'}
                                    {constants}
                                />
                                <ChartDataTable
                                    header={constants.getDecades()}
                                    body={data[group_name[0]]}
                                    titles={true}
                                    showHide={true}
                                />
                            </div>

                            <div class="six columns wide type-chart-container">
                                <UsageTypeIcon group_name={group_name[1]} />
                                <h5
                                    class={"cap heading-" +
                                        slugify(group_name[1].toLowerCase())}
                                >
                                    {group_name[1].toLowerCase()}
                                </h5>
                                <BarChart
                                    iterator={(i + 1) * 999}
                                    {data}
                                    group_name={group_name[1]}
                                    chartTitle={group_name[0] + '-bc'}
                                    {constants}
                                />
                                <ChartDataTable
                                    header={constants.getDecades()}
                                    body={data[group_name[1]]}
                                    titles={true}
                                    showHide={true}
                                />
                            </div>
                        </div>
                    {/each}
                {:catch error}
                    <div>Error: {error.message}</div>
                {/await}
            </div>
        </div>
    </div>
</div>
<style>
    .cap {
        text-transform:capitalize;
    }
    #bar_chart_container_dut {
        padding-top: 1em;
    }
</style>