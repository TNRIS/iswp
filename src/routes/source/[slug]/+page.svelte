<script>
    import ProjectTable from "$lib/components/ProjectTable/ProjectTable.svelte";
    import DataViewChoiceWrapInd from "$lib/components/DataByPlanningDecadeAndTheme/DataViewChoiceWrapInd.svelte";

    export let data;
    let db;
    import { QuerySettings } from "$lib/QuerySettings.js";
    import { load_indexeddb } from "$lib/helper.js";
    import Statewide from "$lib/db/statewide.js";

    let sourceSetting = new QuerySettings("source", "MapSourceId");
    sourceSetting.setAll(Number(data.slug));

    let loadForSource = async () => {
        let start = Date.now();
        db = await load_indexeddb();
        let sw = new Statewide(db);
        let dat = await sw.get(sourceSetting);
        console.log(`loadForRegion time in ms: ${Date.now() - start}`);
        return dat;
    };
</script>

{#await loadForSource()}
    <span>Loading</span>
{:then out}
<ProjectTable swdata={out} type={"region"} />
<DataViewChoiceWrapInd swdata={out} type={"source"}/>

{:catch error}
    <span>Error starting database {error.message}</span>
{/await}

<style type="text/scss">
    @import '$lib/sass/main.scss';
</style>  