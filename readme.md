
# West LA Food Empowerment

# Table of Contents
1. General Information
2. Technologies Used
3. Improvements and Integration
4. Features
5. Screenshots

# General Information
The Covid-19 pandemic has brought about many challenges for the residents of West Los Angeles in many ways. We want to acknowledge that some may have experience a decline in food security during this time. According to the most recent survey by the UC Global Food Initiative, approximately half of undergraduate students and one-fourth of graduate students across University of California schools reported experiences of food insecurity. Reported by the daily bruin. Many food insecure households do not qualify for federal nutrition assistance programs. Eligibility for CalFresh, California’s food stamps (SNAP) program, is often based on a nationwide standard that does not take into account the extremely high cost of living in Los Angeles County.

## The three primary goals we hope to achieve with the technology for this project are to:
 - Document and Create a safe space for community members of West LA to share their experiences and challenges while applying to food aid programs
 - Allow users of food aid services in West LA to provide feedback and suggest improvements to food aid services.
 - Allow residents of West LA to learn about the food aid programs offered in their local area

## Users that are being empowered by this technology coupled with user stories:
 - Low-Income population: "As low-income resident of Westwood I want to learn about access to food aid programs so I can use them."
 - Residents of West LA: "As a resident in West LA using food services, I want to give feedback on how services can improve their application time and methods."
 - Students: "I am a student from a nearby college, my family’s income took a hit during the pandemic and I want to look for food aid programs nearby to support myself for the time being."



# Technologies Used
This web map uses a variety of languages and tools in order to create a publicly accessible platform for residents of West LA to share their stories regarding food insecurity and voice their opinions on how they would like their food-related issues to be solved. 

The specific purpose of the map itself is to allow users to visualize where in West LA certain feedback was made from. We want communities to be able to learn about the problems that the communities they reside in might face and we want the people that want to help those communities to learn how to best tailor their efforts to the needs reported by those communities. 

From the web page hosting the web map, we also allow community members to directly provide feedback about their food circumstances through a Google Survey that updates the information being hosted by the map itself. In addition, additional pages may be accessed from the main mapping page that redirects a website visitor to additional food aid resources in the West LA area as well as give them the opportunity to provide their own testimonies on their food insecurity issues and proposed solutions.

## Languages: 
 - HTML/CSS
    - HTML and CSS were used to create the structure of the web page. The layout of the map was organized and certain services (the map, the Google Survey frame, and community stories window) are to be displayed through the use of these languages. It also further enables navigation between the main page, a resources page, and a survey submission page.
 - Javascript 
    - Javascript is used to finetune the Leaflet map that is displayed on the webpage. It will add certain key functionalities such as filtering the community testimony window by zip code (retrieved from a Google Sheets containing Google Survey results), distinguishing between the specific type of testimony being displayed (suggestions versus personal experiences), and more.

## Other Web Services and Libraries: 
 - Google Surveys
    - A Google Survey is used to collect the community stories that will be displayed on the main page alongside the map that adds spatial information relevant to these testimonies.
 - Google Sheets
    - A Google Sheets file is used to store information collected from the previously mentioned Google Survey. It is from here that JavaScript will read from certain columns in order to display text data representative of community testimonies. In addition, a script from Google Sheets is used to associate a provided zip code to a latitutde/longitude location.
 - Leaflet
    - The Leaflet library is used to produce the interactive map displayed on the web page. The association of user stories to provided zip code is done through the use of this library as well as the visual appearance and usability of the map.
 - Github Pages
    - This web map is being hosted through Github Pages at zero financial cost to the team behind this iteration of the map.
 
## Source for Geojson: 
https://hub.arcgis.com/datasets/lacounty::la-county-zip-code/explore?location=33.810100%2C-118.298800%2C9.03

## Source for Survey Data:
https://docs.google.com/spreadsheets/d/1uEUH1FxE0G9NLkTQoi_-QuGZF6JmQJIVl6rxE9umTZQ/edit#gid=946618087



# Improvements and Integration
The services and libraries used for this project are all free, in case there is concern about the sustainability of the map financially. To reuse this project for another similar endeavor where it would be useful to imitate the site structure, mapping features, and survey usage should be of no cost to a programmer or the organization they're associated with. The only requirements beyond the code would be a Google Account (to create and hook the site up to a Google Survey and Google Sheets) and a Github account (to utilize Github Pages' free webhosting).

We request that all future mapping projects derived from the source code hosted here be open and visible to the public so that they can also benefit from improvements to it.

# Features

# Screenshots