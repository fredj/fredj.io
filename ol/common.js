var map = new ol.Map({
  target: 'map',
  renderer: ol.RendererHint.CANVAS,
  controls: ol.control.defaults({
    attribution: false,
    logo: false,
    zoom: false
  }),
  layers: [
    new ol.layer.TileLayer({
      visible: true,
      source: new ol.source.OSM()
    })
  ],
  view: new ol.View2D({
    center: [0, 0],
    zoom: 2
  })
});
