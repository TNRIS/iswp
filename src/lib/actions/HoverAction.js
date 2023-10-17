// @ts-nocheck
const heightAdjust = 14;
function slugify(s) {
    return s.replace(/\s+/g, "-");
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
        tooltip.innerHTML = val;
        tooltip.className = 'ct-tooltip offscreen';
        const width = tooltip.offsetWidth;
        const height = tooltip.offsetHeight;


        //use those heights and widths to calculate the placement in relation
        // to the hovered chart element
        tooltip.style.top = `${matrix.f - height - heightAdjust}px`;
        tooltip.style.left = `${matrix.e - width / 2}px`;
        tooltip.className = `ct-tooltip tooltip-${slugify(seriesName.toLowerCase())}`;
    }
}

let hideTooltip = (chartTitle) => {
    const tooltip = document.getElementById(`${chartTitle}-tooltip`);
    tooltip.className = 'ct-tooltip hide';
}

export function clearInteraction(chartTitle) {
    hideTooltip(chartTitle);
}