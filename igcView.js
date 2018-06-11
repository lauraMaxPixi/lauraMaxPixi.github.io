let myMap = L.map("map", {
    fullscreenControl: true,
});


let korakGroup = L.featureGroup().addTo(myMap);
let ebnerGroup = L.featureGroup().addTo(myMap);
let steixnerGroup = L.featureGroup().addTo(myMap);
let pixnerGroup = L.featureGroup().addTo(myMap);
let markerGroup = L.featureGroup().addTo(myMap);
let steigung = L.featureGroup().addTo(myMap);


const myLayers = {
    osm: L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        subdomains: ["a", "b", "c"],
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    	}
    ),
    geolandbasemap: L.tileLayer(
        "https://{s}.wien.gv.at/basemap/geolandbasemap/normal/google3857/{z}/{y}/{x}.png", {
            subdomains: ["maps", "maps1", "maps2", "maps3", "maps4"],                          
            attribution: "Datenquelle: <a href='https://www.basemap.at'>basemap.at</a>"    
        }
    ),
    bmaporthofoto30cm: L.tileLayer(
        "https://{s}.wien.gv.at/basemap/bmaporthofoto30cm/normal/google3857/{z}/{y}/{x}.jpeg", {
            subdomains: ["maps", "maps1", "maps2", "maps3", "maps4"],
            attribution: "Datenquelle: <a href='https://www.basemap.at'>basemap.at</a>"
        }
    ),
};

myMap.addLayer(myLayers.geolandbasemap);



let myMapControl = L.control.layers({

    "Openstreetmap": myLayers.osm,
    "Basemap": myLayers.geolandbasemap,
    "basemap.at Orthofoto": myLayers.bmaporthofoto30cm,
}, {
    "Track Pixner": pixnerGroup,
    "Track Korak": korakGroup,
    "Track Ebner": ebnerGroup,
    "Track Steixner": steixnerGroup,
       // "Start und Ziel": markerGroup,
        //"Steigung": steigung,

    });

myMap.addControl(myMapControl);






myMap.addLayer(markerGroup);





myMap.setView([47.163884, 11.378995], 11);

myMapControl.expand();

L.control.scale({
    maxWidth: 200,
    metric: true,
    imperial: false,
    position: "bottomleft"

}).addTo(myMap);




//Höhenprofil definieren und style festlegen: 
/* let profil = L.control.elevation(
    {
        position: "bottomright",
        theme: "steelblue-theme",
        collapsed: true, //lässt das Profil aus und einschalten
    });
profil.addTo(myMap); */


let ebnerTrack = L.geoJSON(ebnerData, {
    color: "blue"
}).addTo(ebnerGroup);

let korakTrack = L.geoJSON(korakData, {
    color: "red"
}).addTo(korakGroup);

let steixnerTrack = L.geoJSON(steixnerData, {
    color: "yellow"
}).addTo(steixnerGroup);


let pixnerTrack = L.geoJSON(pixnerData, {
    color: "green",
}).addTo(pixnerGroup);


myMap.fitBounds(pixnerGroup.getBounds());


L.control.coordinates({
	position:"bottomleft", //optional default "bootomright"
	/*decimals:2, //optional default 4
	decimalSeperator:".", //optional default "."
	labelTemplateLat:"Latitude: {y}", //optional default "Lat: {y}"
	labelTemplateLng:"Longitude: {x}", //optional default "Lng: {x}"
	enableUserInput:true, //optional default true
	useDMS:false, //optional default false
	useLatLngOrder: true, //ordering of labels, default false-> lng-lat
	markerType: L.marker, //optional default L.marker
	markerProps: {}, //optional default {},
	labelFormatterLng : funtion(lng){return lng+" lng"}, //optional default none,
	labelFormatterLat : funtion(lat){return lat+" lat"}, //optional default none
	customLabelFcn: function(latLonObj, opts) { "Geohash: " + encodeGeoHash(latLonObj.lat, latLonObj.lng)} //optional default none */
}).addTo(myMap);


