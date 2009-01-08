/**
 * inline compat layer for builer system.
 * parse by Building.js
 */

switch ($import.get('browser')) {
  case 'msie'    : {
    $import__('common_msie.js');
    break;
  }
  case 'mozold'  : {
    $import__('common_mozold.js');
    /* with next */
  }
  case 'moznew' : {
    $import__('common_moznew.js');
    break;
  }
  case 'opera'  : {
    $import__('common_opera.js');
    break;
  }
  case 'safari'  : {
    $import__('common_safari.js');
    break;
  }
}