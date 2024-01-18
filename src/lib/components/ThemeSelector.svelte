<script>
    // @ts-nocheck
    import { Constant2022 } from "$lib/Constant2022.js";
    const c22 = new Constant2022();
    const themeTitle = c22.getThemeTitles();
    const { show, showPopulation } = $$props;
    export let select_theme;
</script>

<div class="selector theme-selector">
    <div class="show-medium">
        {#if showPopulation}
            <button
                on:click={(event) => show(event)}
                class="selectorButtons button"
                value="population"
                class:active={"population" == select_theme}
            >{themeTitle.population}
            <!-- Needs to be formatted this way to get rid of spaces unfortunately. -->
        </button>{/if}<button on:click={(event) => show(event)} class="selectorButtons button" value="demands" class:active={"demands" == select_theme}>{themeTitle.demands}
        </button><button on:click={(event) => show(event)} class="selectorButtons button" value="supplies" class:active={"supplies" == select_theme}>{themeTitle.supplies}
        </button><button on:click={(event) => show(event)} class="selectorButtons button" value="needs" class:active={"needs" == select_theme}>{themeTitle.needs}
        </button><button on:click={(event) => show(event)} class="selectorButtons button" value="strategies" class:active={"strategies" == select_theme}>{themeTitle.strategies}</button>
    </div>
    <div class="hide-medium">
        <label>Theme:</label><select on:change={(event) => show(event, true)}>
            <option value="demands" class:active={"demands" == select_theme}>{themeTitle.demands}</option>
            <option value="supplies" class:active={"supplies" == select_theme}>{themeTitle.supplies}</option>
            <option value="needs" class:active={"needs" == select_theme}>{themeTitle.needs}</option>
            <option value="strategies" class:active={"strategies" == select_theme}>{themeTitle.strategies}</option>
        </select>
    </div>
</div>

<style>
    .hide_space {
        margin-left: -0.4em !important;
    }

    #themerow {
        padding: 1em;
    }
</style>