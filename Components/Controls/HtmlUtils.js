/*****************************************************************************
Qomolangma OpenProject v2.0
  [Aimingoo(aim@263.net)]
  [2008.10.13]

 - Some html utils for Qomo Component Layer
*****************************************************************************/

// mute event handle, no continue with bubble
function cancelEvent() {
  return (!(window.event.cancelBubble=true))
}

// mute event handle, continue bubble
function cancelEvent2() {
  return (window.event.cancelBubble=true)
}

// html-elements collection to array
function coll2array(coll) {
  return coll && ('tagName' in coll ? [coll] : (function() {
    for (var i=0, len=coll.length, arr=new Array(len); i<len; i++) arr[i]=coll[i];
    return arr
  })());
}

// append element to document, and return the element
function appendElement(el) {
  with (window.document) switch (readyState) {
    case 'uninitialized' : $assert(flase, 'hi, can\'t do anythings at document uninitialized'); return;
    case 'interactive':
    case 'loading' : return writeln(el.outerHTML), getElementById(el.id);
    default : return body.appendChild(el), el;
  }
}

// warp <warp> to el, insert el with warp to context
function warpUpChild(el, warp) {
  var to, node, isSib=false, owner=el.parentElement;
  if (node=el.nextSibling) 
    isSib = true;
  else
    node = owner;

  owner.removeChild(el);
  warp.appendChild(el);
  if (isSib)
    node.insertAdjacentElement('beforeBegin', warp);
  else
    owner.appendChild(warp);
}

noClosingTag = function() {
  var tags = 'img,br,base,object,input,bgsound,col,embed,hr,link,meta,isindex,'+ 
             'nextid,basefont,plaintext,colgroup,keygen,spacer,wbr';
  tags = eval('({' + tags.replace(/,/g, ':1,') + ':1})');
  return function(tag) {
    return tags.hasOwnProperty(tag.toLowerCase());
  };
}();