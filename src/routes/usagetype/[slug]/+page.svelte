<script>
    import { load_indexeddb } from "$lib/helper.js";
    import Statewide from "$lib/db/statewide.js";
    import { QuerySettings } from "$lib/QuerySettings.js"
    import ThemeTotalsByDecadeChart from "$lib/components/ThemeTotalsByDecadeChart.svelte";
    import DataViewChoiceWrapInd from "$lib/components/DataByPlanningDecadeAndTheme/DataViewChoiceWrapInd.svelte";
    export let data;

    let utSetting = new QuerySettings("usagetype", "WugType");
    utSetting.setAll(data.slug.toUpperCase());

    let db;

    let loadForRegion = async () => {
        let start = Date.now();
        db = await load_indexeddb()
        let sw = new Statewide(db);
        let dat =  await sw.get(utSetting);
        console.log(`loadForRegion time in ms: ${Date.now() - start}`);
        return dat;
    }
</script>

<div>
{#await loadForRegion()}
<span>Loading</span>
{:then out}
<ThemeTotalsByDecadeChart swdata={out} />
<DataViewChoiceWrapInd swdata={out} />

{:catch error}
<span>Error starting database {error.message}</span>
{/await}
</div>

<style type="text/scss">
    @import '$lib/sass/main.scss';
</style>  