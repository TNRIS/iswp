<script>
    //@ts-nocheck
    import PopulationChart from "$lib/components/Charts/PopulationChart.svelte";
    import DataUsageType from "$lib/components/DataUsageType.svelte";
    import ProjectTable from "$lib/components/ProjectTable/ProjectTable.svelte";
    import ThemeTypesByDecadeChart from "$lib/components/ThemeTypesByDecadeChart.svelte";
    import ThemeTotalsByDecadeChart from "$lib/components/ThemeTotalsByDecadeChart.svelte";
    import { load_indexeddb } from "$lib/helper.js";
    import Statewide from "$lib/db/statewide.js";
    import { QuerySettings } from "$lib/QuerySettings.js"
    export let data;
    
    let regionSetting = new QuerySettings("region", "WugRegion");
    regionSetting.setAll(data.slug);

    let loadForRegion = async () => {
        let start = Date.now();
        let db = await load_indexeddb()
        let sw = new Statewide(db);
        let dat =  await sw.get(regionSetting);
        console.log(`loadForRegion time in ms: ${Date.now() - start}`);
        return dat;
    }
</script>

<div class="statewide-view">
    <section>
        {#await loadForRegion()}
            <span>Loading</span>
        {:then out}
        <PopulationChart title={`Region ${data.slug} Population`} swdata={out}/>
        <ThemeTotalsByDecadeChart swdata={out} />
        <ThemeTypesByDecadeChart chartTitle={"ct-usage-chart"} swdata={out} />
        <DataUsageType swdata={out} />
        <ProjectTable swdata={out} />
        {:catch error}
            <span>Error starting database {error.message}</span>
        {/await}
    </section>
</div>