<script>
    //@ts-nocheck
    const { data, chartTitle, options, altClass } = $$props;
    import { onMount } from 'svelte';
    import { hoverHelper, clearInteraction } from '$lib/actions/HoverAction';
    import 'chartist/dist/index.css';
    import { LineChart } from 'chartist';

    let buildChart = () => {
        // In the global name space Chartist we call the Line function to initialize a line chart. As a first parameter we pass in a selector where we would like to get our chart created. Second parameter is the actual data object and as a third parameter we pass in our options
        try {
            new LineChart(`.${chartTitle}`, data, options);
        } catch (err) {
            console.error(err);
        }
    };
    onMount(() => {
        buildChart();
    });

    let onHover = (event) => {
        hoverHelper(event, chartTitle);
    };

    let onLeave = () => {
        clearInteraction(chartTitle);
    };
</script>

<!-- Line Chart is hidden for aria due to the same data being presented in table form in an easier format in the table. -->
<div style="position:relative" aria-hidden="true" role="presentation">
    <div class={`${chartTitle} ct-chart ${altClass}`} on:mouseover={onHover} on:focus on:mouseleave={onLeave} on:mouseout={onLeave} on:blur />
    <div id={`${chartTitle}-tooltip`} />
</div>

<style>
    .ct-line-chart-size {
        min-height: 250px;
    }
</style>