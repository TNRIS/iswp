<script>
    let visible = false;
    let text = 'Show Data Table';
    const { ariaHint } = $$props;
    function toggleVisible() {
        visible = !visible;
        if (visible) {
            text = 'Hide Data Table';
        } else {
            text = 'Show Data Table';
        }
    }
</script>

<button
    on:click={toggleVisible}
    class="button-small"
    title={`Toggle ${ariaHint} data table`}
    aria-label={`Toggle ${ariaHint} data table`}>
    <small>{text}</small>
</button>

{#if visible}
    <div>
        <slot />
    </div>
{/if}
