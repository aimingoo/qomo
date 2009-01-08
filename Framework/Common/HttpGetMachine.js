/*****************************************************************************
*
* Qomo Common Class - THttpGetMachine
*
*  A standard machine defined in Pool.js
*
* value of  xmlHttp.readyState :
*   0 The object has been created but has not been initialized because open method has not been called. 
*   1 The object has been created but the send method has not been called. 
*   2 The send method has been called and the status and headers are available, but the response is not yet available. 
*   3 Some data has been received. You can call responseBody and responseText to get the current partial results. 
*   4 All the data has been received, and the complete data is available in responseBody and responseText. 
*****************************************************************************/

$import('SysUtils.js');
$import('Pool.js');

function HttpGetMachine () {
  Attribute(this,'XMLHTTPOBJECT', null,'rw');
  Attribute(this, 'XMLHTTP', null, 'rw');
  Attribute(this, 'METHOD', 'GET', 'r');

  this.OnStateChange = TMachineStateChange;
  this.OnSetRequestHeader = NullFunction;

  var doStateChange = function(state) {
    if (state=='resume') {
      var xmlHttp = this.get('XMLHTTP');
      var method = this.get('METHOD');
      var data = null, src = this.data.src;

      if (method=='GET') {
        xmlHttp.open(method, src, true);
      }
      else {
        data = src.substr(src.indexOf('?')+1);
        src = src.substr(0, src.length-data.length-1);
        data = unescape(data);
        xmlHttp.open(method, src, true);
        xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        xmlHttp.setRequestHeader('Content-Length', data.length);

      }
      this.OnSetRequestHeader();
      xmlHttp.send(data);
    }
    else if (state=='free') {
      this.set('XMLHTTP', null);
    }
  }

  var onreadystatechange = function() {
    var xmlHttp = this.get('XMLHTTP');

    this.OnStateChange(xmlHttp.readyState);

    if (xmlHttp.readyState==4) {
      // rewrite onreadystatechange() in ff
      xmlHttp.onreadystatechange = _changer(this);
      this.OnStateChange('sleep')
    }
  }

  var _changer = function(mac) {
    return function() {
      onreadystatechange.apply(mac, arguments);
    }
  }

  this.Create = function() {
    this.data = null;
    this.pool = null;
    this.OnStateChange.add(doStateChange);
    var cls = this.get('XMLHTTPOBJECT');
    var ajx = !cls ? new Ajax() : (typeof cls=='function' ? new cls() : new ActiveXObject(cls))
    this.set('XMLHTTP', ajx);
    this.get('XMLHTTP').onreadystatechange = _changer(this);
  }
}

THttpGetMachine = Class(TObject, 'HttpGetMachine');