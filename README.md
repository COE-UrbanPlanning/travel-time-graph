# travel-time-graph
This visualization displays travel model outputs on an interactive map. Users can click on different zones of the map to see values relative to the selected zone (eg. auto travel time from that zone to anywhere else). The colour scale of the map is fully customizable, as well as the top-right slider which switches between different output matrices (eg. matrices for different times of day or different scenarios).

## Installation

- Install Node.js
- Navigate to this project's root
- Run `npm install`
- You may also need to run `npm install -g webpack http-server`
- In the d3 folder, run `webpack`

## Usage

- In the project root, run `webpack`. Webpack will bundle all of the libraries and components, and will watch your project's files for changes.
- In another terminal, run `npm start`
- Point your browser at localhost:3030
