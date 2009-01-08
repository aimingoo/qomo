/*****************************************************************************
Qomo Project v1.0 - compatible layer
  [Zhe(fangzhe@msn.com), Aimingoo(aim@263.net)]
  [2006.02.24]

 routeline:
 - first detect browser family by navigator.userAgent
 - for IE, using the Conditional Compile feature for script engine version detection,
   see http://msdn2.microsoft.com/en-us/library/121hztk3.aspx
 - for Gecko, detect render engine version directly since script engine is embeded.
 - for WebKit, same as Gecko since JavaScriptCore is undetectable.
 - load a JavaScript compatible layer for specified browser/script engine, let
   them behave as if they are the same, at least to other Qomo components.
 - (TODO:) load a W3C DOM/CSS compatible layer for specified browser/render engine.

 btw, by embeding the file into where it has been called by $import() and removing
      codes setting attributes, the compatible framework should work independently.

 documents about browser detect
   - http://www.mozilla.org/docs/web-developer/sniffer/browser_type.html
   - http://www.mozilla.org/build/revised-user-agent-strings.html
 object sniphing, another way
   - http://www.webreference.com/programming/javascript/sniffing/
   - http://www.andrewdupont.net/2007/04/04/browser-sniffing/
 "IE7", a standards-compliant script library for IE
   - http://dean.edwards.name/IE7/
 *****************************************************************************/

void function() {
  function ver_compare(v1, v2) {
    var r_rev = /\D*\.0*/;
    var a1 = v1.split(r_rev), a2 = v2.split(r_rev);
    var len = Math.min(a1.length, a2.length);
    for (var i = 0; i < len; i ++) {
      if (a1[i] != a2[i]) return (a1[i] - a2[i] > 0 ? 1 : -1)
    }

    if (a1.length == a2.length) return 0;
    return (a2.length == len ? 1 : -1)
  }

  /**
   * Note: it is necessary to detect Opera first because there's "MSIE" in its UA string
   * as the same, WebKit has "Gecko" in its UA string ...
   *
   */
  $import.set('browser', function() {
    var agt = navigator.userAgent,
    is_opera = (agt.indexOf("Opera") != -1), // !!window.opera,
    is_msie = (agt.indexOf("MSIE") != -1) && !is_opera,
    is_webkit = (agt.indexOf("AppleWebKit") != -1),
    is_chrome = is_webkit && (agt.indexOf("Chrome") != -1),
    is_gecko = (agt.indexOf("Gecko") != -1) && !is_webkit,
    r_gecko = /rv:([\d|\+.]+)/, // match the ... rv: version in Gecko family browsers
    checker = [
      'msie',   is_msie,
      'moznew', is_gecko && r_gecko.exec(agt) && ver_compare(RegExp.$1, '1.7') >= 0,
      'mozold', is_gecko && !this.moznew,
      'opera',  is_opera,
      'chrome', is_chrome,
      'safari', is_webkit
    ];

    for (var i=0; i<checker.length; i++) {
      if (checker[++i]) return checker[i-1];
    }

    // if nothing matched
    return 'other';
  }());

  $import('common_' + $import.get('browser') + '.js');
}();