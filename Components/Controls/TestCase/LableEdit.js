function LabledEdit() {
  Attribute(this, '_label', null, 'r');
  Attribute(this, '_edit', null, 'r');

  this.get_label = function() {
    return this.assignedElement.children(0);
  }
  this.get_edit = function() {
    return this.assignedElement.children('edit');
  }

  this.getLableText = function() {
    return this.get('_label').innerText;
  }
  this.setLableText = function(v) {
    this.get('_label').innerText = v;
  }

  this.getvalue = 
  this.getValue = function() {
    return this.get('_edit').value;
  }

  this.setvalue = 
  this.setValue = function(v) {
    this.get('_edit').value = v;
  }
}
TLabledEdit = Class(THtmlController, 'LabledEdit');