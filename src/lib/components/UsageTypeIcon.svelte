<!-- Purely Decorative images used to liven up the text labels. -->

<script>
    // @ts-nocheck

    import Irrigation from '/static/img/icon-irrigation.svg';
    import Municipal from '/static/img/icon-municipal.svg';
    import Manufacturing from '/static/img/icon-manufacturing.svg';
    import SteamElectricPower from '/static/img/icon-steam-electric-power.svg';
    import Livestock from '/static/img/icon-livestock.svg';
    import Mining from '/static/img/icon-mining.svg';

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
            icon_src = '/img/icon-mining.svg';
            cname = 'usage-type-icon icon-mining';
            break;
    }
</script>

<!-- Setting alt to "" on purely decorative images was recommended by mozilla in 2024. -->
{#if group_name == 'IRRIGATION'}
    <Irrigation alt="" aria-hidden="true" class="usage-type-icon icon-irrigation legend-marker" />
{/if}
{#if group_name == 'MUNICIPAL'}
    <Municipal alt="" aria-hidden="true" class="usage-type-icon icon-municipal legend-marker" />
{/if}
{#if group_name == 'MANUFACTURING'}
    <Manufacturing alt="" aria-hidden="true" class="usage-type-icon icon-manufacturing legend-marker" />
{/if}
{#if group_name == 'STEAM ELECTRIC POWER'}
    <SteamElectricPower alt="" aria-hidden="true" class="usage-type-icon icon-steam-electric-power legend-marker" />
{/if}
{#if group_name == 'LIVESTOCK'}
    <Livestock alt="" aria-hidden="true" class="usage-type-icon icon-livestock legend-marker" />
{/if}
{#if group_name == 'MINING'}
    <Mining alt="" aria-hidden="true" class="usage-type-icon icon-mining legend-marker" />
{/if}
