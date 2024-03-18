// @ts-nocheck
const heightAdjust = 14;
import { slugify, commafy } from "$lib/helper.js";

export function clearSeriesHighlight() {
    const dem_series = document.getElementsByClassName(`series-demands`);
    const sup_series = document.getElementsByClassName(`series-supplies`);
    const nee_series = document.getElementsByClassName(`series-needs`);
    const str_series = document.getElementsByClassName(`series-strategies`);

    const min_series = document.getElementsByClassName(`series-mining`);
    const liv_series = document.getElementsByClassName(`series-livestock`);
    const sep_series = document.getElementsByClassName(`series-steam-electric-power`);
    const man_series = document.getElementsByClassName(`series-manufacturing`);
    const mun_series = document.getElementsByClassName(`series-municipal`);
    const irr_series = document.getElementsByClassName(`series-irrigation`);


    for (let i = 0; i < min_series.length; i++) {
        min_series[i].classList.remove("highlight");
    }
    for (let i = 0; i < liv_series.length; i++) {
        liv_series[i].classList.remove("highlight");
    }
    for (let i = 0; i < sep_series.length; i++) {
        sep_series[i].classList.remove("highlight");
    }
    for (let i = 0; i < man_series.length; i++) {
        man_series[i].classList.remove("highlight");
    }
    for (let i = 0; i < mun_series.length; i++) {
        mun_series[i].classList.remove("highlight");
    }
    for (let i = 0; i < irr_series.length; i++) {
        irr_series[i].classList.remove("highlight");
    }

    for (let i = 0; i < dem_series.length; i++) {
        dem_series[i].classList.remove("highlight");
    }
    for (let i = 0; i < dem_series.length; i++) {
        sup_series[i].classList.remove("highlight");
    }
    for (let i = 0; i < dem_series.length; i++) {
        nee_series[i].classList.remove("highlight");
    }
    for (let i = 0; i < dem_series.length; i++) {
        str_series[i].classList.remove("highlight");
    }
}

export function hoverHelper(event, chartTitle) {
    if ( event.target.classList.contains( 'ct-point' ) && event.currentTarget.classList[0] == chartTitle ) {
        const me = event.target;
        const matrix = me.getScreenCTM().translate(
            +me.getAttribute('x1'), +me.getAttribute('y2')
        );
        const parent = me.parentNode;
        const tooltip = document.getElementById(`${chartTitle}-tooltip`);
        
        const seriesName = parent.attributes['ct:meta'] ?
            parent.attributes['ct:meta'].value : 'default';


        // bug in chartist results in 0s not being attached via ct:value
        // ref: https://github.com/gionkunz/chartist-js/issues/464
        const val = event.target.attributes['ct:value'].value || 0;

        //first set the innerHTML to the formatted value
        // and place the tooltip offscreen so that its
        // height and width can be calculated
        tooltip.innerHTML = commafy(val);
        tooltip.className = 'ct-tooltip offscreen';
        const width = tooltip.offsetWidth;
        const height = tooltip.offsetHeight;

        clearSeriesHighlight();

        const series = document.getElementsByClassName(`series-${seriesName}`);

        for(let i = 0; i < series.length; i++) {
            series[i].classList.add("highlight");
        }
        //use those heights and widths to calculate the placement in relation
        // to the hovered chart element
        tooltip.style.top = `${matrix.f - height - heightAdjust}px`;
        tooltip.style.left = `${matrix.e - width / 2}px`;
        tooltip.className = `ct-tooltip tooltip-${slugify(seriesName.toLowerCase())}`;
    }
    else if ((event.target.classList.contains( 'ct-bar' ) || event.target.classList.contains( 'ct-chart-bar' )) && event.currentTarget.classList[0] == chartTitle) {
        // use library to check classList because IE doesn't
        // implement classList on SVG elements
        const isOverBar = event.target.classList.contains('ct-bar');
        if (!isOverBar) {
            return;
        }
        // else
        const me = event.target;
        const matrix = me.getScreenCTM().translate(
            +me.getAttribute('x1'), +me.getAttribute('y2')
        );
        const parent = me.parentNode;
        const tooltip = document.getElementById(`${chartTitle}-tooltip`);

        const seriesName = parent.attributes['ct:meta'] ?
        parent.attributes['ct:meta'].value : 'default';
        
        clearSeriesHighlight();

        const series = document.getElementsByClassName(`series-${seriesName}`);

        for(let i = 0; i < series.length; i++) {
            series[i].classList.add("highlight");
        }
        // bug in chartist results in 0s not being attached via ct:value
        // ref: https://github.com/gionkunz/chartist-js/issues/464
        const val = event.target.attributes['ct:value'].value || 0;
        // first set the innerHTML to the formatted value
        // and place the tooltip offscreen so that its
        // height and width can be calculated
        tooltip.innerHTML = commafy(val);
        tooltip.className = 'ct-tooltip offscreen';
        const width = tooltip.offsetWidth;
        const height = tooltip.offsetHeight;

        //use those heights and widths to calculate the placement in relation
        // to the hovered chart element
        tooltip.style.top = `${matrix.f - height - heightAdjust}px`;
        tooltip.style.left = `${matrix.e - width / 2}px`;
        tooltip.className = `ct-tooltip tooltip-${slugify(seriesName.toLowerCase())}`;
    }
    else if(event.target.classList.contains( 'ct-slice-pie' )) {
        const me = event.target;
        const matrix = me.getScreenCTM().translate(
            +me.getAttribute('x1'), +me.getAttribute('y2')
        );
        const parent = me.parentNode;
        const tooltip = document.getElementById(`${chartTitle}-tooltip`);
        
        const seriesName = parent.attributes['ct:meta'] ?
            parent.attributes['ct:meta'].value : 'default';


        // bug in chartist results in 0s not being attached via ct:value
        // ref: https://github.com/gionkunz/chartist-js/issues/464
        const val = event.target.attributes['ct:value'].value || 0;

        //first set the innerHTML to the formatted value
        // and place the tooltip offscreen so that its
        // height and width can be calculated
        tooltip.innerHTML = commafy(val);
        tooltip.className = 'ct-tooltip offscreen';
        const width = tooltip.offsetWidth;
        const height = tooltip.offsetHeight;


        //use those heights and widths to calculate the placement in relation
        // to the hovered chart element
        tooltip.style.top = `${event.clientY - height - 10}px`;
        tooltip.style.left = `${event.clientX - width / 2}px`;
        tooltip.className = `ct-tooltip tooltip-${slugify(seriesName.toLowerCase())}`;

        console.log(`top: ${tooltip.style.top} left: ${tooltip.style.left}`);

    }
}

let hideTooltip = (chartTitle) => {
    const tooltip = document.getElementById(`${chartTitle}-tooltip`);
    tooltip.className = 'ct-tooltip hide';
}

export function clearInteraction(chartTitle) {
    hideTooltip(chartTitle);
    clearSeriesHighlight();
}