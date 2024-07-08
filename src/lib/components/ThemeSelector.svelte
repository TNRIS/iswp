<script>
    // @ts-nocheck
    import { Constant2022 } from '$lib/Constant2022.js';
    const c22 = new Constant2022();
    const themeTitle = c22.getThemeTitles();
    const { show, showPopulation, sourcePage } = $$props;
    export let select_theme;
</script>

<div
    class="selector theme-selector"
    role="navigation"
    title="Submit button to change the data in the table below."
    aria-label="Submit button to change the data in the table below.">
    <div
        class="show-medium"
        role="menubar"
        aria-label="Choose from the following themes to change the data displayed by the planning decade and theme widget."
        group="data by planning decade and theme menu"
        title="Choose from the following themes to change the data displayed by the planning decade and theme widget.">
        {#if showPopulation}
            <button
                on:click={(event) => show(event)}
                class="selectorButtons button"
                value="population"
                class:active={'population' == select_theme}
                >{themeTitle.population}
                <!-- Needs to be formatted this way to get rid of spaces unfortunately. -->
            </button>{/if}{#if !sourcePage}<button
                on:click={(event) => show(event)}
                class="selectorButtons button"
                value="demands"
                class:active={'demands' == select_theme}
                >{themeTitle.demands}
            </button>{/if}<button
            on:click={(event) => show(event)}
            class="selectorButtons button"
            value="supplies"
            class:active={'supplies' == select_theme}
            >{themeTitle.supplies}
        </button>{#if !sourcePage}<button
                on:click={(event) => show(event)}
                class="selectorButtons button"
                value="needs"
                class:active={'needs' == select_theme}
                >{themeTitle.needs}
            </button>{/if}<button
            on:click={(event) => show(event)}
            class="selectorButtons button"
            value="strategies"
            class:active={'strategies' == select_theme}>{themeTitle.strategies}</button>
    </div>
    <div class="hide-medium">
        <label for="theme_nav">Theme:</label><select
            id="theme_nav"
            on:change={(event) => show(event, true)}
            role="menubar"
            group="data by planning decade and theme menu"
            aria-label="Choose from the following themes to change the data displayed by the planning decade and theme widget."
            title="Choose from the following themes to change the data displayed by the planning decade and theme widget.">
            {#if showPopulation}
                <option
                    value="population"
                    class:active={'population' == select_theme}
                    role="menuitem"
                    title="population"
                    aria-label="population"
                    group="data by planning decade and theme menu">{themeTitle.population}</option>
            {/if}
            {#if !sourcePage}
                <option
                    value="demands"
                    class:active={'demands' == select_theme}
                    role="menuitem"
                    title="demands"
                    aria-label="demands"
                    group="data by planning decade and theme menu">{themeTitle.demands}</option>
            {/if}
            <option
                value="supplies"
                class:active={'supplies' == select_theme}
                role="menuitem"
                title="supplies"
                aria-label="supplies"
                group="data by planning decade and theme menu">{themeTitle.supplies}</option>
            {#if !sourcePage}
                <option
                    value="needs"
                    class:active={'needs' == select_theme}
                    role="menuitem"
                    title="needs"
                    aria-label="needs"
                    group="data by planning decade and theme menu">{themeTitle.needs}</option>
            {/if}
            <option
                value="strategies"
                class:active={'strategies' == select_theme}
                role="menuitem"
                title="strategies"
                aria-label="strategies"
                group="data by planning decade and theme menu">{themeTitle.strategies}</option>
        </select>
    </div>
</div>
