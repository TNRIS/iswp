<script>
    //@ts-nocheck
    import ProjectTable from "$lib/components/ProjectTable/ProjectTable.svelte";
    import { QuerySettings } from "$lib/QuerySettings.js"
    import Statewide from "$lib/db/statewide.js";
    export let data;

    import { load_indexeddb } from "$lib/helper.js"


    let regionSetting = new QuerySettings("county", "WugCounty");
    regionSetting.setAll(data.slug.toUpperCase());
    let db;
    let loadForCounty = async () => {
        let start = Date.now();
        db = await load_indexeddb();
        let sw = new Statewide(db);
        let dat =  await sw.get(regionSetting);
        console.log(`loadForRegion time in ms: ${Date.now() - start}`);
        return dat;
    }
</script>

<div class="statewide-view">
    <section>
        {#await loadForCounty()}
            <span>Loading</span>
        {:then out}
            <ProjectTable swdata={ out } type="county" />
        {:catch error}
            <span>Error starting database {error.message}</span>
        {/await}
    </section>
</div>
