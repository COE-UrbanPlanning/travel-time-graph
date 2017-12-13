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

class App {
  constructor(matrices, coords, labels, config) {
    this.model = new Model(matrices, coords, labels, config);
    this.model.setData('time', config.matrices[0].time);
    
    const scale = d3.scaleThreshold()
        .domain(config.scale.domain)
        .range(config.scale.colours);
    
    this.views = [
      new MapView(this.model, 'travelTime', {center: [53.54, -113.5], coords: coords, scale: scale}),
      new TooltipView(this.model, 'zoneUnderMouse', {scale: scale, units: config.tooltipUnits}),
      new InfoView(this.model, 'travelTime', {scale: scale, description: config.description}),
      new SliderView(this.model, 'time', {spec: config.matrices})
    ];
  }
  
  go() {
    window.app = this;
    this.views.forEach(view => { view.init(); });
  }
}

function getLabels(location, callback) {
  d3.request(location)
      .on('error', error => { callback(error); })
      .on('load', xhr => { callback(null, xhr.responseText); })
      .get();
}

d3.json('./config.json', (error, config) => {
  var q = d3.queue();
  q.defer(d3.json, config.coordsLocation)
    .defer(getLabels, config.nbhdLabelsLocation);
  config.matrices.forEach(m => { q.defer(d3.csv, m.location); });
  q.await((error, coords, labelsText, ...matrices) => {
    const header = labelsText.split('\n')[0].split(',');
    const labels = d3.csvParse(labelsText);
    const labelDict = {};
    labels.forEach(l => {
      labelDict[l[header[0]]] = l[header[1].trim()];
    });
    
    const matrixDict = {};
    config.matrices.forEach((m, i) => {
      matrixDict[m.time] = buildMatrixLookup(matrices[i]);
    });
    window.app = new App(matrixDict, coords, labelDict, config);
    window.app.go();
  });

  window.d3 = d3;
});


  