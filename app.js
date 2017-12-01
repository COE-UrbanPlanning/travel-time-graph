import * as d3 from 'd3';

import Model from './components/model/model.js';
import MapView from './components/views/MapView.js';

class App {
  constructor(matrix, coords) {
    this.model = new Model();
    this.model.setMatrix(matrix);
    this.model.setCoords(coords);
        
    this.views = [
      new MapView(this.model.state, {center: [53.54, -113.5]})
    ];
  }
  
  go() {
    this.views.forEach(view => { view.init(); });
  }
}

const MATRIX_URL = './data/TravelTimeAMcrown.csv';
const COORDS_URL = './data/taz1669.geojson';

window.d3 = d3;

d3.queue()
  .defer(d3.csv, MATRIX_URL)
  .defer(d3.json, COORDS_URL)
  .await((error, matrix, coords) => {
    new App(matrix, coords).go();
  });
  