import {getStorage, getDownloadURL, ref} from "https://www.gstatic.com/firebasejs/9.8.2/firebase-storage.js";
import {app} from '/scripts/firebase-init.js';

const storage = getStorage(app);

const getAssetURLFromFirebase = async (assetPath) => {
  // console.log("Looking for: " + assetPath);
  const storageRef = ref(storage, assetPath);
  return getDownloadURL(storageRef)
    .then((url) => {
      // Potentially start loading it here...
      return url;
    });
};


export {
  getAssetURLFromFirebase
};