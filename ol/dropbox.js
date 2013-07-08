var parsers;
$(document).ready(function() {

  var vector = new ol.layer.Vector({
    source: new ol.source.Vector({
      projection: ol.proj.get('EPSG:4326')
    })
  });

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
      }),
      vector
    ],
    view: new ol.View2D({
      center: [0, 0],
      zoom: 2
    })
  });

  var projection = map.getView().getProjection();
  parsers = {
    'json': new ol.parser.GeoJSON(),
    'gpx': new ol.parser.GPX(),
    'kml': new ol.parser.KML()
  };

  $('#db-chooser').on('DbxChooserSuccess', function(event) {
    var files = event.originalEvent.files;
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      $("<div>loading " + file.name +"</div>").appendTo($('#db-chooser-info'));
      // $('#db-chooser-info').append('loading ' + file.name);

      $.get(file.link, function(data) {
        var parser = parsers[this.url.split('.').pop()];
        vector.parseFeatures(data, parser, projection);
      });
    }
  });

  $('#vector-drop').bind('dragenter', function(event) {
    event.stopPropagation();
    event.preventDefault();
    $(event.target).addClass('active');
  });
  $('#vector-drop').bind('dragleave', function(event) {
    event.stopPropagation();
    event.preventDefault();
    $(event.target).removeClass('active');
  });
  $('.dropzone').bind('drop', function(event) {
    event.stopPropagation();
    event.preventDefault();
    var files = event.originalEvent.dataTransfer.files;
    console.log(files);
  });

});
