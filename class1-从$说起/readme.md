# 第一课：从$开始说起
## 啰嗦的前言
刚开始接触JQ的同学肯定第一感觉是：
**-哇，真神奇，怎么写代码那么方便？**

JQ作为很多人的第一个类库（或者说框架），给新手的冲击力是难以言喻的，但是慢慢熟悉之后也会对JQ有一些疑问：

-Q：JQ是一门专门的语言吗，为什么语法如此独特？
+A：当然不是，JQ是一个js的包装，前端的三板斧只有HTML+CSS+JS，本系列就是要揭开JQ“神秘的面纱”。

-Q：JQ的选择器为什么class选择器不用使用for循环遍历操作？
+A：这正是JQ的高明之处，他为我们完成很多的封装，最终对于我们的使用来说是非常方便的。

-Q：JQ怎么样才算精通？
+A：对于大部分初学者来说，是接触了原生的JS后再接触JQ的，在阅读了网上一些不错的教程之后，对JQ也有了一个初步的理解，也能使用JQ制作一些不错的效果。但是对于一个高级开发人员来说，仅仅使用是不够的，了解原理，才能让库更为我们所用，也可以去“魔改”。

## 从最基础的语句说起
在JQ中，最基础的语句应该是这样的：

```
html：
<div class="d1"></div>
js：
$('.d1').remove();
\\ 这个代码的含义是删除dom中class="d1"的元素
```

我们简单阅读一下一个语句，在最通俗的角度：
$('.d1')   => 选中页面中全部的class为d1的元素
.remove() => 调用remove方法，操作选中的元素，这里为class为d1的元素

这个代码非常简单吧？在demo1.html中，你可以在chrome打开后在调试台尝试输入这一行代码，删除页面中类为d1的元素。

## 那么问题开始了：$是什么？
问题的答案其实很简单，$就是一个函数名，你可以用这样的方式去理解：
```
var $ = function(){}
```
而神奇的选择器语法是什么呢？
```
$('.d1')
\\调用函数$,传入字符串参数".d1"
```
可能有的人看到这儿就懂了什么意思，但是我们还是做一个简单的分析。
在JS中，有几种基础的数据类型：

字符串|数字|函数|对象|其他
:----:|:----:|:----:|:----:|:----:
String|Number|Function|Object|undefined...

这是什么意思呢？就是说在JS中，任何你能写的东西，能调用的变量都离不开这几种类型，包括JQ（因为JQ就是JS嘛）。
所以以上我们就可以**定义一个*函数*，函数名为$，接受一个*字符串* 参数**。
当然，在JQ中，还有一种方式：
```
$(this)
```
这种方式以后再讨论，现在我们探讨下一个问题。
<<<<<<< HEAD

<<<<<<< HEAD
## 点语法、链式语法  
   
=======
## 点语法、链式语法
>>>>>>> 6aa5f42eedc6d98b34e2cd4965a0b303262135ab
=======
## 点语法、链式语法

>>>>>>> parent of e82958b... a
在JQ中，有个很显著的特点是什么呢？
就是JQ可以用这样的方式操作DOM：
```
$('.d1').css('color','red').on('click',function(){
	alert('why you tm click me?');
})
//含义：为.d1设置css，然后挂载事件。
//如果你没有写错的话，那么你能看到d1的字体颜色变为了红色，并且点击后可以弹出一个窗口。
```

这个语句包含了两个东西：点语法和链式语法。
这样的语法当然是高明且方便的，我们可以先探讨一个这样的语法的原理。
1. 点语法在JS中是对象这个类型使用的
2. 链式语法是点语法的延伸，基于函数的返回值。

OK，听不懂没关系，我们复习一下JS的对象类型。
```
var xiaoming = {
	age : 60,
    info : "是中国教育中难以磨灭的一笔",
    say : function(){
    	console.log('年轻人不要听风就是雨');
    },
    sayAge : function(){
    	console.log("我都已经" , this.age , "岁啦！");
    }
}
//调用小明的info属性
xiaoming.info
//结果：一个字符串（String）"是中国教育中难以磨灭的一笔"

//调用小明的say方法
xiaoming.say()
//结果：控制台输出了一个字符串（String）：'年轻人不要听风就是雨'

//调用小明的sayAge方法
xiaoming.sayAge()
//结果：输出字符串（String）：'我都已经60岁了'
```

这就是对象的点语法。我们发现了一些有意思的事情：**在JS的对象的方法中，我们使用this表示这个对象本身**
就是说：
```
//在xiaoming对象内部：
var xiaoming = {
	f : function(){
    	cosole.log(this == xiaoming);
    }
}

xiaoming.f()  =>	控制台输出： true
```
这个知识点可以先记住，我们要考虑下一个问题：函数的返回值。
在JS中，函数是必须有一个返回值的，如果未指定，返回值则为undefined
就像上面的例子：
```
xiaoming.f()  => undefined
//注意返回值和控制台输出的区别
```
我们思考如下的代码：
```
var xiaoming = {
	f : function(){
    	return {name : '123'};
    }
}

//运行一下：
xiaoming.f();    =>  返回了一个对象：{name : '123'}
//然后结合对象的点语法：
xiaoming.f().name;   => "123"
```

是不是发现了一些有意思的东西？
**如果一个函数的返回值是对象，那么我们可以继续使用点语法访问对象的属性或者方法。**

如果你看懂这个了，那么JQ你已经入门了。
如果不理解，我们再看一个例子：
首先，你要知道字符串类型一个简单的方法：
>indexOf：传入字符串参数，返回在原始字符串中第一次出现的位置
>
`
var str = "hello world!";
`
`
str.indexOf("wo");     =>  6
`

那么如果一个函数返回值是字符串呢？
```
var xiaoming = {
	f : function(){
    	return "hello world!";
    }
}

//运行一下：
xiaoming.f()      =>   "hello world!"

//所以
//xiaoming.f().indexOf("wo")
//等价于
//("hello world").indexOf("wo")
```
这就是链式语法和点语法的基础：JS对象和函数返回值。
## 开始代码吧！
我们再回到第一个JQ语句：
```
$('.d1').remove();
```
经过前面的解读，我们可以用更清晰的语言去描述这段代码了。
1. $('.d1')调用$函数，传入字符串参数'.d1'
2. 这个函数返回一个**对象**，这个对象包含了remove方法，也就是说：
	>$('.d1') => return {remove : function(){}}
3. 这个方法作用于'.d1'本身

我们现在的目标呢，是开始实现这个最基本的逻辑框架：
```
var $ = function(selector){
	return {remove : function(){}};
}
```
当然，这个代码是没有什么卵用的，因为我们选择器根本没有实现，嘻嘻

为啥不实现选择器呢？因为我们还要理清一个逻辑。

## 构造器和面向对象
在JS中，没有类的概念，所以面向对象都是基于构造器和原型链实现的。
构造器是什么用呢？构造器的作用就是构造一个对象，你可以这么理解：
```
//构造器：
var Animal = function(type,age){
	this.type = type;
    this.age = age;
}

var dahuang = new Animal('dog',30);

dahuang = {
	type : 'dog',
    age : 30
}

```
用函数也可以很low地实现这个过程，以下代码只是示范，告诉你构造器是怎么回事，实际上别这么写，写了也说在我这学的：
```
//函数
var animal = function(type,age){
	var obj = {};
    obj.type = type;
    obj.age = age;
    return obj;
}

//既然不是构造器，那么也不能用new语法啦。
var dahei = animal('dog',10);

dahei = {
	type : 'dog',
    age : 10
}
```

对比构造器和函数，你应该可以理解构造器的作用了。
1. 构造器在new之后返回一个对象
2. 构造器不需要return，因为本来就相当于return了一个对象
3. 构造器关键字中的this表示**即将要产生的对象**
4. 所以this.age 表示将要产生的对象的age属性

## 带着构造器回到JQ
为什么折回来讲了一堆构造器呢？因为在实际实现中，我们要使用它。
还记得我们的主体逻辑吗？
```
var $ = function(selector){
	return {remove : function(){}};
}
```
这里return了一个对象，而构造器是用于产生对象的。那么：
```
var init = function(selector){
	//将要实现点啥
}
var $ = function(selector){
	return new init(selector);
}
```
我们将构建对象的过程单独提出来，用init函数构建对象，然后返回。
## 下一步：实现选择器
我们终于可以开始实现我们的JQ啦！前面准备了很多的知识，但是相信我，都能用得上。
我们要实现三个选择器，因为我们目前的任务是实现JQ的结构，以后其他选择器的实现可以自行去添砖加瓦。
1. class选择器
2. id选择器
3. 标签选择器


因为selector参数在$函数中传递到了init函数，所以我们接下来实现init函数。
我们理一下我们的目标：
1. JQ选择器是一个类CSS选择器：
2. .d1表示选择 class="d1"的元素
3. \#d1表示选择 id="d1"的元素
4. div表示选择页面中全部的div标签

那我们怎么判断呢？其实很简单，我们通过对传入的字符串的第一位进行判断，就可以知道要使用什么选择器。
exp:
1. $('.d1')
2. selector => '.d1'
3. selector[0] => '.'
4. class选择器
所以我们可以实现一下这个思路

```
var init = function(selector){
	var firstChar = selector[0];    //获取首字符
    if(firstChar == '.'){}          //将要实现class选择器
    else if(firstChar == '#'){}     //将要实现id选择器
    else {}          				//将要实现标签选择器
}
```

## 回忆杀：JS原生选择器
我们回忆一下，在原生的JS代码中，是怎么实现以上三种选择器的
```
//class选择器
document.getElementsByClassName('d1');

//id
document.getElementById('d1');

//标签
document.getElementsByTagName('div');
```

或者在一个新的选择器：
```
//class选择器
document.querySelectorAll('.d1')

//id
document.querySelectorAll('#d1')

//标签
document.querySelectorAll('div')

```

有的人看到这可能已经懵了：这个querySelectorAll怎么跟JQ那么像？
实际上，就是因为JQ的选择器太好用，反而迫使了原生的JS拓展了这个方法。
那我们这里呢，就不用这个了，太BUG了，写起来也没意思，学不到什么，所以我们用原生的getElement...方法来实现。
## 第一步：砍头
既然我们使用getElement...的话，那么一定要注意这个问题：
```
$('.d1')    => selector='.d1'
//对应
document.getElementsByClassName('d1');
```

明显能注意到，原生JS中，class选择器也是没有"**.**"的，所以我们要把selector的头砍掉。
实现一个removeStringFirst方法。
茴字有很多种写法，我这里也给出两种方法参考，第一种尽量使用js原生的方法实现，第二种完全靠自己逻辑实现。
```
var removeStringFirst = function(str){
	var charArr = str.split('');
    charArr.shift();
	return charArr.join('');
}

removeStringFirst('.d1') => "d1"
```
看起来不错吧？但是对于新手来说会很懵，所以我们简单解析一下。
>字符串的：split([char])方法：以传入的char为间隔，分割字符串为数组
```
("asd,efg").split(',')   =>   ["asd","efg"]
("abc").split('')  => ["a","b","c"]
```

在removeStringFirst函数中经过这一步操作后，charArr 类型为数组，所以可以接着调用数组类型的方法。
>数组的：shift()方法：把数组第一项删除并返回，此操作会改变原数组
```
charArr = ["a","b","c"];
charArr.shift()  => return "a";
charArr = ["b","c"];
```

这一步把头砍掉了，接下来比较简单，把数组再拼接回字符串就可以！
>数组的：join([char])方法：把数组拼接为字符串，以传入的char作为连接
```
charArr = ["a","b","c"];
charArr.join(';')   =>  "a;b;c"
cahrArr.join('')    =>  "abc"
```

所以经过这一系列过程，我们成功把头砍掉了～
这个过程中，removeStringFirst的参数str的变化是这样的：
```
".d1"
--split('')-->  [".","d","1"]
--shift()-->    ["d","1"]
--join('')-->   "d1"
```

这是第一个方法，接下来我们要实现第二个：
```
var removeStringFirst2 = function(str){
	var newStr = "";
    for(var i = 0 ; i < str.length ; i++){
    	if(i == 0) continue;
        newStr += str[i];
    }
	return newStr;
}
```
这个简单粗暴的嘛，就不谈了，自己看看。

## 继续！
我们实现了砍头函数之后，只需要把这个函数放在init函数里，做一个私有方法就可以了。所以现在整体的结构是这样的：
在这里我添加了一个对象的属性：this.dom，用于存放我们选择到的元素。
```
var init = function(selector){
	var removeStringFirst = function(str){
		var charArr = str.split('');
    	charArr.shift();
		return charArr.join('');
	}
    
    this.dom = null;
    
	var firstChar = selector[0];    //获取首字符
    if(firstChar == '.'){}          //将要实现class选择器
    else if(firstChar == '#'){}     //将要实现id选择器
    else {}          				//将要实现标签选择器
}
var $ = function(selector){
	return new init(selector);
}
```

接下来呢，九转十八弯之后，终于开始实现我们的选择器了：
从class选择器开始
```
if(firstChar == '.'){
	selector = removeStringFirst(selector);
    this.dom = document.getElementsByClassName(selector);
    console.log(this.dom);
}

```
当当，实现了。
接下来你可以这么尝试：
```
html:
	<div class="d1"></div>
    <p class="d1"></p>
    
js:
	$('.d1')
    
控制台：
	HTMLCollection[
    	0: div.d1,
        1: p.d1,
        __proto__ : Object
    ]
```

完美！到现在我们就把选择器给实现了，但是别忘了，还有id和标签呢。
id选择器
```
else if(firstChar == '#'){
	selector = removeStringFirst(selector);
    this.dom = document.getElementById(selector);
    console.log(this.dom);
}

```
标签选择器
**注意，标签选择器是不需要切头的**
```
else {
	this.dom = document.getElementsByTagName(selector);
    console.log(this.dom);
}
```
这样，就把选择器给实现了！
## 完整代码展示：
```
var init = function(selector){
	var removeStringFirst = function(str){
		var charArr = str.split('');
    	charArr.shift();
		return charArr.join('');
	}
    
    this.dom = null;                //存放选择到的元素
    
	var firstChar = selector[0];    //获取首字符
    if(firstChar == '.'){           //实现class选择器
    	selector = removeStringFirst(selector);
    	this.dom = document.getElementsByClassName(selector);
    	console.log(this.dom);
    }
    else if(firstChar == '#'){       //实现id选择器
    	selector = removeStringFirst(selector);
    	this.dom = document.getElementById(selector);
    	console.log(this.dom);
    }
    else {                           //实现标签选择器
        this.dom = document.getElementsByTagName(selector);
        console.log(this.dom);
    }
}
var $ = function(selector){
	return new init(selector);
}
```

## 效果展示：
```
html:
	<div class="d1"></div>
    <p class="d1"></p>
    <img id="logo">


1、class选择器
js:
	$('.d1')  => init{dom:HTMLCollection[]}
    
控制台：
	HTMLCollection[
    	0: div.d1,
        1: p.d1,
        __proto__ : Object
    ]




2、id选择器
js:
	$('#logo')  => init{dom:img#logo}
控制台：
	HTMLImgElement{}




3、标签选择器
js:
	$('div')  => init{dom:HTMLCollection[]}

控制台：
	HTMLCollection[
    	0: div.d1,
        __proto__ : Object
    ]
```
## 还需改进
本课中基本实现了一个JQ的选择器，但是也只是入门的水平，或许大家也发现了，要实现一个框架或者说类库，是需要全面的知识和扎实的基础的，即使洋洋洒洒写了500余行的第一课，我们的选择器仍然没有完美地实现，一方面是照顾初学者的水平，一方面是尽力把问题讲清楚了。
回到课程中，这个选择器还有一个问题，就是选择器返回的结果是不一致的，注意到了吗？
在class和标签选择器中，返回的是一个类数组结构：HTMLCollection，这是JS的一个类型，与数组相似：
1. 具有数组一样的下标
2. 具有length属性

但是也有很多不相似的地方：
1. 这并不是数组，携带的方法是比较少的，例如数组的forEach方法和shift方法等

我们再看id的返回值，为一个对象，且不说别的，如果我们将来要对这个this.dom进行一些操作，那么就要很麻烦地判断类型和属性，比如：
```
html:
    <div class="d1" id="d1"></div>

js:
   var d1 = document.getElemetsByClassName('d1');
   错误：d1.style.color = "red";
   //报错，因为此时d1是HTMLCollection类型，而style属性是HTMLElemtn对象下的。
   正确：d1[0].style.color = "red";
   //正确，使用下标访问唯一一项，这一项为HTMLDivElement对象，继承了全部HTMLElement对象的方法
   var dd1 = document.getElementById('d1');
   dd1.style.color = "black";
   //正确，因为id选择器返回的是HTMLDivElement对象，带有style属性。
```

作为一篇的结束，以上的内容并不是在继续探讨JS这门语言的内容，而是一个简单的提示。
1. 如果你读不懂以上的全部内容，那么你可能需要更多的练习。
2. 如果你不知道对象的内容，那么应当回去复习一下，当然我也会尝试写一些基础的文章。
3. 如果你不知道HTMLElement等原生对象，那么问题不大，因为本文的目的就是在实现JQ的主题上去深度学习JS的内容，包括原生对象、原型、继承、封装、多态等等。

好了，学习完毕之后，就开始下一章的学习吧！
























