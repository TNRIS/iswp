<script>
    //@ts-nocheck
    import { Grid, html } from 'gridjs';
    import 'gridjs/dist/theme/mermaid.css';
    import { onMount } from 'svelte';
    import { usd_format } from '$lib/helper.js';
    const { lrp, type, project_title, project_title2 } = $$props;

    let projects = false;
    $: project_data = [];
    $: display_table = 'none';
    onMount(async () => {
        const swdata = await lrp;
        if (swdata.projects && swdata.projects.length) projects = true;
        for (let project of swdata.projects) {
            let to_array = [
                html(`<a href="/wms/${project.WmsId}">${project.ProjectName}`),
                html(`<a href="/region/${project.WmsSponsorRegion}">${project.WmsSponsorRegion}`)
            ];

            // Need to stringify array to use includes function because [1] !== [1] since they don't have the same reference.
            if (
                !(
                    (
                        JSON.stringify(project_data).includes(JSON.stringify(to_array)) &&
                        (project.WmsProjectSponsorRegion === project.WugRegion || type !== 'region')
                    ) // Specific to region.
                )
            ) {
                project_data.push(to_array);
            }
        }
        project_data = project_data;
        if (project_data.length) {
            display_table = 'block';
        }
        const grid = new Grid({
            columns: [{ name: 'Strategy' }, { name: 'WMS Sponsor Region' }],
            pagination: true,
            sort: true,
            search: false,
            data: project_data,
            className: {
                table: 'table-condensed table_project'
            },
            style: {
                td: {
                    padding: '2px 20px 0 0'
                },
                th: {
                    padding: '2px 20px 0 0'
                },
                table: {
                    border: 'none',
                    'table-layout': 'unset'
                },
                tr: {
                    padding: '2px 20px 0 0'
                }
            }
        }).render(document.getElementById('table-container'));
    });
</script>

<div class="container">
    <div class="row panel-row">
        <div class="twelve columns">
            <span class="view-name">{project_title}</span>
            <h4 aria-level="3">Recommended {project_title2}</h4>
            <div class="recommended-projects-container">
                <div id="table-container" style="display:{display_table}" />
                <p class="note"
                    >Only strategy names that have strategy supplies assigned to a Water User Group are linked to a water management
                    strategy page.</p>
            </div>
        </div>
    </div>
</div>
