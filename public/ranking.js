window.onload = async (event) => {
  // jsonの受け取り
  const response = await fetch("/users?key=distance&uid=testid1&level=1");
  const rank_para = await response.json()
  console.log(rank_para);

  // 自分のステータス(ownrank)
  const OwnName = document.querySelector("#MyName");
  OwnName.innerText = `${rank_para.ownranks.name}`;

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

  rank_para.rankers.forEach(function (element,i) {
    //li要素の作成
    let RankingContainer = document.createElement('li');
    RankingContainer.className = `RankingContainer${i}`;
    RankingList.appendChild(RankingContainer);

    //div class=UserStatusの作成
    let UserStatus = document.createElement('div');
    UserStatus.className = `UserStates${i}`;
    RankingContainer.appendChild(UserStatus);

    //p class=Unameの作成
    let Uname = document.createElement('p');
    Uname.className = `Uname${i}`;
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
      userName.innerText = `${element.name}`;

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
      userContinuation.innerText = `継続日数${element.continuation}`;

      const userDistance = document.querySelector(`.distance${i}`);
    userDistance.innerText = `${element.distance}km走りました!`;

  })
  };