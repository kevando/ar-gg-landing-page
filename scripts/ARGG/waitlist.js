import { serializeForm } from "../helpers.js";
import { addUserToWaitlist, getWaitlistCounter } from "./firebase-firestore.js";


let form = document.querySelector("#EmailCapture");

form.addEventListener("submit", (event) => {
  // Intercept form submission
  event.preventDefault();

  // Get all field data from the form
  let data = new FormData(form);

  // Convert to an object
  let formObj = serializeForm(data);

  console.log(formObj);

  const { email } = formObj

  addUserToWaitlist(email).then(counterValue => {

    // Hide email input

    // Display counter
  })

  
});



// On Page Load...

(function() {

    
    getWaitlistCounter().then(counterValue => {
        console.log(counterValue)
    })
 
 })();