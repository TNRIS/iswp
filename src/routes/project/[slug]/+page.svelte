<script>
    import ProjectTable2 from "$lib/components/ProjectTable/ProjectTable2.svelte";
    import DataViewChoiceWrapInd from "$lib/components/DataByPlanningDecadeAndTheme/DataViewChoiceWrapInd.svelte";

    export let data;
    let db;
    import { QuerySettings } from "$lib/QuerySettings.js";
    import { load_indexeddb, getConstants, cap } from "$lib/helper.js";
    import Statewide from "$lib/db/statewide.js";
    import Header from "$lib/components/Header.svelte";
    import PopulationChart from "$lib/components/Charts/PopulationChart.svelte";
    import { page } from '$app/stores';
    const entityMapBlurb = `<p class="note">Each water user group is mapped to a single point near its primary location; therefore, an entity with a large or multiple service areas may be displayed outside the specific area being queried. Red triangles indicate capital projects. If a water user group does not display with the selected project, the project is not currently assigned to a specific water user group.</p>`;
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
    <PopulationChart {tagline} title={out.projects[0].ProjectName} titleOnly={true} swdata={out} {constants} />
    <ProjectTable2 project_title={`WMS PROJECT - ${out.projects[0].ProjectName}`} project_title2={"Water Management Strategies related to Project"} swdata={out} type={"region"} />
    <DataViewChoiceWrapInd title={`WMS PROJECT - ${out.projects[0].ProjectName}`} {entityMapBlurb} swdata={out} type={"pop"} hideTheme={true} {constants} csvTitle={`${cap(out.projects[0].ProjectName)} WMS`} fileName={`project_${data.slug}`} />
{:catch error}
    <span>Error starting database {error.message}</span>
{/await}
</div>
<style type="text/scss">
    @import '$lib/sass/main.scss';
</style> 
