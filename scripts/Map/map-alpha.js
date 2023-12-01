

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getStorage, getDownloadURL, ref as ref_storage } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-storage.js";
import { ref, get, child, getDatabase, onValue } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

import { firebaseConfig } from './firebase-config.js';

// // Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const dbRef = ref(getDatabase(firebaseApp));
const storage = getStorage(firebaseApp);

let isMapLoading = false;

mapboxgl.accessToken = 'pk.eyJ1Ijoia2V2YW5kbyIsImEiOiJjaXphYnRnM3owMm1vMnFvOHFiYm5ibm5jIn0.sY29SXbpr7W9eQHiwpqAwg';

const LOGLAT_LILL = [-88.1380655018482, 42.147436111279276]
const LNGLAT_SANTAMONICA = [-118.52117896492756, 34.01321393735];

// the following code includes saving where the user is on the map

const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {}

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/outdoors-v12',
    center: userInfo.center || LNGLAT_SANTAMONICA,
    zoom: userInfo.zoom || 11
});


map.on('move', () => {
    // Code to execute when the map is moved
    userInfo.center = map.getCenter();
    userInfo.zoom = map.getZoom();
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
});


let featuresArray = [];


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

    let pins = []

    const pinsRef = child(dbRef, `layers/953019908948635708/pins`)

    featuresArray = [];

    onValue(pinsRef, (snapshot) => {
        console.log("data changed")
        const data = snapshot.val();

        console.log('data', data)

        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                pins.push({ ...childData, firebaseKey: childKey });
            });
        } else {
            throw new Error("No data available");
        }

        console.log('pins', pins)

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

        console.log("pins each");

        if (isMapLoading) {
            console.log("map was loading. do nothing")
        } else {
            loadMap()
        }
    });

    console.log("data!");



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
    // listenForDataFromFirebase();
}

// Entry point
fetchDataAndLoadMap();
