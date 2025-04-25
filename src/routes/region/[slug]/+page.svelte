<script>
    import PopulationChart from '$lib/components/Charts/PopulationChart.svelte';
    import DataUsageType from '$lib/components/DataUsageType.svelte';
    import ProjectTable from '$lib/components/ProjectTable/ProjectTable.svelte';
    import ThemeTypesByDecadeChart from '$lib/components/ThemeTypesByDecadeChart.svelte';
    import ThemeTotalsByDecadeChart from '$lib/components/ThemeTotalsByDecadeChart.svelte';
    import DataViewChoiceWrapInd from '$lib/components/DataByPlanningDecadeAndTheme/DataViewChoiceWrapInd.svelte';
    import { getConstants, wrapupCommonIdbTasks } from '$lib/helper.js';
    import Counties from '$lib/db/counties.js';
    import { QuerySettings } from '$lib/QuerySettings.js';
    import { setContext } from 'svelte';
    import { writable } from 'svelte/store';
    import { page } from '$app/stores';

    const tagline = 'Regional Water Planning Area in <a href="/">Texas</a>';
    let stratAd = ['Strategy', 'WMS Type', 'Source', 'County', 'Entity'];
    let activeDem = ['County', 'Entity'];

    let slug = $derived($page.params.slug);
    let constants = getConstants($page.url.host);
    let db;

    //Setup region 1 and 2.
    let regionSetting = new QuerySettings('region', 'WugRegion');
    let regionSetting2 = new QuerySettings('region', 'WugRegion');

    /**
     * Reused in a few places so just call it as needed. It resets the settings for the idb query.
     */
    let reset_region_settings = (new_slug) => {
        regionSetting.setAll(new_slug);
        regionSetting.setProjects(new_slug, 'WmsProjectSponsorRegion');
        regionSetting2.setAll(new_slug);
        regionSetting2.setProjects(new_slug, 'WugRegion');
    }

    //Initial reset.
    (() => {reset_region_settings(slug)})();

    setContext('dataviewContext', {
        getData: writable()
    });
    let entityMapBlurb = $state(`<p class="note">Each water user group is mapped to a single point near its primary location; therefore, an entity with a large or multiple service areas may be displayed outside the specific area being queried.</p>`);
    if (constants.id !== 17)
        entityMapBlurb += `<p class="note">The following sources are not mapped to a specific location: 'Direct Reuse', 'Local Surface Water Supply', 'Atmosphere', and 'Rainwater Harvesting'.</p>`;

    let loadForRegionPromise = async () => {
        // Just check that the indexeddb is loaded.
        let sw;
        [db, sw] = await wrapupCommonIdbTasks();
        let cc = new Counties(db);
        let [ccounties, dat, dat2] = await Promise.all([cc.get(slug), sw.get(regionSetting), sw.get(regionSetting2)]);
        dat.counties = ccounties;
        dat2.counties = ccounties;
        dat.project_data = dat2;

        return dat;
    };
    let lrp = $state(loadForRegionPromise());

    $effect(() => {
        reset_region_settings(slug);
        lrp = loadForRegionPromise(); // Rebuild data on this page.
    });
</script>

<svelte:head>
    {#key slug}
        <title>Planning Region {slug ? ` ${slug}` : ''}</title>
    {/key}
</svelte:head>

{#key lrp}
<div class="statewide-view" id="main-content" role="main">
    <section>
        <PopulationChart
            title={`Planning Region ${slug}`}
            {lrp}
            {constants}
            {tagline}
            dont_capitalize_title={true} />
        <div class="container">
            <div class="row panel-row">
                <div class="twelve columns">
                    <div>
                        {#if constants.regionalLink}
                            <!-- 2016 description. -->
                            <p
                                >{constants.regionalDescription[slug]}
                                <a href={`http://www.twdb.texas.gov/waterplanning/rwp/plans/2016/#region-${slug.toLowerCase()}`}>
                                    http://www.twdb.texas.gov/waterplanning/rwp/plans/2016/#region-{slug.toLowerCase()}
                                </a>. {constants.regionalLink[slug]}<a
                                    href={`http://www.twdb.texas.gov/waterplanning/swp/2017/doc/2016_RegionalSummary_${slug}.pdf`}>
                                    http://www.twdb.texas.gov/waterplanning/swp/2017/doc/2016_RegionalSummary_{slug}.pdf
                                </a>.
                            </p>
                        {:else}
                            <!-- 2022 description. -->
                            <p style="word-break: break-word;">{constants.regionalDescription[slug]}
                                {@html constants.region_footer}</p>
                        {/if}
                    </div>
                </div>
            </div>
        </div>
        <ThemeTotalsByDecadeChart {lrp} {constants} title={`Planning Region ${slug}`} />
        <ThemeTypesByDecadeChart
            chartTitle={'ct-usage-chart'}
            {lrp}
            {constants}
            title={`Planning Region ${slug}`} />
        <DataUsageType title={`Planning Region ${slug}`} {lrp} {constants} />
        <ProjectTable
            project_title={`PLANNING REGION ${slug}`}
            project_title2={'Projects '}
            {lrp}
            type={'region'} />
        {#await lrp then d}
            <DataViewChoiceWrapInd
                title={`Planning Region ${slug}`}
                showPopulation={true}
                type={'region'}
                {slug}
                {stratAd}
                {activeDem}
                {constants}
                csvTitle={`Planning Region ${slug}`}
                lrp={d}
                fileName={`region_${slug.toLowerCase()}`}
                {entityMapBlurb} />
        {/await}
    </section>
</div>
{/key}