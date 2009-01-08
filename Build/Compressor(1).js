_inline_compress_method_1: {

    var  removeLineFeeds = true;

    // Remove all leading and trailing whitespace and condense runs
    // of two or more whitespace characters to just one.
    ctx = ctx.replace(/^[\s]+/gm, "");
    ctx = ctx.replace(/[ \f\t\v]+$/gm, " ");
    ctx = ctx.replace(/(\s){2,}/g, "$1");

    // Line feed removal requested?
    if(removeLineFeeds) {
      // Remove line feeds when they appear near numbers with signs
      // or operators.  A space is used between + and - occurrences
      // in case they are increment/decrement operators followed by
      // an add/subtract operation.  In other cases, line feeds are
      // only removed following a + or - if it is not part of an
      // increment or decrement operation.
      ctx = ctx.replace(/([+-])\n\1/g, "$1 $1");
      ctx = ctx.replace(/([^+-][+-])\n/g, "$1");
      ctx = ctx.replace(/([\xFE{}([,<>\/*%&|^!~?:=.;])\n/g, "$1");
      ctx = ctx.replace(/\n([{}()[\],<>\/*%&|^!~?:=.;+-])/g ,"$1");
    }

    // Strip all unnecessary whitespace around operators
    ctx = ctx.replace(/[ \f\r\t\v]?([\n\/\{\}\(\)\[\]\\\*\|\^\?;,<>%&!~:=])[ \f\r\t\v]?/g, "$1");
    ctx = ctx.replace(/([^+]) ?(\+)/g, "$1$2");
    ctx = ctx.replace(/(\+) ?([^+])/g, "$1$2");
    ctx = ctx.replace(/([^-]) ?(\-)/g, "$1$2");
    ctx = ctx.replace(/(\-) ?([^-])/g, "$1$2");

    // Try for some additional line feed removal savings by
    // stripping them out from around one-line if, while,
    // and for statements and cases where any of those
    // statements immediately follow another.
    if(removeLineFeeds) {
      ctx = ctx.replace(/(\W(if|while|for)\([^{]*?\))\n/g, "$1");
      ctx = ctx.replace(/(\W(if|while|for)\([^{]*?\))((if|while|for)\([^{]*?\))\n/g, "$1$3");
      ctx = ctx.replace(/([;}]else)\n/g, "$1 ");
    }

}