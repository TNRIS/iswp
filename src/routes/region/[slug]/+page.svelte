<script>
    //@ts-nocheck
    import PopulationChart from "$lib/components/Charts/PopulationChart.svelte";
    import DataUsageType from "$lib/components/DataUsageType.svelte";
    import ProjectTable from "$lib/components/ProjectTable/ProjectTable.svelte";
    import ThemeTypesByDecadeChart from "$lib/components/ThemeTypesByDecadeChart.svelte";
    import ThemeTotalsByDecadeChart from "$lib/components/ThemeTotalsByDecadeChart.svelte";
    import { load_indexeddb } from "$lib/helper.js";
    import Statewide from "$lib/db/statewide.js";

    export let data;
    
    let loadForRegion = async () => {
        let db = await load_indexeddb()
        let sw = new Statewide(db);
        return await sw.get(data.slug);
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
        <ProjectTable db={out} wugRegionFilter={data.slug} />
        {:catch error}
            <span>Error starting database {error.message}</span>
        {/await}
    </section>
</div>
