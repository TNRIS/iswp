<script>
    //@ts-nocheck
    import PopulationChart from "../components/Charts/PopulationChart.svelte";
    import DataUsageType from "../components/DataUsageType.svelte";
    import TitleBlurb from "../components/TitleBlurb.svelte";
    import ThemeTypesByDecadeChart from "../components/ThemeTypesByDecadeChart.svelte";
    import ThemeTotalsByDecadeChart from "../components/ThemeTotalsByDecadeChart.svelte";
    import RegionalSummaryTable from "../components/RegionalSummaryTable.svelte";

    import { start_all_db } from "../lib/db/db.js";
    import { onMount } from "svelte";

    // Helper to make onmount awaitable.
    let async_onMount = async (callback) => {
        return new Promise((resolve, reject) => {
            onMount(async () => {
                callback(resolve, reject);
            });
        });
    };

    // Build the indexedDB
    let build_indexeddb = () => {
        return async_onMount(async (resolve, reject) => {
            try {
                let IS_2022_WEBSITE = window.location.href.indexOf("2022") > -1;
                let IS_2017_WEBSITE = window.location.href.indexOf("2017") > -1;

                // Start indexeddb, efficient if upgrade is not needed.
                let [db17, db22] = await start_all_db();

                // Choose database depending on url.
                if (!(db22 && db17)) throw "Databases are null.";

                if (IS_2022_WEBSITE) {
                    resolve(db22);
                } else if (IS_2017_WEBSITE) {
                    resolve(db17);
                } else {
                    resolve(db22);
                }
            } catch (err) {
                reject(err);
            }
        });
    };
</script>

<div class="statewide-view">
    <section>
        {#await build_indexeddb()}
            <span>Loading</span>
        {:then data}
            <PopulationChart chartTitle={"ct-pop-chart"} db={data} />
            <TitleBlurb />
            <ThemeTotalsByDecadeChart db={data} />
            <ThemeTypesByDecadeChart chartTitle={"ct-usage-chart"} db={data} />
            <DataUsageType db={data} />
            <RegionalSummaryTable db={data} />
        {:catch error}
            <span>Error starting database {error.message}</span>
        {/await}
    </section>
</div>
