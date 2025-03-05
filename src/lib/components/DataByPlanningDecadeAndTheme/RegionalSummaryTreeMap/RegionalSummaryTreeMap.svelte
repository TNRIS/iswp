<script>
    import { Constant2022 } from '$lib/Constant2022.js';
    import RegionalSummary from '$lib/db/regionalsummary.js';
    import Treemap from '$lib/components/DataByPlanningDecadeAndTheme/RegionalSummaryTreeMap/Treemap.svelte';
    import { getContext } from 'svelte';
    import { cap } from '$lib/helper.js?v1';
    import { TreeDataStruct, TreeDataOuterStruct, TreeDataNode } from '$lib/zoomBarChart';

    export let /** @type {string} */ selectedTreemap;
    export let { db } = $$props;

    const decadeStore = getContext('myContext').decadeStore;
    const themeStore = getContext('myContext').themeStore;
    const ruStore = getContext('myContext').ruStore;
    const dataviewContext = getContext('dataviewContext');
    let bindTreeMap = getContext('dataviewContext').bindTreeMap;

    const c22 = new Constant2022();
    const constants = c22;
    const themetitles = constants.getThemeTitles();

    let rs = new RegionalSummary(db);
    let /** @type {any} */ data; //Todo make this a class
    let total = 0;

    // imported properties
    $: df /** @type {TreeDataOuterStruct | TreeDataStruct | undefined} */ = {};

    /**
     * Fix the data into a TreeData for the Treemap.
     *
     * @param {any} data
     * @returns { Promise<TreeDataStruct | TreeDataOuterStruct | undefined>}
     */
    let datafix = async (data) => {
        // The data selected by theme and decade.
        let selected_data = data[$themeStore][$decadeStore];

        // Calculate the total value of the selected data.
        for (let i = 0; i < selected_data.length; i++) {
            total += selected_data[i].TOTAL;
        }

        if ($ruStore == 'region') {
            /**
             * Build up the regionStructure for use on the region area.
             */
            let regionStructure = new TreeDataOuterStruct('statewide');
            for (let item in selected_data) {
                let /** @type {TreeDataNode[]} */ array = [];

                for (let [name, value] of Object.entries(selected_data[item])) {
                    if (name !== 'TOTAL' && name.trim().toLowerCase() !== 'id') {
                        name = cap(name);
                        array.push(new TreeDataNode(name, value));
                    }
                }
                regionStructure.children.push(new TreeDataStruct(`Region ${selected_data[item].REGION}`, array));
            }
            return regionStructure;
        } else {
            /**
             * Build up the defaultStructure.
             */
            let defaultStructure = new TreeDataOuterStruct('statewide');
            let keyids = Object.keys(selected_data[0]);

            for (let item in keyids) {
                let array = /** @type {TreeDataNode[]} */ [];

                if (
                    !(
                        keyids[item].trim().toLowerCase() == 'id' ||
                        keyids[item] == 'TOTAL' ||
                        keyids[item] == 'REGION' ||
                        keyids[item] == 'DECADE'
                    )
                ) {
                    for (let i = 0; i < selected_data.length; i++) {
                        array.push(new TreeDataNode(`Region ${selected_data[i]['REGION']}`, selected_data[i][keyids[item]]));
                    }
                    defaultStructure.children.push(new TreeDataStruct(cap(keyids[item]), array));
                }
            }

            return defaultStructure;
        }
    };

    export const getData = async () => {
        if (!data) data = await rs.get();
        // @ts-ignore
        df = await datafix(data);
        return df;
    };
    dataviewContext.datafix.set(datafix);
    dataviewContext.getData.set(getData);

    /**
     *
     * @param classname {string}
     */
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
            <h4 aria-level="3">
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
                aria-label="Choose from the following to choose a subdimension to display."
                title="Choose from the following to choose a subdimension to display.">
                <button class="button" class:active={selectedTreemap === 'region'} on:click={() => ru('region')} role="menuitem">
                    By Region
                </button>
                <button class="button" class:active={selectedTreemap === 'usagetype'} on:click={() => ru('usagetype')} role="menuitem">
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
