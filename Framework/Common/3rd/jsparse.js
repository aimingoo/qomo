/**
 * Narcissus - JS implemented in JS.
 *
 * Lexical scanner and parser.
 *
 * The Original Code is the Narcissus JavaScript engine.
 *
 * The Initial Developer of the Original Code is
 * Brendan Eich <brendan@mozilla.org>.
 * Portions created by the Initial Developer are Copyright (C) 2004
 * the Initial Developer. All Rights Reserved.
 *
 * Mount and changed by aimingoo, 2007.07.07
 *  - clean comments
 *  - don't check some syntax excepts
 *  - syntax tree can't execute
 */

var tokens = [
  // End of source.
  "END",

  // Operators and punctuators.  Some pair-wise order matters, e.g. (+, -)
  // and (UNARY_PLUS, UNARY_MINUS).
  "\n", ";",
  ",",
  "=",
  "?", ":", "CONDITIONAL",
  "||",
  "&&",
  "|",
  "^",
  "&",
/* none yield
  "->",
*/
  "==", "!=", "===", "!==",
  "<", "<=", ">=", ">",
  "<<", ">>", ">>>",
  "+", "-",
  "*", "/", "%",
  "!", "~", "UNARY_PLUS", "UNARY_MINUS",
  "++", "--",
  ".",
  "[", "]",
  "{", "}",
  "(", ")",

  // Nonterminal tree node type codes.
  "SCRIPT", "BLOCK", "LABEL", "FOR_IN", "CALL", "NEW_WITH_ARGS", "INDEX",
  "ARRAY_INIT", "OBJECT_INIT", "PROPERTY_INIT", "GETTER", "SETTER",
  "GROUP", "LIST",

  // Terminals.
  "IDENTIFIER", "NUMBER", "STRING", "REGEXP",

  // Keywords.
  "break",
  "case", "catch", "const", "continue",
  "debugger", "default", "delete", "do",
  "else", "enum",
  "false", "finally", "for", "function",
  "if", "in", "instanceof",
  "new", "null",
  "return",
  "switch",
  "this", "throw", "true", "try", "typeof",
  "var", "void",
  "while", "with" // EDIT: remove trailing comma (breaks IE)
];

// Operator and punctuator mapping from token to tree node type name.
// NB: superstring tokens (e.g., ++) must come before their substring token
// counterparts (+ in the example), so that the opRegExp regular expression
// synthesized from this list makes the longest possible match.
// EDIT: NB comment above indicates reliance on SpiderMonkey-specific
//       behavior in the ordering of key iteration -- see EDIT below.
// EDIT: add yeilding op
var opTypeOrder = [
  '\n',   "NEWLINE",
  ';',    "SEMICOLON",
  ',',    "COMMA",
  '?',    "HOOK",
  ':',    "COLON",
  '||',   "OR",
  '&&',   "AND",
  '|',    "BITWISE_OR",
  '^',    "BITWISE_XOR",
  '&',    "BITWISE_AND",
/* none yield
  '->',   "YIELDING",
*/
  '===',  "STRICT_EQ",
  '==',   "EQ",
  '=',    "ASSIGN",
  '!==',  "STRICT_NE",
  '!=',   "NE",
  '<<',   "LSH",
  '<=',   "LE",
  '<',    "LT",
  '>>>',  "URSH",
  '>>',   "RSH",
  '>=',   "GE",
  '>',    "GT",
  '++',   "INCREMENT",
  '--',   "DECREMENT",
  '+',    "PLUS",
  '-',    "MINUS",
  '*',    "MUL",
  '/',    "DIV",
  '%',    "MOD",
  '!',    "NOT",
  '~',    "BITWISE_NOT",
  '.',    "DOT",
  '[',    "LEFT_BRACKET",
  ']',    "RIGHT_BRACKET",
  '{',    "LEFT_CURLY",
  '}',    "RIGHT_CURLY",
  '(',    "LEFT_PAREN",
  ')',    "RIGHT_PAREN"
];

// EDIT: add yielding op precedence
var opPrecedenceItems = [
  'SEMICOLON', 0,
  'COMMA', 1,
  'ASSIGN', 2, 'HOOK', 2, 'COLON', 2, 'CONDITIONAL', 2,
  // The above all have to have the same precedence, see bug 330975.
  'OR', 4,
  'AND', 5,
  'BITWISE_OR', 6,
  'BITWISE_XOR', 7,
  'BITWISE_AND', 8,
  'EQ', 9, 'NE', 9, 'STRICT_EQ', 9, 'STRICT_NE', 9,
  'LT', 10, 'LE', 10, 'GE', 10, 'GT', 10, 'IN', 10, 'INSTANCEOF', 10,
  'LSH', 11, 'RSH', 11, 'URSH', 11,
  'PLUS', 12, 'MINUS', 12,
  'MUL', 13, 'DIV', 13, 'MOD', 13,
  'DELETE', 14, 'VOID', 14, 'TYPEOF', 14, // 'PRE_INCREMENT', 14, 'PRE_DECREMENT', 14,
  'NOT', 14, 'BITWISE_NOT', 14, 'UNARY_PLUS', 14, 'UNARY_MINUS', 14,
  'INCREMENT', 15, 'DECREMENT', 15,     // postfix
  'NEW', 16,
//  'YIELDING', 17,
  'DOT', 18
];

var opArityItems = [
  'COMMA', -2,
  'ASSIGN', 2,
  'CONDITIONAL', 3,
  'OR', 2,
  'AND', 2,
  'BITWISE_OR', 2,
  'BITWISE_XOR', 2,
  'BITWISE_AND', 2,
  'EQ', 2, 'NE', 2, 'STRICT_EQ', 2, 'STRICT_NE', 2,
  'LT', 2, 'LE', 2, 'GE', 2, 'GT', 2, 'IN', 2, 'INSTANCEOF', 2,
  'LSH', 2, 'RSH', 2, 'URSH', 2,
  'PLUS', 2, 'MINUS', 2,
  'MUL', 2, 'DIV', 2, 'MOD', 2,
  'DELETE', 1, 'VOID', 1, 'TYPEOF', 1,  // 'PRE_INCREMENT', 1, 'PRE_DECREMENT', 1,
  'NOT', 1, 'BITWISE_NOT', 1, 'UNARY_PLUS', 1, 'UNARY_MINUS', 1,
  'INCREMENT', 1, 'DECREMENT', 1,     // postfix
  'NEW', 1, 'NEW_WITH_ARGS', 2, 'DOT', 2, 'INDEX', 2, 'CALL', 2,
//  'YIELDING', 3,
  'ARRAY_INIT', 1, 'OBJECT_INIT', 1, 'GROUP', 1
];

var opTypeNames = {};
opTypeOrder.table = {};
for (var i=0; i<opTypeOrder.length; i++) {
  opTypeNames[opTypeOrder[i]] = opTypeOrder[++i];
}

// Hash of keyword identifier to tokens index.  NB: we must null __proto__ to
// avoid toString, etc. namespace pollution.
var keywords = {__proto__: null};

// Define const END, etc., based on the token names.  Also map name to index.
// EDIT: use "var " prefix to make definitions local to this function
var consts = "var ";
for (var name, t, i=0, j=tokens.length; i<j; i++) {
  if (i > 0)
	  consts += ", ";

  name = t = tokens[i];
  if (/^[a-z]/.test(t)) {
	  name = t.toUpperCase();
	  keywords[t] = i;
  }
  else if (/^\W/.test(t)) {
    name = opTypeNames[t];
    opTypeOrder.table[t] = i;
  }

  consts += name + " = " + i;
  tokens[t] = i;
}
eval(consts + ";");

// Map assignment operators to their indexes in the tokens array.
var assignOps = ['|', '^', '&', '<<', '>>', '>>>', '+', '-', '*', '/', '%'];

for (i = 0, j = assignOps.length; i < j; i++) {
  t = assignOps[i];
  assignOps[t] = tokens[t];
}

var opPrecedence = {}
for (var i = 0; i < opPrecedenceItems.length; i++) {
  var item = opPrecedenceItems[i];
  opPrecedence[item] = opPrecedenceItems[++i];
  opPrecedence[eval(item)] = opPrecedence[item];
}

var opArity = {};
for (var i = 0; i < opArityItems.length; i++) {
  var item = opArityItems[i];
  opArity[item] = opArityItems[++i];
  opArity[eval(item)] = opArity[item];
}

// Build a regexp that recognizes operators and punctuators (except newline).
var op, opRegExpSrc = [];
for (var i=0; i<opTypeOrder.length; i++) {
  if ((op = opTypeOrder[i]) == '\n') continue;
  opRegExpSrc.push(op.replace(/[?|^&(){}\[\]+\-*\/\.]/g, "\\$&"));
}
opRegExpSrc = "(?:" + opRegExpSrc.join('|') + ")";

// fast, use with regexp.lastIndex
var opRegExp2 = new RegExp(opRegExpSrc, 'g');
var fpRegExp2 = /(?:\d+\.\d*(?:[eE][-+]?\d+)?|\d+(?:\.\d*)?[eE][-+]?\d+|\.\d+(?:[eE][-+]?\d+)?)/g;
var qrNumber2 = /(?:0[xX][\da-fA-F]+|0[0-7]*|\d+)/g;
var qrString2 = /(?:'[^'\\]*(?:\\.[^'\\]*)*'|"[^"\\]*(?:\\.[^"\\]*)*")/g;
var qrRegExp2 = /\/((?:\\.|[^\/])+)\/([gimy]*)/g;
var qrComment2 = /\/(?:\*(?:.|\n|\r)*?\*\/|\/.*)/g;
var qrIdentifier2 = /[$\w]+/g;

function Tokener(source) {
  function Token() {
  }
  void function(p) {
    p.type =
    p.start =
    p.end =
    p.lineno = undefined;
    p.value = function(t) {
      return t.substring(this.start, this.end);
    }
  }(Token.prototype);

  return Token;
}

function Tokenizer(s, f, l) {
  this.cursor = 0;
  this.source = String(s);
  this.tokens = [];
  this.tokenIndex = 0;
  this.lookahead = 0;
  this.scanNewlines = false;
  this.scanOperand = true;
  this.filename = f || "";
  this.lineno = l || 1;
  this.Token = Tokener(this.source);
}

Tokenizer.prototype = {
  done: function() {
    return this.peek() == END;
  },

  token: function() {
    return this.tokens[this.tokenIndex];
  },

  match: function (tt) {
    return this.get() == tt || this.unget();
  },

  mustMatch: function (tt) {
    if (!this.match(tt)) throw "Missing " + tokens[tt].toLowerCase();
    return this.token();
  },

  // 得到下一个节点(基于tokenIndex或get扫描)，但返回节点标识后并不修改当前结点指针
  peek: function () {
    var tt;
    if (this.lookahead) {
      tt = this.tokens[(this.tokenIndex + this.lookahead) & 3].type;
    } else {
      tt = this.get();
      this.unget();
    }
    return tt;
  },

  peekOnSameLine: function () {
    this.scanNewlines = true;
    var tt = this.peek();
    this.scanNewlines = false;
    return tt;
  },

  // unget()总是发生在get()之后, 因此只需要tokenIndex--就可以找到上一个结点了. 而在get()中,
  // 有针对这种被unget()的结点处理的代码，因此在unget()后如果再次调用get()并不做字符串扫描
  unget: function () {
    if (++this.lookahead == 4) throw "PANIC: too much lookahead!";
    this.tokenIndex = (this.tokenIndex - 1) & 3;
  },

  get: function () {
    var token;
    while (this.lookahead) {
      --this.lookahead;
      this.tokenIndex = (this.tokenIndex + 1) & 3;
      token = this.tokens[this.tokenIndex];
      if (token.type != NEWLINE || this.scanNewlines)
        return token.type;
    }

    var input = this.source;
    var match, r, r1 = /[ \t]+/g, r2 = /\s+/g;
    for (;;) {
      var firstChar = input.charCodeAt(this.cursor);
      if ((firstChar == 32 || (firstChar >= 9 && firstChar <= 13)) &&
          (match = ((r=(this.scanNewlines ? r1 : r2)).lastIndex=this.cursor, r.exec(input)))) {
        var spaces = match[0];
        this.cursor = r.lastIndex;
        var newlines = spaces.match(/\n/g);
        if (newlines)
          this.lineno += newlines.length;
      }
      if ((input.charCodeAt(this.cursor) == 47) &&
          (match = (qrComment2.lastIndex=this.cursor, qrComment2.exec(input))) &&
          (match.index == this.cursor)) {
        var comment = match[0];
        this.cursor = qrComment2.lastIndex;
        newlines = comment.match(/\n/g);
        if (newlines)
          this.lineno += newlines.length
      }
      else break;
    }

    this.tokenIndex = (this.tokenIndex + 1) & 3;
    token = this.tokens[this.tokenIndex];
    if (!token) {
      this.tokens[this.tokenIndex] = token = new this.Token();
    }

    if (this.cursor >= input.length)
      return token.type = END;

    var pt = this.cursor;
    var firstChar = input.charCodeAt(pt);

    if ((firstChar == 46 || (firstChar > 47 && firstChar < 58)) && 
        (match = (fpRegExp2.lastIndex=pt, fpRegExp2.exec(input))) &&
        (match.index == pt)){
      token.type = NUMBER;
    } else if ((firstChar > 47 && firstChar < 58) && 
               (match = (qrNumber2.lastIndex=pt, qrNumber2.exec(input))) &&
               (match.index == pt)){
      token.type = NUMBER;
    } else if (((firstChar > 47 && firstChar < 58)  ||
                (firstChar > 64 && firstChar < 91)  ||
                (firstChar > 96 && firstChar < 123) ||
                (firstChar == 36 || firstChar == 95)) &&
               (match = (qrIdentifier2.lastIndex=pt, qrIdentifier2.exec(input))) &&
               (match.index == pt)) {
      var id = match[0];
      token.type = typeof(keywords[id]) == "number" ? keywords[id] : IDENTIFIER;
    } else if ((firstChar == 34 || firstChar == 39) && 
               (match = (qrString2.lastIndex=pt, qrString2.exec(input))) &&
               (match.index == pt)){
      token.type = STRING;
    } else if (this.scanOperand && firstChar == 47 &&
              (match = (qrRegExp2.lastIndex=pt, qrRegExp2.exec(input))) &&
              (match.index == pt)){
      token.type = REGEXP;
    } else if ((match = (opRegExp2.lastIndex=pt, opRegExp2.exec(input))) &&
               (match.index == pt)){
      var op = match[0];
      if (assignOps[op] && input.charAt(opRegExp2.lastIndex) == '=') {
        token.type = ASSIGN;
        token.assignOp = op;
        match[0] += '=';
      } else {
        token.type = opTypeOrder.table[op];  // <- global token name.
        if (this.scanOperand &&
          (token.type == PLUS || token.type == MINUS)) {
          token.type += UNARY_PLUS - PLUS;
        }
        token.assignOp = null;
      }
    } else {
      throw "Illegal token";
    }

    token.start = pt;
    this.cursor += match[0].length;
    token.end = this.cursor;
    token.lineno = this.lineno;
    return token.type;
  }
};

function CompilerContext(inFunction) {
  this.inFunction = inFunction;
  this.stmtStack = [];
  this.funDecls = [];
  this.varDecls = [];
}

var CCp = CompilerContext.prototype;
CCp.bracketLevel = CCp.curlyLevel = CCp.parenLevel = CCp.hookLevel = 0;
CCp.ecmaStrictMode = CCp.inForLoopInit = false;

function Script(t, x) {
  var n = Statements(t, x);
  n.type = SCRIPT;
  n.funDecls = x.funDecls;
  n.varDecls = x.varDecls;
  return n;
}

Array.prototype.top = function () { 
  return this.length && this[this.length-1]; 
}

function Tokener(source) {
  function Token() {
  }
  void function(p) {
    p.type =
    p.start =
    p.end =
    p.lineno = undefined;
    p.value = function(t) {
      return t.substring(this.start, this.end);
    }
  }(Token.prototype);

  return Token;
}

/*
  // 以下指向token而非token.value()
  FUNCTION.name      <-- 函数名, 如果没有该成员则为匿名
  FUNCTION.params    <-- 形式参数表
  LABEL.label        <-- 标签名
  TRY.varName        <-- try块中声明的变量名

  // 以下属性取消不再标识
  BREAK.label
  BREAK.target
  CONTINUE.label
  CONTINUE.target
  HOOK/COLON(?:)assignOp
  VARIANT.name       <-- 变量声明中的变量名, 直接等同于token.value
  VARIANT.readOnly   <-- 变量声明只读，亦即是用CONST声明
  FOR_IN.iterator    <-- for..in中的迭代器
  FOR_IN.varDecl     <-- for..in中的变量声明

  // 以下从值改为取值的函数
  TOKEN.value
  NODE.value
*/
function _node_push(kid) {
  if (this[this.length] = kid)
    ((kid.start<this.start) && (this.start=kid.start),
     (this.end<kid.end) && (this.end=kid.end));
}
function _node_value() {
  return t.substring(this.start, this.end);
}
function Node(t, type) {
  var _this = Array.prototype.slice.call(arguments, 2);

  // _this.constructor = Node;
  _this.push = _node_push;

  var token = t.token();
  if (token) {
    _this.type = type || token.type;
    _this.value = token.value;
    _this.lineno = token.lineno;
    _this.start = token.start;
    _this.end = token.end;
  } else {
    _this.type = type;
    _this.lineno = t.lineno;
    _this.value = _node_value;
  }

  _this.tokenizer = t;
  return _this;
}

function nest(t, x, node, func, end) {
  x.stmtStack.push(node);
  var n = func(t, x);
  x.stmtStack.pop();
  end && t.mustMatch(end);
  return n;
}

function Statements(t, x) {
  var n = Node(t, BLOCK);
  x.stmtStack.push(n);
  while (!t.done() && t.peek() != RIGHT_CURLY) 
    n.push(Statement(t, x));
  x.stmtStack.pop();
  return n;
}

function Block(t, x) {
  t.mustMatch(LEFT_CURLY);
  var n = Statements(t, x);
  t.mustMatch(RIGHT_CURLY);
  return n;
}

var DECLARED_FORM = 0, EXPRESSED_FORM = 1, STATEMENT_FORM = 2;

function Statement(t, x) {
  var i, label, n, n2, ss, tt = t.get();

  // Cases for statements ending in a right curly return early, avoiding the
  // common semicolon insertion magic after this switch.
  switch (tt) {
    case NEWLINE:
    case SEMICOLON:
    n = Node(t, SEMICOLON);
    n.expression = null;
    return n;

    case VAR:
    case CONST:
    n = Variables(t, x);
    break;

    case FUNCTION:
    return FunctionDefinition(t, x, true,
                  (x.stmtStack.length > 1)
                  ? STATEMENT_FORM
                  : DECLARED_FORM);
    case LEFT_CURLY:
    n = Statements(t, x);
    t.mustMatch(RIGHT_CURLY);
    return n;

    case IF:
    n = Node(t);
    n.condition = ParenExpression(t, x);
    x.stmtStack.push(n);
    n.thenPart = Statement(t, x);
    n.elsePart = t.match(ELSE) ? Statement(t, x) : null;
    x.stmtStack.pop();
    return n;

    case SWITCH:
    n = Node(t);
    t.mustMatch(LEFT_PAREN);
    n.discriminant = Expression(t, x);
    t.mustMatch(RIGHT_PAREN);
    n.cases = [];
    n.defaultIndex = -1;
    x.stmtStack.push(n);
    t.mustMatch(LEFT_CURLY);
    while ((tt = t.get()) != RIGHT_CURLY) {
      n2 = Node(t);
      if (tt == DEFAULT)
        n.defaultIndex = n.cases.length;
      else
        n2.caseLabel = Expression(t, x, COLON);
      t.mustMatch(COLON);
      n2.statements = Node(t, BLOCK);
      while ((tt=t.peek()) != CASE && tt != DEFAULT && tt != RIGHT_CURLY)
        n2.statements.push(Statement(t, x));
      n.cases.push(n2);
    }
    x.stmtStack.pop();
    return n;

    case FOR:
    n = Node(t);
    n.isLoop = true;
    t.mustMatch(LEFT_PAREN);
    if ((tt = t.peek()) != SEMICOLON) {
      x.inForLoopInit = true;
      n2 = (tt == VAR || tt == CONST ? (t.get(), Variables(t, x)) : Expression(t, x));
      x.inForLoopInit = false;
    }
    if (n2 && t.match(IN)) {
      n.type = FOR_IN;
/*  skip
      if (n2.type == VAR) {
        // define variant only one in <FOR_IN>
        if (n2.length != 1) {
          throw new SyntaxError("Invalid for..in left-hand side",
                      t.filename, n2.lineno);
        }
        // NB: n2[0].type == IDENTIFIER and n2[0].value == n2[0].name.
        n.iterator = n2[0];
        n.varDecl = n2;
      } else {
        n.iterator = n2;
        n.varDecl = null;
      }
*/
      n.object = Expression(t, x);
    } else {
      n.setup = n2 || null;
      t.mustMatch(SEMICOLON);
      n.condition = (t.peek() == SEMICOLON) ? null : Expression(t, x);
      t.mustMatch(SEMICOLON);
      n.update = (t.peek() == RIGHT_PAREN) ? null : Expression(t, x);
    }
    t.mustMatch(RIGHT_PAREN);
    n.body = nest(t, x, n, Statement);
    return n;

    case WHILE:
    n = Node(t);
    n.isLoop = true;
    n.condition = ParenExpression(t, x);
    n.body = nest(t, x, n, Statement);
    return n;

    case DO:
    n = Node(t);
    n.isLoop = true;
    n.body = nest(t, x, n, Statement, WHILE);
    n.condition = ParenExpression(t, x);
    if (!x.ecmaStrictMode) {
      // <script language="JavaScript"> (without version hints) may need
      // automatic semicolon insertion without a newline after do-while.
      // See http://bugzilla.mozilla.org/show_bug.cgi?id=238945.
      t.match(SEMICOLON);
      return n;
    }
    break;

    case BREAK:
    case CONTINUE:
    n = Node(t);
    if (t.peekOnSameLine() == IDENTIFIER)
      t.get();
    break;

    case RETURN:
    n = Node(t);
    switch (t.peekOnSameLine()) {
      case END: case NEWLINE: case SEMICOLON: case RIGHT_CURLY: break;
      default: n.expression = Expression(t, x);
    }
    break;

    case TRY:
    n = Node(t);
    n.tryBlock = Block(t, x);
    n.catchClauses = [];
    while (t.match(CATCH)) {
      n2 = Node(t);
      t.mustMatch(LEFT_PAREN);
      n2.varName = t.mustMatch(IDENTIFIER);
      n2.guard = t.match(IF) ? Expression(t, x) : null;
      t.mustMatch(RIGHT_PAREN);
      n2.block = Block(t, x);
      n.catchClauses.push(n2);
    }
    if (t.match(FINALLY))
      n.finallyBlock = Block(t, x);
    return n;

    case CATCH:
    case FINALLY:
    break;

    case THROW:
    n = Node(t);
    n.exception = Expression(t, x);
    break;

    case WITH:
    n = Node(t);
    n.object = ParenExpression(t, x);
    n.body = nest(t, x, n, Statement);
    return n;

    case DEBUGGER:
    n = Node(t);
    break;

    default:
      if (tt == IDENTIFIER) {
      t.scanOperand = false;
      tt = t.peek();
      t.scanOperand = true;
      if (tt == COLON) {
        label = t.token();
        t.get();
        n = Node(t, LABEL);
        n.label = label;
        n.statement = nest(t, x, n, Statement);
        return n;
      }
    }
    n = Node(t, SEMICOLON);
    t.unget();
    n.expression = Expression(t, x);
    n.end = n.expression.end;
    break;
  }

  if (t.lineno == t.token().lineno) {
    tt = t.peekOnSameLine();
/* skip
    if (tt != END && tt != NEWLINE && tt != SEMICOLON && tt != RIGHT_CURLY)
      throw t.newSyntaxError("Missing ; before statement " + tokens[tt]);
*/
  }
  t.match(SEMICOLON);
  return n;
}

function FunctionDefinition(t, x, requireName, functionForm) {
  var tt, f = Node(t);
/* skip!
  if (f.type != FUNCTION)
    f.type = (f.value() == "get") ? GETTER : SETTER;
*/
  if (t.match(IDENTIFIER))
    f.name = t.token();

  t.mustMatch(LEFT_PAREN);
  f.params = [];
  while (t.get() != RIGHT_PAREN) {
    f.params.push(t.token());
    if (t.peek() != RIGHT_PAREN)
      t.mustMatch(COMMA);
  }
  t.mustMatch(LEFT_CURLY);

  var x2 = new CompilerContext(true);
  f.body = Script(t, x2);
  t.mustMatch(RIGHT_CURLY);
  f.end = t.token().end;

  f.functionForm = functionForm;
  if (functionForm == DECLARED_FORM)
    x.funDecls.push(f);
  return f;
}

function Variables(t, x) {
  var n = Node(t);
  do {
    t.mustMatch(IDENTIFIER);
    var n2 = Node(t);
    if (t.match(ASSIGN)) {
      n2.initializer = Expression(t, x, COMMA);
    }
/* skip
    n2.readOnly = (n.type == CONST);
*/
    n.push(n2);
    x.varDecls.push(n2);
  } while (t.match(COMMA));
  return n;
}

function ParenExpression(t, x) {
  t.mustMatch(LEFT_PAREN);
  var n = Expression(t, x);
  t.mustMatch(RIGHT_PAREN);
  return n;
}

function Expression(t, x, stop) {
  var n, id, tt, operators = [], operands = [];
  var bl = x.bracketLevel, cl = x.curlyLevel, pl = x.parenLevel, hl = x.hookLevel;

  function reduce() {
    var n = operators.pop();
    var op = n.type;
    var arity = opArity[op];
    if (arity == -2) {
      // Flatten left-associative trees.
      var left = operands.length >= 2 && operands[operands.length-2];
      if (left.type == op) {
        left.push(operands.pop());
        return left;
      }
      arity = 2;
    }

    var index = operands.length - arity;
    var a = operands.splice(index, operands.length - index);
    for (var i = 0; i < arity; i++)
      n.push(a[i]);

    if (n.end < t.token().end)
      n.end = t.token().end;

    operands.push(n);
    return n;
  }

loop:
  while ((tt = t.get()) != END) {
    if (tt == stop &&
      x.bracketLevel == bl && x.curlyLevel == cl && x.parenLevel == pl &&
      x.hookLevel == hl) {
      break;
    }
    switch (tt) {
      case SEMICOLON:
      // NB: cannot be empty, Statement handled that.
      break loop;

      case ASSIGN:
      case HOOK:
      case COLON:
        if (t.scanOperand)
          break loop;
        // Use >, not >=, for right-associative ASSIGN and HOOK/COLON.
        while (opPrecedence[operators.top().type] > opPrecedence[tt] ||
               (tt == COLON && operators.top().type == ASSIGN)) reduce();
        if (tt == COLON) {
          n = operators.top();
          n.type = CONDITIONAL;
          --x.hookLevel;
        } else {
          operators.push(Node(t));
          if (tt != ASSIGN )
            ++x.hookLevel;
        }
        t.scanOperand = true;
      break;

      case IN:
      // An in operator should not be parsed if we're parsing the head of
      // a for (...) loop, unless it is in the then part of a conditional
      // expression, or parenthesized somehow.
      if (x.inForLoopInit && !x.hookLevel &&
        !x.bracketLevel && !x.curlyLevel && !x.parenLevel) {
        break loop;
      }
      // FALL THROUGH
      case COMMA:
      // Treat comma as left-associative so reduce can fold left-heavy
      // COMMA trees into a single array.
      // FALL THROUGH
      case OR:
      case AND:
      case BITWISE_OR:
      case BITWISE_XOR:
      case BITWISE_AND:
      case EQ: case NE: case STRICT_EQ: case STRICT_NE:
      case LT: case LE: case GE: case GT:
      case INSTANCEOF:
      case LSH: case RSH: case URSH:
      case PLUS: case MINUS:
      case MUL: case DIV: case MOD:
      case DOT:
      if (t.scanOperand)
        break loop;
      while (opPrecedence[operators.top().type] >= opPrecedence[tt])
        reduce();
      if (tt == DOT) {
        t.mustMatch(IDENTIFIER);
        operands.push(Node(t, DOT, operands.pop(), Node(t)));
      } else {
        operators.push(Node(t));
        t.scanOperand = true;
      }
      break;

      case DELETE: case VOID: case TYPEOF:
      case NOT: case BITWISE_NOT: case UNARY_PLUS: case UNARY_MINUS:
      case NEW:
      if (!t.scanOperand)
        break loop;
      operators.push(Node(t));
      break;

      case INCREMENT: case DECREMENT:
      if (t.scanOperand) {
        operators.push(Node(t));  // prefix increment or decrement
      } else {
        // Use >, not >=, so postfix has higher precedence than prefix.
        while (opPrecedence[operators.top().type] > opPrecedence[tt])
          reduce();
        n = Node(t, tt, operands.pop());
        n.postfix = true;
        operands.push(n);
      }
      break;

      case FUNCTION:
      if (!t.scanOperand)
        break loop;
      operands.push(FunctionDefinition(t, x, false, EXPRESSED_FORM));
      t.scanOperand = false;
      break;

      case NULL: case THIS: case TRUE: case FALSE:
      case IDENTIFIER: case NUMBER: case STRING: case REGEXP:
      if (!t.scanOperand)
        break loop;
      operands.push(Node(t));
      t.scanOperand = false;
      break;

      case LEFT_BRACKET:
      if (t.scanOperand) {
        // Array initialiser.  Parse using recursive descent, as the
        // sub-grammar here is not an operator grammar.
        n = Node(t, ARRAY_INIT);
        while ((tt = t.peek()) != RIGHT_BRACKET) {
          if (tt == COMMA) {
            t.get();
            n.push(null);
            continue;
          }
          n.push(Expression(t, x, COMMA));
          if (!t.match(COMMA))
            break;
        }
        t.mustMatch(RIGHT_BRACKET);
        operands.push(n);
        t.scanOperand = false;
      } else {
        // Property indexing operator.
        operators.push(Node(t, INDEX));
        t.scanOperand = true;
        ++x.bracketLevel;
      }
      break;

      case RIGHT_BRACKET:
      if (t.scanOperand || x.bracketLevel == bl)
        break loop;
      while (reduce().type != INDEX)
        continue;
      --x.bracketLevel;
      break;

      case LEFT_CURLY:
      if (!t.scanOperand)
        break loop;
      // Object initialiser.  As for array initialisers (see above),
      // parse using recursive descent.
      ++x.curlyLevel;
      n = Node(t, OBJECT_INIT);
      object_init:
      if (!t.match(RIGHT_CURLY)) {
        do {
          tt = t.get();
/* skip
          if ((t.token().value() == "get" || t.token().value() == "set") &&
            t.peek() == IDENTIFIER) {
            if (x.ecmaStrictMode)
              throw t.newSyntaxError("Illegal property accessor");
            n.push(FunctionDefinition(t, x, true, EXPRESSED_FORM));
          } else { ...
*/
          switch (tt) {
          case IDENTIFIER:
          case NUMBER:
          case STRING: id = Node(t); break;
/* skip
          case RIGHT_CURLY:
            if (x.ecmaStrictMode) throw t.newSyntaxError("Illegal trailing ,");
            break object_init;
          default:
            throw t.newSyntaxError("Invalid property name");
*/
          }
          t.mustMatch(COLON);
          n.push(Node(t, PROPERTY_INIT, id, Expression(t, x, COMMA)));
        } while (t.match(COMMA));
        t.mustMatch(RIGHT_CURLY);
      }
      operands.push(n);
      t.scanOperand = false;
      --x.curlyLevel;
      break;

      case RIGHT_CURLY:
      if (!t.scanOperand && x.curlyLevel != cl) throw "PANIC: right curly botch";
      break loop;

/* none yield
      case YIELDING:
      while (opPrecedence[operators.top().type] > opPrecedence[YIELDING])
        reduce();
      t.mustMatch(LEFT_PAREN);
      var yielding = true;
      // FALL THROUGH
*/
      case LEFT_PAREN:
      if (t.scanOperand) {
        operators.push(Node(t, GROUP));
      } else {
        while (opPrecedence[operators.top().type] > opPrecedence[NEW])
          reduce();

        // Handle () now, to regularize the n-ary case for n > 0.
        // We must set scanOperand in case there are arguments and
        // the first one is a regexp or unary+/-.
        n = operators.top();
        t.scanOperand = true;
        if (t.match(RIGHT_PAREN)) {
          if (n.type == NEW) {
            --operators.length;
            n.push(operands.pop());
          } else {
            n = Node(t, CALL, operands.pop(), Node(t, LIST));
          }
          operands.push(n);
          t.scanOperand = false;
/* none yield
          n.yieldOp = yielding || false;
*/
          break;
        }
        if (n.type == NEW) {
          n.type = NEW_WITH_ARGS;
        } else {
          n = Node(t, CALL);
          operators.push(n);
        }
/* none yield
        n.yieldOp = yielding || false;
*/
      }
      ++x.parenLevel;
      break;

      case RIGHT_PAREN:
      if (t.scanOperand || x.parenLevel == pl)
        break loop;
      while ((tt = reduce().type) != GROUP && tt != CALL &&
          tt != NEW_WITH_ARGS) {
        continue;
      }
      if (tt != GROUP) {
        n = operands.top();
        if (n[1].type != COMMA)
          n[1] = Node(t, LIST, n[1]);
        else
          n[1].type = LIST;
      }
      --x.parenLevel;
      break;

      default:
      break loop;
    }
  }
  if (t.scanOperand ||
      (x.hookLevel != hl) ||
      (x.parenLevel != pl) ||
      (x.bracketLevel != bl)) throw "Missing somethings.";

  // Resume default mode, scanning for operands, not operators.
  t.scanOperand = true;
  t.unget();
  while (operators.length)
    reduce();
  return operands.pop();
}

// params: contextString, fileName, lineNo
function parse(s, f, l) {
  var t = new Tokenizer(s, f, l);
  var x = new CompilerContext(false);
  var n = Script(t, x);
  if (!t.done()) throw "Syntax error";
  return n;
}