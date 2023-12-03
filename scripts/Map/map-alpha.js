

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getStorage, getDownloadURL, ref as ref_storage } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-storage.js";
import { ref, get, child, getDatabase, onValue, set, update } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

import { firebaseConfig } from './firebase-config.js';

// // Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const dbRef = ref(getDatabase(firebaseApp));
const storage = getStorage(firebaseApp);

let observerMarkers = {}
let featuresArray = [];
let isMapLoading = false;

const observersRef = child(dbRef, `layers/953019908948635708/observers/`)

mapboxgl.accessToken = 'pk.eyJ1Ijoia2V2YW5kbyIsImEiOiJjaXphYnRnM3owMm1vMnFvOHFiYm5ibm5jIn0.sY29SXbpr7W9eQHiwpqAwg';

const LOGLAT_LILL = [-88.1380655018482, 42.147436111279276]
const LNGLAT_SANTAMONICA = [-118.52117896492756, 34.01321393735];

// the following code includes saving where the user is on the map

const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {}

if (!userInfo.uuid) {
    userInfo.uuid = generateUUID();
}


function onMove() {
    // Code to execute when the map is moved
    userInfo.center = map.getCenter();
    userInfo.zoom = map.getZoom();

    // Update LOCAL
    localStorage.setItem("userInfo", JSON.stringify(userInfo));

    // Update SERVER
    const observerRef = child(dbRef, `layers/953019908948635708/observers/${userInfo.uuid}`)

    update(observerRef, {
        zoom: userInfo.zoom,
        center: userInfo.center
    });

}

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/outdoors-v12',
    center: userInfo.center || LNGLAT_SANTAMONICA,
    zoom: userInfo.zoom || 11
});


map.on('move', onMove);



/* 
    LOAD MAP
*/

async function loadMap() {

    isMapLoading = true;

    const geojson = {
        'type': 'FeatureCollection',
        'features': featuresArray
    };

    // Add markers to the map.
    for (const marker of geojson.features) {


        // // console.log("Looking for: " + assetPath);
        const storageRef = ref_storage(storage, marker.properties.assetPath);
        const iconUrl = await getDownloadURL(storageRef);

        // Create a DOM element for each marker.
        const el = document.createElement('div');
        const width = marker.properties.iconSize[0];
        const height = marker.properties.iconSize[1];

        el.className = 'marker';
        el.style.backgroundImage = `url(${iconUrl})`;
        el.style.width = `${width}px`;
        el.style.height = `${height}px`;
        el.style.backgroundSize = '100%';
        el.style.backgroundRepeat = "no-repeat";

        el.addEventListener('click', () => {
            // window.alert(marker.properties.message);
        });


        // Create a popup, but don't add it to the map yet.
        const popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false,
            offset: 35,
        });

        el.addEventListener('mouseenter', (e) => {
            // Change the cursor style as a UI indicator.

            map.getCanvas().style.cursor = 'pointer';

            const coordinates = marker.geometry.coordinates.slice();
            const description = marker.properties.description;

            popup.setLngLat(coordinates).setHTML(description).addTo(map);
        });
        el.addEventListener('mouseleave', () => {
            map.getCanvas().style.cursor = '';
            popup.remove();
        });

        try {
            //  Add markers to the map.
            new mapboxgl.Marker(el)
                .setLngLat(marker.geometry.coordinates)
                .addTo(map);

        } catch (e) {
            console.log("error adding marker")
            console.log(marker)
        }

    }

    isMapLoading = false;
    console.log("Map done loading")

}

/*
    LISTEN FOR DATA
*/

async function listenForDataFromFirebase() {

    onValue(observersRef, (snapshot) => {

        const data = snapshot.val();


        snapshot.forEach((childSnapshot) => {

            const childKey = childSnapshot.key;
            const childData = childSnapshot.val();

            var lngLat = [childData.center.lng, childData.center.lat]

            if (childKey === userInfo.uuid) {
                // DO NOT RENDER MAP MARKER FOR SELF
                return;
            }


            var size = (1 / childData.zoom) * 1500


            if (!observerMarkers[childKey]) {
                // Create a DOM element for each marker.
                const el = document.createElement('div');

                // ----- STYLE MARKER -----

                el.className = 'marker';
                // el.style.backgroundColor = "#ff00ff33"
                el.style.borderWidth = "1px"
                el.style.borderColor = "#fff00faa"
                el.style.borderStyle = "solid"
                // el.style.width = `${size/20}px`;
                // el.style.height = `${size/20}px`;
                el.style.borderRadius = "200px"
                el.style.fontSize = `${size}px`;

                el.innerHTML = "👁️"
                // el.style.boxShadow = "#fff00faa 0px 0px 100px 60px"
                el.style.textShadow = "#000 10px 10px 30px"


                try {
                    observerMarkers[childKey] = new mapboxgl.Marker(el)
                        .setLngLat(lngLat)
                        .addTo(map);

                } catch (e) {
                    console.log("error adding marker")
                    console.log(marker)
                }

            } else {

                observerMarkers[childKey].setLngLat(lngLat)

                let el = observerMarkers[childKey].getElement();

                el.innerHTML = "👁️"
                el.style.fontSize = `${size}px`;;
            }

        });

        var playerCount = Object.keys(observerMarkers).length;
        document.getElementById("PlayerCount").innerHTML = playerCount.toString() + " Players on the map " 
    });



}

/* 
    FETCH DATA
*/

async function getDataFromFirebase() {

    let pins = []

    const pinsRef = child(dbRef, `layers/953019908948635708/pins`)

    return get(pinsRef).then((snapshot) => {

        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                pins.push({ ...childData, firebaseKey: childKey });
            });
        } else {
            throw new Error("No data available");
        }

        async function addFeature(pin) {

            var lng = pin.location.longitude;
            var lat = pin.location.latitude;

            if (!lng || !lat) return;

            lng = parseFloat(lng)
            lat = parseFloat(lat)

            var coordinates = [lng, lat];

            featuresArray.push({
                'type': 'Feature',
                'properties': {
                    'description':
                        `<strong>${pin.title}</strong><p>${pin.body}</p>`,
                    'message': 'Foo',
                    'iconSize': [60, 60],
                    'assetPath': pin.image,
                    'firebaseKey': pin.firebaseKey
                },
                'geometry': {
                    'type': 'Point',
                    'coordinates': coordinates
                }
            })
        }

        pins.forEach(addFeature)
    });


}
// Get Data from Firebase and Load Map
async function fetchDataAndLoadMap() {
    await getDataFromFirebase();
    await loadMap();
    listenForDataFromFirebase();
}

function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if (d > 0) {//Use timestamp until depleted
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

// Entry point
fetchDataAndLoadMap();
