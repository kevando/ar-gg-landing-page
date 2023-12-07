import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-storage.js";
import { ref, getDatabase } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

import { encodedKey } from "./constants.js";

export const firebaseConfig = {
  apiKey: atob(encodedKey),
  databaseURL: "https://gotcha-9fa1d-default-rtdb.firebaseio.com",
  projectId: "gotcha-9fa1d",
  storageBucket: "gotcha-9fa1d.appspot.com",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const dbRef = ref(getDatabase(firebaseApp));
export const storage = getStorage(firebaseApp);
