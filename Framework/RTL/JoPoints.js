/**
 * Utility Class JoPoint(), JoPoints()
 * - join point for AOP.
 */

JoPoint = function() {
  function _JoPoint () {
    this.items = []; // push implemented name.
    this.all = {};   // push implemented IAspect.
  }

  _JoPoint.prototype.assign = function(n, a) {
    if (!this.all[n]) this.items.push(n);
    return this.all[n] = Interface.QueryInterface(a, IAspect);
  }

  _JoPoint.prototype.unassign = function(n) {
    this.items.remove(n);
    delete this.all[n];
  }

  return _JoPoint;
}();


JoPoints = function() {
  function _JoPoints () {
    for (var i=0; i<arguments.length; i++, this.length++) this[(this[i]=arguments[i])] = new JoPoint();
  }
  _JoPoints.prototype.length = 0;
  _JoPoints.prototype.pt = function(n) { return (this.hasOwnProperty(n) ? this[n] : undefined) }
  _JoPoints.prototype.add = function(n) { this[(this[this.length++]=n)] = new JoPoint() }
  _JoPoints.prototype.items = function(i) {
    var pt = ((typeof i=='number' || i instanceof Number) ? this[this[i]] : this.pt(i));
    return (!pt ? new IJoPoint() : Interface.QueryInterface(pt, IJoPoint));
  }

  _JoPoints.prototype.weaving = function(n, f) {
    var $n=n, $f=f, $pts=this;
    return function() {
      var $pt=$pts.pt($n);
      if (!$pt || ($pt.items.length==0)) return $f.apply(this, arguments);

      var names=$pt.items, imax=names.length, point=$n;
      var _value, _intro=true, _cancel=false;

      for (var i=0; _intro && i<imax; i++) _intro = ($pt.all[names[i]].OnIntroduction(this, names[i], point, arguments) !== false);
      if (_intro) for (var i=0; i<imax; i++) $pt.all[names[i]].OnBefore(this, names[i], point, arguments);
      if (_intro) for (var i=0; !_cancel && i<imax; i++) _cancel = ($pt.all[names[i]].OnAround(this, names[i], point, arguments) === false);
      if (!_cancel) _value = $f.apply(this, arguments);
      if (_intro) for (var i=0; i<imax; i++) $pt.all[names[i]].OnAfter(this, names[i], point, arguments, _value);
      return _value;
    }
  }

  return _JoPoints;
}();