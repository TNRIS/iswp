<script>
    let visible = false;
    let text = 'Show Data Table';
    function toggleVisible() {
        visible = !visible;
        if (visible) {
            text = 'Hide Data Table';
        } else {
            text = 'Show Data Table';
        }
    }
</script>

<button on:click={toggleVisible} class="button-small" title="Show Data Table">
    <small>{text}</small>
</button>

{#if visible}
    <div>
        <slot />
    </div>
{/if}
