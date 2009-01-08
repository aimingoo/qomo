/*****************************************************************************
Qomolangma OpenProject v2.0
  [Aimingoo(aim@263.net)]
  [2007.07.20]

 Class TParserLite 
   - code import from Narcissus by Brendan Eich
*****************************************************************************/

function ParserLite() {

}

TParserLite = Class(TObject, 'ParserLite');

$import2.call(ParserLite.prototype, '3rd/jsparse.js', '', function() {
  this.parse = parse;
  this.tokens = tokens;
});