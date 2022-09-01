// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-app.js";
import {
  getAuth,
} from "https://www.gstatic.com/firebasejs/9.9.3/firebase-auth.js";
import L from "https://code4sabae.github.io/leaflet-mjs/leaflet.mjs";
import { LeafletSprite } from "https://taisukef.github.io/leaflet.sprite-es/src/sprite.js";
LeafletSprite.init(L);
var map = L.map('mapcontainer', { zoomControl: false });

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
const getCurrentPosition = (options) => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, options)
    })
  }
var startTime = 0;

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
        timerLabel.innerHTML = '00:00:00';
        const para = document.querySelector("#previousDistance");
        para.innerText = `走行距離：0m`;
        let pos_data = await getCurrentPosition();
        lat = pos_data.coords.latitude;
        lng = pos_data.coords.longitude;
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
        
        para.innerText = `走行距離：${Math.floor(user_distance.distance)}m`;
    }
    else if (time % 3000 < 5) {
        let pos_data = await getCurrentPosition();
        lat = pos_data.coords.latitude;
        lng = pos_data.coords.longitude;
        var gettedTime = Math.floor((performance.now()-startTime)/10)/100;
        
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
        const displaydis = Math.floor(user_distance.distance);
        map.setView([lat, lng], 16);
        var popup1 = L.popup({ maxWidth: 550 }).setContent(`${gettedTime}秒地点<br>総走行距離 ${displaydis}m`);
        L.marker([lat,lng]).bindPopup(popup1).addTo(map);
        var poss = user_distance.positions;
        var len = poss.length
        var lines = [[poss[len-1].lat,poss[len-1].lng],[poss[len-2].lat,poss[len-2].lng]];
        L.polyline(lines, { color: 'blue', weight: 5 }).addTo(map);

        const para = document.querySelector("#previousDistance");
        
        para.innerText = `走行距離：${displaydis}m`;
    }
    //timeは10msec単位で、performance.now()は1msec単位になっている
    time = Math.floor((performance.now()-startTime)/10);

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
    let pos_data = await getCurrentPosition();
    lat = pos_data.coords.latitude;
    lng = pos_data.coords.longitude;
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
    const displaydis = Math.floor(user_distance.distance);
    var gettedTime = Math.floor(time)/100;
    map.setView([lat, lng], 16);
    var popup1 = L.popup({ maxWidth: 550 }).setContent(`終了地点<br>${gettedTime}秒地点<br>総走行距離 ${displaydis}m`);
    L.marker([lat,lng]).bindPopup(popup1).addTo(map);
    var poss = user_distance.positions;
    var len = poss.length
    var lines = [[poss[len-1].lat,poss[len-1].lng],[poss[len-2].lat,poss[len-2].lng]];
    L.polyline(lines, { color: 'blue', weight: 5 }).addTo(map);

    const para = document.querySelector("#previousDistance");
    para.innerText = `走行距離：${displaydis}m`;
}

function click() {
    if (running) { running = false; stop() } else { 
        running = true; 
        start();
        startTime = performance.now(); 
        time = 0;
        map.remove();
        map = L.map('mapcontainer', { zoomControl: false });
        map.setView([lat, lng], 16);
        L.tileLayer('http://tile.openstreetmap.jp/{z}/{x}/{y}.png', {
            attribution: "<a href='http://osm.org/copyright' target='_blank'>OpenStreetMap</a> contributors" 
        }).addTo(map);
        L.control.scale({ maxWidth: 20, position: 'bottomright', imperial: false }).addTo(map);
        L.control.zoom({ position: 'bottomleft' }).addTo(map);
        var popup1 = L.popup({ maxWidth: 550 }).setContent(`出発地点`);
        L.marker([lat,lng]).bindPopup(popup1).addTo(map);
    }
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
window.onload = async (event) => {
    map.setView([35.943306, 136.200500], 12);
    L.tileLayer('http://tile.openstreetmap.jp/{z}/{x}/{y}.png', {
        attribution: "<a href='http://osm.org/copyright' target='_blank'>OpenStreetMap</a> contributors" 
    }).addTo(map);
    L.control.scale({ maxWidth: 20, position: 'bottomright', imperial: false }).addTo(map);
    L.control.zoom({ position: 'bottomleft' }).addTo(map);
    let pos_data = await getCurrentPosition();
    lat = pos_data.coords.latitude;
    lng = pos_data.coords.longitude;
    map.setView([lat, lng], 16);
  };

// クリックした時の処理
button.addEventListener('click', click)
resetBtn.addEventListener('click', reset); // RESETボタン


