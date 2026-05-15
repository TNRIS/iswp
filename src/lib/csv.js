
import { json2csv } from 'json-2-csv';

export let gen_csv_json = (swdata, constants)  => {
    let decades = constants.getDecades();

    let population = swdata?.population?.rows
        ? json2csv(swdata?.population?.rows, {
                keys: [
                    'EntityId',
                    'EntityName',
                    'WugType',
                    'WugRegion',
                    'WugCounty',
                    'EntityIsSplit',
                    `P${decades[0]}`,
                    `P${decades[1]}`,
                    `P${decades[2]}`,
                    `P${decades[3]}`,
                    `P${decades[4]}`,
                    ,
                    `P${decades[5]}`
                ],
                emptyFieldValue: ''
            })
        : [];

    let demands = swdata?.demands?.rows
        ? json2csv(swdata?.demands?.rows, {
                keys: [
                    'EntityId',
                    'EntityName',
                    'WugType',
                    'WugRegion',
                    'WugCounty',
                    'EntityIsSplit',
                    `D${decades[0]}`,
                    `D${decades[1]}`,
                    `D${decades[2]}`,
                    `D${decades[3]}`,
                    `D${decades[4]}`,
                    ,
                    `D${decades[5]}`
                ],
                emptyFieldValue: ''
            })
        : [];

    let existing = swdata?.supplies?.rows
        ? json2csv(swdata?.supplies?.rows, {
                keys: [
                    'EntityId',
                    'MapSourceId',
                    'EntityName',
                    'WugType',
                    'WugRegion',
                    'WugCounty',
                    'EntityIsSplit',
                    'SourceName',
                    `WS${decades[0]}`,
                    `WS${decades[1]}`,
                    `WS${decades[2]}`,
                    `WS${decades[3]}`,
                    `WS${decades[4]}`,
                    ,
                    `WS${decades[5]}`
                ],
                emptyFieldValue: ''
            })
        : [];

    let needs = swdata?.needs?.rows
        ? json2csv(swdata?.needs?.rows, {
                keys: [
                    'EntityId',
                    'EntityName',
                    'WugType',
                    'WugRegion',
                    'WugCounty',
                    'EntityIsSplit',
                    `N${decades[0]}`,
                    `N${decades[1]}`,
                    `N${decades[2]}`,
                    `N${decades[3]}`,
                    `N${decades[4]}`,
                    ,
                    `N${decades[5]}`
                ],
                emptyFieldValue: ''
            })
        : [];

    let strategy = swdata?.strategies?.rows
        ? json2csv(swdata?.strategies?.rows, {
                keys: [
                    'EntityId',
                    'MapSourceId',
                    'EntityName',
                    'WugType',
                    'WugRegion',
                    'WugCounty',
                    'EntityIsSplit',
                    'SourceName',
                    'SourceType',
                    'WmsId',
                    'WmsSponsorRegion',
                    'WmsName',
                    'WmsType',
                    `SS${decades[0]}`,
                    `SS${decades[1]}`,
                    `SS${decades[2]}`,
                    `SS${decades[3]}`,
                    `SS${decades[4]}`,
                    ,
                    `SS${decades[5]}`
                ],
                emptyFieldValue: ''
            })
        : [];

    let projects = swdata?.projects
        ? json2csv(swdata?.projects, {
                keys: [
                    'WmsProjectId',
                    'ProjectName',
                    'OnlineDecade',
                    'ProjectSponsors',
                    'CapitalCost',
                    'EntityLatCoord',
                    'EntityLongCoord',
                    'ProjectLatCoord',
                    'ProjectLongCoord',
                    'EntityId',
                    'EntityName',
                    'WugRegion',
                    'WugCounty',
                    'P2020',
                    'P2030',
                    'P2040',
                    'P2050',
                    'P2060',
                    'P2070'
                ],
                emptyFieldValue: ''
            })
        : [];

    return {
        population: population,
        demands: demands,
        existing: existing,
        needs: needs,
        strategy: strategy,
        projects: projects
    }
}




