<script>
    // @ts-nocheck
    import format from "format-number";
    import titleize from "titleize";
    import * as R from "ramda";
    import { onMount } from "svelte";
    import { Constant2022 } from "$lib/Constant2022.js";
    //import TitlePlugin from './ChartistAxisTitlePlugin';

    const c22 = new Constant2022();

    const { iterator, data, group_name } = $$props;

    /**
     * Checks data series to see if it is all zeroes
     * @param {*} chartData
     * @return {boolean}
     */
    function isAllZero() {
        for (let i = 0; i < data.series.length; i++) {
            const s = data.series[i];
            for (let j = 0; j < s.data.length; j++) {
                if (s.data[j] !== 0) {
                    return false;
                }
            }
        }
        return true;
    }

    let buildChart = () => {
        const defaultOptions = {
            fullWidth: false,
            width: "100%",
            seriesBarDistance: 10,
            chartPadding: {
                left: 40,
            },
            axisY: {
                labelInterpolationFnc: format(),
            },
            height: "200px",
        };

        const responsiveOptions = [
            [
                "screen and (max-width: 550px)",
                {
                    seriesBarDistance: 7,
                },
            ],
        ];

        //const chartOptions = R.merge(defaultOptions, {});
        new Chartist.Bar(
            `.ct-chart-bar-${iterator}`,
            {
                labels: c22.getDecades(),
                series: data[group_name],
            },
            defaultOptions,
            responsiveOptions
        );
    };

    onMount(async () => {
        buildChart();
    });

    let hover = () => {
        console.log("Hover");
    };
</script>

<div class="bar-chart-container">
    <div
        on:mouseover={hover}
        on:focus
        class="ct-chart-bar-{iterator} ct-chart"
    />
</div>
