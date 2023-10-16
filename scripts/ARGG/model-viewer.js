const BLASTER_ASSET_URL = "https://firebasestorage.googleapis.com/v0/b/ar-gg-af27b.appspot.com/o/assets%2FARGG_Zapper.glb?alt=media&token=e40420cd-706d-4822-b350-c5f2f1768a2c&_gl=1*1g8thjj*_ga*MTAxNzAwMDEwMC4xNjk2NjAzOTgz*_ga_CW55HF8NVT*MTY5NzQ0NDAwMi45LjEuMTY5NzQ0NDAyNy4zNS4wLjA."; //res.assetURL;

var $modelViewer = document.querySelector(".model-viewer");



$modelViewer.addEventListener("model-visibility", (event) => {
  if (event.detail.visible === true) {
    console.log("model is loaded");

    // loaded
    document.querySelector(".claim-item").classList.remove("loading");
    document.querySelector(".claim-item").classList.add("loaded");
  }
});

const renderModel = async function () {
  try {
    // init
    document.querySelector(".claim-item").classList.remove("pre-load");
    document.querySelector(".claim-item").classList.add("loading");

    $modelViewer.src = BLASTER_ASSET_URL;

    // trigger model to render (i think)
    $modelViewer.dismissPoster();
  } catch (err) {
    console.log(err.message);
    UI.showError(err.message);
  }
};

renderModel();
