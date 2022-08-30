'use strict';
{
    import {getAuth} from "https://www.gstatic.com/firebasejs/9.4.1/firebase-auth.js";
    const auth = getAuth();

    var time = 0;
    var timerLabel = document.getElementsByClassName('timerLabel')[0];
    var startBtn = document.getElementsByClassName('sampleButton-ok')[0];
    var resetBtn = document.getElementById('resetBtn');
    var id;  // setTimeoutから返される値を入れる変数
    var button = document.getElementById('samplebutton');
    var running = false;

    // STARTボタン
    function start() {
        if (time == 0) {
            navigator.geolocation.getCurrentPosition((position) => {
                //緯度
                let lat = position.coords.latitude;
                //経度
                let lng = position.coords.longitude;
            });
            const response = await fetch("/position", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    "uid":auth.uid,
                    "position":
                    {
                        "lat":lat,//緯度
                        "lng":lng//経度
                    },
                    "time":timerLabel,
                    "status":"start"
                })

              });
        }

        else if (time % 3000 == 0) {
            navigator.geolocation.getCurrentPosition((position) => {
                //緯度
                let lat = position.coords.latitude;
                //経度
                let lng = position.coords.longitude;
            });
            const response = await fetch("/position", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    "uid":auth.uid,
                    "position":
                    {
                        "lat":lat,//緯度
                        "lng":lng//経度
                    },
                    "time":timerLabel,
                    "status":"running"
                })

              });
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
    function stop() {
        // 停止する
        clearTimeout(id);
        navigator.geolocation.getCurrentPosition((position) => {
            //緯度
            let lat = position.coords.latitude;
            //経度
            let lng = position.coords.longitude;
        });
        const response = await fetch("/position", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "uid": auth.uid,
                "position":
                {
                    "lat": lat,//緯度
                    "lng": lng//経度
                },
                "time": timerLabel,
                "status": "finish"
            })

        });
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

}