import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import {
  getStorage,
  getDownloadURL,
  ref as ref_storage,
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-storage.js";
// import {
//   ref,
//   get,
//   child,
//   getDatabase,
//   onValue,
//   set,
//   update,
// } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

import { storage } from "./firebase-config.js";

// // Initialize Firebase

async function getImageUrlFromAssetPath(assetPath) {
  const storageRef = ref_storage(storage, assetPath);
  const imageUrl = await getDownloadURL(storageRef);

  return imageUrl;
}

export { getImageUrlFromAssetPath };
