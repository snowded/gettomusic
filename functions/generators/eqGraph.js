/* made by snow.ded - getto */

module.exports = async (gains) => {
  const QuickChart = require("quickchart-js");
  const qc = new QuickChart();

  qc.setConfig({
    type: "line",
    data: {
      labels: ["62.5", "250", "1k", "3.6k", "12k"],
      datasets: [
        {
          label: "5-Band Equalizer",
          yAxisID: "db",
          data: gains,
          fill: true,
          //borderColor: "#ff5500",
          borderWidth: 1,
        },

        // {
        //   label: "Recommended",
        //   yAxisID: "db",
        //   data: [0, 1, -1, 0, 1],
        //   fill: true,
        //   //borderColor: "#ff5500",
        //   borderWidth: 1,
        // },
      ],
    },
    options: {
      scales: {
        yAxes: [
          {
            id: "db",
            type: "linear",
            position: "left",
            ticks: {
              suggestedMin: -2,
              suggestedMax: 2,
              callback: (value) => {
                return `${value} db`;
              },
            },
          },
        ],
      },
    },
  });
  qc.setWidth(400);
  qc.setHeight(200);
  qc.setBackgroundColor("white");

  let uri = await qc.getShortUrl();
  return uri;
};
