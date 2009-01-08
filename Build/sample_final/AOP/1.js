// var _http1 = new window.XMLHttpRequest();
var src1 = '2.js';

_http.open("GET", src1, false);
_http.send(null);
str1 = _http.responseText;

window.eval(str1, 'JavaScript');