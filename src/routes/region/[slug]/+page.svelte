<script>
    //@ts-nocheck
    import PopulationChart from "$lib/components/Charts/PopulationChart.svelte";
    import DataUsageType from "$lib/components/DataUsageType.svelte";
    import ProjectTable from "$lib/components/ProjectTable/ProjectTable.svelte";
    import ThemeTypesByDecadeChart from "$lib/components/ThemeTypesByDecadeChart.svelte";
    import ThemeTotalsByDecadeChart from "$lib/components/ThemeTotalsByDecadeChart.svelte";
    import DataViewChoiceWrapInd from "$lib/components/DataByPlanningDecadeAndTheme/DataViewChoiceWrapInd.svelte";
    import { load_indexeddb, getConstants } from "$lib/helper.js";
    import Statewide from "$lib/db/statewide.js";
    import Counties from "$lib/db/counties.js"

    import { QuerySettings } from "$lib/QuerySettings.js"
    export let data;
    import { setContext } from "svelte";
    import { writable } from "svelte/store";
    import Header from "$lib/components/Header.svelte";
    import { page } from '$app/stores';

    const tagline = 'Regional Water Planning Area in <a href="/">Texas</a>'
    let stratAd = [
        "Strategy",
        "WMS Type",
        "Source",
        "County",
        "Entity"
    ];

    let activeDem = [
        "County",
        "Entity"
    ];

    let constants = getConstants($page.url.host)
    let regionSetting = new QuerySettings("region", "WugRegion");
    regionSetting.setAll(data.slug);
    let db;
    let loadForRegion = async () => {
        let start = Date.now();
        db = await load_indexeddb()
        let sw = new Statewide(db);
        let cc = new Counties(db);
        let [ccounties, dat] = await Promise.all([cc.get(data.slug), sw.get(regionSetting)]) ;
        //let ccounties = await cc.get(data.slug);
        //let dat =  await sw.get(regionSetting);

        dat.counties = ccounties;
        console.log(`loadForRegion time in ms: ${Date.now() - start}`);
        return dat;
    }

    setContext("dataviewContext", {
        getData: writable()
    });
    const entityMapBlurb = `<p class="note">Each water user group is mapped to a single point near its primary location; therefore, an entity with a large or multiple service areas may be displayed outside the specific area being queried. The following sources are not mapped to a specific location: 'Direct Reuse', 'Local Surface Water Supply', 'Atmosphere', and 'Rainwater Harvesting'.</p>`
</script>
<Header {constants} />

<div class="statewide-view">
    <section>
        {#await loadForRegion()}
        <div class="loader"></div>
        {:then out}
        <PopulationChart title={`Planning Region ${data.slug}`} swdata={out} {constants} {tagline} />
        <div class="container">
            <div class="row panel-row">
                <div class="twelve columns">
                    <div>
                        {#if constants.regionalLink}
                        <!-- 2016 description. -->
                        <p>{constants.regionalDescription[data.slug]} <a href={`http://www.twdb.texas.gov/waterplanning/rwp/plans/2016/#region-${data.slug.toLowerCase()}`}>
                                http://www.twdb.texas.gov/waterplanning/rwp/plans/2016/#region-{data.slug.toLowerCase()}
                            </a>. {constants.regionalLink[data.slug]}<a href={`http://www.twdb.texas.gov/waterplanning/swp/2017/doc/2016_RegionalSummary_${data.slug}.pdf`}>
                                http://www.twdb.texas.gov/waterplanning/swp/2017/doc/2016_RegionalSummary_{data.slug}.pdf
                            </a>.
                        </p>
                        {:else}
                        <!-- 2022 description. -->
                        <p>{constants.regionalDescription[data.slug]} {@html constants.region_footer}</p>
                        {/if}
                    </div>
                </div> 
            </div>
        </div>
        <ThemeTotalsByDecadeChart swdata={out} {constants} title={`Planning Region ${data.slug}`} />
        <ThemeTypesByDecadeChart chartTitle={"ct-usage-chart"} swdata={out} {constants} title={`Planning Region ${data.slug}`} />
        <DataUsageType title={`Planning Region ${data.slug}`} swdata={out} {constants} />
        <ProjectTable project_title={`PLANNING REGION ${data.slug}`} project_title2={"Projects "} swdata={out} type={"region"} />
        <DataViewChoiceWrapInd title={`Planning Region ${data.slug}`} showPopulation={true} type={"region"} {stratAd} {activeDem} {constants} csvTitle={`Planning Region ${data.slug}`} swdata={out} fileName={`region_${data.slug.toLowerCase()}`} {entityMapBlurb} />
        {:catch error}
            <span>Error starting database {error.message}</span>
        {/await}
    </section>
</div>

<style type="text/scss">
    @import '$lib/sass/main.scss';
</style>  