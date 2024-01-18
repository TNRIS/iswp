<script>
    //@ts-nocheck
    const { show, constants } = $$props;

    const DECADES = constants.getDecades();
    export let select_decade;
</script>

<div class="selector decade-selector">
    <div class="show-medium">
        {#each DECADES as decade}
            <button
                on:click={show}
                key={`button-${decade}`}
                class="button"
                class:active={select_decade == decade}
            >
                {decade}
            </button>
        {/each}
    </div>
    <div class="hide-medium">
        <label>Decade:</label>
        <select>
            {#each DECADES as decade}
                <option key={`option-${decade}`} value={decade}>
                    {decade}
                </option>
            {/each}
        </select>
    </div>
</div>
