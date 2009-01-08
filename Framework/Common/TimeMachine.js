/*****************************************************************************
Qomolangma OpenProject v1.0
  [Aimingoo(aim@263.net)]
  [2006.10.18]

 - common interface: ITimeMachine
 - unified architecture: time machine and data provider
 - class TTimeMachine
*****************************************************************************/

$import('StepTrigger.js');
$import('Steper.js');
$import('YuiSteper.js');

ITimeMachine = function() {
  this.start = Abstract;    // function(data, time) {}
  this.OnTimer = Abstract;  // function(step, data) {}
  this.stop = Abstract;
}

function TimeMachine() {
  function _Provider(step, last) {
    return this.get('Data')[step];
  }

  function _Factory(aClass, aObj) {
    if (aObj instanceof Steper) return aObj;
    if (aObj instanceof Array) {
      var instance = aClass.Create();
      instance.set('Data', aObj);
      instance.OnStep.add(_Provider);
      return instance;
    }
    else { // is number?
      $assert((typeof aObj == 'number') || (aObj instanceof Number), 'param invaild for TTimeMachine.start().');
      var instance = aClass.Create();
      instance.set('Data', aObj);
      instance.OnStep.add(new Function('return ' + Number(aObj).toString()));
      return instance;
    }
  }

  /*DTTI
   * <summary>start timer</summary>
   * <define name="start" kind="method" />
   * <param name="data" type="TSteper, Array">specifies the TSteper object or data_value array</param>
   * <param name="time" type="TSteper, Array">specifies the TSteper object or time_value array</param>
   */
  this.start = function(data, time) {
    // provider constructing
    var sequ = _Factory(TLineSteper, data);
    var line = _Factory(TSequenceSteper, time);

    var ms, step, last=undefined;
    var vCode = new MuEvent();
    vCode.addMethod(this, function() {
      // get last and try OnTimer()
      last = sequ.OnStep(step, last);
      if (last === undefined) return void this.stop();
    	this.OnTimer(step, last);

      // get elapsed MilliSeconds, and setTimeout()
      ms = line.OnStep(++step, ms);
      if (ms < 1) return void this.stop();
      this.set('TimerID', window.setTimeout(vCode, ms));
    });

    // initialize data of ms and step, start timer.
    this.inherited();
    this.set('TimerID', window.setTimeout(vCode, ms=line.OnStep(step=0, 0)));
  }
}

TTimeMachine = Class(TBaseTimer, 'TimeMachine', ITimeMachine);