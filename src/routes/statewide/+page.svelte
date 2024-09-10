<script>
    const popChartPromise = import('$lib/components/Charts/PopulationChart.svelte');
    const TitleBlurbPromise = import('$lib/components/TitleBlurb.svelte');
    const ThemeTotalsByDecadeChartPromise = import('$lib/components/ThemeTotalsByDecadeChart.svelte');
    const ThemeTypesByDecadeChartPromise = import('$lib/components/ThemeTypesByDecadeChart.svelte');
    const DataUsageTypePromise = import('$lib/components/DataUsageType.svelte');
    const DataViewChoiceWrapPromise = import('$lib/components/DataByPlanningDecadeAndTheme/DataViewChoiceWrap.svelte');
    const HeaderPromise = import('$lib/components/Header.svelte');

    import { QuerySettings } from '$lib/QuerySettings.js';
    import { load_indexeddb, onMountSync, getConstants, is_idb_loaded } from '$lib/helper.js';
    import Statewide from '$lib/db/statewide.js';
    import { page } from '$app/stores';
    import ComponentLoader from '$lib/components/ComponentLoader.svelte';

    let constants = getConstants($page.url.host);
    let stateSettings = new QuerySettings();
    let db = load_indexeddb();

    let loadForState = async () => {
        await onMountSync();
        await is_idb_loaded();
        let start = Date.now();
        db = await db;
        let sw = new Statewide(db);
        let dat = await sw.get(stateSettings);

        console.log(`loadForState() time in ms: ${Date.now() - start}`);
        return dat;
    };

    // Pass the promise to load for state in order to load each entity one at a time.
    const lrp = loadForState();
</script>

{#await HeaderPromise then { default: Component }}
    <Component {db} {constants} />
{/await}

<svelte:head>
    <title>Homepage of Interactive State Water Plan</title>
</svelte:head>
<div class="statewide-view">
    <section>
        {#await popChartPromise}
            <ComponentLoader />
        {:then { default: Component }}
            <Component tagline="" title={`TEXAS`} {lrp} {constants} />
        {/await}

        {#await TitleBlurbPromise}
            <ComponentLoader />
        {:then { default: Component }}
            <Component {constants} />
        {/await}

        {#await ThemeTotalsByDecadeChartPromise}
            <ComponentLoader />
        {:then { default: Component }}
            <Component {lrp} {constants} />
        {/await}

        {#await ThemeTypesByDecadeChartPromise}
            <ComponentLoader />
        {:then { default: Component }}
            <Component chartTitle={'ct-usage-chart'} {lrp} {constants} />
        {/await}

        {#await DataUsageTypePromise}
            <ComponentLoader />
        {:then { default: Component }}
            <Component {lrp} {constants} />
        {/await}

        {#await DataViewChoiceWrapPromise}
            <ComponentLoader />
        {:then { default: Component }}
            <Component {db} {lrp} csvTitle={'Statewide'} {constants} downloadPopulation={true} />
        {/await}
    </section>
</div>
