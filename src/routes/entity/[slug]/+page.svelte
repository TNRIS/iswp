<script>
    //@ts-nocheck
    import ProjectTable from "$lib/components/ProjectTable/ProjectTable.svelte";
    import PopulationChart from "$lib/components/Charts/PopulationChart.svelte";
    import DataViewChoiceWrapInd from "$lib/components/DataByPlanningDecadeAndTheme/DataViewChoiceWrapInd.svelte";
    import ThemeTotalsByDecadeChart from "$lib/components/ThemeTotalsByDecadeChart.svelte";
    import EntityStrategiesTable from "$lib/components/EntityStrategiesTable.svelte";
    import { QuerySettings } from "$lib/QuerySettings.js"
    import Statewide from "$lib/db/statewide.js";
    export let data;

    import { load_indexeddb } from "$lib/helper.js"

    let entitySetting = new QuerySettings("entity", "EntityId");
    entitySetting.setAll(Number(data.slug));

    let db;
    let entityName = '';

    let loadForEntity = async () => {
        let start = Date.now();
        db = await load_indexeddb();
        let sw = new Statewide(db);
        let dat =  await sw.get(entitySetting);
        entityName = dat?.population?.rows?.[0]?.EntityName;
        console.log(`loadForRegion time in ms: ${Date.now() - start}`);
        return dat;
    }
</script>

<div class="statewide-view">
    <section>
        {#await loadForEntity()}
            <span>Loading</span>
        {:then out}
            <PopulationChart title={entityName} swdata={out}/>
            <ThemeTotalsByDecadeChart swdata={out} />
            <EntityStrategiesTable swdata={out} />
            <ProjectTable swdata={ out } type="county" />
            <DataViewChoiceWrapInd swdata={out} />
        {:catch error}
            <span>Error starting database {error.message}</span>
        {/await}
    </section>
</div>
<style type="text/scss">
    @import '$lib/sass/main.scss';
</style>  