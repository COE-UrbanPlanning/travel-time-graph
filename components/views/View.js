import Rx from 'rxjs/Rx';

export default class View {
  constructor(model, streamName) {
    this.model = model;
    this.stream = this.model.streams[streamName];
  }
  
  init() {
    this.stream.subscribe(this.update.bind(this));
  }
  
  update(data) {
    
  }
}
