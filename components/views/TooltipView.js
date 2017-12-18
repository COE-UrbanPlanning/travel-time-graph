import * as d3 from 'd3';

import View from './View.js';

export default class TooltipView extends View {
  constructor(model, streamName, options) {
    super(model, streamName);

    this.scale = options.scale;
    this.units = options.units;
  }
  
  init() {
    this.tooltip = d3.select('#content')
        .append('div')
        .classed('tooltip hidden', true);
      
    this.tooltip.append('div')
        .classed('tooltip-zone', true);
    var ttContent = this.tooltip.append('div')
        .classed('tooltip-content', true);
    ttContent.append('span')
        .classed('tooltip-content-value', true);
    ttContent.append('span')
        .classed('tooltip-content-units', true)
        .text(this.units);
        
    super.init();
  }
  
  update(data) {
    const {scale, tooltip} = this;
    
    if (data['zoneName'] && data['mouseX'] && data['mouseY']) {
      const value = Math.round(data['value']);
      tooltip.select('.tooltip-zone')
          .text(data['zoneName']);
      tooltip.select('.tooltip-content-value')
          .style('color', scale(value))
          .text('~' + value);
      
      tooltip.classed('hidden', false);
      
      tooltip.style('left', data['mouseX'] + 'px')
          .style('top', data['mouseY'] - tooltip.node().getBoundingClientRect().height + 'px');
    } else {
      tooltip.classed('hidden', true);
    }
  }
}
