<script>
    // @ts-nocheck
    import { onMount } from 'svelte';
    //import TitlePlugin from './ChartistAxisTitlePlugin';
    import { commafy } from '$lib/helper.js';
    import { hoverHelper, clearInteraction } from '$lib/actions/HoverAction';
    import ctAxisTitle from 'chartist-plugin-axistitle';
    import 'chartist/dist/index.css';
    import { BarChart } from 'chartist';
    const { iterator, data, group_name, chartTitle, constants } = $$props;

    /**
     * Checks data series to see if it is all zeroes
     * @param {*} chartData
     * @return {boolean}
     */
    function isAllZero() {
        let group = data[group_name];

        // Return false if anything in any of the keys are non zero.
        // Use regular for Loop not a forEach to return out of isAllZero function.
        for (let i = 0; i < group.length; i++) {
            let series = group[i].data;
            for (let j = 0; j < series.length; j++) {
                if (series[j]) return false;
            }
        }
        //If we get through the above loop without a match all items are zero.
        return true;
    }

    let buildChart = () => {
        const defaultOptions = {
            fullWidth: false,
            width: '100%',
            seriesBarDistance: 10,
            chartPadding: {
                left: 40
            },
            height: '200px',
            axisY: {
                low: 0,
                labelInterpolationFnc: function (value) {
                    return commafy(value + '');
                }
            },
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

        const responsiveOptions = [
            [
                'screen and (max-width: 550px)',
                {
                    seriesBarDistance: 7
                }
            ]
        ];

        //const chartOptions = R.merge(defaultOptions, {});
        new BarChart(
            `.ct-chart-bar-${iterator}`,
            {
                labels: constants.getDecades(),
                series: data[group_name]
            },
            defaultOptions,
            responsiveOptions
        );
    };

    onMount(async () => {
        buildChart();
    });

    let onHover = (event) => {
        hoverHelper(event, chartTitle);
    };

    let onLeave = () => {
        clearInteraction(chartTitle);
    };
</script>

<div class="bar-chart-container">
    {#if isAllZero()}
        <div class="zero-message">All values are zero</div>
    {/if}
    <div class="ct-chart">
        <div
            on:mouseover={onHover}
            on:focus
            on:mouseleave={onLeave}
            on:mouseout={onLeave}
            on:blur
            class="{chartTitle} ct-chart-bar-{iterator} ct-chart"
            role="region" />
        <div role="tooltip" id={`${chartTitle}-tooltip`} />
    </div>
</div>
