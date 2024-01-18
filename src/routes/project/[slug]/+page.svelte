<script>
    import ProjectTable from "$lib/components/ProjectTable/ProjectTable.svelte";
    import DataViewChoiceWrapInd from "$lib/components/DataByPlanningDecadeAndTheme/DataViewChoiceWrapInd.svelte";

    export let data;
    let db;
    import { QuerySettings } from "$lib/QuerySettings.js";
    import { load_indexeddb } from "$lib/helper.js";
    import Statewide from "$lib/db/statewide.js";
    import Header from "$lib/components/Header.svelte";
    import PopulationChart from "$lib/components/Charts/PopulationChart.svelte";
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
<Header {constants} />

{#await loadForSource()}
    <span>Loading</span>
{:then out}
    <PopulationChart title={out.projects[0].ProjectName} mapOnly={true} swdata={out} {constants} />
    <ProjectTable swdata={out} type={"region"} />
    <DataViewChoiceWrapInd swdata={out} type={"pop"} hideTheme={true} {constants} />
{:catch error}
    <span>Error starting database {error.message}</span>
{/await}

<style type="text/scss">
    @import '$lib/sass/main.scss';
</style>  