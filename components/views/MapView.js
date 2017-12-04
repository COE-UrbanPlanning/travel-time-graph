import * as d3 from 'd3';
import Rx from 'rxjs/Rx';
import L from 'leaflet';

import View from './View.js';

const scaleColours = [
  'rgb(218,218,235)',
  'rgb(188,189,220)',
  'rgb(158,154,200)',
  'rgb(117,107,177)',
  'rgb(84,39,143)'
];

export default class MapView extends View {
  
  constructor(observables, options) {
    super(observables);
    this.coords = options.coords;
    this.center = options.center;
    this.scale = d3.scaleThreshold()
        .domain([5, 15, 30, 60])
        .range(scaleColours);
  }
  
  init() {
    d3.select('#map')
      .style('width', window.innerWidth + 'px')
      .style('height', window.innerHeight + 'px');
    
    const mapKey = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png';
    this.map = new L.Map('map', {center: this.center, zoom: 10})
      .addLayer(new L.TileLayer(mapKey));
    
    L.svg().addTo(this.map);
    this.svg = d3.select(this.map.getPanes().overlayPane).select('svg');
    
    super.init();
  }
  
  update(data) {
    console.log(data);
    const {coords, map, scale, svg} = this;
    
    // prevents duplicate moveend handlers
    if (this._onMoveEnd) {
      map.off('moveend', this._onMoveEnd);
    }
    
    function projectPoint(x, y) {
      var point = map.latLngToLayerPoint(new L.LatLng(y, x));
      this.stream.point(point.x, point.y);
    }
    
    function setFeatureProperties(features) {
      features.attr('d', path)
        .attr('opacity', 0.8)
        .attr('stroke', 'rgb(9,9,9)')
        .attr('fill', d => {
          let taz = d.properties['TAZ_New'];
          if (data[taz]) {
            return scale(+data[taz]);
          }
          return 'rgb(31,31,31)';
        });
    }
    
    var transform = d3.geoTransform({point: projectPoint}),
        path = d3.geoPath().projection(transform);
    
    var features = svg.select('g').selectAll('path')
        .data(coords.features, d => d.properties['TAZ_New']);
    
    var allFeatures = features.enter()
        .append('path')
        .merge(features);
    
    allFeatures.call(setFeatureProperties);
    
    function reset() {
      console.log('reset');
      allFeatures.attr('d', path);
    }
    
    map.on('moveend', reset);
    this._onMoveEnd = reset;
    reset();
  }
}
