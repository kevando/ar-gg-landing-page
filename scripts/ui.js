const UI = {
  wrapper: document.querySelector('.claim-item'),
  button: document.querySelector('.btn'),
  modelViewer: document.querySelector('.model-viewer'),
  updateBar: document.querySelector('.update-bar'),
  loadingWrapper: document.querySelector('.loading-wrapper'),

  init: function() {
    UI.wrapper.classList.remove("pre-load");
    UI.wrapper.classList.add("loading");

  },
  loading: function() {
    UI.updateBar.classList.add("loaded");
  },
  loaded: function() {
    UI.wrapper.classList.remove("loading");
    UI.wrapper.classList.add("loaded");
  },

  showError: function(msg) {
    document.querySelector('.error-message p').innerHTML = msg;
    document.querySelector('.error-message').style.display = "block";
    this.loadingWrapper.style.visibility = "hidden"
  }
};


export default UI;