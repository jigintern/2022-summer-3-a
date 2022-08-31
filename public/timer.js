// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
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
const auth = getAuth(app);

var time = 0;
var timerLabel = document.getElementsByClassName('timerLabel')[0];
var startBtn = document.getElementsByClassName('sampleButton-ok')[0];
var resetBtn = document.getElementById('resetBtn');
var id;  // setTimeoutから返される値を入れる変数
var button = document.getElementById('samplebutton');
var running = false;
var lat = 0;
var lng = 0;

// STARTボタン
async function start() {
    if (time == 0) {
        navigator.geolocation.getCurrentPosition((position) => {
            //緯度
            lat = position.coords.latitude;
            //経度
            lng = position.coords.longitude;
        });
        const response = await fetch("/position", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "uid":auth.currentUser.uid,
                "position":
                {
                    "lat":lat,//緯度
                    "lng":lng//経度
                },
                "time":time,
                "status":"start"
            })

        });
        const user_distance = await response.json();

        const para = document.querySelector("#previousDistance");
        para.innerText = `走行距離：${user_distance.distance}`;
    }

    else if (time % 3000 == 0) {
        navigator.geolocation.getCurrentPosition((position) => {
            //緯度
            lat = position.coords.latitude;
            //経度
            lng = position.coords.longitude;
        });
        const response = await fetch("/position", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "uid":auth.currentUser.uid,
                "position":
                {
                    "lat":lat,//緯度
                    "lng":lng//経度
                },
                "time":time,
                "status":"running"
            })

        });
        const user_distance = await response.json();

        const para = document.querySelector("#previousDistance");
        para.innerText = '走行距離：${user_distance.distance}';
    }
    // timeをsetTimeoutで設定したミリ秒ごとに1プラスする
    time++;

    //分・秒・ミリ秒を計算
    var min = Math.floor(time/100/60)
    var sec = Math.floor(time/100);
    var mSec = time % 100;
    // 分・秒・ミリ秒が１桁の場合は、先頭に０をつける
    if (min < 10) min = '0' + min;
    if (sec >= 60) sec = sec % 60; // 秒が60秒以上になった場合の処理（60になったら0になる）
    if (sec < 10) sec = '0' + sec;
    if (mSec < 10) mSec = '0' + mSec;

    // timerLabelを更新
    timerLabel.innerHTML = min + ':' + sec + ':' + mSec;
    // setTimeoutでstart関数をループさせるイメージ
    id = setTimeout(start, 10);
}



// STOPボタン
async function stop() {
    // 停止する
    clearTimeout(id);
    navigator.geolocation.getCurrentPosition((position) => {
        //緯度
        lat = position.coords.latitude;
        //経度
        lng = position.coords.longitude;
    });
    const response = await fetch("/position", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "uid": auth.currentUser.uid,
            "position":
            {
                "lat": lat,//緯度
                "lng": lng//経度
            },
            "time": time,
            "status": "finish"
        })

    });
    const user_distance = await response.json();

    const para = document.querySelector("#previousDistance");
    para.innerText = '走行距離：${user_distance.distance}';
}

function click() {
    if (running) { running = false; stop() } else { running = true; start() }
}
// RESETボタン
function reset() {
    // 停止する
    clearTimeout(id);
    // タイムを0に戻す
    time = 0;
    // タイマーラベルをリセット
    timerLabel.innerHTML = '00:00:00';
}

// クリックした時の処理
button.addEventListener('click', click)
resetBtn.addEventListener('click', reset); // RESETボタン


