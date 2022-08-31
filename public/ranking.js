window.onload = async (event) => {
  const response = await fetch("/ranking");
  const rank_para = await response.json()

  // 自分のステータス(ownranks)
  const Ownname = document.querySelector("#MyName");
  Ownname.innerText = `${rank_para.ownranks.name}`;

  const OwnId = document.querySelector("#OwnUid");
  OwnId.innerText = `${rank_para.ownranks.uid}`;

  const OwnLevel = document.querySelector("#OwnLevel");
  if (OwnLevel == 1) {
    level.innerText = "初級者";
  }
  else if (OwnLevel == 2) {
    level.innerText = "中級者";
  }
  else if (OwnLevel == 3) {
    level.innerText = "上級者";
  }

  const OwnContinuation = document.querySelector("#OwnContinuation");
  OwnContinuation.innerText = `継続日数${rank_para.ownranks.continuation}`;

  const OwnDistance = document.querySelector("#OwnDistance");
  OwnDistance.innerText = `${rank_para.ownranks.distance}km走りました!`;

  const OwnRank = document.querySelector("#OwnRank");
  OwnRank.innerText = `${rank_para.ownranks.rank}位`;

  //ランキング
  const RankingList = document.getElementById("RankingList");
  rank_para.rankers.forEach(function(element) {
    let RankingContainer = document.createElement('li');
    RankingContainer.className = 'RankingContainer';

  })
  };