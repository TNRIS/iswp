<script>
    const { constants } = $$props;
    import { page } from '$app/stores';
</script>

{#if $page.url.host.includes('2017')}
    <div class="draft-note">
        <div class="wrapper">
            Please visit the 2017 State Water Plan homepage to view the published plan at: <a
                title="TWDB State Water Planning home"
                href="http://www.twdb.texas.gov/waterplanning/swp/2017/index.asp"
                target="_blank">http://www.twdb.texas.gov/waterplanning/swp/2017/index.asp</a
            >.
        </div>
    </div>
{/if}
<header class="header" id="Top">
    <div class="header-title-container">
        <div class="header-title wrapper">
            <a class="skip-link" id="skip-link" href="#main-content" tabIndex="0" title="Skip to main content"> Skip to Main Content </a>
            <h1>
                <a href="/" title="Home">
                    <span class="first-line">{constants.getYear()}</span>
                    <br />
                    {constants.header}
                </a>
            </h1>
            <!-- <span class="by-the show-medium">by the</span> -->
            <a href="http://www.twdb.texas.gov" title="Texas Water Development Board">
                <img src="/img/twdb-logo-dark-bkgd-w200px-3c.png" class="logo" alt="Texas Water Development Board Logo" />
            </a>

            <div class="nav-container" style="font-size:0px">
                <a class="button button-home" aria-label="Home" href="/" title="Home">
                    <svg version="1" viewBox="0 0 24 24" data-reactid=".0.1.0.3.0.0">
                        <path d="M20 20v-8h2L12 3 2 12h2v8c0 .6.4 1 1 1h5v-7h4v7h5c.6 0 1-.4 1-1z" data-reactid=".0.1.0.3.0.0.0" />
                    </svg>
                </a>

                <a class="button active" title="About" href="/about">About</a>
            </div>
        </div>
    </div>
</header>
