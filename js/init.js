//SOURCE: https://cliffcloud.github.io/Leaflet.Sleep/
const map = L.map('map', {
    // true by default, false if you want a wild map
    sleep: true,
    // time(ms) for the map to fall asleep upon mouseout
    sleepTime: 750,
    // time(ms) until map wakes on mouseover
    wakeTime: 750,
    // defines whether or not the user is prompted oh how to wake map
    sleepNote: false,
    // allows ability to override note styling
    sleepNoteStyle: { color: 'red' },
    // should hovering wake the map? (clicking always will)
    hoverToWake: true,
    // opacity (between 0 and 1) of inactive map
    sleepOpacity: .7

}).setView([34.0709, -118.444], 5);

let Esri_WorldGrayCanvas = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
	maxZoom: 16
});

//https://leafletjs.com/examples/geojson/ For help working with geojson markers.

Esri_WorldGrayCanvas.addTo(map)

/*
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
*/

//Scrollama Declaration
let scroller = scrollama();

//PROCESS DATA CONTROL VARIABLE - Enables filtering based on a specific clicked zipcode once I figure out how to load one into it.
var filteredZipcode = ""

//Chloropleth Code START ; Controls GEOJson
//REFERENCED CODE: https://leafletjs.com/examples/choropleth/
function style(feature) {
    return {
        fillColor: 'red',
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function highlightFeature(e) {
    var layer = e.target;
    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });
    
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront(); //Highlights whole zipcode regeion.
    }
}

var geojson;
function resetHighlight(e) {
    geojson.resetStyle(e.target);
    console.log("Highlight")
}

function focusOnZipcode(e) {
    var geojson_zipcode = e.target.feature.properties.ZIPCODE;
    console.log("Feature's Zipcode: " + geojson_zipcode)
    filteredZipcode = geojson_zipcode; //update global filteredZipcode variable
    console.log("Global Zipcode: " + filteredZipcode)
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: focusOnZipcode
    });
}
//CHLOROPLETH CODE END

//Calling from Google Spreadsheets
let url = 'https://spreadsheets.google.com/feeds/list/1uEUH1FxE0G9NLkTQoi_-QuGZF6JmQJIVl6rxE9umTZQ/ofnlb99/public/values?alt=json'
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
           geojson = L.geoJSON(data, {
                style: style,
                /*
                function (feature) {
                    return {color: 'red'};
                }*/
                onEachFeature:  onEachFeature
            }).bindPopup(function (layer) {
                return layer.feature.properties.name;
            }).addTo(map);
        });





let userStory = L.featureGroup();

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
	"Submitted Food Scarcity Story": userStory,
}

// add layer control box
//L.control.layers(null,layers, {collapsed:false}).addTo(map)

function addMarker(data){
        // console.log(data)
        // these are the names of our fields in the google sheets:
        circleOptions.fillColor = "red"
        userStory.addLayer(L.circleMarker([data.lat,data.lng], circleOptions)
        .bindPopup(`<h2>${data.list_services}</h2>`  + 
                    `<br>${data.service_problems}</br>` + `<br>${data.zipcode}</br>`))
        createButtons(data.lat,data.lng, data)
        
        return data.timestamp
}

/*
function addMarkerAlt(data){
    // console.log(data)
    // these are the names of our fields in the google sheets:
    circleOptions.fillColor = "green"
    notGamers.addLayer(L.circleMarker([data.lat,data.lng], circleOptions)
    .bindPopup(`<h2>${data.whatelsedoyoudoinyoursparetime}</h2>`  + 
                `<br>${data.location}</br>`))
                createButtons(data.lat,data.lng,data.location)
    return data.timestamp
}
*/


/* OLD CREATE BUTTONS
function createButtons(lat,lng,data){
    var title = data.zipcode;
    console.log(title);
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
*/
//Modified Button Includes New Testimony Elements

function createButtons(lat,lng, data){
    const newButton = document.createElement("button"); // adds a new button
    let title = data.zipcode;
    newButton.id = "button"+ title; // gives the button a unique id
    
    newButton.setAttribute("lat",lat); // sets the latitude 
    newButton.setAttribute("lng",lng); // sets the longitude 
    newButton.setAttribute("zipcode", data.zipcode) //sets zipcode
    newButton.setAttribute("services", data.listservices)
    newButton.setAttribute("use_reason", data.serviceusedreason)
    newButton.setAttribute("serviceproblems", data.serviceproblems)
    newButton.setAttribute("datetime", data.timestamp)

    let services = newButton.getAttribute('services')
    let use_reason = newButton.getAttribute('use_reason')
    let serviceproblems = newButton.getAttribute('serviceproblems')
    let datetime = newButton.getAttribute('datetime')
    
    let testimonyElements = 
    `<h2> Where am I?: ${title} </h2> 
        <div class='testimony'> 
            <p> Services Used: ${services} </p> 
            <p> Reasons for Use: ${use_reason} </p> 
            <p> Problems of Service: ${serviceproblems} </p>
            <p> Testimony Submission Time: ${datetime} </p> 
        </div>`

    newButton.innerHTML = testimonyElements; // gives the button a title
    ///
    newButton.addEventListener('click', function(){
        map.flyTo([lat,lng]); //this is the flyTo from Leaflet
    })
    const contentsDiv = document.getElementById('contents')
    contentsDiv.appendChild(newButton); //this adds the button to our page.
}


//formatData in AA-191 sample code.
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
        if (formattedData[i].westlaresidence == "Yes") //check for westLA residence
        {
            //check if a specific zipcode output is desired
            if (filteredZipcode == ""){
                addMarker(formattedData[i]); 
            }
            else{
                if (formattedData[i].zipcode == filteredZipcode) //adds buttons only if matching the filtered zipcode
                {
                    addMarker(formattedData[i]); 
                }
            }
            
        }
        else{
           
        }
    }
    // make the map zoom to the extent of markers
    let allLayers = L.featureGroup([userStory]);


    anychart.onDocumentReady(function() {
        var data = [
          {"x": "Mandarin chinese", "value": 1090000000, category: "Sino-Tibetan"},
          {"x": "English", "value": 983000000, category: "Indo-European"},
          {"x": "Hindustani", "value": 544000000, category: "Indo-European"},
          {"x": "Spanish", "value": 527000000, category: "Indo-European"},
          {"x": "Arabic", "value": 422000000, category: "Afro-Asiatic"},
          {"x": "Malay", "value": 281000000, category: "Austronesian"},
          {"x": "Russian", "value": 267000000, category: "Indo-European"},
          {"x": "Bengali", "value": 261000000, category: "Indo-European"},
          {"x": "Portuguese", "value": 229000000, category: "Indo-European"},
          {"x": "French", "value": 229000000, category: "Indo-European"},
          {"x": "Hausa", "value": 150000000, category: "Afro-Asiatic"},
          {"x": "Punjabi", "value": 148000000, category: "Indo-European"},
          {"x": "Japanese", "value": 129000000, category: "Japonic"},
          {"x": "German", "value": 129000000, category: "Indo-European"},
          {"x": "Persian", "value": 121000000, category: "Indo-European"}
        ];
      // create a tag (word) cloud chart
        var chart = anychart.tagCloud(data);
      // set a chart title
        chart.title('15 most spoken languages')
        // set an array of angles at which the words will be laid out
        chart.angles([0])
        // enable a color range
        chart.colorRange(true);
        // set the color range length
        chart.colorRange().length('80%');
      // display the word cloud chart
        chart.container("container");
        chart.draw();
      });

    //Control Window Addition Code; To edit positions/properties of the window, work in control_window.js
    var win =  L.control.window(map,
        {title:'Services People Use in this Zipcode',
        content:"<div id='container'></div> \
        <script></script>"})
    .show()
    map.fitBounds(allLayers.getBounds());             
    // setup the instance, pass callback functions
    // use the scrollama scroller variable to set it up
    scroller.setup({
        step: ".step", // this is the name of the class that we are using to step into, it is called "step", not very original
    })
    // do something when you enter a "step":
    .onStepEnter((response) => {
        // you can access these objects: { element, index, direction }
        // use the function to use element attributes of the button 
        // it contains the lat/lng: 
        scrollStepper(response.element.attributes)
    })
    .onStepExit((response) => {
        // { element, index, direction }
        // left this in case you want something to happen when someone
        // steps out of a div to know what story they are on.
    });
}


function scrollStepper(thisStep){
    // optional: console log the step data attributes:
    // console.log("you are in thisStep: "+thisStep)
    let thisLat = thisStep.lat.value
    let thisLng = thisStep.lng.value
    // tell the map to fly to this step's lat/lng pair:
    map.flyTo([thisLat,thisLng])
}

// setup resize event for scrollama incase someone wants to resize the page...
window.addEventListener("resize", scroller.resize);


// Get the modal
var modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
var span2 = document.getElementById("close2");

// When the user clicks on the button, open the modal 
window.onload = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

span2.onclick = function() {
    modal.style.display = "none";
  }

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}