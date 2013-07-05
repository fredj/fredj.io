$(document).ready(function() {

  var map = new ol.Map({
    target: 'map',
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

  var projection = map.getView().getProjection();
  var geojson = new ol.parser.GeoJSON();

  $('#db-chooser').on('DbxChooserSuccess', function(event) {
    var files = event.originalEvent.files;
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      // console.log(file);
      $.get(file.link, function(data) {
	vector.parseFeatures(data, geojson, projection);
      });
    }
  });

});
