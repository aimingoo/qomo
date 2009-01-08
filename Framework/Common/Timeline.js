/*****************************************************************************
Qomolangma OpenProject v1.0
  [Aimingoo(aim@263.net)]
  [2006.10.18]

 - class TTimeline, you can defined flated and interlaced timeline
*****************************************************************************/

function Timeline() {
  function _Interval(ms) {
    var step = TSteper.Create();
    step.OnStep = new Function('return ' + ms);
    return step;
  }

  /*DTTI
   * <summary>start timer</summary>
   * <define name="start" kind="method" />
   * <param name="data" type="TSteper, Array">specifies the TSteper object or data_value array</param>
   * <param name="time" type="TSteper, Array, Integer">specifies the TSteper object or time_value array, or a timeline interval.</param>
   * <return type="undefined">!!! warnning</return>
   */
  this.start = function(data, time) {
    this.inherited('start', data, (isNaN(time) ? time : _Interval(parseInt(time))));
  }
}

TTimeline = Class(TTimeMachine, 'Timeline');