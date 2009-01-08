/*****************************************************************************
Qomolangma OpenProject v1.0 - protocol layer
  [Aimingoo(aim@263.net)]
  [2006.02.24]

 - common protocol analyze and description
*****************************************************************************/

/**
 * Url Object
 * protocol types : [HKEY_CLASSES_ROOT\PROTOCOLS\Handler]
 */
Url = function() {
  // type://<name>:<pass>@<host>:<port>/<path>?<param>
  var _r_url = /^(\w+)(:\/*)([^\/]*)(\/[A-Za-z]:\/)?/;
  var _r_query = /\..+\/(.+)$/;

  function _parse(url) {
    var m, i, j, s, tmp, o=this;
    o.URL = url;
    o.type = '';
    if (!(m = _r_url.exec(url))) return o;

    // protocol char count, alias $0
    i = m[0].length;
    o.type = m[1];
    o.host = m[3];
    o.port = '';

    // port and auth analyzer. some protocol without port setting, and default 80.
    if (m[2] == '://') {
      o.port = '80';

      s = o.host;
      if ((j=s.indexOf('@')) != -1) {
        o.host = s.substr(j+1);
        s = o.name = s.substr(0,j)
        if ((j=s.indexOf(':')) != -1) {
          o.name = s.substr(0,j);
          o.pass = s.substr(j+1);
        }
      }

      s = o.host;
      if ((j=s.lastIndexOf(':')) != -1) {
        o.host = s.substr(0,j);
        o.port = s.substr(j+1);
      }

      // for opera localhost protocol.
      if (m[4]) {
        i--;
        o.host += m[4].substr(0, m[4].length-1);
      }
    }

    if (i == url.length) return o;

    o.path = url.substr(i+1);// ScriptName = '/' + o.path
    o.param = o.query = '';  // QueryString, PathInfo
    o.params = {};           // QueryFields
    s = o.path;
    if ((j=s.indexOf('?')) != -1) {
      o.path = s.substr(0,j);
      o.param = s.substr(j+1);

      // query param analyzer. some field value is NullString.
      var p, n, v, arr = o.param.split('&');
      for (i=0; i<arr.length; i++) {
        p = arr[i].indexOf('=');
        n = (p != -1)?arr[i].substr(0,p) : arr[i];
        v = (p != -1)?arr[i].substr(p+1) : '';
        o.params[n] = v;
      }

      // get query path
      s = o.path;
      if (s.search(_r_query) != -1) {
        o.query = m[1];
        o.path = s.substr(0, s.length-o.query.length-1);
      }
    }
    return o;
  }

  function _url(url) {
    if (url) this.parse(url);
  }
  _url.parse = _parse;
  _url.prototype.parse = _parse;

  _parse.toString = $QomoCoreFunction('Url.parse');
  _url.toString = $QomoCoreFunction('Url');
  return _url;
}();