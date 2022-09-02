import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-app.js";

import {
getAuth,
onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.9.3/firebase-auth.js";
const firebaseConfig = {
apiKey: "AIzaSyC0OgKnDqQYYpC1CWowjO0korvax2bFpOE",
authDomain: "running-ranking.firebaseapp.com",
projectId: "running-ranking",
storageBucket: "running-ranking.appspot.com",
messagingSenderId: "660141883268",
appId: "1:660141883268:web:fb085fe07d779f859da7d1",
measurementId: "G-MQ2CVEQL0X",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
var uid;
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        console.log("User is signed out");
    } else {
        uid = user.uid;
    }
});
document.querySelector("#submit").onclick = async (event) =>
{
    var level = Number(document.querySelector("#level").value);
        if(level < 1)level = 1;
        else if(level > 3)level = 3;
        console.log(level);
    var date = new Date(document.querySelector("#birthday").value);
    
    if(document.querySelector("#name").value != "" && 
        document.querySelector("#birthday").value!="" && 
        document.querySelector("#level").value!="")
    {
        var level = Number(document.querySelector("#level").value);
        if(level < 1)level = 1;
        else if(level > 3)level = 3;
        const res = await fetch("/user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                    uid:uid,
                    name:document.querySelector("#name").value,
                    level:level,
                    birthday:date
                }),
            });
        window.location.href = ("top.html")
    }
}