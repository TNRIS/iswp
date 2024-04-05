<script>
    //@ts-nocheck
    const { swdata, csvTitle, title, constants, fileName } = $$props;
    import CsvDownloads from "$lib/components/CsvDownloads.svelte";

    import { onMountSync, usd_format } from "$lib/helper.js";
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
                            return val;
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
                { value: "WmsSponsorRegion", title: "Region" },
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
            ReactPivot(document.getElementById("reactpivot"), {
                rows: rows,
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
    <h4>Download Data</h4>
    <div id="reactpivot" />
    <CsvDownloads {swdata} {csvTitle} {fileName} {constants} />
</div>
