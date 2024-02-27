<script>
    import ProjectTable from "$lib/components/ProjectTable/ProjectTable.svelte";
    import DataViewChoiceWrapInd from "$lib/components/DataByPlanningDecadeAndTheme/DataViewChoiceWrapInd.svelte";
    import PopulationChart from "$lib/components/Charts/PopulationChart.svelte";

    export let data;
    let db;
    import { QuerySettings } from "$lib/QuerySettings.js";
    import { load_indexeddb, getConstants } from "$lib/helper.js";
    import Statewide from "$lib/db/statewide.js";
    import Header from "$lib/components/Header.svelte";

    import { sourceNames } from "$lib/SourceNames.js";
    import { page } from '$app/stores';

    let constants = getConstants($page.url.host)
    let sourceSetting = new QuerySettings("source", "MapSourceId");
    sourceSetting.setAll(Number(data.slug));
    let title = "";
    const tagline = `Surface Water Source in <a href="/">Texas</a>`

    let loadForSource = async () => {
        let start = Date.now();

        title = sourceNames.find(x => x.label == parseInt(data.slug))?.value;
        db = await load_indexeddb();
        let sw = new Statewide(db);
        let dat = await sw.get(sourceSetting);
        console.log(`loadForRegion time in ms: ${Date.now() - start}`);
        return dat;
    };
</script>
<Header {constants} />

{#await loadForSource()}
<div class="loader"></div>
{:then out}
<PopulationChart {tagline} mapOnly={true} {title} {constants} />
<ProjectTable swdata={out} type={"region"} project_title={"WATER SOURCE - " + title} project_title2={"Projects Associated with Source"} {title} />
<DataViewChoiceWrapInd swdata={out} type={"source"} fileName={`source_${data.slug}`} {constants} csvTitle={title} sourcePage={true} />

{:catch error}
    <span>Error starting database {error.message}</span>
{/await}

<style type="text/scss">
    @import '$lib/sass/main.scss';
</style>  
