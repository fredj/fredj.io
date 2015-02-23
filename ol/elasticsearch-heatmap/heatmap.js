// ?field=geoip.location&proj=EPSG:4326&map=2/0/0
// ?field=wmts.input_xy&proj=EPSG:21781&map=8/915653/5918996

var params = {};
window.location.search.substr(1).split('&').forEach(function(pair) {
    var keyvalue = pair.split('=');
    params[keyvalue[0]] = keyvalue[1];
});

var delay = moment.duration(parseInt(params.delay) || 10, 'seconds');
var field = params.field || 'wmts.input_xy';
var source_projection = params.proj || 'EPSG:21781';
var zxy = params.map ? params.map.split('/').map(parseFloat) : [2, 0, 0];
var offset = moment.duration(5, 'minutes');


var heatmapSource = new ol.source.Vector();

var map = new ol.Map({
  layers: [
    new ol.layer.Tile({
      source: new ol.source.TileJSON({
        url: '//api.tiles.mapbox.com/v3/camptocamp.map-qrf4xb23.jsonp?secure'
      })
    }),
    new ol.layer.Heatmap({
      source: heatmapSource
    })
  ],
  renderer: 'canvas',
  target: 'map',
  view: new ol.View({
    center: zxy.slice(1),
    zoom: zxy[0]
  })
});

var transform = ol.proj.getTransform(source_projection, map.getView().getProjection());

var requestRange = {
  from: undefined,
  to: moment().subtract(offset)
};

var displayOffset = undefined;

var refresh = function() {
  requestRange.from = requestRange.to.clone();
  requestRange.to = requestRange.from.clone().add(delay);

  var body = {
    size: 5000,  // FIXME
    fields: ['@timestamp', field],
    query: {
      filtered: {
        filter: {
          and: [{
            range: {
              '@timestamp': {
                from: +requestRange.from,
                to: +requestRange.to
              }
            }
          }, {
            exists: {
              field: field
            }
          }]
        }
      }
    }
  };
  var url = '/elasticsearch/logstash-' + moment().format('YYYY.MM.DD') + '/_search';

  $.ajax({
    type: 'POST',
    url: url,
    data: JSON.stringify(body),
    contentType: 'application/json',
    dataType: 'json'
  }).done(function(data) {
    console.time('fetch');
    displayOffset = displayOffset || moment();
    var features = [];
    var hits = data.hits.hits;
    for (var i = 0, ii = hits.length; i < ii; i++) {
      var hit = hits[i];
      var location = hit.fields[field];
      var feature = new ol.Feature();
      feature.setId(hit._id);
      var coordinates = transform($.isArray(location) ? location : location.split(','));
      feature.setGeometry(new ol.geom.Point(coordinates));

      var when = moment(hit.fields['@timestamp'][0]);
      feature.set('display_at', displayOffset.clone().add(when.subtract(requestRange.from)));
      feature.set('weight', 0);

      features.push(feature);
    }
    displayOffset.add(delay);
    heatmapSource.addFeatures(features);
    console.timeEnd('fetch');
  });
}
refresh();
window.setInterval(refresh, delay.asMilliseconds());

var fadeOut = function() {
  window.requestAnimationFrame(fadeOut);
  var now = moment();
  var features = heatmapSource.getFeatures();
  for (var i = 0, ii = features.length; i < ii; i++) {
    var feature = features[i];
    var ago = now - feature.get('display_at');
    if (ago > 0) {
      var weight = 1 - ol.easing.easeOut(ago / 7500);
      if (weight > 0) {
        feature.set('weight', weight);
      } else {
        heatmapSource.removeFeature(feature);
      }
    }
  }
};
window.requestAnimationFrame(fadeOut);
