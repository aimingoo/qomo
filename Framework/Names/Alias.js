/**
 * alias sub system
 * ( other way: variant's define and reference to implement alias system )
 */
function isAlias(n) {
  return isNamespace(n.constructor);
}

function $alias(alias, name) {
  $map(alias, '');
  eval(alias).constructor = name;
}