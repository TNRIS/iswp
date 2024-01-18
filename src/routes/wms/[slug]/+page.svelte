<script>
    import ProjectTable from "$lib/components/ProjectTable/ProjectTable.svelte";
    import DataViewChoiceWrapInd from "$lib/components/DataByPlanningDecadeAndTheme/DataViewChoiceWrapInd.svelte";

    export let data;
    let db;
    import { QuerySettings } from "$lib/QuerySettings.js";
    import { load_indexeddb } from "$lib/helper.js";
    import Statewide from "$lib/db/statewide.js";
    import Header from "$lib/components/Header.svelte";
    import { Constant2027 } from "$lib/Constant2027.js";
    import { Constant2022 } from "$lib/Constant2022.js";
    import { Constant2017 } from "$lib/Constant2017.js";

    const year = 2027;
    let constants;
    if(year == 2027) {
        constants = new Constant2027();
    } else if (year == 2022) {
        constants = new Constant2022();
    } else if (year == 2017) {
        constants = new Constant2017();
    }
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
<Header {constants} />

{#await loadForWms()}
    <span>Loading</span>
{:then out}
    <ProjectTable swdata={out} type={"region"} />
    <DataViewChoiceWrapInd swdata={out} hideTheme={true} type={"wms"} {constants} />
{:catch error}
    <span>Error starting database {error.message}</span>
{/await}

<style type="text/scss">
    @import '$lib/sass/main.scss';
</style>  