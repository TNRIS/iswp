<script>
    //@ts-nocheck
    import ProjectTable from "$lib/components/ProjectTable/ProjectTable.svelte";
    import PopulationChart from "$lib/components/Charts/PopulationChart.svelte";
    import DataViewChoiceWrapInd from "$lib/components/DataByPlanningDecadeAndTheme/DataViewChoiceWrapInd.svelte";
    import ThemeTotalsByDecadeChart from "$lib/components/ThemeTotalsByDecadeChart.svelte";
    import EntityStrategiesTable from "$lib/components/EntityStrategiesTable.svelte";
    import Header from "$lib/components/Header.svelte";
    import { QuerySettings } from "$lib/QuerySettings.js"
    import Statewide from "$lib/db/statewide.js";

    export let data;

    import { load_indexeddb, getConstants, cap } from "$lib/helper.js"
    import { page } from '$app/stores';

    let constants = getConstants($page.url.host)
    let entitySetting = new QuerySettings("entity", "EntityId");
    entitySetting.setAll(Number(data.slug));
    const entityMapBlurb = `<p class="note">Each water user group is mapped to a single point near its primary location; therefore, an entity with a large or multiple service areas may be displayed outside the specific area being queried. The following sources are not mapped to a specific location: 'Direct Reuse', 'Local Surface Water Supply', 'Atmosphere', and 'Rainwater Harvesting'.`;
    let db;
    let entityName = '';

    let stratAd = [
        "Region",
        "County",
        "Entity",
        "Strategy",
        "WMS Type",
        "Source"
    ];

    let activeDem = [
        "Region",
        "County",
        "Entity"
    ];
    $: tagline = "";

    let loadForEntity = async () => {
        let start = Date.now();
        db = await load_indexeddb();
        let sw = new Statewide(db);
        let dat =  await sw.get(entitySetting);
        const pops = dat?.population?.rows;

        entityName = pops?.[0]?.EntityName;
        console.log(`loadForRegion time in ms: ${Date.now() - start}`);
        let groups = '';

        if(pops) {
            for(let i = 0; i < pops.length; i++) {
                const wc = cap(pops[i].WugCounty).trim();
                if(pops.length == 1) {
                    groups += `<a href="/county/${wc}">${wc}</a>`;
                }
                else if(i < pops.length - 1) {
                    groups += `<a href="/county/${wc}">${wc}</a>, `;

                } else {
                    groups += `and <a href="/county/${wc}">${wc}</a>`;
                }
            }
        }
        tagline = groups.length ? `Water User Group in ${groups}` : undefined;

        return dat;
    }
</script>
<Header {constants} />

<div class="statewide-view">
    <section>
        {#await loadForEntity()}
        <div class="loader"></div>
        {:then out}
            <PopulationChart {tagline} title={entityName} swdata={out} {constants}/>
            <ThemeTotalsByDecadeChart swdata={out} {constants} title={`Water User Group - ${entityName}`} />
            <EntityStrategiesTable swdata={out} {constants} title={`Water User Group - ${entityName}`} />
            <ProjectTable project_title={`WATER USER GROUP - ${entityName}`} project_title2={"Projects Serving Area Of Interest"} swdata={ out } type="county"  />
            <DataViewChoiceWrapInd showPopulation={true} swdata={out} title = {`Water User Group - ${entityName}`} csvTitle={entityName} fileName={`entity_${data.slug}`} {constants} {stratAd} {activeDem} {entityMapBlurb} />
        {:catch error}
            <span>Error starting database {error.message}</span>
        {/await}
    </section>
</div>
<style type="text/scss">
    @import '$lib/sass/main.scss';
</style>  