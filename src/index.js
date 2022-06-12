import "./styles.css";

import { createChart, PriceScaleMode } from "lightweight-charts";

var chart = createChart(document.body, {
  width: window.innerWidth - 100,
  height: window.innerHeight - 100,
  rightPriceScale: {
    scaleMargins: {
      top: 0.3,
      bottom: 0.25
    },
    mode: PriceScaleMode.Logarithmic
  },
  layout: {
    backgroundColor: "#131722",
    textColor: "#d1d4dc"
  },
  grid: {
    vertLines: {
      color: "rgba(42, 46, 57, 0)"
    },
    horzLines: {
      color: "rgba(42, 46, 57, 0.6)"
    }
  },
  timeScale: {
    timeVisible: true,
    secondsVisible: false
  }
});

var areaSeries = chart.addAreaSeries({
  topColor: "rgba(38,198,218, 0.56)",
  bottomColor: "rgba(38,198,218, 0.04)",
  lineColor: "rgba(38,198,218, 1)",
  lineWidth: 2
});

var volumeSeries = chart.addHistogramSeries({
  color: "#26a69a",
  priceFormat: {
    type: "volume"
  },
  priceScaleId: "",
  scaleMargins: {
    top: 0.8,
    bottom: 0
  }
});

readTextFile("data.json", function (text) {
  var data = JSON.parse(text);
  var datetime = data.DateTime;
  var price = data.Price;
  var size = data.Size;
  const chart_data = [];
  const bar_data = [];
  var lastDateTime = 0;
  var step = 1;
  for (var i in Object.keys(datetime)) {
    var timestamp = datetime[i] / 1000;
    if (datetime[i] === lastDateTime) {
      timestamp = (datetime[i] + step) / 1000;
      step++;
    } else {
      step = 1;
      lastDateTime = datetime[i];
    }
    chart_data.push({ time: timestamp, value: price[i] });
    bar_data.push({ time: timestamp, value: size[i] });
  }
  console.log(chart_data);
  areaSeries.setData(chart_data);
  volumeSeries.setData(bar_data);
});

function readTextFile(file, callback) {
  var rawFile = new XMLHttpRequest();
  rawFile.overrideMimeType("application/json");
  rawFile.open("GET", file, true);
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4 && rawFile.status == "200") {
      callback(rawFile.responseText);
    }
  };
  rawFile.send(null);
}
