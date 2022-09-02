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
const user_rp = document.getElementById("rp");
const betClear = document.getElementById("bet_clear");
const betFail = document.getElementById("bet_fail");
const btn_seisan = document.getElementById("liquidation");
let total = 0;
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    // User is signed out
    console.log("User is signed out");
  } else {
    const uid = user.uid;
    let targetuid = getParam("targetid");
    if (targetuid == null) {
      targetuid = uid;
    }
    const path = `/user?uid=${uid}&targetuid=${targetuid}`;
    const res = await fetch(path, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    let jsondata = await res.json();
    console.log(jsondata);
    user_name.placeholder = jsondata.name;
    user_level.value = jsondata.level;
    user_rp.value = jsondata.rp;
    user_birthday.value = jsondata.birthday.split("T")[0];
    betClear.innerText = jsondata.betrp.clear;
    betFail.innerText = jsondata.betrp.fail;
    auth.currentUser.level == 1
      ? (total = 3000)
      : auth.currentUser.level == 2
      ? (total = 5000)
      : (total = 7000);
    // 円グラフ
    let canvas = document.getElementById("myChart");
    let ctx = canvas.getContext("2d");

    let perc = (jsondata.todaysrunning / total) * 100;

    let rounded = perc.toFixed(2);
    const config = {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: [rounded, 100 - rounded],
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
            var cx = canvas.width / 4;
            var cy = canvas.height / 4;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = "16px verdana";
            ctx.fillStyle = "black";
            ctx.fillText(rounded + "%", cx, cy);
          },
        },
      },
    };

    new Chart(ctx, config);
  }
});
// Get the modal
var modal = document.getElementById("bet_modal");

// Get the bet button
var bet = document.getElementById("bet");

// Flag Bet
var betting;

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

btn_seisan.onclick = async function () {
  const path = `/liquidation?uid=${auth.currentUser.uid}`;
  const res = await fetch(path, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  let jsondata = await res.json();
  console.log(jsondata);
  alert("合計の損益は:" + jsondata.pl + "です");
};

// When the user clicks on the button, open the modal
betClear.onclick = function () {
  modal.style.display = "block";
  betting = true;
};
betFail.onclick = function () {
  modal.style.display = "block";
  betting = false;
};

bet.onclick = async function () {
  let wager = document.getElementById("wager").value;
  let targetuid = getParam("targetid");
  const response = await fetch("/bet", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      uid: auth.currentUser.uid,
      targetid: targetuid,
      betting: betting,
      wager: Number(wager),
    }),
  });
  if (response.status === 200) {
    alert("賭けました！");
    document.getElementById("wager").value = "";
    modal.style.display = "none";
  }
  if (response.status === 400) {
    alert(await response.text());
    return;
  }
};
//urlのクエリパラメータを取得する関数
//https://www-creators.com/archives/4463
function getParam(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}
// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  document.getElementById("wager").value = "";
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    document.getElementById("wager").value = "";
    modal.style.display = "none";
  }
};

let editBtn = document.getElementById("edit");
editBtn.addEventListener("click", edit);
user_name.disabled = true;
user_level.disabled = true;
user_birthday.disabled = true;
user_rp.disabled = true;
function edit() {
  var updateBtn = document.getElementById("update");
  if (updateBtn.style.display === "none") {
    updateBtn.style.display = "block";
    user_name.disabled = false;
    level.disabled = false;
    user_birthday.disabled = false;
  } else {
    updateBtn.style.display = "none";
    user_name.disabled = true;
    level.disabled = true;
    user_birthday.disabled = true;
  }
}
