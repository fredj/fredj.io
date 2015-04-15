var map = new ol.Map({
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    }),
    new ol.layer.Vector({
      source: new ol.source.Vector({
        url: 'data/geojson/countries.geojson',
        format: new ol.format.GeoJSON()
      })
    })
  ],
  target: 'map',
  view: new ol.View({
    center: [0, 0],
    zoom: 2
  })
});

var pdfImageConfig = {
  image: undefined
};
var pdfConfig = {
  pageMargins: 20,
  pageSize: 'A4',
  pageOrientation: 'landscape',
  content: [{
    text: 'Client side PDF export.',
    style: 'title'
  }, pdfImageConfig, {
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
  toDataURL(map, [800, 480], function(data) {
    pdfImageConfig.image = data;
    pdfMake.createPdf(pdfConfig).download('ol-map.pdf');
  });
});

// FIXME: filter layers
// FIXME: custom view
// FIXME: custom format
function toDataURL(map, size, callback) {
  var offlineMap = new ol.Map({
    controls: [],
    interactions: [],
    pixelRatio: 1,
    target: document.createElement('div')
  });
  offlineMap.setSize(size);
  offlineMap.setLayerGroup(map.getLayerGroup());
  offlineMap.setView(map.getView());

  offlineMap.once('postcompose', function(event) {
    callback(event.context.canvas.toDataURL('image/png'));
  });
  offlineMap.renderSync();
}
