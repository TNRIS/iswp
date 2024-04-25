<script>
    import { getContext, onMount } from "svelte";
    import { scaleTonew, usd_format, objLeftjoin, commafy } from "$lib/helper";
    import { hoverHelper, clearInteraction } from "$lib/actions/HoverAction";
    import {runOMS} from "$lib/leaflet.oms.js";

    const countyTable = "county_extended";
    const regionTable = "rwpas";
    const { title, swdata, constants, type, entityMapBlurb } = $$props;
    const DECADES = constants.getDecades();
    const sourceTable = constants.sourcemap;
    const dataviewContext = getContext("dataviewContext");
    const decadeStore = getContext("myContext").decadeStore;
    const themeStore = getContext("myContext").themeStore;

    const titles = constants.chosenTitles;

    const theme_titles = constants.getThemeTitles();
    let layers = [];
    let spiderfier;
    let switch_unlocked = true;

    const compress = (rows, ID) => {
        let total = [];
        // Compress
        rows.forEach((item) => {
            const last = total[total.length - 1];
            const ENT_EXISTS = !(last?.EntityId !== item.EntityId);

            if(!ENT_EXISTS) {
                total.push({... item});
            } else {
                last[`${ID}${$decadeStore}`] += item[`${ID}${$decadeStore}`]
            }
        });

        return total;
    }

    const makeEntityPopup = (item, ID) => {
        return `<h3>${item.EntityName}</h3>`
            + `<p>Total Value: ${commafy(item[`${ID}${$decadeStore}`] + "")}</p>`
            + `<p><a href="/entity/${
                item.EntityId
            }">View Entity Page</a></p>`;
    }

    const makeMarker = (item, ID, maxValue, class_name="") => {
        // Add the blue circle entites
        let radius = scaleTonew(
            item[`${ID}${$decadeStore}`],
            maxValue,
            constants.MAX_RADIUS
        );
        const markerOpts = {
            radius,
            className: class_name,
            pane: "labels"
        };
        return L.circleMarker(
            [item.Latitude, item.Longitude],
            markerOpts
        );
    }

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
        let cb = (fc) => {
            /* If there are GeoJson features then fitbounds to them. Otherwise move on. */
            if(fc.features.length) {
                let gj = L.geoJson(fc);
                //map.fitBounds(gj.getBounds());
            }
        }

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
                <p>Total Value: ${commafy(props.ValueSum + "")}</p>
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


        L.easyButton({
            position: 'topright',
            states: [{
                stateName: 'unlocked',
                title: 'Lock',
                icon: 'icon-texas',
                onClick: (btn /*, map*/) => {
                    map.setView([31, -100], 5)
                }
            }]
        }).addTo(map);

        const toggleLockButton = L.easyButton({
            position: 'topright',
            states: [{
                stateName: 'unlocked',
                title: 'Lock',
                icon: 'icon-unlocked',
                onClick: (btn ) => {
                    btn.state('locked');
                    switch_unlocked = false;
                }
            }, {
                stateName: 'locked',
                title: 'Unlock',
                icon: 'icon-locked',
                onClick: (btn ) => {
                    btn.state('unlocked');
                    switch_unlocked = true;

                }
            }]
        });
        toggleLockButton.addTo(map)

        //map.fitBounds(TEXAS);
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
        let table;
        let region;
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
            region = L.geoJson(JSON.parse(region_geo_json), {
                interactive: false,
                style: {
                    color: "#cc9200",
                    fillOpacity: 0.1,
                },
            });
            region.addTo(map);
        }

        async function buildGrid() {
            // Remove old layers
            for (let i = 0; i < layers.length; i++) {
                map.removeLayer(layers[i]);

                if(layers[i].onAdd) {
                    layers[i].remove()
                }

                if (i == layers.length) {
                    layers = []; //reset
                }
            }

            // The maxValue is used to determine how big the circle icon will be. You can scale based on a percentage of maxValue to determine the circle icon size!
            let maxValue = 1;
            const buildStrategies = () => {
                let counter = 0;
                let feat_coll = {"type":"FeatureCollection","numberMatched":0,"name":"AllSources","features":[]}

                // Get the max value of SSDecadeStore!
                for (let i = 0; i < swdata.strategies.rows?.length; i++) {
                    if (swdata.strategies.rows[i][`SS${$decadeStore}`] > maxValue) {
                        maxValue = swdata.strategies.rows[i][`SS${$decadeStore}`];
                    }
                }

                /** Store unique Entity Names. @type {string[]} */
                let ename_store = [];
                let totalEntity = swdata.strategies.rows.reduce((
                    /** @type {any[]}*/ accumulator , /** @type {object} */ currentValue) => {
                    if(!ename_store.includes(currentValue.EntityName)) {
                        ename_store.push(currentValue.EntityName);
                        accumulator.push(currentValue);
                    }
                    else {
                        let obj = accumulator.find((e) => e.EntityName === currentValue.EntityName)
                        // Loop through constant of years, with "SS in front then add the values."

                        DECADES.forEach((decade) => {
                            obj[`SS${decade}`] += currentValue[`SS${decade}`];
                        })
                    }

                    return accumulator;
                }, []);

                /**
                 * Step4 for strategies
                 * Add the entities!
                 */
                let lats = [];
                let lngs = [];

                totalEntity?.forEach(async (item, i, ar) => {
                    if (
                        item.SourceType == "DIRECT REUSE" ||
                        item.SourceType == "LOCAL SURFACE WATER SUPPLY" ||
                        item.SourceType == "ATMOSPHERE" ||
                        item.SourceType == "RAINWATER HARVESTING" ||
                        item.SourceName == "ATMOSPHERE"
                    ) {
                        return;
                    }
                    lats.push(item.Latitude);
                    lngs.push(item.Longitude);

                    if (item[`SS${$decadeStore}`] > 0) {
                        // Add the blue aquifer Geojson entities with a popup!
                        if (item.SourceType == "GROUNDWATER" || item.SourceType == "SURFACE WATER") {

                            let mapSource = await fetch(
                                `https://mapserver.tnris.org/?map=/tnris_mapfiles/${sourceTable}&SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&TYPENAMES=PolygonSources&outputformat=geojson&SRSNAME=EPSG:4326&Filter=<Filter><PropertyIsEqualTo><PropertyName>sourceid</PropertyName><Literal>${item.MapSourceId}</Literal></PropertyIsEqualTo></Filter>`);
                            let text = await mapSource.text();
                            let j = JSON.parse(text);
                            let gj = L.geoJson(j, {
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
                            gj.on("mousemove", (event) => {
                                //let name = item.feature.properties.name;
                                const me = event.originalEvent;
                                hoverHelper(me, "map-entity-hover", item.SourceName);
                            })
                            gj.on("mouseout", (event) => {
                                clearInteraction("map-entity-hover");
                            })
                            gj.addTo(map);

                            
                            layers.push(gj);
                            counter++;

                            if(switch_unlocked) {
                                feat_coll.features.push(... j.features)
                            }

                        } else {
                            counter++;
                        }
                        const marker = makeMarker(item, "SS", maxValue, "entity-marker-strategies")
                        marker.bindPopup(makeEntityPopup(item, "SS")).openPopup();
                        spiderfier.addMarker(marker);
                        marker.addTo(map);
                        layers.push(marker);
                    } else {
                        counter ++;
                    }

                    // Upon completion of loop run cb.
                    if(switch_unlocked && counter >= ar.length) {
                        cb(feat_coll);
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

                // calc the min and max lng and lat
                let minlat = Math.min.apply(null, lats);
                let maxlat = Math.max.apply(null, lats);
                let minlng = Math.min.apply(null, lngs);
                let maxlng = Math.max.apply(null, lngs);

                let rbounds;
                // Expand bounding box to encompass region if needed. 
                if(region) {
                    rbounds = region.getBounds();
                    minlat = rbounds._southWest.lat < minlat ? rbounds._southWest.lat : minlat;
                    minlng = rbounds._southWest.lng < minlng ? rbounds._southWest.lng : minlng;

                    maxlat = rbounds._northEast.lat > maxlat ? rbounds._northEast.lat : maxlat;
                    maxlng = rbounds._northEast.lng > maxlng ? rbounds._northEast.lng : maxlng;
                }
                if(switch_unlocked)
                    map.fitBounds([[minlat,minlng],[maxlat,maxlng]]);
            };

            const buildNeeds = async () => {
                let totalEntity = compress(swdata.needs.rows, "N");
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
                        const marker = makeMarker(item, "N", maxValue)

                        let percentage = Math.round((item[`N${$decadeStore}`] / item[`D${$decadeStore}`]) * 100);

                        marker.bindPopup(makeEntityPopup(item, "N")).openPopup();
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

                
                var legend = L.control({position: 'bottomleft'});
                var div = L.DomUtil.create('div', 'info legend');

                legend.onAdd = function () {
                    let legenditems = [
                        {
                            text: "Greater than 50%",
                            color: "rgb(237, 27, 47)"
                            
                        }, {
                            text: "Greater than 25%",
                            color: "#FDAE61"
                        }, 
                        {
                            text: "Greater than 10%",
                            color: "#FFFFBF"
                        },
                        {
                            text: "Less than 10%",
                            color: "#84D68C"
                        }
                    ];
                    let ih = `<div class=" leaflet-left">
                            <div class="leaflet-legend legend-needs leaflet-control">
                                <h4 class="">Potential shortage<br>(as share of total demand)</h4>
                                <p class="">*Zero needs not displayed</p>
                            <ul>`
                    
                    // Regular for loop
                    legenditems.forEach((label) => {
                        ih += `<li class="legend-entry">
                            <svg height="8" width="8">
                                <circle cx="4" cy="4" r="4" stroke="black" stroke-width="1" fill="${label.color}">
                                </circle>
                            </svg> ${label.text}
                        </li>`
                    })
                    ih += `</ul></div></div>`;
                    

                    div.innerHTML = ih;
                    return div;
                }
                legend.addTo(map)
                layers.push(legend)
            };

            const buildSupplies = () => {
                let totalEntity = compress(swdata.supplies.rows, "WS");

                /**
                 * Step4 for supplies
                 * Add the entities!
                 */
                let feat_coll = {"type":"FeatureCollection","numberMatched":0,"name":"AllSources","features":[]}
                let counter = true;

                let lats = [];
                let lngs = [];

                swdata.supplies.rows.forEach(async (item, index, ar) => {
                    let sources = "PolygonSources";
                    let color = "#526e8d";
                    lats.push(item.Latitude);
                    lngs.push(item.Longitude);

                    if(item.SourceName !== "DIRECT REUSE" && item.SourceName !== "LOCAL SURFACE WATER SUPPLY" && item.SourceName !== "ATMOSPHERE" && item.SourceName !== "Rainwater Harvesting") {
                        if(item.SourceName.includes("RIVER")) {
                            sources = "LineSources";
                            color = "#0097d6";
                        } else if(item.SourceName.includes("RESERVOIR")) {
                            color = "#0097d6";
                        }
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
                        counter++;

                        if(switch_unlocked) {
                            feat_coll.features.push(... j.features)
                            if(counter > ar.length) {
                                cb(feat_coll);
                            }
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

                        let gBounds = gj.getBounds();
                        lats.push(gBounds._northEast.lat);
                        lats.push(gBounds._southWest.lat);
                        lngs.push(gBounds._northEast.lng);
                        lngs.push(gBounds._southWest.lng);

                        gj.bindPopup(
                            `<h3>${item.SourceName}</h3><p><a href="/source/${item.MapSourceId}">View Source Page</a></p>`,
                        );

                        gj.on("mousemove", (event) => {
                            //let name = item.feature.properties.name;
                            const me = event.originalEvent;
                            hoverHelper(me, "map-entity-hover", item.SourceName);
                        })
                        gj.on("mouseout", (event) => {
                            clearInteraction("map-entity-hover");
                        })
                        gj.addTo(map);
                        layers.push(gj);
                    } else {
                        counter++;
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

                        const marker = makeMarker(item, "WS", maxValue, "entity-marker-supplies");
                        marker.bindPopup(makeEntityPopup(item, "WS")).openPopup();
                        
                        spiderfier.addMarker(marker);
                        marker.addTo(map);
                        marker.setStyle({fillColor: "grey"})

                        layers.push(marker);
                    }
                })

                // calc the min and max lng and lat

                // Expand bounding box to encompass region if needed. 
                if(region) {
                    rbounds = region.getBounds();
                    /*minlat = rbounds._southWest.lat < minlat ? rbounds._southWest.lat : minlat;
                    minlng = rbounds._southWest.lng < minlng ? rbounds._southWest.lng : minlng;

                    maxlat = rbounds._northEast.lat > maxlat ? rbounds._northEast.lat : maxlat;
                    maxlng = rbounds._northEast.lng > maxlng ? rbounds._northEast.lng : maxlng;
                    */
                   lats.push(rbounds._southWest.lat);
                   lats.push(rbounds._northEast.lat);
                   lngs.push(rbounds._southWest.lng);
                   lngs.push(rbounds._northEast.lng);
                }
                let minlat = Math.min.apply(null, lats);
                let maxlat = Math.max.apply(null, lats);
                let minlng = Math.min.apply(null, lngs);
                let maxlng = Math.max.apply(null, lngs);

                let rbounds;

                if(switch_unlocked)
                    map.fitBounds([[minlat,minlng],[maxlat,maxlng]]);

            };

            const buildDemands = () => {
                let totalEntity = compress(swdata.demands.rows, "D");

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
                        const marker = makeMarker(item, "D", maxValue);

                        marker.setStyle({
                            fillColor: "purple",
                            opacity: 1,
                            fillOpacity: 1,
                            weight: 1,
                            color: "black"
                        })

                        marker.bindPopup(makeEntityPopup(item, "D")).openPopup();
                        spiderfier.addMarker(marker);
                        marker.addTo(map);
                        layers.push(marker);
                    }
                });
            };

            const buildPopulation = () => {
                let totalEntity = compress(swdata.population.rows, "P");

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
                        const marker = makeMarker(item, "P", maxValue);
                        marker.setStyle({fillColor: "orange", opacity: 1, fillOpacity: 1, weight: 1, color: "black"})

                        marker.bindPopup(makeEntityPopup(item, "P")).openPopup();
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
                        cmarker.bindPopup(makeEntityPopup(item, "P")).openPopup();
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
    <!-- Only project has type pop because it has an entity map with population only. -->
    {#if type == "pop"}
    <span class="view-name">{title}</span>
    <h4>Water User Groups - {$decadeStore} - {theme_titles["population"]} Benefiting</h4>
    {:else}
    <span class="view-name">{title}</span>
    <h4>Water User Groups - {$decadeStore} - {theme_titles[$themeStore]}
    {#if $themeStore === "population"}
    <span class="units">(people)</span>
    {:else}
    <span class="units">(acre-feet/year)</span>
    {/if}
    </h4>
    {/if}
    <div class="twelve columns">
        <div id="entity_map" style="width:100%; top:0;">
            <div id="map-entity-hover-tooltip" />
        </div>
        
        <span>{@html entityMapBlurb}</span>
        {#if $themeStore === "strategies"}
        <p class="note">Red triangles indicate capital projects associated with strategy supplies that have been assigned to a Water User Group.<a class="pointerHover">Hide Projects</a></p>
        {/if}
    </div>
</div>

<style>
    #entity_map {
        height: 400px;
    }
</style>
