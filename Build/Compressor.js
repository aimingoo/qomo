/*****************************************************************************
Qomolangma OpenProject v2.0
  [Aimingoo(aim@263.net)]
  [2007.07.20]

 - Compress module for qomo's builder.
*****************************************************************************/

$import('ProtectCodeContext.js');
$import('jsmin.js');
//$import('jsmin/fulljsmin.js');
$inline('Compressor(1).js');

function Compressor() {
  this.method = 2;
  this.level = 2;

  // compress method 1: code from DotNET JSCompress
  var compress_1 = function(ctx) {
    eval($inline('Compressor(1).js'));

    if (arguments.length==3){
      var callback = arguments[2];
      callback(ctx);
    }
    else {
      return ctx;
    }
  }

  // compress method 2: jsmin for javascript
  var compress_2 = function(ctx, lv, callback) {
    ctx = jsmin(ctx, lv, callback);
    return ctx;
  }

  // compress method 3: clear comment and align only.
  var compress_3 = function(ctx) {
    if (arguments.length==3){
      var callback = arguments[2];
      callback(ctx);
    }
    else {
      return ctx;
    }
  }

  this.compress = function(ctx, callback) {
    var method = eval('compress_' + this.method);
    if (!method) throw new Error('unknown compress method: ' + this.method);

    var pt = new ProtectCodeContext();
    var pts = pt.getProtectPoints(ctx);
    if (this.method==3) {
      pt.unprotect = function() {
        var p = pt.unprotect;
        return function() {
          var ctx = p.apply(this, arguments);
          ctx = ctx.replace(/^\s+$/mg, '');
          return ctx;
        }
      }();
    }

    var user_cb = null;
    var _callback = function(ctx) {
      ctx = pt.unprotect(ctx);
      user_cb(ctx);
    }

    var p_ctx = pt.protect(ctx, pts);
    if (user_cb = callback) {
      method.call(this, p_ctx, this.level, _callback);
    }
    else {
      p_ctx = method.call(this, p_ctx, this.level);
      return pt.unprotect(p_ctx);
    }
  }
}