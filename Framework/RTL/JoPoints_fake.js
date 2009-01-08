/**
 * Faked utility class JoPoint(), JoPoints()
 * - if wipe of AOP framework.
 */

JoPoint = JoPoints = function() {
  this.add =
  this.items =
  this.names =
  this.getLength =
  this.assign =
  this.unassign = function() {};
  this.weaving = function(n, f) { return f }
}