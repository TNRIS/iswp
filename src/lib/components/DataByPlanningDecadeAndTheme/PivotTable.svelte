<script>
    //@ts-nocheck
    const { page, slug, swdata, fileName, constants, stratAd, activeDem, showPopulation } = $$props;
    import { commafy, onMountSync, usd_format } from '$lib/helper.js?v1';
    let pivotLoaded = false;
    import CsvDownloads from '$lib/components/CsvDownloads.svelte';

    import { getContext } from 'svelte';
    const decadeStore = getContext('myContext').decadeStore;
    const themeStore = getContext('myContext').themeStore;
    const dataviewContext = getContext('dataviewContext');
    const themeTitles = constants.getThemeTitles();
    export let title;
    export let csvTitle;
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
                        value: 'amountTotal',
                        template: function (val, row) {
                            return commafy(val + '');
                        },
                        sortBy: function (row) {
                            return isNaN(row.amountTotal) ? 0 : row.amountTotal;
                        }
                    }
                ];
            };

            if ($themeStore == 'strategies') {
                activeDimensions = stratAd;
                sorter = 'Strategy';
                rows = swdata.strategies.rows;
                dimensions = [
                    {
                        value: 'WmsName',
                        title: 'Strategy'
                    },
                    { value: 'WmsType', title: 'WMS Type' },
                    { value: 'SourceName', title: 'Source' },
                    { value: 'WugCounty', title: 'County' },
                    { value: 'EntityName', title: 'Entity' },
                    { value: 'WugRegion', title: 'Region' }
                ];

                reduce = function (row, memo) {
                    memo.amountTotal = (memo.amountTotal || 0) + parseFloat(row['SS' + $decadeStore]);
                    return memo;
                };

                calculations = getCalculations(`${$decadeStore} Strategy Supplies`);
            } else if ($themeStore == 'needs') {
                activeDimensions = activeDem;
                sorter = 'County';
                rows = swdata.needs.rows;
                dimensions = [
                    { value: 'WugCounty', title: 'County' },
                    { value: 'EntityName', title: 'Entity' },
                    { value: 'WugRegion', title: 'Region' }
                ];

                reduce = function (row, memo) {
                    memo.amountTotal = (memo.amountTotal || 0) + parseFloat(row['N' + $decadeStore]);
                    return memo;
                };

                calculations = getCalculations(`${$decadeStore} Needs (Potential Shortages)`);
            } else if ($themeStore == 'supplies') {
                const supArray = activeDem.concat(['Source']);
                activeDimensions = supArray;
                sorter = 'County';
                rows = swdata.supplies.rows;
                dimensions = [
                    { value: 'WugCounty', title: 'County' },
                    { value: 'EntityName', title: 'Entity' },
                    { value: 'SourceName', title: 'Source' },
                    { value: 'WugRegion', title: 'Region' }
                ];

                reduce = function (row, memo) {
                    memo.amountTotal = (memo.amountTotal || 0) + parseFloat(row['WS' + $decadeStore]);
                    return memo;
                };

                calculations = getCalculations(`${$decadeStore} Existing Supplies`);
            } else if ($themeStore == 'demands') {
                activeDimensions = activeDem;
                sorter = 'County';
                rows = swdata.demands.rows;
                dimensions = [
                    { value: 'WugCounty', title: 'County' },
                    { value: 'EntityName', title: 'Entity' },
                    { value: 'WugRegion', title: 'Region' }
                ];

                reduce = function (row, memo) {
                    memo.amountTotal = (memo.amountTotal || 0) + parseFloat(row['D' + $decadeStore]);
                    return memo;
                };
                calculations = getCalculations(`${$decadeStore} Demands`);
            } else if ($themeStore == 'population') {
                activeDimensions = activeDem;
                sorter = 'County';
                rows = swdata.population.rows;
                dimensions = [
                    { value: 'WugCounty', title: 'County' },
                    { value: 'EntityName', title: 'Entity' },
                    { value: 'WugRegion', title: 'Region' }
                ];

                reduce = function (row, memo) {
                    memo.amountTotal = (memo.amountTotal || 0) + parseFloat(row['P' + $decadeStore]);
                    return memo;
                };
                calculations = getCalculations(`${$decadeStore} Population`);
            }

            if (document.getElementById('reactpivot').firstChild) document.getElementById('reactpivot').firstChild.remove();

            let formattedRows = JSON.parse(JSON.stringify(rows));

            formattedRows.forEach((f) => {
                if (f.MapSourceId)
                    f.SourceName = f.SourceName?.startsWith('<a')
                        ? f.SourceName
                        : `<a id="${f.SourceName}" href="/source/${f.MapSourceId}">${f.SourceName}</a>`;
                f.WugRegion = f.WugRegion?.startsWith('<a')
                    ? f.WugRegion
                    : `<a id="${f.WugRegion}" href="/region/${f.WugRegion}">${f.WugRegion}</a>`;
                f.EntityName = f.EntityName?.startsWith('<a')
                    ? f.EntityName
                    : `<a id="${f.EntityName}" href="/entity/${f.EntityId}">${f.EntityName}</a>`;
                f.WugCounty = f.WugCounty?.startsWith('<a')
                    ? f.WugCounty
                    : `<a id="${f.WugCounty}" href="/county/${f.WugCounty}">${f.WugCounty}</a>`;
                f.WmsName = f.WmsName?.startsWith('<a') ? f.WmsName : `<a id="${f.WmsName}" href="/wms/${f.WmsId}">${f.WmsName}</a>`;
                f.WmsType = f.WmsType?.startsWith('<a') ? f.WmsType : `<a id="${f.WmsType}" href="/wmstype/${f.WmsType}">${f.WmsType}</a>`;
            });

            ReactPivot(document.getElementById('reactpivot'), {
                rows: formattedRows,
                dimensions: dimensions,
                calculations: calculations,
                activeDimensions: activeDimensions,
                reduce: reduce,
                nPaginateRows: 50,
                sortBy: sorter,
                tableClassName: 'PivotTable'
            });
        } catch (err) {
            console.log(err);
        }
        try {
            let dimenContainer = document.getElementsByClassName('reactPivot-dimensions');
            dimenContainer.ariaDescription = 'Pivot Table for narrowing down data the raw data available in csv form below.';
            dimenContainer.ariaLabel = 'Pivot Table for narrowing down data.';
            if (dimenContainer && dimenContainer.length) {
                for (let i = 0; i < dimenContainer.length; i++) {
                    let dim = dimenContainer[i].children;
                    for (let i = 0; i < dim.length; i++) {
                        dim[i].ariaDescription = 'Change values here to change what is displayed in the Pivot Table below.';
                        dim[i].ariaLabel = 'Pivot Table Selector';
                    }
                }
            }
        } catch (err) {
            console.log('problem making dimension table more accessible. Proceeding. Please report this to twdb.');
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
    <table id="PivotTable" role="grid" />
{:catch}
    <span>Error loading pivottable</span>
{/await}

<div class="row panel-row" style="overflow:auto;">
    <span class="view-name">{title}</span>
    <h4
        >Raw Data - {$decadeStore} - {themeTitles[$themeStore]}
        {#if $themeStore === 'population'}
            <span class="units">(people)</span>
        {:else}
            <span class="units">(acre-feet/year)</span>
        {/if}
    </h4>
    <!-- Could be done in one if statement but it looks cleaner in an if else if in my opinion. -->
    {#if $themeStore === 'strategies' && !swdata?.strategies?.rows?.length}
        Sorry, there is no {themeTitles[$themeStore]} data.
    {:else if $themeStore === 'supplies' && !swdata?.supplies?.rows?.length}
        Sorry, there is no {themeTitles[$themeStore]} data.
    {:else if $themeStore === 'population' && !swdata?.population?.rows?.length}
        Sorry, there is no {themeTitles[$themeStore]} data.
    {:else if $themeStore === 'demands' && !swdata?.demands?.rows?.length}
        Sorry, there is no {themeTitles[$themeStore]} data.
    {:else if $themeStore === 'needs' && !swdata?.needs?.rows?.length}
        Sorry, there is no {themeTitles[$themeStore]} data.
    {/if}

    <div id="reactpivot"><!-- Sorry there is no raw data. --></div>
    <!-- If page is usagetype then only download if it's specifically Municipal. Download other pages with population if available. -->
    {#if (slug == 'MUNICIPAL' && page == 'usagetype') || page !== 'usagetype'}
        <CsvDownloads {swdata} {csvTitle} {fileName} {constants} downloadPopulation={true} />
    {:else}
        <CsvDownloads {swdata} {csvTitle} {fileName} {constants} downloadPopulation={showPopulation} />
    {/if}
</div>
