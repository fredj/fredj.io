var size = 16;

var map = new ol.Map({
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    })
  ],
  target: 'map',
  view: new ol.View({
    center: [-133839, 6971740],
    zoom: 17
  })
});

map.on('postcompose', function(event) {
  var context = event.context;
  var width = context.canvas.width;
  var height = context.canvas.height;

  var image = context.getImageData(0, 0, width, height).data;
  for (var x = 0; x < width; x += size) {
    for (var y = 0; y < height; y += size) {
      var index = ((y * width) + x) * 4;
      context.fillStyle = '#' + image[index + 0].toString(16) + image[index + 1].toString(16) + image[index + 2].toString(16);
      context.clearRect(x, y, size, size);
      context.beginPath();
      context.arc(x + size / 2, y + size / 2, size / 2 - 1, 0, Math.PI * 2, true);
      context.closePath();
      context.fill();
    }
  }
});
