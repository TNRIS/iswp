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
    import { load_indexeddb, getConstants, cap } from "$lib/helper.js";
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

        const regions = dat?.population?.rows;
        let groups = '';

        let found_regions = [];

        if(regions) {
            for(let i = 0; i < regions.length; i++) {
                const wc = cap(regions[i].WugRegion).trim();
                if(found_regions.includes(wc))
                    continue;
                else
                    found_regions.push(wc);
                
                if(regions.length == 1) {
                    groups += `<a href="/region/${wc}">Region ${wc}</a>`;
                }
                else if(i < regions.length - 1) {
                    groups += `<a href="/region/${wc}">Region ${wc}</a>, `;

                } else {
                    groups += `and <a href="/region/${wc}">Region ${wc}</a>`;
                }
            }
        }
        tagline = groups.length ? `County in ${groups}` : undefined;





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
            <ThemeTotalsByDecadeChart title={`${data.slug} County`} swdata={out} {constants} />
            <ThemeTypesByDecadeChart
                chartTitle={"ct-usage-chart"}
                swdata={out}
                title={`${data.slug} County`}
                {constants}
            />

            <DataUsageType swdata={out} {constants} title={`${data.slug} County`} />
            <ProjectTable project_title={`${data.slug} COUNTY`} project_title2={"Projects Serving Area Of Interest"} swdata={out} type={"region"} />
            <DataViewChoiceWrapInd title={`${data.slug} County`} {entityMapBlurb} showPopulation={true} {stratAd} {activeDem} swdata={out} csvTitle={`${data.slug} County`} fileName={`county_${data.slug.toLowerCase()}`} {constants} />

        {:catch error}
            <span>Error starting database {error.message}</span>
        {/await}
    </section>
</div>

<style type="text/scss">
    @import "$lib/sass/main.scss";
</style>
