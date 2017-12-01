import Rx from 'rxjs/Rx';

export default class View {
  constructor(observables) {
    this.data = Rx.Observable.combineLatest(...observables);
    this.streams = observables;
  }
  
  init() {
    this.data.subscribe(data => { this.update(data); });
  }
  
  update(data) {
    
  }
}
