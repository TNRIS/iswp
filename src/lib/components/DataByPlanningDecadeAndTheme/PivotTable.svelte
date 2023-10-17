<script>
    //@ts-nocheck
    const { swdata } = $$props;
    import { onMountSync, usd_format } from "$lib/helper.js";
    let pivotLoaded = false;

    import { getContext } from "svelte";

    const decadeStore = getContext("myContext").decadeStore;
    const themeStore = getContext("myContext").themeStore;
    const dataviewContext = getContext("dataviewContext");

    let getData = async () => {
        try {
            if (!pivotLoaded) {
                await onMountSync();
            }
            pivotLoaded = true;
            let rows, dimensions, reduce, calculations, sorter, activeDimensions;
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
            }

            if ($themeStore == "strategies") {
                activeDimensions = [
                    "County",
                    "Entity",
                    "Strategy",
                    "WMS Type",
                    "Source"
                ]
                sorter = "Strategy";
                rows = swdata.strategies.rows;
                dimensions = [
                    { value: "WmsName", title: "Strategy" },
                    { value: "WmsType", title: "WMS Type" },
                    { value: "SourceName", title: "Source" },
                    { value: "WugCounty", title: "County" },
                    { value: "EntityName", title: "Entity" },
                ];

                reduce = function (row, memo) {
                    memo.amountTotal =
                        (memo.amountTotal || 0) +
                        parseFloat(row["SS" + $decadeStore]);
                    return memo;
                };

                calculations = getCalculations(`${$decadeStore} Strategy Supplies`);
            } else if ($themeStore == "needs") {
                activeDimensions = [
                    "County",
                    "Entity",
                ]
                sorter = "County";
                rows = swdata.needs.rows;
                dimensions = [
                    { value: "WugCounty", title: "County" },
                    { value: "EntityName", title: "Entity" },
                ];

                reduce = function (row, memo) {
                    memo.amountTotal =
                        (memo.amountTotal || 0) +
                        parseFloat(row["N" + $decadeStore]);
                    return memo;
                };

                calculations = getCalculations(`${$decadeStore} Needs (Potential Shortages)`);
            } else if ($themeStore == "supplies") {
                activeDimensions = [
                    "County",
                    "Entity",
                    "Source"
                ]
                sorter = "County";
                rows = swdata.supplies.rows;
                dimensions = [
                    { value: "WugCounty", title: "County" },
                    { value: "EntityName", title: "Entity" },
                    { value: "SourceName", title: "Source" },
                ];

                reduce = function (row, memo) {
                    memo.amountTotal =
                        (memo.amountTotal || 0) +
                        parseFloat(row["WS" + $decadeStore]);
                    return memo;
                };

                calculations = getCalculations(`${$decadeStore} Existing Supplies`);
            } else if ($themeStore == "demands") {
                activeDimensions = [
                    "County",
                    "Entity"
                ]
                sorter = "County";
                rows = swdata.demands.rows;
                dimensions = [
                    { value: "WugCounty", title: "County" },
                    { value: "EntityName", title: "Entity" },
                ];

                reduce = function (row, memo) {
                    memo.amountTotal =
                        (memo.amountTotal || 0) +
                        parseFloat(row["D" + $decadeStore]);
                    return memo;
                };
                calculations = getCalculations(`${$decadeStore} Demands`);
            }

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
    <span>Loading</span>
{:then}
    <table id="PivotTable" />
{:catch}
    <span>Error loading pivottable</span>
{/await}
<div id="reactpivot" />
