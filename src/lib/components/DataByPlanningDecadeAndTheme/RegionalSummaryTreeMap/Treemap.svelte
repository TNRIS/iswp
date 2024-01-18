<script>
    //@ts-nocheck
    import { onMount } from "svelte";
    import { buildZoomable } from "$lib/zoomBarChart.js"
    import { getContext } from "svelte";

    export let { treemapData, container } = $$props;
    const dataviewContext = getContext('dataviewContext');

    onMount(() => {
        // Initialize to clarify the use of "region"
        let selectedTreemap = "region";
        let svg = buildZoomable(container, treemapData, selectedTreemap);
        container.appendChild(svg);
    });
    
    const bindTreeMap = (df, selectedTreemap) => {
        let svg = buildZoomable(container, df, selectedTreemap);
        container.removeChild(container.firstChild);
        container.appendChild(svg);
    }

    dataviewContext.bindTreeMap.set(bindTreeMap);
</script>
<div class="treemap-chart">
    <div bind:this={container} />
</div>
