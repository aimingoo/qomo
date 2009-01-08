/*****************************************************************************
Qomolangma OpenProject v2.0
  [Aimingoo(aim@263.net)]
  [2007.07.20]

 - Context Protect module for qomo's builder.
*****************************************************************************/

function ProtectCodeContext() {
  var
    left = '_Qo$',
    right = '.Oq^',
    r_tag = / ?_Qo\$(\d+)\.Oq\^/gi;

  var
    $INFO = [],
    type_comment = 0,
    type_string = 1,
    type_regexp = 2;
    type_cc = 3;

  this.protect = function(ctx, positions) {
    for (var last=0,i=0,result=[]; i<positions.length; i++){
      result.push(ctx.substring(last, positions[i][1]));
      last = positions[i][2];
      if (positions[i][0] != type_comment) {
        $INFO.push(ctx.substring(positions[i][1], last));
        result.push(left, ($INFO.length-1), right);
      }
    }
    result.push(ctx.substr(last));
    return result.join('');
  }

  this.unprotect = function(ctx) {
    if ($INFO.length<1) return ctx;

    // fast check
    if (ctx.lastIndexOf(left+ ($INFO.length-1) +right) < 0) {
      throw new Error('The code context is destructed!');
    }

    /* we have to make sure String.prototype.replace works here by different
       understanding of the ECMA-262 Section 15.5.4.11. */
    ctx = ctx.replace(r_tag, function($0,$1) {
      return $INFO[$1]
    });
    // if you want recheck...	

	  return ctx;
  }

  this.getProtectPoints = function(ctx) {
    var r_func = /\'|\"|(\/)(.)/g;
    var r_spc = /\s/;        // space char
    var r_div = /[\w\$\)]/;  // div expression from "\w\$\(" always!
    var $POS = [];

    var pos, unquote, op, typ, isOp, result;
    while (result = r_func.exec(ctx)) {
      pos = -1;
      typ = type_comment;
      isOp = false;

      switch (result[0]) {
        // is comment
        case '/*': {
          // is Conditional Compilation for JScript
          if (result.input.charAt(result.lastIndex) == '@') {
            typ = type_cc;
            $POS.push([typ, result.index, r_func.lastIndex = result.input.indexOf('@*/', r_func.lastIndex)+3]);
          }
          else {
            $POS.push([typ, result.index, r_func.lastIndex = result.input.indexOf('*/', r_func.lastIndex)+2]);
          }
          break;
        }
        case '//': {
          pos = result.input.indexOf('\n', r_func.lastIndex);
          $POS.push([typ, result.index, r_func.lastIndex = (
            (pos < 0) ? result.input.length :
            (result.input.charAt(pos+1) == '\r') ? pos+1 :
            pos
          )]);
          break;
        };

        // is string
        case "'" :
        case '"' :
          unquote = result[0];
          pos = r_func.lastIndex;

        default  :
          /* A known issue of this regular expression checker, take a look:
           *
           * // case 1
           * function foo() {
           * }/5/['test']('5')
           *
           * // case 2
           * myObject = {
           * }/5/['test']
           *
           * while /5/ in case 1 is a regular expression but -div-5-div- in case 2
           * can't identified out till now.
           */
          if (result[1] == '/') {
            // is RegExp or Div expression.
            pos = result.index;
            while (pos-- && r_spc.test(result.input.charAt(pos))) { }

            if (pos == -1) {  // out by zero, search to head
              isOp = true;
            }
            else {
              switch (result.input.charAt(pos)) {
                // operators of 'void', 'new', 'instanceof', 'in', 'typeof', 'delete'
                case 'n': if (pos>3) { op = result.input.substr(pos-3, 3); isOp = (/\bin/).test(op); } break;
                case 'w': if (pos>4) { op = result.input.substr(pos-4, 4); isOp = (/\bnew/).test(op); } break;
                case 'd': if (pos>5) { op = result.input.substr(pos-5, 5); isOp = (/\bvoid/).test(op); } break;
                case 'e': if (pos>7) { op = result.input.substr(pos-7, 7); isOp = (/\bdelete/).test(op); } break;
                case 'f': if (pos>7) { op = result.input.substr(pos-7, 7); isOp = (/\btypeof/).test(op); } 
                  if (!isOp && (pos>11)) {
                    op = result.input.substr(pos-11, 11);
                    isOp = (/\binstanceof/).test(op);
                  }
                  break;
                default:
                  // div express from [number, char, $] or a_function(). otherwise is
                  // '(' or operators before regexp
                  isOp = !r_div.test(result.input.charAt(pos));
              }
              pos = -1;
            }

            // is operators or begin of code block, so is regexp!
            if (!isOp) {
              r_func.lastIndex -= 1;
              break;
            }

            unquote = result[1];
            pos = r_func.lastIndex - 1;
          }

          // RegExp or String need pos to unquote
          if (pos > -1) {  // skip '\?'
            for (var ss=result.input, len=ss.length; pos<len; pos++) {
            if (ss.charAt(pos) == '\\') {
              pos++;
            }
            else if (ss.charAt(pos) == unquote) {
              typ = (unquote == '/') ? type_regexp : type_string;
              $POS.push([typ, result.index, r_func.lastIndex = pos+1]);
              break;
            }
          }
        }
      }
    }
    return $POS;
  }
}