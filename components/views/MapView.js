import * as d3 from 'd3';
import L from 'leaflet';

import View from './View.js';

export default class MapView extends View {
  
  constructor(model, streamName, options) {
    super(model, streamName);
    
    this.key = d => d.properties['TAZ_New'];
    this.coords = options.coords;
    this.center = options.center;
    this.scale = options.scale;
    
    this._dragging = false;
    this.wasDragging = this.wasDragging.bind(this);
    this._setDragging = this._setDragging.bind(this);
  }
  
  wasDragging() {
    return this._dragging;
  }
  
  _setDragging(bool) {
    this._dragging = bool;
  }
   
  _setMapSize() {
    d3.select('#map')
      .style('width', window.innerWidth + 'px')
      .style('height', window.innerHeight + 'px');
  }
   
  init() {
    var model = this.model;
    
    this._setMapSize();
    window.onresize = this._setMapSize;
    
    const mapKey = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png';
    this.map = new L.Map('map', {center: this.center, zoom: 10})
      .addLayer(new L.TileLayer(mapKey));
    
    L.svg({clickable: true}).addTo(this.map);
    this.svg = d3.select(this.map.getPanes().overlayPane).select('svg').attr('pointer-events', 'auto');
    
    this.map.on('movestart', () => { this._setDragging(true); });
    this.map.on('mousemove', (e) => { model.setData('mousePosition', e.containerPoint); });
    this.map.on('zoomend', () => { this._setDragging(false); });
    
    super.init();
  }
  
  update(data) {
    const {coords, key, map, model, scale, stream, svg, wasDragging, _setDragging} = this;
    
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
        .attr('opacity', 0.75)
        .attr('stroke', d => {
          if (data.zone === key(d)) {
            return 'white';
          }
          return 'rgb(9,9,9)';
        })
        .attr('stroke-width', d => {
          if (data.zone === key(d)) {
            return 5;
          }
          return 1;
        })
        .style('pointer-events', 'auto')
        .transition()
        .duration(500)
        .attr('fill', d => {
          let taz = key(d);
          if (data.times[taz]) {
            if (data.zone === taz) {
              // selected
              return 'white';
            }
            return scale(+data.times[taz]);
          }
          return 'rgb(31,31,31)';
        });
        
        features.on('click', d => {
          if (!wasDragging()) {
            model.setData('selectedZone', key(d));
          }
          _setDragging(false);
        })
        .on('mouseenter', d => {
          model.setData('mouseZone', key(d));
        })
        .on('mouseleave', d => {
          model.setData('mouseZone', '');
        });
    }
    
    var transform = d3.geoTransform({point: projectPoint}),
        path = d3.geoPath().projection(transform);
    
    var features = svg.select('g').selectAll('path')
        .data(coords.features, key);
    
    var allFeatures = features.enter()
        .append('path')
        .merge(features);
    
    allFeatures.call(setFeatureProperties);
    allFeatures.sort((a, b) => {
      return data.zone === key(a);
    });
    
    function reset() {
      allFeatures.attr('d', path);
    }
    
    map.on('moveend', reset);
    this._onMoveEnd = reset;
    reset();
  }
}
