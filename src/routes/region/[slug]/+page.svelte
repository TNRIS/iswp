<script>
    //@ts-nocheck
    import PopulationChart from '$lib/components/Charts/PopulationChart.svelte';
    import DataUsageType from '$lib/components/DataUsageType.svelte';
    import ProjectTable from '$lib/components/ProjectTable/ProjectTable.svelte';
    import ThemeTypesByDecadeChart from '$lib/components/ThemeTypesByDecadeChart.svelte';
    import ThemeTotalsByDecadeChart from '$lib/components/ThemeTotalsByDecadeChart.svelte';
    import DataViewChoiceWrapInd from '$lib/components/DataByPlanningDecadeAndTheme/DataViewChoiceWrapInd.svelte';
    import { load_indexeddb, getConstants, is_idb_loaded } from '$lib/helper.js?v1';
    import Statewide from '$lib/db/statewide.js';
    import Counties from '$lib/db/counties.js';

    import { QuerySettings } from '$lib/QuerySettings.js';
    export let data;
    import { setContext } from 'svelte';
    import { writable } from 'svelte/store';
    import { page } from '$app/stores';

    const tagline = 'Regional Water Planning Area in <a href="/">Texas</a>';
    let stratAd = ['Strategy', 'WMS Type', 'Source', 'County', 'Entity'];

    let activeDem = ['County', 'Entity'];

    let constants = getConstants($page.url.host);
    let regionSetting = new QuerySettings('region', 'WugRegion');
    regionSetting.setAll(data.slug);
    regionSetting.setProjects(data.slug, 'WmsProjectSponsorRegion');

    let regionSetting2 = new QuerySettings('region', 'WugRegion');
    regionSetting2.setAll(data.slug);
    regionSetting2.setProjects(data.slug, 'WugRegion');
    let db = load_indexeddb();
    let loadForRegion = async () => {
        db = await db;

        await is_idb_loaded();
        let start = Date.now();
        let sw = new Statewide(db);
        let cc = new Counties(db);
        let [ccounties, dat, dat2] = await Promise.all([cc.get(data.slug), sw.get(regionSetting), sw.get(regionSetting2)]);
        //let ccounties = await cc.get(data.slug);
        //let dat =  await sw.get(regionSetting);

        dat.counties = ccounties;
        dat2.counties = ccounties;
        dat.project_data = dat2;

        console.log(`loadForRegion time in ms: ${Date.now() - start}`);
        dat.supplies.rows
        return dat;
    };

    setContext('dataviewContext', {
        getData: writable()
    });
    let entityMapBlurb = `<p class="note">Each water user group is mapped to a single point near its primary location; therefore, an entity with a large or multiple service areas may be displayed outside the specific area being queried.</p>`;
    if (!$page.url.host.includes('2017'))
        entityMapBlurb += `<p class="note">The following sources are not mapped to a specific location: 'Direct Reuse', 'Local Surface Water Supply', 'Atmosphere', and 'Rainwater Harvesting'.</p>`;

    let loadForRegionPromise = loadForRegion();
</script>

<svelte:head>
    <title>Planning Region {data.slug ? ` ${data.slug}` : ''}</title>
</svelte:head>
<div class="statewide-view" id="main-content" role="main">
    <section>
        <PopulationChart
            title={`Planning Region ${data.slug}`}
            lrp={loadForRegionPromise}
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
                                >{constants.regionalDescription[data.slug]}
                                <a href={`http://www.twdb.texas.gov/waterplanning/rwp/plans/2016/#region-${data.slug.toLowerCase()}`}>
                                    http://www.twdb.texas.gov/waterplanning/rwp/plans/2016/#region-{data.slug.toLowerCase()}
                                </a>. {constants.regionalLink[data.slug]}<a
                                    href={`http://www.twdb.texas.gov/waterplanning/swp/2017/doc/2016_RegionalSummary_${data.slug}.pdf`}>
                                    http://www.twdb.texas.gov/waterplanning/swp/2017/doc/2016_RegionalSummary_{data.slug}.pdf
                                </a>.
                            </p>
                        {:else}
                            <!-- 2022 description. -->
                            <p style="word-break: break-word;">{constants.regionalDescription[data.slug]}
                                {@html constants.region_footer}</p>
                        {/if}
                    </div>
                </div>
            </div>
        </div>
        <ThemeTotalsByDecadeChart lrp={loadForRegionPromise} {constants} title={`Planning Region ${data.slug}`} />
        <ThemeTypesByDecadeChart
            chartTitle={'ct-usage-chart'}
            lrp={loadForRegionPromise}
            {constants}
            title={`Planning Region ${data.slug}`} />
        <DataUsageType title={`Planning Region ${data.slug}`} lrp={loadForRegionPromise} {constants} />
        <ProjectTable
            project_title={`PLANNING REGION ${data.slug}`}
            project_title2={'Projects '}
            lrp={loadForRegionPromise}
            type={'region'} />
        {#await loadForRegionPromise then d}
            <DataViewChoiceWrapInd
                title={`Planning Region ${data.slug}`}
                showPopulation={true}
                type={'region'}
                slug={data.slug}
                {stratAd}
                {activeDem}
                {constants}
                csvTitle={`Planning Region ${data.slug}`}
                lrp={d}
                fileName={`region_${data.slug.toLowerCase()}`}
                {entityMapBlurb} />
        {/await}
    </section>
</div>
