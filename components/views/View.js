import Rx from 'rxjs/Rx';

export default class View {
  constructor(observable) {
    this.stream = observable;
  }
  
  init() {
    this.stream.subscribe(this.update.bind(this));
  }
  
  update(data) {
    
  }
}
