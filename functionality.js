var routeURL = null;
var x = document.getElementById("destination");
var y = document.getElementById("temporaryNext");
var changeButtonDiv = document.getElementById("change-image-div");
var changeButtonBtn = document.getElementById("change-image-btn");
var dir = document.getElementById("direct");
var directionsImage = document.getElementById("imageDiv");
var directionsError = document.getElementById("error");
var directionsTextClass = document.querySelector('.path');
var lineText1 = document.querySelector('.line4');
var image = "images/RedTree.jpg";
var image1 = "images/Synthwave.webp";
var image2 = "images/DarkDisco.gif";
var image3 = "images/CyberpunkCity.webp";
var imageArray = new Array(40);
var counter = 0;
var max = 0;
var notInErrorScreen = true;
var selectElement = document.querySelector("#choose-location1");
var selectElement1 = document.querySelector("#choose-location2");
var inStartingScreen = true;
var selectedADA = false;
var selectedWalkable = true;
var imageLarge = true;
var width = 100;
var height = 1000;
var expanded = false;

optionWalkable();
//changeImageSize();
useDirectionButton();

function optionADA(){
    selectedADA = true;
    selectedWalkable = false;
    document.querySelector('.walking-btn').classList.remove('show');
    document.querySelector('.handicap-btn').classList.add('show');
}

function optionWalkable(){
    selectedADA = false;
    selectedWalkable = true;
    document.querySelector('.handicap-btn').classList.remove('show');
    document.querySelector('.walking-btn').classList.add('show');
}

function useDirectionButton(){
    counter = 0;
    for(var i = 1; i <= max; i++){
        document.getElementById("textline" + (i)).innerHTML = null;
    }
    var tempString = "WALKING ";
    if(selectedADA){
        tempString = "ADA ";
    }
    dir.innerHTML = tempString + "ROUTE:";
    const startingPoint = selectElement.options[selectElement.selectedIndex].value;
    const destination = selectElement1.options[selectElement1.selectedIndex].value;

    /*
    *
    * Fetch the google maps link from the json file
    * 
    */

    let start = startingPoint.split("-");
    fetch("resources/google_map_routes/" + start[0].toLowerCase() + ".json")
        .then(response => response.json())
        .then(data => {
        for(var j = 0; j < data.length; j++){
            console.log(determineRoute(startingPoint, destination) + " " + data[j].routeID);
            if(determineRoute(startingPoint, destination) === (data[j].routeID)){
                if(selectedADA){
                    routeURL = data[j].urlADA;
                } else {
                    routeURL = data[j].urlWalking;
                }
                break;
            } else {
                routeURL = null;
            }
        }
        if(routeURL != null){
            directionsImage.innerHTML = '<iframe id="google-maps-iframe" class="google-maps-iframe" width="' + width + '%" height="' + height + 'px" src=' + routeURL +'></iframe>';
        } else {
            directionsImage.innerHTML = '<span style="font-size:60px">TO BE ADDED...</span>';
            directionsImage.innerHTML += "<br>" + '<img width="800" height="533" overflow="hidden" src="images/temp/CyberpunkCity.gif" />';
        }
    });

    directionsTextClass.classList.add('show');
    inStartingScreen = true;
    if(!notInErrorScreen){
        directionsError.classList.remove('show');
        notInErrorScreen = true;
        document.getElementById("error").innerHTML = null;
        changeButtonDiv.innerHTML = '<button id="change-image-btn" class="change-image-btn" onclick="changeImageSize()"><img height="65px" width="65px" src="images/shrink.png"></button>';
    }
    if(startingPoint === (destination)){
        directionsError.innerHTML = '<span style="color:rgb(255,99,71); font-size:70px;">Error:</span><br>The starting point and destination cannot be the same';
        directionsError.classList.add('show');
        directionsTextClass.classList.add('show');
        for(var i = 1; i <= max; i++){
            document.getElementById("textline" + (i)).innerHTML = null;
        }
        notInErrorScreen = false;
        max = 0;
        setTimeout(()=>{
            directionsImage.innerHTML = null;
            changeButtonDiv.innerHTML = null;
        }, 100);
    }
}
function useNextButton(startingPoint, destination){
    if(startingPoint != destination){
        dir.innerHTML = "Directions: ";
        var routeIndex = -1;

        /*
        *
        * Fetch for the selected directions and images
        * 
        */

        fetch("resources/direction_routes/" + startingPoint.split("-")[0].toLowerCase() + ".json")
        .then(response => response.json())
        .then(data => {
        for(var j = 0; j < data.Routes.length; j++){
            if(determineRoute(startingPoint, destination) === (data.Routes[j].RouteID)){
                routeIndex = j;
            }
        }
        
        const route = selectedADA ? data.Routes[routeIndex].RouteADA : data.Routes[routeIndex].RouteWalking;
        if(route != null){
            for(var i = 0; i < route.length; i++){
                var textline = document.getElementById("textline" + (i + 1));
                var step = route[i];
                if(route[i].directions != null){
                    textline.innerHTML = step.directions + "";
                } 
                textline.innerHTML += "<br>";
                if(step.image != null){
                    imageArray[i] = "images/" + step.image;
                } else {
                    imageArray[i] = "images/temp/Synthwave.webp";
                }
            }
        } else {
            document.getElementById("textline" + (1)).innerHTML = 'DIRECTIONS TO BE ADDED.';
        }

        directionsImage.innerHTML = "<br>" + '<img width="' + width + '%" height="' + height + 'px" overflow="hidden" src=' + imageArray[0] +' />';
        max = route.length;
        });
        document.getElementById("error").innerHTML = null;
        directionsTextClass.classList.add('show');
        directionsError.classList.remove('show');
        counter = 1;
        for(var i = 1; i <= max; i++){
            document.querySelector(".line" + i).classList.remove('bold');
        }
        document.querySelector(".line" + 1).classList.add('bold');
        notInErrorScreen = true;
    } else {
        directionsError.innerHTML = '<span id="error-msg" style="color:rgb(255,99,71); font-size:70px;">Error:</span><br>The starting point and destination cannot be the same';
        directionsError.classList.add('show');
        directionsTextClass.classList.add('show');
        for(var i = 1; i <= max; i++){
            document.getElementById("textline" + (i)).innerHTML = null;
        }
        counter = 0;
        notInErrorScreen = false;
        max = 0;
        if(directionsImage != null){
            directionsImage.innerHTML = null;
        }
    }
}

function swapDestinationAndStartingPoint(){
    var temp = selectElement1.value;
    selectElement1.value = selectElement.value;
    selectElement.value = temp;
}

function determineRoute(startingPoint, destination){
    let s1 = startingPoint.split("-");
    let s2 = destination.split("-");
    return s1[0] + "to" + s2[0];
}

function buttonNext(){
    const startingPoint = selectElement.options[selectElement.selectedIndex].value;
    const destination = selectElement1.options[selectElement1.selectedIndex].value;
    if(counter != max && notInErrorScreen && !inStartingScreen){
        counter = counter + 1;
        document.querySelector(".line" + (counter - 1)).classList.remove('bold');
        document.querySelector(".line" + counter).classList.add('bold');
        directionsImage.innerHTML = "<br>" + '<img width="' + width + '%" height="' + height + 'px" overflow="hidden" id="direction-image" src=' + imageArray[counter-1] +' />';
        inStartingScreen = false;
    } else if(inStartingScreen){
        useNextButton(startingPoint, destination);
        inStartingScreen = false;
    }
}

function buttonPrevious(){
    if(counter != 1 && notInErrorScreen){
        counter = counter - 1;
        document.querySelector(".line" + (counter + 1)).classList.remove('bold');
        document.querySelector(".line" + counter).classList.add('bold');
        directionsImage.innerHTML = "<br>" + '<img width="' + width + '%" height="' + height + 'px" overflow="hidden" id="direction-image" src=' + imageArray[counter-1] +' />';
    } else if(counter == 1){
        inStartingScreen = true;
        dir.innerHTML = "Starting Point: ";
        for(var i = 1; i <= max; i++){
            document.getElementById("textline" + (i)).innerHTML = null;
        }
        useDirectionButton();
    }
}

/*
function changeImageSize(){
    var element1 = document.getElementById("direction-image");
    element1.addEventListener("touchstart", ()=> {
        if(imageLarge){
            width = 60;
            height = 600;
            imageLarge = false;
        } else {
            width = 100;
            height = 1000;
            imageLarge = true;
        }
        if(inStartingScreen){
            //directionsImage.innerHTML = '<iframe width="' + width + '%" height="' + height + 'px" src=' + routeURL +'></iframe>';
            document.getElementById("google-maps-iframe").setAttribute("width", width + "%");
            document.getElementById("google-maps-iframe").setAttribute("height", height + "px");
        } else if(notInErrorScreen){
            directionsImage.innerHTML = "<br>" + '<img width="' + width + '%" height="' + height + 'px" overflow="hidden" id="direction-image" src="images/temp/CyberpunkCity.gif" />';
        }
    });
}
*/

function exitFullscreenMode(){
    if(document.fullscreenElement){
        document.exitFullscreen();
        document.getElementById("fullscreen-div").innerHTML = null;
        expanded = false;
    }
}

function preInFullscreenMode(){
    if(document.fullscreenElement){
        if(counter > 1){
            document.getElementById("fullscreen-text").innerHTML = document.getElementById("textline" + (counter - 1)).innerHTML;
            document.getElementById("fullscreen-image").src = imageArray[counter-2];
            buttonPrevious();
        } else if(counter == 1){
            fullscreenUIHandler(false, 100, false, true);
            buttonPrevious();
        } else {
            counter = 0;
        }
    }
}

function nextInFullscreenMode(){
    if(document.fullscreenElement){
        if(counter < max && counter != 0){
            buttonNext();
            document.getElementById("fullscreen-text").innerHTML = document.getElementById("textline" + (counter)).innerHTML;
            document.getElementById("fullscreen-image").src = imageArray[counter - 1];
        } else if(counter == 0){
            buttonNext();
            fullscreenUIHandler(true, 100, true, false);
        }
    }
}

function expandMapDiv(){
    if(expanded){
        document.querySelector('.map-btn').classList.remove('show');
        document.getElementById("halfscreen-iframe").style.display = "none";
        expanded = false;
    } else {
        document.querySelector('.map-btn').classList.add('show');
        if(document.getElementById("halfscreen-iframe") == null){
            document.getElementById("map-btn").innerHTML += '<iframe id="halfscreen-iframe" class="halfscreen-iframe" src=' + routeURL + '></iframe>';
        }
        document.getElementById("halfscreen-iframe").style.display = "block";
        expanded = true;
    }
}

function fullscreenUIHandler(needText, timer, needImage, needGoogleMapsIframe){
    const element1 = document.getElementById("fullscreen-div");
    if(needText && timer <= 0){
        element1.innerHTML = '<div id="fullscreen-text" class="fullscreen-text">' + document.getElementById("textline" + counter).innerHTML + '</div>';
    } else if(timer > 0 && needText){
        setTimeout(()=>{
            element1.innerHTML = '<div id="fullscreen-text" class="fullscreen-text">' + document.getElementById("textline" + counter).innerHTML + '</div>';
        },timer);
    } else {
        element1.innerHTML = null;
    }
    if(timer > 0){
        setTimeout(()=>{
            element1.innerHTML += '<button id="map-btn" class = "map-btn" onclick="expandMapDiv()">_____________________<br><br></button>';
            element1.innerHTML += '<button id="exit-btn" class = "exit-btn" onclick="exitFullscreenMode()">X</button>';
            element1.innerHTML += '<button id="inv-pre-btn" class = "inv-pre-btn" onclick="preInFullscreenMode()">PREV</button>';
            element1.innerHTML += '<button id="inv-next-btn" class = "inv-next-btn" onclick="nextInFullscreenMode()">NEXT</button>';
            if(needImage){
                element1.innerHTML += '<img id="fullscreen-image" class="fullscreen-image" src=' + imageArray[counter-1] +' />';
            }
            if(needGoogleMapsIframe){
                if(routeURL != null){
                    element1.innerHTML += '<iframe id="fullscreen-iframe" class="fullscreen-iframe" src=' + routeURL + '></iframe>';
                } else {
                    element1.innerHTML += '<img id="fullscreen-image" class="fullscreen-image" src="images/temp/CyberpunkCity.gif" />';
                }
            }
        },timer);
    } else {
        element1.innerHTML += '<button id="map-btn" class = "map-btn" onclick="expandMapDiv()">_____________________<br><br></button>';
        element1.innerHTML += '<button id="exit-btn" class = "exit-btn" onclick="exitFullscreenMode()">X</button>';
        element1.innerHTML += '<button id="inv-pre-btn" class = "inv-pre-btn" onclick="preInFullscreenMode()">PREV</button>';
        element1.innerHTML += '<button id="inv-next-btn" class = "inv-next-btn" onclick="nextInFullscreenMode()">NEXT</button>';
        if(needImage){
            element1.innerHTML += '<img id="fullscreen-image" class="fullscreen-image" src=' + imageArray[counter-1] +' />';
        }
        if(needGoogleMapsIframe){
            if(routeURL != null){
                element1.innerHTML += '<iframe id="fullscreen-iframe" class="fullscreen-iframe" src=' + routeURL + '></iframe>';
            } else {
                element1.innerHTML += '<img id="fullscreen-image" class="fullscreen-image" overflow="hidden" src="images/temp/CyberpunkCity.gif" />';
            }
        }
    }
    expanded = false;
}

function openFullScreenHandler(){
    var element1 = document.getElementById("fullscreen-div");
    if(document.fullscreenElement){
        document.exitFullscreen();
    } else {
    /*
    *  max-width: 100%;
    *  height: auto;
    *  width: auto\9; /* ie8 *\
    */

    /*
    *
    * Fullscreen mode unavailable for apple devices
    * 
    */
        if(!/iPhone|iPad|iPod/i.test(navigator.userAgent)){
            if(counter == 0){
                fullscreenUIHandler(false, 100, false, true);
            } else {
                fullscreenUIHandler(true, 0, true, false);
            }
            if(element1.requestFullscreen){
                element1.requestFullscreen().catch(e => {
                    console.log(e);
                });
            } else if(element1.webkitRequestFullscreen){
                element1.webkitRequestFullscreen().catch(e => {
                    console.log(e);
                });
            }
        }
    }
    
}
