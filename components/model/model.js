import * as d3 from 'd3';
import Rx from 'rxjs/Rx';

export default class Model {
  constructor(matrices, coords, labels) {
    this._matrices = matrices;
    this._coords = coords;
    this._labels = labels;
    
    this._state = {
      matrixID: new Rx.BehaviorSubject(''),
      selectedZone: new Rx.BehaviorSubject(''),
      mouseZone: new Rx.BehaviorSubject(''),
      mousePosition: new Rx.BehaviorSubject([])
    };
    
    this.streams = {
      matrixID: this._state.matrixID,
      selectedData: Rx.Observable.combineLatest(
        this._state.matrixID,
        this._state.selectedZone
      ).map(([matrixID, zone]) => {
        if (!zone) {
          return {matrixData: {}};
        }
        return {
          zone: zone,
          zoneName: labels[zone],
          matrixData: this._matrices[matrixID][zone]
        };
      }),
      
      zoneUnderMouse: Rx.Observable.combineLatest(
        this._state.matrixID,
        this._state.selectedZone,
        this._state.mouseZone,
        this._state.mousePosition
      ).map(([matrixID, sZone, mZone, mouse]) => {
        if (!sZone || !mZone || !matrixID) {
          return {};
        }
        return {
          zone: mZone,
          zoneName: labels[mZone],
          mouseX: mouse.x,
          mouseY: mouse.y,
          value: this._matrices[matrixID][sZone][mZone]
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
