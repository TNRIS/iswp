<script>
    import { Grid, html } from "gridjs";
    import "gridjs/dist/theme/mermaid.css";
    import { onMount } from "svelte";
    import { usd_format, usd_format_whole } from "$lib/helper.js";
    const { swdata, type, project_title, project_title2 } = $$props;
    let sum = 0;

    let projects = false;
    /**
     * @type {Array<Array<Object>>}
     */
    $: project_data = []
    $: display_table = "none";
    onMount(async () => {
        if (swdata.projects && swdata.projects.length) projects = true;
        for (let project of swdata.projects) {
            let to_array = [
                html(`<a href="/project/${project.WmsProjectId}">${project.ProjectName}`),
                project.OnlineDecade,
                project.ProjectSponsors,
                project.CapitalCost % 1 != 0 ? usd_format.format(project.CapitalCost) : usd_format_whole.format(project.CapitalCost)
            ];

            // Need to stringify array to use includes function because [1] !== [1] since they don't have the same reference.
            if (
                !(
                    JSON.stringify(project_data).includes(
                        JSON.stringify(to_array)
                    ) &&
                    (project.WmsProjectSponsorRegion === project.WugRegion ||
                        type !== "region") // Specific to region.
                )
            ) {
                sum += project.CapitalCost;
                project_data.push(to_array);
            }
        }
        project_data = project_data
        if(project_data.length) {
            display_table = "block"
        }
        const grid = new Grid({
            columns: [
                { 
                    name: "Project",
                    width: "45%",
                    sort: {
                        /**
                         * 
                         * @param {any} a Object to compare containing a item in the grid.
                         * @param {any} b Object to compare containing a item in the grid.
                         */
                        compare: (a, b ) => {
                            try {
                                let acont = a?.props?.content.replace(/<.*?>/g, "");
                                let bcont = b?.props?.content.replace(/<.*?>/g, "");
                                if(acont > bcont)
                                    return 1;
                                else if(bcont > acont)
                                    return -1;
                                else
                                    return 0;
                            } catch(err) {
                                console.log("Problem sorting Project.");
                                return 0; // Default to 0 in case of an error.
                            }

                        }
                    }},
                { 
                    name: "Decade Online", 
                    width: "18%" 
                },
                "Sponsor",
                { 
                    name: "Capital Cost", 
                    width: "16%" ,
                    sort: {
                        /**
                         * 
                         * @param {any} a Object to compare containing a item in the grid.
                         * @param {any} b Object to compare containing a item in the grid.
                         */
                        compare: (a, b) => {
                            try {
                                let acont = Number(a.replace(/(^\$|,)/g,''));
                                let bcont = Number(b.replace(/(^\$|,)/g,''));
                                if(acont > bcont)
                                    return 1;
                                else if(bcont > acont)
                                    return -1;
                                else
                                    return 0;
                            } catch(err) {
                                console.log("Problem sorting Capital Cost.");
                                return 0; // Default to 0 in case of an error.
                            }
                        }
                    }
                },
            ],
            pagination: true,
            sort: true,
            search: true,
            data: project_data,
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
        }).render(document.getElementById("table-container"));
    });
</script>

<div class="container">
    <div class="row panel-row">
        <div class="twelve columns">
            <span class="view-name">{project_title}</span>
            <div class="recommended-projects-container">
                <h4>Recommended {project_title2}</h4>
                {#if project_data.length}
                <p>
                    Total capital cost of recommended projects:
                    <strong>{sum}</strong>.
                </p>
                {:else}
                <p>There are no recommended projects.</p>
                {/if}
                <div id="table-container" style='display:{display_table}' />

            </div>
        </div>
    </div>
</div>
