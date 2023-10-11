<script>
    //@ts-nocheck
    import ProjectTable from "/src/components/ProjectTable/ProjectTable.svelte";
    export let data;

    import { load_indexeddb } from "/src/lib/helper.js"
</script>

<div class="statewide-view">
    <section>
        {#await load_indexeddb()}
            <span>Loading</span>
        {:then out}
            <ProjectTable db={ out } countyFilter={ data.slug }/>
        {:catch error}
            <span>Error starting database {error.message}</span>
        {/await}
    </section>
</div>
