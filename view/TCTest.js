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
      
     // loadDefaultData();
      //loadDatafor24hours();
      loadDatafor48hours();
      //loadDataforWeek();

      document.getElementById("sourceInfo").innerHTML = origin[0].childNodes[0].nodeValue;
      document.getElementById("locationInfo").innerHTML = datarange[0].childNodes[0].nodeValue +" "+ producttype[0].childNodes[0].nodeValue+" at " +
                 stationid[0].childNodes[0].nodeValue + ", "+stationname[0].childNodes[0].nodeValue+", "+
                 state[0].childNodes[0].nodeValue;
      document.getElementById("timeframeInfo").innerHTML = "From " + BeginDate[0].childNodes[0].nodeValue + " " + Timezone[0].childNodes[0].nodeValue +
                  " to " + EndDate[0].childNodes[0].nodeValue + " "+ Timezone[0].childNodes[0].nodeValue;

      loadGraph();
  }

}

var defaultRange = '_48hours';
function reloadGraph(eventArgs) {
	if (eventArgs.value === '_24Hours') {
	    console.log(eventArgs.value);
	    defaultRange = eventArgs.value;
	    loadDatafor24hours();
	  } else if (eventArgs.value === '_48Hours') {
	    console.log(eventArgs.value);
	    defaultRange = eventArgs.value;
	    loadDatafor48hours();
	  } else if (eventArgs.value === '_weekly') {
	    console.log(eventArgs.value);
	    defaultRange = eventArgs.value;
	    loadDataforWeek();
	  }
	  else if (eventArgs.value === '_annual') {
	    console.log(eventArgs.value);
	    defaultRange = eventArgs.value;
	    loadDefaultData();
	  }
}

var user_MHHW, user_MLLW;
function updateWaterLevel() {
	user_MHHW = document.getElementById("MHHW").value;
	user_MLLW = document.getElementById("MLLW").value;
	console.log(user_MLLW, user_MHHW);
	if (defaultRange === '_24Hours') {
	    console.log(defaultRange);
	    loadDatafor24hours();
	  } else if (defaultRange === '_48Hours') {
	    console.log(defaultRange);
	    loadDatafor48hours();
	  } else if (defaultRange === '_weekly') {
	    console.log(defaultRange);
	    loadDataforWeek();
	  }
	  else if (defaultRange === '_annual') {
	    console.log(defaultRange);
	    loadDefaultData();
	  }
}
	
	

var xAxisAnnual =[], yAxisAnnualInft =[], yAxisAnnualInCm =[], user_MLLW, user_MHHW,
DateTimeRangeAnnual=[], tideLevelLabelAnnual=[], todayTimeArrAnnual=[];

function loadDefaultData() {
	YaxisMLLW=[], YaxisMHHW=[], xAxisGen=[],yAxisGen=[];
	xAxisAnnual =[], yAxisAnnualInft =[], yAxisAnnualInCm =[], user_MLLW, user_MHHW,
				DateTimeRangeAnnual=[], tideLevelLabelAnnual=[], todayTimeArrAnnual=[];
	user_MHHW = document.getElementById("MHHW").value;
	user_MLLW = document.getElementById("MLLW").value;
	for (var i = 0; i < time.length; i++) {
         var tempDate = date[i].childNodes[0].nodeValue;
         tempDate = tempDate.replace("/", "-");tempDate = tempDate.replace("/", "-");
         var tempTime = time[i].childNodes[0].nodeValue;
         var formatedDateTime= tempDate +" " + tempTime + ":00";
         DateTimeRange.push(tempDate);

         xAxisAnnual.push(formatedDateTime);

         YaxisMLLW.push(user_MLLW);
         YaxisMHHW.push(user_MHHW);

         var tempPredInFt = pred_in_ft[i].childNodes[0].nodeValue;
         yAxisAnnualInft.push(tempPredInFt);
         var tempPredInCm = pred_in_cm[i].childNodes[0].nodeValue;
         yAxisAnnualInCm.push(tempPredInCm);

         var tempTideLevel = highlow[i].childNodes[0].nodeValue;
         tideLevelLabelAnnual.push("Tide " + tempTideLevel);

         //todayTimeArr.push(timenow);
      }
      xAxisGen=xAxisAnnual, yAxisGen=yAxisAnnualInft;
      loadGraph();
}

var xAxis24hrs =[], yAxis24hrsInFt =[], yAxis24hrsInCm =[], user_MLLW, user_MHHW,
DateTimeRange24hrs=[], tideLevelLabel24hrs=[], todayTimeArr24hrs=[];

function loadDatafor24hours() {
	YaxisMLLW=[], YaxisMHHW=[], xAxisGen=[],yAxisGen=[];
	xAxis24hrs =[], yAxis24hrsInFt =[], yAxis24hrsInCm =[],DateTimeRange24hrs=[], tideLevelLabel24hrs=[], todayTimeArr24hrs=[];
	user_MLLW = document.getElementById("MLLW").value, user_MHHW= document.getElementById("MHHW").value;
	var upperbound = currentdateStartIndex-2; var lowerbound = currentdateEndIndex;
	for (var i=upperbound; i<=lowerbound; i++) {
         var tempDate = date[i].childNodes[0].nodeValue;
         tempDate = tempDate.replace("/", "-");tempDate = tempDate.replace("/", "-");
         var tempTime = time[i].childNodes[0].nodeValue;
         var formatedDateTime= tempDate +" " + tempTime + ":00";
         DateTimeRange24hrs.push(tempDate);

         xAxis24hrs.push(formatedDateTime);

         YaxisMLLW.push(user_MLLW);
         YaxisMHHW.push(user_MHHW);

         var tempPredInFt = pred_in_ft[i].childNodes[0].nodeValue;
         yAxis24hrsInFt.push(tempPredInFt);
         var tempPredInCm = pred_in_cm[i].childNodes[0].nodeValue;
         yAxis24hrsInCm.push(tempPredInCm);

         var tempTideLevel = highlow[i].childNodes[0].nodeValue;
         tideLevelLabel24hrs.push("Tide " + tempTideLevel);


        // todayTimeArr.push(timenow);
      }

      xAxisGen=xAxis24hrs, yAxisGen=yAxis24hrsInFt;
      loadGraph();
}

var xAxis48hrs =[], yAxis48hrsInFt =[], yAxis48hrsInCm =[], user_MLLW, user_MHHW,
DateTimeRange48hrs=[], tideLevelLabel48hrs=[], todayTimeArr48hrs=[];

function loadDatafor48hours() {
	YaxisMLLW=[], YaxisMHHW=[], xAxisGen=[],yAxisGen=[],todayTimeArr = [] ;
	xAxis48hrs =[], yAxis48hrsInFt =[], yAxis48hrsInCm =[],DateTimeRange48hrs=[], tideLevelLabel48hrs=[], todayTimeArr48hrs=[];
	user_MLLW = document.getElementById("MLLW").value, user_MHHW= document.getElementById("MHHW").value;
	var upperbound = currentdateStartIndex-1; var lowerbound = currentdateEndIndex+4;
	for (var i=upperbound; i<=lowerbound; i++) {
         var tempDate = date[i].childNodes[0].nodeValue;
         tempDate = tempDate.replace("/", "-");tempDate = tempDate.replace("/", "-");
         var tempTime = time[i].childNodes[0].nodeValue;
         var formatedDateTime= tempDate +" " + tempTime + ":00";
         DateTimeRange48hrs.push(tempDate);

         xAxis48hrs.push(formatedDateTime);

         YaxisMLLW.push(user_MLLW);
         YaxisMHHW.push(user_MHHW);

         var tempPredInFt = pred_in_ft[i].childNodes[0].nodeValue;
         yAxis48hrsInFt.push(tempPredInFt);
         var tempPredInCm = pred_in_cm[i].childNodes[0].nodeValue;
         yAxis48hrsInCm.push(tempPredInCm);

         var tempTideLevel = highlow[i].childNodes[0].nodeValue;
         tideLevelLabel48hrs.push("Tide " + tempTideLevel);


         todayTimeArr.push(timenow);
      }

      xAxisGen=xAxis48hrs, yAxisGen=yAxis48hrsInFt;
      loadGraph();
}

var xAxisWeek =[], yAxisWeekInFt =[], yAxisWeekInCm =[], user_MLLW, user_MHHW,
DateTimeRangeWeek=[], tideLevelLabelWeek=[], todayTimeArrWeek=[];

function loadDataforWeek() {
	YaxisMLLW=[], YaxisMHHW=[], xAxisGen=[],yAxisGen=[];// todayTimeArr = [];
	xAxisWeek =[], yAxisWeekInFt =[], yAxisWeekInCm =[],DateTimeRangeWeek=[], tideLevelLabelWeek=[], todayTimeArrWeek=[];
	user_MLLW = document.getElementById("MLLW").value, user_MHHW= document.getElementById("MHHW").value;
	var upperbound = currentdateStartIndex-8; var lowerbound = currentdateEndIndex+28;
	for (var i=upperbound; i<=lowerbound; i++) {
         var tempDate = date[i].childNodes[0].nodeValue;
         tempDate = tempDate.replace("/", "-");tempDate = tempDate.replace("/", "-");
         var tempTime = time[i].childNodes[0].nodeValue;
         var formatedDateTime= tempDate +" " + tempTime + ":00";
         DateTimeRangeWeek.push(tempDate);

         xAxisWeek.push(formatedDateTime);

         YaxisMLLW.push(user_MLLW);
         YaxisMHHW.push(user_MHHW);

         var tempPredInFt = pred_in_ft[i].childNodes[0].nodeValue;
         yAxisWeekInFt.push(tempPredInFt);
         var tempPredInCm = pred_in_cm[i].childNodes[0].nodeValue;
         yAxisWeekInCm.push(tempPredInCm);

         var tempTideLevel = highlow[i].childNodes[0].nodeValue;
         tideLevelLabelWeek.push("Tide " + tempTideLevel);

         //todayTimeArr.push(timenow);
      }
      
      xAxisGen=xAxisWeek, yAxisGen=yAxisWeekInFt;
      loadGraph();
}


var currentdateStartIndex = 0, currentdateEndIndex=0;

function loadTodaysPrediction() {
	var limit = 0;
	for (var i = 0; i < time.length; i++) {
		var tmpTodayDate = date[i].childNodes[0].nodeValue;
    	if(tmpTodayDate == todayforComparision) {
    		if(limit==0) {
    			currentdateStartIndex =i;
    			currentdateEndIndex = i+3;
    			//console.log(currentdateStartIndex, date[i].childNodes[0].nodeValue);
    			//console.log(currentdateEndIndex, date[i+3].childNodes[0].nodeValue);
    		}
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

          if(limit==4) {break;}
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
  console.log(todayTimeArr, xAxisGen, yAxisGen);
  timenowhrminSec = new Date().toString().slice(16,24);
  Xaxis = xAxisGen;
  YaxisInFt = yAxisGen;
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
	  y: {range: [-5, 10]},
	  fixedrange:true,
	  mode: 'lines+text',
	  name: 'Current LST/LDT',
	  text: [timenowhrminSec],
	  textfont:{size:12, color:"#000000"},
	  textposition: 'top left',
	  type: 'scatter'
};
	var trace3 = {
		  x: Xaxis,
		  y: YaxisMHHW,
		  mode: 'lines',
		  name: 'MHHW',
		  text: ["Mean Higher High Water"],
		  textposition: 'top right',
		  type: 'scatter'
};
	var trace4 = {
		  x: Xaxis,
		  y: YaxisMLLW,
		  mode: 'lines',
		  name: 'MLLW',
		  text: ["Mean Lower Low Water"],
		  textposition: 'bottom right',
		  type: 'scatter'
};

  var data = [trace1, trace2, trace3, trace4];

 /* var selectorOptions = {
    buttons: [{
        
        label: 'Monthly'
    }, {
        
        label: '6m'
    }, {
        
        label: 'Annual'
    }]
  };*/

  var layout = {
   // title: 'NOAA Tides and Currents',
   paper_bgcolor :"rgb(146, 199, 240)",
   plot_bgcolor	:"rgb(181, 199, 212)",
    xaxis: {
      autorange: true,
      range: Xaxis,
      //rangeselector: selectorOptions,
      rangeslider: {},
      type: 'date',
      mirror:true,
      showline:true,
      showgrid:true,
      showspikes: true,
      spikedash:"solid",
      spikemode: "across",
      spikecolor:"black",
      spikethickness:0.5
    },

    yaxis: {
      //range: YaxisInFt,
      fixedrange: true,
      type: 'scatter',
      rangeslider: {},
      title	: "Tide Height(in feet)",
      ticksuffix: " ft",
      mirror:true,
      zeroline:false,
      showline:true,
      showgrid:true,
      showspikes: true,
      spikedash:"solid",
      spikemode: "across",
      spikecolor:"black",
      spikethickness:0.5, 
    },

   /* shapes: [
    {  
      x0: timenow,
      y0: -2,
      x1: timenow,
      y1: 8,
      mode: 'lines',
      showlegend: true,
      line: {
        color: 'rgb(50, 171, 96)',
        width: 3
      }, 
    }]*/

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

