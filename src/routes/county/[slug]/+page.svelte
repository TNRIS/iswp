<script>
    //@ts-nocheck
    import ProjectTable from "$lib/components/ProjectTable/ProjectTable.svelte";
    import { QuerySettings } from "$lib/QuerySettings.js";
    import Statewide from "$lib/db/statewide.js";
    export let data;
    import PopulationChart from "$lib/components/Charts/PopulationChart.svelte";
    import ThemeTotalsByDecadeChart from "$lib/components/ThemeTotalsByDecadeChart.svelte";
    import DataUsageType from "$lib/components/DataUsageType.svelte";
    import DataViewChoiceWrapInd from "$lib/components/DataByPlanningDecadeAndTheme/DataViewChoiceWrapInd.svelte";
    import ThemeTypesByDecadeChart from "$lib/components/ThemeTypesByDecadeChart.svelte";
    import Header from "$lib/components/Header.svelte";
    import { load_indexeddb } from "$lib/helper.js";
    import { Constant2027 } from "$lib/Constant2027.js";
    import { Constant2022 } from "$lib/Constant2022.js";
    import { Constant2017 } from "$lib/Constant2017.js";

    const year = 2027;
    let constants;
    if(year == 2027) {
        constants = new Constant2027();
    } else if (year == 2022) {
        constants = new Constant2022();
    } else if (year == 2017) {
        constants = new Constant2017();
    }
    let regionSetting = new QuerySettings("county", "WugCounty");
    regionSetting.setAll(data.slug.toUpperCase());
    let db;
    let loadForCounty = async () => {
        let start = Date.now();
        db = await load_indexeddb();
        let sw = new Statewide(db);
        let dat = await sw.get(regionSetting);
        console.log(`loadForRegion time in ms: ${Date.now() - start}`);
        return dat;
    };
</script>
<Header {constants} />

<div class="statewide-view">
    <section>
        {#await loadForCounty()}
            <span>Loading</span>
        {:then out}
            <PopulationChart
                title={`${data.slug} County`}
                swdata={out}
                {constants}
            />
            <ThemeTotalsByDecadeChart swdata={out} {constants} />
            <ThemeTypesByDecadeChart
                chartTitle={"ct-usage-chart"}
                swdata={out}
                {constants}
            />

            <DataUsageType swdata={out} {constants} />
            <ProjectTable swdata={out} type={"region"} />
            <DataViewChoiceWrapInd swdata={out} csvTitle={`${data.slug} County`} fileName={`county_${data.slug.toLowerCase()}`} {constants} />

        {:catch error}
            <span>Error starting database {error.message}</span>
        {/await}
    </section>
</div>

<style type="text/scss">
    @import "$lib/sass/main.scss";
</style>
