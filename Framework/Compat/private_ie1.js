/**
 * re-description of $import()
 *
 * support of absolute path system
 */
void function() {
  // url base for current document
  var BASE = function() {
    var el = document.createElement('img');
    el.src = '.';
    return el.getAttribute('src', 1);
  }();

  // Info object for document URL BASE
  var urlInfo = new Url(BASE);
  var docUrl = '/' + urlInfo.path;

  // absolute(root) path of document
  $import.set('docBase', function() {
    return docUrl.substr(0, docUrl.lastIndexOf('/')+1);
  }());
}();