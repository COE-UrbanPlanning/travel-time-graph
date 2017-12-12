import * as d3 from 'd3';

import Model from './components/model/model.js';
import MapView from './components/views/MapView.js';
import TooltipView from './components/views/TooltipView.js';
import InfoView from './components/views/InfoView.js';
import SliderView from './components/views/SliderView.js';

function buildMatrixLookup(arr) {
  var lookup = {};
  var indexCol = Object.keys(arr[0]).filter(k => k.match(/\s+/) !== null)[0];
  arr.forEach(row => {
    let idx = row[indexCol];
    delete row[indexCol];
    lookup[idx] = row;
  });
  return lookup;
}

const MATRICES_SPEC = [
  ['AMSh', './data/TravelTimeAMshoulder.csv', 'AM'],
  ['AMCr', './data/TravelTimeAMcrown.csv', 'AM Peak'],
  ['Off', './data/TravelTimeOff.csv', 'Midday'],
  ['PMSh', './data/TravelTimePMshoulder.csv', 'PM'],
  ['PMCr', './data/TravelTimePMcrown.csv', 'PM Peak']
];

const COORDS_URL = './data/taz1669.geojson';
const LABELS_URL = './data/TAZ1669_Labels.csv';

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
  constructor(matrices, matrixName, coords, labels) {
    this.model = new Model(matrices, coords, labels);
    this.model.setData('time', matrixName);
        
    this.views = [
      new MapView(this.model, 'travelTime', {center: [53.54, -113.5], coords: coords, scale: scale}),
      new TooltipView(this.model, 'zoneUnderMouse', {scale: scale}),
      new InfoView(this.model, 'travelTime', {scale: scale}),
      new SliderView(this.model, 'time', {times: MATRICES_SPEC.map(m => m[0])})
    ];
  }
  
  go() {
    window.app = this;
    this.views.forEach(view => { view.init(); });
  }
}

var q = d3.queue();
q.defer(d3.json, COORDS_URL)
  .defer(d3.csv, LABELS_URL)
MATRICES_SPEC.forEach(m => { q.defer(d3.csv, m[1]); });
q.await((error, coords, labels, ...matrices) => {
  const labelDict = {};
  labels.forEach(l => {
    labelDict[l['TAZ_New']] = l['Label'];
  });
  
  const matrixDict = {};
  MATRICES_SPEC.forEach((m, i) => {
    matrixDict[m[0]] = buildMatrixLookup(matrices[i]);
  });
  window.app = new App(matrixDict, MATRICES_SPEC[0][0], coords, labelDict);
  window.app.go();
});

window.d3 = d3;
  