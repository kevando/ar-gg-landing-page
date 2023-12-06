import { encodedKey } from './constants.js'

export const firebaseConfig = {
    apiKey: atob(encodedKey),
    databaseURL: "https://gotcha-9fa1d-default-rtdb.firebaseio.com",
    projectId: "gotcha-9fa1d",
    storageBucket: "gotcha-9fa1d.appspot.com",
};