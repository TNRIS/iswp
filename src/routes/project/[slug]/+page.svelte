<script>
    import ProjectTable2 from '$lib/components/ProjectTable/ProjectTable2.svelte';
    import DataViewChoiceWrapInd from '$lib/components/DataByPlanningDecadeAndTheme/DataViewChoiceWrapInd.svelte';

    export let data;
    let db = load_indexeddb();
    import { QuerySettings } from '$lib/QuerySettings.js';
    import { load_indexeddb, getConstants, cap, is_idb_loaded } from '$lib/helper.js?v1';
    import Statewide from '$lib/db/statewide.js';
    import Header from '$lib/components/Header.svelte';
    import PopulationChart from '$lib/components/Charts/PopulationChart.svelte';
    import { page } from '$app/stores';
    const entityMapBlurb = `<p class="note">Each water user group is mapped to a single point near its primary location; therefore, an entity with a large or multiple service areas may be displayed outside the specific area being queried. Red triangles indicate capital projects. If a water user group does not display with the selected project, the project is not currently assigned to a specific water user group.</p>`;
    let constants = getConstants($page.url.host);
    $: tagline = '';
    let sourceSetting = new QuerySettings('strategies', 'WmsProjectId');
    sourceSetting.setAll(Number(data.slug));

    const sourceSetting2 = new QuerySettings('wms', 'WmsProjectId');
    sourceSetting2.setAll(Number(data.slug));
    let projectName = '';
    const loadForSource = async () => {
        await is_idb_loaded();
        const start = Date.now();
        db = await db;
        const sw = new Statewide(db);
        let dat2 = await sw.get(sourceSetting);
        let dat = await sw.get(sourceSetting2);

        for (let i = 0; i < dat2.projects.length; i++) {
            try {
                dat.projects.push(dat2.projects[i])
            } catch (err) {
                console.log('problem merging data in projects. Attempting to continue.');
            }
        }


        const decade_online = dat?.projects[0].OnlineDecade;

        let formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        });
        const capital_cost = formatter.format(dat?.projects[0].CapitalCost);

        tagline = `<span>Decade Online: ${decade_online}</span><br /><span>Capital Cost: ${capital_cost}</span>`;
        console.log(`loadForRegion time in ms: ${Date.now() - start}`);

        projectName = dat.projects[0].ProjectName;
        return dat;
    };

    // Promise to load for source. Do not await here. Await later in individual entities.
    const lrp = loadForSource();
</script>

<Header {constants} {db} />
<svelte:head>
    <title>Project {projectName ? ` for ${projectName}` : ''}</title>
</svelte:head>
<div class="statewide-view" id="main-content" role="main">
    <!--TODO weigh whether it's a good idea to cache project information in the future here. In order to load each entity one at a time.-->
    {#await loadForSource()}
        <div class="loader"></div>
    {:then out}
        <PopulationChart {tagline} title={projectName} titleOnly={true} {lrp} {constants} />
        <ProjectTable2
            project_title={`WMS PROJECT - ${projectName}`}
            project_title2={'Water Management Strategies related to Project'}
            {lrp}
            type={'region'} />
        <DataViewChoiceWrapInd
            title={`WMS PROJECT - ${projectName}`}
            {entityMapBlurb}
            {lrp}
            type={'pop'}
            hideTheme={true}
            {constants}
            csvTitle={`${cap(projectName)} WMS`}
            fileName={`project_${data.slug}`} />
    {:catch error}
        <span>Error starting database {error.message}</span>
    {/await}
</div>
