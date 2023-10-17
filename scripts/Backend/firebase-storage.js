import { getStorage, getDownloadURL, ref } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-storage.js";
import firebaseApp from "./firebase-init.js";

const storage = getStorage(firebaseApp);

const getAssetURLFromFirebase = async (assetPath) => {
  // console.log("Looking for: " + assetPath);
  const storageRef = ref(storage, assetPath);
  return getDownloadURL(storageRef).then((url) => {
    // Potentially start loading it here...
    return url;
  });
};

export { getAssetURLFromFirebase };
