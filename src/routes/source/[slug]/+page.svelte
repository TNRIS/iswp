<script>
    import ProjectTable from '$lib/components/ProjectTable/ProjectTable.svelte';
    import DataViewChoiceWrapInd from '$lib/components/DataByPlanningDecadeAndTheme/DataViewChoiceWrapInd.svelte';
    import PopulationChart from '$lib/components/Charts/PopulationChart.svelte';
    import { QuerySettings } from '$lib/QuerySettings.js';
    import { load_indexeddb, getConstants, cap, is_idb_loaded } from '$lib/helper.js';
    import Statewide from '$lib/db/statewide.js';
    import { page } from '$app/stores';

    let db = load_indexeddb();
    let slug = $derived($page.params.slug);
    let entityMapBlurb = $state(`<p class="note">Each water user group is mapped to a single point near its primary location; therefore, an entity with a large or multiple service areas may be displayed outside the specific area being queried.</p>`);
    let constants = getConstants($page.url.host);
    if (constants.id !== 17)
        entityMapBlurb += `<p class="note">The following sources are not mapped to a specific location: 'Direct Reuse', 'Local Surface Water Supply', 'Atmosphere', and 'Rainwater Harvesting'.</p>`;

    let sourceSetting = new QuerySettings('source', 'MapSourceId');
    (() => {sourceSetting.setAll(slug)})();
    let title = $state('');
    let tagline = $state(`Surface Water Source in <a href="/">Texas</a>`);
    let stratAd = ['Region', 'County', 'Entity', 'Strategy', 'WMS Type', 'Source'];
    let activeDem = ['Region', 'County', 'Entity']; // Active pivot columns for everything other than strategy supplies.
    let loadForSource = async () => {
        await is_idb_loaded();
        title = constants.sourceNames.find((x) => x.value == parseInt(slug))?.label;

        if (title?.includes('|')) {
            const county = title.split('|')[1].trim();
            const countyName = cap(county);

            tagline = `Groundwater Source in <a href="/county/${countyName}">${countyName}</a>`;
        } else {
            tagline = `Surface Water Source in <a href="/">Texas</a>`;
        }

        db = await db;
        let sw = new Statewide(db);
        let dat = await sw.get(sourceSetting);
        return dat;
    };

    // Promise to load for source. Do not await here. Await later in individual entities.
    let lrp = $state(loadForSource());
    $effect(() => {
        sourceSetting.setAll(slug);
        lrp = loadForSource();
    });

</script>

<svelte:head>
    {#key slug}
    <title>Source{title ? ` for ${title}` : ''}</title>
    {/key}
</svelte:head>
{#key lrp}
<div class="statewide-view" id="main-content" role="main">
    {#await lrp then}
        <!-- TODO remove this await and await in individual entities. For now await because of title generation. -->
        <PopulationChart lrp={true} {tagline} titleOnly={true} {title} {constants} />
        <ProjectTable
            {lrp}
            type={'region'}
            project_title={'WATER SOURCE - ' + title}
            project_title2={'Projects Associated with Source'}
            {title} />
        <DataViewChoiceWrapInd
            {activeDem}    
            {stratAd}
            slug={slug}
            title={'WATER SOURCE - ' + title}
            {entityMapBlurb}
            {lrp}
            type={'source'}
            fileName={`source_${slug}`}
            {constants}
            csvTitle={title}
            sourcePage={true} />
    {/await}
</div>
{/key}
