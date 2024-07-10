<script>
    import Rectangle from './Rectangle.svelte';
    import { Constant2022 } from '$lib/Constant2022.js';
    const c22 = new Constant2022();

    const titles = c22.getThemeTitles();
</script>

<div class="chart-legend u-pull-right" role="presentation" title="Color coded legend." aria-hidden="true">
    <ul>
        <li class="legend-entry">
            <Rectangle label={titles['demands']} key={'demands'} />
        </li>
        <li class="legend-entry">
            <Rectangle label={titles['supplies']} key={'supplies'} />
        </li>
        <li class="legend-entry">
            <Rectangle label={titles['needs']} key={'needs'} />
        </li>
        <li class="legend-entry">
            <Rectangle label={titles['strategies']} key={'strategies'} />
        </li>
    </ul>
</div>
