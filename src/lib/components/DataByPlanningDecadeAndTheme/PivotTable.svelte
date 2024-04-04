<script>
    //@ts-nocheck
    const { swdata, csvTitle, title, fileName, constants, stratAd, activeDem } = $$props;
    import { commafy, onMountSync, usd_format } from "$lib/helper.js";
    let pivotLoaded = false;
    import CsvDownloads from "$lib/components/CsvDownloads.svelte";

    import { getContext } from "svelte";
    const decadeStore = getContext("myContext").decadeStore;
    const themeStore = getContext("myContext").themeStore;
    const dataviewContext = getContext("dataviewContext");
    const themeTitles = constants.getThemeTitles();

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

            if ($themeStore == "strategies") {
                activeDimensions = stratAd;
                sorter = "Strategy";
                rows = swdata.strategies.rows;
                dimensions = [
                    { value: "WmsName", title: "Strategy" },
                    { value: "WmsType", title: "WMS Type" },
                    { value: "SourceName", title: "Source" },
                    { value: "WugCounty", title: "County" },
                    { value: "EntityName", title: "Entity" },
                    { value: "WugRegion", title: "Region"}
                ];

                reduce = function (row, memo) {
                    memo.amountTotal =
                        (memo.amountTotal || 0) +
                        parseFloat(row["SS" + $decadeStore]);
                    return memo;
                };

                calculations = getCalculations(
                    `${$decadeStore} Strategy Supplies`
                );
            } else if ($themeStore == "needs") {
                activeDimensions = activeDem;
                sorter = "County";
                rows = swdata.needs.rows;
                dimensions = [
                    { value: "WugCounty", title: "County" },
                    { value: "EntityName", title: "Entity" },
                    { value: "WugRegion", title: "Region" }
                ];

                reduce = function (row, memo) {
                    memo.amountTotal =
                        (memo.amountTotal || 0) +
                        parseFloat(row["N" + $decadeStore]);
                    return memo;
                };

                calculations = getCalculations(
                    `${$decadeStore} Needs (Potential Shortages)`
                );
            } else if ($themeStore == "supplies") {
                const supArray = activeDem.concat(['Source'])
                activeDimensions = supArray
                sorter = "County";
                rows = swdata.supplies.rows;
                dimensions = [
                    { value: "WugCounty", title: "County" },
                    { value: "EntityName", title: "Entity" },
                    { value: "SourceName", title: "Source" },
                    { value: "WugRegion", title: "Region" }

                ];

                reduce = function (row, memo) {
                    memo.amountTotal =
                        (memo.amountTotal || 0) +
                        parseFloat(row["WS" + $decadeStore]);
                    return memo;
                };

                calculations = getCalculations(
                    `${$decadeStore} Existing Supplies`
                );
            } else if ($themeStore == "demands") {
                activeDimensions = activeDem;
                sorter = "County";
                rows = swdata.demands.rows;
                dimensions = [
                    { value: "WugCounty", title: "County" },
                    { value: "EntityName", title: "Entity" },
                    { value: "WugRegion", title: "Region" }
                ];

                reduce = function (row, memo) {
                    memo.amountTotal =
                        (memo.amountTotal || 0) +
                        parseFloat(row["D" + $decadeStore]);
                    return memo;
                };
                calculations = getCalculations(`${$decadeStore} Demands`);
            } else if ($themeStore == "population") {
                activeDimensions = activeDem;
                sorter = "County";
                rows = swdata.population.rows;
                dimensions = [
                    { value: "WugCounty", title: "County" },
                    { value: "EntityName", title: "Entity" },
                    { value: "WugRegion", title: "Region" }
                ];

                reduce = function (row, memo) {
                    memo.amountTotal =
                        (memo.amountTotal || 0) +
                        parseFloat(row["P" + $decadeStore]);
                    return memo;
                };
                calculations = getCalculations(`${$decadeStore} Demands`);
            }

            if (document.getElementById("reactpivot").firstChild)
                document.getElementById("reactpivot").firstChild.remove();

            for(let i = 0; i < rows.length; i++) {
                rows[i].EntityName = `<a href="/entity/${rows[i].EntityId}">${rows[i].EntityName}</a>`;
                rows[i].WugCounty = `<a href="/county/${rows[i].WugCounty}">${rows[i].WugCounty}</a>`;
                rows[i].WmsName = `<a href="/wms/${rows[i].WmsId}">${rows[i].WmsName}</a>`;
                rows[i].WmsType = `<a href="/wmstype/${rows[i].WmsType}">${rows[i].WmsType}</a>`;
            }
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
    <span class="view-name">{csvTitle}</span>
    <h4>Raw Data - {$decadeStore} - {themeTitles[$themeStore]}
        {#if $themeStore === "population"}
        <span class="units">(people)</span>
        {:else}
        <span class="units">(acre-feet/year)</span>
        {/if}
    </h4>
    <div id="reactpivot" />
    <CsvDownloads {swdata} {csvTitle} {fileName} {constants} />
</div>