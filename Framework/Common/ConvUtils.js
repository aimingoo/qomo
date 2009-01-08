/*****************************************************************************
Qomolangma OpenProject v1.0
  [Aimingoo(aim@263.net)]
  [2007.01.30]

 - some convert util functions
*****************************************************************************/

function toDec(hex) {
  return parseInt(hex, 16);
}

function toHex(dec) {
  return (dec > 255 ? 'FF' : dec.toString(16, 2));
}

function longHexToDec(hex) {
  return [toDec(hex.substring(0,2)), toDec(hex.substring(2,4)), toDec(hex.substring(4,6))];
}