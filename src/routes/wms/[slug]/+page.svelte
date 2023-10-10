<script>
    //@ts-nocheck
    import ProjectTable from "/src/components/ProjectTable/ProjectTable.svelte";
    export let data;

    import { load_indexeddb } from "$lib/helper.js"
</script>

<div class="statewide-view">
    <section>
        {#await load_indexeddb()}
            <span>Loading</span>
        {:then out}
            <ProjectTable db={out} wugRegionFilter={undefined} wmsFilter={data.slug} />
        {:catch error}
            <span>Error starting database {error.message}</span>
        {/await}
    </section>
</div>
