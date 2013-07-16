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
      group: 'background',
      visible: true,
      source: new ol.source.OSM()
    }),
    new ol.layer.TileLayer({
      id: 'cycle',
      group: 'background',
      visible: false,
      source: new ol.source.OSM({
        url: 'http://{a-c}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png'
      })
    }),
    new ol.layer.TileLayer({
      id: 'transport',
      group: 'background',
      visible: false,
      source: new ol.source.OSM({
        url: 'http://{a-c}.tile.opencyclemap.org/transport/{z}/{x}/{y}.png'
      })
    }),
    new ol.layer.TileLayer({
      id: 'mapquest',
      group: 'background',
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


// "layer:visible:foobar"
$(document).on('change.ol', '[data-ol-set^=layer]', function(event) {
  var element = $(event.target);
  var map = element.parents().map(function() { return $(this).data('ol-map'); }).get(0); // FIXME

  var change = element.data('ol-set').split(':');
  var property = change[1], layerId = change[2];
  var value = element.prop('checked') === undefined ? element.prop('value') : element.prop('checked');
  var group = element.prop('name');

  map.getLayers().forEach(function(layer) {
    if (layer.get('id') === layerId) {
      layer.set(property, value);
    } else {
      console.log(layer);
      if (layer.get('group') === group) {
        // FIXME: only for boolean value
        layer.set(property, !value);
      }
    }
  });
});


$(document).on('click.ol', '[data-ol-set^=view]', function(event) {
  var $this = $(this);
  var change = $this.data('ol-set').split(':');
  var prop = change[1], value = change[2];
  var map = $this.parents().map(function() { return $(this).data('ol-map'); }).get(0); // FIXME
  // ...
});

$(document).on('mousedown touchstart', '#wrapper.in', function(event) {
  $(this).removeClass('in');
});


$('.typeahead.geonames').typeahead([{
  name: 'geonames',
  valueKey: 'name',
  template: function(context) {
    return '<div>' + context.name + '</div>';
  },
  remote: {
    url: 'http://api.geonames.org/searchJSON?username=fredj&q=%QUERY',
    filter: function(response) {
      return response.geonames;
    }
  }
}]).on('typeahead:selected', function() {

});

