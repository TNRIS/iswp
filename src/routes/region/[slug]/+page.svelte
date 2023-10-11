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
    
    const c22 = new Constant2022();
    let constants = c22;
    export let data;

</script>

<div class="statewide-view">
    <section>
        {#await load_indexeddb()}
            <span>Loading</span>
        {:then out}
            <PopulationChart chartTitle={"ct-pop-chart"} db={out} type={constants.page_types.region} wugRegionFilter={data.slug}/>
            <ThemeTotalsByDecadeChart db={out} wugRegionFilter={data.slug} />
            <ThemeTypesByDecadeChart chartTitle={"ct-usage-chart"} db={out} wugRegionFilter={data.slug} />
            <DataUsageType db={out} wugRegionFilter={data.slug} />
            <ProjectTable db={out} wugRegionFilter={data.slug} />
        {:catch error}
            <span>Error starting database {error.message}</span>
        {/await}
    </section>
</div>
