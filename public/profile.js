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
const user_name = document.getElementById("name");
const user_birthday = document.getElementById("birthday");
const user_level = document.getElementById("level");
const betClear = document.getElementById("bet_clear");
const betFail = document.getElementById("bet_fail");
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const uid = user.uid;
    console.log(user.uid);

    const path = `/user?uid=${uid}&targetuid=${uid}`;
    const res = await fetch(path, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    let jsondata = await res.json();
    console.log(jsondata);
    user_name.placeholder = jsondata.name;
    level.value = jsondata.level;
    console.log(toDateTime(jsondata.birthday.seconds));
    user_birthday.value = toDateTime(jsondata.birthday.seconds);
    betClear.innerText = jsondata.betrp.clear;
    betFail.innerText = jsondata.betrp.fail;
  } else {
    // User is signed out
    console.log("User is signed out");
  }
});
function toDateTime(secs) {
  var t = new Date(1970, 0, 1); // Epoch
  t.setSeconds(secs);
  return t;
}

// Get the modal
var modal = document.getElementById("bet_modal");

// Get the button that opens the modal
var btn = document.getElementById("bet_btn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function () {
  modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

let editBtn = document.getElementById("edit");
let username = document.getElementById("name");
let level = document.getElementById("level");
let birthday = document.getElementById("birthday");
editBtn.addEventListener("click", edit);
username.disabled = true;
level.disabled = true;
birthday.disabled = true;
function edit() {
  var updateBtn = document.getElementById("update");
  if (updateBtn.style.display === "none") {
    updateBtn.style.display = "block";
    username.disabled = false;
    level.disabled = false;
    birthday.disabled = false;
  } else {
    updateBtn.style.display = "none";
    username.disabled = true;
    level.disabled = true;
    birthday.disabled = true;
  }
}
// 円グラフ
let canvas = document.getElementById("myChart");
let ctx = canvas.getContext("2d");
let perc = 25;

const config = {
  type: "doughnut",
  data: {
    datasets: [
      {
        data: [perc, 100 - perc],
        backgroundColor: ["#9b59b6", "#889d9e"],
      },
    ],
  },
  options: {
    responsive: true,
    animation: {
      animateScale: true,
      animateRotate: true,
      onComplete: function () {
        var cx = canvas.width / 2;
        var cy = canvas.height / 2;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "16px verdana";
        ctx.fillStyle = "black";
        ctx.fillText(perc + "%", cx, cy);
      },
    },
  },
};

new Chart(ctx, config);
