import {getAssetURLFromFirebase} from '/scripts/firebase-storage.js';
import {getItemDataFromFirebase} from '/scripts/firebase-db.js';

const DEFAULT_ITEM = "968656370595422238";

var statusMsg = document.getElementById("Status");
var modelViewer = document.querySelector('.zapper');

let item = {};

main();

// ---------

function getItemId() {
  const urlParams = new URLSearchParams(window.location.search);
  const itemId = urlParams.get('itemId');
  return itemId || DEFAULT_ITEM;
}

const onModelReady = (event) => {
  if (event.detail.visible === true) {
    console.log("model loaded");
    // Model is loaded
    document.querySelector('.zapper').scale = "0.8 0.8 0.8";
    // 	document.querySelector('.zapper').scale = "2 2 2";
  }
};


function renderItem() {

  // Fetch model
  modelViewer.src = item.assetURL;

  modelViewer.addEventListener('model-visibility', (event) => {
    if (event.detail.visible === true) {
      // Model is downloaded & ready
      modelViewer.scale = "0.8 0.8 0.8";
      showModel();
    }
  });
}

function renderError(msg) {

  document.querySelector("#Status").innerHTML = msg;
  document.querySelector("#Status").style.color = "red";
  document.querySelector("#Status").style.backgroundColor = "black";
  document.querySelector("#Status").style.fontFamily = "Courier";
  document.querySelector("#Status").style.fontSize = "18px";
  document.querySelector("#Status").style.padding = "5px";

}



async function main() {

  try {

    statusMsg.innerHTML = "Fetching Data";
    const itemData = await getItemDataFromFirebase(getItemId());

    statusMsg.innerHTML = "Fetching Model URL";
    const assetURL = await getAssetURLFromFirebase(itemData.asset);

    item = {
      ...itemData,
      assetURL: assetURL
    };

    statusMsg.innerHTML = "Downloading Model";
    renderItem();
  } catch (err) {
    renderError(err.message);
  }
}


//   // Start Load Bar
setTimeout(() => {
  document.querySelector('.update-bar').classList.add("loaded");
}, 500);

//   // Loading Bar Completes after 


function showModel() {

  setTimeout(function() {
    modelViewer.classList.add("loaded");
  }, 200);

  setTimeout(function() {
    statusMsg.innerHTML = item.name + "<br>" + item.amount + " left";
  }, 1200);

      document.querySelector('.forging-container').classList.add("hide");
      document.querySelector('.loading-container').classList.add("hide");
      document.querySelector('.spotlight').classList.remove("hide");
      document.querySelector(".logo").style.visibility = "hidden";
  document.querySelector('.btn-container').classList.remove("hide");
  document.querySelector('#DiscordBtn').innerHTML = "Claim " + item.name + " (" + item.amount + ")";
}


function onBtnClick() {
  document.getElementById("DiscordBtn").innerHTML = "CLAIMING";

  var inviteUrl = "https://discord.gg/hUYwd6sJ"

  setTimeout(() => {
    window.open(inviteUrl);
    showClaimedState();
  }, 500);
}

function showClaimedState() {
  document.querySelector(".zapper").style.visibility = "hidden";
  document.querySelector(".loading-container").style.visibility = "hidden";
  document.querySelector(".logo").style.visibility = "visible";

  document.getElementById("DiscordBtn").style.visibility = "hidden";
  // document.getElementById("DiscordBtn").style.transform = "rotate(15deg)";
  // document.querySelector(".btn-container").style.bottom = "30%";
  // document.querySelector(".btn-container").style.width = "70%";
  // document.querySelector(".btn-container").style.left = "16%";
}


document.getElementById("DiscordBtn").addEventListener("click", onBtnClick);


