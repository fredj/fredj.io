var projection = ol.proj.configureProj4jsProjection({
  code: 'EPSG:21781',
  extent: [485869.5728, 76443.1884, 837076.5648, 299941.7864]
});

var map = new ol.Map({
  layers: [
    new ol.layer.Image({
      source: new ol.source.ImageWMS({
        url: 'http://webgis.uster.ch/wms/av/grundplan_av',
        attributions: [
          new ol.Attribution({
            html: '<a href="http://webgis.uster.ch/">http://webgis.uster.ch/</a>'
          })
        ],
        params: {
          'LAYERS': 'Rohrleitungen,Grenzen,Fixpunkte,Bodenbedeckung,Gebäude,' +
                    'Einzelobjekte,Nomenklatur,Bodenbed. V25,Gebäude V25,' +
                    'Gewässer V25,Strasse V25,Bahn V25,Label Pkte V25,' +
                    'GWS Linien,Nutzungszonen Linien,Abstandslinien',
          'FORMAT': 'image/png; mode=8bit'
        },
        // otherwise the image is too big and iOS failed to display it (3MB limitation)
        ratio: 1,
        // adds the 'DPI' param
        serverType: 'qgis'
      })
    })
  ],
  renderer: ol.RendererHint.CANVAS,
  target: 'map',
  view: new ol.View2D({
    projection: projection,
    center: [696050, 245250],
    zoom: 7
  })
});
