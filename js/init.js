//Notes on Data
// formattedData[i].zipcode in processdata() acts as primary key for sheets data
// is used to connect to GEOJSON boundaries based on boundary feature property e.target.feature.properties.ZIPCODE  in "Code for Zipcode Boundaries"

//Other issue
//Currently markers created corresponding to  buttons are one layer lower than the GEOJson boundary layer, this should be changed as they both should be one layer
//Where the boundaryies in the GEOJson define line/fill rules for the google sheet's properties data.

//WORD CLOUD INITIALIZED SET
var fb_count = 0
var fp_count = 0
var cf_count = 0
var snap_count = 0
var wic_count = 0
var calfresh_count = 0
var none_count = 0 

//SOURCE: https://cliffcloud.github.io/Leaflet.Sleep/
//This section of code controls sleeping of the map - "You can scroll down on the page while cursor is on the map."
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

}).setView([34.0709, -118.444], 12);

let Esri_WorldGrayCanvas = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
	maxZoom: 16
});


Esri_WorldGrayCanvas.addTo(map)


//Scrollama Declaration
let scroller = scrollama();

//PROCESS DATA CONTROL VARIABLE -  Global variable stores a clicked zipcode value from the GeoJSON
//Meant to be used for filtering. 
var filteredZipcode = ""

//Updating zipcode, select zipcode.
function updateZipcode()
{
    //Hard Reset All Created Elements
    while (document.getElementById('contents').firstChild) {
        document.getElementById('contents').removeChild(document.getElementById('contents').firstChild);
    }
     fb_count = 0
     fp_count = 0
     cf_count = 0
     snap_count = 0
     wic_count = 0
     calfresh_count = 0
     none_count = 0 

    document.getElementById("window").innerHTML = ""

    filteredZipcode = document.getElementById("zipcode_select").value;
    console.log(filteredZipcode)
    fetch(url)
	.then(response => {
		return response.json();
		})
    .then(data =>{
        // console.log(data)
        processData(data)
    })
    console.log("passing 1")
}
//TURF.JS CODE START
// this is the boundary layer located as a geojson in the /data/ folder 
const boundaryLayer = "./ZipCode.geojson"
let boundary; // place holder for the data
let collected; // variable for turf.js collected points 
let allPoints = []; // array for all the data points

//Chloropleth Code START ; Controls GEOJson click and hover functionality.
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

var geojson; //This creates an initial state to restore GEOJson to pre-highlight appearance once hovering is no longer occurring. 
             //Order is important here, hover may break if variable declaration does not occur before resetHighlight and the fetch line.

function resetHighlight(e) {
    if (e.target.feature.properties.zipcode != filteredZipcode)
    geojson.resetStyle(e.target);
  //  console.log("Highlight")
  var layer = e.target;

}




function focusOnZipcode(e) {
    console.log(e.target.feature);
    let  geojson_zipcode = e.target.feature.properties.zipcode
    console.log("Feature's Zipcode: " + geojson_zipcode)
    //filteredZipcode = geojson_zipcode; //update global filteredZipcode variable
    console.log("Global Zipcode: " + filteredZipcode)
    console.log(e.target.feature.properties)
    //Find a way to grab all instances
    


}

function onEachFeature(feature, layer) {
   console.log(feature)
  // var layer = e.target;
  console.log(filteredZipcode)
  console.log(layer.feature.properties.zipcode)
   if (filteredZipcode == layer.feature.properties.zipcode)
     {
         layer.setStyle({
             weight: 5,
             color: '#17fc7a',
             dashArray: '',
             fillOpacity: 0.7,
             fillColor: 'green'
         });
     }
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: focusOnZipcode
    });
    
}
//CHLOROPLETH CODE END



//TURF.JS CODE END
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
function getBoundary(layer){
    fetch(layer)
    .then(response => {
        return response.json();
        })
    .then(data =>{
                //set the boundary to data
                boundary = data

            // run the turf collect geoprocessing
            collected = turf.collect(boundary, thePoints, 'userTestimony', 'values');

            // just for fun, you can make buffers instead of the collect too:
            // collected = turf.buffer(thePoints, 50,{units:'miles'});
            console.log(collected.features)

           geojson = L.geoJSON(collected, {
                style: style,
                /*
                function (feature) {
                    return {color: 'red'};
                }*/
                onEachFeature:  onEachFeature
            }).bindPopup(function (layer) {
                return layer.feature.properties.name;
            }).addTo(map)
        }
    )   
}



let userStory = L.featureGroup();

//Keep this; necessary in button creation.
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


//addMarker enables creation of buttons on left-hand

function addMarkerInit(data){
    //Turf.JS implementation
    let boundary_zipcode = data.zipcode
    let services = data.listservices
    let use_reason = data.serviceusedreason
    let serviceproblems = data.serviceproblems
    let datetime = data.timestamp
    markerServicesSplit = services.split(', ');
    console.log(markerServicesSplit);
    markerServicesSplit.forEach(function(element){
        if (element == "Food Banks"){
            fb_count +=1;
        }
        else if (element =="Food Pantries"){
            fp_count +=1;  
        }
        else if (element =="Community Fridges"){
            cf_count+=1
        }
        else if (element == "SNAP (Supplemental Nutrition Assistance Program)"){
            snap_count+=1
        }
        else if (element == "WIC (Special Supplemental Nutrition Program for Women, Infants, and Children)"){
            wic_count+=1
        }
        else if (element == "CalFresh"){
            calfresh_count+=1
        }
        else if (element =="None"){
            none_count+=1
        }
    }
    )
    // create the turfJS point

    let thisPoint = turf.point([Number(data.lng),Number(data.lat)],
        {boundary_zipcode, 
        services,
        use_reason,
        serviceproblems,
        datetime})

    // put all the turfJS points into `allPoints`
    allPoints.push(thisPoint)
    //Old marker information
    // console.log(data)
    // these are the names of our fields in the google sheets:  
   
    createButtons(data.lat,data.lng, data)
    //Credit to
    return data.timestamp
}

//I think this is where I should be changing markers to be turf.js points
function addMarker(data){
        //Turf.JS implementation
        let boundary_zipcode = data.zipcode
        let services = data.listservices
        let use_reason = data.serviceusedreason
        let serviceproblems = data.serviceproblems
        let datetime = data.timestamp
        markerServicesSplit = services.split(', ');
        console.log(markerServicesSplit);
        markerServicesSplit.forEach(function(element){
            if (element == "Food Banks"){
                fb_count +=1;
            }
            else if (element =="Food Pantries"){
                fp_count +=1;  
            }
            else if (element =="Community Fridges"){
                cf_count+=1
            }
            else if (element == "SNAP (Supplemental Nutrition Assistance Program)"){
                snap_count+=1
            }
            else if (element == "WIC (Special Supplemental Nutrition Program for Women, Infants, and Children)"){
                wic_count+=1
            }
            else if (element == "CalFresh"){
                calfresh_count+=1
            }
            else if (element =="None"){
                none_count+=1
            }
        }
        )
        // create the turfJS point

        let thisPoint = turf.point([Number(data.lng),Number(data.lat)],
            {boundary_zipcode, 
            services,
            use_reason,
            serviceproblems,
            datetime})

        // put all the turfJS points into `allPoints`
        allPoints.push(thisPoint)
        //Old marker information
        // console.log(data)
        // these are the names of our fields in the google sheets:  
        if (data.zipcode == filteredZipcode){
        createButtons(data.lat,data.lng, data)
        }
        //Credit to
        return data.timestamp
}

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
    console.log("Formatted Data")
    console.log(formattedData)

    // we can actually add functions here too

    for (i = 0; i < formattedData.length; i++)
    {
        if (formattedData[i].westlaresidence == "Yes") //check for westLA residence
        {
            //check if a specific zipcode output is desired
            if (filteredZipcode == ""){
                addMarkerInit(formattedData[i]); 
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
    //let allLayers = L.featureGroup([userStory]);

    //TURF.JS
    // step 1: turn allPoints into a turf.js featureCollection
    thePoints = turf.featureCollection(allPoints)
    console.log("thePoints")
    console.log(thePoints)
    
    // step 2: run the spatial analysis
    getBoundary(boundaryLayer)
    console.log('boundary')
    console.log(boundary)
   // map.fitBounds(thePoints.getBounds()); 
    

   //Word Cloud Code Here (Do not move, needed here to get updated count values.)
   anychart.onDocumentReady(function() {
    var data = [
      {"x": "Food Banks", "value": fb_count, category: "Food Banks"},
      {"x": "Food Pantries", "value": fp_count, category: "Food Pantries"},
      {"x": "Community Fridges", "value": cf_count, category: "Community Fridges"},
      {"x": "SNAP (Supplemental Nutrition Assistance Program)", "value": snap_count, category: "SNAP (Supplemental Nutrition Assistance Program)"},
      {"x": "WIC (Special Supplemental Nutrition Program for Women, Infants, and Children)", "value": wic_count, category: "WIC (Special Supplemental Nutrition Program for Women, Infants, and Children)"},
      {"x": "CalFresh", "value": calfresh_count, category: "CalFresh"},
      {"x": "None", "value": none_count, category: "None"}
    ];// create a tag (word) cloud chart
    chart = anychart.tagCloud(data);// set a chart title
   // chart.title('15 most spoken languages')
    // set an array of angles at which the words will be laid out
    chart.angles([0])
    // enable a color range
    chart.colorRange(true);
    // set the color range length
    chart.colorRange().length('100%');// display the word cloud chart
    chart.container('window');
    chart.normal().fontWeight(1000);

    chart.draw();
  });
         
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


//Control Window Addition Code; To edit positions/properties of the window, work in control_window.js
var win =  L.control.window(map,
    {title:'Services People Use in this Zipcode',
    content:"<div id='window'></div>"})
.show()

