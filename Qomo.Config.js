/*****************************************************************************
Qomo Project v1.0
  [Aimingoo(aim@263.net)]
  [2006.10.25]

 - Qomo system loader config unit.
*****************************************************************************/
$Q = $QomoConfig = {
  // don't modify the set method
  set: function(n, v) {
    if ('is'+n in this)
      this['is'+n] = v;
    else
      this['has'+n] = v;
  },

  // modules loader config
  isDebugging: false,
  isProfiling: false,
  isBuilding: false,
  isNoneImport: false,
  isNoneAjax: false,
  hasRepImport: false,
  hasOutputDebug: true,

  hasIeAabsolutePath: false,
  hasIeDecode: false,
  hasInterface: true,
  hasError: false,
  hasProtocol: false,
  hasCompatLayer: true,
  hasNamespace: false,
  hasAspect: true,
  hasTemplet: true,
  hasCommonClasses: false,
  hasDatabase: false,
  hasGraphics: false,
  hasControls: true
}