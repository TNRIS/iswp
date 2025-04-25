<script>
    const popChartPromise = import('$lib/components/Charts/PopulationChart.svelte');
    const TitleBlurbPromise = import('$lib/components/TitleBlurb.svelte');
    const ThemeTotalsByDecadeChartPromise = import('$lib/components/ThemeTotalsByDecadeChart.svelte');
    const ThemeTypesByDecadeChartPromise = import('$lib/components/ThemeTypesByDecadeChart.svelte');
    const DataUsageTypePromise = import('$lib/components/DataUsageType.svelte');
    const DataViewChoiceWrapPromise = import('$lib/components/DataByPlanningDecadeAndTheme/DataViewChoiceWrap.svelte');

    import { QuerySettings } from '$lib/QuerySettings.js';
    import { getConstants, wrapupCommonIdbTasks } from '$lib/helper.js';
    import { page } from '$app/stores';
    import ComponentLoader from '$lib/components/ComponentLoader.svelte';

    let constants = getConstants($page.url.host);
    let stateSettings = new QuerySettings();
    let db, sw;
    let loadForState = async () => {
        [db, sw] = await wrapupCommonIdbTasks();
        return await sw.get(stateSettings);
    };

    // Pass the promise to load for state in order to load each entity one at a time.
    const lrp = loadForState();
</script>

<svelte:head>
    <title>Homepage of Interactive State Water Plan</title>
</svelte:head>
<div class="statewide-view" id="main-content" role="main">
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
