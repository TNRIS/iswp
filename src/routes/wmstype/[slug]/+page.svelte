<script>
    //@ts-nocheck
    import ProjectTable from '$lib/components/ProjectTable/ProjectTable.svelte';
    import DataViewChoiceWrapInd from '$lib/components/DataByPlanningDecadeAndTheme/DataViewChoiceWrapInd.svelte';
    import { load_indexeddb, getConstants, cap, is_idb_loaded } from '$lib/helper.js?v1';
    import Statewide from '$lib/db/statewide.js';
    import { QuerySettings } from '$lib/QuerySettings.js';
    export let data;
    import { setContext } from 'svelte';
    import { writable } from 'svelte/store';
    import Header from '$lib/components/Header.svelte';
    import { page } from '$app/stores';

    let stratAd = ['Region', 'WMS Type', 'Strategy', 'Source', 'County', 'Entity'];
    let constants = getConstants($page.url.host);
    let wmsTypeSetting = new QuerySettings('datastrategies', 'WmsType');
    wmsTypeSetting.setAll(data.slug);
    const wmsSetting2 = new QuerySettings('wmstype', 'WmsType');
    wmsSetting2.setAll(data.slug);
    let db = load_indexeddb();
    let entityMapBlurb = `<p class="note">Each water user group is mapped to a single point near its primary location; therefore, an entity with a large or multiple service areas may be displayed outside the specific area being queried.</p>`;
    if (!$page.url.host.includes('2017'))
        entityMapBlurb += `<p class="note">The following sources are not mapped to a specific location: 'Direct Reuse', 'Local Surface Water Supply', 'Atmosphere', and 'Rainwater Harvesting'.</p>`;

    let loadForWmsType = async () => {
        await is_idb_loaded();
        let start = Date.now();
        db = await db;
        let sw = new Statewide(db);
        let dat = await sw.get(wmsTypeSetting);
        let dat2 = await sw.get(wmsSetting2);
        let r = {
            strategies: dat.strategies,
            projects: dat2.projects
        };
        console.log(`loadForRegion time in ms: ${Date.now() - start}`);
        return r;
    };

    setContext('dataviewContext', {
        getData: writable()
    });

    const lrp = loadForWmsType();
</script>

<Header {constants} {db} />
<svelte:head>
    <title>Water Management Strategy Type{data.slug ? ` for ${data.slug}` : ''}</title>
</svelte:head>
<div class="statewide-view" id="main-content" role="main">
    <section>
        <div class="view-top usage-type-view-top">
            <div class="summary-wrapper container">
                <div class="view-summary usage-type-summary">
                    <h1 aria-level="2">{data.slug}</h1>
                    {constants.wms_info.WMS_TYPE_DESCRIPTIONS[data.slug.replace('AND', '&')]}
                </div>
            </div>
        </div>
        <ProjectTable
            project_title={`WMS TYPE - ${data.slug}`}
            project_title2={'Projects related to Water Management Strategy Type'}
            {lrp}
            type={'region'} />
        <DataViewChoiceWrapInd
            title={`WMS TYPE - ${data.slug}`}
            fileName={`wmstype_${data.slug}`}
            {entityMapBlurb}
            {stratAd}
            {lrp}
            hideTheme={true}
            type={'wmstype'}
            csvTitle={`${cap(data.slug)} WMS Type`}
            {constants} />
    </section>
</div>
