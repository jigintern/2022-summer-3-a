'use strict';
{
    var time = 0;
    var timerLabel = document.getElementsByClassName('timerLabel')[0];
    var startBtn = document.getElementsByClassName('sampleButton-ok')[0];
    var resetBtn = document.getElementById('resetBtn');
    var id;  // setTimeoutから返される値を入れる変数
    var button = document.getElementById('samplebutton');
    var running = false;

    // STARTボタン
    function start() {
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