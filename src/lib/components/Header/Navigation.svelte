<script>
    import { page, navigating } from '$app/stores';  
    let selected = {id: $page.url.pathname.split(["/"])[1] };
    let selected2 = $page.url.pathname.split(["/"])[2];
    import { sourceNames } from "$lib/pages/SourceNames";
    import { Constant2022 } from "$lib/Constant2022";
    let { db } = $$props;
    import Statewide from "$lib/db/statewide.js";
    let sw;
    let thing = async () => {
        db = await db;
        sw = new Statewide(db);
        abc.entity = await funcs();
    }

    thing();
    

    let constants = new Constant2022();
    // Need to parse string to extract route.
    let sets = [
        { id: "", value: "All of Texas" },
        { id: "region", value: "Planning Region" },
        { id: "county", value: "County" },
        { id: "entity", value: "Entity" },
        { id: "usagetype", value: "Usage Type" },
        { id: "source", value: "Water Source" },
        { id: "project", value: "WMS Project" },
        { id: "wms", value: "Water Management Strategy" },
        { id: "wmstype", value: "WMS Type" },
    ];
    
    let regions = constants.getRegions().reduce((a, o) => (a.push({"sourceid": o, "name": o}), a), []);
    let chosen = selected.id;
    let chosen2 = selected2;
    let counties = constants.getCountyNames().reduce((a, o) => (a.push({"sourceid": o, "name": o}), a), []);
    let usageTypes = constants.getUsageTypes().reduce((a, o) => (a.push({"sourceid": o, "name": o}), a), []);
    let wmstype = constants.WMS_TYPES.reduce((a, o) => (a.push({"sourceid": o, "name": o}), a), []);
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
        let qq = await sw.getWms();
        let a = await sw.getEntities();
        let zz = await sw.getProjects();

        let dd = qq.reduce((a, o) => (a.push({"name": o.WmsName, "sourceid": o.WmsId}), a), []);
        let cc = zz.reduce((a, o) => (a.push({"name": o.ProjectName, "sourceid": o.WmsProjectId}), a), []);
        let b = a.reduce((a, o) => (a.push({"name": o.EntityName, "sourceid": o.EntityId}), a), []);

        abc = {
            "": [],
            "region": regions,
            "county": counties,
            "source": sourceNames,
            "usagetype": usageTypes,
            "wmstype": wmstype
        }

        abc.entity = b;
        abc.project = cc;
        abc.wms = dd;
    }

    let reset = () => {
        let a = document.getElementsByClassName('nav-category-select')[0].value;
        chosen2 = abc[a][0]["sourceid"];
    }
</script>

<div class="header-nav sticky-div">
    <div class="wrapper">
        <form>
            <label for="nav-category-select">View data for</label>
            <div class="select-container" aria-live="polte">
                <select
                    bind:value={chosen}
                    class="nav-category-select"
                    id="nav-category-select"
                    on:change={reset}
                >
                    {#each sets as set}
                        <option value={set.id}>
                            {set.value}
                        </option>
                    {/each}
                </select>
            </div>
            {#if chosen !== ""}
                <div class="select-container">
                    <select
                        bind:value={chosen2}
                        id="secondary-category-select"
                        class="nav-category-select"
                    >
                        {#each abc?.[chosen] as r}
                            <option value={r.sourceid}>
                                {r.name}
                            </option>
                        {/each}
                    </select>
                </div>
            {/if}
            <form action={region} id="submit-button">
                <input type="submit" class="button button-nav-submit" disabled={false} value="Go" />
            </form>
        </form>
    </div>
</div>

<style>
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
</style>