import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import {
  ref,
  get,
  child,
  getDatabase,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

var firebaseConfig = {
  apiKey: "AIzaSyDjhqfSDix_SRJhByCqjRTWHC8iH5j-5Q0",
  authDomain: "ar-gg-af27b.firebaseapp.com",
  databaseURL: "https://ar-gg-af27b-default-rtdb.firebaseio.com",
  projectId: "ar-gg-af27b",
  storageBucket: "ar-gg-af27b.appspot.com",
};

const firebaseApp = initializeApp(firebaseConfig);
const dbRef = ref(getDatabase(firebaseApp));
const scoresRef = child(dbRef, `scores/`);

// On Page Load...

let list = document.querySelector("#LeaderboardList");
let highScoreText = document.querySelector("#HighScore");

const displayScores = async (snapshot) => {
  var scores = [];

  snapshot.forEach((childSnapshot) => {
    const childKey = childSnapshot.key;
    const childData = childSnapshot.val();
    scores.push(childData);
  });

  // sort

  scores.sort((a, b) => b - a);

  // display
  list.innerHTML = "";
  scores.forEach((score, index) => {
    console.log(score);
      const listItem = document.createElement("li");
      listItem.innerHTML = `<span>${score}</span>`;
      list.appendChild(listItem);
  });
};


const displayHighScore = async (snapshot) => {
    var scores = [];
  
    snapshot.forEach((childSnapshot) => {
      const childData = childSnapshot.val();
      scores.push(childData);
    });
  
    // sort
  
    scores.sort((a, b) => b - a);
  
    // display
    highScoreText.innerHTML = "HIGH SCORE: " + scores[0];
    
  };

(function () {
  onValue(scoresRef, displayHighScore);
})();
