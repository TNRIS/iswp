<script>
    import ProjectTable from "$lib/components/ProjectTable/ProjectTable.svelte";
    import DataViewChoiceWrapInd from "$lib/components/DataByPlanningDecadeAndTheme/DataViewChoiceWrapInd.svelte";

    export let data;
    let db;
    import { QuerySettings } from "$lib/QuerySettings.js";
    import { load_indexeddb } from "$lib/helper.js";
    import Statewide from "$lib/db/statewide.js";

    let wmsSetting = new QuerySettings("datastrategies", "WmsId");
    wmsSetting.setAll(Number(data.slug));

    const wmsSetting2 = new QuerySettings("wms", "WmsId");
    wmsSetting2.setAll(Number(data.slug));

    let loadForWms = async () => {
        let start = Date.now();
        db = await load_indexeddb();
        let sw = new Statewide(db);
        let dat = await sw.get(wmsSetting);
        let dat2 = await sw.get(wmsSetting2);
        let r = {
            strategies: dat.strategies,
            projects: dat2.projects
        };

        console.log(`loadForWms time in ms: ${Date.now() - start}`);
        return r;
    };
</script>

{#await loadForWms()}
    <span>Loading</span>
{:then out}
    <ProjectTable swdata={out} type={"region"} />
    <DataViewChoiceWrapInd swdata={out} hideTheme={true} />
{:catch error}
    <span>Error starting database {error.message}</span>
{/await}
