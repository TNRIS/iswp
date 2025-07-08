<script>
    import ProjectTable from '$lib/components/ProjectTable/ProjectTable.svelte';
    import { QuerySettings } from '$lib/QuerySettings.js';
    import PopulationChart from '$lib/components/Charts/PopulationChart.svelte';
    import ThemeTotalsByDecadeChart from '$lib/components/ThemeTotalsByDecadeChart.svelte';
    import DataUsageType from '$lib/components/DataUsageType.svelte';
    import DataViewChoiceWrapInd from '$lib/components/DataByPlanningDecadeAndTheme/DataViewChoiceWrapInd.svelte';
    import ThemeTypesByDecadeChart from '$lib/components/ThemeTypesByDecadeChart.svelte';
    import { getConstants, wrapupCommonIdbTasks } from '$lib/helper.js';
    import { page } from '$app/stores';

    let constants = getConstants($page.url.host);

    let entityMapBlurb = $state(`<p class="note">Each water user group is mapped to a single point near its primary location; therefore, an entity with a large or multiple service areas may be displayed outside the specific area being queried.</p>`);
    if (!constants.id == 17)
        entityMapBlurb += `<p class="note">The following sources are not mapped to a specific location: 'Direct Reuse', 'Local Surface Water Supply', 'Atmosphere', and 'Rainwater Harvesting'.</p>`;
    let stratAd = ['Region', 'Entity', 'Strategy', 'WMS Type', 'Source'];
    let activeDem = ['Region', 'Entity'];
    let tagline = $state('County in <a href="/">Texas</a>');
    let regionSetting = new QuerySettings('county', 'WugCounty');

    let loadForCounty = async () => {
            let [db, sw] = await wrapupCommonIdbTasks();
            let dat = await sw.get(regionSetting);

            tagline = 'County in <a href="/">Texas</a>';

            const regions = dat?.population?.rows;
            let groups = '';

            let found_regions = [];
            regions.forEach((r) => {
                const wc = r.WugRegion.trim();
                if (!found_regions.includes(wc)) found_regions.push(wc);
            });

            if (found_regions) {
                found_regions.sort();
                found_regions.forEach((r, i) => {
                    if (found_regions.length == 1) {
                        groups += `<a href="/region/${r}">Region ${r}</a>`;
                    } else if (i < found_regions.length - 1) {
                        groups += `<a href="/region/${r}">Region ${r}</a>, `;
                    } else {
                        groups += `and <a href="/region/${r}">Region ${r}</a>`;
                    }
                });
            }
            tagline = groups.length ? `County in ${groups}` : undefined;

            // Do not await here. Await in the individual entities to allow loading of page before entities gather their data.
            return dat;
    };

    let lrp = $state(loadForCounty());

    $effect(() => {
        regionSetting.setAll(slug.toUpperCase());
        lrp = loadForCounty();
    });

    let slug = $derived($page.params.slug);

</script>

<svelte:head>
    {#key slug}
    <title>{slug ? `${slug} County` : 'County'}</title>
    {/key}
</svelte:head>


{#key lrp}
<div class="statewide-view" id="main-content" role="main">
    <section>
        <!-- We need to await lrp for the tagline here.-->
        {#await lrp}
            <br />
            <div class="summary-wrapper container" style="z-index: 600;">
                <div class="row panel-row" style="pointer-events: auto;">
                    <div class="twelve columns">
                        <div class="loader"></div>
                    </div>
                </div>
            </div>
        {:then}
            <PopulationChart title={`${slug} County`} {lrp} {tagline} {constants} dont_capitalize_title={true} />
        {/await}
        <ThemeTotalsByDecadeChart title={`${slug} County`} {lrp} {constants} />
        <ThemeTypesByDecadeChart chartTitle={'ct-usage-chart'} {lrp} title={`${slug} County`} {constants} />
        <DataUsageType {lrp} {constants} title={`${slug} County`} />
        <ProjectTable project_title={`${slug} COUNTY`} project_title2={'Projects Serving Area of Interest'} {lrp} type={'region'} />
        <DataViewChoiceWrapInd
            title={`${slug} County`}
            {entityMapBlurb}
            showPopulation={true}
            {stratAd}
            {activeDem}
            {lrp}
            csvTitle={`${slug} County`}
            fileName={`county_${slug.toLowerCase()}`}
            {constants} />
    </section>
</div>
{/key}