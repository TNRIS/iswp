<script>
    //@ts-nocheck
    import { Grid } from "gridjs";
    import "gridjs/dist/theme/mermaid.css";
    import { onMount } from "svelte";
    import { usd_format } from "/src/lib/helper.js"
    const { db, wugRegionFilter, wmsFilter, wmsTypeFilter, countyFilter } = $$props;

    import Statewide from "/src/lib/db/statewide.js";
    let sum = 0;
    let region = wugRegionFilter;
    let projects = false;
    onMount(async () => {
        let sw = new Statewide(db);
        let a = await sw.get(wugRegionFilter, wmsFilter, wmsTypeFilter, countyFilter);
        if (a.projects && a.projects.length) projects = true;
        let project_data = [];
        for (let project of a.projects) {
            let to_array = [
                project.ProjectName,
                project.OnlineDecade,
                project.ProjectSponsors,
                usd_format.format(project.CapitalCost)
            ];

            // Need to stringify array to use includes function because [1] !== [1] since they don't have the same reference.
            if (
                !JSON.stringify(project_data).includes(JSON.stringify(to_array))
            ) {
                sum += project.CapitalCost;
                project_data.push(to_array);
            }
        }
        const grid = new Grid({
            columns: [
                { name: "Project", width: "45%" },
                "Decade Online",
                "Sponsor",
                "Capital Cost",
            ],
            pagination: true,
            sort: true,
            search: true,
            data: project_data,
            className: {
                table: "table-condensed",
            },
        }).render(document.getElementById("table-container"));
    });
</script>

<div class="container">
    <div class="row panel-row">
        <div class="twelve columns">
            <div class="recommended-projects-container">
                <h4>Recommended Projects</h4>
                <p>
                    Total capital cost of recommended projects:
                    <strong>{usd_format.format(sum)}</strong>
                    .
                </p>
                <div id="table-container" />
            </div>
        </div>
    </div>
</div>
