## Qomo Quick Guide ##
I found that every successful language, no matter how complex or difficult it is, always have a quick start guide. The other way round, unsuccessful languages are always coming with documents that are too technical, or filled with imaginations and expections. Even longer than the code itself, but still fail to save the language from failure.

And then, I recognized that the Qomo is in the latter way. I realized that there are a large amount of things beyond users’ understanding in the documents previously released. Maybe these documents and the codes will give you a lot of enlightenment if you set about writing a language. If you just intend to use Qomo, perhaps these would be bothered. However, if someone sets about writing a language, he would probably not lean Qomo, because there should be differences in design objectives.

Thus, I considered that Qomo group are supposed to write something for” a normal user”. Take an example as this article.

### Load Qomo ###
Though we planed to add a custom loader, which can load the other parts of Qomo, for various host environment of JavaScript in the future. Qumo is primarily used in web browsers until now, so its loading code is:

```
<!-- in test.html -->

<script src="js/Qomo.js"></script>

```
In this example, we supposed that the files in your site are organized as:

```
<your_site>\test.html

<your_site>\js\Qomo.js

```
You can put files of Qomo in 

&lt;js&gt;

 directory. Its structure should be like this:

```
<your_site>\js\Build\*.*

<your_site>\js\Components\*.*

<your_site>\js\Framework\*.*

<your_site>\js\Qomo.js

```
Or you can use an encoded version(compressed and obfuscated). It will be a single file.

### Create a Class and its instance. ###
Qomo mainly extends an object oriented syntax. The easiest way is always include a function as a “class register”. For example:

```
// 1. release a constructor

function MyObject() {

  // ..

}

// 2. class registration(to register this class, TMyObject)

TMyObject = Class(TObject, 'MyObject');

// 3. Two different ways to create an instance (the effects should be same)

obj1 = new MyObject();

obj2 = TMyObject.Create();

```
Here TObject is root-class in the class inheritance of Qomo. If you want to construct in-depth class, the first argument of Class() can be TMyObject, or other classes that can be recognized by Qomo.

### If you want to add some private attributes to objects. ###
If you want to do so, you came to the right place. Qomo is designed for “privacy” and “hiding” in the beginning. You can do this by just modifying the constructor in the previous codes.

```
// constructor

function MyObject() {

  Attribute(this, 'Name', 'MyObject', 'r');

  Attribute(this, 'Size', 100);

}

// class

TMyObject = Class(TObject, 'MyObject');

// instance

obj1 = new MyObject();

obj2 = new MyObject();

// the two instances’ private attributes are different

obj1.set('Size', 20);

alert(obj1.get('Size'));  // 20

alert(obj2.get('Size'));  // 100

```


### Let Qomo become more useful in web page. ###
For web client developers, they only care about how expediently use Qomo in web page, but not how construct classes and sub-class above. In most cases, that’s really so.

To be simple, we are now going to access something on document in web page as an element which is signed by ID. This is convenient in Qomo.

```
<!-- demo.html -->

<script src="js/Qomo.js"></script>

<body>

  <input id="pwd" value="my password in here">

</body>

<script>

// (*note)

// $import('Components/Components.js');

el = THtmlController.Create('pwd');

alert(el.get('value'));

</script>

```
(**Annotation)Default kernal library hasn't contain Components.js before version 2.1. In this case you need use $import() to load Components. The version you use now has contain Components.js. In every case, you can redistribute an intergrated build of Qomo  by yourself. You need use <Build\TestCase\T\_CustomBuilder.html> from Qomo package, to create the Qomo code package you want to have. Reminder: Please remember choose 'loading extended interface control'.**

This example illustrated that you can add a THtmlController control on any HTML elements, which encapsulate some detail of HTML element on the interface. If you need access original HTML element, you can use el.get().

### Make a Html control using Qomo ###
Additionally, you can encapsulate a set of elements of UI into a Qomo class. The class would detect the set that is a control or else. For a simple example, we can put a 

&lt;DIV&gt;

 and a 

&lt;INPUT type=text&gt;

 together, and made them become a TLabledEdit. This is a good idea:

```
<script src="js/Qomo.js"></script>

<body>

  <div id="edLabled"><span>hello, TLabledEdit.</span><br>
    <input name="edit" value="...">

  </div>

</body>

<script>

  // Codes will be discussed then

  // ……

</script>

```
what we should do to implement it as a Html control,? First of all, we must accurately find all of elements that need control. Here’s a basic framework :

```
function LabledEdit() {

  Attribute(this, '_label', null, 'r');

  Attribute(this, '_edit', null, 'r');

  this.get_label = function() {

    return this.assignedElement.children(0);

  }

  this.get_edit = function() {

    return this.assignedElement.children('edit');

  }

  // .. Other codes

}

```
Next, we try to add some attributes for this control and handle UI:

```
function LabledEdit() {

  // (omitted, ibid...)

  this.getLableText = function() {

    return this.get('_label').innerText;

  }

  this.setLableText = function(v) {

    this.get('_label').innerText = v;

  }

  this.getvalue =

  this.getValue = function() {

    return this.get('_edit').value;

  }

  this.setvalue =

  this.setValue = function(v) {

    this.get('_edit').value = v;

  }

}

```


And then register it:

```
TLabledEdit = Class(THtmlController, 'LabledEdit');

```
Let's see the effect:

```
var ed = TLabledEdit.Create('edLabled');

alert( ed.get('LableText') );

ed.set('LableText', 'my lable:');

ed.set('Value', 'hello, world.');

```


### Is it worth to make a component so troublesomely? ###
What is the meaning making a component so troublesomely? We can directly use couple lines of script like this, if we only need "HTML blocks look like components":

```
document.getElementById('edLabled').children(2).value = 'hello, world.';

// ...

```
However, real value of this component architecture is reuse, just like the value of class inheritance. There are no points if we discuss out of reuse. Imagine we need an editor labeled with FieldSet, what can we do? More Editor?

OK, we making a case in Qomo, based on foregoing TLabledEdit code.

```
<body>

  <fieldset id="edLabled2">

    <legend>input:</legend>

    <input name="edit" value="...">

  </fieldset>

</body>

<script>

function FieldSetEdit() {

}

TFieldSetEdit = Class(TLabledEdit, 'FieldSetEdit');

// for example

var ed = TFieldSetEdit.Create('edLabled2');

ed.set('Value', 'hello, world.');

</script>

```
Really?! FieldSetEdit is implemented without any code?!

Yes. In spite of differences in statement between the two components, we decomposed logical implementation and the interface. so we just need few adjusts (even needn't change).

Oh, able man can saw it that I was taking a little idleness: edLabled2's “HTML layout” here is not different than the foregoing one in deed. OK, we’ll do it in a more difficult way to let you believe that Qomo have a "saving code" capability.


<font size='5'>'''7. Reuse a Concol component in other framework libraries'''</font>

We’ll need a more complex Editor, for example, the Editor from YahooUI which can auto-complete. Maybe we need to load YahooUI and initialize it at first, then we can load our code. OK, such as this:

```
<!-- load yui -->

<link rel="stylesheet" type="text/css" href="yui/build/fonts/fonts-min.css" />

<link rel="stylesheet" type="text/css" href="yui/build/autocomplete/assets/skins/sam/autocomplete.css" />

<script type="text/javascript" src="yui/build/yahoo-dom-event/yahoo-dom-event.js"></script>

<script type="text/javascript" src="yui/build/animation/animation-min.js"></script>

<script type="text/javascript" src="yui/build/datasource/datasource-min.js"></script>

<script type="text/javascript" src="yui/build/autocomplete/autocomplete-min.js"></script>

<!-- yui component, code copy from yui examples -->

<body class="yui-skin-sam">

  <h3>Enter a state:</h3>

  <div id="myAutoComplete">

    <input id="myInput" type="text">

    <div id="myContainer"></div>

  </div>

<script type="text/javascript">

YAHOO.example.Data = {

arrayStates: [

    "Alabama",

    "Alaska",

    "Arizona",

    "Arkansas",

    "California",

    "Colorado",

    "Connecticut"]

};

YAHOO.example.BasicLocal = function() {

    // Use a LocalDataSource

    var oDS = new YAHOO.util.LocalDataSource(YAHOO.example.Data.arrayStates);

    // Optional to define fields for single-dimensional array

    oDS.responseSchema = {fields : ["state"]};

    // Instantiate the AutoComplete

    var oAC = new YAHOO.widget.AutoComplete("myInput", "myContainer", oDS);

    oAC.prehighlightClassName = "yui-ac-prehighlight";

    oAC.useShadow = true;

    return {

        oDS: oDS,

        oAC: oAC

    };

}();

</script>

</body>

<!-- end of yui load -->

```
OH! All of these codes belongs to Yahoo UI. Qomo would do some simple thing:

```
<!—example continue -->

<!-- load qomo -->

<script src="js/Qomo.js"></script>

<!-- ours component and demo -->

<script>

function LabledEdit() {

  // (ibid., omitted...)

}

TLabledEdit = Class(THtmlController, 'LabledEdit');

// new TYuiEdit component

YuiEdit = function() {

  this.get_label = function() {

    return this.assignedElement.previousSibling;

  }

  this.get_edit = function() {

    return this.assignedElement.children.tags('input')(0);

  }

}

TYuiEdit = Class(TLabledEdit, 'YuiEdit');

// show case

var ed = TYuiEdit.Create('myAutoComplete');

alert(ed.get('LableText'));

ed.set('Value', 'hello, world.');

```


Our example code, the logic of application, hasn't changed compared to the previous TLabledEdit's example. But we had used a complex, and nice in my opinion, Yahoo UI component.

### construct in-depth level classes ###
As foregoing example, we probably use in-depth inheritance classes in JavaScript. If we use JavaScript’s default method to implement, we would be in  trouble when we call parent-class’ method. But in Qomo, a call of extended method inherited() of parent-class made the work simple.

```
//constructor

function MyObject() {

  Attribute(this, 'Size', 100);

}

function MyObjectEx() {

  this.getSize = function() {

    return 2 * this.get(); // <- call default or parent-class' method in get/setter

  }

  this.aMethod = function() {

    alert('hi, in MyObjectEx');

  }

}

function PowerObject() {

  this.aMethod = function() {

    this.inherited();   // <- call parent-class in method

    alert('hi, in PowerObject');

  }

}

// class register

TMyObject = Class(TObject, 'MyObject');

TMyObjectEx = Class(TMyObject, 'MyObjectEx');

TPowerObject = Class(TMyObjectEx, 'PowerObject');

// example

obj = new MyObjectEx();

pw = new PowerObject();

alert( obj.get('Size') );

pw.aMethod();

```


### I need Ajax! ###
I knew that a lot of people need Ajax, Of course, there are quite a number of people didn’t know why they need. Actually Ajax within Qomo is easy enough to use.

```
ajx = new Ajax();

ajx.open("GET", 'http://www.sina.com.cn/', false);

ajx.send(null);

text = ajx.responseText;

alert('the page size is:'  +  text.length);

```


The truth is, so many people realized only a simple wrap for XMLHttpRequest. They just understand that how to use a function to handle ajx.onreadystatechange, and use 'POST' method in Ajax to get remote data. So I’m not going to talk about this matter. Next we’ll discuss a more useful wrap in Qomo: Ajax pool.

In fact its real name is HttpGetMachine. We look at the case without using Ajax first:

```
function doAction(url, ctx) {

  alert( 'Url: %s \nLength: %s'.format(url, ctx.length));

}

function doStateChange(state) {

  if (state != 4) return;  // wait until downloaded.

  var ajx = this.get('XMLHTTP');

  if (ajx.status!=200 && ajx.status!=304 && ajx.status!=0) return;  // status is failed.

  doAction(this.data.src, ajx.responseText);

}

// test case, without Ajax pool.

var ajx = new HttpGetMachine();

ajx.OnStateChange.add(doStateChange);

ajx.data = { src: 'http://www.sina.com.cn/' };

ajx.OnStateChange('resume');

```
It isn’t complex to use Ajax pool:

```
<!—output messages in page -->

<body>

<textarea id="txt" style="width:800px; height:600px"></textarea>

</body>

<script>

function doAction(ord, url, ctx) {

  var txt = document.getElementById('txt');

  var str = 'machie(%s) to process a url\n\

   - Url: %s \n\

   - Length: %s \n\n';

  txt.value += str.format(ord, url, ctx.length);

}

function doStateChange(state) {

  if (state != 4) return;  // wait downloaded.

  with (this.get('XMLHTTP')) {

   switch (status) {

     case 200:

     case 304:

     case 0:

       doAction(this.id, this.data.src, responseText); break;

     default:

       // status is failed.

       alert('failed: ' + status)

    }

  }

}

// processes function for pool. the ID only identifiy 'mac' order, it's mustn't.

var id = 1;

function doOnStateChange_pool(mac, state) {

  if (!mac.id) mac.id = id++; // make a sign for 'mac'

  doStateChange.call(mac, state);

}

// pool manager – create (machine instance no more than three), and push data

var pool = new Pool(THttpGetMachine, 3);

pool.OnStateChange.add(doOnStateChange_pool);

pool.push( { src: 'http://www.sina.com.cn/' } );

pool.push( { src: 'http://www.snda.com.cn/' } );

pool.push( { src: 'http://www.tom.com/' } );

pool.push( { src: 'http://www.google.com/' } );

// more...

</script>

```
Actually Ajax pool is helping for user to manage creation and scheduling of ThttpGetMachine. The pool will decide when to send data to specific machine and how the state of data is handled.

### 0.Others ###
Qomo V2.1 had removed all of LocalDB and Graphi from code package. We’ll rewrite it. This work will be come soon. Merely from the complex, V2.1 had a nice start, for this we had even removed most of Controls.

Qomo V2.x has a parallel project named QoBean. At present, QoBean didn’t release a version for mass usage yet, but it had a good performance: QoBean has about 30% less code than Qomo, but its speed increase 30~40%. This version will be incorporated into Qomo V3, replacing the existing Qomo kernel.

Qomo also came with some little tools, such as <Common\ParserLite.js> and TimeMachine.js (it's not the Time Machine).

Other tools use for performance testing, such as
<Debug\TestCase\RegExpPerformanceTool.html>

Of course, build tools located under root directory and a simple example <Samples.html>,  are very important.

In the FF3, you must use Samples.html at root directory to launch other demos, by which I mean, you can’t directly open the demos from your hard disk, as FF3 had adjusted local files’ security setting for Ajax.

In the Qomo, object system has more complex usage, such as interface register and aspect system. The examples of advanced usages can be found inside Qomo’s code package, or by searching associated document in my blog.

**download released package:**

http://groups.google.com/group/qomo/files

**Qomo OpenProject at google code:**

http://code.google.com/p/qomo/

**Qomo and QoBean new code:**

http://qomo.googlecode.com/svn/trunk/

http://qomo.googlecode.com/svn/qobean/