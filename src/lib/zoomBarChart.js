//@ts-nocheck
// Based on zoom map at https://observablehq.com/@d3/zoomable-treemap
import * as d3 from "d3";

export let buildZoomable = (container, data, selectedTreemap) => {
    // Specify the chart’s dimensions.
    const width = container.offsetWidth;
    const height = 500;
    var count = 0;``

    // This custom tiling function adapts the built-in binary tiling function
    // for the appropriate aspect ratio when the treemap is zoomed-in.
    function tile(node, left, top, right, bottom) {
        //node.x0 - the left edge of the rectangle
        //node.y0 - the top edge of the rectangle
        //node.x1 - the right edge of the rectangle
        //node.y1 - the bottom edge of the rectangle
        console.log(`x0: ${left}\n y0: ${top}\n x1: ${right}\n y1: ${bottom}\n\n`);
        d3.treemapBinary(node, 0, 0, width, height)
        node.x1 = node.x1
        node.x0 = node.x0        
        node.y1 = node.y1
        node.y0 = node.y0
        for (const child of node.children) {

            // Renaming these to a more descriptive name.
            let c_left = child.x0;
            let c_right = child.x1;
            let c_top = child.y0;
            let c_bottom = child.y1;
            //500 / container.offsetWidth * 0.5 * (1 + Math.sqrt(5))
            let tile_width_scalar = right - left;
            let tile_height_scalar = bottom - top;
            height / width * 0.5 * (1 + Math.sqrt(5))
            // Start at left of parent, or top for y. Then do calculation. Then multiply by scalar to get volume.
            child.x0 = left + (c_left / width)  * (tile_width_scalar);
            child.x1 = left + (c_right / width) * (tile_width_scalar);
            child.y0 = top + (c_top / height) * (tile_height_scalar);
            child.y1 = top + (c_bottom / height) * (tile_height_scalar);
            //console.log(`child.x0: ${child.x0}\n child.y0: ${child.y0}\n child.x1: ${child.x1}\n child.y1: ${child.y1}\n\n`);

        }

    }
    //x0 is top left

    // Compute the layout.
    const hierarchy = d3
        .hierarchy(data)
        .sum((d) => d.value)
        .sort((a, b) => b.value - a.value);
    
    const root = d3
        .treemap()
        .round(false)
        .tile(d3.treemapSquarify)(hierarchy);

    // Create the scales.
    const x = d3.scaleLinear().rangeRound([0, width]);
    const y = d3.scaleLinear().rangeRound([0, height]);

    // Formatting utilities.
    const format = d3.format(",d");
    const name = (d) =>
        d.ancestors()
            .reverse()
            .map((d) => d.data.name)
            .join("/");

    // Create the SVG container.
    const svg = d3
        .create("svg")
        .attr("viewBox", [0.5, -30.5, width, height + 30])
        .attr("width", width)
        .attr("height", height + 30)
        .attr("style", "max-width: 100%; height: auto;")
        .style("font", "10px sans-serif");

        
    // Display the root.
    let group = svg.append("g").call(render, root);
    let toggle = true;

    function render(group, root) {
        const node = group
            .selectAll("g")
            .data(root.children.concat(root.leaves()))
            .join("g");

            let region_colors = ["#fff9ae", "#aad7d4", "#dee791", "#fec34e", "#ffe4af", "#c1e1c1", "#a89bc3", "#c7dff4"
            , "#7ebf85", "#f9b5ab", "#78b6e4", "#ff0", "#57bbb6", "#b6bde0", "#c2cb20", "#d6aacb"];
        
            let usage_colors = ["#000000"];

            if(selectedTreemap == "region") {
                usage_colors = region_colors;
            } else if(selectedTreemap == "usagetype") {
                usage_colors = ["#ed1b2f", "#009b90", "#ead604", "#78b6e4", "#fec34e", "#6a8a22"]
            }

            const color = d3.scaleOrdinal(data.children.map(d => d.name), usage_colors);

            node.filter(function (d) {
                if(d === root) {
                    return d.parent;
                } else if(d.children !== undefined) {
                    return d;
                } else {
                    return d.parent.parent;
                }
            })
            .attr("cursor", "pointer")
            .on("click", function(event, d) {
                if(toggle) {
                    toggle = !toggle;
                    zoomin(d.parent);
                }
                else{
                    toggle = !toggle;
                    zoomout(root);
                }
            });

        node.append("title").text((d) => `${name(d)}\n${format(d.value)}`);

        let inner =  node.append("rect")
            .attr("id", d => (d.leafUid = `leaf${count++}`).id)
            .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
            .attr("fill-opacity", 0.6)
            .attr("width", d => d.x1 - d.x0)
            .attr("height", d => d.y1 - d.y0);


        node.append("clipPath")
            .attr("id", (d) => (d.clipUid = `clip${count++}`).id)
            .append("use")
            .attr("xlink:href", (d) => d.leafUid.href);



            
        node.filter((d) => (d.children !== undefined ? d : undefined)).append("text")
            .attr("clip-path", (d) => d.clipUid)
            .attr("font-weight", (d) => (d === root ? "bold" : null))
            .selectAll("tspan")
            .data((d) =>
                (d === root ? name(d) : d.data.name)
                    .split(/(?=[A-Z][^A-Z])/g)
                    .concat(format(d.value))
            )
            .join("tspan")
            .attr("x", 3)
            .attr(
                "y",
                (d, i, nodes) =>
                    `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`
            )
            .attr("fill-opacity", (d, i, nodes) =>
                i === nodes.length - 1 ? 0.7 : null
            )
            .attr("font-weight", (d, i, nodes) =>
                i === nodes.length - 1 ? "normal" : null
            )
            .text((d) => d);

        group.call(position, root);
    }

    function position(group, root) {
        group
            .selectAll("g")
            .attr("transform", (d) =>
                d === root
                    ? `translate(0,-30)`
                    : `translate(${x(d.x0)},${y(d.y0)})`
            )
            .select("rect")
            .attr("width", (d) => (d === root ? width : x(d.x1) - x(d.x0)))
            .attr("height", (d) => (d === root ? 30 : y(d.y1) - y(d.y0)));
    }

    // When zooming in, draw the new nodes on top, and fade them in.
    function zoomin(d) {
        const group0 = group.attr("pointer-events", "none");
        const group1 = (group = svg.append("g").call(render, d));

        x.domain([d.x0, d.x1]);
        y.domain([d.y0, d.y1]);

        svg.transition()
            .duration(750)
            .call((t) =>
                group0.transition(t).remove().call(position, d.parent)
            )
            .call((t) =>
                group1
                    .transition(t)
                    .attrTween("opacity", () => d3.interpolate(0, 1))
                    .call(position, d)
            );
    }

    // When zooming out, draw the old nodes on top, and fade them out.
    function zoomout(d) {
        const group0 = group.attr("pointer-events", "none");
        const group1 = (group = svg
            .insert("g", "*")
            .call(render, d.parent));

        x.domain([d.parent.x0, d.parent.x1]);
        y.domain([d.parent.y0, d.parent.y1]);

        svg.transition()
            .duration(750)
            .call((t) =>
                group0
                    .transition(t)
                    .remove()
                    .attrTween("opacity", () => d3.interpolate(1, 0))
                    .call(position, d)
            )
            .call((t) => group1.transition(t).call(position, d.parent));
    }

    return svg.node();
};