<script>
    //@ts-nocheck
    import ProjectTable from "/src/components/ProjectTable/ProjectTable.svelte";
    import { Constant2022 } from "/src/lib/Constant2022.js";
    const c22 = new Constant2022();
    export let data;

    import { start_all_db } from "/src/lib/db/db.js";
    import { onMountSync } from "/src/lib/helper.js"

    // Build the indexedDB
    let build_indexeddb = async () => {
        await onMountSync();

        let IS_2022_WEBSITE = window.location.href.indexOf("2022") > -1;
        let IS_2017_WEBSITE = window.location.href.indexOf("2017") > -1;

        // Start indexeddb, efficient if upgrade is not needed.
        let [db17, db22] = await start_all_db();

        // Choose database depending on url.
        if (!(db22 && db17)) throw "Databases are null.";

        if (IS_2022_WEBSITE) {
            return db22;
        } else if (IS_2017_WEBSITE) {
            return db17;
        } else {
            return db22;
        }
    };
</script>

<div class="statewide-view">
    <section>
        {#await build_indexeddb()}
            <span>Loading</span>
        {:then out}
            <ProjectTable db={ out } sourceFilter={ data.slug } />
        {:catch error}
            <span>Error starting database {error.message}</span>
        {/await}
    </section>
</div>
