/**
 * namespace sub system
 *
 * function: $map(), $n2p, $p2n, $mapx
 *  - P2N   : searh in $map$ privated object.
 *  - N2P   : NameSpace.constructor
 *  - N2Str : NameSpace.toString()
 *  - Str2N : eval(Str)
 * if namespace constructor property eq '', then it's virtual
 */
function isNamespace(n) {
  if (n === null) return false;
  if (typeof n != 'object') return false;
  switch (typeof n.constructor){
   case 'function': return false; // is a normal object
   case 'object': {
     if (isNamespace(n.constructor)) return true;  // a alias
     return n.constructor.constructor == String;   // constructor is a String Object
   }
   case 'string': return true;
   default: return false;
  }
}

$map = function() {
  // get reference from $import
  var $getter = $import.get;
  var parseRelativeURL = $getter('parseRelativeURL');
  var transitionUrl = $getter('transitionUrl');
  var scripts = $getter('scripts');
  var activeJS = $getter('activeJS');
  var docBase = $getter('docBase');
  var $third = 'Qomo.Thirdparty';

  function curScript() {
    return $getter('curScript');
  }

  function pathBase() {
    return $getter('pathBase')();
  }

  // $import enhanced, call activeSpc() to get current active namesapce
  $import.set('activeSpc', function() {
    var s = curScript() || activeJS();
    if (s) {
      s = s.substr(0, s.lastIndexOf('/')+1);
      s = $p2n((s.charAt(0)=='/' ? '' : docBase) + s); 
      if (s) return s;
    }
    // throw new Error([2, 'Can\'t Get Active Namespace!']);
    return $third;
  });


  // $import enhanced, support import package by name and alias.
  $import.set('transitionUrl', function(target){
    if (isNamespace(target)) {
      var p = $n2p(target), url = p + 'package.xml';
      scripts[url] = null;  // set cached tag

      // todo: analize package.xml context, and call $import();
      // var str = httpGet(url);
      // ...
    }

    return transitionUrl(target);
  });

  // return a function provide to a NameSpace.toString()
  function $name(name) {
    return new Function("return '" + name + "'");
  }

  // a hashed map table by path.length
  var $map$ = {
    //mapper of all path
    //0..n : dynamic properties with this.insert()

    // find a signpost in map for the p(ath)
    signpost : function(p) {
      var i, imax, sp, n=p.length;
      while (n>1) {
        if (sp=this[n]) {
          for (i=0, imax=sp.paths.length; i<imax; i++)
            if (sp.paths[i]==p) return sp.names[i];
        }
        p = p.substr(0, p.lastIndexOf('/', n-2)+1);
        n = p.length;
      }
      return null;
    },

    // remove a (n)amespace
    remove : function(p) {
      var sp;
      if (sp = this[p.length]) {
        for (var i=0, imax=sp.paths.length; i<imax; i++) {
          if (sp.paths[i] == p) {
            // if you want, you can reset n(ame) from map :
            // while (isAlias(n)) n=n.constructor;
            // sp.names[i] = p;
            //searched, remove and return.
            sp.names.splice(i,1);
            sp.paths.splice(i,1);
            return true;
          }
        }
      }
      return false;
    },

    // insert p(ath) to map
    insert : function(p, n) {
      if ($p2n(p)==null) {
        if (sp=this[p.length]) {
          sp.names.push(n);
          sp.paths.push(p);
        }
        else {
          this[p.length] = {names:new Array(n), paths: new Array(p)};
        }
      }
    }
  };

  // get path from a namespace, if namespace is virtual, return ''
  // ( support alias system )
  function $n2p(n) {
    if (n) {
      while (n.constructor.constructor != String) n = n.constructor;
      return n.constructor;
    }
  }

  // get namespce with a path, if namespace no exist, return null
  // * notice: calc with sp.toString()
  function $p2n(p) {
    // for relative_path root only
    if (p=='' && $n2p(Qomo)=='') return Qomo;

    var sp = $map$.signpost(p);
    if (!sp) return null;
    if (sp.constructor==p) return sp;

    var n = p.substring(sp.constructor.length, p.length-1).replace('/', '.');
    try {
      return eval(sp + '.' + n);
    }
    catch (e) {
      return null;
    }
  }

  // expand a string to a full Namespace.  (s)tring arugment begin with a 
  // valid namespace(none virtual), and end by a sub_path of namespace.
  // $mapx() will fill(/expand) with sub_path.
  function $mapx(s) {
    var n, i, p='', $spc='', $ss=s.split('.')
    for (i=0; i<$ss.length; i++,$spc+='.') {
      $spc += $ss[i];
      if (n=eval($spc)) {
        p = n.constructor;
        continue;
      }
      while (true) {
        window.execScript($spc+'={};', 'JavaScript');
        p += $ss[i] + '/';
        n = eval($spc);
        n.constructor = p;
        n.toString = $name($spc);
        if (++i >= $ss.length) break;
        $spc += '.'+$ss[i];
      }
    }
  }

  var $attr$ = {
    '$n2p' : $n2p,
    '$p2n' : $p2n,
    '$mapx' : $mapx
  }

  function _map(name, path, base) {
    if (path) {
      path = parseRelativeURL((path.charAt(0)=='/' ? '' : base || pathBase()) + path);
    }

    if (isNamespace(name)) { // mapped ?
      /* warning: if path cached and name expanded, then system may crash!!! */
      if ($map$.remove($n2p(name))) { };
    }
    else {
      var $ss = name.split('.');
      if ($ss.length==0) return;

      var $spc = $ss[0];
      try {
      	// if none root space, then throw error
        eval($spc);
      }
      catch (e) {
        // make root space
        window.execScript($spc+'={};', 'JavaScript');
        eval($spc).constructor = "";
        eval($spc).toString = $name($spc);
      }

      for (var i=1,imax=$ss.length; i<imax; i++) {
        $spc += '.'+$ss[i];
        if (eval($spc)) continue;

        while (true) {
          window.execScript($spc+'={};', 'JavaScript');
          eval($spc).constructor = "";
          eval($spc).toString = $name($spc);
          if (++i >= $ss.length) break;
          $spc += '.'+$ss[i];
        }
      }
    }

    name = eval(name);
    name.constructor = path;
    if (path) $map$.insert(path, name);
  }

  _map.get = function(n) {
    return eval('$attr$[n]');
  }

  _map.set = function(n, v) {
    return eval('$attr$[n] = v');
  }

  _map.OnSysInitialized = function() {
     delete _map.set;
     delete _map.get;
     delete _map.OnSysInitialized;
  }

  // Qomo.Thirdparty is exist always, and can't rewrite it.
  _map($third, '');
  $third = eval($third);

  return _map;
}();

$n2p = $map.get('$n2p');
$p2n = $map.get('$p2n');
$mapx = $map.get('$mapx');
$map.OnSysInitialized();