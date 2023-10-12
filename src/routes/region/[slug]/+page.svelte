<script>
    //@ts-nocheck
    import PopulationChart from "/src/components/Charts/PopulationChart.svelte";
    import DataUsageType from "/src/components/DataUsageType.svelte";
    import TitleBlurb from "/src/components/TitleBlurb.svelte";
    import ProjectTable from "/src/components/ProjectTable/ProjectTable.svelte";
    import ThemeTypesByDecadeChart from "/src/components/ThemeTypesByDecadeChart.svelte";
    import ThemeTotalsByDecadeChart from "/src/components/ThemeTotalsByDecadeChart.svelte";
    import DataViewChoiceWrap from "/src/components/DataByPlanningDecadeAndTheme/DataViewChoiceWrap.svelte";
    import { Constant2022 } from "/src/lib/Constant2022.js";
    import { load_indexeddb } from "$lib/helper.js";
    import Statewide from "/src/lib/db/statewide.js";

    const c22 = new Constant2022();
    let constants = c22;
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
