// 円グラフ
let canvas = document.getElementById("myChart");
let ctx = canvas.getContext("2d");
let perc = 25;

const config = {
  type: "doughnut",
  data: {
    datasets: [
      {
        data: [perc, 100 - perc],
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
        var cx = canvas.width / 2;
        var cy = canvas.height / 2;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "16px verdana";
        ctx.fillStyle = "black";
        ctx.fillText(perc + "%", cx, cy);
      },
    },
  },
};

new Chart(ctx, config);
