<script>
    import ProjectTable2 from "$lib/components/ProjectTable/ProjectTable2.svelte";
    import DataViewChoiceWrapInd from "$lib/components/DataByPlanningDecadeAndTheme/DataViewChoiceWrapInd.svelte";

    export let data;
    let db;
    import { QuerySettings } from "$lib/QuerySettings.js";
    import { load_indexeddb, getConstants } from "$lib/helper.js";
    import Statewide from "$lib/db/statewide.js";
    import Header from "$lib/components/Header.svelte";
    import PopulationChart from "$lib/components/Charts/PopulationChart.svelte";
    import { page } from '$app/stores';

    let constants = getConstants($page.url.host)
    $: tagline = "";
    let sourceSetting = new QuerySettings("strategies", "WmsProjectId");
    sourceSetting.setAll(Number(data.slug));

    const sourceSetting2 = new QuerySettings("wms", "WmsProjectId");
    sourceSetting2.setAll(Number(data.slug));

    const loadForSource = async () => {
        const start = Date.now();
        db = await load_indexeddb();
        const sw = new Statewide(db);
        const dat = await sw.get(sourceSetting2);
        const dat2 = await sw.get(sourceSetting);
        const r = {
            ...dat,
            ...dat2,
        };
        const decade_online = dat?.projects[0].OnlineDecade;

        let formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        });
        const capital_cost = formatter.format(dat?.projects[0].CapitalCost);

        tagline = `<span>Decade Online: ${decade_online}</span><br /><span>Capital Cost: ${capital_cost}</span>`
        console.log(`loadForRegion time in ms: ${Date.now() - start}`);
        return r;
    };
</script>
<Header {constants} />
<div class="statewide-view">

{#await loadForSource()}
<div class="loader"></div>
{:then out}
    <PopulationChart {tagline} title={out.projects[0].ProjectName} mapOnly={true} swdata={out} {constants} />
    <ProjectTable2 project_title={`WMS PROJECT - ${out.projects[0].ProjectName}`} project_title2={"Water Management Strategies related to Project"} swdata={out} type={"region"} />
    <DataViewChoiceWrapInd swdata={out} type={"pop"} hideTheme={true} {constants}  csvTitle={out.projects[0].ProjectName} fileName={`project_${data.slug}`} />
{:catch error}
    <span>Error starting database {error.message}</span>
{/await}
</div>
<style type="text/scss">
    @import '$lib/sass/main.scss';
</style> 
