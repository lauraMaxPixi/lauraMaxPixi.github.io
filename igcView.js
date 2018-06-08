let myMap = L.map("map", {
    fullscreenControl: true,
});


let trackGroup = L.featureGroup();
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
       "Tracks": trackGroup,
        "Start und Ziel": markerGroup,
        "Steigung": steigung,

    });

myMap.addControl(myMapControl);








//#######################

//Popup-Marker für Endpunkt der Etappe: VERSION1
const ende = [47.227615, 11.375384];
let endePopup = `<h3>Ziel: Mutters</h3><a href = 'http://www.mutters.tirol.gv.at'> Weitere Information zu Mutters </a>`
L.marker(ende,
    {
        icon: L.icon({
            iconUrl: 'images/ende.png',
            iconAnchor: [16, 37],
        })
    }).addTo(markerGroup).bindPopup(endePopup);

//Startmarker Mieders VERSION 2
//Die Marker funktionieren nur in google chrome, wieso? 
L.marker([47.163884, 11.378995], {
    icon: L.icon({
        iconUrl: 'images/start.png',
        iconAnchor: [16, 37],
        popupAnchor: [0, -37],
    })
}).bindPopup(
    "<h3>Start: Mieders</h3> <a href = 'http://www.mieders.net'> Weitere Informationen zu Mieders </a>"
).addTo(markerGroup);

myMap.addLayer(markerGroup);





myMap.setView([47.163884, 11.378995], 11);

myMapControl.expand();

L.control.scale({
    maxWidth: 200,
    metric: true,
    imperial: false,
    position: "bottomleft"

}).addTo(myMap);



//Das einzig funktionierende... aber nicht in jedem Browser.
let korakTrack = new L.GPX("data/korak.gpx", {
    async: true,
}).addTo(trackGroup);         //-> würde den Track zum Layer Control dazu fügen, aber ist ja durch steigung schon drinnen


let ebnerTrack = new L.GPX("data/ebner.gpx", {
    async: true,
}).addTo(trackGroup); 


let steixnerTrack = new L.GPX("data/steixner.gpx", {
    async: true,
}).addTo(trackGroup); 

myMap.fitBounds(trackGroup.getBounds());



gpxTrack.on('loaded', function (evt) {
    let track = evt.target;
    /*    console.log("get_distance",      track.get_distance().toFixed(0))
       console.log("get_elevation_min",  track.get_elevation_min().toFixed(0))
       console.log("get_elevation_max",  track.get_elevation_max().toFixed(0))
       console.log("get_elevation_gain", track.get_elevation_gain().toFixed(0))
       console.log("get_elevation_loss", track.get_elevation_loss().toFixed(0))
      */
    myMap.fitBounds(track.getBounds());
});

//Zahlenwerte ausgeben lassen: 
gpxTrack.on("loaded", function (evt) {
    console.log("get_distance", evt.target.get_distance().toFixed(0))
    console.log("get_elevation_max", evt.target.get_elevation_max().toFixed(0))
    console.log("get_elevation_min", evt.target.get_elevation_min().toFixed(0))
    console.log("get_elevation_gain", evt.target.get_elevation_gain().toFixed(0))
    console.log("get_elevation_loss", evt.target.get_elevation_loss().toFixed(0));

    // let laenge =evt.target.get_distance().toFixed(0);

    //document.getElementById("laenge").innerHTML = laenge;

    document.getElementById("get_distance").innerHTML = gpxTrack.get_distance().toFixed(0);

    document.getElementById("get_elevation_min").innerHTML = gpxTrack.get_elevation_min().toFixed(0);

    document.getElementById("get_elevation_max").innerHTML = gpxTrack.get_elevation_max().toFixed(0);

    document.getElementById("get_elevation_gain").innerHTML = gpxTrack.get_elevation_gain().toFixed(0);

    document.getElementById("get_elevation_loss").innerHTML = gpxTrack.get_elevation_loss().toFixed(0);

});


//Höhenprofil definieren und style festlegen: 
let profil = L.control.elevation(
    {
        position: "bottomright",
        theme: "steelblue-theme",
        collapsed: true, //lässt das Profil aus und einschalten
    });
profil.addTo(myMap);


//Linie zu Karte hinzufügen: über console.log wird die Höhe gesucht, die für Steigung gebraucht wird 
gpxTrack.on("addline", function (evt) {
    profil.addData(evt.line);
    console.log(evt.line);
    console.log(evt.line.getLatLngs());
    console.log(evt.line.getLatLngs()[0]);
    console.log(evt.line.getLatLngs()[0].lng);
    console.log(evt.line.getLatLngs()[0].lat);
    console.log(evt.line.getLatLngs()[0].meta);
    console.log(evt.line.getLatLngs()[0].meta.ele);

     //Alle Segmente der Steigungslinie hinzufügen:
     let steigungLinie = evt.line.getLatLngs();
     for (i = 1; i < steigungLinie.length; i++)
     //Schleife für die Erstellung der Linie zw. Punkten, bei i=0 kann keine linie gemacht werden
     {
         let p1 = steigungLinie[i - 1];         //definiert den nullten Punkt als ersten Punkt
         let p2 = steigungLinie[i];          //definiert den aktuellen Punkt als zweiten Punkt
        
         //Berechung der Distanz zwischen Punkten: 
         let distance = myMap.distance(
             [p1.lat, p1.lng],
             [p2.lat, p2.lng],
         );
 
         // Berechnung des Unterschiedes von einem Punkt zum nächsten:
         let delta = p2.meta.ele - p1.meta.ele;

         //Berechnung der Steigung in % : >>> Bedingung ? Ausdruck 1 : (sonst)  Ausdruck 2
       
        let prozent = (distance > 0)  ?  (delta / distance * 100.0).toFixed(1) : 0;

        //Farbe der Steigungswerten zuordnen: 
        //Grün:         http://colorbrewer2.org/#type=sequential&scheme=YlGn&n=4
        //Rot:           http://colorbrewer2.org/#type=sequential&scheme=Reds&n=3
        let farbe = 
        prozent > 10  ?  "#de2d26" :
        prozent > 6 ?  "#fc9272" :
     //   prozent > 2  ?  "#fee0d2" :
        prozent > 0  ?  "#ffffcc" :
        //prozent > -2  ?  "#c2e699" :
        prozent > -6  ?  "#78c679" :
        prozent > -10  ?  "#238443" : "#238443";
        
       
       // console.log(p1.lat, p1.lng, p2.lat, p2.lng, distance, delta, prozent);
 
       //Segmente zwischen Punkten als linie mit farbe darstellen:
         let segment = L.polyline(
             [
                 [p1.lat, p1.lng],
                 [p2.lat, p2.lng],
             ],
             {
                 color: farbe,        //Farbe-Variable von oben
                 weight: "4", 
                 opacity :"1"
             }
         ).addTo(steigung);
     }
});
profil.addTo(myMap);

