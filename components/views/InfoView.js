import * as d3 from 'd3';

import View from './View.js';

export default class InfoView extends View {
  constructor(model, streamName, options) {
    super(model, streamName);

    this.scale = options.scale;
    this.div = d3.select('#zone-info');
    this.zoneSpan = this.div.select('.info-zone');
  }
  
  init() {
    
    super.init();
  }
  
  update(data) {
    if (data.zone) {
      this.div.select('#info-current-initial').style('display', 'none');
      this.div.select('#info-current').style('display', 'initial');
      this.zoneSpan.text(data.zone);
    }
  }
}
