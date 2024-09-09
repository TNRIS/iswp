<script>
    import ToggleDisplay from './ToggleDisplay.svelte';
    const { header, body, titles, showHide, titleMap, showTotal, ariaHint } = $$props;
    export /** @type {boolean} */ let visible;
    let totals = [0, 0, 0, 0, 0, 0];
    if (showTotal) {
        body.forEach((b) => {
            b.data.forEach((amount, i) => {
                totals[i] += amount;
            });
        });
    }

    import { slugify, commafy } from '$lib/helper.js';
</script>

<div class="chart-table-container">
    {#if showHide}
        <div class="toggle-container">
            <ToggleDisplay {ariaHint} bind:visible>
                <div aria-live="polite" class="table-scroll-container">
                    <!-- Try to add a good ariaHint. -->
                    <table
                        class="u-full-width"
                        title={ariaHint ? ariaHint : 'Chart for Data table'}
                        aria-label={ariaHint ? ariaHint : 'Chart for Data table'}>
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
                                            {#if titleMap}
                                                <span>{titleMap[b.name]}</span>
                                            {:else}
                                                <span>{b.name}</span>
                                            {/if}
                                        </td>
                                    {:else}
                                        <td />
                                    {/if}
                                    {#each b.data as bd}
                                        <td>{commafy(bd + '')}</td>
                                    {/each}
                                </tr>
                            {/each}
                            {#if showTotal}
                                <tr class="totals-row"
                                    ><td class="row-label">Total: </td>
                                    {#each totals as t}
                                        <td>{commafy(t + '')}</td>
                                    {/each}
                                </tr>
                            {/if}
                        </tbody>
                    </table>
                </div>
            </ToggleDisplay>
        </div>
    {:else}
        <div aria-live="polite" class="table-scroll-container">
            <table
                class="u-full-width"
                title={ariaHint ? ariaHint : 'Chart for Data table'}
                aria-label={ariaHint ? ariaHint : 'Chart for Data table'}>
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
                    {#if showTotal}
                        <tr class="totals-row"><td class="row-label">Total: </td></tr>
                    {/if}
                </tbody>
            </table>
        </div>
    {/if}
</div>
