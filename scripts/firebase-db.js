import {ref, get, child, getDatabase} from "https://www.gstatic.com/firebasejs/9.8.2/firebase-database.js";
import {app} from '/scripts/firebase-init.js';

const dbRef = ref(getDatabase(app));

const getItemDataFromFirebase = async (itemId) => {
  return get(child(dbRef, `items/${itemId}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        throw new Error("No data available");
      }
    });
}


export {
  getItemDataFromFirebase
}