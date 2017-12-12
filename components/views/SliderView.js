import * as d3 from 'd3';

import View from './View.js';

export default class SliderView extends View {
  constructor(model, streamName, options) {
    super(model, streamName);
    
    this.labels = options.times;
    const range = d3.range(this.labels.length).map(
        d3.scaleLinear()
          .domain([0, this.labels.length-1])
          .range([0, 400])
    );
    this.scale = d3.scaleOrdinal()
        .domain(this.labels)
        .range(range);
    this._invert = d3.scaleOrdinal()
        .domain(range)
        .range(this.labels);
    
    this.div = d3.select('#slider');
    this.svg = this.div.append('svg')
        .classed('slider', true)
        .attr('width', 400)
        .attr('height', 100);
  }
  
  init() {
    const {model, scale, _invert} = this;
    this.div.style('display', 'flex');
    var track = this.svg.append('line')
        .classed('slider-track', true)
        .attr('x1', scale.range()[0])
        .attr('x2', scale.range().slice(-1)[0])
        .attr('y1', 50)
        .attr('y2', 50)
      .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .classed('slider-track-inset', true)
      .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .classed('slider-track-overlay', true);
    
    scale.domain().forEach(time => {
      this.svg.insert('circle', '.slider-track-overlay')
          .classed('slider-tick', true)
          .attr('cx', scale(time))
          .attr('cy', 50)
          .attr('r', 5);
      this.svg.insert('text', '.slider-track-overlay')
          .classed('slider-tick-text', true)
          .attr('x', scale(time))
          .attr('y', 60)
          .text(time);
    });
    
    var handle = this.svg.insert('circle', '.slider-track-overlay')
        .classed('slider-handle', true)
        .attr('cy', 50)
        .attr('r', 9);
    
    track.call(d3.drag()
        .on('start drag', function() {
          const x = d3.mouse(this)[0];
          const px = scale.range().reduce((prev, curr) => Math.abs(curr - x) < Math.abs(prev - x) ? curr : prev);
          handle.attr('cx', px);
          model.setData('time', _invert(px));
        })
      );
    
    super.init();
  }
  
  update(data) {
    
  }
}
