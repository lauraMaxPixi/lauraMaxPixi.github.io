let myMap = L.map("map", {
fullscreenControl: true,
});

let HotSpotGroup = L.featureGroup().addTo(myMap);
let kapfererGroup = L.featureGroup().addTo(myMap);
let korakGroup = L.featureGroup().addTo(myMap);
let ebnerGroup = L.featureGroup().addTo(myMap);
let steixnerGroup = L.featureGroup().addTo(myMap);
let pixnerGroup = L.featureGroup().addTo(myMap);


//let steigung = L.featureGroup().addTo(myMap);


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
        bmapoverlay: L.tileLayer(
        "https://{s}.wien.gv.at/basemap/bmapoverlay/normal/google3857/{z}/{y}/{x}.png", {
            subdomains: ["maps", "maps1", "maps2", "maps3", "maps4"],
            attribution: "Datenquelle: <a href='https://www.basemap.at'>basemap.at</a>"
        }
    ),
    bmapgrau: L.tileLayer(
        "https://{s}.wien.gv.at/basemap/bmapgrau/normal/google3857/{z}/{y}/{x}.png", {
            subdomains: ["maps", "maps1", "maps2", "maps3", "maps4"],
            attribution: "Datenquelle: <a href='https://www.basemap.at'>basemap.at</a>"
        }
    ),
    
};

myMap.addLayer(myLayers.osm);



let myMapControl = L.control.layers({

    "Openstreetmap": myLayers.osm,
    "Basemap": myLayers.geolandbasemap,
    "Basemap Grau": myLayers.bmapgrau,
    "basemap.at Orthofoto": myLayers.bmaporthofoto30cm,
    
}, {
    "Beschriftung": myLayers.bmapoverlay,
    "Thermik-Hotspots": HotSpotGroup,
    "Track Pixner": pixnerGroup,
    //"Track Kapferer": kapfererGroup,
    "Track Korak": korakGroup,
    "Track Ebner": ebnerGroup,
    "Track Steixner": steixnerGroup,
 // "Höhenprofil": heightProfile,
    });

myMap.addControl(myMapControl);


myMap.setView([47.3, 11.4], 10);

myMapControl.expand();

L.control.scale({
    maxWidth: 200,
    metric: true,
    imperial: false,
    position: "bottomleft"

}).addTo(myMap);



 //-> Funktioniert nur mit GPX wie bei biketirol...
//Höhenprofil definieren und style festlegen: 

/*let profil = L.control.elevation(
    {
        position: "bottomright",
        theme: "steelblue-theme",
        collapsed: true, //lässt das Profil aus und einschalten
    });
profil.addTo(myMap); 
*/


/* let kapfererTrack = L.geoJSON(kapfererData, {
    color: "white"
}).addTo(kapfererGroup); */

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


//Pixi's solution
let heightProfile = L.control.elevation({
    position: "bottomright",
  theme: "steelblue-theme", //default: lime-theme
  width: 600,
  height: 160,
  margins: {
      top: 10,
      right: 20,
      bottom: 30,
      left: 50
  },
  useHeightIndicator: true, //if false a marker is drawn at map position
  interpolation: "linear", //see https://github.com/mbostock/d3/wiki/SVG-Shapes#wiki-area_interpolate
  hoverNumber: {
      decimalsX: 3, //decimals on distance (always in km)
      decimalsY: 0, //deciamls on hehttps://www.npmjs.com/package/leaflet.coordinatesight (always in m)
      formatter: undefined //custom formatter function may be injected
  },
  xTicks: undefined, //number of ticks in x axis, calculated by default according to width
  yTicks: undefined, //number of ticks on y axis, calculated by default according to height
  collapsed: true,  //collapsed mode, show chart on click or mouseover
  imperial: false    //display imperial units instead of metric
});

heightProfile.addTo(myMap);

let pixnerEle = L.geoJSON(pixnerData,{
    onEachFeature: heightProfile.addData.bind(heightProfile)   
}).addTo(myMap);


//Thermik Hotspots 
let HotSpots = L.geoJSON(HotSpotData, {
    color: "green",
}).addTo(HotSpotGroup);


/*
let steixnerEle = L.geoJSON(steixnerData,{
    onEachFeature: heightProfile.addData.bind(heightProfile)   
}).addTo(myMap);
*/

/*
let profil = L.control.elevation(
    {
        position: "bottomright",
        theme: "steelblue-theme",
        collapsed: true, //lässt das Profil aus und einschalten
    });
profil.addTo(myMap); 
*/




//coordinates versuch
/*
let coordControls = new L.Control.Coordinates().addTo(myMap); // you can send options to the constructor if you want to, otherwise default values are used

coordControls.addTo(myMap);

myMap.on('click', function(e) {
	c.setCoordinates(e);
});
*/

/*
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
	customLabelFcn: function(latLonObj, opts) { "Geohash: " + encodeGeoHash(latLonObj.lat, latLonObj.lng)} //optional default none 
}).addTo(myMap);
*/


