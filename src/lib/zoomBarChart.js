//@ts-nocheck
// Based on zoom map at https://observablehq.com/@d3/zoomable-treemap
import * as d3 from "d3";

export let buildZoomable = (container, data, selectedTreemap, total) => {
    // Specify the chart’s dimensions.
    const width = container.offsetWidth;
    const height = 500;
    var count = 0;``

    // Compute the layout.
    const hierarchy = d3
        .hierarchy(data)
        .sum(function(d) {
            if(typeof d.value == "number") {
                return d.value;
            }
        })
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
        .style("font", "10px sans-serif")
        .style("font-weight", "bold")
        .style("color", "green");
        
    // Display the root.
    let group = svg.append("g").call(render, root);
    let toggle = true;
    
    //inz is short for inner zoom.
    function render(group, root, inz = false) {
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

        node.filter((d) => {
            if(inz) {
                return d;
            } else {
                return (d.children !== undefined ? d : undefined);
            }
        }).append("text")
        .attr("clip-path", (d) => {
            return d.clipUid;
        })
        .attr("font-weight", (d) => (d === root ? "bold" : null))
        .selectAll("tspan")
        .data((d) => {
            if(d === root) {
                return [name(d).concat(` (${format((d.value / d.parent.value ) * 100)})%`)]
            } else {
                return [d.data.name.concat(` (${format((d.value / d.parent.value ) * 100)})%`)]
            }            
        })

        .join("tspan")
        .attr("x", 3)
        .attr(
            "y",
            (d, i, nodes) =>
                `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`
        )
        .attr("fill-opacity", 1)
        .attr("font-weight", 1)
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
        const group1 = (group = svg.append("g").call(render, d, true));

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