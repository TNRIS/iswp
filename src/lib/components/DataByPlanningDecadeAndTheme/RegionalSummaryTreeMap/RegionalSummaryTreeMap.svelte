<script>
    //@ts-nocheck
    import { Constant2022 } from "$lib/Constant2022.js";
    import RegionalSummary from "$lib/db/regionalsummary.js";
    import Treemap from "$lib/components/DataByPlanningDecadeAndTheme/RegionalSummaryTreeMap/Treemap.svelte";
    export let { db } = $$props;
    import { getContext } from "svelte";

    const decadeStore = getContext("myContext").decadeStore;
    const themeStore = getContext("myContext").themeStore;
    const ruStore = getContext("myContext").ruStore;
    const dataviewContext = getContext("dataviewContext");
    let bindTreeMap = getContext("dataviewContext").bindTreeMap;

    export let selectedTreemap;
    const c22 = new Constant2022();
    const constants = c22;
    const themetitles = constants.getThemeTitles();

    let rs = new RegionalSummary(db);
    let data;

    // imported properties
    $: df = {};
    let datafix = async (data) => {
        let d = data[$themeStore][$decadeStore];

        let newobjz = {
            name: "statewide",
            children: [],
        };
        for (let item in d) {
            let array = [];

            for (const [name, value] of Object.entries(d[item])) {
                if (name !== "TOTAL") {
                    array.push({ name, value });
                }
            }
            newobjz.children.push({
                name: `Region ${d[item].REGION}`,
                children: array,
            });
        }

        let newobj = {
            name: "statewide",
            children: [],
        };
        let keyids = Object.keys(d[0]);
        for (let item in keyids) {
            let array = [];

            if(!(keyids[item] == 'id' || keyids[item] == 'TOTAL' || keyids[item] == 'REGION' || keyids[item] == 'DECADE')) {
                for(let i = 0; i < d.length; i++) {
                    array.push({
                        name: keyids[item],
                        value: d[i][keyids[item]]
                    })
                }
                newobj.children.push({name: keyids[item], children: array})
            }
        }

        if($ruStore == "region") {
            return newobjz;
        } else {
            return newobj;
        }
    };

    export const getData = async () => {
        if (!data) {
            data = await rs.get();
        }

        df = await datafix(data);
        return df;
    };
    dataviewContext.datafix.set(datafix);
    dataviewContext.getData.set(getData);

    let ru = async (classname) => {
        ruStore.set(classname);
        selectedTreemap = classname;
        let data = await getData();
        $bindTreeMap(data);
    }
</script>

<div class="row panel-row">
    <div class="twelve columns">
        <div>
            <h4>
                Regional Summary Treemap - {$decadeStore} - {themetitles[
                    $themeStore
                ]}
                <span class="units">(acre-feet/year)</span>
            </h4>
            <div class="selector treemap-selector">
                <button
                    class="button"
                    class:active={selectedTreemap === "region"}
                    on:click={() => ru("region")}
                >
                    By Region
                </button>
                <button
                    class="button"
                    class:active={selectedTreemap === "usagetype"}
                    on:click={() => ru("usagetype")}
                >
                    By Usage Type
                </button>
            </div>
            {#await getData()}
                <span>Loading</span>
            {:then}
                <Treemap treemapData={df} />
            {:catch err}
                <span>Error</span>
            {/await}
        </div>
    </div>
</div>
