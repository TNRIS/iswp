<script>
    //@ts-nocheck
    import { Grid, html } from "gridjs";
    import "gridjs/dist/theme/mermaid.css";
    import { onMount } from "svelte";
    import { usd_format } from "$lib/helper.js";
    const { swdata, type, constants } = $$props;
    let sum = 0;


    let decades = constants.getDecades();
    let strategies = false;
    onMount(async () => {
        if (swdata?.strategies?.rows && swdata.strategies.rows.length)
            strategies = true;
        let strategy_data = [];

        let strat_raw = swdata.strategies.rows.sort((a, b) => a.WmsName.localeCompare(b.WmsName));

        let strat_condensed = strat_raw.reduce((acc, d) => {
            const found = acc.find(a => a.WmsName === d.WmsName);

            if (!found) {
                acc.push(d); // not found, so need to add data property
            } else {
                for (let decade of decades) {
                    acc[acc.length -1][`SS${decade}`] += d[`SS${decade}`];
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
            strategy_data.push(to_array);
        }
        const grid = new Grid({
            columns: [
                { name: "Strategy", width: "40%" },
                decades?.[0],
                decades?.[1],
                decades?.[2],
                decades?.[3],
                decades?.[4],
                decades?.[5],
            ],
            pagination: false,
            sort: true,
            search: false,
            data: strategy_data,
            className: {
                table: "table-condensed",
            },
            style: {
                td: {
                    padding: "2px 20px 0 0",
                },
                th: {
                    padding: "2px 20px 0 0",
                },
                table: {
                    border: "none",
                },
            },
        }).render(document.getElementById("tab-con"));
    });
</script>

<div class="container">
    <div class="row panel-row">
        <div class="twelve columns">
            <div class="recommended-projects-container">
                <h4>Water Management Strategies</h4>
                <div id="tab-con" />
            </div>
        </div>
    </div>
</div>
