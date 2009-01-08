// mozilla compatible environment

// enable priviledge and try callback, valid in this context only.
//  - if invalid, throw a exception.
applyPriviledge = function(priviledge, callback) {
  try {
    netscape.security.PrivilegeManager.enablePrivilege(priviledge);
  }
  catch (ex) { /* eat it */ }

  callback();
}

// for RegExp Object
void function() {
  var _exec = RegExp.prototype.exec;

  RegExp.prototype.exec = function (str) {
    var arr = _exec.call(this, str);
    RegExp.index = arr ? arr.index : 0;
    RegExp.lastIndex = this.lastIndex;

    return arr;
  }
  
  String.prototype.search = function (r){
    r.lastIndex = 0;
    return (r.exec(this) ? RegExp.index : -1);
  }
}();

void function() {
  var $import_setter = $import.set;
  $import.setActiveUrl = function(url) {
    $import_setter('curScript', url);
  }

  var _Ajax = Ajax;

  Ajax = function() {
    var ajx = new _Ajax();
    var open = ajx.open;

    ajx.open = function() {
      try{
        open.apply(this, arguments)
      }
      catch (e) {
        var ajx = this, args = arguments;
        applyPriviledge('UniversalBrowserRead', function() {
          open.apply(ajx, args);
        });
      }
    }

    return ajx;
  }
}();