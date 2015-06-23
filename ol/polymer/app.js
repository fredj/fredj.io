var scope = document.querySelector('#scope');

var source = new ol.source.Vector();

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
    }),
    new ol.layer.Vector({
      source: source
    })
  ],
  view: new ol.View({
    center: [907700, 5890660],
    zoom: 8,
    rotation: Math.PI / 3
  })
});

scope.draw = new ol.interaction.Draw({
  source: source,
  type: "LineString"
});
scope.draw.active = false;
scope.map.addInteraction(scope.draw);
