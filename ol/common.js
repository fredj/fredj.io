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
      id: 'standard',
      visible: true,
      source: new ol.source.OSM()
    }),
    new ol.layer.TileLayer({
      id: 'cycle',
      visible: false,
      source: new ol.source.OSM({
        url: 'http://{a-c}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png'
      })
    }),
    new ol.layer.TileLayer({
      id: 'transport',
      visible: false,
      source: new ol.source.OSM({
        url: 'http://{a-c}.tile.opencyclemap.org/transport/{z}/{x}/{y}.png'
      })
    }),
    new ol.layer.TileLayer({
      id: 'mapquest',
      visible: false,
      source: new ol.source.MapQuestOSM()
    })
  ],
  view: new ol.View2D({
    center: [0, 0],
    zoom: 2
  })
});

var target = $(map.getTarget());
$(target.data('ol-map-target') || target).data('ol-map', map);

$('[data-ol-bind-target^=layer]').each(function() {
  var $this = $(this);
  var target =  $this.data('ol-bind-target').split(':');
  var property = $this.data('ol-bind-prop') || $this.closest('[data-ol-bind-prop]').data('ol-bind-prop');
  var key = $this.prop('checked') == undefined ? 'value' : 'checked';

  // FIXME: should start from property
  var map = $this.parents().map(function() { return $(this).data('ol-map'); }).get(0);

  var input = new ol.dom.Input($this.get(0));

  map.getLayers().forEach(function(layer) {
    if (layer.get('id') === target[1]) {
      input.bindTo(key, layer, property); // FIXME: memory leak ?
      return;
    }
  });
});
