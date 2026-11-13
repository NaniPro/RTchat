import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  doc,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  getDoc,
  setDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAoYHZnGBa9Ys3ahbzEACb0K0BADXcC5Zw",
  authDomain: "deepbase-c6460.firebaseapp.com",
  projectId: "deepbase-c6460",
  storageBucket: "deepbase-c6460.appspot.com",
  messagingSenderId: "564043588851",
  appId: "1:564043588851:web:9c0fb3f15ee7f7a43fc386",
  measurementId: "G-Y71HGQK2ZS",
  databaseURL: "https://deepbase-c6460-default-rtdb.firebaseio.com"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const pfpContainer = document.getElementById("confirmPfp")
const pfpDiv = document.getElementById("pfpDiv");
const pfpDivShadow = document.getElementById("confirmPfp-Shadow");
const pfpImg = document.getElementById("confirmPfp-img");
const pfpCancelBtn = document.getElementById("pfpCancelBtn");
const pfpRange = document.getElementById("confirmPfpRange");
let currentUid = "";
let email = "";

onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUid = user.uid;
    getProfilePic(currentUid);
    document.getElementById("uid").innerHTML =
      (user.displayName || "UserName not Found!");
  }

  email = user.email

  console.log(user)
  document.getElementById("email").innerHTML =
    (email || "Email not Found!")

  document.getElementById("emailStat").innerHTML =
    (user.emailVerified)

  document.getElementById("phoneNumber").innerHTML =
    (user.phoneNumber ? user.phoneNumber : "none.")

  document.getElementById("userUid").innerHTML =
    `"${user.uid}"`

  document.getElementById("createdAt").innerHTML =
    (user.metadata.creationTime + ".")

});


let name = localStorage.getItem("username");
console.log(name);

const username = document.getElementById("username");

username.innerHTML = name;





//Cloudinary


const cloudName = "dzbus222s";
const uploadPreset = "unsigned_preset";



document.getElementById("profilePicture").addEventListener("change", async (e) => {
  let file = e.target.files[0]

  if (!file) return;

  pfpContainer.style.display = "block"
  pfpDivShadow.style.display = "block"

  const url = URL.createObjectURL(file);

  pfpImg.src = url;

  uploadImage(file);
})



async function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    console.log("Upload response:", data);

    if (data.error) {
      console.error("Cloudinary error:", data.error.message);
    } else {
      console.log("File URL:", data.secure_url);
      saveProfilePic(currentUid, data.secure_url)
    }
  } catch (err) {
    console.error("Upload failed:", err);
  }
}



async function saveProfilePic(userUid, URL) {
  try {

    await setDoc(doc(db, "users", userUid), { profile: URL }, { merge: true });

    console.log("saved Profile Safely!")
    getProfilePic(userUid);
  } catch (err) {
    console.error(err);
  }
}
let profileURL = "";
const pfp = document.getElementById("pfp")

async function getProfilePic(userUID) {
  try {

    const ref = doc(db, "users", userUID)
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data();
      profileURL = data.profile;

      pfp.src = data.profile
      console.log(pfp.src)
    }

  } catch (err) {
    console.error(err);
  }
}



async function saveOnUser(userUid, message) {
  try {

    await setDoc(doc(db, "users", userUid), { keyValue: message }, { merge: true });

    console.log("saved message!")
  } catch (err) {
    console.error(err);
  }
}


//confirming the pfp

window.onload = () => {
  // Hide the divs initially

  if (pfpContainer) pfpContainer.style.display = "none";
  if (pfpDivShadow) pfpDivShadow.style.display = "none";

  if (pfpRange) {
    pfpRange.addEventListener("input", (e) => {
      console.log(e.target.value);
      let zoomFactor = e.target.value / 20;
      if (pfpImg && pfpImg.src !== "") {
        pfpImg.style.transform = `scale(${zoomFactor})`;
        pfpImg.style.transformOrigin = "center center";
      }
    });
  }

  if (pfpCancelBtn) {
    pfpCancelBtn.addEventListener("click", () => {
      console.log("Cancel clicked");
      if (pfpContainer) pfpContainer.style.display = "none";
      if (pfpDivShadow) pfpDivShadow.style.display = "none";
    });
  }
};
