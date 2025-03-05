<script>
    import { load_indexeddb, slugify, getConstants, cap, is_idb_loaded } from '$lib/helper.js?v1';
    import Statewide from '$lib/db/statewide.js';
    import { QuerySettings } from '$lib/QuerySettings.js';
    import ThemeTotalsByDecadeChart from '$lib/components/ThemeTotalsByDecadeChart.svelte';
    import DataViewChoiceWrapInd from '$lib/components/DataByPlanningDecadeAndTheme/DataViewChoiceWrapInd.svelte';
    export let data;
    import Header from '$lib/components/Header.svelte';
    import Irrigation from '/static/img/icon-irrigation.svg';
    import Municipal from '/static/img/icon-municipal.svg';
    import Manufacturing from '/static/img/icon-manufacturing.svg';
    import SteamElectricPower from '/static/img/icon-steam-electric-power.svg';
    import Livestock from '/static/img/icon-livestock.svg';
    import Mining from '/static/img/icon-mining.svg';
    import { page } from '$app/stores';
    let entityMapBlurb = `<p class="note">Each water user group is mapped to a single point near its primary location; therefore, an entity with a large or multiple service areas may be displayed outside the specific area being queried.</p>`;
    if (!$page.url.host.includes('2017'))
        entityMapBlurb += `<p class="note">The following sources are not mapped to a specific location: 'Direct Reuse', 'Local Surface Water Supply', 'Atmosphere', and 'Rainwater Harvesting'.</p>`;

    let constants = getConstants($page.url.host);
    let utSetting = new QuerySettings('usagetype', 'WugType');
    utSetting.setAll(data.slug.toUpperCase());

    let db = load_indexeddb();

    let stratAd = ['Region', 'Strategy', 'WMS Type', 'Source', 'County', 'Entity'];

    let activeDem = ['Region', 'County', 'Entity'];

    let loadForRegion = async () => {
        await is_idb_loaded();
        let start = Date.now();
        db = await db;
        let sw = new Statewide(db);
        let dat = await sw.get(utSetting);
        console.log(`loadForRegion time in ms: ${Date.now() - start}`);
        return dat;
    };

    // Promise to load for region. Do not await here. Await later in individual entities.
    const lrp = loadForRegion();
</script>

<Header {constants} {db} />
<svelte:head>
    <title>Usage Type{data.slug ? ` for ${data.slug}` : ''}</title>
</svelte:head>
<div class="statewide-view" id="main-content" role="main">
    <div class="view-top usage-type-view-top">
        <div class="summary-wrapper container">
            <div class="view-summary usage-type-summary">
                {#if data.slug == 'IRRIGATION'}
                    <h2><Irrigation class="usage-type-icon icon-irrigation legend-marker" />{data.slug}</h2>
                {/if}
                {#if data.slug == 'MUNICIPAL'}
                    <h2><Municipal class="usage-type-icon icon-municipal legend-marker" />{data.slug}</h2>
                {/if}
                {#if data.slug == 'MANUFACTURING'}
                    <h2><Manufacturing class="usage-type-icon icon-manufacturing legend-marker" />{data.slug}</h2>
                {/if}
                {#if data.slug == 'STEAM ELECTRIC POWER'}
                    <h2><SteamElectricPower class="usage-type-icon icon-steam-electric-power legend-marker" />{data.slug}</h2>
                {/if}
                {#if data.slug == 'LIVESTOCK'}
                    <h2><Livestock class="usage-type-icon icon-livestock legend-marker" />{data.slug}</h2>
                {/if}
                {#if data.slug == 'MINING'}
                    <h2><Mining class="usage-type-icon icon-mining legend-marker" />{data.slug}</h2>
                {/if}
                <p>{constants.USAGE_TYPE_DESCRIPTIONS[data.slug]}</p>
            </div>
        </div>
    </div>
    <ThemeTotalsByDecadeChart {lrp} {constants} title={`Usage Type - ${slugify(data.slug)}`} />
    <DataViewChoiceWrapInd
        page="usagetype"
        slug={data.slug}
        title={`Usage Type - ${cap(data.slug)}`}
        {entityMapBlurb}
        showPopulation={false}
        {stratAd}
        {activeDem}
        {lrp}
        csvTitle={`${cap(data.slug)} Usage Type`}
        fileName={`usagetype_${data.slug.toLowerCase()}`}
        {constants} />
</div>
