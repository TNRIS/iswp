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
    let entityMapBlurb = `<p class="note">Each water user group is mapped to a single point near its primary location; therefore, an entity with a large or multiple service areas may be displayed outside the specific area being queried.</p>`;
    if($page.url.host.includes("2022"))
        entityMapBlurb += `<p class="note">The following sources are not mapped to a specific location: 'Direct Reuse', 'Local Surface Water Supply', 'Atmosphere', and 'Rainwater Harvesting'.</p>`

    
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
        regions.forEach((r) => {
            const wc = r.WugRegion.trim();
            if(!found_regions.includes(wc))
                found_regions.push(wc);
        })

        if(found_regions) {
            found_regions.sort();
            found_regions.forEach((r, i) => {                
                if(found_regions.length == 1) {
                    groups += `<a href="/region/${r}">Region ${r}</a>`;
                }
                else if(i < found_regions.length - 1) {
                    groups += `<a href="/region/${r}">Region ${r}</a>, `;
                } else {
                    groups += `and <a href="/region/${r}">Region ${r}</a>`;
                }
            });
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
                dont_capitalize_title={true}
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