<script>
    // @ts-nocheck
    import format from "format-number";
    import BarChart from "./Charts/BarChart.svelte";
    const { swdata, wugRegionFilter } = $$props;
    import Statewide from "../lib/db/statewide.js";
    import { Constant2022 } from "../lib/Constant2022.js";
    const c22 = new Constant2022();
    import * as R from "ramda";
    import ChartDataTable from "./ChartDataTable.svelte";

    const chartOptions = {
        height: "200px",
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
    };

    let dfunc = (dat, id) => {
        let d = c22.getDecades();
        let data = [];
        for (let i = 0; i < d.length; i++) {
            data.push(dat[id].decadeTotals[d[i]]);
        }
        return data;
    };

    let getData = () => {
        return new Promise(async (resolve, reject) => {
            try {
                let data2 = [
                    {
                        name: "Demands",
                        meta: "demands",
                        className: "series-demands",
                        data: dfunc(swdata, "demands"),
                    },
                    {
                        name: "Supplies",
                        meta: "supplies",
                        className: "series-supplies",
                        data: dfunc(swdata, "supplies"),
                    },
                    {
                        name: "Needs",
                        meta: "needs",
                        className: "series-needs",
                        data: dfunc(swdata, "needs"),
                    },
                    {
                        name: "Strategies",
                        meta: "strategies",
                        className: "series-strategies",
                        data: dfunc(swdata, "strategies"),
                    },
                ];

                resolve({
                    TBD: data2,
                });
            } catch (err) {
                reject(err);
            }
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

<div class="summary-wrapper container">
    <div style="pointer-events:auto; height:344px;" class="row panel-row">
        <div class="chart-header">
            <h4>Totals by Decade<span class="units">(acre-feet/year)</span></h4>
            {#await getData()}
                <span>Loading</span>
            {:then data}
                <BarChart iterator={"tbd"} {data} group_name={"TBD"} />
                <ChartDataTable
                    header={c22.getDecades()}
                    body={data["TBD"]}
                    titles={true}
                    >inner in datausagetype showHide={false}
                </ChartDataTable>
            {:catch error}
                <span>There is an error getting totals by decade. {error.message}</span>
            {/await}
        </div>
    </div>
</div>
