<!--
    Icon and labels.
-->

<script>
    import UsageTypeIcon from '$lib/components/UsageTypeIcon.svelte';
</script>

<div
    class="chart-legend usage-type-chart-legend u-pull-right legend-types-by-decade"
    role="presentation"
    aria-hidden="true"
    title="Color coded legend."
    aria-label="Color coded legend.">
    <ul>
        <li class="legend-entry"> <UsageTypeIcon group_name="IRRIGATION" /> Irrigation</li>
        <li class="legend-entry"> <UsageTypeIcon group_name="MUNICIPAL" /> Municipal</li>
        <li class="legend-entry"> <UsageTypeIcon group_name="MANUFACTURING" /> Manufacturing</li>
        <li class="legend-entry"> <UsageTypeIcon group_name="STEAM ELECTRIC POWER" /> Steam Electric Power</li>
        <li class="legend-entry"> <UsageTypeIcon group_name="LIVESTOCK" /> Livestock</li>
        <li class="legend-entry"> <UsageTypeIcon group_name="MINING" /> Mining</li>
    </ul>
</div>
