/*****************************************************************************
Qomolangma OpenProject v1.0
  [Aimingoo(aim@263.net)]
  [2006.10.18]

 - Class TStepTrigger for TimeMachine.js
 - Code mount from Yahoo UI.
*****************************************************************************/

/**
 * defining the acceleration rate and path of animations.
 * code from yui/animation/src/js/Easing.js, changed by aimingoo
 *
 * - doCalc(this.currentFrame, start, end - start, this.totalFrames);
 *     @param {Number} t Time value used to compute current value.
 *     @param {Number} b Starting value.
 *     @param {Number} c Delta between start and end values.
 *     @param {Number} d Total length of animation.
 * - return {Number} The computed value for the current animation frame.
 */
function StepTrigger() {
  /**
   * Uniform speed between points.
   */
  this.easeNone = function(t, b, c, d) {
    return b+c*(t/=d); 
  };
  
  /**
   * Begins slowly and accelerates towards end.
   */
  this.easeIn = function(t, b, c, d) {
    return b+c*((t/=d)*t*t);
  };
  
  /**
   * Begins quickly and decelerates towards end.
   */
  this.easeOut = function(t, b, c, d) {
    var ts=(t/=d)*t;
    var tc=ts*t;
    return b+c*(tc + -3*ts + 3*t);
  };
  
  /**
   * Begins slowly and decelerates towards end.
   */
  this.easeBoth = function(t, b, c, d) {
    var ts=(t/=d)*t;
    var tc=ts*t;
    return b+c*(-2*tc + 3*ts);
  };
  
  /**
   * Begins by going below staring value.
   */
  this.backIn = function(t, b, c, d) {
    var ts=(t/=d)*t;
    var tc=ts*t;
    return b+c*(-3.4005*tc*ts + 10.2*ts*ts + -6.2*tc + 0.4*ts);
  };
  
  /**
   * End by going beyond ending value.
   */
  this.backOut = function(t, b, c, d) {
    var ts=(t/=d)*t;
    var tc=ts*t;
    return b+c*(8.292*tc*ts + -21.88*ts*ts + 22.08*tc + -12.69*ts + 5.1975*t);
  };
  
  /**
   * Starts by going below staring value, and ends by going beyond ending value.
   */
  this.backBoth = function(t, b, c, d) {
    var ts=(t/=d)*t;
    var tc=ts*t;
    return b+c*(0.402*tc*ts + -2.1525*ts*ts + -3.2*tc + 8*ts + -2.05*t);
  }

   /**
    * code from yui/animation/src/js/Bezier.js, changed by aimingoo
    *
    * Get the current position of the animated element based on t.
    * @param {array} points An array containing Bezier points.
    * Each point is an array of "x" and "y" values (0 = x, 1 = y)
    * At least 2 points are required (start and end).
    * First point is start. Last point is end.
    * Additional control points are optional.    
    * @param {float} t Basis for determining current position (0 < t < 1)
    * @return {object} An object containing int x and y member data
    */
  this.bezierPosition = function(points, t) {  
    var n = points.length;
    var tmp = [];

    for (var i = 0; i < n; ++i){
      tmp[i] = [points[i][0], points[i][1]]; // save input
    }

    for (var j = 1; j < n; ++j) {
      for (i = 0; i < n - j; ++i) {
        tmp[i][0] = (1 - t) * tmp[i][0] + t * tmp[parseInt(i + 1, 10)][0];
        tmp[i][1] = (1 - t) * tmp[i][1] + t * tmp[parseInt(i + 1, 10)][1]; 
      }
    }

    return [ tmp[0][0], tmp[0][1] ]; 
  }
}

TStepTrigger = Class(TObject, 'StepTrigger');