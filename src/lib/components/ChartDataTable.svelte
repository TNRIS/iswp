<script>
    import ToggleDisplay from "./ToggleDisplay.svelte";
    const { header, body, titles, showHide } = $$props;
    import { slugify, commafy } from "$lib/helper.js";
</script>

<div class="chart-table-container">
    <div class="toggle-container">
        {#if showHide}
            <ToggleDisplay>
                <div aria-live="polite" class="table-scroll-container">
                    <table class="u-full-width">
                        <thead>
                            <tr>
                                <th />
                                {#each header as h}
                                    <th>{h}</th>
                                {/each}
                            </tr>
                        </thead>
                        <tbody>
                            {#each body as b}
                                <tr class={slugify(b.className).toLowerCase()}>
                                    {#if titles == true}
                                        <td class="row-label">
                                            <span>{b.name}</span>
                                        </td>
                                    {:else}
                                        <td />
                                    {/if}
                                    {#each b.data as bd}
                                        <td>{commafy(bd + '')}</td>
                                    {/each}
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            </ToggleDisplay>
        {:else}
            <div aria-live="polite" class="table-scroll-container">
                <table class="u-full-width">
                    <thead>
                        <tr>
                            <th />
                            {#each header as h}
                                <th>{h}</th>
                            {/each}
                        </tr>
                    </thead>
                    <tbody>
                        {#each body as b}
                            <tr class={slugify(b.className).toLowerCase()}>
                                {#if titles == true}
                                    <td class="row-label">
                                        <span>{b.name}</span>
                                    </td>
                                {:else}
                                    <td />
                                {/if}
                                {#each b.data as bd}
                                    <td>{commafy(bd + '')}</td>
                                {/each}
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        {/if}
    </div>
</div>
