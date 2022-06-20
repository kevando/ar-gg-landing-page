import {getInviteData} from '/scripts/ARGG/firebase-db.js';


var UI = {
  wrapper: document.querySelector('.claim-item'),
  button: document.querySelector('.btn'),
  modelViewer: document.querySelector('.model-viewer'),

  init: function() {
    UI.wrapper.classList.remove("pre-load");
    UI.wrapper.classList.add("loading");
  },
  loaded: function() {
    UI.wrapper.classList.remove("loading");
    UI.wrapper.classList.add("loaded");
  },

  showError: function(msg) {
    document.querySelector('.error-message p').innerHTML = msg;
    document.querySelector('.error-message').style.display = "block";
  }
};


UI.init()

setTimeout(() => {
  document.querySelector('.update-bar').classList.add("loaded");
}, 50);


UI.modelViewer.addEventListener('model-visibility', (event) => {
  if (event.detail.visible === true) {
    console.log("model is loaded");

    UI.loaded()
  }
});


export const renderItemByInviteId = async function(inviteId) {

  try {

    const res = await getInviteData(inviteId);

    console.log("data back from firebase looks good...");
    console.log("now load the model");

    document.title = "Claim the AR.GG " + res.itemData.name;

    UI.modelViewer.src = res.assetURL;
    UI.modelViewer.dismissPoster(); // triggers model to render i think

    // Enable button
    UI.button.disabled = false;
    UI.button.innerHTML = `Claim ${res.itemData.name} ${res.itemData.amount || res.amount} left`;
    UI.button.addEventListener("click", function() {
      UI.button.innerHTML = "CLAIMING";

      const inviteCode = res.code || inviteId;

      var inviteUrl = `https://discord.gg/${inviteCode}`;

      setTimeout(() => {
        alert("opening ---> " + inviteUrl);
        // window.open(inviteUrl);

        // SHOW CLAIMED STATE
        UI.modelViewer.style.visibility = "hidden";
        document.querySelector(".loading-container").style.visibility = "hidden";
        document.querySelector(".logo").style.visibility = "visible";

        UI.button.style.visibility = "hidden";
        showClaimedState();
      }, 500);
    });


    console.log(res);


  } catch (err) {
    console.log(err.message);
    UI.showError(err.message);
  }



};