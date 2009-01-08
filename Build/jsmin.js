// (c)2002 Douglas Crockford
// fixed for Qomo project by aimingoo.

function jsmin(input,level,callback,sleep){var a=b='',theLookahead=EOF=-1;var LETTERS='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';var DIGITS='0123456789',ALNUM=LETTERS+DIGITS+'_$\\';var cb=callback;var slp=sleep?sleep:50;var kbStep=10;function isAlphanum(c){return c!=EOF&&(ALNUM.indexOf(c)>-1||c.charCodeAt(0)>126);}
var get_i=0;var get_l=input.length;var max_i=kbStep*1024;function get(){var c=theLookahead;if(get_i==get_l)return EOF;theLookahead=EOF;if(c==EOF){c=input.charAt(get_i);++get_i;}
if(c>=' '||c=='\n')return c;if(c=='\r')return'\n';return' ';}
function peek(){return theLookahead=get();}
function next(){var c=get();if(c=='/'){switch(peek()){case'/':while(true)
if((c=get())<='\n')return c;case'*':get();while(true){switch(get()){case'*':if(peek()=='/')return get(),' ';break;case EOF:throw'Error: Unterminated comment.';}}
default:return c;}}
return c;}
function action(d){var r=[];if(d==1)r.push(a);if(d<3){a=b;if(a=='\''||a=='"'){while(true){r.push(a);a=get();if(a==b)break;if(a<='\n'){throw'Error: unterminated string literal: '+a;}
if(a=='\\'){r.push(a);a=get();}}}}
b=next();if(b=='/'&&'(,=:[!&|'.indexOf(a)>-1){r.push(a);r.push(b);while(true){a=get();if(a=='/')break;if(a=='\\'){r.push(a);a=get();}
else if(a<='\n'){throw'Error: unterminated Regular Expression literal';}
r.push(a);}
b=next();}
return r.join('');}
var result=[];function m(){while(a!=EOF){if(cb&&(get_i>=max_i)){max_i=(parseInt(max_i/1024)+kbStep)*1024;setTimeout(m,slp);return;}
if(a==' '){result.push(action(isAlphanum(b)?1:2));}
else if(a=='\n'){result.push(action(('{[(+-'.indexOf(b)>-1)?1:(b==' ')?3:(isAlphanum(b)||(level==1&&b!='\n'))?1:2));}
else{if(b==' '){result.push(action(isAlphanum(a)?1:3));}
else if(b=='\n'){result.push(action((level==1&&a!='\n')?1:('}])+-"\''.indexOf(a)>-1)?(level==3?3:1):isAlphanum(a)?1:3));}
else
result.push(action(1));}}
if(cb){cb(result.join(''));}
else{return result.join('');}}
var ret=m(input);return ret;}