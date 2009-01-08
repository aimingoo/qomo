/*****************************************************************************
*
* Qomo Constrols -  THtmlTemplet
*
*****************************************************************************/


/**
 * Class HtmlTemplet, it's abstract class.
 */
function HtmlTemplet() {
  Attribute(this, 'TempletContext', '<%tagName% id="%id%" class="%className%"%Attributes%></%tagName%>');
  Attribute(this, 'tagName', '', 'r');
  Attribute(this, 'id', '', 'rw');

  this.getAttributes = function() {
    var v = this.get();
    return (!v ? '' : ' ' + (v instanceof Array ? v.join(' ') : v.toString()));
  }

  this.Create = function(ctrl) {
    if (ctrl && !(ctrl instanceof HtmlController)) throw new Error();
    this.inherited();
  }
}


/**
 * Class InlineTemplet
 *  - SPAN is a inline element
 */
function InlineTemplet() {
  _set('tagName', 'SPAN');
}


/**
 * Class BlockTemplet
 *  - DIV is a block element
 */
function BlockTemplet() {
  _set('tagName', 'DIV');
}


/**
 * Class BlockTemplet
 *  - for BR, INPUT and more
 */
function TagTemplet() {
  _set('TempletContext', '<%tagName% id="%id%" class="%className%"%Attributes% />');
}

/**
 * Components Templet
 *  - for all Qomo's Components.
 */
function ComponentTemplet() {
  this.getDefaultClassName = function() {
    return 'Css'+this.ClassInfo.ClassName.replace(/^.*?_/, '');
  }

  this.Create = function(id) {/* a Id or instance of THtmlController */
    if (id && (typeof id=='string' || id instanceof String)) {
      this.set('id', id);
      this.inherited('Create', new CustomArguments());
    }
    else {
    	this.inherited();
    }
  }
}

THtmlTemplet = Class(TTemplet, 'HtmlTemplet');
TInlineTemplet = Class(THtmlTemplet, 'InlineTemplet');
TBlockTemplet = Class(THtmlTemplet, 'BlockTemplet');
TTagTemplet = Class(THtmlTemplet, 'TagTemplet');
TComponentTemplet = Class(TBlockTemplet, 'ComponentTemplet');