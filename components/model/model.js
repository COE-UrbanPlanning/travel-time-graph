import Rx from 'rxjs/Rx';

export default class Model {
  constructor() {
    this.state = {
      matrix: new Rx.BehaviorSubject([]),
      coords: new Rx.BehaviorSubject({}),
      time: new Rx.BehaviorSubject(''),
      zone: new Rx.BehaviorSubject('')
    };
  }
  
  setMatrix(arr) {
    this.state.matrix.next(this._buildMatrixLookup(arr));
  }
  
  setCoords(json) {
    this.state.coords.next(json.features);
  }
  
  _buildMatrixLookup(arr) {
    var lookup = {};
    arr.forEach(row => {
      lookup[row[' ']] = row;
    });
    return lookup;
  }
}
