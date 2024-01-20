<script>
    import PopulationChart from "$lib/components/Charts/PopulationChart.svelte";
    import { QuerySettings } from "$lib/QuerySettings.js";
    import { load_indexeddb } from "$lib/helper.js";
    import Statewide from "$lib/db/statewide.js";
    import DataUsageType from "$lib/components/DataUsageType.svelte";
    import TitleBlurb from "$lib/components/TitleBlurb.svelte";
    import ThemeTypesByDecadeChart from "$lib/components/ThemeTypesByDecadeChart.svelte";
    import ThemeTotalsByDecadeChart from "$lib/components/ThemeTotalsByDecadeChart.svelte";
    import DataViewChoiceWrap from "$lib/components/DataByPlanningDecadeAndTheme/DataViewChoiceWrap.svelte";
    import Header from "$lib/components/Header.svelte";
    import { onMountSync, getConstants } from "$lib/helper.js";
    import { page } from '$app/stores';

    let constants = getConstants($page.url.host);
    let stateSettings = new QuerySettings();
    let db = load_indexeddb();

    let loadForState = async () => {
        await onMountSync();
        let start = Date.now();
        db = await db;
        let sw = new Statewide(db);
        let dat = await sw.get(stateSettings);
        
        console.log(`loadForState() time in ms: ${Date.now() - start}`);
        return dat;
    };
</script>

<Header {db} {constants} />
<div class="statewide-view">
    <section>
        {#await loadForState()}
        <div class="loader"></div>
        {:then out}
            <PopulationChart title={`TEXAS`} swdata={out} {constants} />
            <TitleBlurb {constants} />
            <ThemeTotalsByDecadeChart swdata={out} {constants} />
            <ThemeTypesByDecadeChart
                chartTitle={"ct-usage-chart"}
                swdata={out}
                {constants}
            />
            <DataUsageType swdata={out} {constants} />
            <DataViewChoiceWrap {db} swdata={out} csvTitle= {"Statewide"} {constants} />
        {:catch error}
            <span>Error starting database {error.message}</span>
        {/await}
    </section>
</div>

<style type="text/scss">
    @import "$lib/sass/main.scss";
</style>
