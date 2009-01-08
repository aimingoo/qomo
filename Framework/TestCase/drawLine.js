/**
 * fast and simple draw dot and line, for IE only.
 */

function mkDiv(x, y, w, h, c) {
  return (['<div style="position:absolute;left:', x,
   'px; top:', y,
   'px; width:', w,
   'px; height:', h,
   'px; clip:rect(0,', w, 'px,', h, 'px, 0);',
   'background-color:', (c || '#000'),
   ';overflow:hidden;"><\/div>']).join('');
}

function mkLin(x1, y1, x2, y2, c) {
  var r = Math.floor(Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1)));
  var theta = Math.atan((x2-x1)/(y2-y1));
  if (((y2-y1)<0 && (x2-x1)>0) || ((y2-y1)<0 && (x2-x1)<0)) theta += Math.PI;
  for(var arr=[],i=0, dx = Math.sin(theta), dy = Math.cos(theta); i<r; i++)
    arr.push(mkDiv(x1+i*dx, y1+i*dy, 1, 1, c));  // draw dot
  return arr.join('');
}

function drawLine(x0, y0, x1, y1, color) {
  document.body.insertAdjacentHTML('beforeEnd', mkLin(x0, y0, x1, y1, color));
}

function drawDot(x, y, color) {
  drawLine(x, y, x, y, color);
}