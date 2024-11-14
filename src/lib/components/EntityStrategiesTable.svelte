<script>
    //@ts-nocheck
    import { Grid, html } from 'gridjs';
    import 'gridjs/dist/theme/mermaid.css';
    import { onMount } from 'svelte';
    import { usd_format, commafy } from '$lib/helper.js';
    const { lrp, type, constants } = $$props;
    let sum = 0;

    let decades = constants.getDecades();
    let strategies = false;
    export let title;
    $: strats = true;
    onMount(async () => {
        const swdata = await lrp;
        if (swdata?.strategies?.rows && swdata.strategies.rows.length) strategies = true;
        let strategy_data = [];

        if (!swdata.strategies.rows) {
            strats = false;
            return;
        }
        // Deep Copy object.
        let strat_raw = JSON.parse(JSON.stringify(swdata.strategies.rows));
        strat_raw = strat_raw.sort((a, b) => a.WmsName.localeCompare(b.WmsName));

        let strat_condensed = strat_raw.reduce((acc, d) => {
            const found = acc.find((a) => a.WmsName === d.WmsName);

            if (!found) {
                acc.push(d); // not found, so need to add data property
            } else {
                for (let decade of decades) {
                    acc[acc.length - 1][`SS${decade}`] += d[`SS${decade}`];
                }
            }
            return acc;
        }, []);

        for (let strat of strat_condensed) {
            let to_array = [html(`<a href="/wms/${strat?.WmsId}">${strat?.WmsName}</a>`)];
            // Add decades to array
            for (let decade of decades) {
                to_array.push(strat?.[`SS${decade}`]);
            }
            to_array.forEach((a, i) => {
                if (typeof a === 'number') to_array[i] = commafy(a + '');
            });
            strategy_data.push(to_array);
        }

        const grid = new Grid({
            columns: [
                {
                    name: 'Strategy',
                    width: '40%',
                    sort: {
                        /**
                         *
                         * @param {any} a Object to compare containing a item in the grid.
                         * @param {any} b Object to compare containing a item in the grid.
                         */
                        compare: (a, b) => {
                            try {
                                let acont = a?.props?.content.replace(/<.*?>/g, '');
                                let bcont = b?.props?.content.replace(/<.*?>/g, '');
                                if (acont > bcont) return 1;
                                else if (bcont > acont) return -1;
                                else return 0;
                            } catch (err) {
                                console.log('Problem sorting Project.');
                                return 0; // Default to 0 in case of an error.
                            }
                        }
                    }
                },
                decades?.[0],
                decades?.[1],
                decades?.[2],
                decades?.[3],
                decades?.[4],
                decades?.[5]
            ],
            pagination: false,
            sort: true,
            search: false,
            data: strategy_data,
            className: {
                table: 'table-condensed'
            },
            style: {
                td: {
                    padding: '2px 20px 0 0'
                },
                th: {
                    padding: '2px 20px 0 0'
                },
                table: {
                    border: 'none'
                }
            }
        }).render(document.getElementById('tab-con'));
    });
</script>

<div class="container">
    <div class="row panel-row">
        <div class="twelve columns">
            {#if title}
                <span class="view-name">{title}</span>
            {/if}
            <div class="recommended-projects-container">
                <h4 aria-level="3">Water Management Strategies</h4>
                {#if strats}
                    <div id="tab-con" />
                {:else}
                    There are no water management strategies.
                {/if}
            </div>
        </div>
    </div>
</div>
