<script>
    //@ts-nocheck
    import ProjectTable from "$lib/components/ProjectTable/ProjectTable.svelte";
    import { QuerySettings } from "$lib/QuerySettings.js";
    import Statewide from "$lib/db/statewide.js";
    export let data;
    import PopulationChart from "$lib/components/Charts/PopulationChart.svelte";
    import ThemeTotalsByDecadeChart from "$lib/components/ThemeTotalsByDecadeChart.svelte";
    import DataUsageType from "$lib/components/DataUsageType.svelte";
    import DataViewChoiceWrapInd from "$lib/components/DataByPlanningDecadeAndTheme/DataViewChoiceWrapInd.svelte";
    import ThemeTypesByDecadeChart from "$lib/components/ThemeTypesByDecadeChart.svelte";
    import Header from "$lib/components/Header.svelte";
    import { load_indexeddb, getConstants } from "$lib/helper.js";
    import { page } from '$app/stores';
    const entityMapBlurb = `<p class="note">Each water user group is mapped to a single point near its primary location; therefore, an entity with a large or multiple service areas may be displayed outside the specific area being queried.</p>`;
    let stratAd = [
        "Region",
        "Entity",
        "Strategy",
        "WMS Type",
        "Source"
    ];

    let activeDem = [
        "Region",
        "Entity"
    ];
    $: tagline = "";
    let constants = getConstants($page.url.host);
    let regionSetting = new QuerySettings("county", "WugCounty");
    regionSetting.setAll(data.slug.toUpperCase());
    let db;
    let loadForCounty = async () => {
        let start = Date.now();
        db = await load_indexeddb();
        let sw = new Statewide(db);
        let dat = await sw.get(regionSetting);
        console.log(`loadForRegion time in ms: ${Date.now() - start}`);
        tagline = 'County in <a href="/">Texas</a>'
        let region = dat?.population?.rows[0]?.WugRegion;

        tagline = region ? `County in <a href="/region/${region}/">Region ${region}</a>` : undefined;
        return dat;
    };

</script>
<Header {constants} />

<div class="statewide-view">
    <section>
        {#await loadForCounty()}
            <div class="loader"></div>
        {:then out}
            <PopulationChart
                title={`${data.slug} County`}
                swdata={out}
                {tagline}
                {constants}
            />
            <ThemeTotalsByDecadeChart swdata={out} {constants} />
            <ThemeTypesByDecadeChart
                chartTitle={"ct-usage-chart"}
                swdata={out}
                {constants}
            />

            <DataUsageType swdata={out} {constants} />
            <ProjectTable project_title={`${data.slug} COUNTY`} project_title2={"Projects Serving Area Of Interest"} swdata={out} type={"region"} />
            <DataViewChoiceWrapInd {entityMapBlurb} showPopulation={true} {stratAd} {activeDem} swdata={out} csvTitle={`${data.slug} County`} fileName={`county_${data.slug.toLowerCase()}`} {constants} />

        {:catch error}
            <span>Error starting database {error.message}</span>
        {/await}
    </section>
</div>

<style type="text/scss">
    @import "$lib/sass/main.scss";
</style>
