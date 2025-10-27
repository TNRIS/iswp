<script>
    //@ts-nocheck
    import { Constant2022 } from '$lib/Constant2022.js';
    const { constants } = $$props;
</script>

<div class="container">
    <div class="clear-float u-full-width">
        <div class="row panel-row">
            <div class="twelve columns iswp-description" title="ISWP description" role="article">
                {#if constants.getYear() == 2027}
                    <p>
                        This website lets water users statewide take an up-close look at the 2026 regional water planning data and how water needs change over time by showing:
                    </p>
                {:else}
                    <p>
                        This website lets water users statewide take an up-close look at the {constants.getYear()} State Water Plan data and
                        how water needs change over time by showing:
                    </p>
                {/if}

                <ul>
                    <li>projected water demands,</li>
                    <li>existing water supplies,</li>
                    <li> the relative severity and projected water needs (potential shortages), </li>
                    <li> the water management strategies recommended to address potential shortages, and </li>
                    <li>recommended capital projects and their sponsors.</li>
                </ul>
                {#if constants.id == 27}
                    <p>
                        The final regional water plan data will be used in the development of the 2027 State Water Plan which is central to
                        the mission of the Texas Water Development Board. Based on 16 regional water plans, the state water plan addresses
                        the needs of all water user groups in the state - municipal, irrigation, manufacturing, livestock, mining, and
                        steam-electric power - during a repeat of the drought of record. The regional and state water plans consider a
                        50-year planning horizon: 2030 through 2080.
                    </p>
                {:else}
                    <p>
                        Development of the state water plan is central to the mission of the Texas Water Development Board. Based on 16
                        regional water plans, the plan addresses the needs of all water user groups in the state – municipal, irrigation,
                        manufacturing, livestock, mining, and steam-electric power – during a repeat of the drought of record. The regional
                        and state water plans consider a 50-year planning horizon: 2020 through 2070.
                    </p>
                {/if}
            </div>
        </div>
    </div>
</div>
