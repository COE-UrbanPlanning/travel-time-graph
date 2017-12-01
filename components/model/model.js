import Rx from 'rxjs/Rx';

export default class Model {
  constructor(matrices, coords) {
    this._matrices = matrices;
    this._coords = coords;
    
    this._state = {
      time: new Rx.BehaviorSubject(''),
      zone: new Rx.BehaviorSubject('')
    };
    
    this.streams = {
      travelTime: Rx.Observable.combineLatest(
          this._state.time,
          this._state.zone
        ).map((time, zone) => {
          if (!zone) {
            return [];
          }
          return this._matrices[time][zone];
        })
    };
  }
  
  setTime(time) {
    this._state.time.next(time);
  }
  
  setZone(zone) {
    this._state.zone.next(zone);
  }
}
