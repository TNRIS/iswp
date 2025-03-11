<!-- Purely Decorative images used to liven up the text labels. -->

<script>
    // @ts-nocheck

    import Irrigation from '$lib/img/icon-irrigation.svg?raw';
    import Municipal from '$lib/img/icon-municipal.svg?raw';
    import Manufacturing from '$lib/img/icon-manufacturing.svg?raw';
    import SteamElectricPower from '$lib/img/icon-steam-electric-power.svg?raw';
    import Livestock from '$lib/img/icon-livestock.svg?raw';
    import Mining from '$lib/img/icon-mining.svg?raw';

    const { group_name } = $$props;
    let icon_src;
    let cname;
    switch (group_name) {
        case 'IRRIGATION':
            icon_src = 'img/icon-irrigation.svg';
            cname = 'usage-type-icon icon-irrigation';
            break;
        case 'MUNICIPAL':
            icon_src = 'img/icon-municipal.svg';
            cname = 'usage-type-icon icon-municipal';
            break;
        case 'MANUFACTURING':
            icon_src = 'img/icon-manufacturing.svg';
            cname = 'usage-type-icon icon-manufacturing';
            break;
        case 'STEAM ELECTRIC POWER':
            icon_src = 'img/icon-steam-electric-power.svg';
            cname = 'usage-type-icon icon-steam-electric-power';
            break;
        case 'LIVESTOCK':
            icon_src = 'img/icon-livestock.svg';
            cname = 'usage-type-icon icon-livestock';
            break;
        case 'MINING':
            icon_src = 'img/icon-mining.svg';
            cname = 'usage-type-icon icon-mining';
            break;
    }
</script>

<!-- Setting alt to "" on purely decorative images was recommended by mozilla in 2024. -->
{#if group_name == 'IRRIGATION'}
    <!--  -->
    <svg alt="" aria-hidden="true" class="usage-type-icon icon-irrigation legend-marker">
        {@html Irrigation}
    </svg>
{/if}
{#if group_name == 'MUNICIPAL'}
<svg alt="" aria-hidden="true" class="usage-type-icon icon-municipal legend-marker">
    {@html Municipal}
</svg>
{/if}
{#if group_name == 'MANUFACTURING'}
<svg alt="" aria-hidden="true" class="usage-type-icon icon-manufacturing legend-marker">
    {@html Manufacturing}
</svg>
{/if}
{#if group_name == 'STEAM ELECTRIC POWER'}
<svg alt="" aria-hidden="true" class="usage-type-icon icon-steam-electric-power legend-marker">
    {@html SteamElectricPower}
</svg>
{/if}
{#if group_name == 'LIVESTOCK'}
<svg alt="" aria-hidden="true" class="usage-type-icon icon-livestock legend-marker">
    {@html Livestock}
</svg>
{/if}
{#if group_name == 'MINING'}
<svg alt="" aria-hidden="true" class="usage-type-icon icon-mining legend-marker">
    {@html Mining}
</svg>
{/if}
