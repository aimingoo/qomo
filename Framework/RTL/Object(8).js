_inline_object_attributesInfomactions: {

  var $cc_attr = {
    r: function(p, n) { return p['get'+n] !== this.getInvalid },
    w: function(p, n) { return p['set'+n] !== this.setInvalid },
    c: function(p, n) { return p['get'+n] !== this.getClone },
    p: function(p, n) { return p['get'+n] !== this.getProtect || p['set'+n] !== this.setProtect },
    '*': function(p, n) { return p['get'+n] !== this.getInvalid && p['set'+n] !== this.setInvalid },
    'undefined': function() { return true }
  }

  Attribute($cc_attr, 'Invalid', '', '');  // fake and get method_ptr: cantRead(), cantWrite()
  Attribute($cc_attr, 'Protect', '', 'p'); // fake and get method_ptr: p_getAttr(), p_setAttr()
  Attribute($cc_attr, 'Clone', '', 'c');   // fake and get tag_clone

}
