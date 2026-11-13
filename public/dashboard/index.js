import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js'
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-analytics.js'
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import { getFirestore } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js'
import { collection, getDocs, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
import { getDatabase, ref, set, onValue, push, remove } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";
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
const analytics = getAnalytics(app);
const db = getFirestore(app);
const database = getDatabase(app);
const messagesRef = ref(database, "chats/general/messages");
const newMessageRef = push(messagesRef);
const auth = getAuth(app);



function sendMessage(chatId, messageId,senderid, senderName, text, time) {
    let daypart = null;
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hour = now.getHours();
    const minute = String(now.getMinutes()).padStart(2, "0");
    if(hour >= 12){daypart = 'PM'}else{daypart = 'AM'}
    time = `${year}/${month}/${day}  ${hour}:${minute} ${daypart}`;

    const messagesRef = ref(database, `chats/${chatId}/messages`);
    const newMessageRef = push(messagesRef);

  set(newMessageRef, {
        senderName: senderName,
        senderId: senderid,
        text: text,
        timestamp: time
    });
}
const sendMessageButton = document.getElementById('sendMessage');
const sendArrow = document.getElementById('sendButton');
const inputField = document.getElementById('messageInput');
const messagesDiv = document.getElementById('messages');
const getRef = document.getElementById('getUsers');



async function getRooms(db) {
    const rooms = collection(db, 'rooms');
    const roomSnap = await getDocs(rooms);

    const roomList = roomSnap.docs.map(doc => doc.data());  

    console.log(roomList);
}

onValue(messagesRef, (snapshot) => {
      const messages = snapshot.val();
      const chatBox = document.getElementById("messages-box");
      
      if (messages) {
        chatBox.innerHTML = "";
        Object.keys(messages).forEach((key) => {
          const msg = messages[key];
          if(msg.senderId == currentUser.uid){
            chatBox.innerHTML += `
          
            <div class="messageWrapper">
                <p class="messagesent" data-message-uid="${msg.senderId}">
                    <strong>${msg.senderName}:</strong>
                    <span style="font-size:small">at ${msg.timestamp}</span>
                </p>

                <p>${msg.text} <button class="msgDeleteBtn" id="msgDeleteBtn" data-message-id="${key}">
                    <span class="material-symbols-outlined">delete</span>
                </button></p>

            </div>
            
        `;
          }else{
            chatBox.innerHTML += `
          
            <div class="messageWrapper">
                <p class="messagesent" data-message-uid="${msg.senderId}">
                    <strong>${msg.senderName}:</strong>
                    <span style="font-size:small">at ${msg.timestamp}</span>
                </p>

                <p>${msg.text} <button class="msgDeleteBtn" id="msgDeleteBtn" data-message-id="${key}" hidden>
                    <span class="material-symbols-outlined">delete</span>
                </button></p>

            </div>
            
        `;
          }
        });
        const deleteButtons = document.querySelectorAll(".msgDeleteBtn");

        deleteButtons.forEach((button) => {
            button.addEventListener("click", (e) => {
                const messageId =  e.currentTarget.dataset.messageId;
                
                const message = e.currentTarget.closest(".messageWrapper").querySelector(".messagesent");
                const messageUid = message.dataset.messageUid;


                console.log('Message uid: ' + messageUid + ' currentuser Uid' + currentUser.uid )
                if(messageUid == currentUser.uid){
                    remove(ref(database, `chats/general/messages/${messageId}`));
                    console.log('verified')
                }
            });
        });
      } else {
        chatBox.innerText = "No messages yet.";
      }
      const msgDeleteBtn = document.getElementById('msgDeleteBtn');
      chatBox.scrollTo({
        top: chatBox.scrollHeight,
        behavior: "smooth"
        });
    });




function chatId(){
    return "1"
}
let currentUser = null;

await onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Logged in user:", user);
        console.log("UID:", user.uid);
        console.log("Name:", user.displayName);
        currentUser = user
        console.log("Email:", user.email);
    } else {
        console.log("Nobody is logged in");
        window.location.href = "login.html";
    }
});




sendMessageButton.addEventListener('click', () => {
    sendMessage('general',Date.now() , currentUser.uid,currentUser.displayName, inputField.value)
    console.log('sent message')
    console.log(currentUser.uid)

})

getRef.addEventListener('click', () =>{
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hour = now.getHours(); 
    const minute = String(now.getMinutes()).padStart(2, "0");
    let time = `${hour}:${minute}`;
    console.log(time)
})

sendArrow.addEventListener('click', () =>{
 if(inputField.value.trim() !== ""){
    sendMessage('general', Date.now(),  currentUser.uid, currentUser.displayName, inputField.value)
    inputField.value = '';
    console.log(currentUser.uid)
 }   
})


inputField.addEventListener('keydown', (e) => {
    if (e.key == 'Enter' && inputField.value.trim() !== "") {
        sendMessage('general', Date.now(),  currentUser.uid, currentUser.displayName, inputField.value)
        console.log('sent message')
        inputField.value = '';
    console.log(currentUser.uid)

    }
});
