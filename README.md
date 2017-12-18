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

## Configuration

travel-time-graph's configuration options are stored in config.json. All keys are required.

- `coordsLocation`: The file location of the GeoJSON file representing the region.
- `description`: A description of the data being presented, shown in the bottom info pane.
- `matrices`: An array of objects, each representing a dataset to present. Each object holds the following keys:
   - `time`: A unique ID to represent this matrix.
   - `location`: The file location of the matrix data.
   - `label`: The label that should be shown for this matrix on the top-right slider.
- `nbhdLabelsLocation`: The file location for the mapping of zones to neighbourhood/district names.
- `scale`: Describes the input domain of the data and the resulting colour scale for the map:
   - `domain`: An array of numbers representing the buckets desired for the given datasets.
   - `colours`: An array of CSS colours to use for each bucket. **Note that there should be one more colour in the scale than there are entries in the domain.**
- `tooltipUnits`: The units to show in the map tooltip.
