var dropzone = document.querySelector('#instructions');
var cancel = function(event) {
  event.preventDefault();
};
dropzone.addEventListener('dragover', cancel, false);
dropzone.addEventListener('dragenter', cancel, false);

dropzone.addEventListener('drop', function(event) {
  var reader = new FileReader();

  event.preventDefault();
  var files = event.dataTransfer.files;
  console.assert(files.length === 1);
  reader.onload = function() {
    plot(reader.result);

    document.querySelector('body').classList.add('has-data');
  };
  reader.readAsText(files[0]);
}, false);
