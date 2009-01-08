/**
 * Debug Util: Qomo's Debugger for IE
 */

$debugInConsole = false;
$debugInPureWindow = false;
self["__WEUI_Debugger_"] = null;

function $debug() {
  var args=arguments, argn=args.length;
  var i=0, v=new Array(argn);
  for (;i<argn;i++) v[i]='args['+i+']';
  eval('__WEUI_Debugger_('+v.join(',')+')');
}

function getDialogStr_DBG(title, dbg) {
  var str = '<html><head><title>' + title + '</title>' +
  '<link rel="stylesheet" href="Qomo.Debugger.css"></head>' +
  '<body><textarea id=outputConsole wrap=off style="font-size:12px;width:100%;heig'+
  'ht:100%;border:0"></textarea></body><script>win=dialogArguments[0];consoleTag=w'+
  'in["$debugInConsole"];pureWriterTag=win["$debugInPureWindow"];self.document.bod'+
  'y.scroll="no";function fakeWriteln() {var ctx=document.createElement("DIV");ctx'+
  '.innerHTML=Array.prototype.join.call(arguments, "");ctx.style.textAlign="left";'+
  'outputConsole.appendChild(ctx);' +
  'ctx.scrollIntoView();}function fakeConsoleWriteln() {var s=Array.prototype.'    +
  'join.call(arguments, "");s=s.replace(/<hr>/gi, "\\n--------------------------\\'+
  'n");s=s.replace(/<br>/gi, "\\n");s=s.replace(/<[^>]*>/g, "");fakeWriteln(s);}if'+
  ' (pureWriterTag){window.document.clear();win.DEBUGGER=document.writeln;} else {'+
  'win.DEBUGGER=(!consoleTag ? fakeWriteln : fakeConsoleWriteln)};</script>';

  return str.replace(/win\.DEBUGGER/g, 'win.'+dbg);
}

function showDialog_DBG(dialogWin, DBG) {
  var cache = [];
  var box = {
    output: function(){
      cache.push(Array.prototype.slice.call(arguments, 0).join(''));
      if (window[DBG] && dialogWin.document.readyState == 'complete') {
        for (var i=0; i<cache.length; i++) window[DBG](cache[i]);
        box.output = window[DBG];
      }
      else {
        setTimeout(box.output, 10);
      }
    },
    output_line: function() {
      this.output('<hr style="width:30%; height:1px; color:gray;">')
    },
    close: dialogWin.close
  };

  return box;
}

function showDebuggerBox(sURL, title, sFeatures) {
  // you can call createUniqueVar(), and get a Unique VarName.
  var DBG = '__WEUI_Debugger_';

  var dlg = getDialogStr_DBG(title, DBG);
  var win = showModelessDialog(sURL, [self, dlg], sFeatures);
  return showDialog_DBG(win, DBG);
}

function QomoDbgInit() {
  var AUrl = $import.get('activeJS')();
  var debuggerUrl = AUrl.replace(/[^\/\\]*$/, 'Debug/blank_dlg.html');
  var dlg = showDebuggerBox(debuggerUrl, '调试信息...', 'dialogLeft:400px; dialogTop:468px; dialogWidth:600px; dialogHeight:300px;');

  this.onunload = function () {
    dlg.close()
  };

  return {
    hide: function() {  },
    show: function(x,y,w,h) {  },
    close: function() { self.onunload=null; dlg.close() }
  };
}

var QomoDbg = QomoDbgInit();