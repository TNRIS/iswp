<script>
    import Banner from '$lib/components/Header/Banner.svelte';
    //Remove temporary banner
    document.getElementById('temp-content')?.remove();

    import Navigation from '$lib/components/Header/Navigation.svelte';
    import { onMountSync } from '$lib/helper.js?v1';
    const { db, constants, hideNav } = $$props;

    import { page } from '$app/stores';
    let selected = { id: $page.url.pathname.split(['/'])[1] };
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
{#if !hideNav}
    {#await onMountSync() then}
        <Navigation {selected} {db} {constants} />
    {/await}
{/if}
