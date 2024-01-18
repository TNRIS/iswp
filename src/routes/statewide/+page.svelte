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

    import { onMountSync } from "$lib/helper.js";

    import { Constant2027 } from "$lib/Constant2027.js";
    import { Constant2022 } from "$lib/Constant2022.js";
    import { Constant2017 } from "$lib/Constant2017.js";

    const year = 2027;
    let constants;
    if(year == 2027) {
        constants = new Constant2027();
    } else if (year == 2022) {
        constants = new Constant2022();
    } else if (year == 2017) {
        constants = new Constant2017();
    }


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
            <span>Loading</span>
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
