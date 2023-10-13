<script>
    //@ts-nocheck
    import PopulationChart from "$lib/components/Charts/PopulationChart.svelte";
    import DataUsageType from "$lib/components/DataUsageType.svelte";
    import TitleBlurb from "$lib/components/TitleBlurb.svelte";
    import ThemeTypesByDecadeChart from "$lib/components/ThemeTypesByDecadeChart.svelte";
    import ThemeTotalsByDecadeChart from "$lib/components/ThemeTotalsByDecadeChart.svelte";
    import DataViewChoiceWrap from "$lib/components/DataByPlanningDecadeAndTheme/DataViewChoiceWrap.svelte";
    import { start_all_db } from "$lib/db/db.js";
    import { load_indexeddb } from "$lib/helper.js";

</script>

<div class="statewide-view">
    <section>
        {#await load_indexeddb()}
            <span>Loading</span>
        {:then data}
            <PopulationChart chartTitle={"ct-pop-chart"} db={data} />
            <TitleBlurb />
            <ThemeTotalsByDecadeChart db={data} />
            <ThemeTypesByDecadeChart chartTitle={"ct-usage-chart"} db={data} />
            <DataUsageType db={data} />
            <DataViewChoiceWrap db={data} />
        {:catch error}
            <span>Error starting database {error.message}</span>
        {/await}
    </section>
</div>
