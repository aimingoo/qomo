function reportState() {
  var i, scripts=document.getElementsByTagName('script');
  for (i=0; i<scripts.length; i++)
    document.writeln(scripts[i].src, '->', scripts[i].readyState, '<br>');
  document.writeln('----------<br>');
}
status1 = reportState;

status1();