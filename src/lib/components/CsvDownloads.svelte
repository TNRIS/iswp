<script>
    const { swdata, csvTitle, fileName, constants } = $$props;

    if(!fileName)
        console.log("We need a filename");
    import { json2csv } from 'json-2-csv';
    let population = swdata?.population?.rows ?json2csv(swdata?.population?.rows) : [];
    let demands = swdata?.demands?.rows ? json2csv(swdata?.demands?.rows) : [];
    let existing = swdata?.supplies?.rows ? json2csv(swdata?.supplies?.rows) : [];
    let needs = swdata?.needs?.rows ? json2csv(swdata?.needs?.rows) : [];
    let strategy = swdata?.strategies?.rows ? json2csv(swdata?.strategies?.rows) : [];
    
    /**
     * @param {string} thing
     * @param {string} name
     */
    let dlpop = async (thing, name) => {
        // convert zip file to url object (for anchor tag download)
        let blob = new Blob([thing], {type: 'text/plain'});
        var url = window.URL || window.webkitURL;
        let link = url.createObjectURL(blob);

            // generate anchor tag, click it for download and then remove it again
        let a = document.createElement("a");
        a.setAttribute("download", `${fileName}_${name}`);
        a.setAttribute("href", link);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
</script>
{#if constants.allow_dl}
<h5>Download Data</h5>
<ul>
    {#if csvTitle !== "Agricultural Conservation WMS Type"}
    <li><a href="#" on:click={() => {dlpop(population, "population.csv")}}>Download {csvTitle} Population data (Comma-Separated Values)</a></li>
    <li><a href="#" on:click={() => {dlpop(demands, "demands.csv")}}>Download {csvTitle} Demands data (Comma-Separated Values)</a></li>
    <li><a href="#" on:click={() => {dlpop(existing, "existing.csv")}}>Download {csvTitle} Existing data (Comma-Separated Values)</a></li>
    <li><a href="#" on:click={() => {dlpop(needs, "needs.csv")}}>Download {csvTitle} Needs (Potential Shortages) data (Comma-Separated Values)</a></li>
    {/if}
    <li><a href="#" on:click={() => {dlpop(strategy, "strategies.csv")}}>Download {csvTitle} Strategy Supplies data (Comma-Separated Values)</a></li>
</ul>
{/if}