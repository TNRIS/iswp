<script>
    import { getContext, onMount } from "svelte";
    import { scaleTonew, usd_format, objLeftjoin, commafy } from "$lib/helper";
    const countyTable = "county_extended";
    const regionTable = "rwpas";
    const { title, swdata, constants, type, entityMapBlurb } = $$props;
    const sourceTable = constants.sourcemap;
    const dataviewContext = getContext("dataviewContext");
    const decadeStore = getContext("myContext").decadeStore;
    const themeStore = getContext("myContext").themeStore;

    const titles = constants.chosenTitles;
    const theme_titles = constants.getThemeTitles();
    let layers = [];
    let spiderfier;
    import {runOMS} from "$lib/leaflet.oms.js";

    onMount(async () => {
        runOMS();
        /*
         *
         * Initialize Leaflet map!
         */
        const map = L.map("entity_map", {
            scrollWheelZoom: false,
            zoomControl: false,
            maxZoom: 10,
            minZoom: 1,
        });
        spiderfier = new OverlappingMarkerSpiderfier(map, {
            keepSpiderfied: true,
            nearbyDistance: 5,
        });   

        spiderfier.addListener("spiderfy", () => {
            map.closePopup();
        });

        spiderfier.addListener("click", (marker) => {
            const props = marker.feature.properties;
            const entityContent = `
                <h3>${props.EntityName}</h3>
                <p>Total Value: ${format()(props.ValueSum)}</p>
                <a id="entity_${props.EntityId}">View Entity Page</a>
            `;
            const projectContent = `
                <h3>${props.ProjectName}</h3>
                <p>Decade Online: ${props.OnlineDecade}</p>
                <p>Sponsor: ${props.ProjectSponsors}</p>
                <p>Capital Cost: ${props.CapitalCost}</p>
                <a id="project_${props.WmsProjectId}">View Project Page</a>
            `;
            const content = props.EntityId ? entityContent : projectContent;
            popup.setContent(content);
            popup.setLatLng(marker.getLatLng());
            map.openPopup(popup);
        });
        map.createPane("geom");
        map.createPane("labels");
        map.createPane("project_labels");

        map.getPane("geom").style.zIndex = 200;
        map.getPane("labels").style.zIndex = 250;
        map.getPane("project_labels").style.zIndex = 300;

        L.control.zoom({ position: "topright" }).addTo(map);

        const TEXAS = [
            [36.5, -106.65],
            [25.84, -93.51],
        ]
        map.fitBounds(TEXAS);
        const baseLayer = L.tileLayer(
            "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png",
            {
                attribution:
                    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
            },
        );
        map.addLayer(baseLayer);
        // Remove default Prefix!
        map.attributionControl.setPrefix("");

        let key = window.location.pathname.split("/")[2];
        let page = window.location.pathname.split("/")[1];
        const triangle_icon = L.divIcon({
            className: "triangle-marker",
            html: '<div class="triangle-marker-inner"></div>',
        });

        /**
         * Step1
         * Build the county outline grid it's a gray thin line outlining all of the Texas counties! Add the layer!
         */
        const countyurl = `https://mapserver.tnris.org?map=/tnris_mapfiles/${countyTable}.map&mode=tile&tilemode=gmap&tile={x}+{y}+{z}&layers=CountyBoundaries&map.imagetype=png`;
        const countyret = {
            tilesUrl: countyurl,
        };
        const countyLayer = L.tileLayer(countyret.tilesUrl);
        map.addLayer(countyLayer);

        /**
         * Step2
         * Build the county labels, this goes hand in hand with the gray lines in the previous step!
         */
        const countyLabelurl = `https://mapserver.tnris.org?map=/tnris_mapfiles/${countyTable}.map&mode=tile&tilemode=gmap&tile={x}+{y}+{z}&layers=Labels&map.imagetype=png`;
        const countyLabelret = {
            tilesUrl: countyLabelurl,
        };
        const countyLabelsLayer = L.tileLayer(countyLabelret.tilesUrl);
        map.addLayer(countyLabelsLayer);

        /**
         * Step3
         * Add the region highlight! It is a orange highlighted area containing the entity icons, and optionally projects!
         */
        let region_query;
        let property_name;
        let type_name
        let table
        if(page === "region") {
            property_name = "letter";
            type_name = "RWPAS";
            table = regionTable;

        } else if(page === "county") {
            property_name = "name"
            type_name = "CountyBoundaries";
            table = countyTable;
        } else if(page === "project") {
            themeStore.set("projects");
        }

        // Create a border for region and county.
        if(page === "region" || page === "county") {
            region_query = await fetch(
            `https://mapserver.tnris.org/?map=/tnris_mapfiles/${table}.map&SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&TYPENAMES=${type_name}&outputformat=geojson&SRSNAME=EPSG:4326&Filter=<Filter><PropertyIsEqualTo><PropertyName>${property_name}</PropertyName><Literal>${key}</Literal></PropertyIsEqualTo></Filter>`);

            let region_geo_json = await region_query.text();
            let region = L.geoJson(JSON.parse(region_geo_json), {
                interactive: false,
                style: {
                    color: "#cc9200",
                    fillOpacity: 0.1,
                },
            });
            region.addTo(map);

            const center = region.getBounds().getCenter();
            map.setView(center, 7);
        }


        async function buildGrid() {
            // Remove old layers
            for (let i = 0; i < layers.length; i++) {
                map.removeLayer(layers[i]);

                if (i == layers.length) {
                    layers = []; //reset
                }
            }

            // The maxValue is used to determine how big the circle icon will be. You can scale based on a percentage of maxValue to determine the circle icon size!
            let maxValue = 1;
            const buildStrategies = () => {
                // Get the max value of SSDecadeStore!
                for (let i = 0; i < swdata.strategies.rows?.length; i++) {
                    if (swdata.strategies.rows[i][`SS${$decadeStore}`] > maxValue) {
                        maxValue = swdata.strategies.rows[i][`SS${$decadeStore}`];
                    }
                }
                let totalEntity = swdata.strategies.rows


                /**
                 * Step4 for strategies
                 * Add the entities!
                 */
                totalEntity?.forEach(async (item) => {
                    if (
                        item.SourceType == "DIRECT REUSE" ||
                        item.SourceType == "LOCAL SURFACE WATER SUPPLY" ||
                        item.SourceType == "ATMOSPHERE" ||
                        item.SourceType == "RAINWATER HARVESTING"
                    ) {
                        return;
                    }

                    if (item[`SS${$decadeStore}`] > 0) {
                        // Add the blue aquifer Geojson entities with a popup!
                        if (item.SourceType == "GROUNDWATER" || item.SourceType == "SURFACE WATER") {
                            let mapSource = await fetch(
                                `https://mapserver.tnris.org/?map=/tnris_mapfiles/${sourceTable}&SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&TYPENAMES=PolygonSources&outputformat=geojson&SRSNAME=EPSG:4326&Filter=<Filter><PropertyIsEqualTo><PropertyName>sourceid</PropertyName><Literal>${item.MapSourceId}</Literal></PropertyIsEqualTo></Filter>`);
                            let text = await mapSource.text();

                            let gj = L.geoJson(JSON.parse(text), {
                                style: {
                                    color: "#3F556D",
                                    opacity: 1,
                                    weight: 4,
                                    fillOpacity: 0.3,
                                },
                                pane: "geom",
                            });
                            gj.bindPopup(
                                `<h3>${item.SourceName}</h3><p><a href="/source/${item.MapSourceId}">View Source Page</a></p>`,
                            );
                            gj.addTo(map);
                            layers.push(gj);
                        }

                        // Add the blue circle entites with a popup!
                        let radius = scaleTonew(
                            item[`SS${$decadeStore}`],
                            maxValue,
                            constants.MAX_RADIUS,
                        );
                        const markerOpts = {
                            radius,
                            className: `entity-marker-strategies`,
                            pane: "labels",
                        };
                        const marker = L.circleMarker(
                            [item.Latitude, item.Longitude],
                            markerOpts,
                        );
                        marker
                            .bindPopup(
                                `<h3>${item.EntityName}</h3>
                    <p>Total Value: ${item[`SS${$decadeStore}`]}</p>
                    <p><a href="/entity/${
                        item.EntityId
                    }">View Entity Page</a></p>`,
                            )
                            .openPopup();
                        spiderfier.addMarker(marker);
                        marker.addTo(map);
                        layers.push(marker);
                    }
                });

                /* Add the red triangle Projects! */
                swdata.projects.forEach((item) => {
                    if (item.OnlineDecade <= $decadeStore) {
                        const marker = L.marker(
                            [item.LatCoord, item.LongCoord],
                            {
                                icon: triangle_icon,
                                pane: "project_labels",
                            },
                        );

                        marker
                            .bindPopup(
                                `<h3>${item.ProjectName}</h3>
                    <p>Decade Online: ${item.OnlineDecade}</p>
                    <p>Sponsor: ${item.ProjectSponsors}</p>
                    <p>Capital Cost: ${usd_format.format(item.CapitalCost)}</p>
                    <p><a href="/project/${
                        item.WmsProjectId
                    }">View Project Page</a></p>`,
                            )
                            .openPopup();
                        spiderfier.addMarker(marker);

                        marker.addTo(map);
                        layers.push(marker);
                    }
                });
            };

            const buildNeeds = async () => {
                let totalEntity = [];
                // Compress entities on EntityID. Combine needs data!
                swdata.needs.rows.forEach((item) => {
                    const last = totalEntity[totalEntity.length - 1];
                    const ENT_EXISTS = !(last?.EntityId !== item.EntityId);

                    if(!ENT_EXISTS) {
                        totalEntity.push({... item});
                    } else {
                        last[`N${$decadeStore}`] += item[`N${$decadeStore}`]
                    }
                });
                objLeftjoin(totalEntity, swdata.demands.rows, ["EntityId"]);

                // Join needs with supplies in order to calculate percentage fulfilled efficiently!
                let perc_needs = JSON.parse(JSON.stringify(totalEntity));
                objLeftjoin(perc_needs, totalEntity, ["EntityId"]);

                for (let i = 0; i < perc_needs.length; i++) {
                    if (perc_needs[i][`N${$decadeStore}`] > maxValue) {
                        maxValue = perc_needs[i][`N${$decadeStore}`];
                    }
                }
                perc_needs.forEach(async (item) => {
                    if (
                        item.SourceType == "DIRECT REUSE" ||
                        item.SourceType == "LOCAL SURFACE WATER SUPPLY" ||
                        item.SourceType == "ATMOSPHERE" ||
                        item.SourceType == "RAINWATER HARVESTING"
                    ) {
                        return;
                    }

                    if (item[`N${$decadeStore}`] > 0) {

                        // Add the blue circle entites with a popup!
                        let radius = scaleTonew(
                            item[`N${$decadeStore}`],
                            maxValue,
                            constants.MAX_RADIUS,
                        );
                        const markerOpts = {
                            radius,
                            className: `entity-marker-needs`,
                            pane: "labels",
                        };
                        const marker = L.circleMarker(
                            [item.Latitude, item.Longitude],
                            markerOpts,
                        );

                        let percentage = Math.round((item[`N${$decadeStore}`] / item[`D${$decadeStore}`]) * 100);

                        marker
                            .bindPopup(
                                `<h3>${item.EntityName}</h3>
                    <p>Total Value: ${commafy(JSON.stringify(item[`N${$decadeStore}`]))}</p>
                    <p><a href="/entity/${
                        item.EntityId
                    }">View Entity Page</a></p>`,
                            )
                            .openPopup();
                        spiderfier.addMarker(marker);

                        marker.addTo(map);

                        let fillColor = '#84D68C'
                        if(percentage < 10) {
                            fillColor = '#84D68C';
                        } else if(percentage < 25) {
                            fillColor = '#FFFFBF';
                        } else if(percentage < 50) {
                            fillColor = '#FDAE61';
                        } else {
                            fillColor = 'rgb(237, 27, 47)';
                        }
                        marker.setStyle({fillColor: fillColor})

                        layers.push(marker);
                    }
                });
/*
                const Legend = L.control.Legend({
                    position: "bottomleft",
                    legends: [{
                        label: "Marker1",
                        type: "circle"
                    }]
                }).addTo(map);
                layers.push(Legend);
                */
            };


            const buildSupplies = () => {
                let totalEntity = [];
                // Compress entities on EntityID. Combine supplies data!
                swdata.supplies.rows.forEach((item) => {
                    const last = totalEntity[totalEntity.length - 1];
                    const ENT_EXISTS = !(last?.EntityId !== item.EntityId);

                    if(!ENT_EXISTS) {
                        totalEntity.push({... item});
                    } else {
                        last[`WS${$decadeStore}`] += item[`WS${$decadeStore}`]
                    }
                });
                /**
                 * Step4 for supplies
                 * Add the entities!
                 */
                swdata.supplies.rows.forEach(async (item) => {
                    let sources = "PolygonSources";
                    let color = "#526e8d";

                    if(item.SourceName !== "DIRECT REUSE" && item.SourceName !== "LOCAL SURFACE WATER SUPPLY" && item.SourceName !== "ATMOSPHERE" && item.SourceName !== "Rainwater Harvesting") {
                        if(item.SourceName.includes("RIVER")) {
                            sources = "LineSources";
                            color = "#0097d6";
                        } else if(item.SourceName.includes("RESERVOIR")) {
                            color = "#0097d6";
                        }
                        sources = "LineSources";
                        let mapSource = await fetch(
                            `https://mapserver.tnris.org/?map=/tnris_mapfiles/${sourceTable}&SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&TYPENAMES=${sources}&outputformat=geojson&SRSNAME=EPSG:4326&Filter=<Filter><PropertyIsEqualTo><PropertyName>sourceid</PropertyName><Literal>${item.MapSourceId}</Literal></PropertyIsEqualTo></Filter>`);
                        let text = await mapSource.text();
                        let j = JSON.parse(text);
                        if(j.numberMatched <= 0) { // Try a polygon source then.
                            sources = "PolygonSources";
                            mapSource = await fetch(
                                `https://mapserver.tnris.org/?map=/tnris_mapfiles/${sourceTable}&SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&TYPENAMES=${sources}&outputformat=geojson&SRSNAME=EPSG:4326&Filter=<Filter><PropertyIsEqualTo><PropertyName>sourceid</PropertyName><Literal>${item.MapSourceId}</Literal></PropertyIsEqualTo></Filter>`);

                            text = await mapSource.text();
                            j = JSON.parse(text);
                        }
                        // After Trying Lines and Polygons push whatever we got.
                        let gj = L.geoJson(j, {
                            style: {
                                color,
                                opacity: 1,
                                weight: 2,
                                fillOpacity: .4,
                            },
                            pane: "geom",
                        });
                        gj.bindPopup(
                            `<h3>${item.SourceName}</h3><p><a href="/source/${item.MapSourceId}">View Source Page</a></p>`,
                        );
                        gj.addTo(map);
                        layers.push(gj);
                    } else {
                        console.log(item.SourceName)
                    }
                });

                totalEntity.forEach((item) => {
                    for (let i = 0; i < swdata.supplies.rows.length; i++) {
                        if (swdata.supplies.rows[i][`WS${$decadeStore}`] > maxValue) {
                            maxValue = swdata.supplies.rows[i][`WS${$decadeStore}`];
                        }
                    }

                    if (
                        item.SourceType == "DIRECT REUSE" ||
                        item.SourceType == "LOCAL SURFACE WATER SUPPLY" ||
                        item.SourceType == "ATMOSPHERE" ||
                        item.SourceType == "RAINWATER HARVESTING"
                    ) {
                        return;
                    }

                    if (item[`WS${$decadeStore}`] > 0) {
                        // Add the grey circle entites with a popup!
                        let radius = scaleTonew(
                            item[`WS${$decadeStore}`],
                            maxValue,
                            constants.MAX_RADIUS,
                        );
                        const markerOpts = {
                            radius,
                            className: `entity-marker-supplies`,
                            pane: "labels",
                        };
                        const marker = L.circleMarker(
                            [item.Latitude, item.Longitude],
                            markerOpts,
                        );
                        marker
                            .bindPopup(
                                `<h3>${item.EntityName}</h3>
                    <p>Total Value: ${item[`WS${$decadeStore}`]}</p>
                    <p><a href="/entity/${
                        item.EntityId
                    }">View Entity Page</a></p>`,
                            )
                            .openPopup();
                            spiderfier.addMarker(marker);

                        marker.addTo(map);
                        marker.setStyle({fillColor: "grey"})

                        layers.push(marker);
                    }
                })
            };

            const buildDemands = () => {
                let totalEntity = [];
                // Compress entities on EntityID. Combine supplies data!
                swdata.demands.rows.forEach((item) => {
                    const last = totalEntity[totalEntity.length - 1];
                    const ENT_EXISTS = !(last?.EntityId !== item.EntityId);

                    if(!ENT_EXISTS) {
                        totalEntity.push({... item});
                    } else {
                        last[`D${$decadeStore}`] += item[`D${$decadeStore}`]
                    }
                });

                /**
                 * Step4 for demands
                 * Add the entities!
                 */
                 totalEntity.forEach(async (item) => {
                    for (let i = 0; i < totalEntity.length; i++) {
                        if (totalEntity[i][`D${$decadeStore}`] > maxValue) {
                            maxValue = totalEntity[i][`D${$decadeStore}`];
                        }
                    }

                    if (item[`D${$decadeStore}`] > 0) {
                        let radius = scaleTonew(
                            item[`D${$decadeStore}`],
                            maxValue,
                            constants.MAX_RADIUS,
                        );
                        const markerOpts = {
                            radius,
                            pane: "labels",
                        };
                        const marker = L.circleMarker(
                            [item.Latitude, item.Longitude],
                            markerOpts,
                        );
                        marker.setStyle({
                            fillColor: "purple",
                            opacity: 1,
                            fillOpacity: 1,
                            weight: 1,
                            color: "black"
                        })

                        marker
                            .bindPopup(
                                `<h3>${item.EntityName}</h3>
                    <p>Total Value: ${item[`D${$decadeStore}`]}</p>
                    <p><a href="/entity/${
                        item.EntityId
                    }">View Entity Page</a></p>`,
                            )
                            .openPopup();
                            spiderfier.addMarker(marker);

                        marker.addTo(map);
                        layers.push(marker);
                    }
                });
            };

            const buildPopulation = () => {

                let totalEntity = [];

                // Compress entities on EntityID. Combine population data!
                swdata.population.rows.forEach((item) => {
                    const last = totalEntity[totalEntity.length - 1];
                    const ENT_EXISTS = !(last?.EntityId !== item.EntityId);

                    if(!ENT_EXISTS) {
                        totalEntity.push({... item});
                    } else {
                        last[`P${$decadeStore}`] += item[`P${$decadeStore}`]
                    }
                });

                /**
                 * Step4: For population
                 * Add the entities for population!
                 */
                 totalEntity.forEach(async (item) => {
                    for (let i = 0; i < totalEntity.length; i++) {
                        if (totalEntity[i][`P${$decadeStore}`] > maxValue) {
                            maxValue = totalEntity[i][`P${$decadeStore}`];
                        }
                    }

                    if (item[`P${$decadeStore}`] > 0) {
                        let radius = scaleTonew(
                            item[`P${$decadeStore}`],
                            maxValue,
                            constants.MAX_RADIUS,
                        );
                        const markerOpts = {
                            radius,
                            pane: "labels",
                        };
                        const marker = L.circleMarker(
                            [item.Latitude, item.Longitude],
                            markerOpts,
                        );
                        marker.setStyle({fillColor: "orange", opacity: 1, fillOpacity: 1, weight: 1, color: "black"})

                        marker
                            .bindPopup(
                                `<h3>${item.EntityName}</h3>
                    <p>Total Value: ${item[`P${$decadeStore}`]}</p>
                    <p><a href="/entity/${
                        item.EntityId
                    }">View Entity Page</a></p>`,
                            )
                            .openPopup();
                            spiderfier.addMarker(marker);

                        marker.addTo(map);
                        layers.push(marker);
                    }
                });
            };

            const buildProjects = () => {
                /* Add the red triangle Projects! */
                swdata.projects.forEach((item) => {
                    if (item.OnlineDecade <= $decadeStore) {
                        const marker = L.marker(
                            [item.EntityLatCoord, item.EntityLongCoord],
                            {
                                icon: triangle_icon,
                                pane: "project_labels",
                            },
                        );

                        marker
                            .bindPopup(
                                `<h3>${item.ProjectName}</h3>
                    <p>Decade Online: ${item.OnlineDecade}</p>
                    <p>Sponsor: ${item.ProjectSponsors}</p>
                    <p>Capital Cost: ${usd_format.format(item.CapitalCost)}</p>
                    <p><a href="/project/${
                        item.WmsProjectId
                    }">View Project Page</a></p>`,
                            )
                            .openPopup();
                            spiderfier.addMarker(marker);

                        marker.addTo(map);
                        layers.push(marker);

                        const markerOpts = {
                            radius: 6,
                            pane: "labels",
                        };
                        let cmarker = L.circleMarker(
                            [item.EntityLatCoord, item.EntityLongCoord],
                            markerOpts,
                        );
                        cmarker.setStyle({fillColor: "green", opacity: 1, fillOpacity: 1, weight: 1, color: "black"})

                        cmarker
                            .bindPopup(
                                `<h3>${item.EntityName}</h3>
                    <p>Total Value: ${item[`P${$decadeStore}`]}</p>
                    <p><a href="/entity/${
                        item.EntityId
                    }">View Entity Page</a></p>`,
                            )
                            .openPopup();
                            spiderfier.addMarker(cmarker);

                        cmarker.addTo(map);
                        layers.push(cmarker);

                    }
                });
            };

            if ($themeStore === "strategies") {
                buildStrategies();
            } else if ($themeStore === "needs") {
                buildNeeds();
            } else if($themeStore === "supplies") {
                buildSupplies();
            } else if($themeStore === "demands") {
                buildDemands();
            } else if($themeStore === "population") {
                buildPopulation();
            } else if($themeStore === "projects") {
                buildProjects();
            }
        }

        buildGrid();

        dataviewContext.buildEntMap.set(buildGrid);
    });

</script>

<div class="row panel-row">
    <span class="view-name">{title}</span>
    {#if type == "pop"}
    <h4>Water User Groups - {$decadeStore} - {theme_titles["population"]}<span class="units">(acre-feet/year)</span></h4>
    {:else}
    <h4>Water User Groups - {$decadeStore} - {theme_titles[$themeStore]}<span class="units">(acre-feet/year)</span></h4>
    {/if}
    <div class="twelve columns">
        <div id="entity_map" style="width:100%; top:0;">

            
        </div>
        
        <span>{@html entityMapBlurb}</span>
    </div>
</div>

<style>
    #entity_map {
        height: 400px;
    }
</style>
