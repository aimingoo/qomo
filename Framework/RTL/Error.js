/*****************************************************************************
Qomolangma OpenProject v1.0
  [Aimingoo(aim@263.net)]
  [2006.05.11]

Exception and Error Extend for Standard JavaScript
 - more info in Error() Object;
 - $assert()
*****************************************************************************/

var
  EAssertFail = [8001, 'assert is failed.\n\n%s'];

/**
 * rewrite Error() Class
 * - parament : -> number, description, object
 *           or -> array[number, description, ...], object
 */
Error = function(E) {
  function _Error(v1, v2, v3) {
    if (v1 instanceof Array) {
      if (arguments.length>1) v3 = v2;
      v2 = v1[1];
      v1 = v1[0];
    }

    var e = new E(v1, v2);
    e.instanceObj = v3;
    return e;
  }

  _Error.constructor = E.constructor;
  return _Error;
}(Error);

/**
 * Utility Functions $assert()
 */
$assert = function (isTrue, info) {
  if (!isTrue) throw new Error(EAssertFail.concat([info]));
}