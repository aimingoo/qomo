/*
 Temporary, need to be cleaned.
     using the Conditional Compile feature for script engine version
     detection, see http://msdn2.microsoft.com/en-us/library/121hztk3.aspx
*/

/*@cc_on

   @if (@_jscript_version < 5.0)
// --> entry for ie5.0
      $import('common_ie4.js');
   @else
// --> entry for ie5.0
     @if (@_jscript_version < 5.5)
       $import('common_ie5.js', $Q('Build/CompatIE50'));
     @end

// --> entry for ie5.5
     @if (@_jscript_version < 5.6)
       $import('common_ie55.js');
     @end

// --> entry for ie6.0+
     $import('common_ie6.js');
   @end

@*/