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
    this.isDragging = this.isDragging.bind(this);
  }
  
  isDragging() {
    return this._dragging;
  }
  
  setDragging(bool) {
    this._dragging = bool;
  }
  
  init() {
    var model = this.model;
    
    d3.select('#map')
      .style('width', window.innerWidth + 'px')
      .style('height', window.innerHeight + 'px');
    
    const mapKey = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png';
    this.map = new L.Map('map', {center: this.center, zoom: 10})
      .addLayer(new L.TileLayer(mapKey));
    
    L.svg({clickable: true}).addTo(this.map);
    this.svg = d3.select(this.map.getPanes().overlayPane).select('svg').attr('pointer-events', 'auto');
    
    this.map.on('movestart', () => { this.setDragging(true); });
    this.map.on('moveend', () => { this.setDragging(false); });
    this.svg.on('mousemove', function() {
      model.setData('mousePosition', d3.mouse(this));
    });
    
    super.init();
  }
  
  update(data) {
    const {coords, key, map, model, scale, stream, svg, isDragging} = this;
    
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
        .style('pointer-events', 'auto')
        .attr('fill', d => {
          let taz = key(d);
          if (data[taz]) {
            return scale(+data[taz]);
          }
          return 'rgb(31,31,31)';
        })
        .on('click', d => {
          if (!isDragging()) {
            model.setData('selectedZone', key(d));
          }
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
    
    function reset() {
      allFeatures.attr('d', path);
    }
    
    map.on('moveend', reset);
    this._onMoveEnd = reset;
    reset();
  }
}
