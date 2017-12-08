import * as d3 from 'd3';

import View from './View.js';

export default class InfoView extends View {
  constructor(model, streamName, options) {
    super(model, streamName);

    this.colourScale = options.scale;
    this.div = d3.select('#zone-info');
    this.zoneSpan = this.div.select('.info-zone');
    this.graphSvg = this.div.append('svg')
        .classed('graph', true)
        .attr('width', 200)
        .attr('height', 0);

    this.xScale = d3.scaleLinear()
        .range([0, 200]);
    this.yScale = d3.scaleLinear();
    // this.line = d3.line().curve(d3.curveCatmullRom);
    this.line = d3.line().curve(d3.curveBasis);
    this.area = d3.area().curve(d3.curveBasis);
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

  _buildGradient() {
    const domain = this.xScale.domain();
    return this.colourScale.domain().map(d => {
      return {
        offset: Math.round(d/domain[1]*100) + '%',
        colour: this.colourScale(d)
      };
    });
  }

  _setGradient(gradData) {
    var extent = this.xScale.domain();
    var grad = this.graphSvg.select("linearGradient")
        .attr("x1", this.xScale(extent[0])).attr("y1", 0)
        .attr("x2", this.xScale(extent[1])).attr("y2", 0)
        .selectAll("stop")
        .data(gradData);

    grad.enter()
        .append("stop")
        .merge(grad)
        .attr("offset", function(d) { return d.offset; })
        .attr("stop-color", function(d) { return d.colour; });
    grad.exit().remove();
  }

  init() {
    this.div.style('display', 'flex');
    this.graphSvg.append('defs')
        .append('linearGradient')
        .attr("id", "line-gradient")
        .attr("gradientUnits", "userSpaceOnUse");
    this.graphSvg.append('path')
        .classed('graph-line', true);
    this.graphSvg.append('path')
        .classed('graph-area', true);

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
        
    this._setGradient(this._buildGradient());

    this.line
        .x(d => this.xScale(d[0]))
        .y(d => this.yScale(d[1]));
        
    this.area
        .x(d => this.xScale(d[0]))
        .y0(this.div.node().getBoundingClientRect().height - 15)
        .y1(d => this.yScale(d[1]));

    this.graphSvg.select('.graph-line')
        .attr('fill', 'none')
        .attr('stroke', 'url(#line-gradient)')
        .attr('stroke-width', '2')
        .attr('d', this.line(graphData));
        
    this.graphSvg.select('.graph-area')
        .attr('fill', 'url(#line-gradient)')
        .attr('stroke', 'none')
        .attr('opacity', 0.5)
        .attr('d', this.line(graphData));
  }
}
