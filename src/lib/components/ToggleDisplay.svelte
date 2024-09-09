<script>
    export /** @type {boolean} */let visible;
    let text = 'Show Data Table';
    const { ariaHint } = $$props;
    function toggleVisible() {
        visible = !visible;

        if(visible) {
            document.getElementById("point-chart-usage-type").style.minHeight = '567px';
            text = 'Hide Data Table';
        } else {
            document.getElementById("point-chart-usage-type").style.minHeight = '390px';
            text = 'Show Data Table';
        }
    }
</script>

<button on:click={toggleVisible} class="button-small" title={`Toggle ${ariaHint} data table`} aria-label={`Toggle ${ariaHint} data table`}>
    <small>{text}</small>
</button>

{#if visible}
    <div>
        <slot />
    </div>
{/if}
