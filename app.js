import * as d3 from 'd3';

import Model from './components/model/model.js';
import MapView from './components/views/MapView.js';
import TooltipView from './components/views/TooltipView.js';

function buildMatrixLookup(arr) {
  var lookup = {};
  var indexCol = Object.keys(arr[0]).filter(k => k.match(/\s+/) !== null)[0];
  arr.forEach(row => {
    lookup[row[indexCol]] = row;
  });
  return lookup;
}

class App {
  constructor(matrices, matrixName, coords) {
    this.model = new Model(matrices, coords);
    this.model.setData('time', matrixName);
        
    this.views = [
      new MapView(this.model, 'travelTime', {center: [53.54, -113.5], coords: coords}),
      new TooltipView(this.model, 'zoneUnderMouse')
    ];
  }
  
  go() {
    window.app = this;
    this.views.forEach(view => { view.init(); });
  }
}

const MATRICES_SPEC = [
  ['AMCr', './data/TravelTimeAMcrown.csv'],
  ['AMSh', './data/TravelTimeAMshoulder.csv'],
  ['PMCr', './data/TravelTimePMcrown.csv'],
  ['PMSh', './data/TravelTimePMshoulder.csv'],
  ['Off', './data/TravelTimeOff.csv']
];

const COORDS_URL = './data/taz1669.geojson';

var q = d3.queue();
q.defer(d3.json, COORDS_URL);
MATRICES_SPEC.forEach(m => { q.defer(d3.csv, m[1]); });
q.await((error, coords, ...matrices) => {
  const matrixDict = {};
  MATRICES_SPEC.forEach((m, i) => {
    matrixDict[m[0]] = buildMatrixLookup(matrices[i]);
  });
  window.app = new App(matrixDict, MATRICES_SPEC[0][0], coords);
  window.app.go();
});

window.d3 = d3;
  