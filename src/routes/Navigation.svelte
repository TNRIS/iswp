<!-- This file handles the top navigation. -->

<script>
    import Statewide from '$lib/db/statewide.js';
    import Select from 'svelte-select';
    import { objectExistsInArray, labelReducer } from '$lib/helper';
    import { page } from '$app/stores';
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

    // Set to true to log some timings.
    const DEBUG_LOADING = false;

    let { selected, db, constants } = $props();
    /** @type {Statewide} */
    let sw;

    let chosen = $state(selected.id);
    let label = '';

    (() => {
        if (chosen == 'statewide') {
            chosen = '';
        }
    })();
    let chosen2 = /** @type {string}*/ $state();
    let regions = /** @type NavLabel[] */ labelReducer(constants.getRegions(), 'Region ');
    let counties = /** @type NavLabel[] */ labelReducer(constants.getCountyNames());
    let usageTypes = /** @type NavLabel[] */ labelReducer(constants.getUsageTypes());
    let wmstype = /** @type NavLabel[] */ labelReducer(constants.WMS_TYPES);

    let region = $derived(chosen && chosen2 ? `/${chosen}/${chosen2}/` : !(chosen && chosen2) ? '/' : `/${chosen}/`);

    let secondary_input_enabled = $derived(chosen && chosen.length && chosen2 && chosen2 !== undefined);
    let is_home_selected = $derived(!chosen || chosen == '' || chosen == 'statewide');

    const titles = constants.chosenTitles;

    /** @type {CategoryClass | undefined} */
    let categories = $state();

    const CategoryClass = class {
        /**
         *  @param {any} sw
         * */
        constructor(sw) {
            let start = 0;
            let /** @type {object} */ sourceName;

            if (DEBUG_LOADING) start = Date.now();
            sourceName = constants.sourceNames;

            this[''] = [];
            this.region = regions;
            this.county = counties;
            this.source = sourceName;
            this.usagetype = usageTypes;
            this.wmstype = wmstype;

            sw.getEntities().then((/** @type {EntityLabel[]}*/ x) => {
                this.entity = x.reduce((/** @type {object[]} */ accumulator, /** @type {any} */ currentValue) => {
                    let exists /** @type {boolean} */ = objectExistsInArray(
                        accumulator,
                        currentValue,
                        ['EntityName', 'EntityId'],
                        ['value', 'label']
                    );

                    if (!exists) {
                        accumulator.push({
                            label: currentValue.EntityName,
                            value: currentValue.EntityId
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
                        ['value', 'label']
                    );

                    if (!exists) {
                        accumulator.push({
                            label: currentValue.ProjectName,
                            value: currentValue.WmsProjectId
                        });
                    }

                    return accumulator;
                }, []);
            });

            sw.getWms().then((/** @type {WmsLabel[]}*/ x) => {
                this.wms = x.reduce((/** @type {object[]} */ accumulator, /** @type {any} */ currentValue) => {
                    let exists /** @type {boolean} */ = objectExistsInArray(
                        accumulator,
                        currentValue,
                        ['WmsName', 'WmsId'],
                        ['value', 'label']
                    );

                    if (!exists) {
                        accumulator.push({
                            label: currentValue.WmsName,
                            value: currentValue.WmsId
                        });
                    }

                    return accumulator;
                }, []);
            });

            if (DEBUG_LOADING) console.log(`Time to run navigation constructor ${Date.now() - start}`);
        }
    };

    let setupChoices = (async () => {
        db = await db;
        categories = new CategoryClass(new Statewide(db));
    })();

    /**
     * Reset the second select box.
     * @param {CustomEvent | KeyboardEvent} value
     */
    let reset = (value) => {
        chosen = value.detail.value;
        label = value.detail.placeholder_override ? value.detail.placeholder_override : value.detail.label;
        chosen2 = '';
    };

    /**
     * When box 2 is changed call this. And change the chosen value;
     * @param {CustomEvent | KeyboardEvent} event
     */
    let box2Change = (event) => {
        chosen2 = event.detail.value;
    };
</script>

<div class="header-nav sticky-div">
    <div class="wrapper" id="wrapper">
        <div id="top_nav_flex" class="submit-button"> <!-- todo change this to not use a form.-->
            {#await setupChoices then}
                <label for="navcat" id="navlabel">View data for</label>
                <div class="select-container" id="navcat_container">
                    <Select
                        items={constants.nav_categories}
                        id="navcat"
                        containerStyles="width: revert-layer;"
                        inputStyles="width: revert-layer;"
                        clearable={false}
                        on:change={reset}
                        value={chosen ? chosen : 'All of Texas'}
                        showChevron
                        inputAttributes={{
                            title: 'Category',
                            'aria-label': 'Choose a page to navigate to related to the category then hit the go button.',
                            'aria-owns': 'nav_submit'
                        }} />
                </div>
                {#if !is_home_selected}
                    <div class="select-container main_select">
                        <Select
                            inputStyles="outline-width: 0; "
                            items={categories[chosen]}
                            clearable={false}
                            on:change={box2Change}
                            value={chosen2}
                            placeholder="Select {titles[chosen]}"
                            showChevron
                            inputAttributes={{
                                title: 'Sub Category',
                                'aria-label':
                                    'Choose a page to navigate to related to the sub category to navigate to then hit the go button.',
                                'aria-owns': 'nav_submit'
                            }} />
                    </div>
                {/if}
                <a
                    href={region}
                    type="submit"
                    class="button button-nav-submit"
                    id="nav_submit"
                    title="Continue here after you’ve filled out all form elements to navigate to selected page."
                    aria-label="Submit navigation selections."
                    target={undefined}>Go
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
</style>
