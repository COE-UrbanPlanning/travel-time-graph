import * as d3 from 'd3';

import View from './View.js';

export default class InfoView extends View {
  constructor(model, streamName, options) {
    super(model, streamName);

    this.scale = options.scale;
    this.div = d3.select('#zone-info');
    this.zoneSpan = this.div.select('.info-zone');
    this.graphSvg = this.div.append('svg')
        .classed('graph', true)
        .attr('width', 200)
        .attr('height', 0);
        
    this.xScale = d3.scaleLinear()
        .range([0, 200]);
    this.yScale = d3.scaleLinear();
    this.line = d3.line();
  }
  
  _makeBins(values, step) {
    var ext = d3.extent(values);
    var min = Math.floor(ext[0]/step)*step;
    var max = Math.ceil(ext[1]/step)*step + 1;
    return d3.range(min, max, step);
  }
  
  _getFrequency(values, bins, step) {
    var freqs = {};
    bins.forEach(b => {
      freqs[b] = 0;
    });
    values.forEach(v => {
      freqs[Math.ceil(v/step)*step] += 1;
    });
    return Object.entries(freqs);
  }
  
  init() {
    this.div.style('display', 'flex');
    this.graphSvg.append('path');

    super.init();
  }
  
  update(data) {
    if (!data.zone) {
      this.div.select('#info-current').style('display', 'none');
      this.div.select('#info-current-initial').style('display', 'initial');
      // reset graph
      return;
    }
    this.div.select('#info-current-initial').style('display', 'none');
    this.div.select('#info-current').style('display', 'initial');
    this.zoneSpan.text(data.zone);
    
    this.graphSvg.attr('height', this.div.node().getBoundingClientRect().height - 15)
    
    const allValues = Object.values(data.times).map(t => +t);
    
    const bins = this._makeBins(allValues, 5);
    const graphData = this._getFrequency(allValues, bins, 5);
    
    this.xScale.domain(d3.extent(bins));
    this.yScale.domain([0, d3.max(graphData, d => d[1])])
        .range([this.div.node().getBoundingClientRect().height - 15, 0]);
        
    this.line
        .x(d => this.xScale(d[0]))
        .y(d => this.yScale(d[1]));
        
    this.graphSvg.select('path')
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr('d', this.line(graphData));
  }
}
