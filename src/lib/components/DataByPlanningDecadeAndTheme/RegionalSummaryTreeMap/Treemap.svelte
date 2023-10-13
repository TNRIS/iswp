<script>
    //@ts-nocheck
    import { onMount } from "svelte";
    import {buildZoomable} from "$lib/zoomBarChart.js"
    import { getContext } from "svelte";

    export let { treemapData, container } = $$props;
    const dataviewContext = getContext('dataviewContext');

    onMount(() => {
        let svg = buildZoomable(container, treemapData);
        container.appendChild(svg);
    });
    
    const bindTreeMap = (df) => {
        let svg = buildZoomable(container, df);
        container.removeChild(container.firstChild);
        container.appendChild(svg);
    }

    dataviewContext.bindTreeMap.set(bindTreeMap);
</script>
<div class="treemap-chart">
    <div bind:this={container} />
</div>
