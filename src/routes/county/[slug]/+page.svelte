<script>
    //@ts-nocheck
    import ProjectTable from "$lib/components/ProjectTable/ProjectTable.svelte";
    import { QuerySettings } from "$lib/QuerySettings.js"
    import Statewide from "$lib/db/statewide.js";
    export let data;
    import PopulationChart from "$lib/components/Charts/PopulationChart.svelte";
    import ThemeTotalsByDecadeChart from "$lib/components/ThemeTotalsByDecadeChart.svelte";
    import DataUsageType from "$lib/components/DataUsageType.svelte";
    import DataViewChoiceWrapInd from "$lib/components/DataByPlanningDecadeAndTheme/DataViewChoiceWrapInd.svelte";
    import ThemeTypesByDecadeChart from "$lib/components/ThemeTypesByDecadeChart.svelte";

    import { load_indexeddb } from "$lib/helper.js"


    let regionSetting = new QuerySettings("county", "WugCounty");
    regionSetting.setAll(data.slug.toUpperCase());
    let db;
    let loadForCounty = async () => {
        let start = Date.now();
        db = await load_indexeddb();
        let sw = new Statewide(db);
        let dat =  await sw.get(regionSetting);
        console.log(`loadForRegion time in ms: ${Date.now() - start}`);
        return dat;
    }
</script>

<div class="statewide-view">
    <section>
        {#await loadForCounty()}
            <span>Loading</span>
        {:then out}
            <PopulationChart title={`Region ${data.slug} Population`} swdata={out}/>
            <ThemeTotalsByDecadeChart swdata={out} />
            <ThemeTypesByDecadeChart chartTitle={"ct-usage-chart"} swdata={out} />

            <DataUsageType swdata={out} />
            <ProjectTable swdata={out} type={"region"} />
            <DataViewChoiceWrapInd swdata={out} />

        {:catch error}
            <span>Error starting database {error.message}</span>
        {/await}
    </section>
</div>
<style type="text/scss">
    @import '$lib/sass/main.scss';
</style>  