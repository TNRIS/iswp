<script>
    import ProjectTable from "$lib/components/ProjectTable/ProjectTable.svelte";
    import DataViewChoiceWrapInd from "$lib/components/DataByPlanningDecadeAndTheme/DataViewChoiceWrapInd.svelte";
    import PopulationChart from "$lib/components/Charts/PopulationChart.svelte";

    export let data;
    let db;
    import { QuerySettings } from "$lib/QuerySettings.js";
    import { load_indexeddb, getConstants, cap } from "$lib/helper.js";
    import Statewide from "$lib/db/statewide.js";
    import Header from "$lib/components/Header.svelte";
    import { page } from '$app/stores';
    $: tagline = "";
    let stratAd = [
        "Strategy",
        "WMS Type",
        "Source",
        "Region",
        "County",
        "Entity"
    ];

    let constants = getConstants($page.url.host)
    let wmsSetting = new QuerySettings("datastrategies", "WmsId");
    wmsSetting.setAll(Number(data.slug));

    const wmsSetting2 = new QuerySettings("wms", "WmsId");
    wmsSetting2.setAll(Number(data.slug));
    let csvTitle = "";
    const entityMapBlurb = `<p class="note">Each water user group is mapped to a single point near its primary location; therefore, an entity with a large or multiple service areas may be displayed outside the specific area being queried.</p>`;
    let loadForWms = async () => {
        let start = Date.now();
        db = await load_indexeddb();
        let sw = new Statewide(db);
        let dat = await sw.get(wmsSetting);
        let dat2 = await sw.get(wmsSetting2);
        csvTitle = cap(dat2.projects[0]["WmsName"]);
        let r = {
            strategies: dat.strategies,
            projects: dat2.projects
        };

        console.log(`loadForWms time in ms: ${Date.now() - start}`);
        const wr = cap(dat?.strategies?.rows[0].WugRegion).trim();

        tagline = wr ? `Water Management Strategy Sponsor <a href="/region/${wr}">Region ${wr}</a>` : undefined;

        return r;
    };
</script>
<Header {constants} />
<div class="statewide-view">

{#await loadForWms()}
<div class="loader"></div>
{:then out}
    <PopulationChart {tagline} title={csvTitle} mapOnly={true} swdata={out} {constants} />
    <ProjectTable project_title={`WATER MANAGEMENT STRATEGY - ${csvTitle}`} project_title2={"Projects related to Water Management Strategy"} swdata={out} type={"region"} />
    <DataViewChoiceWrapInd {entityMapBlurb} {stratAd} swdata={out} hideTheme={true} type={"wms"} {constants} {csvTitle} />
{:catch error}
    <span>Error starting database {error.message}</span>
{/await}
</div>
<style type="text/scss">
    @import '$lib/sass/main.scss';
</style>  