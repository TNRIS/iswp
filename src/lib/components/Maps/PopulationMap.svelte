<!-- Display map layer under population widget. Used on homepage and various other pages TODO: list all here.-->

<script>
    import { onMount } from "svelte";
    const countyTable = 'county_extended';
    const regionTable = 'rwpas';
    const sourceTable = 'iswp_sourcefeatures2022';
    const { title, swdata } = $$props;

	function navigateToRegion({data}) {
		window.location.replace(`/region/${data.letter}`);
	}
    onMount(() => {
        const map = L.map("map", {
            scrollWheelZoom: false,
            zoomControl: false,
            maxZoom: 10,
            minZoom: 2
        });

        L.control.zoom({ position: "topright" }).addTo(map);

		map.fitBounds([[36.5, -106.65], [25.84, -93.51]]);

        const baseLayer = L.tileLayer(
            "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png",
            {
                attribution:
                    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
            }
        )
		map.addLayer(baseLayer);

        // Remove default Prefix
        map.attributionControl.setPrefix('')

        function buildGrid() { 
            const countyurl = `https://mapserver.tnris.org?map=/tnris_mapfiles/${countyTable}.map&mode=tile&tilemode=gmap&tile={x}+{y}+{z}&layers=CountyBoundaries&map.imagetype=png`;
                const countyret = { 
                    tilesUrl: countyurl
                }
                const countyLayer = L.tileLayer(countyret.tilesUrl);
                map.addLayer(countyLayer);

                const countyLabelurl = `https://mapserver.tnris.org?map=/tnris_mapfiles/${countyTable}.map&mode=tile&tilemode=gmap&tile={x}+{y}+{z}&layers=Labels&map.imagetype=png`;
                const countyLabelret = { 
                    tilesUrl: countyLabelurl
                }
                const countyLabelsLayer = L.tileLayer(countyLabelret.tilesUrl);
                map.addLayer(countyLabelsLayer);
        }

        if(window.location.pathname == '/') {
            const url = `https://mapserver.tnris.org?map=/tnris_mapfiles/${regionTable}.map&mode=tile&tilemode=gmap&tile={x}+{y}+{z}&layers=RWPAS&map.imagetype=png`;
            const ret = {
                tilesUrl: url,
                gridUrl: url.replace('png', 'utfgrid')
            };
            map.addLayer(L.tileLayer(ret.tilesUrl));
            let utfGrid = L.utfGrid(ret.gridUrl, {
                useJsonP: false
            });
            map.addLayer(utfGrid);
            utfGrid.on('click', navigateToRegion);

            const labelurl = `https://mapserver.tnris.org?map=/tnris_mapfiles/${regionTable}.map&mode=tile&tilemode=gmap&tile={x}+{y}+{z}&layers=Labels&map.imagetype=png`;
            const labelret = {
                tilesUrl: labelurl
            };
            const regionsLabelsLayer = L.tileLayer(labelret.tilesUrl);
            map.addLayer(regionsLabelsLayer);
        } else {
            let page = window.location.pathname.split('/')[1];
            let key = window.location.pathname.split('/')[2];

            if(page == "region") {
                buildGrid();
                fetch(`https://mapserver.tnris.org/?map=/tnris_mapfiles/${regionTable}.map&SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&TYPENAMES=RWPAS&outputformat=geojson&SRSNAME=EPSG:4326&Filter=<Filter><PropertyIsEqualTo><PropertyName>letter</PropertyName><Literal>${key}</Literal></PropertyIsEqualTo></Filter>`)
                .then(res => res.text())
                .then(body => {
                    let gj = L.geoJson(JSON.parse(body));
                    gj.addTo(map);
                    const center = gj.getBounds().getCenter();
                    map.setView(center, 7);

                });
            } else if (page == "county") {
                buildGrid();
                fetch(`https://mapserver.tnris.org?map=/tnris_mapfiles/${countyTable}.map&SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&TYPENAMES=CountyBoundaries&outputformat=geojson&SRSNAME=EPSG:4326&Filter=<Filter><PropertyIsEqualTo><PropertyName>name</PropertyName><Literal>${key}</Literal></PropertyIsEqualTo></Filter>`)
                .then(res => res.text())
                .then(body => {
                    let gj = L.geoJson(JSON.parse(body));
                    gj.addTo(map);
                    const center = gj.getBounds().getCenter();
                    map.setView(center, 9);
                })
            } else if (page == "entity") {
                buildGrid();
                fetch(`https://mapserver.tnris.org?map=/tnris_mapfiles/${countyTable}.map&SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&TYPENAMES=CountyBoundaries&outputformat=geojson&SRSNAME=EPSG:4326&Filter=<Filter><PropertyIsEqualTo><PropertyName>name</PropertyName><Literal>${key}</Literal></PropertyIsEqualTo></Filter>`)
                .then(res => res.text())
                .then(body => {
                    let gj = L.geoJson(JSON.parse(body));
                    gj.addTo(map);
                    const center = gj.getBounds().getCenter();
                    map.setView(center, 10);
                })
                const entityurl = `https://mapserver.tnris.org?map=/tnris_mapfiles/vwEntityCoordinates.map&mode=tile&tilemode=gmap&tile={x}+{y}+{z}&layers=vwEntity&map.imagetype=png&EntityName=${title}`;

                const entityret = { 
                    tilesUrl: entityurl
                }
                const entityLayer = L.tileLayer(entityret.tilesUrl);
                map.addLayer(entityLayer);
            } else if (page == "source") {
                buildGrid();

                fetch(`https://mapserver.tnris.org/?map=/tnris_mapfiles/${sourceTable}.map&SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&TYPENAMES=AllSources&outputformat=geojson&SRSNAME=EPSG:4326&Filter=<Filter><PropertyIsEqualTo><PropertyName>sourceid</PropertyName><Literal>${key}</Literal></PropertyIsEqualTo></Filter>`)
                .then(res => res.text()).then(res => {
                    let data = JSON.parse(res);
                    const featureTyp = data.features[0].properties.featuretyp;
                    const layerName = featureTyp.charAt(0).toUpperCase() + featureTyp.slice(1);
                    fetch(`https://mapserver.tnris.org/?map=/tnris_mapfiles/${sourceTable}.map&SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&TYPENAMES=${layerName}Sources&outputformat=geojson&SRSNAME=EPSG:4326&Filter=<Filter><PropertyIsEqualTo><PropertyName>sourceid</PropertyName><Literal>${key}</Literal></PropertyIsEqualTo></Filter>`)
                    .then(r => r.text()).then(r => {
                        let gj = L.geoJson(JSON.parse(r));
                        gj.addTo(map);
                        const center = gj.getBounds().getCenter();
                        map.panTo(center);
                    })
                })

                                   
                const entityurl = `https://mapserver.tnris.org?map=/tnris_mapfiles/vwEntityCoordinates.map&mode=tile&tilemode=gmap&tile={x}+{y}+{z}&layers=vwEntity&map.imagetype=png&EntityName=${title}`;
                const entityret = { 
                    tilesUrl: entityurl
                }
                const entityLayer = L.tileLayer(entityret.tilesUrl);
                map.addLayer(entityLayer);
            } else if (page == "project") {
                buildGrid();
                const icon = L.divIcon({
                    className: 'triangle-marker',
                    html: '<div class="triangle-marker-inner"></div>'
                });

                let project = swdata?.projects[0];
                L.marker([project.ProjectLatCoord, project.ProjectLongCoord], {
                    icon
                }).addTo(map)
            }
        }
    });
</script>

<div id="map" style="width:100%; top:0; position:absolute; height:100%;"/>

<style>
    #map {
        height: 180px;
    }
</style>