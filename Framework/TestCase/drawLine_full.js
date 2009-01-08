/*
$import('file://d:/jsLib/wz_jsgraphics.js')

var jg = new jsGraphics('info');
jg.setColor('red');
function drawLine(x0, y0, x1, y1) {
  jg.drawLine(Math.round(x0), Math.round(y0), Math.round(x1), Math.round(y1));
  jg.paint();
}

// 线宽. 如果是-1, 则为dott line, 但此时线宽只能是1.
setStroke = -1, 1 .. n;
*/

/* some graphi library
http://www.davidbetz.net/graphics/,
  dynapi/graphics/,
  JS2D.js
*/

if (!document.body.insertAdjacentHTML) {
  HTMLElement.prototype.insertAdjacentHTML = function(where, htmlstr) {
    var range = this.ownerDocument.createRange();

    // goto position: call range.method() to 
    range[{
    'beforeBegin': 'setStartBefore',
    'afterBegin': 'selectNodeContents',
    'beforeEnd': 'selectNodeContents',
    'afterEnd': 'setStartAfter'
    }[where]](this);

    // create element and insert into
    var frag = range.createContextualFragment(htmlstr);
    switch (where) {
      case 'beforeBegin': this.parentNode.insertBefore(frag, this); break;
      case 'afterBegin': range.collapse(true); this.insertBefore(frag, this.firstChild); break;
      case 'beforeEnd': range.collapse(false); this.appendChild(frag); break;
      case 'afterEnd': this.parentNode.insertBefore(frag, this.nextSibling); break;
    }
  }
}

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
  var v, arr = [];
  if (x1 > x2) {  //swap
	v=x2, x2=x1, x1=v, v=y2, y2=y1, y1=v;
  }

  var dx = x2-x1, dy = Math.abs(y2-y1),
      x = x1, y = y1,
      yIncr = (y1 > y2)? -1 : 1;

  if (dx >= dy) {
    var pr = dy<<1, pru = pr - (dx<<1), p = pr-dx, ox = x;
    while ((dx--) > 0) {
      ++x;
      if (p > 0) {
        arr.push(mkDiv(ox, y, x-ox, 1, c));
        y += yIncr;
        p += pru;
        ox = x;
      }
      else p += pr;
    }
    arr.push(mkDiv(ox, y, x2-ox+1, 1, c));
  }
  else {
    var pr = dx<<1, pru = pr - (dy<<1), p = pr-dy, oy = y;
    if (y2 <= y1) {
      while ((dy--) > 0) {
        if (p > 0) {
          arr.push(mkDiv(x++, y, 1, oy-y+1, c));
          y += yIncr;
          p += pru;
          oy = y;
        }
        else {
          y += yIncr;
          p += pr;
        }
      }
      arr.push(mkDiv(x2, y2, 1, oy-y2+1, c));
    }
    else {
      while ((dy--) > 0) {
        y += yIncr;
        if (p > 0) {
          arr.push(mkDiv(x++, oy, 1, y-oy, c));
          p += pru;
          oy = y;
        }
        else p += pr;
      }
      arr.push(mkDiv(x2, oy, 1, y2-oy+1, c));
    }
  }
  return arr.join('');
}

// 在FF里，如果out_box不预取，则效率极差. :(
// var out_box = document.getElementById('out_box');
function drawLine(x0, y0, x1, y1, color) {
  document.body.insertAdjacentHTML('beforeEnd', mkLin(Math.round(x0), Math.round(y0), Math.round(x1), Math.round(y1), color));
}