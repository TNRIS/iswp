<script>
    // @ts-nocheck
    import DataViewChoiceSelectors from "./DataViewChoiceSelectors.svelte";
    import PivotTable from "./PivotTable.svelte";
    import PopPivotTable from "./PopPivotTable.svelte";
    import StrategiesBreakdown from "$lib/components/StrategiesBreakdown.svelte";

    import { setContext } from "svelte";
    import { writable } from "svelte/store";
    const { swdata, type, hideTheme, title } = $$props;

    let decadeStore = writable("2020");
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
        buildPie: writable()
    });
</script>

<div class="view-choice-wrap">
    <div class="view-choice-container">
        <h4>Data by Planning Decade and Theme</h4>
        <DataViewChoiceSelectors {hideTheme} showPopulation={true} />
    </div>
    <!-- insert 3 sub-widgets here -->
    <div class="container">
        <!-- <StrategiesBreakdown {swdata} /> -->
        {#if type !== "pop"}
            <PivotTable {swdata} />
        {:else}
            <PopPivotTable {swdata} />
        {/if}

    </div>
</div>
