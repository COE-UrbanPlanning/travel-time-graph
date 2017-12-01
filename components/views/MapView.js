import * as d3 from 'd3';
import Rx from 'rxjs/Rx';
import L from 'leaflet';

import View from './View.js';

export default class MapView extends View {
  
  constructor(observables, options) {
    super(observables);
    this.options = options;
  }
  
  init() {
    d3.select('#map')
      .style('width', window.innerWidth + 'px')
      .style('height', window.innerHeight + 'px');
    
    const mapKey = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png';
    const map = new L.Map('map', {center: this.options.center, zoom: 11})
      .addLayer(new L.TileLayer(mapKey));
    
    L.svg().addTo(map);
    
    super.init();
  }
  
  update(data) {
    console.log(data);
  }
}
