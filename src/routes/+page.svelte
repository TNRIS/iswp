<script>
    import PopulationChart from "$lib/components/Charts/PopulationChart.svelte";
    import { QuerySettings } from "$lib/QuerySettings.js"
    import { load_indexeddb } from "$lib/helper.js";
    import Statewide from "$lib/db/statewide.js";
    import DataUsageType from "$lib/components/DataUsageType.svelte";
    import TitleBlurb from "$lib/components/TitleBlurb.svelte";
    import ThemeTypesByDecadeChart from "$lib/components/ThemeTypesByDecadeChart.svelte";
    import ThemeTotalsByDecadeChart from "$lib/components/ThemeTotalsByDecadeChart.svelte";
    import DataViewChoiceWrap from "$lib/components/DataByPlanningDecadeAndTheme/DataViewChoiceWrap.svelte";

    let stateSettings = new QuerySettings();
    let db = load_indexeddb();

    let loadForState = async () => {
        let start = Date.now();
        console.log("Starting");
        db = await db;
        let sw = new Statewide(db);
        let dat =  await sw.get(stateSettings);

        console.log(`loadForState() time in ms: ${Date.now() - start}`);
        return dat;
    }
</script>

<div class="statewide-view">
    <section>
        {#await loadForState()}
            <span>Loading</span>
        {:then out}
            <PopulationChart title={`Statewide Population`} swdata={out}/>
            <TitleBlurb />
            <ThemeTotalsByDecadeChart swdata={out} />
            <ThemeTypesByDecadeChart chartTitle={"ct-usage-chart"} swdata={out} />
            <DataUsageType swdata={out} />
            <DataViewChoiceWrap {db} />
        {:catch error}
            <span>Error starting database {error.message}</span>
        {/await}
    </section>
</div>
