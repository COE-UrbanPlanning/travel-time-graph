import * as d3 from 'd3';
import Rx from 'rxjs/Rx';

export default class Model {
  constructor(matrices, coords) {
    this._matrices = matrices;
    this._coords = coords;
    
    this._state = {
      time: new Rx.BehaviorSubject(''),
      selectedZone: new Rx.BehaviorSubject(''),
      mouseZone: new Rx.BehaviorSubject(''),
      mousePosition: new Rx.BehaviorSubject([])
    };
    
    this.streams = {
      travelTime: Rx.Observable.combineLatest(
        this._state.time,
        this._state.selectedZone
      ).map(([time, zone]) => {
        if (!zone) {
          return {times: {}};
        }
        return {
          zone: zone,
          times: this._matrices[time][zone]
        };
      }),
      
      zoneUnderMouse: Rx.Observable.combineLatest(
        this._state.time,
        this._state.selectedZone,
        this._state.mouseZone,
        this._state.mousePosition
      ).map(([time, sZone, mZone, mouse]) => {
        if (!sZone || !mZone || !time) {
          return {};
        }
        return {
          zone: mZone,
          mouseX: mouse.x,
          mouseY: mouse.y,
          time: this._matrices[time][sZone][mZone]
        };
      })
    };
  }
  
  setData(stream, data) {
    this._state[stream].next(data);
  }
}
