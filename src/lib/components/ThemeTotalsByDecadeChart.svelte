<script>
    import BarChart from '$lib/components/Charts/BarChart.svelte';
    const { lrp, wugRegionFilter, constants, title } = $$props;
    import ChartDataTable from '$lib/components/ChartDataTable.svelte';
    import { commafy } from '$lib/helper.js';
    import ColorCodeSpread from '$lib/components/ColorCodeIcons/ColorCodeSpread.svelte';

    let /** @type {boolean} */ visible;
    const chartOptions = {
        height: '200px',
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
        fullWidth: true
    };

    let dfunc = (dat, id) => {
        if (!dat[id].rows) {
            return [0, 0, 0, 0, 0];
        }
        let d = constants.getDecades();
        let data = [];
        for (let i = 0; i < d.length; i++) {
            data.push(dat[id].decadeTotals[d[i]]);
        }
        return data;
    };

    let getData = () => {
        return new Promise(async (resolve, reject) => {
            let swdata = await lrp;
            try {
                const titles = constants.getThemeTitles();
                const data2 = [
                    {
                        name: titles['demands'],
                        meta: 'demands',
                        className: `series-demands`,
                        data: dfunc(swdata, 'demands')
                    },
                    {
                        name: titles['supplies'],
                        meta: 'supplies',
                        className: `series-supplies`,
                        data: dfunc(swdata, 'supplies')
                    },
                    {
                        name: titles['needs'],
                        meta: 'needs',
                        className: `series-needs`,
                        data: dfunc(swdata, 'needs')
                    },
                    {
                        name: titles['strategies'],
                        meta: 'strategies',
                        className: `series-strategies`,
                        data: dfunc(swdata, 'strategies')
                    }
                ];

                resolve({
                    TBD: data2
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
                            })
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
    <div style="pointer-events:auto;" class="row panel-row">
        <div class="twelve columns">
            {#if title}
                <span class="view-name">{title}</span>
            {/if}
            <div>
                <div class="chart-header">
                    <h4 aria-level="3">
                        Totals by Decade
                        <span class="units">(acre-feet/year)</span>
                    </h4>
                    <ColorCodeSpread />
                </div>

                {#await getData()}
                    <div class="loader"></div>
                {:then data}
                    <BarChart
                        iterator={'tbd'}
                        {data}
                        group_name={'TBD'}
                        chartTitle={'theme-totals-by-decade'}
                        {constants}
                        title={'Theme Totals By Decade Bar Chart'} />
                    <ChartDataTable
                        bind:visible={visible}
                        header={constants.getDecades()}
                        body={data['TBD']}
                        titles={true}
                        showHide={false}
                        ariaHint={'Theme Totals By Decade'} />
                {:catch error}
                    <span>
                        There is an error getting totals by decade. {error.message}
                    </span>
                {/await}
            </div>
        </div>
    </div>
</div>
