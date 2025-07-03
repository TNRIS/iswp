<script>
    import Banner from '$lib/Banner.svelte';
    import Navigation from '$lib/Navigation.svelte';
    import { getConstants, load_indexeddb, visualize_idb_downloading } from '$lib/helper';
    import { page } from '$app/stores';
    import { setContext } from 'svelte';

    import '$lib/react-pivot-standalone-4.4.1.min.js';
    import 'leaflet';
    import 'leaflet-easybutton/src/easy-button';
    import '$lib/leaflet/leaflet.utfgrid';
    let { children } = $props();
    let selected = { id: $page.url.pathname.split(['/'])[1] };
    let constants = getConstants($page.url.host);
    let db = load_indexeddb();
    setContext('db', db);
    //Remove temporary banner
    document.getElementById('temp-content')?.remove();
</script>
{#if constants.id == 27}
    <div class="draft-note">
        <div class="wrapper" style="word-break: break-word;">
            This web application displays draft data to assist with the review of the draft regional water plans (RWPs) and is
            current as of 03/05/2025. Although the data is subject to change as the draft plans are edited, the data displayed will
            not be refreshed until the final regional water plans are approved (early 2026). Please visit the 2026 Draft RWP
            homepage to view the published plans at: https://www.twdb.texas.gov/waterplanning/rwp/plans/2026/index.asp. You
            can also visit the Texas Water Development Board Secure Agency Reporting Application at
            https://www3.twdb.texas.gov/apps/SARA/reports/list to view 2026 Draft Regional Water Plan data. Use the global filter
            option located at the top of the reporting application and filter the reports by the text '2026' to see all reports
            associated with the 2026 RWPs.
        </div>
    </div>
{/if}
<Banner {constants} />
    {#await Promise.all([visualize_idb_downloading, db]) then}
        <Navigation {db} {selected} {constants} />
    {:catch}
        <span>There was an error loading the top navigation. Please clear your cache in your browser to reload the application.</span>
    {/await}
<div id="main-loader" style="display: none;">
<div class="summary-wrapper container" id="loader-msg" style="z-index: 600">
    <div class="w3-light-grey">
    <div role="progressbar" id="idb_progress_bar" class="w3-container w3-green"
        style="height:24px;width:1%;background-color: #477fc7;">
    </div>
    </div>
    Welcome. Please be patient while Interactive State Water Plan loads. <br /> <i>If you experience initial load
    times over 2 minutes, please clear the browser’s cookies/cache for this webpage.</i>
</div>
</div>
<div id="loadable-content">
{@render children()}
</div>
<style lang="css" global>
    @import "normalize.css";
    @import "$lib/styling/css/skeleton.css";
    @import "$lib/styling/webfonts/gill-sans.css";
    @import "leaflet";
    @import "leaflet-easybutton";
    @import "$lib/styling/sass/main.scss";
</style>