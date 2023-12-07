// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getDownloadURL, ref } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-storage.js";
import { get, child, update } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

import { dbRef, storage } from "./firebase-config.js";
// import { mapboxToken } from './constants.js'

import { getQueryParam } from "../helpers.js";

var layerId = getQueryParam("layer_id");
var pinId = getQueryParam("pin_id");

const pinRef = child(dbRef, `layers/${layerId}/pins/${pinId}`);

let pin;
let map;

async function getDataFromFirebase() {
  //   const pinRef = child(dbRef, `layers/${layerId}/pins/${pinId}`);

  const snapshot = await get(pinRef);

  if (!snapshot.exists()) {
    throw new Error("No data available");
  }

  var pinData = snapshot.val();

  var lng = pinData.location.longitude;
  var lat = pinData.location.latitude;

  if (!lng || !lat) return;

  lng = parseFloat(lng);
  lat = parseFloat(lat);

  const coordinates = [lng, lat];

  var navTitle = `<strong>${pinData.title}</strong> => ${pinData.body}`;

  document.getElementById("NavTitle").innerHTML = navTitle;

  var assetPath = pinData.image;

  console.log("data loaded");

  const storageRef = ref(storage, assetPath);
  const iconUrl = await getDownloadURL(storageRef);

  console.log(iconUrl);

  pin = pinData;
  pin.coordinates = coordinates;
  pin.iconUrl = iconUrl;
}

async function loadMap() {
  mapboxgl.accessToken =
    "pk.eyJ1Ijoia2V2YW5kbyIsImEiOiJjaXphYnRnM3owMm1vMnFvOHFiYm5ibm5jIn0.sY29SXbpr7W9eQHiwpqAwg";

  // the following code includes saving where the user is on the map

  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};

  map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/outdoors-v12",
    center: pin.coordinates,
    zoom: userInfo.zoom || 11,
  });

  map.on("move", () => {
    // Code to execute when the map is moved
    userInfo.center = map.getCenter();
    userInfo.zoom = map.getZoom();
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
  });
}

async function addDraggableMarkerToMap() {
  let featuresArray = [];

  featuresArray.push({
    type: "Feature",
    properties: {
      description: `<strong>${pin.title}</strong><p>${pin.body}</p>`,
      message: "Foo",
      iconSize: [60, 60],
      //   assetPath: assetPath,
    },
    geometry: {
      type: "Point",
      coordinates: pin.coordinates,
    },
  });

  const geojson = {
    type: "FeatureCollection",
    features: featuresArray,
  };

  const marker = geojson.features[0];

  //   const storageRef = ref_storage(storage, marker.properties.assetPath);
  //   const iconUrl = await getDownloadURL(storageRef);

  // Create a DOM element for marker.
  const el = document.createElement("div");
  const width = marker.properties.iconSize[0];
  const height = marker.properties.iconSize[1];

  el.className = "marker";
  el.style.backgroundImage = `url(${pin.iconUrl})`;
  el.style.width = `${width}px`;
  el.style.height = `${height}px`;
  el.style.backgroundSize = "100%";

  const markerObj = new mapboxgl.Marker(el, { draggable: true })
    .setLngLat(marker.geometry.coordinates)
    .addTo(map);

  // DRAG LISTENER
  markerObj.on("dragend", function onDragEnd(e) {
    const lngLat = markerObj.getLngLat();

    // console.log("marker index: " + activelyDraggedMarkerIndex)
    // console.log("update: " + activelyDraggedPinKey + " with lat long: " + lngLat)

    // update DB!!
    var updates = {
      lastMoved: new Date().getTime(),
      location: {
        latitude: lngLat.lat,
        longitude: lngLat.lng,
        type: "latlng",
      },
    };

    update(pinRef, updates);
  });
}

async function initialize() {
  await getDataFromFirebase();
  await loadMap();
  await addDraggableMarkerToMap();
}

// --- Entry Point ----

initialize();
