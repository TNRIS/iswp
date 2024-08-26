<!-- This file handles the top navigation. -->

<script>
    import { page } from '$app/stores';
    import Statewide from '$lib/db/statewide.js';
    import { cap, onMountSync } from '$lib/helper.js';
    import { Constant2017 } from '$lib/Constant2017';
    import { Constant2022 } from '$lib/Constant2022';
    import { Constant2027 } from '$lib/Constant2027';
    import Select from 'svelte-select';
    import { TEST_FLAG } from '$lib/helper';

    /**
     * @typedef NavLabel
     * @type {object}
     * @property {string} value
     * @property {string} label
     */

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

    let selected = { id: $page.url.pathname.split('/')[1] };
    let { db, constants } = $$props;
    /** @type {Statewide} */
    let sw;

    let chosen = selected.id;
    let label = '';
    if (chosen == 'statewide') {
        chosen = '';
    }
    let chosen2 = /** @type {string}*/ '';

    let c17 = new Constant2017();
    let c22 = new Constant2022();
    let c27 = new Constant2027();

    /**
     * labelReducer: Create usable labels out of an array of strings.
     * @param {string[]} labels
     * @param {string} [label_prefix] - Optional Paramater to prefix labels with.
     */
    let labelReducer = (labels, label_prefix = '') => {
        return labels.reduce((/** @type {NavLabel[]} */ accumulator, /** @type {string} */ currentValue) => {
            let navlabel = /** @type {NavLabel}*/ ({
                value: currentValue,
                label: `${label_prefix}${currentValue}`
            });
            accumulator.push(navlabel);
            return accumulator;
        }, []);
    };

    /**
     * objectExistsInArray: Check if object exists in an array. Pass in keys to check so you can check if it partially matches..
     * @param {any[]} accumulator
     * @param {any}  label
     * @param {string[]} keys
     * @param {string[]} [secondkeys] Optional keys for the label object. Defaults to keys.
     */
    let objectExistsInArray = (accumulator, label, keys, secondkeys = keys) => {
        let exists /** @type {boolean} */ = false; // Default to false.
        try {
            if (accumulator.length) {
                exists = accumulator.some((/** @type {any} */ item) => {
                    let match = true;
                    keys.forEach((key, i) => {
                        if (!(item[secondkeys[i]] === label[key])) match = false;
                    });
                    return match;
                });

                return exists;
            }
        } catch (e) {
            return false;
        }
        return false;
    };

    let regions = /** @type NavLabel[] */ labelReducer(constants.getRegions(), 'Region ');
    let counties = /** @type NavLabel[] */ labelReducer(constants.getCountyNames());
    let usageTypes = /** @type NavLabel[] */ labelReducer(constants.getUsageTypes());
    let wmstype = /** @type NavLabel[] */ labelReducer(constants.WMS_TYPES);

    $: region = chosen && chosen2 ? `/${chosen}/${chosen2}/` : !(chosen && chosen2) ? '/' : `/${chosen}/`;

    const titles = constants.chosenTitles;

    const items = [
        { value: '', label: 'All of Texas' },
        {
            value: 'region',
            label: 'Planning Region',
            placeholder_override: 'Region'
        },
        { value: 'county', label: 'County' },
        { value: 'entity', label: 'Water User Group' },
        { value: 'usagetype', label: 'Usage Type' },
        { value: 'source', label: 'Water Source' },
        { value: 'project', label: 'WMS Project' },
        { value: 'wms', label: 'Water Management Strategy' },
        { value: 'wmstype', label: 'WMS Type' }
    ];

    /** @type {CategoryClass} */
    let categories;

    const CategoryClass = class {
        /**
         *  @param {any} sw
         * */
        constructor(sw) {
            let start = 0;
            let  /** @type {object} */ sourceName;

            if (DEBUG_LOADING) start = Date.now();
            // Only use test flag if there is no host with a date in it.
            if($page.url.host.includes('2017')) {
                sourceName = c17.sourceNames;
            } else if($page.url.host.includes('2022')) {
                sourceName = c22.sourceNames;
            } else if($page.url.host.includes('2027')) {
                sourceName = c27.sourceNames;
            } else if(TEST_FLAG === '2017') {
                sourceName = c17.sourceNames;
            } else if(TEST_FLAG === '2022') {
                sourceName = c22.sourceNames;
            } else if(TEST_FLAG === '2027') {
                sourceName = c27.sourceNames;
            } else {
                sourceName = c22.sourceNames;
            }

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
                            value: currentValue.EntityName,
                            label: currentValue.EntityId
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
                            value: currentValue.ProjectName,
                            label: currentValue.WmsProjectId
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
                            value: currentValue.WmsName,
                            label: currentValue.WmsId
                        });
                    }

                    return accumulator;
                }, []);
            });

            if (DEBUG_LOADING) console.log(`Time to run navigation constructor ${Date.now() - start}`);
        }
    };

    /**
     * Hides all of the subcategories in a secondary-category-select if the function is called on:keyup.
     */
    function filterSubCategory() {
        const error_object = new Error('Cannot filter by sub category HTMLElements not setup correctly at this time.');

        let input = /** @type { HTMLInputElement | null} */ (document?.getElementById('secondary-category-select'));
        if (!input) throw error_object;

        let filter = /** @type {string} */ (input.value.toUpperCase());

        let ul = /** @type {HTMLUListElement | null} */ (document.getElementById('secondList'));

        let li = /** @type {HTMLCollectionOf<HTMLLIElement> | null} */ (ul?.getElementsByTagName('li'));
        if (!li) throw error_object;

        // First check if filter has any input. Then if it doesn't hide everything.
        if (filter.length <= 0) {
            for (let i = 0; i < li.length; i++) {
                li[i].style.display = 'none';
            }
            return;
        }

        // Loop through all list items, and hide those who don't match the search query
        for (let i = 0; i < li.length; i++) {
            /** @type {HTMLAnchorElement | null} */
            let a = li[i].getElementsByTagName('a')[0];
            /** @type {string}*/
            let txtValue = a.textContent || a.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                li[i].style.display = '';
            } else {
                li[i].style.display = 'none';
            }
        }
    }

    let setupChoices = async () => {
        await onMountSync();
        db = await db;
        categories = new CategoryClass(new Statewide(db));
    };

    /**
     * Action fired when secondary filter select is clicked. Can handle keyboard or mouse events.
     * @param {KeyboardEvent &{target: HTMLAnchorElement} | MouseEvent &{target: HTMLAnchorElement} | null} event
     */
    let clicker = async (event) => {
        const error_message = 'Navigation error please report to TWDB. Contact info is found at the bottom of the website.';
        var filter, a;

        const target_anchor = event?.target;
        if (!target_anchor) throw error_message;

        chosen2 = target_anchor.id;

        const secondary_input = /** @type {HTMLInputElement | null}*/ (document?.getElementById('secondary-category-select'));
        if (!secondary_input) throw error_message;

        secondary_input.value = target_anchor.text;

        filter = secondary_input.value.toUpperCase();
        const ul = /** @type {HTMLUListElement | null} */ (document.getElementById('secondList'));

        if (!ul) throw error_message;

        const li = /** @type {HTMLCollectionOf<HTMLElementTagNameMap["li"]>}*/ (ul.getElementsByTagName('li'));

        // Loop through all list items, and hide those who don't match the search query
        for (let i = 0; i < li.length; i++) {
            a = li[i].getElementsByTagName('a')[0];
            li[i].style.display = 'none';
        }
    };

    /**
     * Action fired when secondary filter select is keydowned.
     * @param {KeyboardEvent &{target: HTMLAnchorElement} | null} event
     */
    let keypresser = async (event) => {
        // Check key is enter or space.
        if (!event?.key) throw new Error('No key found. In keypresser function.');

        if (event.key == 'Escape') box2Change(event);
        if (event.key == 'Enter') clicker(event);
    };

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
        <form>
            <label for="navcat">View data for</label>
            <nav class="select-container" id="navcat_container">
                <Select
                    {items}
                    clearable={false}
                    on:change={reset}
                    value={chosen ? chosen : 'All of Texas'}
                    showChevron
                    inputAttributes={{
                        title: 'Category',
                        'aria-label': 'Choose a page to navigate to related to the category then hit the go button.',
                        'aria-owns': 'nav_submit'
                    }} />
            </nav>

            {#await setupChoices() then}
                {#if chosen && chosen !== '' && chosen !== 'statewide'}
                    {#if chosen == 'region' || chosen == 'county' || chosen == 'usagetype' || chosen == 'source' || chosen == 'wmstype'}
                        <nav class="select-container" style="width:300px;">
                            {#key chosen}
                                <Select
                                    items={categories[chosen]}
                                    clearable={false}
                                    on:change={box2Change}
                                    placeholder="Select {titles[chosen]}"
                                    showChevron
                                    inputAttributes={{
                                        title: 'Sub Category',
                                        'aria-label':
                                            'Choose a page to navigate to related to the sub category to navigate to then hit the go button.',
                                        'aria-owns': 'nav_submit'
                                    }} />
                            {/key}
                        </nav>
                    {:else}
                        <nav class="select-container">
                            <input
                                style="padding: 8px;"
                                type="text"
                                id="secondary-category-select"
                                autocomplete="off"
                                aria-label="Choose a page to navigate to related to the sub category to navigate to then hit the go button."
                                aria-owns="nav_submit"
                                on:keyup={filterSubCategory}
                                placeholder="Start typing to find {titles[chosen]}" />
                            <ul id="secondList" class="nav-category-select">
                                {#each categories?.[chosen] as r}
                                    <li
                                        style="display:none;"
                                        aria-live="polite"
                                        aria-label="Sub Category filters"
                                        aria-details="List filters depending on the sub category input.">
                                        <a
                                            role="button"
                                            tabindex="0"
                                            on:keydown={keypresser}
                                            on:click={clicker}
                                            id={r.label}
                                            class="listItem"
                                            aria-details="Submit this button to navigate to {cap(
                                                r.value
                                            )} subcategory when you hit the go button.">{cap(r.value)}</a>
                                    </li>
                                {/each}
                            </ul>
                        </nav>
                    {/if}
                {/if}
            {:catch error}
                <span>Error loading nav {error}</span>
            {/await}
            <form action={region} id="submit-button">
                <input
                    type="submit"
                    class="button button-nav-submit"
                    disabled={chosen == ''
                        ? false
                        : !(
                              (
                                  chosen &&
                                  chosen.length &&
                                  chosen2 &&
                                  chosen2 !== undefined
                              ) /* 0 is fine so check explicitly for undefined */
                          )}
                    value="Go"
                    id="nav_submit"
                    title="Continue here after you’ve filled out all form elements to navigate to selected page." />
            </form>
        </form>
    </div>
</div>

<style>
    .button-nav-submit:disabled {
        color: gray;
    }

    #navcat {
        height: default !important;
    }

    #navcat_container {
        width: 200px;
    }

    #submit-button {
        display: inline;
    }

    .button-nav-submit {
        height: 42px;
        background-color: white;
        font-size: revert;
    }

    #secondary-category-select {
        width: 200px;
        border-radius: 8px;
        width: 400px;
        height: 42px;
    }

    .header-nav {
        z-index: 7000;
    }

    .listItem {
        width: 100%;
        padding: 20px 10px;
        border: 1px solid #979997;
        margin: 0px;
        -webkit-appearance: none;
        -moz-appearance: none;
        -ms-appearance: none;
        -o-appearance: none;
        appearance: none;
        cursor: pointer;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        -ms-border-radius: 4px;
        -o-border-radius: 4px;
        border-radius: 4px;

        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
    }

    #secondList {
        /* Remove default list styling */
        list-style-type: none;
        margin: 0;
        position: absolute;
        width: 380px;
        max-height: 400px;
        overflow-y: scroll;
        overflow-x: hidden;
    }

    #secondList li {
        width: 100%;
        margin: 0;
    }

    #secondList li a {
        padding-top: 8px;
        padding-bottom: 8px;
        border: none;
        width: 100%;
        background-color: white;
        text-decoration: none;
        min-width: inherit;
        display: inline-block;
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
