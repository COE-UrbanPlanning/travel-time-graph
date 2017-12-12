import * as d3 from 'd3';
import Rx from 'rxjs/Rx';

export default class Model {
  constructor(matrices, coords, labels) {
    this._matrices = matrices;
    this._coords = coords;
    this._labels = labels;
    
    this._state = {
      time: new Rx.BehaviorSubject(''),
      selectedZone: new Rx.BehaviorSubject(''),
      mouseZone: new Rx.BehaviorSubject(''),
      mousePosition: new Rx.BehaviorSubject([])
    };
    
    this.streams = {
      time: this._state.time,
      travelTime: Rx.Observable.combineLatest(
        this._state.time,
        this._state.selectedZone
      ).map(([time, zone]) => {
        if (!zone) {
          return {times: {}};
        }
        return {
          zone: zone,
          zoneName: labels[zone],
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
          zoneName: labels[mZone],
          mouseX: mouse.x,
          mouseY: mouse.y,
          time: this._matrices[time][sZone][mZone]
        };
      })
    };
  }
  
  setData(stream, data) {
    if (this._state[stream].value !== data) {
      this._state[stream].next(data);
    }
  }
}
