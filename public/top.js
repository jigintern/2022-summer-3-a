class SampleButton {
    // コンストラクター
    constructor(_button) {
        // ボタンのクリックイベントを設定する
        _button.addEventListener('click', this.click);
    }

    // クリックイベントで実行する処理
    click() {
        // NGボタンのCSSが適用されているかを判断する
        if (!this.classList.contains('sampleButton-ng')) {
            //クラスの追加
            this.classList.add('sampleButton-ng');
            //テキストの書き換え
            this.textContent = "終了";
        } else {
            //クラスの削除
            this.classList.remove('sampleButton-ng');
            //テキストの書き換え
            this.textContent = "RUN!";
        }
    }
}
// ボタンインスタンスを作成する。
//指定したidにSampleButtonを適用している
let samplebutton = new SampleButton(document.getElementById('samplebutton'));