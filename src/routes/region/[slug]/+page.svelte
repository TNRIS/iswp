<script>
    //@ts-nocheck
    import PopulationChart from "$lib/components/Charts/PopulationChart.svelte";
    import DataUsageType from "$lib/components/DataUsageType.svelte";
    import ProjectTable from "$lib/components/ProjectTable/ProjectTable.svelte";
    import ThemeTypesByDecadeChart from "$lib/components/ThemeTypesByDecadeChart.svelte";
    import ThemeTotalsByDecadeChart from "$lib/components/ThemeTotalsByDecadeChart.svelte";
    import DataViewChoiceWrapInd from "$lib/components/DataByPlanningDecadeAndTheme/DataViewChoiceWrapInd.svelte";
    import { load_indexeddb } from "$lib/helper.js";
    import Statewide from "$lib/db/statewide.js";
    import { QuerySettings } from "$lib/QuerySettings.js"
    export let data;
    import { setContext } from "svelte";
    import { writable } from "svelte/store";
    import Header from "$lib/components/Header.svelte";
    import { Constant2027 } from "$lib/Constant2027.js";
    import { Constant2022 } from "$lib/Constant2022.js";
    import { Constant2017 } from "$lib/Constant2017.js";
    import { description } from "$lib/RegionDescriptions.js";

    const year = 2027;
    let constants;
    if(year == 2027) {
        constants = new Constant2027();
    } else if (year == 2022) {
        constants = new Constant2022();
    } else if (year == 2017) {
        constants = new Constant2017();
    }


    let regionSetting = new QuerySettings("region", "WugRegion");
    regionSetting.setAll(data.slug);
    let db;
    let loadForRegion = async () => {
        let start = Date.now();
        db = await load_indexeddb()
        let sw = new Statewide(db);
        let dat =  await sw.get(regionSetting);
        console.log(`loadForRegion time in ms: ${Date.now() - start}`);
        return dat;
    }

    setContext("dataviewContext", {
        getData: writable()
    });   
</script>
<Header {constants} />

<div class="statewide-view">
    <section>
        {#await loadForRegion()}
            <span>Loading</span>
        {:then out}
        <PopulationChart title={`Planning Region ${data.slug}`} swdata={out} {constants}/>
        <div class="container">
            <div class="row panel-row">
                <div class="twelve columns">
                    <div>
                        <p>{description[data.slug]} {constants.region_footer}</p>
                    </div>
                </div> 
            </div>
        </div>
        <ThemeTotalsByDecadeChart swdata={out} {constants} />
        <ThemeTypesByDecadeChart chartTitle={"ct-usage-chart"} swdata={out} {constants} />
        <DataUsageType swdata={out} {constants} />
        <ProjectTable swdata={out} type={"region"} />
        <DataViewChoiceWrapInd {constants} csvTitle={`Planning Region ${data.slug}`} swdata={out} fileName={`region_${data.slug.toLowerCase()}`} />
        {:catch error}
            <span>Error starting database {error.message}</span>
        {/await}
    </section>
</div>

<style type="text/scss">
    @import '$lib/sass/main.scss';
</style>  