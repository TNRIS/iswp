<script>
    //@ts-nocheck
    const { swdata } = $$props;
    import { calcPercentage } from "$lib/helper.js";
    import { getContext } from "svelte";
    const decadeStore = getContext("myContext").decadeStore;
</script>

<table class="table-condensed u-full-width strategies-by-type-table">
    {#if swdata?.strategies?.strategyTypeTotals}
        <tr>
            <th>Strategy Type</th>
            <th>Amount</th>
        </tr>
        {#each Object.keys(swdata.strategies.strategyTypeTotals) as t}
            <tr>
                <td>{t}</td>
                <td>
                    {calcPercentage(
                        Object.values(swdata.strategies.strategyTypeTotals),
                        swdata.strategies.strategyTypeTotals[t][$decadeStore]
                    )}
                </td>
            </tr>
        {/each}
    {:else}
        <span>No Strategy types found</span>
    {/if}
</table>
