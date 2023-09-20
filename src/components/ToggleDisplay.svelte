<script>
    let visible = false;

    function toggleVisible() {
        visible = !visible;
    }
</script>

<button on:click={toggleVisible} class="button-small">
    <small>Show Data Table</small>
</button>

{#if visible}
    <div>
        <slot />
    </div>
{/if}
