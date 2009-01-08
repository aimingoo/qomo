/*****************************************************************************
Qomolangma OpenProject v1.0
  [Aimingoo(aim@263.net)]
  [2006.10.18]

 - Class TSteper, TLineSteper, TSequenceSteper for TimeMachine.js
*****************************************************************************/

/*DTTI
 * <summary>step by step function</summary>
 * <define name="OnStep" kind="Event"/>
 * <return type="*">last step data</return>
 */
TOnStep = function(nStep, nLast) {}

/*DTTI
 * <summary>TTimeline Class</summary>
 * <define name="TTimeline" kind="class" extand="Object" />
 */
function Steper() {
  Attribute(this, 'Data', null, 'rw');
  this.OnStep = TOnStep;
}

TSteper = Class(TObject, 'Steper');
TLineSteper = TSteper;
TSequenceSteper = TSteper;