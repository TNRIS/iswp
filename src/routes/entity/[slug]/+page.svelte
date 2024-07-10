<script>
    //@ts-nocheck
    import ProjectTable from '$lib/components/ProjectTable/ProjectTable.svelte';
    import PopulationChart from '$lib/components/Charts/PopulationChart.svelte';
    import DataViewChoiceWrapInd from '$lib/components/DataByPlanningDecadeAndTheme/DataViewChoiceWrapInd.svelte';
    import ThemeTotalsByDecadeChart from '$lib/components/ThemeTotalsByDecadeChart.svelte';
    import EntityStrategiesTable from '$lib/components/EntityStrategiesTable.svelte';
    import Header from '$lib/components/Header.svelte';
    import { QuerySettings } from '$lib/QuerySettings.js';
    import Statewide from '$lib/db/statewide.js';

    export let data;

    import { load_indexeddb, getConstants, cap, is_idb_loaded } from '$lib/helper.js';
    import { page } from '$app/stores';

    let constants = getConstants($page.url.host);
    let entitySetting = new QuerySettings('entity', 'EntityId');
    entitySetting.setAll(Number(data.slug));
    let entityMapBlurb = `<p class="note">Each water user group is mapped to a single point near its primary location; therefore, an entity with a large or multiple service areas may be displayed outside the specific area being queried.</p>`;
    if ($page.url.host.includes('2022'))
        entityMapBlurb += `<p class="note">The following sources are not mapped to a specific location: 'Direct Reuse', 'Local Surface Water Supply', 'Atmosphere', and 'Rainwater Harvesting'.</p>`;

    let db = load_indexeddb();
    let entityName = JSON.parse(localStorage.entityCoordinates).find((element) => element.EntityId == data.slug).EntityName;

    let stratAd = ['Region', 'County', 'Entity', 'Strategy', 'WMS Type', 'Source'];

    let activeDem = ['Region', 'County', 'Entity'];
    $: tagline = '';

    let loadForEntity = async () => {
        await is_idb_loaded();
        let start = Date.now();
        db = await db;
        let sw = new Statewide(db);
        let dat = await sw.get(entitySetting);
        const pops = dat?.population?.rows;

        console.log(`loadForRegion time in ms: ${Date.now() - start}`);
        let groups = '';

        if (pops) {
            for (let i = 0; i < pops.length; i++) {
                const wc = cap(pops[i].WugCounty).trim();
                if (pops.length == 1) {
                    groups += `<a href="/county/${wc}">${wc}</a>`;
                } else if (i < pops.length - 1) {
                    groups += `<a href="/county/${wc}">${wc}</a>, `;
                } else {
                    groups += `and <a href="/county/${wc}">${wc}</a>`;
                }
            }
        }
        tagline = groups.length ? `Water User Group in ${groups}` : undefined;

        return dat;
    };
    // Promise to load for entity. Do not await here. Await later in individual entities.
    const lrp = loadForEntity();
</script>

<Header {constants} {db} />
<svelte:head>
    <title>Water User Group</title>
</svelte:head>
<div class="statewide-view">
    <section>
        <PopulationChart {tagline} bind:title={entityName} {lrp} {constants} />
        <ThemeTotalsByDecadeChart {lrp} {constants} title={`Water User Group - ${entityName}`} />
        <EntityStrategiesTable {lrp} {constants} title={`Water User Group - ${entityName}`} />
        <ProjectTable
            project_title={`WATER USER GROUP - ${entityName}`}
            project_title2={'Projects Serving Area Of Interest'}
            {lrp}
            type="county" />
        <DataViewChoiceWrapInd
            showPopulation={true}
            {lrp}
            title={`Water User Group - ${entityName}`}
            csvTitle={entityName}
            fileName={`entity_${data.slug}`}
            {constants}
            {stratAd}
            {activeDem}
            {entityMapBlurb} />
    </section>
</div>
