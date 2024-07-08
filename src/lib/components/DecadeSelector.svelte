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
        aria-label="Choose from the following decades to change the data displayed by the planning decade and theme widget"
        title="Choose from the following to decades change the data displayed by the planning decade and theme widget."
        group="data by planning decade and theme menu">
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
        aria-label="Choose from the following to decades change the data displayed by the planning decade and theme widget."
        title="Choose from the following to decades change the data displayed by the planning decade and theme widget."
        group="data by planning decade and theme menu">
        <label for="decade_nav">Decade:</label>
        <select id="decade_nav">
            {#each DECADES as decade}
                <option
                    key={`option-${decade}`}
                    value={decade}
                    role="menuitem"
                    title={`${decade}`}
                    aria-label={`${decade}`}
                    group="data by planning decade and theme menu">
                    {decade}
                </option>
            {/each}
        </select>
    </div>
</div>
