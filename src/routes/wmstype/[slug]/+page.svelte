<script>
    //@ts-nocheck
    import ProjectTable from "$lib/components/ProjectTable/ProjectTable.svelte";
    import DataViewChoiceWrapInd from "$lib/components/DataByPlanningDecadeAndTheme/DataViewChoiceWrapInd.svelte";
    import { load_indexeddb } from "$lib/helper.js";
    import Statewide from "$lib/db/statewide.js";
    import { QuerySettings } from "$lib/QuerySettings.js"
    export let data;
    import { setContext } from "svelte";
    import { writable } from "svelte/store";

    let wmsTypeSetting = new QuerySettings("datastrategies", "WmsType");
    wmsTypeSetting.setAll(data.slug);
    const wmsSetting2 = new QuerySettings("wmstype", "WmsType");
    wmsSetting2.setAll(data.slug);
    let db;
    let loadForWmsType = async () => {
        let start = Date.now();
        db = await load_indexeddb()
        let sw = new Statewide(db);
        let dat = await sw.get(wmsTypeSetting);
        let dat2 = await sw.get(wmsSetting2);
        let r = {
            strategies: dat.strategies,
            projects: dat2.projects
        };
        console.log(`loadForRegion time in ms: ${Date.now() - start}`);
        return r;
    }

    setContext("dataviewContext", {
        getData: writable()
    });   
</script>

<div class="statewide-view">
    <section>
        {#await loadForWmsType()}
            <span>Loading</span>
        {:then out}
        <ProjectTable swdata={out} type={"region"} />
        <DataViewChoiceWrapInd swdata={out} hideTheme={true} type={"wmstype"} />
        {:catch error}
            <span>Error starting database {error.message}</span>
        {/await}
    </section>
</div>

<style type="text/scss">
    @import '$lib/sass/main.scss';
</style>  