<script>
    // @ts-nocheck
    import RegionalSummary from "../lib/db/regionalsummary.js";
    import { onMount, getContext } from "svelte";
    import { Constant2022 } from "../lib/Constant2022.js";
    export let { db } = $$props;

    const c22 = new Constant2022();
    const constants = c22;
    const themetitles = constants.getThemeTitles();

    const decadeStore = getContext('myContext').decadeStore;
    const themeStore = getContext('myContext').themeStore;

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

    let getData = async () => {
        await onMountSync();
        try {
            let rs = new RegionalSummary(db);
            let b = await rs.get();
            return b
        } catch (err) {
            console.log(err);
            return err;
        }
    };

</script>

<div style="pointer-events:auto;" class="row panel-row">
    <div class="chart-header">
        <h4>
            Regional Summary Data - {$decadeStore} - {themetitles[$themeStore]} <span
                class="units">(acre-feet/year)</span
            >
        </h4>
    </div>
    {#await getData()}
        <span>Loading</span>
    {:then data}
        <table class="table-condensed regional-summary-table">
            <tr>
                <th>Region</th>
                <th>Irrigation</th>
                <th>Municipal</th>
                <th>Manufacturing</th>
                <th>Steam Electric Power</th>
                <th>Livestock</th>
                <th>Mining</th>
                <th>Total</th>
            </tr>
            {#each data[$themeStore][$decadeStore] as d}
                <tr>
                    <td>{d.REGION}</td>
                    <td>{d.IRRIGATION}</td>
                    <td>{d.MUNICIPAL}</td>
                    <td>{d.MANUFACTURING}</td>
                    <td>{d["STEAM ELECTRIC POWER"]}</td>
                    <td>{d.LIVESTOCK}</td>
                    <td>{d.MINING}</td>
                    <td>{d.TOTAL}</td>
                </tr>
            {/each}
        </table>
    {:catch error}
        <span>Error in regionalsummarytable error: {error}</span>
    {/await}
</div>
