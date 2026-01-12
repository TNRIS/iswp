<script>
    import ProjectTable from '$lib/components/ProjectTable/ProjectTable.svelte';
    import DataViewChoiceWrapInd from '$lib/components/DataByPlanningDecadeAndTheme/DataViewChoiceWrapInd.svelte';
    import { getConstants, cap, wrapupCommonIdbTasks } from '$lib/helper.js';
    import { QuerySettings } from '$lib/QuerySettings.js';
    import { setContext } from 'svelte';
    import { writable } from 'svelte/store';
    import { page } from '$app/stores';

    let slug = $derived($page.params.slug);
    let stratAd = ['Region', 'WMS Type', 'Strategy', 'Source', 'County', 'Entity'];
    let constants = getConstants($page.url.host);
    let wmsTypeSetting = new QuerySettings('datastrategies', 'WmsType');
    const wmsSetting2 = new QuerySettings('wmstype', 'WmsType');

    let set_all_wms_type_settings = (new_slug) => {
        wmsTypeSetting.setAll(new_slug.toUpperCase());
        wmsSetting2.setAll(new_slug.toUpperCase());
    };
    (() => {set_all_wms_type_settings(slug)})();
    let entityMapBlurb = $state(`<p class="note">Each water user group is mapped to a single point near its primary location; therefore, an entity with a large or multiple service areas may be displayed outside the specific area being queried.</p>`);
    if (constants.id !== 17)
        entityMapBlurb += `<p class="note">The following sources are not mapped to a specific location: 'Direct Reuse', 'Local Surface Water Supply', 'Atmosphere', and 'Rainwater Harvesting'.</p>`;

    let loadForWmsType = async () => {
        let [db, sw] = await wrapupCommonIdbTasks();
        let dat = await sw.get(wmsTypeSetting);
        let dat2 = await sw.get(wmsSetting2);
        let r = {
            strategies: dat.strategies,
            projects: dat2.projects
        };
        return r;
    };

    setContext('dataviewContext', {
        getData: writable()
    });

    let lrp = $state(loadForWmsType());

    $effect(() => {
        set_all_wms_type_settings(slug);
        lrp = loadForWmsType()
    });
</script>

<svelte:head>
    {#key slug}<title>Water Management Strategy Type{slug ? ` for ${slug}` : ''}</title>{/key}
</svelte:head>
{#key lrp}
<div class="statewide-view" id="main-content" role="main">
    <section>
        <div class="view-top usage-type-view-top">
            <div class="summary-wrapper container">
                <div class="view-summary usage-type-summary">
                    <h1 aria-level="2">{slug}</h1>
                    {constants.wms_info.WMS_TYPE_DESCRIPTIONS[slug?.toUpperCase().replace('AND', '&').trim()]}
                </div>
            </div>
        </div>
        <ProjectTable
            project_title={`WMS TYPE - ${slug}`}
            project_title2={'Projects related to Water Management Strategy Type'}
            {lrp}
            type={'region'} />
        <DataViewChoiceWrapInd
            title={`WMS TYPE - ${slug}`}
            fileName={`wmstype_${slug}`}
            {entityMapBlurb}
            {stratAd}
            {lrp}
            hideTheme={true}
            type={'wmstype'}
            csvTitle={`${cap(slug)} WMS Type`}
            {constants} />
    </section>
</div>
{/key}