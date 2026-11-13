import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword,updateProfile } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import {
    getFirestore,
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

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
const analytics = getAnalytics(app);

const loginForm = document.getElementById("loginForm");
const password = document.getElementById("password");
const passButton = document.getElementById("passbutton");
const checkBox = document.getElementById("checkBox");
const emailInput = document.getElementById("email");
const emailError = document.getElementById("emailError");

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

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!checkBox.checked) {
    confirm("You have to agree to the terms and conditions.");
    return;
  }

  async function generateUniqueUsername() {

    while (true) {

        const number = Math.floor(1000000 + Math.random() * 9000000);
        const username = `User${number}`;

        const usernameRef = doc(db, "usernames", username);
        const usernameSnap = await getDoc(usernameRef);

        if (!usernameSnap.exists()) {
            return username;
        }
    }
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

signInWithEmailAndPassword(auth, email, pass)

    .then(async (userCredential) => {

        const user = userCredential.user;

        console.log("Logged in:", user.uid);

        if (!user.displayName) {

            const randomNumber = Math.floor(
                1000000 + Math.random() * 9000000
            );

            const username = `User${randomNumber}`;

            await updateProfile(user, {
                displayName: username
            });

            console.log("Generated username:", username);
        }

        window.location.href = "dashboard/dashboard.html";

    })
    .catch((error) => {

        console.error("Login Error:", error.code, error.message);
        alert("Login failed: " + error.message);

    });

});