var ctx = $('<canvas>').get(0).getContext('2d');

var map = new ol.Map({
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM({
        tileLoadFunction: function(imageTile, src) {
          var img = $(imageTile.getImage());
          img.one('load', function() {
            ctx.canvas.width = this.width;
            ctx.canvas.height = this.height;
            ctx.drawImage(this, 0, 0);

            var size = 8, half_size = size / 2;
            var imgd = ctx.getImageData(0, 0, this.width, this.height);
            for (var x = 0; x < this.width; x += size) {
              for (var y = 0; y < this.height; y += size) {
                var idx = ((y * this.width) + x) * 4;
                ctx.fillStyle = '#' + imgd.data[idx + 0].toString(16) + imgd.data[idx + 1].toString(16) + imgd.data[idx + 2].toString(16);
                ctx.clearRect(x, y, size, size);
                ctx.beginPath();
                ctx.arc(x + half_size, y + half_size, half_size - 1, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.fill();
              }
            }
            this.removeAttribute('crossorigin');
            this.src = ctx.canvas.toDataURL();
          });
          img.attr('src', src);
        }
      })
    })
  ],
  renderer: ol.RendererHint.CANVAS,
  target: 'map',
  view: new ol.View2D({
    center: [-133839, 6971740],
    zoom: 17
  })
});
