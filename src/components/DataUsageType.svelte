<script>
    // @ts-nocheck

    import ChartLegend from "./ChartLegend.svelte";
    import PropTypes from "prop-types";
    import * as R from "ramda";
    //import constants from '../../constants';
    import { Constant2022 } from "../lib/Constant2022.js";
    import PopulationChart from "./Charts/PopulationChart.svelte";
    import BarChart from "./Charts/BarChart.svelte";
    import UsageTypeIcon from "./UsageTypeIcon.svelte";
    import { onMount } from "svelte";
    import ChartDataTable from "./ChartDataTable.svelte";
    import titleize from "titleize";
    import Statewide from "../lib/db/statewide.js";
    const { swdata } = $$props;

    const c22 = new Constant2022();
    function slugify(s) {
        return s.replace(/\s+/g, "-");
    }

    const everyTwoTypes = R.splitEvery(2, c22.getUsageTypes());
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
                c22.getUsageTypes().forEach((type) => {
                    seriesByType[type] = c22.getThemes().map((theme) => {
                        return {
                            name: c22.getThemeTitles()[theme],
                            meta: theme,
                            className: `series-${theme}`,
                            data: c22.getDecades().map((year) => {
                                if (R.path([theme, "typeTotals", type], a)) {
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
                    <!-- <ChartLegend rectangle className="u-pull-right" entries={legendEntries}/> -->
                </div>

                {#await getData()}
                    <span>Loading</span>
                {:then data}
                    {#each everyTwoTypes as group_name, i}
                        <div class="row" key={i}>
                            <div class="six columns wide type-chart-container">
                                <UsageTypeIcon group_name={group_name[0]} />
                                <h5
                                    class={"heading-" +
                                        slugify(group_name[0].toLowerCase())}
                                >
                                    {titleize(group_name[0])}
                                </h5>
                                <BarChart
                                    iterator={i}
                                    {data}
                                    group_name={group_name[0]}
                                />
                                <ChartDataTable
                                    header={c22.getDecades()}
                                    body={data[group_name[0]]}
                                    titles={true}
                                    showHide={true}
                                    >inner in datausagetype</ChartDataTable
                                >
                            </div>

                            <div class="six columns wide type-chart-container">
                                <UsageTypeIcon group_name={group_name[1]} />
                                <h5
                                    class={"heading-" +
                                        slugify(group_name[1].toLowerCase())}
                                >
                                    {titleize(group_name[1])}
                                </h5>
                                <BarChart
                                    iterator={(i + 1) * 999}
                                    {data}
                                    group_name={group_name[1]}
                                />
                                <ChartDataTable
                                    header={c22.getDecades()}
                                    body={data[group_name[1]]}
                                    titles={true}
                                    showHide={true}
                                    >Inner in data usage type</ChartDataTable
                                >
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
