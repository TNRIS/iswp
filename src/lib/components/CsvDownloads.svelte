<script>
    const { swdata, fileName, constants, downloadPopulation } = $$props;
    let decades = constants.getDecades();
    export let csvTitle;
    if (!fileName) console.log('We need a filename');
    import { json2csv } from 'json-2-csv';

    let population = swdata?.population?.rows
        ? json2csv(swdata?.population?.rows, {
              keys: [
                  'EntityId',
                  'EntityName',
                  'WugType',
                  'WugRegion',
                  'WugCounty',
                  'EntityIsSplit',
                  `P${decades[0]}`,
                  `P${decades[1]}`,
                  `P${decades[2]}`,
                  `P${decades[3]}`,
                  `P${decades[4]}`,
                  ,
                  `P${decades[5]}`
              ],
              emptyFieldValue: ''
          })
        : [];

    let demands = swdata?.demands?.rows
        ? json2csv(swdata?.demands?.rows, {
              keys: [
                  'EntityId',
                  'EntityName',
                  'WugType',
                  'WugRegion',
                  'WugCounty',
                  'EntityIsSplit',
                  `D${decades[0]}`,
                  `D${decades[1]}`,
                  `D${decades[2]}`,
                  `D${decades[3]}`,
                  `D${decades[4]}`,
                  ,
                  `D${decades[5]}`
              ],
              emptyFieldValue: ''
          })
        : [];

    let existing = swdata?.supplies?.rows
        ? json2csv(swdata?.supplies?.rows, {
              keys: [
                  'EntityId',
                  'MapSourceId',
                  'EntityName',
                  'WugType',
                  'WugRegion',
                  'WugCounty',
                  'EntityIsSplit',
                  'SourceName',
                  `WS${decades[0]}`,
                  `WS${decades[1]}`,
                  `WS${decades[2]}`,
                  `WS${decades[3]}`,
                  `WS${decades[4]}`,
                  ,
                  `WS${decades[5]}`
              ],
              emptyFieldValue: ''
          })
        : [];

    let needs = swdata?.needs?.rows
        ? json2csv(swdata?.needs?.rows, {
              keys: [
                  'EntityId',
                  'EntityName',
                  'WugType',
                  'WugRegion',
                  'WugCounty',
                  'EntityIsSplit',
                  `N${decades[0]}`,
                  `N${decades[1]}`,
                  `N${decades[2]}`,
                  `N${decades[3]}`,
                  `N${decades[4]}`,
                  ,
                  `N${decades[5]}`
              ],
              emptyFieldValue: ''
          })
        : [];

    let strategy = swdata?.strategies?.rows
        ? json2csv(swdata?.strategies?.rows, {
              keys: [
                  'EntityId',
                  'MapSourceId',
                  'EntityName',
                  'WugType',
                  'WugRegion',
                  'WugCounty',
                  'EntityIsSplit',
                  'SourceName',
                  'SourceType',
                  'WmsId',
                  'WmsSponsorRegion',
                  'WmsName',
                  'WmsType',
                  `SS${decades[0]}`,
                  `SS${decades[1]}`,
                  `SS${decades[2]}`,
                  `SS${decades[3]}`,
                  `SS${decades[4]}`,
                  ,
                  `SS${decades[5]}`
              ],
              emptyFieldValue: ''
          })
        : [];

    let projects = swdata?.projects
        ? json2csv(swdata?.projects, {
              keys: [
                  'WmsProjectId',
                  'ProjectName',
                  'OnlineDecade',
                  'ProjectSponsors',
                  'CapitalCost',
                  'EntityLatCoord',
                  'EntityLongCoord',
                  'ProjectLatCoord',
                  'ProjectLongCoord',
                  'EntityId',
                  'EntityName',
                  'WugRegion',
                  'WugCounty',
                  'P2020',
                  'P2030',
                  'P2040',
                  'P2050',
                  'P2060',
                  'P2070'
              ],
              emptyFieldValue: ''
          })
        : [];

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
        {#if population.length && downloadPopulation}
            <li>
                <button class="a_button"
                    onclick={() => {
                        dlpop(population, 'population.csv');
                    }}
                    >Download {csvTitle} Population data (Comma-Separated Values)
                </button>
            </li>
        {/if}
        {#if demands.length}
            <li>
                <button class="a_button"
                    href="#"
                    onclick={() => {
                        dlpop(demands, 'demands.csv');
                    }}
                    >Download {csvTitle} Demands data (Comma-Separated Values)
                </button>
            </li>
        {/if}
        {#if existing.length}
            <li>
                <button class="a_button"
                    href="#"
                    onclick={() => {
                        dlpop(existing, 'existing.csv');
                    }}
                    >Download {csvTitle} Existing Supplies data (Comma-Separated Values)
                </button>
            </li>
        {/if}
        {#if needs.length}
            <li>
                <button class="a_button"
                    href="#"
                    onclick={() => {
                        dlpop(needs, 'needs.csv');
                    }}
                    >Download {csvTitle} Needs (Potential Shortages) data (Comma-Separated Values)
                </button>
            </li>
        {/if}
        {#if strategy.length}
            <li>
                <button class="a_button"
                    href="#"
                    onclick={() => {
                        dlpop(strategy, 'strategies.csv');
                    }}
                    >Download {csvTitle} Strategy Supplies data (Comma-Separated Values)
                </button>
            </li>
        {/if}

        {#if projects.length && window.location.pathname.includes('/project/')}
            <li>
                <button class="a_button"
                    href="#"
                    onclick={() => {
                        dlpop(projects, 'projects.csv');
                    }}
                    >Download {csvTitle} Project data (Comma-Separated Values)
                </button>
            </li>
        {/if}

        {#if !((population.length && downloadPopulation) || demands.length || existing.length || needs.length || strategy.length || (projects.length && window.location.pathname.includes('/project/')))}
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
