<script>
    //@ts-nocheck
    import ProjectTable from "$lib/components/ProjectTable/ProjectTable.svelte";
    import DataViewChoiceWrapInd from "$lib/components/DataByPlanningDecadeAndTheme/DataViewChoiceWrapInd.svelte";
    import { load_indexeddb, getConstants, cap } from "$lib/helper.js";
    import Statewide from "$lib/db/statewide.js";
    import { QuerySettings } from "$lib/QuerySettings.js"
    export let data;
    import { setContext } from "svelte";
    import { writable } from "svelte/store";
    import Header from "$lib/components/Header.svelte";
    import { wms_info } from "$lib/WmsTypes.js";
    
    import { page } from '$app/stores';
    let stratAd = [
        "WMS Type",
        "Strategy",
        "Source",
        "Region",
        "County",
        "Entity"
    ];
    let constants = getConstants($page.url.host)
    let wmsTypeSetting = new QuerySettings("datastrategies", "WmsType");
    wmsTypeSetting.setAll(data.slug);
    const wmsSetting2 = new QuerySettings("wmstype", "WmsType");
    wmsSetting2.setAll(data.slug);
    let db;
    let entityMapBlurb = `<p class="note">Each water user group is mapped to a single point near its primary location; therefore, an entity with a large or multiple service areas may be displayed outside the specific area being queried.</p>`;
    if($page.url.host.includes("2022"))
        entityMapBlurb += `<p class="note">The following sources are not mapped to a specific location: 'Direct Reuse', 'Local Surface Water Supply', 'Atmosphere', and 'Rainwater Harvesting'.</p>`;

    let loadForWmsType = async () => {
        let start = Date.now();
        db = await load_indexeddb()
        let sw = new Statewide(db);
        let dat = await sw.get(wmsTypeSetting);
        let dat2 = await sw.get(wmsSetting2);
        let r = {
            strategies: dat.strategies,
            projects: dat2.projects
        };
        console.log(`loadForRegion time in ms: ${Date.now() - start}`);
        return r;
    }

    setContext("dataviewContext", {
        getData: writable()
    });   
</script>
<Header {constants} />

<div class="statewide-view">
    <section>
        {#await loadForWmsType()}
        <div class="loader"></div>
        {:then out}
        <div class="view-top usage-type-view-top">
            <div class="summary-wrapper container">
                
                <div class="view-summary usage-type-summary">
                    <h1>{data.slug}</h1>
                    {wms_info.WMS_TYPE_DESCRIPTIONS[data.slug.replace('AND', '&')]}
                </div>
            </div>
        </div>
        <ProjectTable project_title={`WMS TYPE - ${data.slug}`} project_title2={"Projects related to Water Management Strategy Type"} swdata={out} type={"region"} />
        <DataViewChoiceWrapInd title={`WMS TYPE - ${data.slug}`} {entityMapBlurb} {stratAd} swdata={out} hideTheme={true} type={"wmstype"} csvTitle={`${cap(data.slug)} WMS Type`} {constants} />

        {:catch error}
            <span>Error starting database {error.message}</span>
        {/await}
    </section>
</div>

<style type="text/scss">
    @import '$lib/sass/main.scss';
</style>  