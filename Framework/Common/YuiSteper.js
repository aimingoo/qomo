/*****************************************************************************
Qomolangma OpenProject v1.0
  [Aimingoo(aim@263.net)]
  [2006.10.18]

 - Class TYuiSteper for TimeMachine.js
 - Code mount from Yahoo UI.
*****************************************************************************/

function YuiSteper() {
  Attribute(this, 'Easing', 'easeOut');
  Attribute(this, 'Points', null);

  Attribute(this, 'Frames', 100);
  Attribute(this, 'Fps', 200);
  Attribute(this, 'From', 0);
  Attribute(this, 'To', 100);

  var trig = TStepTrigger.Create();

  var doStep = function(step, data) {
    var method = trig[this.get('Easing')];
    var frames = this.get('Frames');
    if (method && step<=frames) {
      var from = this.get('From');
      var count = this.get('To')-from;
      var pts, val = method(step, from, count, frames);
      if (pts = this.get('Points')) {
        val = trig.bezierPosition(pts, val/count);
      }
      return val;
    }
  }

  this.Create = function() {
    this.OnStep.add(doStep);

    // todo:
    //   - calc Fps
    //   - calc Frames
  }
}

TYuiSteper = Class(TSteper, 'YuiSteper');