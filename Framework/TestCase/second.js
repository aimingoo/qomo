function status2() {
  var i, scripts=document.getElementsByTagName('script');
  for (i=0; i<scripts.length; i++)
    document.writeln(scripts[i].src, '->', scripts[i].readyState, '<br>');
  document.writeln('----------<br>');
}

status2();

document.writeln('<br>reportState()<br>');
document.writeln('----------<br>')
reportState();