<script>
    import ProjectTable from "$lib/components/ProjectTable/ProjectTable.svelte";
    import DataViewChoiceWrapInd from "$lib/components/DataByPlanningDecadeAndTheme/DataViewChoiceWrapInd.svelte";
    import PopulationChart from "$lib/components/Charts/PopulationChart.svelte";

    export let data;
    let db;
    import { QuerySettings } from "$lib/QuerySettings.js";
    import { load_indexeddb } from "$lib/helper.js";
    import Statewide from "$lib/db/statewide.js";
    import Header from "$lib/components/Header.svelte";

    import { sourceNames } from "$lib/SourceNames.js";
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
    let sourceSetting = new QuerySettings("source", "MapSourceId");
    sourceSetting.setAll(Number(data.slug));
    let title = "";
    let loadForSource = async () => {
        let start = Date.now();

        title = sourceNames.find(x => x.sourceid == parseInt(data.slug))?.name;
        db = await load_indexeddb();
        let sw = new Statewide(db);
        let dat = await sw.get(sourceSetting);
        console.log(`loadForRegion time in ms: ${Date.now() - start}`);
        return dat;
    };
</script>
<Header {constants} />

{#await loadForSource()}
    <span>Loading</span>
{:then out}
<PopulationChart mapOnly={true} {title} {constants} />
<ProjectTable swdata={out} type={"region"} />
<DataViewChoiceWrapInd swdata={out} type={"source"} fileName={`source_${data.slug}`} {constants} />

{:catch error}
    <span>Error starting database {error.message}</span>
{/await}

<style type="text/scss">
    @import '$lib/sass/main.scss';
</style>  
