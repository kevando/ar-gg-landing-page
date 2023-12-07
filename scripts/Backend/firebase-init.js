import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";

const API_KEY = "blah blah blah"

var firebaseConfig = {
  apiKey: API_KEY,
  authDomain: "ar-gg-af27b.firebaseapp.com",
  databaseURL: "https://ar-gg-af27b-default-rtdb.firebaseio.com",
  projectId: "ar-gg-af27b",
  storageBucket: "ar-gg-af27b.appspot.com",
};

export default initializeApp(firebaseConfig);
