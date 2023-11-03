<script>
    import ProjectTable from "$lib/components/ProjectTable/ProjectTable.svelte";
    import DataViewChoiceWrapInd from "$lib/components/DataByPlanningDecadeAndTheme/DataViewChoiceWrapInd.svelte";

    export let data;
    let db;
    import { QuerySettings } from "$lib/QuerySettings.js";
    import { load_indexeddb } from "$lib/helper.js";
    import Statewide from "$lib/db/statewide.js";

    let sourceSetting = new QuerySettings("strategies", "WmsProjectId");
    sourceSetting.setAll(Number(data.slug));

    const sourceSetting2 = new QuerySettings("wms", "WmsProjectId");
    sourceSetting2.setAll(Number(data.slug));

    let loadForSource = async () => {
        let start = Date.now();
        db = await load_indexeddb();
        let sw = new Statewide(db);
        let dat = await sw.get(sourceSetting2);
        let dat2 = await sw.get(sourceSetting);
        let r = {
                    ...dat,
                    ...dat2,
        };

        console.log(`loadForRegion time in ms: ${Date.now() - start}`);
        return r;
    };
</script>

{#await loadForSource()}
    <span>Loading</span>
{:then out}
    <ProjectTable swdata={out} type={"region"} />
    <DataViewChoiceWrapInd swdata={out} type={"pop"} hideTheme={true} />
{:catch error}
    <span>Error starting database {error.message}</span>
{/await}
