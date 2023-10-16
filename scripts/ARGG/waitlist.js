import { serializeForm } from "../helpers.js";
import { addUserToWaitlist, getWaitlistCounter } from "./firebase-firestore.js";

let form = document.querySelector("#EmailCapture");

let formSubmissionCount = 0;

const fakeEmails = [
  "han@solo.com",
  "chewy@baca.couugggguugbhghghghgughhg",
  "princess@leia.com",
  "darth@vader.com",
  "r2@d2.com",
  "c3@po.com",
  "com.dagobah@yoda",
];

form.addEventListener("submit", (event) => {
  // Intercept form submission
  event.preventDefault();

  // Get all field data from the form
  let data = new FormData(form);

  // Convert to an object
  let formObj = serializeForm(data);

  const { email } = formObj;

  if(!email) return;

  const userProperties = {
    emailAddress: email,
    userAgent: navigator.userAgent,
    createdAt: new Date(),
  };

  addUserToWaitlist(userProperties).then((waitlistUserCount) => {
    // Append Success Message
    const successResponseMessage1 = "You are " + waitlistUserCount + " in line";
    const successResponseMessage2 = "Your friend is " + waitlistUserCount + " in line";

    var paragraph = document.createElement("p");
    paragraph.style.color = "green";
    paragraph.textContent = formSubmissionCount === 0 ? successResponseMessage1 : successResponseMessage2;
    document.body.append(paragraph);

    // Clear Input
    document.querySelector("#EmailInput").value = "";

    // Funny new placeholder email to encourage their friend to join
    var placeholderText = fakeEmails[formSubmissionCount];

    if (placeholderText) {
      document.querySelector("#EmailInput").placeholder = placeholderText;
    } else {
      document.querySelector("#EmailInput").placeholder = "";
      document.querySelector("#JoinButton").disabled = true;
      document.querySelector("#JoinButton").innerHTML = "You Joined";
    }

    formSubmissionCount++;
  });
});

// On Page Load...

(function () {
  // getWaitlistCounter().then(counterValue => {
  //     console.log(counterValue)
  // })
})();
