if (!confirm("Warning: \nYou're runing Qomo on a browser that "+
  "we dosen't seem to support. \nYou may experience problems, but "+
  "are welcome to report the problems your experienced with your browser.")) {
  $import = function() {};
  $debug('Qomo halted.');
}