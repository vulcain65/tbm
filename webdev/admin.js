/** @format */

"use strict";

/** @format */
let jsonInfoLine = {};
let lines = {};
let destinations = {};
let stopPoints = {};
let btView = {};
let delay = {};

const list = {};
const x = setInterval(function() {
  for (let [key, value] of Object.entries(list)) {
    if (value.enable){
      console.log(`compute : ${key}`);
      computeStopPoint(value)
    }
  }
}, 30000);
/*
 * --------------------------------------------  LINES
 */
const onFetchSuccessLines = json => {
  jsonInfoLine = json;
  jsonInfoLine.destinations = {};

  lines = document.getElementById("lines");
  destinations = document.getElementById("destinations");
  stopPoints = document.getElementById("stopPoints");
  btView = document.getElementById("btView");
  delay = document.getElementById("delay");

  destinations.disabled = true;
  stopPoints.disabled = true;
  btView.disabled = true;

  const opt = document.createElement("option");
  opt.value = "---";
  opt.text = " ----- ligne ----- ";
  lines.add(opt);

  var opt1 = document.createElement("option");
  opt1.value = "---";
  opt1.text = " -------------------------- ";
  destinations.add(opt1);

  var opt2 = document.createElement("option");
  opt2.value = "---";
  opt2.text = " -------------------------- ";
  stopPoints.add(opt2);

  json.lines.map(function(line) {
    var opt = document.createElement("option");
    opt.value = line.code;
    opt.text = line.longName;
    lines.add(opt);
  });
  /* change line */
  lines.addEventListener("change", function() {
    stopPoints.disabled = true;
    btView.disabled = true;
    stopPoints.innerText = null;
    stopPoints.add(opt2);
    if (lines.options[0].value == "---") {
      lines.remove(0);
    }
    //populate Destinations
    fetch(
      "https://ws.infotbm.com/ws/1.0/network/line-informations/" + this.value
    )
      .then(response => response.json())
      .then(onFetchSuccessLine)
      .catch(onFetchErrorLine);
  });
  /* change stopPoint */
  stopPoints.addEventListener("change", function() {
    btView.disabled = false;
    if (stopPoints.options[0].value == "---") {
      stopPoints.remove(0);
    }
  });
  /* add stopPoint analyse */
  btView.addEventListener("click", function() {
    //var lineValue = lines.options[lines.selectedIndex].value;
    var stopPointValue = stopPoints.options[stopPoints.selectedIndex].value;
    var ret = {};
    ret.enable = false;
    ret.url =
      "https://ws.infotbm.com/ws/1.0/get-realtime-pass/" + stopPointValue;
    ret.line = lines.options[lines.selectedIndex].text;
    ret.vline = lines.options[lines.selectedIndex].value;
    ret.destination = destinations.options[destinations.selectedIndex].text;
    ret.vdestination = destinations.options[destinations.selectedIndex].value;
    ret.stopPoint = stopPoints.options[stopPoints.selectedIndex].text;
    ret.vstopPoint = stopPoints.options[stopPoints.selectedIndex].value;
    ret.NumStopPoint = ret.vstopPoint.split("/")[0];
    ret.delay = delay.value;
    ret.id = "Z" + ret.vline + "-" + ret.NumStopPoint + "-" + ret.delay;
    ret.infoLine = jsonInfoLine.destinations[Number(ret.vline)];
    ret.infoStopPoint = jsonInfoLine.destinations[Number(ret.vline)].routes[
      Number(ret.vdestination)
    ].stopPoints.find(o => o.externalCode === ret.NumStopPoint);

    if (document.getElementById(ret.id) == null) {
      const template = document.querySelector("#templateStopPoint");
      const clone = document.importNode(template.content, true);
      clone.querySelector("div").id = ret.id;
      clone.querySelector(".js-title").innerText = ret.stopPoint;
      clone.querySelector(".js-stitle").innerText =
        ret.line + " : " + ret.destination;
      document.querySelector("#cards").appendChild(clone);
      list[ret.id] = ret;
      computeStopPoint(ret);
    } else {
      console.log("element not create. element exist");
    }
  });
};
const onFetchErrorLines = error => {
  console.log(error);
  alert("onFetchErrorLines");
};
/*
 * --------------------------------------------  DESTINATIONS
 *
 */
const onFetchSuccessDestinations = json => {
  destinations.addEventListener("change", function() {
    if (destinations.options[0].value == "---") {
      destinations.remove(0);
    }
  });
};
const onFetchErrorDestinations = json => {
  alert("onFetchErrorDestinations");
};
/*
 * --------------------------------------------  LINE
 *
 */
const onFetchSuccessLine = json => {
  destinations.innerText = null;
  var opt = document.createElement("option");
  opt.value = "---";
  opt.text = " ----- direction ----- ";
  destinations.add(opt);
  jsonInfoLine.destinations[json.externalCode] = json;

  jsonInfoLine.destinations[json.externalCode].routes.map(function(
    route,
    index
  ) {
    var opt = document.createElement("option");
    opt.value = index;
    opt.text = route.name;
    destinations.add(opt);
  });
  //var destinations = document.getElementById('destinations');
  destinations.disabled = false;
  var opt = document.createElement("option");

  destinations.addEventListener("change", function() {
    const index = this.options[this.selectedIndex].value;
    console.log(
      jsonInfoLine.destinations[json.externalCode].routes[index].name
    );
    if (destinations.options[0].value == "---") {
      destinations.remove(0);
    }
    //var stopPoints = document.getElementById('stopPoints');
    stopPoints.innerText = null;
    var opt = document.createElement("option");
    opt.value = "---";
    opt.text = " ----- arrêt ----- ";
    stopPoints.add(opt);
    btView.disabled = TextTrackCue;

    jsonInfoLine.destinations[json.externalCode].routes[index][
      "stopPoints"
    ].map(function(stopPoint, index) {
      //var stopPoints = document.getElementById('stopPoints');
      //console.log(stopPoint.externalCode + " : " + stopPoint.name);
      var opt = document.createElement("option");
      opt.value =
        stopPoint.externalCode +
        "/" +
        jsonInfoLine.destinations[json.externalCode].code;
      opt.text = stopPoint.name;
      stopPoints.add(opt);
    });
    stopPoints.disabled = false;
    console.log(this);
    //populateDestinations(this.value)
  });
};
const onFetchErrorLine = json => {
  alert("onFetchErrorLine");
  console.log(json);
};
/*
 * --------------------------------------------  STOPPOINT
 *
 */
const onFetchSuccessStopPoint = json => {
  alert(stp.url);
  console.log("onFetchSuccessStopPoint");
};
const onFetchErrorStopPoint = json => {
  alert("onFetchErrorStopPoint");
  console.log(json);
};

function computeStopPoint(stp) {
  console.log("computeStopPoint : " + stp.url);
  fetch(stp.url)
    .then(response => response.json())
    .then(function(json) {
      var bodyPassages = document.querySelector(`#${stp.id} .js-bodyPassages`);
      var stopArray = [];
      console.log("computeStopPoint : start");
      console.log(json);
      for (let [key, value] of Object.entries(json.destinations)) {
        console.log(`--> ${key}`);
        value.map(function(st, index) {
          stopArray.push(st);
        });
      }
      // sort
      console.log("sort");
      stopArray.sort(function(a, b) {
        return (
          Number(a.waittime.replace(/:/gi, "")) -
          Number(b.waittime.replace(/:/gi, ""))
        );
      });
      // add delay

      // compute
      console.log(stopArray);
      let nb_st = stopArray.length; // nb <tr> in <tbody>
      var nb_tr = bodyPassages.querySelectorAll("tr").length; // nb stopPoint return tbm
      console.log(`nb_st = ${nb_st} / nb_tr = ${nb_tr}`);
      if (nb_tr > nb_st) {
        // if nb_tr > nb_st : delete
        do {
          let trs = bodyPassages.querySelectorAll("tr");
          document.querySelector(`#${stp.id} table`).deleteRow(nb_tr);
          nb_tr = bodyPassages.querySelectorAll(".js-bodyPassages >tr").length;
        } while (nb_tr > nb_st);
      } else if (nb_tr < nb_st) {
        // if nb_tr < nb_st : create
        do {
          console.log("add row");
          let template = document.importNode(
            document.querySelector("#templatePassage").content,
            true
          );
          bodyPassages.appendChild(template);
          nb_tr++;
        } while (nb_tr < nb_st);
      }
      // display value
      stopArray.map(function(s, index) {
        let body = document.querySelector(`#${stp.id} tbody`);
        body
          .getElementsByTagName("tr")
          [index].getElementsByTagName("td")[0].innerHTML = s.destination_name;
        body
          .getElementsByTagName("tr")
          [index].getElementsByTagName("td")[1].innerHTML = s.waittime;

        console.log(s.waittime);
      });
      // active this stopPoint
      stp.enable = true;
    })
    .catch(onFetchErrorStopPoint);

  /*fetch(stp.url)
    .then(response => response.json())
    .then(onFetchSuccessStopPoint)
    .catch(onFetchErrorStopPoint);*/
}
/*
 * --------------------------------------------  START
 *
 */
fetch("./lines.json")
  .then(response => response.json())
  .then(onFetchSuccessLines)
  .catch(onFetchErrorLines);
