// import {ref, get, child} from "https://www.gstatic.com/firebasejs/9.8.2/firebase-database.js";
// import {dbRef} from '/scripts/firebase-init.js';

import {getAssetURLFromFirebase} from '/scripts/firebase-storage.js';
import {getItemDataFromFirebase} from '/scripts/firebase-db.js';

const urlParams = new URLSearchParams(window.location.search);
const itemId = urlParams.get('itemId');


var statusMsg = document.getElementById("Status");

main();

// ---------


const onModelReady = (event) => {
  if (event.detail.visible === true) {
    console.log("model loaded")
    // Model is loaded
    document.querySelector('.zapper').scale = "0.8 0.8 0.8";
    // 	document.querySelector('.zapper').scale = "2 2 2";
  }
};

// document.querySelector('.zapper').addEventListener('model-visibility', onModelReady);

var modelViewer = document.querySelector('.zapper');

function renderItem(data) {

  console.log(data)

  modelViewer.addEventListener('model-visibility', (event) => {
    if (event.detail.visible === true) {
      // statusMsg.innerHTML = "Model Downloaded";
      // Model is loaded
      
      document.querySelector('.zapper').scale = "0.8 0.8 0.8";
      
      setTimeout(function() {
        document.querySelector('.zapper').classList.add("loaded");
      }, 500);

      setTimeout(function() {
        statusMsg.innerHTML = data.name + "<br>" + data.amount + " left"
      }, 1200);
      
    }
  });

  // console.log(data)
  // Hide Loading...

  // Show Item!

  document.querySelector('.zapper').src = data.assetURL

  
  


}

function renderError(msg) {

  document.querySelector("#Status").innerHTML = msg;
  document.querySelector("#Status").style.color = "red"
  document.querySelector("#Status").style.backgroundColor = "black"
  document.querySelector("#Status").style.fontFamily = "Courier";
  document.querySelector("#Status").style.fontSize = "18px";
  document.querySelector("#Status").style.padding = "5px";
  
}



async function main() {

  try {

    if(!itemId) throw new Error("itemId not found")

    statusMsg.innerHTML = "Fetching Data";
    const itemData = await getItemDataFromFirebase(itemId);

    statusMsg.innerHTML = "Fetching Model URL";
    const assetURL = await getAssetURLFromFirebase(itemData.asset);

    const pageData = {
      ...itemData,
      assetURL: assetURL
    };
    
    statusMsg.innerHTML = "Downloading Model";
    renderItem(pageData);
  } catch (err) {
    renderError(err.message);
  }
}


//   // Start Load Bar
//   setTimeout(() => {
//     document.querySelector('.update-bar').classList.add("loaded");
//   }, 500);

//   // Loading Bar Completes after 


setTimeout(function() {
  //     document.querySelector('.forging-container').classList.add("hide");
  //     document.querySelector('.loading-container').classList.add("hide");
  //     document.querySelector('.spotlight').classList.remove("hide");
  //     document.querySelector(".logo").style.visibility = "hidden";
  // document.querySelector('.btn-container').classList.remove("hide");
  // document.querySelector('.zapper').src = "https://firebasestorage.googleapis.com/v0/b/ar-gg-af27b.appspot.com/o/assets%2FARHOUSE_TROPHY3.glb?alt=media&token=48ebb4b1-0bf2-4464-8c93-0b70a9deede5";
  // document.querySelector('.zapper').classList.add("loaded");
  // document.querySelector('#Loading').classList.add("loaded");
}, 1000);


// function onBtnClick() {
//   document.getElementById("DiscordBtn").innerHTML = "CLAIMING";

//   var inviteUrl = document.getElementById("DiscordBtn").getAttribute("data-url");
//   console.log(inviteUrl)

//   setTimeout(() => {
//     window.open(inviteUrl);
//     showClaimedState();
//   }, 500);
// }

// function showClaimedState() {
//   document.querySelector(".zapper").style.visibility = "hidden";
//   document.querySelector(".loading-container").style.visibility = "hidden";
//   document.querySelector(".logo").style.visibility = "visible";

//   document.getElementById("DiscordBtn").style.visibility = "hidden";
//   // document.getElementById("DiscordBtn").style.transform = "rotate(15deg)";
//   // document.querySelector(".btn-container").style.bottom = "30%";
//   // document.querySelector(".btn-container").style.width = "70%";
//   // document.querySelector(".btn-container").style.left = "16%";
// }

// const onModelReady = (event) => {
//   if (event.detail.visible === true) {
//     // Model is loaded
//     document.querySelector('.zapper').scale = "0.8 0.8 0.8";
//     // 	document.querySelector('.zapper').scale = "2 2 2";
//   }
// };

// window.addEventListener('DOMContentLoaded', onReady);
// document.getElementById("DiscordBtn").addEventListener("click", onBtnClick);
// document.querySelector('.zapper').addEventListener('model-visibility', onModelReady);


