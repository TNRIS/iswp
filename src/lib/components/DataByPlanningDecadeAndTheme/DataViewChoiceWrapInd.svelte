<script>
    // @ts-nocheck
    import DataViewChoiceSelectors from "./DataViewChoiceSelectors.svelte";
    import PivotTable from "./PivotTable.svelte";
    import { setContext } from "svelte";
    import { writable } from "svelte/store";
    const { swdata } = $$props;

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
    });
</script>

<div class="view-choice-wrap">
    <div class="view-choice-container">
        <h4>Data by Planning Decade and Theme</h4>
        <DataViewChoiceSelectors hideTheme={false} showPopulation={true} />
    </div>
    <!-- insert 3 sub-widgets here -->
    <div class="container">
        <PivotTable {swdata} />
    </div>
</div>
