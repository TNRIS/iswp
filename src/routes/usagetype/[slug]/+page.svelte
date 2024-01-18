<script>
    import { load_indexeddb, slugify } from "$lib/helper.js";
    import Statewide from "$lib/db/statewide.js";
    import { QuerySettings } from "$lib/QuerySettings.js"
    import ThemeTotalsByDecadeChart from "$lib/components/ThemeTotalsByDecadeChart.svelte";
    import DataViewChoiceWrapInd from "$lib/components/DataByPlanningDecadeAndTheme/DataViewChoiceWrapInd.svelte";
    export let data;
    import Header from "$lib/components/Header.svelte";
    import { Constant2027 } from "$lib/Constant2027.js";
    import { Constant2022 } from "$lib/Constant2022.js";
    import { Constant2017 } from "$lib/Constant2017.js";

    const year = 2027;
    let constants;
    if(year == 2027) {
        constants = new Constant2027();
    } else if (year == 2022) {
        constants = new Constant2022();
    } else if (year == 2017) {
        constants = new Constant2017();
    }
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
<Header {constants} />

<div>
{#await loadForRegion()}
<span>Loading</span>
{:then out}
<ThemeTotalsByDecadeChart swdata={out} {constants} />
<DataViewChoiceWrapInd swdata={out} csvTitle={`${slugify(data.slug)} Usage Type`} fileName={`usagetype_${data.slug.toLowerCase()}`} {constants} />

{:catch error}
<span>Error starting database {error.message}</span>
{/await}
</div>

<style type="text/scss">
    @import '$lib/sass/main.scss';
</style>  