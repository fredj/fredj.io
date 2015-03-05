var scope = document.querySelector('#scope');

scope.map = new ol.Map({
  controls: [],
  layers: [
    new ol.layer.Tile({
      label: 'osm',
      visible: true,
      source: new ol.source.OSM()
    }),
    new ol.layer.Tile({
      label: 'stamen watercolor',
      visible: false,
      source: new ol.source.Stamen({
        layer: 'watercolor'
      })
    })
  ],
  view: new ol.View({
    center: [907700, 5890660],
    zoom: 8,
    rotation: Math.PI / 3
  })
});
var featureOverlay = new ol.FeatureOverlay({
  map: scope.map
});
scope.draw = new ol.interaction.Draw({
  features: featureOverlay.getFeatures(),
  type: "LineString"
});
scope.draw.active = false;
scope.map.addInteraction(scope.draw);
