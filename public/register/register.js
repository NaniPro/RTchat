import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";


const firebaseConfig = {
  apiKey: "AIzaSyDplz1uLdNr5Ukrd8ZUxaxeQOnbIqRmr0M",
  authDomain: "rtchat-36140.firebaseapp.com",
  databaseURL: "https://rtchat-36140-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "rtchat-36140",
  storageBucket: "rtchat-36140.firebasestorage.app",
  messagingSenderId: "356317933784",
  appId: "1:356317933784:web:ab9524f2f725c561a167ad",
  measurementId: "G-G5SYTLX95D"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const analytics = getAnalytics(app);


const registerForm = document.getElementById("registerForm");
const password = document.getElementById("password");
const passButton = document.getElementById("passbutton");
const checkBox = document.getElementById("checkBox");
const emailInput = document.getElementById("email");
const emailError = document.getElementById("emailError");
const userName = document.getElementById("Username");


passButton.addEventListener("click", (event) => {
  event.preventDefault();
  if (password.type === "password") {
    password.type = "text";
    passButton.style.color = "#463774";
  } else {
    password.type = "password";
    passButton.style.color = "#6D54B5";
  }
});


registerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!checkBox.checked) {
    confirm("You have to agree to the terms and conditions.");
    return;
  }

  const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  if (!emailPattern.test(emailInput.value)) {
    emailError.textContent = "Please enter a valid Gmail address.";
    return;
  } else {
    emailError.textContent = "";
  }

  const email = emailInput.value;
  const pass = password.value;
  const username = userName.value;

  createUserWithEmailAndPassword(auth, email, pass)
    .then((userCredential) => {
      const user = userCredential.user;

      return updateProfile(user, { displayName: username }).then(() => {
        return set(ref(db, "users/" + user.uid), {
          username: username,
          email: email
        });
      });
    })
    .then(() => {
      console.log("Account created with username:", auth.currentUser.displayName);
      window.location.href = "../dashboard/dashboard.html"
    })
    .catch((error) => {
      console.error("Registering Error:", error.code, error.message);
      alert("Creating the account failed: " + error.message);
    });
});
