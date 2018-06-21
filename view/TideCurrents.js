var xml;

function setup() {
  var xhttp;
  xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          myFunction(this);
      }
  };
  xhttp.open("GET", "9410170_annual.xml", true);
  xhttp.send();
}


var origin, datarange,  producttype, stationname, state, stationid,
stationtype, BeginDate, EndDate, dataUnits, Timezone, Datum, IntervalType,
date = [], day = [], time = [],  pred_in_ft = [], pred_in_cm = [], highlow = [];

var Xaxis = [], YaxisInFt = [], YaxisInCm = [], tideLevelLabel =[], DateTimeRange = [], 
alreadyInvoked = false, timenow, todayforComparision;

function myFunction(xml) {
    if (alreadyInvoked == false) {
      alreadyInvoked = true;
      var xmlDoc = xml.responseXML;
      
      datetimeformating();

      path = "/datainfo/data/item";
      var txt = "";
      if (xmlDoc.evaluate) {
          var nodes = xmlDoc.evaluate(path, xmlDoc, null, XPathResult.ANY_TYPE, null);
          var result = nodes.iterateNext();
          while (result) {
              txt += result.childNodes[0].nodeValue + "<br>";
              result = nodes.iterateNext();
          }
      }
      origin = xmlDoc.getElementsByTagName("origin");
      datarange = xmlDoc.getElementsByTagName("datarange");
      producttype = xmlDoc.getElementsByTagName("producttype");
      stationname = xmlDoc.getElementsByTagName("stationname");
      state = xmlDoc.getElementsByTagName("state");
      stationid = xmlDoc.getElementsByTagName("stationid");
      stationtype = xmlDoc.getElementsByTagName("stationtype");
      BeginDate = xmlDoc.getElementsByTagName("BeginDate");
      EndDate = xmlDoc.getElementsByTagName("EndDate");
      dataUnits = xmlDoc.getElementsByTagName("dataUnits");
      Timezone = xmlDoc.getElementsByTagName("Timezone");
      Datum = xmlDoc.getElementsByTagName("Datum");
      IntervalType = xmlDoc.getElementsByTagName("IntervalType");
      date = xmlDoc.getElementsByTagName("date");
      day = xmlDoc.getElementsByTagName("day");
      time = xmlDoc.getElementsByTagName("time");
      pred_in_ft = xmlDoc.getElementsByTagName("pred_in_ft");
      pred_in_cm = xmlDoc.getElementsByTagName("pred_in_cm");
      highlow = xmlDoc.getElementsByTagName("highlow");
      
      loadTodaysPrediction();
      
      for (var i = 0; i < time.length; i++) {
         var tempDate = date[i].childNodes[0].nodeValue;
         tempDate = tempDate.replace("/", "-");tempDate = tempDate.replace("/", "-");
         var tempTime = time[i].childNodes[0].nodeValue;
         var formatedDateTime= tempDate +" " + tempTime + ":00";
         DateTimeRange.push(tempDate);

         Xaxis.push(formatedDateTime);

         var tempPredInFt = pred_in_ft[i].childNodes[0].nodeValue;
         YaxisInFt.push(tempPredInFt);
         var tempPredInCm = pred_in_cm[i].childNodes[0].nodeValue;
         YaxisInCm.push(tempPredInCm);

         var tempTideLevel = highlow[i].childNodes[0].nodeValue;
         tideLevelLabel.push("Tide " + tempTideLevel);
      }
      document.getElementById("sourceInfo").innerHTML = origin[0].childNodes[0].nodeValue;
      document.getElementById("locationInfo").innerHTML = datarange[0].childNodes[0].nodeValue +" "+ producttype[0].childNodes[0].nodeValue+" at " +
                 stationid[0].childNodes[0].nodeValue + ", "+stationname[0].childNodes[0].nodeValue+", "+
                 state[0].childNodes[0].nodeValue;
      document.getElementById("timeframeInfo").innerHTML = "From " + BeginDate[0].childNodes[0].nodeValue + " " + Timezone[0].childNodes[0].nodeValue +
                  " to " + EndDate[0].childNodes[0].nodeValue + " "+ Timezone[0].childNodes[0].nodeValue;

    loadGraph();
  }

}

function loadTodaysPrediction() {
  var limit = 0;
  for (var i = 0; i < time.length; i++) {
        var tmpTodayDate = date[i].childNodes[0].nodeValue;
        if(tmpTodayDate == todayforComparision && limit<4) {
          var table = document.getElementById("todaysHighLow").getElementsByTagName('tbody')[0];
          var row = table.insertRow(table.rows.length);
          var cell1 = row.insertCell(0);
          var cell2 = row.insertCell(1);
          var cell3 = row.insertCell(2);
          var cell4 = row.insertCell(3);
          var cell5 = row.insertCell(4);
          cell1.innerHTML = date[i].childNodes[0].nodeValue;
          cell2.innerHTML = day[i].childNodes[0].nodeValue;
          cell3.innerHTML = time[i].childNodes[0].nodeValue;
          cell4.innerHTML = pred_in_ft[i].childNodes[0].nodeValue;
          cell5.innerHTML = highlow[i].childNodes[0].nodeValue;

          limit++;
        }
      }

}

var todayTimeArr = [], timenowhrminSec;
function datetimeformating() {
      var today = new Date();
      console.log(today);
      var dd = today.getDate();
      var mm = today.getMonth()+1; //January is 0!
      var yyyy = today.getFullYear();

      if(dd<10) {
          dd = '0'+dd;
      }

      if(mm<10) {
          mm = '0'+mm;
      }
      timenow = new Date().toString().slice(16,21) + ":00";

      today = yyyy + '-' + mm + '-' + dd; todayforComparision = yyyy + '/' + mm + '/' + dd;

      timenow = today + " " + timenow;

      console.log(timenow);
}

function loadGraph() {

  timenowhrminSec = new Date().toString().slice(16,24);
  var trace1 = {
    type: "scatter",
    mode: "lines",
    name: 'Predictions',
    x: Xaxis,
    y: YaxisInFt,fill: "none",
    line: {shape: 'spline'}
  };

  var trace2 = {
    x: todayTimeArr,
    y: YaxisInFt,
    mode: 'lines',
    name: 'Current LST/LDT',
    text: [timenowhrminSec],
    textposition: 'auto',
    type: 'scatter'
  };

  var data = [trace1, trace2];

  var selectorOptions = {
    buttons: [{
        step: 'month',
        stepmode: 'backward',
        count: 1,
        label: 'Monthly'
    }, {
        step: 'month',
        stepmode: 'Half Yearly',
        count: 6,
        label: '6m'
    }, {
        step: 'year',
        stepmode: 'backward',
        count: 1,
        label: 'Annual'
    }, {
        step: 'all',
    }],
  };

  var layout = {
    title: 'NOAA Tides and Currents',

    xaxis: {
      autorange: true,
      range: Xaxis,
      rangeselector: selectorOptions,
      rangeslider: {},
      type: 'date',
      showspikes: true,
      spikedash:"solid",
      spikemode: "across",
      spikecolor:"black",
      spikethickness:0.5, 
    },

    yaxis: {
      range: YaxisInFt,
      fixedrange: true,
      type: 'scatter',
      rangeslider: {},
      zeroline:false,
      showspikes: true,
      spikedash:"solid",
      spikemode: "across",
      spikecolor:"black",
      spikethickness:0.5, 
    },

    shapes: [
    {
      type: 'line',
      x0: timenow,
      y0: -2,
      x1: timenow,
      y1: 8,
      text: "today is here",
      line: {
        color: 'rgb(50, 171, 96)',
        width: 2
      }, 
    }]

  };

  Plotly.newPlot('myDiv', data, layout);

  var myPlot = document.getElementById('myDiv');
  myPlot.addEventListener('touchenter', (event) => PlotlyPage.touchHandler(event));
  myPlot.addEventListener('touchleave', (event) => PlotlyPage.touchHandler(event));
  myPlot.addEventListener('touchstart', (event) => touchHandler(event));
  myPlot.addEventListener('touchmove', (event) => touchHandler(event));
  myPlot.addEventListener('touchend', (event) => touchHandler(event));

function touchHandler(event) {
    console.log(`touchHandler triggered for event ${event.type}`);
    var touches = event.changedTouches,
        first = touches[0],
        type = "";
    switch(event.type)
    {
      case "touchenter": type = "mouseover"; break;
      case "touchleave": type = "mouseout";  break;
      case "touchstart": type = "mousedown"; break;
      case "touchmove": type = "mousemove"; break;
      case "touchend": type = "mouseup";   break;
      default: return;
    }

    var opts = {
      bubbles: true,
      screenX: first.screenX,
      screenY: first.screenY,
      clientX: first.clientX,
      clientY: first.clientY,
    };

    var simulatedEvent = new MouseEvent(type, opts);

    first.target.dispatchEvent(simulatedEvent);
   // event.preventDefault();
}

}

