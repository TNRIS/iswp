<script>
    // @ts-nocheck
    import DataViewChoiceSelectors from "./DataViewChoiceSelectors.svelte";
    import RegionalSummaryTable from "$lib/components/RegionalSummaryTable.svelte";
    import RegionalSummaryTreeMap from "$lib/components/DataByPlanningDecadeAndTheme/RegionalSummaryTreeMap/RegionalSummaryTreeMap.svelte";
    import StrategiesBreakdown from "$lib/components/StrategiesBreakdown.svelte";
    import { setContext } from "svelte";
    import { writable } from "svelte/store";
    const { db, lrp, csvTitle, constants } = $$props;

    let decadeStore = writable(constants.getDecades()[0]);
    let themeStore = writable("strategies");
    let ruStore = writable("region");
    let selectedTreemapStore = writable("region");
    // Establish root for myContext here.
    setContext("myContext", {
        decadeStore,
        themeStore,
        ruStore,
    });

    // Establish root for dataviewContext here.
    setContext("dataviewContext", {
        datafix: writable(),
        getData: writable(),
        bindTreeMap: writable(),
        buildPie: writable(),
        selectedTreemap: selectedTreemapStore
    });

</script>

<div class="view-choice-wrap">
    <div class="view-choice-container sticky-div-2">
        <h4>Data by Planning Decade and Theme</h4>
        <DataViewChoiceSelectors hideTheme={false} showPopulation={true} {constants} />
    </div>
    <!-- insert 3 sub-widgets here -->
    <div class="container">
        {#await lrp}
        <div class="loader"></div>
        {:then swdata}
        <RegionalSummaryTreeMap {db} selectedTreemap={"region"}/>
        <StrategiesBreakdown {swdata} />
        <RegionalSummaryTable {db} {swdata} {csvTitle} {constants} />
        {/await}
    </div>
</div>
