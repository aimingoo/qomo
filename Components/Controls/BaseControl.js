/*****************************************************************************
*
* Qomo Constrols - TBaseControl
*
*****************************************************************************/

function BaseControl() {
  _set('ImmediateBind', false);

  this.assign = function (el) {  // a element or element_id
    if (arguments.length == 0) {
      el = document.createElement('DIV');
      el.id = this.id;
      el = appendElement(el);
    }
    else {
      if (typeof el == 'string') el=document.getElementById(el);
      if (!el) throw new Error(EAssignTargetNoExist);
    }

    this.name = el.name;
    this.id = el.id;
    this.inherited();
  }

  this.toString = function() {
    return el.outerHTML;
  }
}
TBaseControl = Class(THtmlController, 'BaseControl');