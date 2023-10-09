//@ts-nocheck
// Based on zoom map at https://observablehq.com/@d3/zoomable-treemap
import * as d3 from "d3";

export let buildZoomable = (container, data) => {
    // Specify the chart’s dimensions.
    const width = container.offsetWidth;
    const height = 500;
    var count = 0;``

    // This custom tiling function adapts the built-in binary tiling function
    // for the appropriate aspect ratio when the treemap is zoomed-in.
    function tile(node, x0, y0, x1, y1) {
        d3.treemapSquarify(node, 0, 0, width, height)
        for (const child of node.children) {
            child.x0 = x0 + (child.x0 / width) * (x1 - x0);
            child.x1 = x0 + (child.x1 / width) * (x1 - x0);
            child.y0 = y0 + (child.y0 / height) * (y1 - y0);
            child.y1 = y0 + (child.y1 / height) * (y1 - y0);
        }
    }

    // Compute the layout.
    const hierarchy = d3
        .hierarchy(data)
        .sum((d) => d.value)
        .sort((a, b) => b.value - a.value);
    
    const root = d3
        .treemap()
        .round(false)
        .tile(tile)(hierarchy);

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
            const color = d3.scaleOrdinal(data.children.map(d => d.name), d3.schemeTableau10);

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