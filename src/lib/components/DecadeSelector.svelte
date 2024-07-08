<script>
    //@ts-nocheck
    const { show, constants } = $$props;

    const DECADES = constants.getDecades();
    export let select_decade;
</script>

<div class="selector decade-selector">
    <div
        class="show-medium"
        role="menubar"
        aria-label="Choose from the following to switch between decades."
        title="Choose from the following to switch between decades.">
        {#each DECADES as decade}
            <button
                on:click={show}
                key={`button-${decade}`}
                class="button"
                role="menuitem"
                title={`${decade}`}
                aria-label={`${decade}`}
                class:active={select_decade == decade}>
                {decade}
            </button>
        {/each}
    </div>
    <div
        class="hide-medium"
        role="menubar"
        aria-label="Choose from the following to switch between decades."
        title="Choose from the following to switch between decades.">
        <label for="decade_nav">Decade:</label>
        <select id="decade_nav">
            {#each DECADES as decade}
                <option key={`option-${decade}`} value={decade} role="menuitem" title={`${decade}`} aria-label={`${decade}`}>
                    {decade}
                </option>
            {/each}
        </select>
    </div>
</div>
