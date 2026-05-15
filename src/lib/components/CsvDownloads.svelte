<script>
    import { csv } from "d3";
    const { swdata, fileName, constants, downloadPopulation } = $$props;
    let decades = constants.getDecades();
    export let csvTitle;
    if (!fileName) console.log('We need a filename');
    import { gen_csv_json } from "$lib/csv.js"

    let csv_json = gen_csv_json(swdata, constants)

    /**
     * @param {string} thing
     * @param {string} name
     */
    let dlpop = async (thing, name) => {
        // convert zip file to url object (for anchor tag download)
        let blob = new Blob([thing], { type: 'text/plain' });
        var url = window.URL || window.webkitURL;
        let link = url.createObjectURL(blob);

        // generate anchor tag, click it for download and then remove it again
        let a = document.createElement('a');
        a.setAttribute('download', `${fileName}_${name}`);
        a.setAttribute('href', link);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

</script>

{#if constants.allow_dl}
    <h5 id="dl_header" aria-level="4">Download Data</h5>
    <ul>
        {#if csv_json.population.length && downloadPopulation}
            <li>
                <button class="a_button"
                    onclick={() => {
                        dlpop(csv_json.population, 'population.csv');
                    }}
                    >Download {csvTitle} Population data (Comma-Separated Values)
                </button>
            </li>
        {/if}
        {#if csv_json.demands.length}
            <li>
                <button class="a_button"
                    href="#"
                    onclick={() => {
                        dlpop(csv_json.demands, 'demands.csv');
                    }}
                    >Download {csvTitle} Demands data (Comma-Separated Values)
                </button>
            </li>
        {/if}
        {#if csv_json.existing.length}
            <li>
                <button class="a_button"
                    href="#"
                    onclick={() => {
                        dlpop(csv_json.existing, 'existing.csv');
                    }}
                    >Download {csvTitle} Existing Supplies data (Comma-Separated Values)
                </button>
            </li>
        {/if}
        {#if csv_json.needs.length}
            <li>
                <button class="a_button"
                    href="#"
                    onclick={() => {
                        dlpop(csv_json.needs, 'needs.csv');
                    }}
                    >Download {csvTitle} Needs (Potential Shortages) data (Comma-Separated Values)
                </button>
            </li>
        {/if}
        {#if csv_json.strategy.length}
            <li>
                <button class="a_button"
                    href="#"
                    onclick={() => {
                        dlpop(csv_json.strategy, 'strategies.csv');
                    }}
                    >Download {csvTitle} Strategy Supplies data (Comma-Separated Values)
                </button>
            </li>
        {/if}

        {#if csv_json.projects.length && window.location.pathname.includes('/project/')}
            <li>
                <button class="a_button"
                    href="#"
                    onclick={() => {
                        dlpop(csv_json.projects, 'projects.csv');
                    }}
                    >Download {csvTitle} Project data (Comma-Separated Values)
                </button>
            </li>
        {/if}

        {#if !((csv_json.population.length && downloadPopulation) || csv_json.demands.length || csv_json.existing.length || csv_json.needs.length || csv_json.strategy.length || (csv_json.projects.length && window.location.pathname.includes('/project/')))}
            <li>No csv available for download.</li>
        {/if}
    </ul>
{/if}

<style>
    #dl_header {
        font-weight: bold;
    }
    .a_button {
        all: unset;
        cursor:pointer;
        color: #3f556d;
        text-decoration:underline;
    }
    .a_button:hover {
        color: #0fa0ce;
        text-decoration: underline;
    }
    
</style>
