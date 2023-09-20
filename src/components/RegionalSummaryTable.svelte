<script>
    // @ts-nocheck
    const { db } = $$props;
    import RegionalSummary from "../lib/db/regionalsummary.js";

    let getData = () => {
        return new Promise(async (resolve, reject) => {
            try {
                let rs = new RegionalSummary(db);
                let b = await rs.get();
                resolve(b.strategies["2020"]);
            } catch (err) {
                console.log(err);
                reject(err);
            }
        });
    };
</script>

<div class="summary-wrapper container">
    <div style="pointer-events:auto;" class="row panel-row">
        <div class="chart-header">
            <h4>
                Regional Summary Data - 2020 - Strategy Supplies <span
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
                {#each data as d}
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
        {:catch}
            <span>Error in regionalsummarytable</span>
        {/await}
    </div>
</div>
