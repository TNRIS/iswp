<script>
    //@ts-nocheck
    import PopulationChart from "/src/components/Charts/PopulationChart.svelte";
    import DataUsageType from "/src/components/DataUsageType.svelte";
    import TitleBlurb from "/src/components/TitleBlurb.svelte";
    import ProjectTable from "/src/components/ProjectTable/ProjectTable.svelte";
    import ThemeTypesByDecadeChart from "/src/components/ThemeTypesByDecadeChart.svelte";
    import ThemeTotalsByDecadeChart from "/src/components/ThemeTotalsByDecadeChart.svelte";
    import DataViewChoiceWrap from "/src/components/DataByPlanningDecadeAndTheme/DataViewChoiceWrap.svelte";
    import { Constant2022 } from "/src/lib/Constant2022.js";
    const c22 = new Constant2022();
    let constants = c22;
    export let data;

    import { start_all_db } from "/src/lib/db/db.js";
    import { onMount } from "svelte";

    // Helper to make onmount awaitable.
    let onMountSync = () => {
        return new Promise((resolve, reject) => {
            try {
                onMount(async () => {
                    resolve("mounted");
                });
            } catch(err) {
                reject(err);
            }
        });
    };

    // Build the indexedDB
    let build_indexeddb = async () => {
        await onMountSync();

        let IS_2022_WEBSITE = window.location.href.indexOf("2022") > -1;
        let IS_2017_WEBSITE = window.location.href.indexOf("2017") > -1;

        // Start indexeddb, efficient if upgrade is not needed.
        let [db17, db22] = await start_all_db();

        // Choose database depending on url.
        if (!(db22 && db17)) throw "Databases are null.";

        if (IS_2022_WEBSITE) {
            return db22;
        } else if (IS_2017_WEBSITE) {
            return db17;
        } else {
            return db22;
        }
    };
</script>

<div class="statewide-view">
    <section>
        {#await build_indexeddb()}
            <span>Loading</span>
        {:then out}
            <PopulationChart chartTitle={"ct-pop-chart"} db={out} type={constants.page_types.region} wugRegionFilter={data.slug}/>
            <ThemeTotalsByDecadeChart db={out} wugRegionFilter={data.slug} />
            <ThemeTypesByDecadeChart chartTitle={"ct-usage-chart"} db={out} wugRegionFilter={data.slug} />
            <DataUsageType db={out} wugRegionFilter={data.slug} />
            <ProjectTable db={out} wugRegionFilter={data.slug} />
        {:catch error}
            <span>Error starting database {error.message}</span>
        {/await}
    </section>
</div>
