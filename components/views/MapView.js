import * as d3 from 'd3';
import Rx from 'rxjs/Rx';
import L from 'leaflet';

import View from './View.js';

export default class MapView extends View {
  
  constructor(observables, options) {
    super(observables);
    this.coords = options.coords;
    this.center = options.center;
  }
  
  init() {
    d3.select('#map')
      .style('width', window.innerWidth + 'px')
      .style('height', window.innerHeight + 'px');
    
    const mapKey = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png';
    this.map = new L.Map('map', {center: this.center, zoom: 11})
      .addLayer(new L.TileLayer(mapKey));
    
    L.svg().addTo(this.map);
    this.svg = d3.select(this.map.getPanes().overlayPane).select('svg');
    
    super.init();
  }
  
  update(data) {
    console.log(data);
    const {map, svg, coords} = this;
    
    function projectPoint(x, y) {
      var point = map.latLngToLayerPoint(new L.LatLng(y, x));
      this.stream.point(point.x, point.y);
    }
    
    var transform = d3.geoTransform({point: projectPoint}),
        path = d3.geoPath().projection(transform);
    
    var features = svg.select('g').selectAll('path')
        .data(coords.features)
        .enter()
        .append('path');
    
    function reset() {
      features.attr('d', path)
          .attr('fill', 'navy');
    }
    map.on('moveend', reset);
    reset();
  }
}
