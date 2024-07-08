<script>
    //@ts-nocheck
    import { Constant2022 } from '$lib/Constant2022.js';
    import RegionalSummary from '$lib/db/regionalsummary.js';
    import Treemap from '$lib/components/DataByPlanningDecadeAndTheme/RegionalSummaryTreeMap/Treemap.svelte';
    export let { db } = $$props;
    import { getContext } from 'svelte';
    import { cap } from '$lib/helper.js';

    const decadeStore = getContext('myContext').decadeStore;
    const themeStore = getContext('myContext').themeStore;
    const ruStore = getContext('myContext').ruStore;
    const dataviewContext = getContext('dataviewContext');
    let bindTreeMap = getContext('dataviewContext').bindTreeMap;

    export let selectedTreemap;
    const c22 = new Constant2022();
    const constants = c22;
    const themetitles = constants.getThemeTitles();

    let rs = new RegionalSummary(db);
    let data;
    let total = 0;

    // imported properties
    $: df = {};
    let datafix = async (data) => {
        let d = data[$themeStore][$decadeStore];
        for (let i = 0; i < d.length; i++) {
            total += d[i].TOTAL;
        }

        let newobjz = {
            name: 'statewide',
            children: []
        };
        for (let item in d) {
            let array = [];

            for (let [name, value] of Object.entries(d[item])) {
                if (name !== 'TOTAL') {
                    name = cap(name);
                    array.push({ name, value });
                }
            }

            newobjz.children.push({
                name: `Region ${d[item].REGION}`,
                children: array
            });
        }

        let newobj = {
            name: 'statewide',
            children: []
        };
        let keyids = Object.keys(d[0]);
        for (let item in keyids) {
            let array = [];

            if (!(keyids[item] == 'id' || keyids[item] == 'TOTAL' || keyids[item] == 'REGION' || keyids[item] == 'DECADE')) {
                for (let i = 0; i < d.length; i++) {
                    array.push({
                        name: `Region ${d[i]['REGION']}`,
                        value: d[i][keyids[item]]
                    });
                }
                newobj.children.push({
                    name: cap(keyids[item]),
                    children: array
                });
            }
        }

        if ($ruStore == 'region') {
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
        $bindTreeMap(data, selectedTreemap);
    };
</script>

<div class="row panel-row">
    <div class="twelve columns">
        <div>
            <h4>
                Regional Summary Treemap - {$decadeStore} - {themetitles[$themeStore]}
                {#if $themeStore === 'population'}
                    <span class="units">(people)</span>
                {:else}
                    <span class="units">(acre-feet/year)</span>
                {/if}
            </h4>
            <div
                class="selector treemap-selector"
                role="menubar"
                aria-label="Choose from the following to change what the treemap displays."
                title="Choose from the following to change what the treemap displays."
                aria-controls="treemap-chart">
                <button class="button" class:active={selectedTreemap === 'region'} on:click={() => ru('region')}> By Region </button>
                <button class="button" class:active={selectedTreemap === 'usagetype'} on:click={() => ru('usagetype')}>
                    By Usage Type
                </button>
            </div>
            {#await getData() then}
                <Treemap treemapData={df} {total} themeStore={$themeStore} />
            {:catch err}
                <span>Error</span>
            {/await}
        </div>
    </div>
</div>
