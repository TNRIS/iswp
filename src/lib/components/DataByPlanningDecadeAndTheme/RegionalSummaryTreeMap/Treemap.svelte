<script>
    //@ts-nocheck
    import { onMount } from 'svelte';
    import { buildZoomable } from '$lib/zoomBarChart.js';
    import { getContext, setContext } from 'svelte';

    export let { treemapData, container, total, themeStore } = $$props;
    const dataviewContext = getContext('dataviewContext');
    let selectedTreemapStore = dataviewContext.selectedTreemap;
    onMount(() => {
        // Initialize to clarify the use of "region"
        let selectedTreemap = 'region';
        let svg = buildZoomable(container, treemapData, selectedTreemap, total, themeStore);
        container.appendChild(svg);
    });

    const bindTreeMap = (df, selectedTreemap) => {
        if (selectedTreemap) {
            dataviewContext.selectedTreemap.set(selectedTreemap);
        } else {
            selectedTreemap = $selectedTreemapStore;
        }
        let svg = buildZoomable(container, df, selectedTreemap, undefined, themeStore);
        container.removeChild(container.firstChild);
        container.appendChild(svg);
    };

    dataviewContext.bindTreeMap.set(bindTreeMap);
</script>

<div
    class="treemap-chart"
    id="treemap-chart"
    title={`Interactive treemap chart displaying by ${$selectedTreemapStore}`}
    aria-label={`Interactive treemap chart displaying by ${$selectedTreemapStore}`}>
    <div bind:this={container} />
</div>
