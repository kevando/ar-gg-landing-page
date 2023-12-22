// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getDownloadURL, ref } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-storage.js";
import {
  get,
  child,
  update,
  push,
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

import { dbRef, storage } from "./firebase-config.js";

import { getImageUrlFromAssetPath } from "./firebase-helpers.js";
import { getQueryParam } from "../helpers.js";
import { mapboxToken } from "./constants.js";

var layerId = getQueryParam("layer_id");
var pinId = getQueryParam("pin_id");
var objectiveId = getQueryParam("objective_id");
var questId = getQueryParam("quest_id");
var itemId = getQueryParam("item_id");

const pinsRef = child(dbRef, `layers/${layerId}/pins`);
const pinRef = child(dbRef, `layers/${layerId}/pins/${pinId}`);
const questRef = child(dbRef, `layers/${layerId}/quests/${questId}/objectives/${objectiveId}`);
const objectiveRef = child(dbRef, `layers/${layerId}/quests/${questId}/objectives/${objectiveId}`);

// Get ALL query params

// const search = /*your search query ex:-?author=bloggingdeveloper&a1=hello*/
// const params = new URLSearchParams(search);
const params = new URL(window.location).searchParams;
let queryParams = {};
for (var value of params.keys()) {
  queryParams[value] = params.get(value);
}

// console.log(paramObj)

const LNGLAT_SANTAMONICA = [-118.52117896492756, 34.01321393735];
const DEFAULT_PIN = {
  coordinates: [0, 0],
  title: "No Title",
  body: "No Body",
  iconUrl: "/assets/pin.png",
};

let pin;
let map;
let updatedLocation;
let coordinates;

async function getDataFromFirebase() {
  // GET DATA FROM PIN

  if (pinId) {
    const snapshot = await get(pinRef);

    if (!snapshot.exists()) {
      document.getElementById("ErrorMsg").innerHTML = "No Pin Data";
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
    const snapshot = await get(objectiveRef);

    if (!snapshot.exists()) {
      document.getElementById("ErrorMsg").innerHTML = "No Quest Data";
      throw new Error("😫 No Quest Data");
    }

    var data = snapshot.val();

    pin = data;

    // Get Coordinates

    if (data.location) {
      var lng = data.location.longitude;
      var lat = data.location.latitude;

      // console.log(data.location);

      if (!lng || !lat) return;

      lng = parseFloat(lng);
      lat = parseFloat(lat);

      pin.coordinates = [lng, lat];
    }

    var navTitle = `<strong>${data.title}</strong> => ${data.body}`;

    document.getElementById("NavTitle").innerHTML = navTitle;

    // ------ ICON IMAGE ------

    let iconUrl;

    if (data.characterId) {
      const characterRef = child(dbRef, `layers/${layerId}/characters/${data.characterId}`);
      const snapshot = await get(characterRef);
      // console.log(snapshot.val())
      iconUrl = await getImageUrlFromAssetPath(snapshot.val().image);
    } else if (data.pinIcon) {
      iconUrl = await getImageUrlFromAssetPath(data.pinIcon);
    } else {
      iconUrl = "/assets/pin.png";
    }

    // ------------------------

    pin.iconUrl = iconUrl;

    pin.coordinates = pin.coordinates || LNGLAT_SANTAMONICA;
  } else if (getQueryParam("item_id")) {
    pin = DEFAULT_PIN;
  } else {
    // console.log("3");
    pin = DEFAULT_PIN;
  }
}

async function loadMap() {
  mapboxgl.accessToken = mapboxToken;

  // the following code includes saving where the user is on the map

  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};

  // console.log(pin);
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

  // Show Button
  document.getElementById("ConfirmButton").style.display = "block";
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
          iconSize: [30, 30],
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

  console.log("4");
  // Create a DOM pinst for marker.
  const el = document.createElement("div");
  const width = marker.properties.iconSize[0];
  const height = marker.properties.iconSize[1];

  el.className = "marker";
  el.style.backgroundImage = `url(${pin.iconUrl})`;
  el.style.width = `${width}px`;
  el.style.height = `${height}px`;
  el.style.backgroundSize = "100%";
  el.style.backgroundColor = "white";

  el.style.borderRadius = "100%";
  el.style.border = "solid 2px white";

  // Create a popup, but don't add it to the map yet.
  const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
    offset: 35,
  });

  // console.log("geometry");
  // console.log(marker.geometry);

  updatedLocation = {
    lastMoved: new Date().getTime(),
    location: {
      type: "latlng",
      latitude: marker.geometry.coordinates[1],
      longitude: marker.geometry.coordinates[0],
    },
  };

  // HOVER STATES
  el.addEventListener("mouseenter", (e) => {
    // Change the cursor style as a UI indicator.

    map.getCanvas().style.cursor = "pointer";

    const coordinates = updatedLocation
      ? [updatedLocation.location.longitude, updatedLocation.location.latitude]
      : marker.geometry.coordinates.slice();

    const description = marker.properties.description;

    popup.setLngLat(coordinates).setHTML(description).addTo(map);

    // document.getElementById("map").querySelector("canvas").style.opacity = 0.7; // DARKEN MAP
  });
  el.addEventListener("mouseleave", () => {
    map.getCanvas().style.cursor = "";
    popup.remove();

    // document.getElementById("map").querySelector("canvas").style.opacity = 1.0; // DARKEN MAP
  });

  const markerObj = new mapboxgl.Marker(el, { draggable: true })
    .setLngLat(marker.geometry.coordinates)
    .addTo(map);

  // DRAG LISTENER
  markerObj.on("dragend", function onDragEnd(e) {
    console.log("drag end");
    const lngLat = markerObj.getLngLat();

    updatedLocation = {
      lastMoved: new Date().getTime(),
      location: {
        type: "latlng",
        latitude: lngLat.lat,
        longitude: lngLat.lng,
      },
    };

    popup
      .setLngLat([updatedLocation.location.longitude, updatedLocation.location.latitude])
      .setHTML(marker.properties.description)
      .addTo(map);

    // update(pinRef, updatedLocation);
  });
}

async function onConfirmClick() {
  console.log("clicked cors");

  var queryParamsString = window.location.search;

  console.log(queryParamsString);

  const BASE_URL = "https://smileycap-bot.herokuapp.com/api/pin"; //?questId=test_id&layerId=953019908948635708&objectiveId=-Nl1Vyrl3uqSs68rXn2L";

  var lat = updatedLocation.location.latitude;
  var lng = updatedLocation.location.longitude;

  var queryParamsToSend = `${queryParamsString}&latitude=${lat}&longitude=${lng}`;

  

  var apiEndpoint = BASE_URL + queryParamsToSend;

  console.log(apiEndpoint);

  let headers = new Headers();

  fetch(apiEndpoint, {
    method: "GET", // or 'PUT'
    mode: "cors",
    headers: headers,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

async function initialize() {
  await getDataFromFirebase();
  await loadMap();
  await addDraggableMarkerToMap();

  document.getElementById("ConfirmButton").addEventListener("click", onConfirmClick);
  // document.getElementById("ConfirmButton2").addEventListener("click", onConfirmClick2);
  // document.getElementById("ConfirmButton3").addEventListener("click", onConfirmClick3);
}

// --- Entry Point ----

initialize();
