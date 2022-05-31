
// const onReady = (event) => {

//   // Start Load Bar
//   setTimeout(() => {
//     document.querySelector('.update-bar').classList.add("loaded");
//   }, 500);

//   // Loading Bar Completes after 
//   const loadbarTime = 5000 // miliseconds

//   setTimeout(function() {
//     document.querySelector('.forging-container').classList.add("hide");
//     document.querySelector('.loading-container').classList.add("hide");
//     document.querySelector('.spotlight').classList.remove("hide");
//     document.querySelector(".logo").style.visibility = "hidden";
//     document.querySelector('.btn-container').classList.remove("hide");
//     document.querySelector('.zapper').classList.add("loaded");
//     document.querySelector('#Loading').classList.add("loaded");
//   }, loadbarTime);
// };

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


