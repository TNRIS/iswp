<script>
    //@ts-nocheck
    import DecadeSelector from "$lib/components/DecadeSelector.svelte";
    import ThemeSelector from "$lib/components/ThemeSelector.svelte";
    const { hideTheme, showPopulation, constants, sourcePage } = $$props;
    import { getContext } from "svelte";

    const decadeStore = getContext("myContext").decadeStore;
    const themeStore = getContext("myContext").themeStore;
    let bindTreeMap = getContext("dataviewContext").bindTreeMap;
    let getData = getContext("dataviewContext").getData;
    let buildPie = getContext("dataviewContext").buildPie;
    let buildEntMap = getContext("dataviewContext").buildEntMap;

    let showDecade = async (event) => {
        decadeStore.set(event.currentTarget.innerHTML.trim());
        let data = await $getData();
        try{
            $buildEntMap();
        } catch(err) {
            console.log("Problem building Entity Map")
        }
        $bindTreeMap(data);
        $buildPie();

    };
    let showTheme = async (event) => {
        themeStore.set(event.currentTarget.value.trim());
        let data = await $getData();
        try{
            $buildEntMap();
        } catch(err) {
            console.log("Problem building Entity Map")
        }
        if($bindTreeMap)
            $bindTreeMap(data);
    };
</script>

<div class="selectors">
    <div>
        <span class="inline-label show-medium">Decade:</span>
        <DecadeSelector show={showDecade} bind:select_decade={$decadeStore} {constants} />
    </div>

    {#if !hideTheme}
        <div>
            <span class="inline-label show-medium">Theme:</span>
            <ThemeSelector {showPopulation} show={showTheme} bind:select_theme={$themeStore} {sourcePage} />
        </div>
    {/if}
</div>
