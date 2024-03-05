<script>
    console.log("starting main page")
    const popChartPromise = import("$lib/components/Charts/PopulationChart.svelte");
    const TitleBlurbPromise = import("$lib/components/TitleBlurb.svelte");
    const ThemeTotalsByDecadeChartPromise = import("$lib/components/ThemeTotalsByDecadeChart.svelte");
    const ThemeTypesByDecadeChartPromise = import("$lib/components/ThemeTypesByDecadeChart.svelte");
    const DataUsageTypePromise = import("$lib/components/DataUsageType.svelte");
    const DataViewChoiceWrapPromise = import("$lib/components/DataByPlanningDecadeAndTheme/DataViewChoiceWrap.svelte");
    const HeaderPromise = import("$lib/components/Header.svelte");

    import { QuerySettings } from "$lib/QuerySettings.js";
    import { load_indexeddb, onMountSync, getConstants } from "$lib/helper.js";
    import Statewide from "$lib/db/statewide.js";
    import { page } from '$app/stores';

    let constants = getConstants($page.url.host);
    let stateSettings = new QuerySettings();
    let db = load_indexeddb();

    let loadForState = async () => {
        console.log(`Start now ${Date.now() - starter}`);
        await onMountSync();
        let start = Date.now();
        db = await db;
        let sw = new Statewide(db);
        let dat = await sw.get(stateSettings);
        
        console.log(`loadForState() time in ms: ${Date.now() - start}`);
        return dat;
    };
</script>

{#await HeaderPromise}
<div class="loader"></div>
{:then {default: Component}}
<Component {db} {constants} />
{/await}
<div class="statewide-view">
    <section>
        {#await loadForState()}
        <div class="loader"></div>
        {:then out}
            {#await popChartPromise}
            <div class="loader"></div>
            {:then {default: Component}}
            <Component title={`TEXAS`} swdata={out} {constants} />
            {/await}

            {#await TitleBlurbPromise}
            <div class="loader"></div>
            {:then {default: Component}}
            <Component {constants} />
            {/await}

            {#await ThemeTotalsByDecadeChartPromise}
            <div class="loader"></div>
            {:then {default: Component}}
            <Component swdata={out} {constants} />
            {/await}

            {#await ThemeTypesByDecadeChartPromise}
            <div class="loader"></div>
            {:then {default: Component}}
            <Component
            chartTitle={"ct-usage-chart"}
            swdata={out}
            {constants}
            />  
            {/await}
 
            {#await DataUsageTypePromise}
            <div class="loader"></div>
            {:then {default: Component}}
            <Component swdata={out} {constants} />
            {/await}

            {#await DataViewChoiceWrapPromise}
            <div class="loader"></div>
            {:then {default: Component}}
            <Component {db} swdata={out} csvTitle= {"Statewide"} {constants} />
            {/await}
        {:catch error}
            <span>Error starting database {error.message}</span>
        {/await}
    </section>
</div>

<style type="text/scss">
    @import "$lib/sass/main.scss";
</style>
