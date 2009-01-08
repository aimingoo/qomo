/**
 *  re-description of $import()
 *
 *  - support gb2312(and other) locale charset
 */
void function() {
  window.execScript(''+
    'Function Asc2Unicode(n) \n'+
    ' Asc2Unicode = Chr(n) \n'+
    'End Function \n'+

    'Function SafeArray2Str(body) \n'+
    ' If UBound(body) Mod 2 = 0 Then SafeArray2Str = CStr(body)\n'+
    ' SafeArray2Str = CStr(body)+ChrB(13)\n'+
    'End Function', 'VBScript'
  );

  function toUnicode($0, $1, $2) {
    return Asc2Unicode(parseInt($1+$2, 16))
  }
  // check encode setting of docuement, and choosing how to load decode function.
  var _CHARSET = document[(document.charset == '_autodetect_all' ? 'defaultCharset' : 'charset')];
  var $getter = $import.get;
  var toCurrentCharset = function() {
    switch (_CHARSET) {
      case 'gb2312':
@if (@_jscript_version < 5.5)
        // browser is ie5.0
        return new Function('body', 'return ie5_parser(vbs_JoinBytes(body))');
@end
        var r1 = /%u(..)(..)/g, r2 = /%([8,9,A-F].)%(..)/g;
        return function(body) {
          return unescape(escape(SafeArray2Str(body)).replace(r1, "%$2%$1").replace(r2, toUnicode));
        };
      default:
        return function (body) { return body };
    }
  }();

  // default is UTF-8, can decode UCS-2 (big or little endian) or UCS-4 (server
  // sends the appropriate Unicode byte-order mark)
  // see also: http://www.w3.org/International/tutorials/tutorial-char-enc/
  var _uu = {
   'utf-8': true,
   'unicode': true,
   'utf-16': true,
   'UnicodeFFFE': true,
   'utf-32': true,
   'utf-32BE': true
  }[_CHARSET];

  $import.set('bodyDecode', function(conn) {
    return (_uu ? conn.responseText : toCurrentCharset(conn.responseBody));
  })
}();