import { getFirestore, collection, getDocs, doc, getDoc, addDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

import firebaseApp from "./firebase-init.js";

const db = getFirestore(firebaseApp);

const statsRef = doc(db, "gg-waitlist", "--stats--");
const waitlistRef = collection(db, "gg-waitlist");

// ------------  ADD USER TO WAITLIST ------------

async function addUserToWaitlist(emailAddress) {
  var waitlistUserCount = await getWaitlistCounter();

  const waitlistUserData = {
    name: "No Name Yet",
    emailAddress: emailAddress,
    rank: waitlistUserCount,
  };

  await addDoc(waitlistRef, waitlistUserData);
  console.log("1");
  await incrementWaitlistCounter(waitlistUserCount);

  console.log("4");

  console.log(waitlistUserCount);

  return waitlistUserCount;
}

// ------------  GET WAITLIST COUNTER ------------

async function getWaitlistCounter() {
  return getDoc(statsRef).then((docSnap) => docSnap.data().userCount);
}

async function incrementWaitlistCounter(prevVal) {
  const newVal = prevVal + 1;
  const statsRef = doc(db, "gg-waitlist", "--stats--");

  await updateDoc(statsRef, {
    userCount: newVal,
  });


  return newVal;
}

// ------------  GET GENERIC COLLECTION ------------

async function getCollection(collectionName) {
  const querySnapshot = await getDocs(collection(db, collectionName));

  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data()}`);
  });
}

export { getWaitlistCounter, addUserToWaitlist, getCollection };

// TODO: update permissions
// https://stackoverflow.com/questions/46590155/firestore-permission-denied-missing-or-insufficient-permissions
