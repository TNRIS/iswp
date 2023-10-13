<script>
    //@ts-nocheck
    import ProjectTable from "$lib/components/ProjectTable/ProjectTable.svelte";
    import { Constant2022 } from "$lib/Constant2022.js";
    export let data;

    import { load_indexeddb } from "$lib/helper.js"
</script>

<div class="statewide-view">
    <section>
        {#await load_indexeddb()}
            <span>Loading</span>
        {:then out}
            <ProjectTable db={ out } sourceFilter={ data.slug } />
        {:catch error}
            <span>Error starting database {error.message}</span>
        {/await}
    </section>
</div>
