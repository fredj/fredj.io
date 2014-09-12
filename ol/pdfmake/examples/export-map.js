var map = new ol.Map({
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    }),
    new ol.layer.Vector({
      source: new ol.source.GeoJSON({
        projection: 'EPSG:3857',
        url: 'data/geojson/countries.geojson'
      })
    })
  ],
  target: 'map',
  view: new ol.View({
    center: [0, 0],
    zoom: 2
  })
});

// a4: [595.28, 841.89]

var pdfImageWidth = 800;
var pdfImageHeight = 480;

var pdfConfig = {
  pageMargins: 20,
  pageSize: 'A4',
  pageOrientation: 'landscape',
  content: [{
    text: 'Client side PDF export.',
    style: 'title'
  }, {
    width: pdfImageWidth,
    height: pdfImageHeight,
    image: undefined
  }, {
    text: 'Powered by OpenLayers 3 and pdfmake'
  }],
  footer: function(current, total) {
    return {
      text: new Date().toString(),
      style: 'footer'
    };
  },
  styles: {
    title: {
      fontSize: 18,
      bold: true
    },
    footer: {
      fontSize: 8,
      alignment: 'right',
      margin: [20, 0]
    }
  }
};


$('#export').click(function() {
  var config = $('#print-config');
  var dpi = parseInt(config.find('[name="dpi"]').val());

  var imgWidth = pdfImageWidth * (dpi / 100);
  var imgHeight = pdfImageHeight * (dpi / 100);

  toDataURL(map, [imgWidth, imgHeight], function(data) {
    var filename = config.find('[name="filename"]').val();
    pdfConfig.content[1].image = data;
    pdfMake.createPdf(pdfConfig).download(filename);
  });
});

function toDataURL(map, size, callback) {
  var offlineMap = new ol.Map({
    controls: [],
    interactions: [],
    pixelRatio: 1,
    target: document.createElement('div')
  });
  offlineMap.setSize(size);
  offlineMap.bindTo('layergroup', map);
  offlineMap.bindTo('view', map);

  // var extent = map.getView().calculateExtent(map.getSize());
  // offlineMap.getView().fitExtent(extent, offlineMap.getSize());
  // FIXME: sync

  new ol.Graticule({
    map: offlineMap,
    // the style to use for the lines, optional.
    strokeStyle: new ol.style.Stroke({
      width: 1,
      lineDash: [0.5, 4]
    })
  });

  var listenerId = offlineMap.on('postcompose', function(event) {
    var tileQueue = event.frameState.tileQueue;
    if (tileQueue.isEmpty() && tileQueue.getTilesLoading() == 0) {
      callback(event.context.canvas.toDataURL('image/jpeg'));
      ol.Observable.unByKey(listenerId);
    }
  });
  offlineMap.renderSync();
}
