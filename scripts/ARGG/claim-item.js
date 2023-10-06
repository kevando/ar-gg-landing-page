import {getQueryParam} from "../urls.js";
import {getInviteData} from './firebase-db.js';
import UI from '../ui.js';


UI.modelViewer.addEventListener('model-visibility', (event) => {
  if (event.detail.visible === true) {
    console.log("model is loaded");

    UI.loaded()
  }
});


const render = async function() {

  try {

    const inviteId = getQueryParam('id')
    console.log(inviteId)

    const res = await getInviteData(inviteId);

    UI.init();

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
        
        

        // apperantly this container is no longer there. adding check
        // so it doesnt block the redirect to discord kevo octover  6 2023
        if(document.querySelector(".loading-container")) {
          document.querySelector(".loading-container").style.visibility = "hidden";
        }
        if(document.querySelector(".logo")) {
          document.querySelector(".logo").style.visibility = "visible";
        }
        if(UI.button && UI.button.style) {
          UI.button.style.visibility = "hidden";
        }

        
        // showClaimedState();
      }, 500);
    });


    console.log(res);


  } catch (err) {
    console.log(err.message);
    UI.showError(err.message);
  }

};





render();

