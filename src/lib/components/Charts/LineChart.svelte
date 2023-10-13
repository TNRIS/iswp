<script>
    //@ts-nocheck
    const { data, chartTitle, options } = $$props;
    import { onMount } from "svelte";
    import { hoverHelper, clearInteraction } from "$lib/actions/HoverAction";

    let buildChart = () => {
        // In the global name space Chartist we call the Line function to initialize a line chart. As a first parameter we pass in a selector where we would like to get our chart created. Second parameter is the actual data object and as a third parameter we pass in our options
        //console.log("Data: " + JSON.stringify(data));
        //console.log("Options: " + JSON.stringify(options));
        try {
            new Chartist.Line(`.${chartTitle}`, data, options);
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

<!-- Line Chart -->
<div style="position:relative">
    <div
        class={`${chartTitle} ct-chart`}
        on:mouseover={onHover}
        on:focus
        on:mouseleave={onLeave}
        on:mouseout={onLeave}
        on:blur
    />
    <div id={`${chartTitle}-tooltip`} />
</div>
