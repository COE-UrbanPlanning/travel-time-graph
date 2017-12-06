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

const scaleColours = [
  'rgb(243,203,211)',
  'rgb(234,169,189)',
  'rgb(221,136,172)',
  'rgb(202,105,157)',
  'rgb(177,77,142)',
  'rgb(145,53,125)',
  'rgb(108,33,103)'
];

const scale = d3.scaleThreshold()
    .domain([10, 20, 30, 40, 50, 60])
    .range(scaleColours);

class App {
  constructor(matrices, matrixName, coords) {
    this.model = new Model(matrices, coords);
    this.model.setData('time', matrixName);
        
    this.views = [
      new MapView(this.model, 'travelTime', {center: [53.54, -113.5], coords: coords, scale: scale}),
      new TooltipView(this.model, 'zoneUnderMouse', {scale: scale})
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
  