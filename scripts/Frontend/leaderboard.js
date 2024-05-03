import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import {
  ref,
  get,
  child,
  getDatabase,
  onValue,
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

export const encodedKey = "QUl6YVN5RGJJMUFJUERETFdhY0tvbGFFZlRKWkJKbi1sdkhnYVdn";

export const firebaseConfig = {
    apiKey: atob(encodedKey),
    databaseURL: "https://gotcha-9fa1d-default-rtdb.firebaseio.com",
    projectId: "gotcha-9fa1d",
    storageBucket: "gotcha-9fa1d.appspot.com",
  };

const firebaseApp = initializeApp(firebaseConfig);
const dbRef = ref(getDatabase(firebaseApp));
const scoresRef = child(dbRef, `scores/lasertag`);

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
