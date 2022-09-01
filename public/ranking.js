window.onload = async (event) => {
  // jsonの受け取り
  const response = await fetch("/ranking");
  const rank_para = await response.json()

  // 自分のステータス(ownranks)
  const Ownname = document.querySelector("#MyName");
  Ownname.innerText = `${rank_para.ownranks.name}`;

  const OwnId = document.querySelector("#OwnUid");
  OwnId.innerText = `${rank_para.ownranks.uid}`;

  const OwnLevel = document.querySelector("#OwnLevel");
  if (OwnLevel == 1) {
    OwnLevel.innerText = "初級者";
  }
  else if (OwnLevel == 2) {
    OwnLevel.innerText = "中級者";
  }
  else if (OwnLevel == 3) {
    OwnLevel.innerText = "上級者";
  }

  const OwnContinuation = document.querySelector("#OwnContinuation");
  OwnContinuation.innerText = `継続日数${rank_para.ownranks.continuation}`;

  const OwnDistance = document.querySelector("#OwnDistance");
  OwnDistance.innerText = `${rank_para.ownranks.distance}km走りました!`;

  const OwnRank = document.querySelector("#OwnRank");
  OwnRank.innerText = `${rank_para.ownranks.rank}位`;


  //ランキング
  const RankingList = document.getElementById("RankingList");

  rank_para.rankers.forEach(function (element) {
    //li要素の作成
    let RankingContainer = document.createElement('li');
    RankingContainer.className = "RankingContainer";
    RankingList.appendChild(RankingContainer);

    //div class=UserStatusの作成
    let UserStatus = document.createElement('div');
    UserStatus.className = "UserStates";
    RankingContainer.appendChild(UserStatus);

    //p class=Unameの作成
    let Uname = document.createElement('p');
    Uname.className = "Uname";
    UserStatus.appendChild(Uname);

    //a class=Uidの作成
    let Uid = document.createElement('a');
    Uid.className = "Uid";
    UserStatus.appendChild(Uid);

    //div class=UserAchievementの作成
    let UserAchievement = document.createElement('div');
    UserAchievement.className = "UserAchievement";
    RankingContainer.appendChild(UserAchievement);

    //pタグ(level, continuation, distance)の作成
    let level = document.createElement('p');
    let continuation = document.createElement('p');
    let distance = document.createElement('p');

    level.className = "level";
    continuation.className = "continuation";
    distance.className = "distance";

    UserAchievement.appendChild(level);
    UserAchievement.appendChild(continuation);
    UserAchievement.appendChild(distance);

    //DOM操作
    const userName = document.querySelector("#Uname");
    userName.innerText = `${rank_para.rankers.name}`;

    const userId = document.querySelector("#Uid");
    userId.innerText = `${rank_para.rankers.uid}`;

    const userLevel = document.querySelector("#level");
    if (userLevel == 1) {
      userLevel.innerText = "初級者";
    }
    else if (OwnLevel == 2) {
      userLevel.innerText = "中級者";
    }
    else if (OwnLevel == 3) {
      userLevel.innerText = "上級者";
    }

    const userContinuation = document.querySelector("#continuation");
    userContinuation.innerText = `継続日数${rank_para.rankers.continuation}`;

    const userDistance = document.querySelector("#distance");
    userDistance.innerText = `${rank_para.rankers.distance}km走りました!`;

  })
  };