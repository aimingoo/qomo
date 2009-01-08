
alert('hi, chrome!');

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

// enable priviledge and try callback, valid in this context only.
//  - if invalid, throw a exception.
applyPriviledge = function(priviledge, callback) {
  try {
    netscape.security.PrivilegeManager.enablePrivilege(priviledge);
  }
  catch (ex) { /* eat it */ }

  callback();
}

// Ajax Object, for cross domain access
void function() {

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

/* for a bug leading crash when we use "var" declaration in global scope of window.eval() which is corrected
 * in 1.8.0.1 and above, also the bug described in https://bugzilla.mozilla.org/show_bug.cgi?id=352944
 */
void function() {
  var $import_setter = $import.set;
  $import.setActiveUrl = function(url) {
    $import_setter('curScript', url);
  }

  window.execScript = function(script, type) {
    var psdscr = script, bracelv = 0,
    r_skips = [/(\/\*)\/?(([^\*]\/)|[^\/])*(\*\/)/g, /(\s|^)+\/\/([^\n\r])*/g, /("(\\"|[^"\n\r]|(\\\r\n))*")/g, /('(\\'|[^'\n\r]|(\\\r\n))*')/g], 
    // will match /**/, //, "", '', RegExp - in order of frequency & length, so the length of psdscr will be reduced soon, resulting fast execution
    r_regexp = /(\/(\\\/|[^\/\n\r]|(\\\r\n))*\/)/, r_div = /[\w\$\)]/,  // special dealing with RegExp and/or Div-exp
    arscr = new Array(), para = new Array(), tmp = [];
    for (var i=0; i<r_skips.length; i++)
      if (tmp = psdscr.match(r_skips[i]))
        for (var j=0, l=para.length, para=para.concat(tmp); j<tmp.length; j++)
          psdscr = psdscr.replace(tmp[j], "#Replaced_by_Qomo.Parser_as_No."+(l+j)+"#"); // store

    while (tmp = psdscr.match(r_regexp)) {
      var pos = tmp.index, isOp;
      while (pos-- && /\s/.test(psdscr.charAt(pos)));

      if (pos == -1) {// out by zero, searched to head
        isOp = true;
      }
      else {
        switch (psdscr.charAt(pos)) {
          // operators of 'void', 'new', 'instanceof', 'in', 'typeof', 'delete'
          case 'n': if (pos>3) { op = psdscr.substr(pos-3, 3); isOp = (/\bin/).test(op); } break;
          case 'w': if (pos>4) { op = psdscr.substr(pos-4, 4); isOp = (/\bnew/).test(op); } break;
          case 'd': if (pos>5) { op = psdscr.substr(pos-5, 5); isOp = (/\bvoid/).test(op); } break;
          case 'e': if (pos>7) { op = psdscr.substr(pos-7, 7); isOp = (/\bdelete/).test(op); } break;
          case 'f': if (pos>7) { op = psdscr.substr(pos-7, 7); isOp = (/\btypeof/).test(op); } 
            if (!isOp) {
              op = psdscr.substr(pos-11, 11);
              isOp = (/\binstanceof/).test(op);
            }
            break;
          default:
            // div express from [number, char, $] or a_function(). otherwise is
            // '(' or operators before regexp
            isOp = !/[\w\$\)]/.test(psdscr.charAt(pos));
        }
      }
      if (isOp) { // what ahead is operator or beginning of the code block, so regexp is
        psdscr = psdscr.replace(tmp[0], "#Replaced_by_Qomo.Parser_as_No."+para.length+"#"); // store
        para = para.concat(tmp[0]);
      }
    }

    arscr = psdscr.split("function");
    psdscr = ""; // clear out, psdscr will use as output
    for (var i=0, p=0; i<arscr.length; i++) {
      if (!bracelv && /^\s(\S+)\s*\(/.exec(arscr[i]) && i) { // only applied to brace level 0 (global)
        var func_name = RegExp.$1;
        arscr[i] = arscr[i].substring(func_name.length + 1);
        psdscr += func_name.concat(" = function");
      } else if (i) psdscr += "function"; // the first block should never be patched
      psdscr += arscr[i];
      while (p = arscr[i].indexOf('{', p) + 1) bracelv++;
      while (p = arscr[i].indexOf('}', p) + 1) bracelv--;
    }
    arscr = psdscr.split("var ");
    psdscr = ""; // clear out, psdscr will use as output
    bracelv = 0;
    for (var i=0, p=0; i<arscr.length; i++) {
      if (bracelv) // do not applied to brace level other than 0 (global)
        psdscr += "var ";
      psdscr += arscr[i];
      while (p = arscr[i].indexOf('{', p) + 1) bracelv++;
      while (p = arscr[i].indexOf('}', p) + 1) bracelv--;
    }

    for (var i=para.length-1; i>=0; i--) {
    psdscr = psdscr.replace("#Replaced_by_Qomo.Parser_as_No."+i+"#", para[i]); // restore
    }

    window.eval(psdscr, type);
  }
}();