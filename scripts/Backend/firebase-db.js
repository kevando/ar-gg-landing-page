import {
  ref,
  get,
  child,
  getDatabase,
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

import firebaseApp from "./firebase-init.js";
import { getAssetURLFromFirebase } from "./firebase-storage.js";

const dbRef = ref(getDatabase(firebaseApp));

const getItemDataFromFirebase = async (itemId) => {
  return get(child(dbRef, `items/${itemId}`)).then((snapshot) => {
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      throw new Error("No data available");
    }
  });
};

const getInviteData = async (inviteId) => {
  const SOME_ID = "953019908948635708";

  const inviteSnapshot = await get(child(dbRef, `invites/${SOME_ID}/${inviteId}`));

  if (!inviteSnapshot.exists()) {
    throw new Error("No invite data available");
  }

  const inviteData = inviteSnapshot.val();

  if (!inviteData.itemId) {
    throw new Error("No Item ID!");
  }
  const itemSnapshot = await get(child(dbRef, `items/${inviteData.itemId}`));

  if (!itemSnapshot.exists()) {
    throw new Error("No item data available\n" + inviteData.itemId);
  }
  const itemData = itemSnapshot.val();

  const assetURL = await getAssetURLFromFirebase(itemData.asset);

  // console.log(itemData);

  return {
    ...inviteData,
    itemData: itemData,
    assetURL: assetURL,
  };
};

const generateHeadsetCode = () => {
  return Math.floor(10000 + Math.random() * 90000);
};

export { getInviteData, getItemDataFromFirebase, generateHeadsetCode };
