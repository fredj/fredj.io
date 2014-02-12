var vector = new ol.layer.Heatmap({
  source: new ol.source.KML({
    projection: 'EPSG:3857',
    url: 'data/kml/2012_Earthquakes_Mag5.kml'
  }),
  radius: 5
});

var raster = new ol.layer.Tile({
  source: new ol.source.Stamen({
    layer: 'toner'
  })
});

var map = new ol.Map({
  layers: [raster, vector],
  renderer: 'canvas',
  target: 'map',
  view: new ol.View2D({
    center: [0, 0],
    zoom: 2
  })
});
