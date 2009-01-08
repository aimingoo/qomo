$debug = function() {
  arguments.join = Array.prototype.join;
  document.writeln(arguments.join(''));
};
