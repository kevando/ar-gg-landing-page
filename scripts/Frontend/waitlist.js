import { serializeForm } from "../helpers.js";
import { addUserToWaitlist } from "../Backend/firebase-firestore.js";

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
    const paragraph = document.createElement("p");

    paragraph.style.color = "green";
    paragraph.textContent = formSubmissionCount === 0 ? successResponseMessage1 : successResponseMessage2;
    document.body.append(paragraph);

    // Clear Input, suggest to the user they should enter another
    document.querySelector("#EmailInput").value = "";

    // A new placeholder email to encourage their friend to join
    var placeholderText = fakeEmails[formSubmissionCount];

    if (placeholderText) {
      // Select another silly fake email from the list
      document.querySelector("#EmailInput").placeholder = placeholderText;
    } else {
      // User maxed out our list of funny emails lol
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
