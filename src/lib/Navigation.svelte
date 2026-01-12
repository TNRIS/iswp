<!-- This file handles the top navigation. -->

<script>
    import Statewide from '$lib/db/statewide.js';
    import Select from 'svelte-select';
    import { objectExistsInArray, labelReducer, objectExistsInArrayPresorted } from '$lib/helper';
    import Fuse from 'fuse.js';

    /**
     * @typedef EntityLabel
     * @type {object}
     * @property {string} EntityName,
     * @property {string} EntityId
     */

    /**
     * @typedef ProjectLabel
     * @type {object}
     * @property {string} ProjectName,
     * @property {string} WmsProjectId
     */

    /**
     * @typedef WmsLabel
     * @type {object}
     * @property {string} WmsName,
     * @property {string} WmsId
     */

    /**
     * @typedef NavLabel
     * @type {object}
     * @property {string} value
     * @property {string} label
     */

    let { selected, db, constants } = $props();
    let /** @type {string} */ chosen = $state(selected.id);
    let label = '';

    (() => {
        if (chosen == 'statewide') {
            chosen = '';
        }
    })();

    let chosen2 = /** @type {string}*/ $state("");
    let regions = /** @type {NavLabel[]} */ labelReducer(constants.getRegions(), 'Region ');
    let counties = /** @type {NavLabel[]} */ labelReducer(constants.getCountyNames());
    let usageTypes = /** @type {NavLabel[]} */ labelReducer(constants.getUsageTypes());
    let wmstype = /** @type {NavLabel[]} */ labelReducer(constants.wms_info.WMS_TYPES, constants.WMS_TYPES);
    let region = $derived(chosen && chosen2 ? `/${chosen}/${chosen2}/` : !(chosen && chosen2) ? '/' : `/${chosen}/`);
    let secondary_input_enabled = $derived(chosen && chosen.length && chosen2 && chosen2 !== undefined);
    let is_home_selected = $derived(!chosen || chosen == '' || chosen == 'statewide');
    let filter_search_selector = $state();
    const titles = constants.chosenTitles;
    const CategoryClass = class {
        /**
         *  @param {any} sw
         * */
        constructor(sw=false) {
            let /** @type {NavLabel[]} */ sourceName;
            sourceName = constants.sourceNames;

            this[''] = [];

            /**
             * Region object
             * @type {NavLabel[]}
             * @public
             */
            this.region = regions;

            /**
             * County object
             * @type {NavLabel[]}
             * @public
             */
            this.county = counties;

            /**
             * Source object
             * @type {NavLabel[]}
             * @public
             */
            this.source = sourceName;

            /**
             * Usage type object
             * @type {NavLabel[]}
             * @public
             */
            this.usagetype = usageTypes;

            /**
             * WMS type object
             * @type {NavLabel[]}
             * @public
             */
            this.wmstype = wmstype;

            if(sw) {
                sw.getEntities().then((/** @type {EntityLabel[]}*/ x) => {
                    this.entity = x.reduce((/** @type {object[]} */ accumulator, /** @type {any} */ currentValue) => {
                        let exists /** @type {boolean} */ = objectExistsInArray(
                            accumulator,
                            currentValue,
                            ['EntityName', 'EntityId'],
                            ['label', 'value']
                        );

                        if (!exists) {
                            accumulator.push({
                                value: `${currentValue.EntityId}`,
                                label: `${currentValue.EntityName}`
                            });
                        }

                        return accumulator;
                    }, []);
                });

                sw.getProjects().then((/** @type {ProjectLabel[]}*/ x) => {
                    this.project = x.reduce((/** @type {NavLabel[]} */ accumulator, /** @type {any} */ currentValue) => {
                        let exists /** @type {boolean} */ = objectExistsInArray(
                            accumulator,
                            currentValue,
                            ['ProjectName', 'WmsProjectId'],
                            ['label', 'value']
                        );

                        if (!exists) {
                            accumulator.push({
                                value: `${currentValue.WmsProjectId}`,
                                label: `${currentValue.ProjectName}`
                            });
                        }

                        return accumulator;
                    }, []);
                });

                sw.getWms().then((/** @type {WmsLabel[]}*/ x) => {
                    x = x.sort((a, b) => {
                        if (a.WmsName < b.WmsName) {
                            return -1;
                        }
                        if (a.WmsName > b.WmsName) {
                            return 1;
                        }
                        return 0;
                    });

                    this.wms = x.reduce((/** @type {object[]} */ accumulator, /** @type {any} */ currentValue) => {
                        let exists /** @type {boolean} */ = objectExistsInArrayPresorted(
                            accumulator,
                            currentValue,
                            ['WmsName', 'WmsId'],
                            ['label', 'value']
                        );

                        if (!exists) {
                            accumulator.push({
                                value: `${currentValue.WmsId}`,
                                label: `${currentValue.WmsName}`
                            });
                        }

                        return accumulator;
                    }, []);
                });
            }
        }
    };

    /** @type {CategoryClass} */
    let categories = $state(new CategoryClass());
    let setupChoices = (async () => {
        db = await db;
        categories = new CategoryClass(new Statewide(db));
    })();

    /**
     * Reset the second select box.
     * @param {CustomEvent | KeyboardEvent} value
     */
    let reset = (event) => {
        chosen = event.detail.value;
        label = event.detail.placeholder_override ? event.detail.placeholder_override : event.detail.label;
        chosen2 = '';
    };

    let IS_FILTER_BOX /** @type {boolean}*/ = $derived(chosen == "wms" || chosen == "project" || chosen == "entity");

    /**
     * When box 2 is changed call this. And change the chosen value;
     * @param {CustomEvent | KeyboardEvent} event
     */
    let box2Change = (event) => {
        chosen2 = event.detail.value;
    };

    let processValue = () => {
        let pv = categories[chosen];

        pv = pv?.find(o => {
            return o.value === chosen2;
        });

        pv = pv?.label;
        if (pv) {
            return pv;
        } else {
            return '';
        }
    };

    /**
     * Use to filter the navigation box
     * @param {string} filter
     */
    let filterBoxSearch = async(filter) => {
        const options = {
            includeScore: true,
            keys: ['label'],
            shouldSort: true,
            ignoreFieldNorm: true
        }

        const fuse = new Fuse(categories[chosen], options);

        const result = fuse.search(filter);
        
        let top_matches = result.slice(0, 50).map((unit) => {
            return {
                value: unit.item.value,
                label: unit.item.label
            }
        });
        return top_matches;
    }
</script>

<div class="header-nav sticky-div">
    <div class="wrapper" id="wrapper">
        <div id="top_nav_flex" class="submit-button"> <!-- todo change this to not use a form.-->
            {#await setupChoices then}
                <label for="navcat" id="navlabel">View data for</label>
                <div class="select-container" id="navcat_container">
                    <Select
                        clearable={false}
                        containerStyles="width: revert-layer;"
                        id="navcat"
                        inputAttributes={{
                            title: 'Category',
                            'aria-label': 'Choose a page to navigate to related to the category then hit the go button.',
                            'aria-owns': 'nav_submit'
                        }}
                        inputStyles="width: revert-layer; border-width: 0;"
                        items={constants.nav_categories}
                        on:change={reset}
                        searchable={false}
                        showChevron={true}
                        value={chosen ? chosen : 'All of Texas'}
                    />
                </div>
                {#key chosen}
                {#if !is_home_selected && !IS_FILTER_BOX}
                    <div class="select-container main_select">
                        <Select
                            clearable={false}
                            id="select_two"
                            inputAttributes={{
                                title: 'Sub Category',
                                'aria-label':
                                    'Choose a page to navigate to related to the sub category to navigate to then hit the go button.',
                                'aria-owns': 'nav_submit'
                            }}
                            inputStyles="border-width: 0;"
                            items={categories[chosen]}
                            on:change={box2Change}
                            placeholder="Select {titles[chosen]}"
                            showChevron={true}
                            value={`${processValue()}`}
                        />
                    </div>
                {:else if !is_home_selected && IS_FILTER_BOX}
                    <div class="select-container main_select">
                        <Select
                            inputAttributes={{
                                title: 'Sub Category',
                                'aria-label':
                                    'Start typing to find a page to navigate to related to the sub category to navigate to then hit the go button.',
                                'aria-owns': 'nav_submit'
                            }}
                            inputStyles="border-width: 0;"
                            loadOptions={filterBoxSearch}
                            on:change={box2Change}
                            placeholder="Start typing to find {titles[chosen]}"
                            showChevron={false}
                            value={`${processValue()}`}
                            bind:this={filter_search_selector}
                            >
                        </Select>
                    </div>
                {/if}
                {/key}
                <a
                    aria-label="Submit navigation selections."
                    class="button button-nav-submit"
                    href={region}
                    id="nav_submit"
                    target={undefined}
                    title="Continue here after you’ve filled out all form elements to navigate to selected page."
                    type="submit"
                    >Go
                </a>
            {:catch error}
                <span>Error loading nav {error}</span>
            {/await}
        </div>
    </div>
</div>

<style>
    :global(input[type=text]:hover) {
        border:0px solid;
    }

    .button-nav-submit:disabled {
        color: gray;
    }

    :global(#navcat) {
        height: default !important;
    }

    .button-nav-submit {
        height: 42px;
        background-color: white;
        font-size: revert;
    }

    .header-nav {
        z-index: 7000;
    }

    :global(.mdc-select__anchor) {
        color: green !important;
    }

    :global(.nav-option) {
        color: green !important;
    }

    #wrapper {
        padding-top: 5px;
    }

    :global(.selected-item) {
        z-index: 2;
    }
    
    #nav_submit {
        font-weight: bold;
        font-size: 12px;
    }

    #nav_submit:hover {
        text-decoration: none;
        color: #333;
        border-color: #888;

    }
</style>
