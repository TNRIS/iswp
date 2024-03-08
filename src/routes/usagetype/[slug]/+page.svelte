<script>
    import { load_indexeddb, slugify, getConstants } from "$lib/helper.js";
    import Statewide from "$lib/db/statewide.js";
    import { QuerySettings } from "$lib/QuerySettings.js"
    import ThemeTotalsByDecadeChart from "$lib/components/ThemeTotalsByDecadeChart.svelte";
    import DataViewChoiceWrapInd from "$lib/components/DataByPlanningDecadeAndTheme/DataViewChoiceWrapInd.svelte";
    export let data;
    import Header from "$lib/components/Header.svelte";
    import Irrigation from "/static/img/icon-irrigation.svg";
    import Municipal from "/static/img/icon-municipal.svg";
    import Manufacturing from "/static/img/icon-manufacturing.svg";
    import SteamElectricPower from "/static/img/icon-steam-electric-power.svg";
    import Livestock from "/static/img/icon-livestock.svg";
    import Mining from "/static/img/icon-mining.svg";
    import { page } from '$app/stores';
    const entityMapBlurb = `<p class="note">Each water user group is mapped to a single point near its primary location; therefore, an entity with a large or multiple service areas may be displayed outside the specific area being queried.</p>`

    let constants = getConstants($page.url.host)
    let utSetting = new QuerySettings("usagetype", "WugType");
    utSetting.setAll(data.slug.toUpperCase());

    let db;

    let stratAd = [
        "Strategy",
        "WMS Type",
        "Source",
        "Region",
        "County",
        "Entity"
    ];

    let activeDem = [
        "Region",
        "County",
        "Entity"
    ];

    let loadForRegion = async () => {
        let start = Date.now();
        db = await load_indexeddb()
        let sw = new Statewide(db);
        let dat =  await sw.get(utSetting);
        console.log(`loadForRegion time in ms: ${Date.now() - start}`);
        return dat;
    }

    
</script>
<Header {constants} />

<div class="statewide-view">
{#await loadForRegion()}
<div class="loader"></div>
{:then out}
<div class="view-top usage-type-view-top">
    <div class="summary-wrapper container">
        <div class="view-summary usage-type-summary">
            {#if data.slug == "IRRIGATION"}
            <h2><Irrigation class="usage-type-icon icon-irrigation legend-marker" />{data.slug}</h2>
            {/if}
            {#if data.slug == "MUNICIPAL"}
            <h2><Municipal class="usage-type-icon icon-irrigation legend-marker" />{data.slug}</h2>
            {/if}
            {#if data.slug == "MANUFACTURING"}
            <h2><Manufacturing class="usage-type-icon icon-irrigation legend-marker" />{data.slug}</h2>
            {/if}
            {#if data.slug == "STEAM ELECTRIC POWER"}
            <h2><SteamElectricPower class="usage-type-icon icon-irrigation legend-marker" />{data.slug}</h2>
            {/if}
            {#if data.slug == "LIVESTOCK"}
            <h2><Livestock class="usage-type-icon icon-irrigation legend-marker" />{data.slug}</h2>
            {/if}
            {#if data.slug == "MINING"}
            <h2><Mining class="usage-type-icon icon-irrigation legend-marker" />{data.slug}</h2>
            {/if}
            <p>{constants.USAGE_TYPE_DESCRIPTIONS[data.slug]}</p>
        </div>
    </div>
</div>
<ThemeTotalsByDecadeChart swdata={out} {constants} />
<DataViewChoiceWrapInd {entityMapBlurb} showPopulation={false} {stratAd} {activeDem} swdata={out} csvTitle={`${slugify(data.slug)} Usage Type`} fileName={`usagetype_${data.slug.toLowerCase()}`} {constants} />

{:catch error}
<span>Error starting database {error.message}</span>
{/await}
</div>

<style type="text/scss">
    @import '$lib/sass/main.scss';
</style>  