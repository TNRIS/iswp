<script>
    import ProjectTable from "$lib/components/ProjectTable/ProjectTable.svelte";
    import DataViewChoiceWrapInd from "$lib/components/DataByPlanningDecadeAndTheme/DataViewChoiceWrapInd.svelte";
    import PopulationChart from "$lib/components/Charts/PopulationChart.svelte";

    export let data;
    let db;
    import { QuerySettings } from "$lib/QuerySettings.js";
    import { load_indexeddb, getConstants, cap } from "$lib/helper.js";
    import Statewide from "$lib/db/statewide.js";
    import Header from "$lib/components/Header.svelte";

    import { sourceNames } from "$lib/SourceNames.js";
    import { page } from '$app/stores';

    let entityMapBlurb = `<p class="note">Each water user group is mapped to a single point near its primary location; therefore, an entity with a large or multiple service areas may be displayed outside the specific area being queried.</p>`;
    if($page.url.host.includes("2022"))
        entityMapBlurb += `<p class="note">The following sources are not mapped to a specific location: 'Direct Reuse', 'Local Surface Water Supply', 'Atmosphere', and 'Rainwater Harvesting'.</p>`;
    
    let constants = getConstants($page.url.host)
    let sourceSetting = new QuerySettings("source", "MapSourceId");
    sourceSetting.setAll(Number(data.slug));
    let title = "";
    let tagline = `Surface Water Source in <a href="/">Texas</a>`
    let stratAd = [
        "Region",
        "County",
        "Entity",
        "Strategy",
        "WMS Type",
        "Source"
    ];
    let loadForSource = async () => {
        let start = Date.now();

        title = sourceNames.find(x => x.label == parseInt(data.slug))?.value;

        if (title.includes("|")) {
            const county = title.split("|")[1].trim();
            const countyName = cap(county);

            tagline = `Groundwater Source in <a href="/county/${countyName}">${countyName}</a>`
        }
        else {
            tagline = `Surface Water Source in <a href="/">Texas</a>`
        }

        db = await load_indexeddb();
        let sw = new Statewide(db);
        let dat = await sw.get(sourceSetting);
        console.log(`loadForRegion time in ms: ${Date.now() - start}`);
        return dat;
    };
</script>
<Header {constants} />
<div class="statewide-view">

{#await loadForSource()}
<div class="loader"></div>
{:then out}
<PopulationChart {tagline} titleOnly={true} {title} {constants} />
<ProjectTable swdata={out} type={"region"} project_title={"WATER SOURCE - " + title} project_title2={"Projects Associated with Source"} {title} />
<DataViewChoiceWrapInd {stratAd} slug={data.slug} {title} {entityMapBlurb} swdata={out} type={"source"} fileName={`source_${data.slug}`} {constants} csvTitle={title} sourcePage={true} />

{:catch error}
    <span>Error starting database {error.message}</span>
{/await}
</div>
<style type="text/scss">
    @import '$lib/sass/main.scss';
</style>  
