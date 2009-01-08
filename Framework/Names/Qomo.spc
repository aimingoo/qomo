/** 
 * register Qomo's Spaces
 *   - current is $(QomoRoot)/Framework/Names/
 *   - (if you want,) base current: $map('Qomo', '../../');
 * next for Qomo's path root only:
 *   ''  : is root, with relative_path
 *   '/' : is root, with absolute_path, and qomo.js in web site's root.
 */
$map('Qomo', './', function() {
  return $import.get('docBase') + $import.get('srcBase');
}());

$map('Qomo.System', 'Framework/', $n2p(Qomo));
$mapx('Qomo.System.Common');
$mapx('Qomo.System.RTL');

$map('Qomo.UI', 'Components/', $n2p(Qomo));
$mapx('Qomo.UI.Graphics');
$mapx('Qomo.UI.Controls');

$map('Qomo.DB', '');
$map('Qomo.DB.LocalDB', 'Components/LocalDB/', $n2p(Qomo));