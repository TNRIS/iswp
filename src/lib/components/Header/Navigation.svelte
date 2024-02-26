<script>
    function myFunction() {
        // Declare variables
        var input, filter, ul, li, a, i, txtValue;
        input = document.getElementById('secondary-category-select');
        filter = input.value.toUpperCase();
        ul = document.getElementById("secondList");
        li = ul.getElementsByTagName('li');

        // Loop through all list items, and hide those who don't match the search query
        for (i = 0; i < li.length; i++) {
            a = li[i].getElementsByTagName("a")[0];
            txtValue = a.textContent || a.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                li[i].style.display = "";
            } else {
                li[i].style.display = "none";
            }
        }
    }

    import { page, navigating } from '$app/stores';  
    let selected = {id: $page.url.pathname.split(["/"])[1] };
    let selected2 = $page.url.pathname.split(["/"])[2];
    import { sourceNames } from "$lib/pages/SourceNames";
    import { Constant2022 } from "$lib/Constant2022";
    let { db } = $$props;
    import Statewide from "$lib/db/statewide.js";
    import {cap, onMountSync} from "$lib/helper.js";
    import Select from 'svelte-select'
    let sw;
    let thing = async () => {
        console.log("Starting thing func")
        await onMountSync();
        db = await db;
        sw = new Statewide(db);
        await funcs();
    }

    let clicker = async (event) => {
        chosen2 = event.target.id
        document.getElementById("secondary-category-select").value = event.target.text
        var input, filter, ul, li, a, i, txtValue;
        input = document.getElementById('secondary-category-select');
        filter = input.value.toUpperCase();
        ul = document.getElementById("secondList");
        li = ul.getElementsByTagName('li');

        // Loop through all list items, and hide those who don't match the search query
        for (i = 0; i < li.length; i++) {
            a = li[i].getElementsByTagName("a")[0];
            txtValue = a.textContent || a.innerText;
            li[i].style.display = "none";

        }
    }

    let constants = new Constant2022();
    // Need to parse string to extract route.
    let sets = [
        { id: "", value: "All of Texas" },
        { id: "region", value: "Planning Region" },
        { id: "county", value: "County" },
        { id: "entity", value: "Water User Group" },
        { id: "usagetype", value: "Usage Type" },
        { id: "source", value: "Water Source" },
        { id: "project", value: "WMS Project" },
        { id: "wms", value: "Water Management Strategy" },
        { id: "wmstype", value: "WMS Type" },
    ];
    
    let regions = constants.getRegions().reduce((a, o) => (a.push({"value": o, "label": o}), a), []);
    let chosen = selected.id;
    if(chosen == "statewide") {
        chosen = "";
    }
    let chosen2 = selected2;
    let counties = constants.getCountyNames().reduce((a, o) => (a.push({"value": o, "label": o}), a), []);
    let usageTypes = constants.getUsageTypes().reduce((a, o) => (a.push({"value": o, "label": o}), a), []);
    let wmstype = constants.WMS_TYPES.reduce((a, o) => (a.push({"value": o, "label": o}), a), []);
    $: region = chosen && chosen2 ? `/${chosen}/${chosen2}`: `${chosen}/`;



    let abc = {
        "": [],
        "region": regions,
        "county": counties,
        "source": sourceNames,
        "usagetype": usageTypes,
        "wmstype": wmstype
    }


    let funcs = async () => {
        try {
            let start = Date.now();
            console.log("Starting navigation func");
            let qq = await sw.getWms();
            let a = await sw.getEntities();
            let zz = await sw.getProjects();

            let dd = qq.reduce((a, o) => (a.push({"value": o.WmsName, "label": o.WmsId}), a), []);
            let cc = zz.reduce((a, o) => (a.push({"value": o.ProjectName, "label": o.WmsProjectId}), a), []);
            let b = a.reduce((a, o) => (a.push({"value": o.EntityName, "label": o.EntityId}), a), []);

            abc.entity = b;
            abc.project = cc;
            abc.wms = dd;

            tmap = abc[chosen].reduce(function(map, obj) {
                map[obj.value] = obj.label;
                return map;
            }, {});

            console.log(`Time to run navigation func ${Date.now() - start}`)
        } catch(err) {
            console.log(err);
        }

    }
    /*
        {#each sets as set}
            <option value={set.id}>{set.value}</option>
        {/each}
    */
    let reset = (value) => {
        chosen = value.detail.value;
        chosen2 = abc[chosen][0]["value"];
    }

    let box2Change = (value) => {
        chosen2 = value.detail.value;
    }
   let items =  [
            { value: "", label: "All of Texas" },
            { value: "region", label: "Planning Region" },
            { value: "county", label: "County" },
            { value: "entity", label: "Water User Group" },
            { value: "usagetype", label: "Usage Type" },
            { value: "source", label: "Water Source" },
            { value: "project", label: "WMS Project" },
            { value: "wms", label: "Water Management Strategy" },
            { value: "wmstype", label: "WMS Type" },
        ]
        
    let tmap;
</script>

<div class="header-nav sticky-div">
    <div class="wrapper">
        <form>
            <label for="navcat">View data for</label>
            <div class="select-container" aria-live="polte" id="navcat_container">
                <Select {items} clearable={false} on:change={reset} value={chosen ? chosen : "All of Texas"} showChevron />
            </div>

            {#await thing()}
                <div class="loader"></div>
            {:then}
            {#if chosen && chosen !== "" && chosen !== "statewide"}

                {#if chosen == "region" || chosen == "county" || chosen == "usagetype" || chosen == "source" || chosen == "wmstype"}
                <div class="select-container" style="width:400px;">
                    <Select items={abc[chosen]} clearable={false} on:change={box2Change} placeholder={`Select ${chosen}`} value={tmap[chosen2] ? tmap[chosen2] : ""} showChevron />
                </div>
                {:else}
                <div class="select-container">
                    <input  style="padding: 8px;" type="text" id="secondary-category-select" on:keyup={myFunction} placeholder="Search for names..">
                    <ul id="secondList" class="nav-category-select">
                        {#each abc?.[chosen] as r}
                            <li style="display:none;" >
                                <a on:click={clicker} id={r.label} class="listItem">{cap(r.value)}</a>
                            </li>
                        {/each}
                    </ul>
                </div>
                {/if}
            {/if}

            {:catch error}
            <span>Error loading nav {error}</span>
            {/await}
            <form action={region} id="submit-button">
                <input type="submit" class="button button-nav-submit" disabled={false} value="Go" />
            </form>
        </form>
    </div>
</div>

<style>
    #navcat {
        height: default !important;
    }

    #navcat_container {
        width:200px;
    }

    #submit-button {
        display: inline;
        margin-left: 10px;
    }

    .button-nav-submit {
        background-color: white;
    }

    #secondary-category-select {
        width:200px;
    }

    .header-nav {
        z-index:7000;
    }

    .listItem {
        padding: 20px 10px;
        border: 1px solid #979997;
        margin: 0px;
        -webkit-appearance: none;
        -moz-appearance: none;
        -ms-appearance: none;
        -o-appearance: none;
        appearance: none;

        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        -ms-border-radius: 4px;
        -o-border-radius: 4px;
        border-radius: 4px;

        -webkit-appearance:none;
        -moz-appearance:none;
        appearance:none;
    }

    #secondList {
        /* Remove default list styling */
        list-style-type: none;
        margin: 0;
        position: absolute;
    }
    
    #secondList li {
        width: 100%;
        margin: 0;
    }
    
    #secondList li a {
        padding-top: 8px;
        padding-bottom: 8px;
        border-bottom: 1px solid lightgray;
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
</style>