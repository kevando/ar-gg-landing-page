import {initializeApp} from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";

var firebaseConfig = {
  apiKey: "AIzaSyDjhqfSDix_SRJhByCqjRTWHC8iH5j-5Q0",
  authDomain: "ar-gg-af27b.firebaseapp.com",
  databaseURL: "https://ar-gg-af27b-default-rtdb.firebaseio.com",
  projectId: "ar-gg-af27b",
  storageBucket: "ar-gg-af27b.appspot.com",
};

export const app = initializeApp(firebaseConfig);