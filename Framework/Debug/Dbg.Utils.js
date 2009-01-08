/*****************************************************************************
Qomolangma OpenProject v1.0
  [Aimingoo(aim@263.net)]
  [2006.09.15]

 - debugger utils unit
*****************************************************************************/

/**
 * get all called functions from a function object's context
 */
getAllFunctions = function (ctx) {
  var r_func = /\'|\"|(\/)(.)|(\.|\$+|\b)([\$\w]+)\s*\(/g;
  var r_spc = /\s/;        // space char
  var r_div = /[\w\$\)]/;  // div expression from "\w\$\(" always!

  var pos, unquote, op, isOp, result, all=[];
  while (result = r_func.exec(ctx)) {
    pos = -1;
    isOp = false;
    switch (result[0]) {
      // is comment
      case '//': r_func.lastIndex = result.input.indexOf('\n', r_func.lastIndex)+1; break;
      case '/*': r_func.lastIndex = result.input.indexOf('*/', r_func.lastIndex)+2; break;

      // is string
      case "'" :
      case '"' :
        unquote = result[0];
        pos = r_func.lastIndex;

      default  :
        if (result[1] == '/') {
          // is RegExp or Div expression.
          pos = result.index;
          while (pos-- && r_spc.test(result.input.charAt(pos))) { }

          if (pos == -1) {  // out by zero, search to head
            isOp = true;
          }
          else {
            switch (result.input.charAt(pos)) {
              // operators of 'void', 'new', 'instanceof', 'in', 'typeof', 'delete'
              case 'n': if (pos>3) { op = result.input.substr(pos-3, 3); isOp = (/\bin/).test(op); } break;
              case 'w': if (pos>4) { op = result.input.substr(pos-4, 4); isOp = (/\bnew/).test(op); } break;
              case 'd': if (pos>5) { op = result.input.substr(pos-5, 5); isOp = (/\bvoid/).test(op); } break;
              case 'e': if (pos>7) { op = result.input.substr(pos-7, 7); isOp = (/\bdelete/).test(op); } break;
              case 'f': if (pos>7) { op = result.input.substr(pos-7, 7); isOp = (/\btypeof/).test(op); } 
                if (!isOp && (pos>11)) {
                  op = result.input.substr(pos-11, 11);
                  isOp = (/\binstanceof/).test(op);
                }
                break;
              default:
                // div express from [number, char, $] or a_function(). otherwise is
                // '(' or operators before regexp
                isOp = !r_div.test(result.input.charAt(pos));
            }
            pos = -1;
          }

          // is operators or begin of code block, so is regexp!
          if (!isOp) {
            r_func.lastIndex -= 1;
            break;
          }
          unquote = result[1];
          pos = r_func.lastIndex - 1;
        }

        // RegExp or String need pos to unquote
        if (pos > -1) {  // skip '\?'
          for (var ss=result.input, len=ss.length; pos<len; pos++) {
            switch (ss.charAt(pos)) {
              case '\\': pos++; continue;
              case unquote: r_func.lastIndex = pos+1; pos=len; break;
            }
          }
        }
        else switch (result[4]) { // find a keyword
          case 'while': case 'if': case 'switch': case 'for':
          case 'function': case 'return': case 'with': case 'catch':
          case 'new': case 'in': case 'instanceof': case 'delete': case 'void': case 'typeof':
          case 'Create':
          case 'get':
          case 'set':
          case 'inherited': break;
          default: all.push(result[3] + result[4]);
        }
    }
  }
  return all;
}


/**
 * reset debugger's output
 */
$debug = function() {
  arguments.join = Array.prototype.join;
  if (!('$cached$' in arguments.callee)) arguments.callee['$cached$'] = '';
  arguments.callee['$cached$'] += arguments.join('');
}

$debug.resetTo = function (func) {
  func($debug['$cached$']);
  func.resetTo = $debug['resetTo'];
  delete $debug['$cached$'];
  delete $debug['resetTo'];
  $debug = func;
}


/**
 * show profiler
 *  - need link style file(url: Framework/Debug/Profilers.Report.css) into your html document
 */
showProfiler = function ($prof, $print) {
  // code from JSEnhance.js
  var _r_strfmt = /%(.)/g;
  var _format = function() {
    var i=0, args=arguments, n=args.length;
    return (!n ? this : this.replace(_r_strfmt, function ($0,$1) {
      if (i==n) return $0;
      switch ($1) {
      case 's':
      case 'S': return args[i++];
      case '%': return $1;
      default : return (isNaN($1) ? $0 : args[$1]);
      }
    }));
  }
  function format(str, arr) {
    return _format.apply(str.toString(), arr);
  }
  
  // format time string.
  function timeStr(d) {
    return format('%s:%s:%s.%s', [d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()]);
  }

  // arguments reset
  var $raw = '';
  if (!$print) $print = $debug;

  // cached print
  void function(v) {
    var _print = $print;
    var _cache = [];
    $raw = {};
    $print  = function(str) {
      if (str == $raw)
        _print(_cache.join(''));
      else
        _cache.push(str);
    }
  }();

  // get data from profiler
  var data = $prof.toData();

  // header of table
  var lineFmt = format(format('<div class="%s">%1%1%1%1%1</div>', ['ln', '<span class="fd%s">%5</span>']), [1,2,3,4,5,'%s']);
  var headerFmt = lineFmt.replace(/class="(ln)"/g, 'id="prof_header" $&');
  var footerFmt = lineFmt.replace(/class="(ln)"/g, 'id="prof_footer" $&');
  $print('<div class="box">');
  $print(format(headerFmt, ['<span style="color: black">Title</span>', 'Time', 'Begin', 'End', 'Note']));

  // body of table
  var RowCount=0, Min=Number.MAX_VALUE, Max=0;
  for (var n in data) {
    if ({}[n]) continue;

    for (var i=0, len=data[n].length, err=!!(len%2); i<len; i+=2) {
      var t0=data[n][i], t1=data[n][i+1];
      if (err) t1 = data[n][len-1];

      RowCount++;
      Min = Math.min(Min, t0);
      Max = Math.max(Max, t1);
      $print(format(lineFmt, [
        n + (err ? '*' : len>2 ? '('+ (i/2+1) +')' : ''),
        (t1-t0)+'ms',
        data[n].length > 0 ? timeStr(new Date(t0)) : '', 
        data[n].length > 1 ? timeStr(new Date(t1)) : '',
        $prof(n).get('url')]));
      if (err) break;
    }
  }

  // footer of table
  var dataTag = RowCount > 0;
  RowCount = format('<span style="padding-left:60%">Total: %s</span>', [RowCount]);
  if (dataTag) {
    $print(format(footerFmt, [RowCount, (Max-Min)+'ms', timeStr(new Date(Min)), timeStr(new Date(Max)), '']));
  }
  else {
    $print(format(footerFmt, [RowCount, '0ms', '', '', '']));
  }
  $print('</div>');
  $print($raw);
}