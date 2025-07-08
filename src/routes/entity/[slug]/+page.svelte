<script>
    import ProjectTable from '$lib/components/ProjectTable/ProjectTable.svelte';
    import PopulationChart from '$lib/components/Charts/PopulationChart.svelte';
    import DataViewChoiceWrapInd from '$lib/components/DataByPlanningDecadeAndTheme/DataViewChoiceWrapInd.svelte';
    import ThemeTotalsByDecadeChart from '$lib/components/ThemeTotalsByDecadeChart.svelte';
    import EntityStrategiesTable from '$lib/components/EntityStrategiesTable.svelte';
    import { QuerySettings } from '$lib/QuerySettings.js';
    import { getConstants, cap, wrapupCommonIdbTasks } from '$lib/helper.js';
    import { page } from '$app/stores';

    let slug = $derived($page.params.slug);
    let { data, entityName = $bindable(''), tagline = $bindable('') } = $props();
    let constants = getConstants($page.url.host);
    let entitySetting = new QuerySettings('entity', 'EntityId');
    (() => {entitySetting.setAll(Number(slug))})();
    let entityMapBlurb = $state(`<p class="note">Each water user group is mapped to a single point near its primary location; therefore, an entity with a large or multiple service areas may be displayed outside the specific area being queried.</p>`);
    if (!constants.id == 17)
        entityMapBlurb += `<p class="note">The following sources are not mapped to a specific location: 'Direct Reuse', 'Local Surface Water Supply', 'Atmosphere', and 'Rainwater Harvesting'.</p>`;

    let camelCaseEntityName = $derived("Water User Group - " + entityName);
    let capsEntityName = $derived("WATER USER GROUP - " + entityName);

    let stratAd = ['Region', 'County', 'Entity', 'Strategy', 'WMS Type', 'Source'];
    let activeDem = ['Region', 'County', 'Entity'];

    let loadForEntity = async () => {
        entityName = JSON.parse(localStorage.entityCoordinates).find((element) => element.EntityId == slug).EntityName;
        let [db, sw] = await wrapupCommonIdbTasks();
        let dat = await sw.get(entitySetting);
        const pops = dat?.population?.rows;

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
    let lrp = $state(loadForEntity());

    $effect(() => {
        entitySetting.setAll(Number(slug));
        lrp = loadForEntity();
    });
</script>

<svelte:head>
    {#key slug}
    <title>Water User Group{entityName ? ` for ${entityName}` : ''}</title>
    {/key}
</svelte:head>
<div class="statewide-view" id="main-content" role="main">
    <section>
        {#key lrp}
        <PopulationChart bind:tagline={tagline} title={entityName} {lrp} {constants} />
        <ThemeTotalsByDecadeChart {lrp} {constants} title={camelCaseEntityName} />
        <EntityStrategiesTable {lrp} {constants} title={camelCaseEntityName} />
        <ProjectTable
            project_title={capsEntityName}
            project_title2={'Projects Serving Area of Interest'}
            {lrp}
            type="county" />
        <DataViewChoiceWrapInd
            showPopulation={true}
            {lrp}
            title={camelCaseEntityName}
            csvTitle={entityName}
            fileName={`entity_${slug}`}
            {constants}
            {stratAd}
            {activeDem}
            {entityMapBlurb} />
        {/key}
    </section>
</div>
