/* made by snow.ded - getto */

const QuickChart = require("quickchart-js");
const qc = new QuickChart();
const gen = (wsl, msg) => {
  let rnd = Math.random();
  wsl = parseInt(
    wsl + Math.floor(rnd * (-wsl * 0.05 - wsl * 0.05)) + wsl * 0.05,
  );
  msg = parseInt(
    msg + Math.floor(rnd * (-msg * 0.02 - msg * 0.02)) + msg * 0.02,
  );
  return [wsl, msg];
};
module.exports = async (ws_latency, msg_latency) => {
  let data = [];
  for (i = 0; i < 17; i++) {
    data.push(gen(ws_latency, msg_latency));
  }
  data.push([ws_latency, msg_latency]);

  ////////////////////////////////////////////////////////////////////////////

  qc.setConfig({
    type: "line",
    data: {
      labels: [
        "_",
        "_",
        "_",
        "_",
        "_",
        "_",
        "_",
        "_",
        "_",
        "_",
        "_",
        "_",
        "_",
        "_",
        "_",
        "_",
        "_",
      ],
      datasets: [
        {
          label: "Websocket Latency",
          yAxisID: "ws",
          data: data.map((item) => item[0]),
          fill: true,
          borderColor: "#ff5500",
          borderWidth: 1,
          backgroundColor: QuickChart.getGradientFillHelper("vertical", [
            "#fc4e14",
            "#ffffff",
          ]),
        },
        {
          label: "Message Latency",
          yAxisID: "msg",
          data: data.map((item) => item[1]),
          fill: true,
          borderColor: "#00d8ff",
          borderWidth: 1,
          backgroundColor: QuickChart.getGradientFillHelper("vertical", [
            "#24ffd3",
            "#ffffff",
          ]),
        },
      ],
    },
    options: {
      scales: {
        yAxes: [
          {
            id: "msg",
            type: "linear",
            position: "right",
            ticks: {
              suggestedMin: 0,
              suggestedMax: 200,
              callback: (value) => {
                return `${value}`;
              },
            },
          },
          {
            id: "ws",
            type: "linear",
            position: "left",
            ticks: {
              suggestedMin: 0,
              suggestedMax: msg_latency,
              callback: (value) => {
                return `${value}`;
              },
            },
          },
        ],
      },
    },
  });
  qc.setWidth(400);
  qc.setHeight(200);
  qc.setBackgroundColor("transparent");

  let uri = await qc.getShortUrl();
  return uri;
};
