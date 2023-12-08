// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getDownloadURL, ref } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-storage.js";
import { get, child, update } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

import { dbRef, storage } from "./firebase-config.js";
// import { mapboxToken } from './constants.js'

import { getQueryParam } from "../helpers.js";

var layerId = getQueryParam("layer_id");
var pinId = getQueryParam("pin_id");
var objectiveId = getQueryParam("objective_id");
var questId = getQueryParam("quest_id");

const pinRef = child(dbRef, `layers/${layerId}/pins/${pinId}`);
const questRef = child(dbRef, `layers/${layerId}/quests/${questId}/objectives/${objectiveId}`);
const objectiveRef = child(dbRef, `layers/${layerId}/quests/${questId}/objectives/${objectiveId}`);

const LNGLAT_SANTAMONICA = [-118.52117896492756, 34.01321393735];

let pin;
let map;
let updatedLocation;
let coordinates;

async function getDataFromFirebase() {
  // GET DATA FROM PIN

  if (pinId) {
    const snapshot = await get(pinRef);

    if (!snapshot.exists()) {
      throw new Error("😫 No Pin Data");
    }

    var pinData = snapshot.val();

    var lng = pinData.location.longitude;
    var lat = pinData.location.latitude;

    if (!lng || !lat) return;

    lng = parseFloat(lng);
    lat = parseFloat(lat);

    coordinates = [lng, lat];

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

    // GET DATA FROM QUEST
  } else if (questId && objectiveId) {
    console.log("2");
    const snapshot = await get(objectiveRef);

    if (!snapshot.exists()) {
      throw new Error("😫 No Quest Data");
    }

    var data = snapshot.val();

    pin = data;

    // Get Coordinates

    if (data.location) {
      var lng = data.location.longitude;
      var lat = data.location.latitude;

      console.log(data.location);

      if (!lng || !lat) return;

      lng = parseFloat(lng);
      lat = parseFloat(lat);

      pin.coordinates = [lng, lat];
    }

    var navTitle = `<strong>${data.title}</strong> => ${data.body}`;

    // document.getElementById("NavTitle").innerHTML = navTitle;

    // const storageRef = ref(storage, pinData.image);

    const iconUrl = "/assets/pin.png";

    // console.log(iconUrl);

    pin.iconUrl = iconUrl;

    pin.coordinates = pin.coordinates || LNGLAT_SANTAMONICA;
  } else {
    console.log("3");
    pin = {};
  }
}

async function loadMap() {
  mapboxgl.accessToken =
    "pk.eyJ1Ijoia2V2YW5kbyIsImEiOiJjaXphYnRnM3owMm1vMnFvOHFiYm5ibm5jIn0.sY29SXbpr7W9eQHiwpqAwg";

  // the following code includes saving where the user is on the map

  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};

  console.log(pin);
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
  const geojson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          description: `<strong>${pin.title}</strong><p>${pin.body}</p>`,
          message: pin.message || "MSg",
          iconSize: [60, 60],
          //   assetPath: assetPath,
        },
        geometry: {
          type: "Point",
          coordinates: pin.coordinates,
        },
      },
    ],
  };

  const marker = geojson.features[0];

  //   const storageRef = ref_storage(storage, marker.properties.assetPath);
  //   const iconUrl = await getDownloadURL(storageRef);

  console.log("4");
  // Create a DOM element for marker.
  const el = document.createElement("div");
  const width = marker.properties.iconSize[0];
  const height = marker.properties.iconSize[1];

  el.className = "marker";
  el.style.backgroundImage = `url(${pin.iconUrl})`;
  el.style.width = `${width}px`;
  el.style.height = `${height}px`;
  el.style.backgroundSize = "100%";

  // Create a popup, but don't add it to the map yet.
  const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
    offset: 35,
  });

  console.log("1");
  updatedLocation = {
    location: {
      lastMoved: new Date().getTime(),
      latitude: marker.geometry.coordinates[1],
      longitude: marker.geometry.coordinates[0],
    },
  };

  el.addEventListener("mouseenter", (e) => {
    // Change the cursor style as a UI indicator.

    map.getCanvas().style.cursor = "pointer";

    const coordinates = updatedLocation
      ? [updatedLocation.location.longitude, updatedLocation.location.latitude]
      : marker.geometry.coordinates.slice();

    const description = marker.properties.description;

    popup.setLngLat(coordinates).setHTML(description).addTo(map);
  });
  el.addEventListener("mouseleave", () => {
    map.getCanvas().style.cursor = "";
    popup.remove();
  });

  const markerObj = new mapboxgl.Marker(el, { draggable: true })
    .setLngLat(marker.geometry.coordinates)
    .addTo(map);

  // DRAG LISTENER
  markerObj.on("dragend", function onDragEnd(e) {
    const lngLat = markerObj.getLngLat();

    updatedLocation = {
      location: {
        lastMoved: new Date().getTime(),
        latitude: lngLat.lat,
        longitude: lngLat.lng,
      },
    };

    popup
      .setLngLat([updatedLocation.location.longitude, updatedLocation.location.latitude])
      .setHTML(marker.properties.description)
      .addTo(map);

    update(pinRef, updatedLocation);
  });
}

function onConfirmClick() {
  if (!objectiveId || !questId || !layerId) {
    alert("Invalid URL parameters");
    return;
  }

  console.log("UPDATE DATABASE", updatedLocation);
  update(objectiveRef, updatedLocation);
}

async function initialize() {
  await getDataFromFirebase();
  await loadMap();
  await addDraggableMarkerToMap();
}

// --- Entry Point ----

initialize();

document.getElementById("ConfirmButton").addEventListener("click", onConfirmClick);
