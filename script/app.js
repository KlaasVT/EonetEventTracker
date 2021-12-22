
var mymap = L.map('mapid').setView([0,0], 2);
var myLayer = L.geoJSON().addTo(mymap);
var menustatus = 0;
function initializeMap(){
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        minZoom: 1,
        accessToken: 'pk.eyJ1Ijoia2xhYXN2dCIsImEiOiJja2lya3huODkwcWszMnJyeDYxOGoybXJoIn0.uxm91QeO14zNKOljvA5BOw'
    }).addTo(mymap);
}

const initializeMenu = function(){
    handleData("https://cors-anywhere.herokuapp.com/https://eonet.sci.gsfc.nasa.gov/api/v3/categories", showCategories);
};

const showData = function(jsonObject){
    myLayer.clearLayers();    
    jsonObject.events.forEach(event => {
        var geojsonFeature = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [event.geometry[event.geometry.length-1].coordinates[0],event.geometry[event.geometry.length-1].coordinates[1]]
            }
        };
        var marker = L.geoJSON(geojsonFeature).addTo(myLayer);
        marker.bindPopup(`<h4>${event.title}</h4><p class="marker-popup">This event was of the type: ${event.categories[0].title}</p><p class="marker-popup">Date of this event ${event.geometry[event.geometry.length-1].date.substring(0,10)}</p>`);
    });
};

/* Set the width of the side navigation to 250px */
function changeNav() {
    if(menustatus == 0){
        document.querySelector(".js-sidenav").style.width = "250px";
        document.querySelector(".js-row").style.marginLeft = "250px";
        document.querySelector(".js-arrow").classList.remove("arrow-right");
        document.querySelector(".js-arrow").classList.add("arrow-left");
        menustatus = 1
    }else{
        document.querySelector(".js-sidenav").style.width = "0";
        document.querySelector(".js-row").style.marginLeft = "0";
        document.querySelector(".js-arrow").classList.remove("arrow-left");
        document.querySelector(".js-arrow").classList.add("arrow-right");
        menustatus = 0
    }
    
}
  

const showCategories = function(jsonObject){
    const dropdown = document.querySelector(".js-dropdown-categories");
    jsonObject.categories.forEach(category => {
        var option = document.createElement("option");
        option.text = category.title;
        option.value = category.id;
        dropdown.add(option);
    })
}

const listenToDropDownChange = function(){
    const dropdownDays = document.querySelector(".js-dropdown-days");
    const dropdownCategory = document.querySelector(".js-dropdown-categories");
    dropdownDays.addEventListener("change", function(){
        getData(dropdownDays.value,dropdownCategory.value);
    })
    dropdownCategory.addEventListener("change", function(){
        getData(dropdownDays.value,dropdownCategory.value);
    })
    
};



const getData = function(days,category){
    if(category == "all"){
        handleData("https://cors-anywhere.herokuapp.com/https://eonet.sci.gsfc.nasa.gov/api/v3/events?days="+days, showData);
    }else
    {
        handleData("https://cors-anywhere.herokuapp.com/https://eonet.gsfc.nasa.gov/api/v3/categories/" + category + "?days="+days, showData);
    }
    
};




document.addEventListener('DOMContentLoaded', function () {
    console.log('Script loaded!');
    // handleFloatingLabel();
    // handlePasswordSwitcher();
    initializeMap();
    initializeMenu();
    getData(7,"all");
    listenToDropDownChange();
});