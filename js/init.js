const map = L.map('map').setView([34.0709, -118.444], 5);

let Esri_WorldGrayCanvas = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
	maxZoom: 16
});

Esri_WorldGrayCanvas.addTo(map)

/*
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
*/
let url = 'https://spreadsheets.google.com/feeds/list/1uEUH1FxE0G9NLkTQoi_-QuGZF6JmQJIVl6rxE9umTZQ/null/public/values?alt=json'
fetch(url)
	.then(response => {
		return response.json();
		})
    .then(data =>{
        // console.log(data)
        processData(data)
    })
// Code for Zipcode Boundaries
    fetch("ZipCode.geojson")
	.then(response => {
		return response.json();
		})
    .then(data =>{
        // Basic Leaflet method to add GeoJSON data
                        // the leaflet method for adding a geojson
            L.geoJSON(data, {
                style: function (feature) {
                    return {color: 'red'};
                }
            }).bindPopup(function (layer) {
                return layer.feature.properties.name;
            }).addTo(map);
        });

let areGamers = L.featureGroup();
let notGamers = L.featureGroup();
let circleOptions = {
    radius: 4,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
}
// define layers
let layers = {
	"Plays Video Games": areGamers,
	"Does Not Play Video Games": notGamers
}

// add layer control box
L.control.layers(null,layers, {collapsed:false}).addTo(map)

function addMarker(data){
        // console.log(data)
        // these are the names of our fields in the google sheets:
        circleOptions.fillColor = "red"
        areGamers.addLayer(L.circleMarker([data.lat,data.longi], circleOptions)
        .bindPopup(`<h2>${data.whatisyourfavoritegame}</h2>`  + 
                    `<br>${data.whatisyourage}</br>` + `<br>${data.location}</br>`))
        createButtons(data.lat,data.longi,data.location)
        return data.timestamp
}


function addMarkerAlt(data){
    // console.log(data)
    // these are the names of our fields in the google sheets:
    circleOptions.fillColor = "green"
    notGamers.addLayer(L.circleMarker([data.lat,data.longi], circleOptions)
    .bindPopup(`<h2>${data.whatelsedoyoudoinyoursparetime}</h2>`  + 
                `<br>${data.location}</br>`))
                createButtons(data.lat,data.longi,data.location)
    return data.timestamp
}

function createButtons(lat,lng,title){
    const newButton = document.createElement("button"); // adds a new button
    newButton.id = "button"+title; // gives the button a unique id
    newButton.innerHTML = title; // gives the button a title
    newButton.setAttribute("lat",lat); // sets the latitude 
    newButton.setAttribute("lng",lng); // sets the longitude 
    newButton.addEventListener('click', function(){
        map.flyTo([lat,lng]); //this is the flyTo from Leaflet
    })
    const contentsDiv = document.getElementById('contents')
    contentsDiv.appendChild(newButton); //this adds the button to our page.
}

function processData(theData){
    const formattedData = [] /* this array will eventually be populated with the contents of the spreadsheet's rows */
    const rows = theData.feed.entry // this is the weird Google Sheet API format we will be removing
    // we start a for..of.. loop here 
    for(const row of rows) { 
      const formattedRow = {}
      for(const key in row) {
        // time to get rid of the weird gsx$ format...
        if(key.startsWith("gsx$")) {
              formattedRow[key.replace("gsx$", "")] = row[key].$t
        }
      }
      // add the clean data
      formattedData.push(formattedRow)
    }
    // lets see what the data looks like when its clean!
    console.log(formattedData)
    // we can actually add functions here too

    for (i = 0; i < formattedData.length; i++)
    {
        if (formattedData[i].whatisyourfavoritegame == "")
        {
            addMarkerAlt(formattedData[i]);
        }
        else{
            addMarker(formattedData[i]);
        }
    }
    // make the map zoom to the extent of markers
    let allLayers = L.featureGroup([areGamers,notGamers]);
    map.fitBounds(allLayers.getBounds());     

}

