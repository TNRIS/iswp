<script>
    //@ts-nocheck
    const { swdata, csvTitle, title, constants, fileName } = $$props;
    import CsvDownloads from "$lib/components/CsvDownloads.svelte";

    import { onMountSync, usd_format, commafy } from "$lib/helper.js";
    let pivotLoaded = false;

    import { getContext } from "svelte";

    const decadeStore = getContext("myContext").decadeStore;
    const dataviewContext = getContext("dataviewContext");

    let getData = async () => {
        try {
            if (!pivotLoaded) {
                await onMountSync();
            }
            pivotLoaded = true;
            let rows,
                dimensions,
                reduce,
                calculations,
                sorter,
                activeDimensions;
            let getCalculations = (titleCalcField) => {
                return [
                    {
                        title: titleCalcField,
                        value: "amountTotal",
                        template: function (val, row) {
                            return commafy(val + '');
                        },
                        sortBy: function (row) {
                            return isNaN(row.amountTotal) ? 0 : row.amountTotal;
                        },
                    },
                ];
            };

            activeDimensions = ["Region", "County", "Entity"];
            sorter = "Region";

            rows = swdata.projects;

            dimensions = [
                { value: "WugRegion", title: "Region" },
                { value: "WugCounty", title: "County" },
                { value: "EntityName", title: "Entity" },
            ];

            reduce = function (row, memo) {
                memo.amountTotal =
                    (memo.amountTotal || 0) +
                    parseFloat(row["P" + $decadeStore]);
                return memo;
            };

            calculations = getCalculations(
                `${$decadeStore} Population Benefiting`
            );

            if (document.getElementById("reactpivot").firstChild)
                document.getElementById("reactpivot").firstChild.remove();

                let formattedRows = JSON.parse(JSON.stringify(rows));


                formattedRows.forEach((f) => {
                    f.WugRegion = f.WugRegion?.startsWith('<a') ? f.WugRegion : `<a href="/region/${f.WugRegion}">${f.WugRegion}</a>`;
                    f.EntityName = f.EntityName?.startsWith('<a') ? f.EntityName : `<a href="/entity/${f.EntityId}">${f.EntityName}</a>`;
                    f.WugCounty = f.WugCounty?.startsWith('<a') ? f.WugCounty : `<a href="/county/${f.WugCounty}">${f.WugCounty}</a>`;
                })


            ReactPivot(document.getElementById("reactpivot"), {
                rows: formattedRows,
                dimensions: dimensions,
                calculations: calculations,
                activeDimensions: activeDimensions,
                reduce: reduce,
                nPaginateRows: 50,
                sortBy: sorter,
            });
        } catch (err) {
            console.log(err);
        }
    };

    dataviewContext.getData.set(getData);
    let onLoad = async () => {
        await getData();
    };
</script>

{#await onLoad()}
    <div class="loader"></div>
{:then}
    <table id="PivotTable" />
{:catch}
    <span>Error loading pivottable</span>
{/await}


<div class="row panel-row">
    <span class="view-name">{title}</span>
    <h4>Raw Data - {$decadeStore} - Population Benefiting</h4>
    {#if !swdata?.population?.rows?.length }
    Sorry, there is no Population data.
    {/if}
    <div id="reactpivot" />
    <CsvDownloads {swdata} {csvTitle} {fileName} {constants} />
</div>
