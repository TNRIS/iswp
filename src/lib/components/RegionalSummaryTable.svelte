<script>
    import RegionalSummary from "$lib/db/regionalsummary.js";
    import { getContext } from "svelte";
    import { onMountSync, commafy, sortNumeric, sortAlphabetic } from "$lib/helper.js"
    import CsvDownloads from "$lib/components/CsvDownloads.svelte";

    export let { db, swdata, csvTitle, constants } = $$props;

    const themetitles = constants.getThemeTitles();
    let decades = constants.getDecades();

    const decadeStore = getContext('myContext').decadeStore;
    const themeStore = getContext('myContext').themeStore;
    let dtstore = {};

    let rtable;
    let getData = async () => {
        await onMountSync();

        try {
            let rs = new RegionalSummary(db);
            let b = await rs.get();
            /**
             * Total by supply type for a particular year
             * @property {type} irrigation - irrigation is the total of irrigation for a particular year.
             * @property {type} livestock - livestock is the total of irrigation for a particular year.
             * @property {type} manufacturing - manufacturing is the total of irrigation for a particular year.
             * @property {type} mining - mining is the total of irrigation for a particular year.
             * @property {type} municipal - municipal is the total of irrigation for a particular year.
             * @property {type} region - region is the total of irrigation for a particular year.
             * @property {type} sep - sep is the total of irrigation for a particular year.
             */
            class Totals {
                constructor() {
                    this.irrigation = 0;
                    this.livestock = 0;
                    this.manufacturing = 0;
                    this.mining = 0;
                    this.municipal = 0;
                    this.region = 0;
                    this.sep = 0;
                    this.duoTotal = 0;
                }
            }
            ["population", "demands", "strategies", "needs", "supplies"].forEach((element) => {
                let totalStore = {};
                try{
                    for(let i = 0; i < decades.length; i++) {
                        let group = b[element][decades[i]];
                        let totals = new Totals();
                        for(let j = 0; j < group.length; j++) {
                            totals.irrigation += group[j].IRRIGATION;
                            totals.livestock += group[j].LIVESTOCK;
                            totals.manufacturing += group[j].MANUFACTURING;
                            totals.mining += group[j].MINING;
                            totals.municipal += group[j].MUNICIPAL;
                            totals.sep += group[j]["STEAM ELECTRIC POWER"];
                            totals.duoTotal += group[j].TOTAL;
                        }
                        
                        // @ts-ignore because I need to use dynamic properties.
                        totalStore[decades[i]] = totals;
                    }
                } catch(err) {
                    console.log(err);
                }
                // @ts-ignore because I need to use dynamic properties.
                dtstore[element] = totalStore;
            });
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
    <table class="table-condensed regional-summary-table {$themeStore == "population" ? 'skinny' : ''}" bind:this={rtable}>

    {#await getData()}
        <div class="loader"></div>
    {:then data}
            <tr>
                

                <th class="thead" on:click={() => {sortAlphabetic(rtable, 0)}}>Region</th>
                {#if $themeStore !== "population"}
                <th class="thead" on:click={() => {sortNumeric(rtable, 1)}}>Irrigation</th>
                <th class="thead" on:click={() => {sortNumeric(rtable, 2)}}>Municipal</th>
                <th class="thead" on:click={() => {sortNumeric(rtable, 3)}}>Manufacturing</th>
                <th class="thead" on:click={() => {sortNumeric(rtable, 4)}}>Steam Electric Power</th>
                <th class="thead" on:click={() => {sortNumeric(rtable, 5)}}>Livestock</th>
                <th class="thead" on:click={() => {sortNumeric(rtable, 6)}}>Mining</th>
                <th class="thead" on:click={() => {sortNumeric(rtable, 7)}}>Total</th>
                {:else}
                <th class="thead" on:click={() => {sortNumeric(rtable, 1)}}>Total</th>
                {/if}
            </tr>
            {#each data[$themeStore][$decadeStore] as d}
                <tr>
                    <td><a href="region/{d.REGION}">{d.REGION}</a></td>
                    {#if $themeStore !== "population"}
                    <td>{commafy(d.IRRIGATION + '')}</td>
                    <td>{commafy(d.MUNICIPAL + '')}</td>
                    <td>{commafy(d.MANUFACTURING + '')}</td>
                    <td>{commafy(d["STEAM ELECTRIC POWER"] + '')}</td>
                    <td>{commafy(d.LIVESTOCK + '')}</td>
                    <td>{commafy(d.MINING + '')}</td>
                    {/if}

                    <td class="total_column">{commafy(d.TOTAL + '')}</td>
                </tr>
            {/each}
            <tr>
                <td class="total_second_column bold">Total</td>
                {#if $themeStore !== "population"}
                <td class="total_second_column">{commafy(dtstore[$themeStore][$decadeStore].irrigation + '')}</td>
                <td class="total_second_column">{commafy(dtstore[$themeStore][$decadeStore].municipal + '')}</td>
                <td class="total_second_column">{commafy(dtstore[$themeStore][$decadeStore].manufacturing + '')}</td>
                <td class="total_second_column">{commafy(dtstore[$themeStore][$decadeStore].sep + '')}</td>
                <td class="total_second_column">{commafy(dtstore[$themeStore][$decadeStore].livestock + '')}</td>
                <td class="total_second_column">{commafy(dtstore[$themeStore][$decadeStore].mining + '')}</td>
                {/if}

                <td class="total_column total_second_column bold">{commafy(dtstore[$themeStore][$decadeStore].duoTotal + '')}</td>
            </tr>
    {:catch error}
        <span>Error in regionalsummarytable error: {error}</span>
    {/await}
    </table>
    <CsvDownloads {swdata} {csvTitle} fileName={"statewide"} {constants} />

</div>

<style>
    .total_column {
        border-left: 2px solid;
        padding-left: 1em;
    }
    .total_second_column {
        border-top: 2px solid;
        font-style: italic;
    }
    .bold {
        font-weight: bold;
    }
    .skinny {
        width: auto;
    }
    .thead { 
        cursor: pointer;
    }
</style>