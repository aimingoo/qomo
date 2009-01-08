/*****************************************************************************
Qomolangma OpenProject v1.0
  [Aimingoo(aim@263.net)]
  [2006.10.18]

 - common interface: ITimer
 - class TTimer
*****************************************************************************/

/**
 * Interfaces of timer architectur
 */
ITimer = function() {
  this.start = Abstract;    // function(type, ms) {}
  this.OnTimer = Abstract;  // function(step) {}
  this.stop = Abstract;
}

/*DTTI
 * <summary>TTimer Class</summary>
 * <define name="Timer" kind="class" extand="Object" />
 */
function BaseTimer() {
  Attribute(this, 'TimerID', NaN, 'rw');
  Attribute(this, 'TimerData', null, 'rw');

  /*DTTI
   * <summary>Start, Timer and Stop Multi Cast Event</summary>
   */
  this.OnStart = NullFunction;
  this.OnTimer = NullFunction;
  this.OnStop = NullFunction;

  /*DTTI
   * <summary>start timer</summary>
   * <define name="start" kind="method" />
   */
  this.start = function(){
    this.OnStart();
  }

  /*DTTI
   * <summary>stop timer</summary>
   * <define name="stop" kind="method" />
   */
  this.stop = function() {
    var id = this.get('TimerID');
    if (!isNaN(id)) {
      clearInterval(id);
      clearTimeout(id);
      this.set('TimerID', NaN);
    }
    this.OnStop();
  }

  /*DTTI
   * <summary>object init. in create timer</summary>
   * <define name="Create" kind="constructor" />
   * <param name="*" type="*">paraments with format ([object, ]method)</param>
   */
  this.Create = function() {
    for (var i=0, args=arguments, argn=args.length; i<argn; i++) {
      if (args[i] instanceof Function) {
        this.OnTimer.add(args[i]);
      }
      else {
      	this.OnTimer.addMethod(args[i], args[++i]);
      }
    }
  }
}

function Timer() {
  /*DTTI
   * <summary>start timer</summary>
   * <define name="start" kind="method" />
   * <param name="type" type="String">timer type, values:
   *   - Timeout: Evaluates after a specified number of milliseconds has elapsed.
   *   - Interval: Evaluates each time a specified number of milliseconds has elapsed.
   * </param>
   * <param name="ms" type="Integer">specifies the number of milliseconds</param>
   */
  this.start = function(type, ms) {
    var step=0, vCode=new MuEvent();
    vCode.addMethod(this, function() {
      this.OnTimer(step++);
    });
    this.inherited();
    this.set('TimerID', window['set'+type](vCode, ms));
  }
}

TBaseTimer = Class(TObject, 'BaseTimer');
TTimer = Class(TBaseTimer, 'Timer', ITimer);
