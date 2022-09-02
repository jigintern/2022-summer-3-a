// Import the functions you need from the SDKs you need
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
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  if (user) {
    const selectTerm = document.querySelector('[name="term"]');
    const selectLevel = document.querySelector('[name="LevelSelect"]');
    ChangeRanking(selectTerm, selectLevel, user.uid);

    selectTerm.onchange = async (event) => {
      ChangeRanking(selectTerm, selectLevel, user.uid);
    };

    selectLevel.onchange = async (event) => {
      ChangeRanking(selectTerm, selectLevel, user.uid);
    };
  }
  else {
    console.log("not login");
  }
})
const getCurrentPosition = (options) => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, options)
    })
}

async function ChangeRanking(selectTerm, selectLevel, uid) {
  const node = document.getElementById("RankingList");
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
    //セレクタによる場合分け
    //レベルごと
    const LevelSelect = document.form1.LevelSelect;
    const level_num = LevelSelect.selectedIndex;

    //期間ごと
    const term = document.form1.term;
    const term_num = term.selectedIndex;
    const term_value = term.options[term_num].value;

  // jsonの受け取り
  const path = `/users?key=${selectTerm.value}&uid=${uid}&level=${selectLevel.value}`
  const response = await fetch(path);
  const rank_para = await response.json();

  // 自分のステータス(ownrank)
  const OwnName = document.querySelector("#MyName");
  OwnName.innerText = `ユーザ名: ${rank_para.ownrank.name}`;

  const OwnLevel = document.querySelector("#OwnLevel");
  if (rank_para.ownrank.level == 1) {
    OwnLevel.innerText = "初級者";
  }
  else if (rank_para.ownrank.level == 2) {
    OwnLevel.innerText = "中級者";
  }
  else if (rank_para.ownrank.level == 3) {
    OwnLevel.innerText = "上級者";
  }

  const OwnContinuation = document.querySelector("#OwnContinuation");
  OwnContinuation.innerText = `継続日数: ${rank_para.ownrank.continuation}`;

  const OwnDistance = document.querySelector("#OwnDistance");
  OwnDistance.innerText = `${rank_para.ownrank.distance}km走りました!`;

  const OwnRank = document.querySelector("#OwnRank");
  OwnRank.innerText = `${rank_para.ownrank.rank}位`;


  //ランキング
  const RankingList = document.getElementById("RankingList");

  rank_para.rankers.forEach(function (element, i) {
    //li要素の作成
    let RankingContainer = document.createElement('li');
    RankingContainer.className = `RankingContainer${i}`;
    RankingList.appendChild(RankingContainer);

    //div class=UserStatusの作成
    let UserStatus = document.createElement('div');
    UserStatus.className = `UserStates${i}`;
    RankingContainer.appendChild(UserStatus);

    //p class=Unameの作成
    let Uname = document.createElement('a');
    Uname.className = `Uname${i}`;
    Uname.href = `/profile.html?targetuid=${element.uid}`
    UserStatus.appendChild(Uname);

    //div class=UserAchievementの作成
    let UserAchievement = document.createElement('div');
    UserAchievement.className = `UserAchievement${i}`;
    RankingContainer.appendChild(UserAchievement);

    //pタグ(level, continuation, distance)の作成
    let level = document.createElement('p');
    let continuation = document.createElement('p');
    let distance = document.createElement('p');

    level.className = `level${i}`;
    continuation.className = `continuation${i}`;
    distance.className = `distance${i}`;

    UserAchievement.appendChild(level);
    UserAchievement.appendChild(continuation);
    UserAchievement.appendChild(distance);

    //DOM操作
    const userName = document.querySelector(`.Uname${i}`);
    userName.innerText = `ユーザ名: ${element.name}`;

    const userLevel = document.querySelector(`.level${i}`);
    if (element.level == 1) {
      userLevel.innerText = "初級者";
    }
    else if (element.level == 2) {
      userLevel.innerText = "中級者";
    }
    else if (element.level == 3) {
      userLevel.innerText = "上級者";
    }

    const userContinuation = document.querySelector(`.continuation${i}`);
    userContinuation.innerText = `継続日数: ${element.continuation}`;

    const userDistance = document.querySelector(`.distance${i}`);
    userDistance.innerText = `${element.distance}km走りました!`;
  })
}