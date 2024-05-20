// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import {
  getStorage,
  getDownloadURL,
  ref as ref_storage,
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-storage.js";
import {
  ref,
  get,
  child,
  getDatabase,
  onValue,
  set,
  update,
  push,
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

import { firebaseConfig } from "./firebase-config.js";
import { mapboxToken } from "./constants.js";
import { generateHeadsetCode } from "../Backend/firebase-db.js";

// // Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const dbRef = ref(getDatabase(firebaseApp));
const storage = getStorage(firebaseApp);

let observerMarkers = {};
let featuresArray = [];

const observersRef = child(dbRef, `maps/obvious/observers/`);
const notificationsRef = child(dbRef, `maps/obvious/notifications/`);
const pinsRef = child(dbRef, `maps/obvious/pins`);
const emailsRef = child(dbRef, `emails`);
const eventsRef = child(dbRef, `events`);

mapboxgl.accessToken = mapboxToken;

const LOGLAT_BARRINGTON = [-88.1380655018482, 42.147436111279276];
const LNGLAT_SANFRAN = [-122.41422638286896, 37.773267497804596];
const LNGLAT_TWOBIT = [-118.231853, 34.0375];
const LNGLAT_TWOBIT_RANDOMIZED = [
  -118.231853 + 0.00013 * Math.random(),
  34.0375 + 0.00013 * Math.random(),
];

const DEFAULT_MAP_STYLE = "mapbox://styles/mapbox/satellite-streets-v12";

const DEFAULT_ZOOM = 18.5;

const AVATAR_URLS = [
  "/assets/avatars/dude_GG.webp",
  "/assets/avatars/pyrogard_GG.webp",
  "/assets/avatars/tidalwave_GG.webp",
  "/assets/avatars/pyrogard_GG.webp",
  "/assets/avatars/tidalwave_GG.webp",
  "/assets/avatars/pyrogard_GG.webp",
  "/assets/avatars/tidalwave_GG.webp",
];

// ------------------------------------------------------------------------
// INITIALIZE userInfo object
// ------------------------------------------------------------------------

// localStorage.clear();

const DATA_VERSION = "2";
const localStorageKey = `userInfo_${DATA_VERSION}`;

const userInfo = JSON.parse(localStorage.getItem(localStorageKey)) || {};

if (!userInfo.uuid) {
  userInfo.uuid = generateUUID();
  userInfo.avatarUrl = AVATAR_URLS[randomInt(0, AVATAR_URLS.length - 1)];
}

// this object is used to manage state like zoom level, position on map
// so when a user returns to the map, they are in the same place
// also sent to firebase for multiplayer feature on map

// ------------------------------------------------------------------------
// INITIALIZE Map
// ------------------------------------------------------------------------

const map = new mapboxgl.Map({
  container: "map",
  style: DEFAULT_MAP_STYLE,
  // center: userInfo.center || LNGLAT_TWOBIT,
  // zoom: userInfo.zoom || DEFAULT_ZOOM,
  center: LNGLAT_TWOBIT_RANDOMIZED,
  zoom: DEFAULT_ZOOM,
  minzoom: 4,
});

// ----- ON MOVE ---

map.on("move", onMove);

function onMove() {
  var previousCenter = userInfo.center || { lat: 0, lgn: 0 };
  var previousZoom = userInfo.zoom || 20;

  userInfo.center = map.getCenter();
  userInfo.zoom = map.getZoom();

  // Update LOCAL
  localStorage.setItem(localStorageKey, JSON.stringify(userInfo));

  // Update SERVER
  const observerRef = child(dbRef, `maps/obvious/observers/${userInfo.uuid}`);

  const now = new Date().getTime();

  update(observerRef, {
    zoom: userInfo.zoom,
    center: userInfo.center,
    avatarUrl: userInfo.avatarUrl,
    updatedAt: now,
  });

  // Update MY PLAYER AVATAR
  var xDelta = previousCenter.lng - userInfo.center.lng;
  var yDelta = previousCenter.lat - userInfo.center.lat;
  var orientation = Math.abs(xDelta) - Math.abs(yDelta);

  var xDirection = xDelta >= 0 ? "LEFT" : "RIGHT";
  var yDirection = yDelta >= 0 ? "DOWN" : "UP";

  // console.log(yDirection)

  var transforms = {};

  transforms["LEFT"] = "ScaleX(1)";
  transforms["RIGHT"] = "ScaleX(-1)";

  transforms["UP"] = "RotateZ(90deg)";
  transforms["DOWN"] = "RotateZ(-90deg)";

  var avatarScale = transforms[xDirection];

  var avatarRotation = ""; //transforms[yDirection]

  var $myAvatarImage = document.getElementById("MyAvatarImage");

  $myAvatarImage.style.transform = `${avatarRotation} ${avatarScale}`;
}
// ---- LOAD MAP -----

async function loadMap() {
  const geojson = {
    type: "FeatureCollection",
    features: featuresArray,
  };

  let itemsLoaded = 0;

  // Add markers to the map.
  for (const marker of geojson.features) {
    itemsLoaded++;

    // Create a DOM element for each marker.
    const el = document.createElement("div");
    const width = marker.properties.iconSize[0];
    const height = marker.properties.iconSize[1];

    el.className = "marker";

    el.style.width = `${width}px`;
    el.style.height = `${height}px`;
    el.style.backgroundSize = "100%";
    el.style.backgroundRepeat = "no-repeat";

    try {
      if (!marker.properties.assetPath) throw new Error("Missing AssestPath");

      const storageRef = ref_storage(storage, marker.properties.assetPath);
      const iconUrl = await getDownloadURL(storageRef);
      el.style.backgroundImage = `url(${iconUrl})`;
    } catch (e) {
      console.log("ERROR downloading image: " + marker.properties.assetPath);
      console.log(e.message);
    }

    // Create a popup, but don't add it to the map yet.
    const popup = new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: false,
      offset: 30,
      className: "map-pin",
    });

    // mouse click event
    // el.addEventListener("click", () => {
    // });

    el.addEventListener("mouseenter", (e) => {
      // Change the cursor style as a UI indicator.

      map.getCanvas().style.cursor = "pointer";

      const coordinates = marker.geometry.coordinates.slice();
      const description = marker.properties.description;

      popup.setLngLat(coordinates).setHTML(description).addTo(map);

      // ANIMATE ON LOAD
    });
    el.addEventListener("mouseleave", () => {
      map.getCanvas().style.cursor = "";

      // delay this so users can click links in the popup
      // setTimeout(() => {
      //   popup.remove();
      // }, 800);
    });

    try {
      //  Add markers to the map.
      new mapboxgl.Marker(el).setLngLat(marker.geometry.coordinates).addTo(map);

      itemsLoaded++;
      document.getElementById("LoadingMsg").innerHTML = `${itemsLoaded} items loaded`;
    } catch (e) {
      console.log("error adding marker");
      console.log(marker);
    }
  }

  console.log("Map done loading");

  // document.getElementById("LoadingMsg").innerHTML = `${featuresArray.length} items loaded`
}

// --- LOAD AVATAR DATA ----

async function listenForDataFromFirebase() {
  onValue(observersRef, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const childKey = childSnapshot.key;
      const childData = childSnapshot.val();

      var lngLat = [childData.center.lng, childData.center.lat];

      if (!childData.updatedAt) {
        // DO NOT RENDER OLDER OBSERVERS legacy
        return;
      }

      const now = new Date().getTime();
      const timeDiff = now - childData.updatedAt;
      const TIMEOUT_VALUE = 300000;

      if (timeDiff > TIMEOUT_VALUE) {
        // DO NOT RENDER OLD OBSERVERS
        return;
      }

      var zoomLevelDiff = userInfo.zoom - childData.zoom;
      var size = range(2, 18, 60, 1500, zoomLevelDiff);
      size = Math.round(size);

      // console.log("size: " + size);

      if (!observerMarkers[childKey]) {
        // Create a DOM element for each marker.
        const el = document.createElement("div");
        const img = document.createElement("img");

        if (userInfo.uuid === childKey) {
          img.id = "MyAvatarImage";
        }

        // ----- STYLE MARKER -----

        // el.innerHTML = size

        const DEFAULT_AVATAR_URL = "/assets/avatars/levitating-man-emoji.png";

        // var iconImage = childData.avatarUrl || DEFAULT_AVATAR_URL;
        var iconImage = DEFAULT_AVATAR_URL;

        img.src = iconImage;
        userInfo.avatarUrl = iconImage;

        el.append(img);

        el.className = "avatar-marker";
        el.style.backgroundRepeat = "no-repeat";
        el.style.backgroundSize = "100%";
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.style.fontSize = `${size}px`;
        // el.style.display = "none";

        // didnt work. for some reason the opacity of a marker always gets reset to 1

        var myOpacity = timeDiff ? range(1000, 100000, 100, 0, timeDiff) : 100;

        myOpacity = Math.round(myOpacity);

        el.style.opacity = myOpacity;

        try {
          observerMarkers[childKey] = new mapboxgl.Marker(el).setLngLat(lngLat).addTo(map);
        } catch (e) {
          console.log("error adding marker");
          console.log(marker);
        }
      } else {
        observerMarkers[childKey].setLngLat(lngLat);

        let el = observerMarkers[childKey].getElement();

        var zoomLevelDiff = userInfo.zoom - childData.zoom;
        var size = range(2, 28, 60, 1500, zoomLevelDiff);
        size = Math.round(size);

        el.style.width = `${size}px`;
        el.style.height = `${size}px`;

        // var myOpacity = timeDiff ? range(1000,100000,100,0,timeDiff) : 100
        // myOpacity = Math.round(myOpacity)
        // el.style.opacity = myOpacity
      }
    });

    var playerCount = Object.keys(observerMarkers).length;
    document.getElementById("PlayerCount").innerHTML =
      playerCount.toString() + " Player" + (playerCount > 1 ? "s" : "") + " on the map ";
  });
}

// ---- load POI data ----

async function getDataFromFirebase() {
  let pins = [];

  return get(pinsRef).then((snapshot) => {
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key;
        const childData = childSnapshot.val();
        pins.push({ ...childData, firebaseKey: childKey });
      });
    } else {
      console.log("No data pin available");
    }

    async function addFeature(pin) {
      var lng = pin.location.longitude;
      var lat = pin.location.latitude;

      if (!lng || !lat) return;

      lng = parseFloat(lng);
      lat = parseFloat(lat);

      var coordinates = [lng, lat];

      featuresArray.push({
        type: "Feature",
        properties: {
          description: `<h2>${pin.title}</h2><p>${pin.body}</p><p><strong>Directions:</strong>&nbsp;&nbsp;&nbsp;<a href='${pin.appleMapsUrl}'>Apple</a>&nbsp;&nbsp;<a href='${pin.googleMapsUrl}'>Google</a></p>`,
          message: "Foo",
          iconSize: [60, 60],
          assetPath: pin.image,
          firebaseKey: pin.firebaseKey,
        },
        geometry: {
          type: "Point",
          coordinates: coordinates,
        },
      });
    }

    console.log("loading 1");
    pins.forEach(addFeature);
  });
}

function generateUUID() {
  var d = new Date().getTime(); //Timestamp
  var d2 = (typeof performance !== "undefined" && performance.now && performance.now() * 1000) || 0; //Time in microseconds since page-load or 0 if unsupported
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = Math.random() * 16; //random number between 0 and 16
    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function notifyPlayerJoinedMap() {
  // do not run for local server
  if (window.location.hostname !== "127.0.0.1") {
    push(eventsRef, {
      resource: "doorbell.mp3",
      type: "sfx",
    });
  }
}

// ----- Initialize ------

async function fetchDataAndLoadMap() {
  listenForDataFromFirebase();
  notifyPlayerJoinedMap();

  await getDataFromFirebase();
  await loadMap();
  onMove(); // show MY avatar when map loads
}

// Entry point
fetchDataAndLoadMap();

// MENU AT TOP

// const layerList = document.getElementById("menu");
// const inputs = layerList.getElementsByTagName("input");

// for (const input of inputs) {
//   input.onclick = (layer) => {
//     const layerId = layer.target.id;
//     map.setStyle("mapbox://styles/" + layerId);
//   };
// }

// ------ Helper Functions ---------

function lerp(x, y, a) {
  return x * (1 - a) + y * a;
}

function clamp(a, min, max) {
  if (!min) {
    min = 0;
  }
  if (!max) {
    max = 1;
  }
  return Math.min(max, Math.max(min, a));
}
function invlerp(x, y, a) {
  return clamp((a - x) / (y - x));
}
function range(x1, y1, x2, y2, a) {
  return lerp(x2, y2, invlerp(x1, y1, a));
}

function radiansToDegrees(rad) {
  return rad * (180 / Math.PI);
}
function degreesToRadians(deg) {
  return (deg * Math.PI) / 180;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ------------------------------------------
//  EMAIL CAPTURE
// ------------------------------------------

var emailForm = document.getElementById("EmailCaptureForm");
var emailInput = document.getElementById("EmailInput");

let formSubmitted = false;

emailForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // RECORD EMAIL TO DATABASE

  const obj = {
    createdAt: new Date().getTime(),
    email: document.getElementById("EmailInput").value,
  };

  push(emailsRef, obj);

  document.getElementById("EmailCaptureTitle").innerHTML = "✅ GG in your inbox";

  setTimeout(() => {
    document.getElementById("EmailCapture").style.opacity = "0";
    hideKeyboard();

    setTimeout(() => {
      document.getElementById("EmailCapture").style.display = "none";
    }, 500);
  }, 800);

  formSubmitted = true;

  push(eventsRef, {
    resource: "email.mp3",
    type: "sfx",
  });

  return false;
});

function hideKeyboard() {
  // Check if any element is actively focused
  if (document.activeElement) {
    document.activeElement.blur();
  }
}

emailInput.addEventListener("focus", function (e) {
  emailInput.placeholder = "";
});
emailInput.addEventListener("blur", function (e) {
  if (!formSubmitted) {
    emailInput.placeholder = "n00b@argg.gg";
  }
});

// on page load event
document.addEventListener("DOMContentLoaded", function () {
  onValue(emailsRef, (snapshot) => {
    var emails = [];
    snapshot.forEach((childSnapshot) => {
      emails.push(childSnapshot.val().email);
    });
    var emailCount = emails.length + 85;
    document.getElementById("EmailCount").innerHTML = emailCount.toString();
    document.getElementById("EmailCapture").style.opacity = 1.0;
  });
});

// ------------------------------------------
// Tether Headset
// ------------------------------------------

function openModal() {
  var modal = document.getElementById("myModal");
  var headsetCode = generateHeadsetCode();
  var codeDisplay = document.getElementById("randomCode");
  codeDisplay.innerHTML = "";

  for (var i = 0; i < headsetCode.toString().length; i++) {
    var span = document.createElement("span");
    span.className = "digit";
    span.innerText = headsetCode.toString()[i];
    codeDisplay.appendChild(span);
  }

  modal.style.display = "block";
}
document.getElementById("openModalBtn").onclick = openModal;

// document.querySelector(".close").onclick = function () {
//   var modal = document.getElementById("myModal");
//   modal.style.display = "none";
// };

window.onclick = function (event) {
  var modal = document.getElementById("myModal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

openModal();
