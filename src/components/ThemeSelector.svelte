<script>
    // @ts-nocheck
    import { Constant2022 } from "../lib/Constant2022.js";
    const c22 = new Constant2022();
    const themeTitle = c22.getThemeTitles();
    const { show } = $$props;
</script>

<div class="selector theme-selector">
    <div class="show-medium">
        <button
            on:click={(event) => show(event)}
            class="selectorButtons button active">{themeTitle.demands}
        </button>
        <button on:click={(event) => show(event)} class="selectorButtons button">
            {themeTitle.supplies}
        </button>
        <button on:click={(event) => show(event)} class="selectorButtons button">
            {themeTitle.needs}
        </button>
        <button on:click={(event) => show(event)} class="selectorButtons button">
            {themeTitle.strategies}
        </button>
    </div>
    <div class="hide-medium">
        <label>Theme:</label>
        <select>
            <option value="demands">{themeTitle.demands}</option>
            <option value="supplies">{themeTitle.supplies}</option>
            <option value="needs">{themeTitle.needs}</option>
            <option value="strategies">{themeTitle.strategies}</option>
        </select>
    </div>
</div>
