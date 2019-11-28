import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import GeoJSON from "ol/format/GeoJSON";
import { Heatmap as HeatmapLayer, Tile as TileLayer } from "ol/layer";
import Stamen from "ol/source/Stamen";
import VectorSource from "ol/source/Vector";

const vector = new HeatmapLayer({
  source: new VectorSource({
    url:
      "https://raw.githubusercontent.com/GeoBeer/geobeer-analytics/master/Auxiliary-Data/Events.geojson",
    format: new GeoJSON()
  }),
  // gradient: ['#F0F0D8', '#DDDDBA', '#C9C99B', '#ACAC79', '#111106', '#F0F0D8', '#DDDDBA', '#C9C99B'],
  // gradient: ['#C04800', '#D86000', '#D87800', '#F09000', '#F79400', '#C04800', '#D86000', '#D87800'],
  gradient: ["#F5F5F5", "#F5DF86", "#F0D860", "#F1D744", "#E7CA55", "#F5F5F5", "#F5DF86", "#F0D860"],
  blur: 20,
  radius: 25
});

const raster = new TileLayer({
  source: new Stamen({
    layer: "toner"
  })
});

new Map({
  layers: [raster, vector],
  target: "map",
  view: new View({
    center: [893415, 5922383],
    zoom: 8
  })
});
