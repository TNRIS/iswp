<script>
    //@ts-nocheck
    const { swdata, constants, fileName } = $$props;
    import CsvDownloads from '$lib/components/CsvDownloads.svelte';

    import { onMountSync, usd_format, commafy } from '$lib/helper.js';
    let pivotLoaded = false;

    import { getContext } from 'svelte';

    const decadeStore = getContext('myContext').decadeStore;
    const dataviewContext = getContext('dataviewContext');
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

            activeDimensions = ['Region', 'County', 'Entity'];
            sorter = 'Region';

            let filteredData = JSON.parse(JSON.stringify(swdata));

            rows = swdata.projects.filter((result) => {
                return result?.EntityId;
            }, []);
            filteredData.projects = rows;
            dimensions = [
                { value: 'WugRegion', title: 'Region' },
                { value: 'WugCounty', title: 'County' },
                { value: 'EntityName', title: 'Entity' }
            ];

            reduce = function (row, memo) {
                memo.amountTotal = (memo.amountTotal || 0) + parseFloat(row['P' + $decadeStore]);
                return memo;
            };

            calculations = getCalculations(`${$decadeStore} Population Benefiting`);

            if (document.getElementById('reactpivot').firstChild) document.getElementById('reactpivot').firstChild.remove();

            let formattedRows = JSON.parse(JSON.stringify(rows));

            formattedRows.forEach((f) => {
                f.WugRegion = f.WugRegion?.startsWith('<a') ? f.WugRegion : `<a href="/region/${f.WugRegion}">${f.WugRegion}</a>`;
                f.EntityName = f.EntityName?.startsWith('<a') ? f.EntityName : `<a href="/entity/${f.EntityId}">${f.EntityName}</a>`;
                f.WugCounty = f.WugCounty?.startsWith('<a') ? f.WugCounty : `<a href="/county/${f.WugCounty}">${f.WugCounty}</a>`;
            });

            ReactPivot(document.getElementById('reactpivot'), {
                rows: formattedRows,
                dimensions: dimensions,
                calculations: calculations,
                activeDimensions: activeDimensions,
                reduce: reduce,
                nPaginateRows: 50,
                sortBy: sorter
            });
            return filteredData;

        } catch (err) {
            console.log(err);
        }
    };
    let onLoad /** @type {promise} */ = getData();

    (async () => {
        await onLoad;
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
    })();
    dataviewContext.getData.set(getData);
</script>

{#await onLoad}
    <div class="loader"></div>
{:then}
    <table id="PivotTable"></table>
{:catch}
    <span>Error loading pivottable</span>
{/await}

<div class="row panel-row">
    <span class="view-name">{title}</span>
    <h4 aria-level="3">Raw Data - {$decadeStore} - Population Benefiting</h4>
    {#if !swdata?.projects?.length}
        Sorry, there is no Population data.
    {/if}
    <div id="reactpivot"></div>
    {#await onLoad then d}
        <CsvDownloads swdata={d} {csvTitle} {fileName} {constants} />
    {/await}
</div>
