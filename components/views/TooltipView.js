import * as d3 from 'd3';

import View from './View.js';

export default class TooltipView extends View {
  constructor(model, streamName, options) {
    super(model, streamName);

    this.scale = options.scale;
  }
  
  init() {
    this.tooltip = d3.select('#content')
        .append('div')
        .classed('tooltip hidden', true);
      
    this.tooltip.append('div')
        .classed('tooltip-zone', true);
    var ttTime = this.tooltip.append('div')
        .classed('tooltip-time', true);
    ttTime.append('span')
        .classed('tooltip-time-number', true);
    ttTime.append('span')
        .classed('tooltip-time-minutes', true)
        .text('minutes');
        
    super.init();
  }
  
  update(data) {
    const {scale, tooltip} = this;
    
    if (data['zone'] && data['mouseX'] && data['mouseY']) {
      const minutes = Math.round(data['time']);
      tooltip.select('.tooltip-zone')
          .text(data['zone']);
      tooltip.select('.tooltip-time-number')
          .style('color', scale(minutes))
          .text('~' + minutes);
      
      tooltip.style('left', data['mouseX'] + 'px')
          .style('top', data['mouseY'] - tooltip.node().getBoundingClientRect().height + 'px');
      
      tooltip.classed('hidden', false);
    } else {
      tooltip.classed('hidden', true);
    }
  }
}
