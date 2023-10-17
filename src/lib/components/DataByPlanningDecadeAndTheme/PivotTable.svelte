<script>
    //@ts-nocheck
    const { swdata } = $$props;
    import { onMountSync, usd_format } from "$lib/helper.js";
    let pivotLoaded = false;
    let promiseReactPivot = import(
        "react-pivot/dist/react-pivot-standalone-4.1.1.min.js"
    );
    import { getContext } from "svelte";

    const decadeStore = getContext("myContext").decadeStore;
    const themeStore = getContext("myContext").themeStore;
    const dataviewContext = getContext("dataviewContext");

    let getData = async () => {
        try {
            if (!pivotLoaded) {
                await onMountSync();
                promiseReactPivot = await promiseReactPivot;
            }
            pivotLoaded = true;
            let rows, dimensions, reduce, calculations, sorter;

            if ($themeStore == "strategies") {
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

                calculations = [
                    {
                        title: `${$decadeStore} Strategy Supplies`,
                        value: "amountTotal",
                        template: function (val, row) {
                            return val;
                        },
                        sortBy: function (row) {
                            return isNaN(row.amountTotal) ? 0 : row.amountTotal;
                        },
                    },
                ];
            } else if ($themeStore == "needs") {
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

                calculations = [
                    {
                        title: `${$decadeStore} Needs (Potential Shortages)`,
                        value: "amountTotal",
                        template: function (val, row) {
                            return val;
                        },
                        sortBy: function (row) {
                            return isNaN(row.amountTotal) ? 0 : row.amountTotal;
                        },
                    },
                ];
            } else if ($themeStore == "supplies") {
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

                calculations = [
                    {
                        title: `${$decadeStore} Existing Supplies`,
                        value: "amountTotal",
                        template: function (val, row) {
                            return val;
                        },
                        sortBy: function (row) {
                            return isNaN(row.amountTotal) ? 0 : row.amountTotal;
                        },
                    },
                ];
            } else if ($themeStore == "demands") {
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

                calculations = [
                    {
                        title: `${$decadeStore} Demands`,
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

            if (document.getElementById("reactpivot").firstChild)
                document.getElementById("reactpivot").firstChild.remove();
            ReactPivot(document.getElementById("reactpivot"), {
                rows: rows,
                dimensions: dimensions,
                calculations: calculations,
                activeDimensions: [
                    "Strategy",
                    "WMS Type",
                    "Source",
                    "County",
                    "Entity",
                ],

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
