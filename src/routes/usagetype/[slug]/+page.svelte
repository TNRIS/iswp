<script>
    import { load_indexeddb, slugify, getConstants, cap, handle_idb_downloading } from '$lib/helper.js';
    import Statewide from '$lib/db/statewide.js';
    import { QuerySettings } from '$lib/QuerySettings.js';
    import ThemeTotalsByDecadeChart from '$lib/components/ThemeTotalsByDecadeChart.svelte';
    import DataViewChoiceWrapInd from '$lib/components/DataByPlanningDecadeAndTheme/DataViewChoiceWrapInd.svelte';
    import Irrigation from '$lib/img/icon-irrigation.svg?component';
    import Municipal from '$lib/img/icon-municipal.svg?component';
    import Manufacturing from '$lib/img/icon-manufacturing.svg?component';
    import SteamElectricPower from '$lib/img/icon-steam-electric-power.svg?component';
    import Livestock from '$lib/img/icon-livestock.svg?component';
    import Mining from '$lib/img/icon-mining.svg?component';
    import { page } from '$app/stores';

    let slug = $derived($page.params.slug);
    let entityMapBlurb = $state(`<p class="note">Each water user group is mapped to a single point near its primary location; therefore, an entity with a large or multiple service areas may be displayed outside the specific area being queried.</p>`);
    if (constants.id !== 17)
        entityMapBlurb += `<p class="note">The following sources are not mapped to a specific location: 'Direct Reuse', 'Local Surface Water Supply', 'Atmosphere', and 'Rainwater Harvesting'.</p>`;

    let constants = getConstants($page.url.host);
    let utSetting = new QuerySettings('usagetype', 'WugType');
    (() => {utSetting.setAll(slug.toUpperCase())})();

    let db = load_indexeddb();

    let stratAd = ['Region', 'Strategy', 'WMS Type', 'Source', 'County', 'Entity'];
    let activeDem = ['Region', 'County', 'Entity'];

    let loadForUsageType = async () => {
        await handle_idb_downloading();
        db = await db;
        let sw = new Statewide(db);
        let dat = await sw.get(utSetting);
        return dat;
    };

    // Promise to load for region. Do not await here. Await later in individual entities.
    let lrp = $state(loadForUsageType());

    $effect(() => {
        utSetting.setAll(slug.toUpperCase());
        lrp = loadForUsageType();
    })
</script>

<svelte:head>
    {#key slug}
    <title>Usage Type{slug ? ` for ${slug}` : ''}</title>
    {/key}
</svelte:head>
{#key lrp}
<div class="statewide-view" id="main-content" role="main">
    
    <div class="view-top usage-type-view-top">
        <div class="summary-wrapper container">
            <div class="view-summary usage-type-summary">
                {#if slug == 'IRRIGATION'}
                    <h2><Irrigation class="usage-type-icon icon-irrigation legend-marker" />{slug}</h2>
                {/if}
                {#if slug == 'MUNICIPAL'}
                    <h2><Municipal class="usage-type-icon icon-municipal legend-marker" />{slug}</h2>
                {/if}
                {#if slug == 'MANUFACTURING'}
                    <h2><Manufacturing class="usage-type-icon icon-manufacturing legend-marker" />{slug}</h2>
                {/if}
                {#if slug == 'STEAM ELECTRIC POWER'}
                    <h2><SteamElectricPower class="usage-type-icon icon-steam-electric-power legend-marker" />{slug}</h2>
                {/if}
                {#if slug == 'LIVESTOCK'}
                    <h2><Livestock class="usage-type-icon icon-livestock legend-marker" />{slug}</h2>
                {/if}
                {#if slug == 'MINING'}
                    <h2><Mining class="usage-type-icon icon-mining legend-marker" />{slug}</h2>
                {/if}
                <p>{constants.USAGE_TYPE_DESCRIPTIONS[slug]}</p>
            </div>
        </div>
    </div>
    <ThemeTotalsByDecadeChart {lrp} wugRegionFilter={undefined} {constants} title={`Usage Type - ${slugify(slug)}`} />
    <DataViewChoiceWrapInd
        page="usagetype"
        slug={slug}
        title={`Usage Type - ${cap(slug)}`}
        {entityMapBlurb}
        showPopulation={false}
        {stratAd}
        {activeDem}
        {lrp}
        csvTitle={`${cap(slug)} Usage Type`}
        fileName={`usagetype_${slug.toLowerCase()}`}
        {constants} />
</div>
{/key}
