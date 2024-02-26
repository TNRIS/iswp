<script>
    // @ts-nocheck
    import DataViewChoiceSelectors from "./DataViewChoiceSelectors.svelte";
    import PivotTable from "./PivotTable.svelte";
    import PopPivotTable from "./PopPivotTable.svelte";
    import StrategiesBreakdown from "$lib/components/StrategiesBreakdown.svelte";

    import { setContext } from "svelte";
    import { writable } from "svelte/store";
    import EntityMap from "./EntityMap.svelte";

    const { swdata, type, hideTheme, csvTitle, fileName, constants, stratAd, activeDem, showPopulation} = $$props;

    let decadeStore = writable(constants.getDecades()[0]);
    let themeStore = writable("strategies");
    let ruStore = writable("region");



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
        buildEntMap: writable()
    });
</script>

<div class="view-choice-wrap">
    <div class="view-choice-container">
        <h4>Data by Planning Decade and Theme</h4>
        <DataViewChoiceSelectors {hideTheme} {showPopulation} {constants} />
    </div>
    <!-- insert 3 sub-widgets here -->
    <div class="container">
        <!-- <StrategiesBreakdown {swdata} /> -->

        <EntityMap {swdata}/>
        {#if type !== "source" && type !== "pop" && type !== "wms" && type !== "wmstype"}
        <StrategiesBreakdown {swdata} />
        {/if}
        {#if type !== "pop"}
            <PivotTable {swdata} {csvTitle} {fileName} {constants} {stratAd} {activeDem} />
        {:else}
            <PopPivotTable {swdata} {csvTitle} {fileName} {constants} />
        {/if}
    </div>
</div>
