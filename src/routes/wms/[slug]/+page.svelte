<script>
    import ProjectTable from '$lib/components/ProjectTable/ProjectTable.svelte';
    import DataViewChoiceWrapInd from '$lib/components/DataByPlanningDecadeAndTheme/DataViewChoiceWrapInd.svelte';
    import PopulationChart from '$lib/components/Charts/PopulationChart.svelte';

    let db = load_indexeddb();
    import { QuerySettings } from '$lib/QuerySettings.js';
    import { load_indexeddb, getConstants, cap, is_idb_loaded } from '$lib/helper.js';
    import Statewide from '$lib/db/statewide.js';
    import { page } from '$app/stores';

    let slug = $derived($page.params.slug);
    let tagline = $state('');
    let stratAd = ['Region', 'Strategy', 'WMS Type', 'Source', 'County', 'Entity'];

    let constants = getConstants($page.url.host);
    let wmsSetting = new QuerySettings('datastrategies', 'WmsId');
    const wmsSetting2 = new QuerySettings('wms', 'WmsId');

    let set_all_wms_settings = (new_slug) => {
        wmsSetting.setAll(Number(new_slug));
        wmsSetting2.setAll(Number(new_slug));
    };

    (() => {set_all_wms_settings(slug)})();

    let csvTitle = $state('');
    let entityMapBlurb = $state(`<p class="note">Each water user group is mapped to a single point near its primary location; therefore, an entity with a large or multiple service areas may be displayed outside the specific area being queried.</p>`);
    if (constants.id !== 17)
        entityMapBlurb += `<p class="note">The following sources are not mapped to a specific location: 'Direct Reuse', 'Local Surface Water Supply', 'Atmosphere', and 'Rainwater Harvesting'.</p>`;

    let loadForWms = async () => {
        await is_idb_loaded();
        db = await db;
        let sw = new Statewide(db);
        let dat = await sw.get(wmsSetting);
        let dat2 = await sw.get(wmsSetting2);
        csvTitle = cap(dat2.projects[0]['WmsName']);
        let r = {
            strategies: dat.strategies,
            projects: dat2.projects
        };

        const wr = cap(dat?.strategies?.rows[0].WugRegion).trim();

        tagline = wr ? `Water Management Strategy Sponsor <a href="/region/${wr}">Region ${wr}</a>` : undefined;

        return r;
    };
    // Promise to load for wms. Do not await here. Await later in individual entities.
    let lrp = $state(loadForWms());


    $effect(() => {
        set_all_wms_settings(slug)
        lrp = loadForWms();
    });
</script>

<svelte:head>
    {#key slug}<title>Water Management Strategy{csvTitle ? ` for ${csvTitle}` : ''}</title>{/key}
</svelte:head>

{#key lrp}
<div class="statewide-view" id="main-content" role="main">
    <!-- Need to load in all entities at once due to calculating title in loadForWms(). Might be worth storing that info statically in the future. -->
    {#await lrp then}
        <PopulationChart {tagline} title={csvTitle} titleOnly={true} {lrp} {constants} noMap={true} />
        <ProjectTable
            project_title={`WATER MANAGEMENT STRATEGY - ${csvTitle}`}
            project_title2={'Projects related to Water Management Strategy'}
            {lrp}
            type={'region'} />
        <DataViewChoiceWrapInd
            title={`WATER MANAGEMENT STRATEGY - ${csvTitle}`}
            fileName={`wms_${slug}`}
            slug={slug}
            {entityMapBlurb}
            {stratAd}
            {lrp}
            hideTheme={true}
            type={'wms'}
            {constants}
            {csvTitle} />
    {/await}
</div>
{/key}