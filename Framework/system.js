/*****************************************************************************
Qomolangma OpenProject v1.0
  [Aimingoo(aim@263.net)]
  [2006.01.29]

 - you can append or change initialize list at end of the unit.
*****************************************************************************/


/**
 *  core framework load list
 */
$import('Debug/Debug.js',         $Q('Debugging'));
$import('RTL/Error.js',           $Q('Error'));
$import('RTL/Protocol.js',        $Q('Protocol'));

// fix some bug(see document) with the compat layer!
$import('Compat/CompatLayer.js',  $Q('CompatLayer'));

$import('RTL/Interface.js',       $Q('Interface'));
$import('RTL/JoPoints.js',        $Q('JoPoints'));
$import('RTL/JoPoints_fake.js',   !$Q('JoPoints'));
$import('Names/NamedSystem.js',   $Q('Namespace'));
$import('RTL/JSEnhance.js');
$import('RTL/Object.js');
$import('RTL/Templet.js',         $Q('Templet'));
$import('RTL/Aspect.js',          $Q('Aspect'));